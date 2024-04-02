const {
    DeliveryPlan,
    Solution,
    Journey,
    ProblemAssumption,
    VehicleSchedule,
    EmployeeWorkingSchedule,
} = require('../../../models');

const {
    connect
} = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

const START_WORKING_TIME = "08:00:00";
const END_WORKING_TIME = "20:30:00";
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
// Tạo mới 1 kế hoạch giao hàng
exports.createDeliveryPlan = async (portal, data) => {
    const { solution, problemAssumption, code } = data;
    const journeys = solution?.journeys;
    let newJourneyIds = [];
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
                            orderId: order.dxCode,
                            status: 2,
                            estimateTimeService: `${problemAssumption.estimatedDeliveryDate} ${secondsToHHMMSS(timeline[index + 1].startTime)}`,
                            weight: order.weight,
                            volume: order.capacity,
                            orderValue: order.orderValue
                        })
                    })
                }
            });

            // Lọc ra shipper phụ trách journey
            let shippers = journey.vehicle.driverCode;

            // Lưu thông tin 1 chuyến xe (journey)
            let newJourney = await Journey(connect(DB_CONNECTION, portal)).create({
                data: journey,
                orders: ordersInsert,
                totalOrder: ordersInsert.length,
                status: 1,
                shippers: shippers,
                code: "JN_" + index + "_" + code,
                estimatedDeliveryDate: problemAssumption.estimatedDeliveryDate ? problemAssumption.estimatedDeliveryDate : "",
                depotsTravel: depotTravel
            })
            newJourneyIds.push(newJourney._id)

            // Lưu thông tin lịch làm việc của xe
            let vehicleId = journey.vehicle.dxCode;
            let filterVehicleSchedule = { vehicle: vehicleId, date: problemAssumption.estimatedDeliveryDate }
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
                date: problemAssumption.estimatedDeliveryDate,
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
            let newVehicleSchedule = await VehicleSchedule(connect(DB_CONNECTION, portal)).findOneAndUpdate(filterVehicleSchedule, updateVehicleSchedule, {
                new: true,
                upsert: true
            })

            // Lưu thông tin lịch làm việc của shipper
            let driverIds = journey.vehicle.driverCode;
            if (driverIds[0]) {
                let filterShipperSchedule = { employee: driverIds[0], date: problemAssumption.estimatedDeliveryDate }
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
                    employee: driverIds[0],
                    date: problemAssumption.estimatedDeliveryDate,
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
                let newShipperSchedule1 = await EmployeeWorkingSchedule(connect(DB_CONNECTION, portal)).findOneAndUpdate(filterShipperSchedule, updateShipperSchedule, {
                    new: true,
                    upsert: true
                })
            }
            if (driverIds[1]) {
                let filterShipperSchedule = { employee: driverIds[1], date: problemAssumption.estimatedDeliveryDate }
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
                    employee: driverIds[1],
                    date: problemAssumption.estimatedDeliveryDate,
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
                let newShipperSchedule2 = await EmployeeWorkingSchedule(connect(DB_CONNECTION, portal)).findOneAndUpdate(filterShipperSchedule, updateShipperSchedule, {
                    new: true,
                    upsert: true
                })
            }
        }
    }
    let newSolution;
    if (newJourneyIds && newJourneyIds.length !== 0) {
        newSolution = await Solution(connect(DB_CONNECTION, portal)).create({
            totalCost: solution.totalCost ? solution.totalCost : null,
            totalDistance: solution.totalDistance ? solution.totalDistance : null,
            totalAmount: solution.totalAmount ? solution.totalAmount : null,
            revenue: solution.revenue ? solution.revenue : null,
            efficiency: solution.efficiency ? solution.efficiency : null,
            numberVehicle: solution.numberVehicle ? solution.numberVehicle : null,
            totalTravelTime: solution.totalTravelTime ? solution.totalTravelTime : null,
            totalFixedCost: solution.totalFixedCost ? solution.totalFixedCost : null,
        })
    }
    let newProblemAssumption;
    if (problemAssumption) {
        newProblemAssumption = await ProblemAssumption(connect(DB_CONNECTION, portal)).create({
            data: problemAssumption
        })
    }
    let newDeliveryPlan;
    if (newSolution && newProblemAssumption && newJourneyIds) {
        newDeliveryPlan = await DeliveryPlan(connect(DB_CONNECTION, portal)).create({
            solution: {
                solution: newSolution._id,
                journeys: newJourneyIds,
            },
            problemAssumption: newProblemAssumption._id,
            code: code ? code : "",
            estimatedDeliveryDate: problemAssumption.estimatedDeliveryDate ? problemAssumption.estimatedDeliveryDate : "",
        });
    }

    let deliveryPlan = await DeliveryPlan(connect(DB_CONNECTION, portal)).findById({ _id: newDeliveryPlan._id });;
    return deliveryPlan;
}

