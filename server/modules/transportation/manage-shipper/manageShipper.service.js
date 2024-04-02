const { Driver, Employee, EmployeeWorkingSchedule, Vehicle, Journey, ShipperCost, ShipperSalary } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');
const userService = require('../../super-admin/user/user.service')
const moment = require('moment');
const AVERAGE_BONUS_PER_ORDER = 21000;

function getArrayTimeFromString(stringDate) {
    arrayDate = stringDate.split('-');
    let year = arrayDate[2];
    let month = arrayDate[1];
    let day = arrayDate[0];
    const date = new Date(year, month - 1, day);

    // start day of createdAt
    var start = moment(date).startOf('day');
    // end day of createdAt
    var end = moment(date).endOf('day');

    return [start, end];
}

function convertTimeStringToInt (time) {
    let intTime = 0;
    let hours = parseInt((time.split(":")[0]));
    let minutes = parseInt(time.split(":")[1]);
    let seconds = parseInt(time.split(":")[2]);

    return intTime = hours*3600 + minutes*60 + seconds;
}

function convertIntToString (number) {
    return number < 10 ? ("0" + number) : number;
}

function secondsToHHMMSS(ms) {
    var seconds = ms;
    var hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    var minutes = parseInt(seconds / 60);
    seconds = seconds % 60;
    let humanized = convertIntToString(hours) + ":" + convertIntToString(minutes) + ":" + convertIntToString(seconds);
    return humanized;
}

const isShipperHasLicenses = (arrayLicense, existLicenses) => {
    let check = 1;
    arrayLicense.forEach((license) => {
        if (!existLicenses.includes(license)) {
            check = 0;
        }
    })
    return check;
}

exports.createShipper = async (data, portal) => {
    let newDriver;
    if (data?.dataUser) {
        let employee = await Employee(connect(DB_CONNECTION, portal)).findOne({emailInCompany: data.dataUser.email});
        if (employee) {
            newDriver = await Driver(connect(DB_CONNECTION, portal)).create({
                driver: employee._id,
                user: data.dataUser._id,
                name: employee.fullName,
                status: 1
            });
        }
    }
    if (newDriver) {
        let driver = await Driver(connect(DB_CONNECTION, portal)).findOne({ driver: newDriver.driver })
            .populate([
                {path: 'driver', select: 'fullName'}
            ])
        return driver;
    } else {
        throw Error("request data is wrong format");
    }
}

exports.getAllShipperWithCondition = async (query, portal) => {
    let page, perPage;
    page = query?.page ? Number(query.page) : 1;
    perPage = query?.perPage ? Number(query.perPage) : 100;

    let filterShipper = {};
    if (query.name) filterShipper.name = query.name;
    let drivers = await Driver(connect(DB_CONNECTION, portal)).find(filterShipper)
        .populate([
            {path: 'driver', select: 'fullName'}
        ])
        .skip((page - 1) * perPage)
        .limit(perPage);
    let totalList = await Driver(connect(DB_CONNECTION, portal)).countDocuments(filterShipper);
    if (query.searchingLicenses) {
        drivers = drivers.filter((driver) => {
            if (isShipperHasLicenses(query.searchingLicenses, driver.drivingLicense)) return true;
            return false;
        });
    }
    return {
        data: drivers,
        totalList: totalList
    }
}

function findFreeShipperSchedule (timeWindowInDay, taskTimeWindows) {
    let startTimeWindowInDay = convertTimeStringToInt(timeWindowInDay.startTimeWindowInDay);
    let endTimeWindowInDay = convertTimeStringToInt(timeWindowInDay.endTimeWindowInDay);

    if (taskTimeWindows.length == 0)
        return [{ startTime: timeWindowInDay.startTimeWindowInDay, endTime: timeWindowInDay.endTimeWindowInDay }];
    let taskTimeWindowsConvert = taskTimeWindows.map((task) => {
        return {
            startTime: convertTimeStringToInt(task.startTime),
            endTime: convertTimeStringToInt(task.endTime)
        }
    })
    taskTimeWindowsConvert.sort((task1, task2) => {
        return task1.startTime - task2.startTime;
    })

    let freeTimeWindow = [];

    taskTimeWindowsConvert.forEach((taskTimeWindow, index, originalArray) => {
        let freeStartTime = 0, freeEndTime = 0;
        if (taskTimeWindow.startTime > startTimeWindowInDay) {
            freeStartTime = startTimeWindowInDay;
            freeEndTime = taskTimeWindow.startTime;
            startTimeWindowInDay = taskTimeWindow.endTime;
        } else {
            startTimeWindowInDay = taskTimeWindow.endTime;
            freeStartTime = taskTimeWindow.endTime;
            if (originalArray[index + 1]) {
                freeEndTime = originalArray[index + 1].startTime;
            } else freeEndTime = endTimeWindowInDay;
        }
        freeTimeWindow.push({
            startTime: secondsToHHMMSS(freeStartTime),
            endTime: secondsToHHMMSS(freeEndTime)
        })
    })
    if (startTimeWindowInDay < endTimeWindowInDay) {
        freeTimeWindow.push({
            startTime: secondsToHHMMSS(startTimeWindowInDay),
            endTime: secondsToHHMMSS(endTimeWindowInDay)
        })
    }

    return freeTimeWindow;
}

