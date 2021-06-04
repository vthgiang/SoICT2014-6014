const {
    TransportVehicle
} = require('../../../../models');

const {
    connect
} = require(`../../../../helpers/dbHelper`);
const TransportPlanServices = require('../transportPlan/transportPlan.service')
const TransportDepartment = require('../transportDepartment/transportDepartment.service')

/**
 * Lưu lại xe từ module asset, nếu đã có xe thì ko lưu mới
 * data = {
            id: vehicle._id,
            code: vehicle.code,
            name: vehicle.assetName,
            payload: vehicle.payload,
            volume: vehicle.volume,
            transportPlan: currentTransportPlanId,
            vehicleId: vehicle._id,
        }
 * @param {*} portal 
 * @param {*} data {asset: id tương ứng tài sản cố định, code: mã phương tiện,
 *                  name: tên phương tiện, payload, volume, transportPlan: id plan } 
 * @returns 
 */
exports.createTransportVehicle = async (portal, data) => {
    let assetId = data.id;
    let currentRole = data.currentRole;
    let department = TransportDepartment.getDepartmentByRole(portal, currentRole);
    let newTransportVehicle;
    let oldTransportVehicle = await TransportVehicle(connect(DB_CONNECTION, portal)).findOne({asset: assetId, department: department._id});
    
    if (!oldTransportVehicle) {
        newTransportVehicle = await TransportVehicle(connect(DB_CONNECTION, portal)).create({
            asset: data.id,
            code: data.code,
            name: data.name,
            payload: data.payload,
            volume: data.volume,
            // transportPlan: data.transportPlan,
            usable: 1,
            department: department._id,
        });
    }
    else {
        newTransportVehicle = await TransportVehicle(connect(DB_CONNECTION, portal)).update({ _id: oldTransportVehicle._id }, { $set: {usable: 1} });
    }
    let transportVehicle = await TransportVehicle(connect(DB_CONNECTION, portal)).findById({ _id: newTransportVehicle._id })
    .populate([{
        path: "asset"
    }])
    return transportVehicle;
}
/**
 * Đổi trạng thái
 * @param {*} portal 
 * @param {*} id 
 * @returns 
 */
exports.editTransportVehicle = async (portal, id, data) => {
    let oldTransportVehicle = await TransportVehicle(connect(DB_CONNECTION, portal)).findById(id);

    if (!oldTransportVehicle) {
        return -1;
    }
    await TransportVehicle(connect(DB_CONNECTION, portal)).update({ _id: id }, { $set: data });
    let transportVehicle = await TransportVehicle(connect(DB_CONNECTION, portal)).findById({ _id: oldTransportVehicle._id })
    .populate([{
        path: "asset"
    }])
    return transportVehicle;
}

exports.getAllTransportVehicles = async (portal, data) => {
    let keySearch = {};
    // if (data?.exampleName?.length > 0) {
    //     keySearch = {
    //         exampleName: {
    //             $regex: data.exampleName,
    //             $options: "i"
    //         }
    //     }
    // }
    let currentRole = data.currentRole;
    let department = await TransportDepartment.getDepartmentByRole(portal, currentRole);
    let page, limit;
    page = data?.page ? Number(data.page) : 1;
    limit = data?.limit ? Number(data.limit) : 200;
    let vehicles = [];
    let totalList = 0;
    if (department){
        keySearch = {department: department._id}

        totalList = await TransportVehicle(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
        vehicles = await TransportVehicle(connect(DB_CONNECTION, portal)).find(keySearch)
            .populate([{
                path: "asset"
            }])
            .skip((page - 1) * limit)
            .limit(limit);
    }
    
    return { 
        data: vehicles, 
        totalList 
    }
}

/**
 * Xóa bỏ phương tiện vận tải hiện có trong plan
 * @param {*} portal 
 * @param {*} id 
 * @returns 
 */
exports.deleteTransportVehicleInPlanSchedule = async (portal, vehicleId, planId) => {
    // Tìm plan hiện tại, lấy array transportRequirements, và xóa bỏ trường transportPlan trong các requirement này
    let TransportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById({ _id: planId });
    if (transportPlan && transportPlan.transportVehicles && transportPlan.transportVehicles.length !==0){
        let newTransportVehicles = transportPlan.transportVehicles.filter(r => String(r.transportVehicle)!==vehicleId);
        TransportPlanServices.editTransportPlan(portal, planId, {transportVehicles: newTransportVehicles});
    }
    await TransportScheduleServices.planDeleteTransportSchedule(portal, planId);
    transportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findByIdAndDelete({ _id: planId });
    return transportPlan;
}