// Lấy ra tất cả các thông tin kế hoạch giao hàng
exports.getDeliveryPlans = async (portal, data) => {
    let keySearch = {};
    if (data?.deliveryPlanId?.length > 0) {
        keySearch = {
            deliveryPlanId: {
                $regex: data.deliveryPlanId,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await DeliveryPlan(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let deliveryPlans = await DeliveryPlan(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate([
            { path: "problemAssumption", select: 'data'},
            { path: "solution.solution", select: 'totalCost totalNumberOrders totalAmount revenue efficiency numberVehicle totalDistance totalTravelTime totalFixedCost'},
            { path: "solution.journeys", select: 'data'}
        ])
        .skip((page - 1) * perPage)
        .limit(perPage);

    deliveryPlans = deliveryPlans.map((deliveryPlan) => {
        let formatJourneys = deliveryPlan.solution.journeys.map((journey) => journey.data);
        let formatSolution = {
            totalCost: deliveryPlan.solution.solution.totalCost,
            totalDistance: deliveryPlan.solution.solution.totalDistance,
            totalAmount: deliveryPlan.solution.solution.totalAmount,
            revenue: deliveryPlan.solution.solution.revenue,
            efficiency: deliveryPlan.solution.solution.efficiency,
            numberVehicle: deliveryPlan.solution.solution.numberVehicle,
            totalTravelTime: deliveryPlan.solution.solution.totalTravelTime,
            totalFixedCost: deliveryPlan.solution.solution.totalFixedCost,
            journeys: formatJourneys
        }
        return {
            _id: deliveryPlan._id,
            name: deliveryPlan.name,
            estimatedDeliveryDate: deliveryPlan.estimatedDeliveryDate,
            problemAssumption: deliveryPlan.problemAssumption.data,
            solution: formatSolution
        }
    })
    return {
        data: deliveryPlans,
        totalList
    }
}

// Lấy ra một phần thông tin Ví dụ (lấy ra deliveryPlanName) theo mô hình dữ liệu số  2
exports.getOnlyDeliveryPlanName = async (portal, data) => {
    let keySearch;
    if (data?.deliveryPlanName?.length > 0) {
        keySearch = {
            deliveryPlanName: {
                $regex: data.deliveryPlanName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await DeliveryPlan(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let DeliveryPlanCollection = await DeliveryPlan(connect(DB_CONNECTION, portal)).find(keySearch, { deliveryPlanName: 1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        data: DeliveryPlanCollection,
        totalList
    }
}

// Lấy ra Ví dụ theo id
exports.getDeliveryPlanById = async (portal, id) => {
    let deliveryPlan = await DeliveryPlan(connect(DB_CONNECTION, portal)).findById({ _id: id });
    if (deliveryPlan) {
        return deliveryPlan;
    }
    return -1;
}

// Chỉnh sửa một Ví dụ
exports.editDeliveryPlan = async (portal, id, data) => {
    let oldDeliveryPlan = await DeliveryPlan(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldDeliveryPlan) {
        return -1;
    }

    // Cach 2 de update
    await DeliveryPlan(connect(DB_CONNECTION, portal)).update({ _id: id }, { $set: data });
    let deliveryPlan = await DeliveryPlan(connect(DB_CONNECTION, portal)).findById({ _id: oldDeliveryPlan._id });

    return deliveryPlan;
}

// Xóa một Ví dụ
exports.deleteDeliveryPlans = async (portal, deliveryPlanIds) => {
    let deliveryPlans = await DeliveryPlan(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: deliveryPlanIds.map(item => mongoose.Types.ObjectId(item)) } });

    return deliveryPlans;
}

// get all journey of all delivery
exports.getAllJourneys = async (portal, data) => {
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
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Journey(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let journeys = await Journey(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        data: journeys,
        totalList
    }
}