const findListVehicleCanDriveForShipper = async (shipperId, portal) => {
    let canDriveVehicles = [];

    let shipper = await Driver(connect(DB_CONNECTION, portal)).findOne({ driver: shipperId });
    if (!shipper) throw Error("Shipper id to find vehicle can drive is not valid");

    let vehicles = await Vehicle(connect(DB_CONNECTION, portal)).find({});

    if (vehicles.length > 0) {
        vehicles.forEach((vehicle) => {
            let check = 1;
            vehicle.requireLicense.forEach((license) => {
                if (!shipper.drivingLicense.includes(license)) check = 0;
            });
            if (check == 1) canDriveVehicles.push(vehicle);
        })
    }
    if (canDriveVehicles.length > 0) canDriveVehicles = canDriveVehicles.map((vehicle) => vehicle._id);

    return canDriveVehicles;
}

exports.getAllFreeShipperSchedule = async (query, portal) => {
    let { dateToSearch } = query;
    let option = {};
    if (dateToSearch) {
        option.date = {
            '$gte': getArrayTimeFromString(dateToSearch)[0],
            '$lte': getArrayTimeFromString(dateToSearch)[1]
        }
    }
    let ShipperScheduleCollection = await EmployeeWorkingSchedule(connect(DB_CONNECTION, portal))
        .find(option)
        .populate([
            {path: "employee", select: "fullName"}
        ])

    let ShipperCollection = await Driver(connect(DB_CONNECTION, portal))
        .find()
        .populate([
            {path: "driver", select: "fullName"}
        ]);

    let shipperSchedules = [];
    if (ShipperScheduleCollection.length > 0) {
        shipperSchedules = ShipperScheduleCollection.map((shipperCollection) => {
            let taskTimeWindows = shipperCollection?.shift?.tasks.map((task) => {
                return {
                    startTime: task.startWorkingTime,
                    endTime: task.endWorkingTime
                }
            })

            let timeWindowInDay = {
                startTimeWindowInDay: shipperCollection?.shift?.startWorkingTime,
                endTimeWindowInDay: shipperCollection?.shift?.endWorkingTime
            }
            let freeTimeWindow = findFreeShipperSchedule(timeWindowInDay, taskTimeWindows);

            return {
                _id: shipperCollection.employee._id,
                name: shipperCollection.employee.fullName,
                freeTimeWindows: freeTimeWindow,
            }
        })
    }

    let shipperHasScheduleIds = [];
    if (shipperSchedules.length > 0) shipperHasScheduleIds = shipperSchedules.map((shipperSchedule) => JSON.stringify(shipperSchedule._id));
    ShipperCollection.forEach((shipper) => {
        let shipperId = JSON.stringify(shipper.driver._id);
        if (!shipperHasScheduleIds.includes(shipperId)) {
            shipperSchedules.push({
                _id: shipper.driver._id,
                name: shipper.driver.fullName,
                salary: shipper.salary,
                freeTimeWindows: [{startTime: "07:30:00", endTime: "22:00:00"}]
            })
        } else {
            let index = shipperSchedules.findIndex((schedule) => JSON.stringify(schedule._id) == shipperId);
            shipperSchedules[index] = { ...shipperSchedules[index], salary: shipper.salary };
        }
    })
    if (shipperSchedules.length > 0) {
        for (let index = 0; index < shipperSchedules.length; index++) {
            let listVehicleCanDrive = await findListVehicleCanDriveForShipper(shipperSchedules[index]._id, portal);
            shipperSchedules[index] = {...shipperSchedules[index], listVehicleCanDrive: listVehicleCanDrive}
        }
    }

    return shipperSchedules;
}

