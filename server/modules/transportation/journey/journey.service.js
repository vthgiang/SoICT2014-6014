const {
    Journey,
    ProductRequestManagement,
    VehicleSchedule,
    EmployeeWorkingSchedule,
    Driver
} = require('../../../models');
const NotificationServices =  require('../../notification/notification.service')
const {
    connect
} = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');
const ProductRequestManagementService = require("../../production/common-production/product-request-management/productRequestManagement.service")
const VehicleService = require("../vehicle/vehicle.service")
const DriverService = require("../manage-shipper/manageShipper.service")

const START_WORKING_TIME = "07:30:00";
const END_WORKING_TIME = "22:00:00";

function getArrayTimeFromString(stringDate) {
    arrayDate = stringDate.split('-');
    let year = arrayDate[2];
    let month = arrayDate[1];
    let day = arrayDate[0];
    const date = new Date(year, month - 1, day);
    const moment = require('moment');

    // start day of createdAt
    var start = moment(date).startOf('day');
    // end day of createdAt
    var end = moment(date).endOf('day');

    return [start, end];
}

const convertIntToString = (number) => {
    return number < 10 ? ("0" + number) : number;
}
const secondsToHHMMSS = (ms) => {
    if (ms) {
        var seconds = ms;
        var hours = parseInt(seconds / 3600);
        seconds = seconds % 3600;
        var minutes = parseInt(seconds / 60);
        seconds = seconds % 60;
        let humanized = convertIntToString(hours) + ":" + convertIntToString(minutes) + ":" + convertIntToString(seconds);
        return humanized;
    } else {
        return null
    }
}

const updateRealTimeDeliveryProgress = (userReceive, data) => {
    const arr = CONNECTED_CLIENTS.filter(
        (client) => JSON.stringify(client.userId) == JSON.stringify(userReceive)
    );
    console.log("helleo fhaoh", arr[0]);
    if (arr.length === 1)
        SOCKET_IO.to(arr[0].socketId).emit("delivery progress", data);
}

const updateRealTimeRequestStatusDashBoard = (userReceive, data) => {
    const arr = CONNECTED_CLIENTS.filter(
        (client) => JSON.stringify(client.userId) == JSON.stringify(userReceive)
    );
    console.log("helleo fhaoh", arr[0]);
    if (arr.length === 1)
        SOCKET_IO.to(arr[0].socketId).emit("request status dashboard", data);
}

const updateRealTimeDriversStatusDashBoard = (userReceive, data) => {
    const arr = CONNECTED_CLIENTS.filter(
        (client) => JSON.stringify(client.userId) == JSON.stringify(userReceive)
    );
    console.log("helleo fhaoh", arr[0]);
    if (arr.length === 1)
        SOCKET_IO.to(arr[0].socketId).emit("drivers status dashboard", data);
}

const updateRealTimeVehiclesStatusDashBoard = (userReceive, data) => {
    const arr = CONNECTED_CLIENTS.filter(
        (client) => JSON.stringify(client.userId) == JSON.stringify(userReceive)
    );
    console.log("helleo fhaoh", arr[0]);
    if (arr.length === 1)
        SOCKET_IO.to(arr[0].socketId).emit("vehicles status dashboard", data);
}

