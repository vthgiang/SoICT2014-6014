const { Vehicle, VehicleSchedule, VehicleCost } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');


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
function convertHHMMSSToInt (time) {
    let intTime = 0;
    let hours = parseInt((time.split(":")[0]));
    let minutes = parseInt(time.split(":")[1]);
    let seconds = parseInt(time.split(":")[2]);

    return intTime = hours*3600 + minutes*60 + seconds;
}

// Tạo mới xe
exports.createVehicle = async (portal, data) => {
    let newVehicle;
    if (data && data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
            newVehicle = await Vehicle(connect(DB_CONNECTION, portal)).create({
                name: data[i].vehicleName,
                tonnage: data[i].tonnage,
                volume: data[i].width * data[i].height * data[i].depth,
                width: data[i].width,
                height: data[i].height,
                depth: data[i].depth,
                averageGasConsume: data[i].averageGasConsume,
                fixedCost: data[i].fixedCost ? data[i].fixedCost : null,
                unloadingCost: data[i].unloadingCost ? data[i].unloadingCost : null,
                vehicleCost: data[i].vehicleCost ? data[i].vehicleCost : null,
                averageFeeTransport: data[i].averageGasConsume * 30000,
                minVelocity: data[i].minVelocity,
                maxVelocity: data[i].maxVelocity,
                vehicleType: data[i].vehicleType,
                goodGroupsCannotTransport: data[i].goodGroupsCannotTransport,
                requireLicense: data[i].requireLicense ? data[i].requireLicense : [],
            });
        }

    }

    let vehicle = await Vehicle(connect(DB_CONNECTION, portal)).findById({ _id: newVehicle._id });;
    return vehicle;
}

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getVehicles = async (portal, data) => {
    let keySearch = {};
    if (data?.vehicleName?.length > 0) {
        keySearch = {
            vehicleName: {
                $regex: data.vehicleName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 100;

    let totalList = await Vehicle(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let vehicles = await Vehicle(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        data: vehicles,
        totalList
    }
}

// Lấy ra một phần thông tin Ví dụ (lấy ra vehicleName) theo mô hình dữ liệu số  2
exports.getOnlyVehicleName = async (portal, data) => {
    let keySearch;
    if (data?.vehicleName?.length > 0) {
        keySearch = {
            vehicleName: {
                $regex: data.vehicleName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Vehicle(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let VehicleCollection = await Vehicle(connect(DB_CONNECTION, portal)).find(keySearch, { vehicleName: 1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        data: VehicleCollection,
        totalList
    }
}

// Lấy ra xe theo id
exports.getVehicleById = async (portal, id) => {
    let vehicle = await Vehicle(connect(DB_CONNECTION, portal)).findById({ _id: id });
    if (vehicle) {
        return vehicle;
    }
    return -1;
}

// Chỉnh sửa xe
exports.editVehicle = async (portal, id, data) => {
    let updateData = {};
    if (data.vehicleName) {
        updateData.name = data.vehicleName;
    }

    if (data.tonnage) {
        updateData.tonnage = data.tonnage;
    }

    if (data.volume) {
        updateData.volume = data.volume;
    }

    if (data.width) {
        updateData.width = data.width;
    }

    if (data.height) {
        updateData.height = data.height;
    }

    if (data.depth) {
        updateData.depth = data.depth;
    }

    if (data.averageGasConsume) {
        updateData.averageGasConsume = data.averageGasConsume;
    }

    if (data.averageFeeTransport) {
        updateData.averageFeeTransport = data.averageFeeTransport;
    }

    if (data.minVelocity) {
        updateData.minVelocity = data.minVelocity;
    }

    if (data.vehicleType) {
        updateData.vehicleType = data.vehicleType;
    }

    if (data.maxVelocity) {
        updateData.maxVelocity = data.maxVelocity;
    }

    if (data.goodGroupsCannotTransport) {
        updateData.goodGroupsCannotTransport = data.goodGroupsCannotTransport;
    }

    if (data.requireLicense) {
        updateData.requireLicense = data.requireLicense;
    }

    if (data.status) {
        updateData.status = data.status
    }

    let updatedVehicle = await Vehicle(connect(DB_CONNECTION, portal)).findOneAndUpdate({ _id: id }, updateData, { new: true });
    if (!updatedVehicle) {
        throw Error("Id vehicle has passed is wrong!")
    }

    return updatedVehicle;
}

// Xóa xe
exports.deleteVehicles = async (portal, vehicleIds) => {
    let vehicles = await Vehicle(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: vehicleIds.map(item => mongoose.Types.ObjectId(item)) } });

    return vehicles;
}

exports.getAllVehicleWithCondition = async (query, portal) => {
    const { status } = query;
    let vehicleCollection = await Vehicle(connect(DB_CONNECTION, portal)).find({status: status});

    return {
        data: vehicleCollection
    }

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

function convertTimeStringToInt (time) {
    let intTime = 0;
    let hours = parseInt((time.split(":")[0]));
    let minutes = parseInt(time.split(":")[1]);
    let seconds = parseInt(time.split(":")[2]);

    return intTime = hours*3600 + minutes*60 + seconds;
}

function findFreeVehicleSchedule (timeWindowInDay, taskTimeWindows) {
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

exports.getAllFreeVehicleSchedule = async (query, portal) => {
    let { dateToSearch } = query;
    let option = {};
    option.status = 2;
    if (dateToSearch) {
        option.date = {
            '$gte': getArrayTimeFromString(dateToSearch)[0],
            '$lte': getArrayTimeFromString(dateToSearch)[1]
        }
    }
    let VehicleScheduleCollection = await VehicleSchedule(connect(DB_CONNECTION, portal)).find(option);

    let VehicleCollection = await Vehicle(connect(DB_CONNECTION, portal)).find();

    let vehicleSchedules = [];
    if (VehicleScheduleCollection.length > 0) {
        vehicleSchedules = VehicleScheduleCollection.map((vehicleCollection) => {
            let taskTimeWindows = vehicleCollection?.shift?.tasks.map((task) => {
                return {
                    startTime: task.startWorkingTime,
                    endTime: task.endWorkingTime
                }
            })
            let timeWindowInDay = {
                startTimeWindowInDay: vehicleCollection?.shift?.startWorkingTime,
                endTimeWindowInDay: vehicleCollection?.shift?.endWorkingTime
            }
            let freeTimeWindow = findFreeVehicleSchedule(timeWindowInDay, taskTimeWindows);

            return {
                _id: vehicleCollection.vehicle,
                freeTimeWindows: freeTimeWindow
            }
        })
    }

    let vehicleHasScheduleIds = [];
    if (vehicleSchedules.length > 0) vehicleHasScheduleIds = vehicleSchedules.map((vehicleSchedule) => JSON.stringify(vehicleSchedule._id));

    VehicleCollection.forEach((vehicle) => {
        let vehicleId = JSON.stringify(vehicle._id);
        if (!vehicleHasScheduleIds.includes(vehicleId)) {
            vehicleSchedules.push({
                _id: vehicle._id,
                freeTimeWindows: [{startTime: "08:00:00", endTime: "20:00:00"}]
            })
        }
    })

    return vehicleSchedules;
}

exports.getAllVehicleWithCostList = async (portal, data) => {
    let vehicleCostList = await VehicleCost(connect(DB_CONNECTION, portal)).find();
    if (!vehicleCostList) {
        throw Error("Not exist any vehicle cost!");
    }
    let vehicleWithCostList = await Vehicle(connect(DB_CONNECTION, portal)).find({})
    vehicleWithCostList = vehicleWithCostList.map((vehicle) => {
        return {
            _id: vehicle._id,
            costList: [],
            averageGasConsume: vehicle.averageGasConsume
        }
    })

    for (let index = 0; index < vehicleCostList.length; index++) {
        if (vehicleCostList[index]?.vehicles.length > 0) {
            vehicleCostList[index]?.vehicles.forEach((vehicle) => {
                let dataCost = {
                    code: vehicleCostList[index].code,
                    cost: vehicle.cost
                }
                findCostForVehicleArray(vehicleWithCostList, vehicle.vehicle, dataCost)
            })
        }
    }
    return {
        data: vehicleWithCostList,
    }
}

const findCostForVehicleArray =  (vehicleArray, filter, data) => {
    vehicleArray.forEach((vehicle, index, vehicleArray) => {
        if (JSON.stringify(vehicle._id) == JSON.stringify(filter)) vehicleArray[index].costList.push(data)
    })
}

// Update thông tin chi phí vận hành tất cả các xe
exports.calculateVehiclesCost = async (portal, data) => {
    if (data.length == 0) {
        throw Error("data to update vehicle cost is wrong!");
    }
    let searchingVehicleIds = data.map((vehicle) => vehicle._id);
    if (data && data.length > 0) {
        for (let index = 0; index < data.length; index++) {
            console.log("vao cap nhat vehicle cost ", index, data[index]._id);
            let updateVehicle;
            if (data[index]._id) {
                updateVehicle = await Vehicle(connect(DB_CONNECTION, portal)).findById(data[index]._id)
            }
            if (updateVehicle) {
                updateVehicle.vehicleCost = data[index].vehicleCost;
                if (data[index]?.averageFeeTransport) updateVehicle.averageFeeTransport = data[index].averageFeeTransport;
                updateVehicle.save();
            }
        }
    }

    newVehicles = await Vehicle(connect(DB_CONNECTION, portal)).find({ _id: {$in: searchingVehicleIds} })

    return newVehicles;
}

function isInTasks(tasks, timeToSearch) {
    let timeToSearchConvert = convertHHMMSSToInt(timeToSearch);
    if (tasks.length == 0) {
        return false;
    } else {
        tasks.forEach((task) => {
            let startTime = convertHHMMSSToInt(task.startWorkingTime);
            let endTime = convertHHMMSSToInt(task.endWorkingTime);
            if (startTime <= timeToSearchConvert && endTime >= timeToSearchConvert) {
                return true;
            }
        })
    }
    return false;
}
// Lấy ra thông tin trạng thái toàn đội xe
exports.getStatusAllVehicle = async (portal, data) => {
    if (!data.dateToSearch || !data.timeToSearch) {             //dateToSearch la ngay, con timeToSearch là giờ cụ thể
        throw Error("Not date to search status all vehicles")
    }
    let dateToSearch = new Date(data.dateToSearch), timeToSearch = data.timeToSearch;
    let vehicleWithStatus;

    let vehicleSchedules = VehicleSchedule(connect(DB_CONNECTION, portal)).find({ date: dateToSearch });
    vehicleSchedules.forEach((vehicleSchedule) => {
        let tasksInDay = vehicleSchedule.shift.tasks;
        let isVehicleBusy = isInTasks(tasksInDay, timeToSearch);
        if (isVehicleBusy) {
            vehicleWithStatus.push({
                _id: vehicleSchedule.vehicle,
                status: 3,          // có lịch trình trong khoảng thời gian tìm kiếm
            })
        } else {
            vehicleWithStatus.push({
                _id: vehicleSchedule.vehicle,
                status: 1,          // ko có lịch trình trong khoảng thời gian tìm kiếm
            })
        }
    })


    return vehicleWithStatus;
}