exports.editDriverInfo = async (id, data, portal) => {
    let updateData = {};
    if (data.drivingLicense) updateData.drivingLicense = data.drivingLicense;
    if (data.salary) updateData.salary = data.salary;
    if (data.status) updateData.status = data.status;

    let oldDriver = await Driver(connect(DB_CONNECTION, portal)).findOneAndUpdate({ _id: id }, updateData, { new: true });
    if (!oldDriver) {
        throw Error('id driver not found')
    }

    let updateDriver = await Driver(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate([
            {path: 'driver', select: 'fullName'}
        ]);
    return updateDriver;
}

exports.updateStatusByEmployeeId = async (id, data, portal) => {
    let updateData = {};
    if (data.status) updateData.status = data.status;

    let oldDriver = await Driver(connect(DB_CONNECTION, portal)).findOneAndUpdate({ driver: id }, updateData, { new: true });
    if (!oldDriver) {
        throw Error('employee id of driver not found')
    }

    let updateDriver = await Driver(connect(DB_CONNECTION, portal)).findOne({ driver: id })
        .populate([
            {path: 'driver', select: 'fullName'}
        ]);
    return updateDriver;
}

function isInTaskTimeWindow (time, taskTimeWindow) {
    if (time.startTime >= taskTimeWindow.startTime && time.startTime <= taskTimeWindow.endTime) {
        return true;
    }
    if (time.endTime >= taskTimeWindow.startTime && time.endTime <= taskTimeWindow.endTime) {
        return true;
    }
    return false;
}
function isInShiftTimeWindow (time, shiftTimeWindow) {
    if (time.startTime >= shiftTimeWindow.startTime && time.endTime <= shiftTimeWindow.endTime) {
        return true;
    }
    return false;
}

exports.getAllShipperAvailableForJourney = async (data, portal) => {
    const { startTime, endTime, journeyDate } = data;
    if (startTime == null || endTime == null | journeyDate == null) {
        throw Error("Data journey time window not valid");
    }
    let journeyTimeWindow = {
        startTime: startTime,
        endTime: endTime
    }

    let optionSearching = {}
    optionSearching.date = {
        '$gte': getArrayTimeFromString(journeyDate.split("-").reverse().join("-"))[0],
        '$lte': getArrayTimeFromString(journeyDate.split("-").reverse().join("-"))[1]
    }

    let availableShippers = [];
    let ShipperScheduleCollection = await EmployeeWorkingSchedule(connect(DB_CONNECTION, portal))
        .find(optionSearching)
        .populate([
            {path: "employee", select: "fullName"}
        ])
    let availableShipperIds = null, shipperHasTaskCurrentDate= [];
    if (ShipperScheduleCollection.length > 0) {
        shipperHasTaskCurrentDate = ShipperScheduleCollection.map((schedule) => schedule.employee._id)
        availableShipperIds = [];
        ShipperScheduleCollection.forEach((shipperSchedule) => {
            let isValid = 1;
            let shiftTimeWindow = {
                startTime: convertTimeStringToInt(shipperSchedule.shift.startWorkingTime),
                endTime: convertTimeStringToInt(shipperSchedule.shift.endWorkingTime)
            }
            if (isInShiftTimeWindow(journeyTimeWindow, shiftTimeWindow)) {
                shipperSchedule.shift.tasks.length > 0 && shipperSchedule.shift.tasks.forEach((task) => {
                    let taskTimeWindow = {
                        startTime: convertTimeStringToInt(task.startWorkingTime),
                        endTime: convertTimeStringToInt(task.endWorkingTime)
                    }
                    if (isInTaskTimeWindow(journeyTimeWindow, taskTimeWindow)) isValid = 0;
                })
            } else {
                isValid = 0;
            }
            if (isValid == 1) availableShipperIds.push(shipperSchedule.employee._id);
        })
    }
    if (availableShipperIds == null) {
        availableShippers = await Driver(connect(DB_CONNECTION, portal))
            .find()
            .populate([
                {path: "driver", select: "fullName"}
            ]);
    } else if (availableShipperIds?.length > 0) {
        // let availableShipperObjIds = availableShipperIds.map((id) =>  { return ObjectId(id) });
        availableShippers = await Driver(connect(DB_CONNECTION, portal))
        .find({driver: {$in: availableShipperIds}})
        .populate([
            {path: "driver", select: "fullName"}
        ]);
    } else if (availableShipperIds?.length == 0) {
        availableShippers = await Driver(connect(DB_CONNECTION, portal))
        .find({driver: {$nin: shipperHasTaskCurrentDate}})
        .populate([
            {path: "driver", select: "fullName"}
        ]);
    } else {
        return null;
    }
    return availableShippers;
}

exports.getDriverNotConfirm = async (query, portal) => {
    let currentRole = query?.currentRole;
    if (!currentRole) return [];

    let usersInDepartmentOfRole = await userService.getAllEmployeeOfUnitByRole(portal, currentRole);
    let emailsInCompany = usersInDepartmentOfRole.map((user) => user.userId.email);
    let employeesInDepartmentOfRole = await Employee(connect(DB_CONNECTION, portal)).find({ emailInCompany: { $in: emailsInCompany} });
    let drivers = await Driver(connect(DB_CONNECTION, portal)).find({});

    let confirmedShipperIds = drivers.map((driver) => JSON.stringify(driver.user));

    let lists = [];
    if (usersInDepartmentOfRole) {
        usersInDepartmentOfRole.forEach((driverNotConfirm) => {
            if (!confirmedShipperIds.includes(JSON.stringify(driverNotConfirm.userId._id))) {
                lists.push({
                    _id: driverNotConfirm.userId._id,
                    name: driverNotConfirm.userId.name,
                    email: driverNotConfirm.userId.email,
                    status: 1
                })
            }
        });
    }
    return lists;
}

exports.calculateShipperSalary = async (query, portal) => {
    if (!query.monthSearch || !query.yearSearch) {
        throw Error("Cant calculate without time")
    }
    let monthSearch = query.monthSearch;
    let yearSearch = query.yearSearch;
    let shippers = await Driver(connect(DB_CONNECTION, portal)).find()
        .populate([
            {path: 'workingSchedules.workingSchedule', select: 'shift date'}
        ])
    let shipperWithInfoDelivery = []
    for (let index = 0; index < shippers.length; index++) {
        let shipperWorkingSchedules = shippers[index].workingSchedules;
        let listTask = [];
        if (shipperWorkingSchedules && shipperWorkingSchedules.length > 0) {
            for (let index = 0; index < shipperWorkingSchedules.length; index++) {
                let tasks = shipperWorkingSchedules[index]?.workingSchedule?.shift?.tasks;
                if (tasks && tasks?.length > 0) {
                    tasks.map((task) => listTask.push(task.journey));
                }
            }
        }
        shipperWithInfoDelivery.push({
            shipperId: shippers[index]._id,
            tasks: listTask,
        })
    }
    // Dữ liệu về số đơn hàng và số đơn hàng giao thành công của shipper trong tháng
    let shipperWithInfoOrder = [];
    for (let index = 0; index < shipperWithInfoDelivery.length; index++) {
        let journeys = [];
        journeys = await Journey(connect(DB_CONNECTION, portal)).find({ _id : { $in : shipperWithInfoDelivery[index].tasks} });
        journeys = journeys.filter((journey) => journey.status == 3);

        let totalOrder = 0, successOrder = 0;
        journeys.forEach((journey) => {
            totalOrder += journey.totalOrder;
            successOrder += journey.perfectDeliveryOrders;
        })
        shipperWithInfoOrder.push({
            _id: shipperWithInfoDelivery[index].shipperId,
            totalOrder: totalOrder,
            successOrder: successOrder,
        });
    }
    // Lấy ra các chỉ số để tính lương thưởng trong bảng shipper cost
    let shipperFLexCosts = await ShipperCost(connect(DB_CONNECTION, portal)).find({});
    let rateSuccess = [], productivityBonus = [];
    shipperFLexCosts.forEach((cost) => {
        if (cost.code.includes('RATE_SUCCESS') ) {
            rateSuccess.push({
                quota: cost.quota,
                cost: cost.cost
            })
        } else productivityBonus.push(cost.cost)
    })
    // Tính lương
    let shipperWithTotalSalary = [];
    for (let index = 0; index < shipperWithInfoOrder.length; index++) {
        if (shipperWithInfoOrder[index].totalOrder == 0 || shipperWithInfoOrder[index].successOrder == 0) {
            shipperWithTotalSalary.push({
                _id: shipperWithInfoOrder[index]._id,
                fixedSalary: 0,
                bonusSalary: 0,
                totalSalary: 0
            })
            continue;
        }
        let totalOrder = shipperWithInfoOrder[index].totalOrder;
        let successOrder = shipperWithInfoOrder[index].successOrder;
        let deliveryRate = successOrder/totalOrder * 100;
        if (deliveryRate >= rateSuccess[3].quota) {
            shipperWithInfoOrder[index].totalOrder = shipperWithInfoOrder[index].totalOrder * (rateSuccess[3].cost / 100 + 1)
        } else if (deliveryRate >= rateSuccess[2].quota) {
            shipperWithInfoOrder[index].totalOrder = shipperWithInfoOrder[index].totalOrder * (rateSuccess[2].cost / 100 + 1)
        } else if (deliveryRate >= rateSuccess[1].quota) {
            shipperWithInfoOrder[index].totalOrder = shipperWithInfoOrder[index].totalOrder * (rateSuccess[1].cost / 100 + 1)
        } else if (deliveryRate >= rateSuccess[0].quota) {
            shipperWithInfoOrder[index].totalOrder = shipperWithInfoOrder[index].totalOrder * (rateSuccess[0].cost / 100 + 1)
        } else if (deliveryRate < 70) {
            shipperWithInfoOrder[index].totalOrder = shipperWithInfoOrder[index].totalOrder * 0.9
        }
        let currentShipper = await Driver(connect(DB_CONNECTION, portal)).findById(shipperWithInfoOrder[index]._id);
        if (!currentShipper) {
            throw Error("Cant find current shipper when calculate total salary")
        }
        fixedSalary = currentShipper.salary;

        shipperWithTotalSalary.push({
            _id: shipperWithInfoOrder[index]._id,
            name: currentShipper.name,
            fixedSalary: fixedSalary,
            bonusSalary: Math.round(AVERAGE_BONUS_PER_ORDER * shipperWithInfoOrder[index].totalOrder),
            totalSalary: Math.round(AVERAGE_BONUS_PER_ORDER * shipperWithInfoOrder[index].totalOrder + fixedSalary)
        })
    }

    return shipperWithTotalSalary;
}

exports.saveSalary = async (data, portal) => {
    if (!data.date) {
        throw Error("Save salary fail cause no time of salary")
    }
    let toSaveData = {}
    toSaveData.date = data.date.split('-').reverse().join('-');

    let listShipperSalary = [];
    data.salary.forEach((shipperSalary) => {
        listShipperSalary.push({
            shipper: shipperSalary._id,
            fixedSalary: shipperSalary.fixedSalary,
            bonusSalary: shipperSalary.bonusSalary,
            totalSalary: shipperSalary.totalSalary,
        })
    })
    toSaveData.salary = listShipperSalary;

    let oldSalary = await ShipperSalary(connect(DB_CONNECTION, portal)).findOne({date: new Date(toSaveData.date)});
    let newShipperSalary;
    if (!oldSalary) {
        newShipperSalary = await ShipperSalary(connect(DB_CONNECTION, portal)).create(toSaveData);
    } else {
        oldSalary.salary = toSaveData.salary;
        oldSalary.save();
    }

    return newShipperSalary ? newShipperSalary : oldSalary;
}

exports.getAllShipperSalaryByCondition = async (query, portal) => {
    if (!query.lastDateInMonth || !query.firstDateInMonth) {
        throw Error("Find salary fail cause no time of salary")
    }
    let filter = {};
    filter.date = {
        $gte: getArrayTimeFromString(query.firstDateInMonth)[0],
        $lte: getArrayTimeFromString(query.lastDateInMonth)[1]
    }

    let salary = await ShipperSalary(connect(DB_CONNECTION, portal)).findOne(filter)
        .populate([
            {path: 'salary.shipper', select: 'name'}
        ]);
    if (query.shipperName && salary?.salary) {
        let shippersSalary = salary.salary.filter(shipperSalary => shipperSalary.shipper.name == query.shipperName);
        salary.salary = shippersSalary;
    }

    return salary
}