exports.createJourney = async (portal, data) => {
    const { solution, problemAssumption, code, creatorId } = data;
    const journeys = solution?.journeys;
    let newJourneys = [];
    if (journeys && journeys.length !== 0) {
        for (let index = 0; index < journeys.length; index++) {
            let ordersInsert = [];
            let depotTravelCode = [];
            let depotTravel = [];
            const journey = journeys[index];
            const routes = journey.routes;
            if (routes) routes.forEach(route => {
                let timeline = route.timeline;
                // Lọc ra các kho mà xe đi qua
                if (!depotTravelCode.includes(route.startDepot.dxCode)) {
                    depotTravelCode.push(route.startDepot.dxCode);
                    depotTravel.push(route.startDepot)
                }
                if (!depotTravelCode.includes(route.endDepot.dxCode)) {
                    depotTravelCode.push(route.endDepot.dxCode);
                    depotTravel.push(route.endDepot)
                }
                // Lọc ra thời gian phục vụ dự kiến cho đơn hàng và 1 số thông số của đơn hàng
                if (timeline.length > 0)  {
                    route?.orders.forEach((order, index) => {
                        ordersInsert.push({
                            order: order.dxCode,
                            status: 2,
                            estimateTimeService: `${problemAssumption.estimatedDeliveryDate.split("-").reverse().join("-")} ${secondsToHHMMSS(timeline[index + 1].startTime)}`,
                            weight: order.weight,
                            volume: order.capacity,
                            orderValue: order.orderValue,
                            customerName: order.customer.name,
                            destinationPlace: order.customer.address
                        })
                    })
                }
            });

            // Lọc ra shipper phụ trách journey
            let shippers = journey.vehicle.driverCode;

            // Lưu thông tin 1 chuyến xe (journey)
            let newJourney = await Journey(connect(DB_CONNECTION, portal)).create({
                creator: creatorId,
                data: journey,
                orders: ordersInsert,
                totalOrder: ordersInsert.length,
                status: 1,
                shippers: shippers,
                code: "JN_" + index + "_" + code,
                estimatedDeliveryDate: problemAssumption.estimatedDeliveryDate ? problemAssumption.estimatedDeliveryDate.split("-").reverse().join("-") : "",
                depotsTravel: depotTravel,
                vehicleName: journey?.vehicle?.name
            })
            newJourneys.push(newJourney)

            // Thay đổi trạng thái yêu cầu vận chuyển sau khi lập lịch thành công

            if (newJourney) {
                // Lọc ra danh sách yêu cầu vận chuyển trong journey
                let orderIds = journey.orders.map((order) => order.dxCode);
                await ProductRequestManagement(connect(DB_CONNECTION, portal)).updateMany({ '_id': { $in: orderIds } }, { status: 3 })
            }

            // Lưu thông tin lịch làm việc của xe
            let vehicleId = journey.vehicle.dxCode;
            let filterVehicleSchedule = { vehicle: vehicleId, date: problemAssumption.estimatedDeliveryDate.split("-").reverse().join("-") }
            let existVehicleSchedule = await VehicleSchedule(connect(DB_CONNECTION, portal)).findOne(filterVehicleSchedule);
            let existTasks = existVehicleSchedule?.shift?.tasks;
            let newTasks = [];
            if (existTasks) newTasks = [ ...existTasks, {
                startWorkingTime: secondsToHHMMSS(journey.timeWindowJourney.startTime),
                endWorkingTime: secondsToHHMMSS(journey.timeWindowJourney.endTime),
                journey: newJourney._id
            }]
            let updateVehicleSchedule = {
                vehicle: vehicleId,
                date: new Date(problemAssumption.estimatedDeliveryDate.split("-").reverse().join("-")),
                shift: {
                    startWorkingTime: START_WORKING_TIME,
                    endWorkingTime: END_WORKING_TIME,
                    tasks: existTasks ? newTasks : [{
                        startWorkingTime: secondsToHHMMSS(journey.timeWindowJourney.startTime),
                        endWorkingTime: secondsToHHMMSS(journey.timeWindowJourney.endTime),
                        journey: newJourney._id
                    }]
                }
            }
            await VehicleSchedule(connect(DB_CONNECTION, portal)).findOneAndUpdate(filterVehicleSchedule, updateVehicleSchedule, {
                new: true,
                upsert: true
            })

            // Lưu thông tin lịch làm việc của shipper
            let driverIds = journey.vehicle.driverCode;
            if (driverIds.length > 0) {
                for (let index = 0; index < driverIds.length; index++) {
                    let filterShipperSchedule = { employee: driverIds[index], date: problemAssumption.estimatedDeliveryDate.split("-").reverse().join("-") }
                    let existShipperSchedule = await EmployeeWorkingSchedule(connect(DB_CONNECTION, portal)).findOne(filterShipperSchedule);
                    let existTasks = existShipperSchedule?.shift?.tasks;
                    let newTasks = [];
                    if (existTasks) newTasks = [ ...existTasks, {
                        startWorkingTime: secondsToHHMMSS(journey.timeWindowJourney.startTime),
                        endWorkingTime: secondsToHHMMSS(journey.timeWindowJourney.endTime),
                        journey: newJourney._id,
                        type: 1
                    }]
                    let updateShipperSchedule = {
                        employee: driverIds[index],
                        date: problemAssumption.estimatedDeliveryDate.split("-").reverse().join("-"),
                        shift: {
                            startWorkingTime: START_WORKING_TIME,
                            endWorkingTime: END_WORKING_TIME,
                            tasks: existTasks ? newTasks : [{
                                startWorkingTime: secondsToHHMMSS(journey.timeWindowJourney.startTime),
                                endWorkingTime: secondsToHHMMSS(journey.timeWindowJourney.endTime),
                                journey: newJourney._id,
                                type: 1
                            }]
                        }
                    }
                    // Lưu thông tin vào bảng EmployeeWorkingSchedule
                    let employeeWorkingSchedule = await EmployeeWorkingSchedule(connect(DB_CONNECTION, portal)).findOneAndUpdate(filterShipperSchedule, updateShipperSchedule, {
                        new: true,
                        upsert: true
                    })
                    // Lưu thông tin vào bảng Driver để tiện truy vấn
                    let searchingDriver = {
                        driver: employeeWorkingSchedule.employee,
                    }
                    let oldDriver = await Driver(connect(DB_CONNECTION, portal)).findOne(searchingDriver)
                        .populate([
                            {path: "workingSchedules"}
                        ]);
                    let isExistSchedule = [];
                    let isDriverHasSchedules = [];
                    isDriverHasSchedules = oldDriver?.workingSchedules;
                    if (isDriverHasSchedules) {
                        isExistSchedule = oldDriver?.workingSchedules.filter(oldSchedule => JSON.stringify(oldSchedule.workingSchedule) == JSON.stringify(employeeWorkingSchedule._id))
                    }
                    console.log("check dieu kien", isDriverHasSchedules, isExistSchedule);
                    if (isExistSchedule.length == 0 || isDriverHasSchedules.length == 0) {
                        console.log("bawt sdau luu roi!!!!");
                        let oldDriverSchedules = oldDriver?.workingSchedules;
                        let updateScheduleToDriverTable = [];
                        if (oldDriverSchedules) {
                            updateScheduleToDriverTable = [
                                ...oldDriverSchedules,
                                { workingSchedule: employeeWorkingSchedule._id, date: employeeWorkingSchedule.date }
                            ]
                        } else {
                            updateScheduleToDriverTable = [
                                { workingSchedule: employeeWorkingSchedule._id, date: employeeWorkingSchedule.date }
                            ]
                        }
                        let newDriver = await Driver(connect(DB_CONNECTION, portal)).findOneAndUpdate({ driver: employeeWorkingSchedule.employee },
                            { workingSchedules: updateScheduleToDriverTable },
                            { new: true, upsert: true });
                        console.log(newDriver.workingSchedules);
                    }
                }
            }
        }
    }

    return newJourneys;
}

