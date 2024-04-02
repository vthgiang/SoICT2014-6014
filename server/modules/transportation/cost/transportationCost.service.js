const { VehicleCost, CostFormula, Vehicle, ShipperCost } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

// Tạo mới loại chi phí đội xe
exports.createVehicleCost = async (portal, data) => {
    let newVehicleCost;
    let vehicles;
    if (data.dependentVehicleList) {
        vehicles = data.dependentVehicleList.map((dependentVehicle) => {
            return {
                vehicle: dependentVehicle
            }
        })
    }
    newVehicleCost = await VehicleCost(connect(DB_CONNECTION, portal)).create({
        name: data.vehicleCostName ? data.vehicleCostName : "",
        type: data.vehicleCostType ? data.vehicleCostType : 1,
        vehicles: vehicles ? vehicles : [],
        code: data.vehicleCostCode ? data.vehicleCostCode : "",
        cost: data.vehicleCost ? data.vehicleCost : 0,
    })

    let vehicleCost = await VehicleCost(connect(DB_CONNECTION, portal)).findById({ _id: newVehicleCost._id });;
    return vehicleCost;
}

// Tạo mới loại chỉ số tính thưởng cho nhân viên
exports.createShipperCost = async (portal, data) => {
    let newShipperCost;
    let dataUpdate = {};
    if (data.shipperCostName) {
        dataUpdate.name = data.shipperCostName;
    }
    if (data.shipperCostCode) {
        dataUpdate.code = data.shipperCostCode;
    }
    if (data.shipperCostQuota) {
        dataUpdate.quota = data.shipperCostQuota;
    }
    if (data.cost) {
        dataUpdate.cost = data.cost;
    }
    if (!data.id) {
        newShipperCost = await ShipperCost(connect(DB_CONNECTION, portal)).create({
            name: dataUpdate.name ? dataUpdate.name : "",
            code: dataUpdate.code ? dataUpdate.code : "",
            quota: dataUpdate.quota ? dataUpdate.quota : "",
            cost: dataUpdate.cost ? dataUpdate.cost : 0,
        })
    } else {
        await ShipperCost(connect(DB_CONNECTION, portal)).update({ _id: data.id }, dataUpdate, { new: true });
        newShipperCost = await ShipperCost(connect(DB_CONNECTION, portal)).findById({ _id: data.id });
    }

    return newShipperCost;
}

// Cập nhật xe phụ thuộc vào loại chi phí
exports.updateDependentVehicleCost = async (portal, id, data) => {
    let oldVehicleCost = await VehicleCost(connect(DB_CONNECTION, portal)).findById({ _id: id });
    let updateData = {};
    if (data.vehicleName) {
        updateData.name = data.vehicleName;
    }
    if (data.vehicleCostType) {
        updateData.vehicleCostType = data.vehicleCostType;
    }
    if (data.vehicleCostCode) {
        updateData.vehicleCostCode = data.vehicleCostCode;
    }
    if (data.vehicles) {
        updateData.vehicles = data.vehicles;
    }

    await VehicleCost(connect(DB_CONNECTION, portal)).findOneAndUpdate({ _id: oldVehicleCost._id}, updateData, {
        new: true
    });
    let updatedVehicleCost = VehicleCost(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate([
            {path: "vehicles.vehicle"}
        ])

    return updatedVehicleCost;
}

exports.createOrUpdateVehicleCostFormula = async (portal, data) => {
    let vehicleCostFormula;

    vehicleCostFormula = await CostFormula(connect(DB_CONNECTION,portal)).findOne({});

    if (vehicleCostFormula && data.vehicle) {
        vehicleCostFormula.vehicle = data.vehicle;
        vehicleCostFormula.save();
    } else {
        vehicleCostFormula = await CostFormula(connect(DB_CONNECTION, portal)).create({
            vehicle: data.vehicle ? data.vehicle : "",
            shipper: data.shipper ? data.shipper : ""
        });
    }
    let newCost = await CostFormula(connect(DB_CONNECTION, portal)).findOne({_id: vehicleCostFormula._id});

    return newCost;
}

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getVehicleCosts = async (portal, data) => {
    let keySearch = {};
    if (data?.vehicleCostName) {
        keySearch = {
            vehicleCostName: {
                $regex: data.vehicleCostName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalVehicleCostList = await VehicleCost(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let vehicleCosts = await VehicleCost(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate([
            {path: "vehicles.vehicle"}
        ])
        .skip((page - 1) * perPage)
        .limit(perPage);
    console.log(vehicleCosts);
    return {
        data: vehicleCosts,
        totalVehicleCostList
    }
}

exports.getShipperCosts = async (portal, data) => {
    let keySearch = {};
    if (data?.shipperCostName) {
        keySearch = {
            name: {
                $regex: data.shipperCostName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalShipperCostList = await ShipperCost(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let shipperCosts = await ShipperCost(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * perPage)
        .limit(perPage);
    return {
        data: shipperCosts,
        totalShipperCostList
    }
}

exports.getCostFormula = async (portal) => {
    let costFormula = await CostFormula(connect(DB_CONNECTION, portal)).findOne();
    return {
        data: costFormula
    }
}

// Xóa một chi phí xe
exports.deleteVehicleCost = async (portal, id) => {
    let vehicleCost = await VehicleCost(connect(DB_CONNECTION, portal))
        .deleteOne({ _id: id });

    return {
        deletedVehicleCost: id
    };
}

exports.getAllVehicleCostWithCondition = async (query, portal) => {
    const { status } = query;
    let vehicleCollection = await VehicleCost(connect(DB_CONNECTION, portal)).find({status: status});

    return {
        data: vehicleCollection
    }

}

const findAndUpdateCostForVehicleArray =  (vehicleArray, filter, data) => {
    vehicleArray.forEach((vehicle, index, vehicleArray) => {
        if (JSON.stringify(vehicle._id) == JSON.stringify(filter)) vehicleArray[index].costList.push(data)
    })
}