// get all journey of all delivery
exports.getJourneys = async (portal, data) => {
    let keySearch = {};
    if (data?.journeyId?.length > 0) {
        keySearch = {
            journeyId: {
                $regex: data.journeyId,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 100;

    let totalList = await Journey(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let journeys = await Journey(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate([
            { path: 'shippers', select: 'fullName' }
        ])
        .skip((page - 1) * perPage)
        .limit(perPage);
    return {
        data: journeys,
        totalList
    }
}
// Tính toán chi phí tổng cho các journey
exports.getJourneysWithCost = async (portal, data) => {
    let keySearch = {};
    let costPerDay, totalCost;
    if (data?.journeyId?.length > 0) {
        keySearch = {
            journeyId: {
                $regex: data.journeyId,
                $options: "i"
            }
        }
    }

    costPerDay = await Journey(connect(DB_CONNECTION, portal))
        .aggregate([
            {$group : {_id:"$estimatedDeliveryDate", vehicle:{$sum:"$data.totalCost"}, shipper:{$sum: "$data.totalDriverSalary"} }}
        ])

    totalCost = await Journey(connect(DB_CONNECTION, portal))
        .aggregate([
            {$group : { _id: null, vehicleCost:{$sum:"$data.totalCost"}, shipperCost:{$sum:"$data.totalDriverSalary"}, revenue:{$sum:"$data.revenue"} }}
        ])
    return {
        costPerDay: costPerDay,
        totalCost: totalCost
    }
}

// get journey by condition
exports.getJourneyByCondition = async (portal, data) => {
    let keySearch = {};
    if (data?.journeyCode) {
        keySearch.code = data.journeyCode
    }
    if (data?.date) {
        keySearch.estimatedDeliveryDate = new Date(data.date);
    }
    if (data.status) {
        keySearch.status = data.status;
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Journey(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let journeys = await Journey(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate([
            { path: 'shippers', select: 'fullName' },
            { path: "orders.order"}
        ])
        .skip((page - 1) * perPage)
        .limit(perPage);
    return {
        data: journeys,
        totalList
    }
}

// Thay đổi tài xế phụ trách xe
exports.changeDrivers = async (portal, id, data) => {
    let journey = null, updateData = {};
    if (data.changedDrivers) {
        updateData.shippers = data.changedDrivers;
        journey = await Journey(connect(DB_CONNECTION, portal)).findOneAndUpdate({ _id: id}, updateData, {
            new: true
        });
    }
    if (!journey) {
        throw Error("Journey's id to change drivers is wrong!!");
    } else {
        // Xoá và thêm lịch làm việc tương tứng với shipper mới gán
        if (data.oldDrivers) {
            for (index = 0; index < data.oldDrivers.length; index++) {
                const filterShipper = { "date": journey.estimatedDeliveryDate, "employee": data.oldDrivers[index]};
                let tasksShipper = await EmployeeWorkingSchedule(connect(DB_CONNECTION, portal))
                                            .findOne(filterShipper)
                                            .select("shift");
                if (tasksShipper) {
                    let updateTaskShipper = tasksShipper.shift.tasks.filter((task) => JSON.stringify(task.journey) != JSON.stringify(journey._id))
                    let updateShipperSchedule = {
                        ...tasksShipper.shift,
                        tasks: updateTaskShipper,
                    }
                    await EmployeeWorkingSchedule(connect(DB_CONNECTION, portal)).updateMany({ "date": journey.estimatedDeliveryDate, "employee": data.oldDrivers[index] }, { "$set": {"shift" : updateShipperSchedule} })
                }
            }
        }
        // Lưu lịch làm việc mới của shipper
        let driverIds = journey.shippers;
        if (driverIds.length > 0) {
            for (let index = 0; index < driverIds.length; index++) {
                let filterShipperSchedule = { employee: driverIds[index], date: journey.estimatedDeliveryDate }
                let existShipperSchedule = await EmployeeWorkingSchedule(connect(DB_CONNECTION, portal)).findOne(filterShipperSchedule);
                let existTasks = existShipperSchedule?.shift?.tasks;
                let newTasks = [];
                if (existTasks) newTasks = [ ...existTasks, {
                    startWorkingTime: secondsToHHMMSS(journey.data.timeWindowJourney.startTime),
                    endWorkingTime: secondsToHHMMSS(journey.data.timeWindowJourney.endTime),
                    journey: journey._id,
                    type: 1
                }]
                let updateShipperSchedule = {
                    employee: driverIds[index],
                    date: journey.estimatedDeliveryDate,
                    shift: {
                        startWorkingTime: START_WORKING_TIME,
                        endWorkingTime: END_WORKING_TIME,
                        tasks: existTasks ? newTasks : [{
                            startWorkingTime: secondsToHHMMSS(journey.data.timeWindowJourney.startTime),
                            endWorkingTime: secondsToHHMMSS(journey.data.timeWindowJourney.endTime),
                            journey: journey._id,
                            type: 1
                        }]
                    }
                }
                await EmployeeWorkingSchedule(connect(DB_CONNECTION, portal)).findOneAndUpdate(filterShipperSchedule, updateShipperSchedule, {
                    new: true,
                    upsert: true
                })
            }
        }
    }

    return journey;
}

// Cập nhật dữ liệu journey
exports.updateJourney = async (portal, id, data, user) => {
    let updateData = {};
    let content  = "", description = "";
    if (data.status) {
        updateData.status = data.status;
        if (data.status == 2) {
            content = "đã bắt đầu thực hiện lộ trình";
            description = "Đã bắt đầu thực hiện lộ trình";
            let currentJourney = await Journey(connect(DB_CONNECTION, portal)).findOne({_id: id});
            let updateStatusOrderId = currentJourney.orders.map((order) => order.order);
            let updateRequest = await ProductRequestManagementService.autoUpdateTransportRequest(updateStatusOrderId, {requestStatus: 3, requestType: 4}, portal);

            // Cập nhật realtime trạng thái đơn hàng ở dashboard
            updateRealTimeRequestStatusDashBoard(currentJourney.creator, updateRequest);

            //Cập nhật trạng thái người và xe là đang làm việc
            let vehicleId = currentJourney.data.vehicle.dxCode;
            let driverIds = currentJourney.data.vehicle.driverCode;
            updateRealTimeDriversStatusDashBoard(currentJourney.creator, {driverIds: driverIds, status: 2});
            if (driverIds) {
                for (let index = 0; index < driverIds.length; index++) {
                    await DriverService.updateStatusByEmployeeId(driverIds[index], {status : 2}, portal);
                }
            }

            await VehicleService.editVehicle(portal, vehicleId, {status: 1});
            updateRealTimeVehiclesStatusDashBoard(currentJourney.creator, {vehicleId: vehicleId, status: 1});
        }
        if (data.status == 3) {
            content = "đã hoàn tất thực hiện lộ trình";
            description = "Đã hoàn tất thực hiện lộ trình";
            let currentJourney = await Journey(connect(DB_CONNECTION, portal)).findOne({_id: id});
            //Cập nhật trạng thái người và xe thành rảnh
            let vehicleId = currentJourney.data.vehicle.dxCode;
            let driverIds = currentJourney.data.vehicle.driverCode;
            updateRealTimeDriversStatusDashBoard(currentJourney.creator, {driverIds: driverIds, status: 1});
            if (driverIds) {
                for (let index = 0; index < driverIds.length; index++) {
                    await DriverService.updateStatusByEmployeeId(driverIds[index], {status : 1}, portal);
                }
            }
            await VehicleService.editVehicle(portal, vehicleId, {status: 2});
            updateRealTimeVehiclesStatusDashBoard(currentJourney.creator, {vehicleId: vehicleId, status: 2});
        }
    }
    if (data.successOrderId) {
        let currentJourney = await Journey(connect(DB_CONNECTION, portal)).findOne({_id: id});
        let currentOrders = currentJourney.orders;
        currentOrders.forEach((order, index, originOrders) => {
            if (JSON.stringify(order.order) == JSON.stringify(data.successOrderId)) {
                originOrders[index].status = 1;
                originOrders[index].timeService = new Date();
            }
        })
        updateData.orders = currentOrders;
        //Cập nhật perfect order in journey
        currentJourney.perfectDeliveryOrders = currentJourney.perfectDeliveryOrders ? (currentJourney.perfectDeliveryOrders + 1) : 1;
        currentJourney.save();
        let updateRequest = await ProductRequestManagementService.autoUpdateTransportRequest(data.successOrderId, {requestStatus: 4, requestType: 4}, portal);

        // Cập nhật realtime trạng thái đơn hàng ở dashboard
        updateRealTimeRequestStatusDashBoard(currentJourney.creator, updateRequest);
    }

    if (data.failureOrderId) {
        let currentJourney = await Journey(connect(DB_CONNECTION, portal)).findOne({_id: id});
        let currentOrders = currentJourney.orders;
        currentOrders.forEach((order, index, originOrders) => {
            if (JSON.stringify(order.order) == JSON.stringify(data.failureOrderId)) {
                originOrders[index].status = 3;
                originOrders[index].timeService = new Date();
            }
        })
        updateData.orders = currentOrders;
        let updateRequest = await ProductRequestManagementService.autoUpdateTransportRequest(data.failureOrderId, {requestStatus: 5, requestType: 4}, portal);

        // Cập nhật realtime trạng thái đơn hàng ở dashboard
        updateRealTimeRequestStatusDashBoard(currentJourney.creator, updateRequest);
    }

    let journey = await Journey(connect(DB_CONNECTION, portal)).findOneAndUpdate({ _id: id}, updateData, {
        new: true
    });
    let updateJourney = await Journey(connect(DB_CONNECTION, portal)).findOne({ _id: journey._id })
        .populate([
            { path: 'shippers', select: 'fullName' },
            { path: "orders.order"}
        ]);

    // Realtime update lại tình trạng thực hiện các đơn hàng trong journey
    updateRealTimeDeliveryProgress(journey.creator, updateJourney);

    // Gửi thông báo cho quản lý khi lộ trình giao hàng bắt đầu dược thực hiện hoặc đã hoàn thành
    if (data.status) {
        const associatedData = {
            dataType: "realtime_tasks",
            value: updateJourney,
        }
        let userReceive = [];
        userReceive.push(journey.creator)
        const dataNotification = {
        organizationalUnits: [],
        title: "Cập nhật trạng thái lộ trình",
        level: "general",
        content: `<p>Tài xế <strong>${user.name}</strong> ${content}: <a href="${process.env.WEBSITE}/transportation-list-journey">${updateJourney.code}</a></p>`,
        sender: `${user.name}`,
        users: userReceive,
        associatedData: associatedData,
        associatedDataObject: {
            dataType: 1,
            description: `<p>${description} ${journey.code}</p>`
        }
        };

        if (userReceive && userReceive.length > 0)
        NotificationServices.createNotification(portal, portal, dataNotification)
    }

    return updateJourney;
}

exports.deleteJourney = async (portal, journeyId) => {
    let journey = await Journey(connect(DB_CONNECTION, portal))
        .findOne({ _id: journeyId });
    // Xoá lịch làm việc của shipper liên quan
    let journeyShippers = journey.shippers;
    if (journeyShippers) {
        for (index = 0; index < journeyShippers.length; index++) {
            const filterShipper = { "date": journey.estimatedDeliveryDate, "employee": journeyShippers[index]};
            let tasksShipper = await EmployeeWorkingSchedule(connect(DB_CONNECTION, portal))
                                        .findOne(filterShipper)
                                        .select("shift");
            if (tasksShipper) {
                let updateTaskShipper = tasksShipper.shift.tasks.filter((task) => JSON.stringify(task.journey) != JSON.stringify(journeyId))
                let updateShipperSchedule = {
                    ...tasksShipper.shift,
                    tasks: updateTaskShipper,
                }
                await EmployeeWorkingSchedule(connect(DB_CONNECTION, portal)).updateMany({ "date": journey.estimatedDeliveryDate, "employee": journeyShippers[index] }, { "$set": {"shift" : updateShipperSchedule} })
            }
        }
    }
    // Xoá lịch làm việc của xe liên quan
    let vehicleId = journey.data.vehicle.dxCode;
    if (vehicleId) {
        const filterVehicle = { "date": journey.estimatedDeliveryDate, "vehicle": vehicleId};
        let tasksVehicle = await VehicleSchedule(connect(DB_CONNECTION, portal))
                                    .findOne(filterVehicle)
                                    .select("shift");
        if (tasksVehicle) {
            let updateTaskVehicle = tasksVehicle.shift.tasks.filter((task) => JSON.stringify(task.journey) != JSON.stringify(journeyId))
            let updateVehicleSchedule = {
                ...tasksVehicle.shift,
                tasks: updateTaskVehicle,
            }
            await VehicleSchedule(connect(DB_CONNECTION, portal)).updateMany({ "date": journey.estimatedDeliveryDate, "vehicle": vehicleId }, { "$set": {"shift" : updateVehicleSchedule} })
        }
    }
    // Đổi trạng thái của đơn hàng sang chưa lập lịch
    let orderIds = journey?.orders.map((order) => order.order);
    let filterRequest = { "_id": orderIds }
    await ProductRequestManagement(connect(DB_CONNECTION, portal)).updateMany(filterRequest, { "status" : 2});

    let journeyDeleted = await Journey(connect(DB_CONNECTION, portal))
        .deleteOne({ _id: journeyId });
    return journeyDeleted;
}