const {
    TransportVehicle
} = require('../../../../models');

const {
    connect
} = require(`../../../../helpers/dbHelper`);
const TransportPlanServices = require('../transportPlan/transportPlan.service')
exports.createTransportVehicle = async (portal, data) => {
    let newTransportVehicle;
    console.log(data);
    if (data && data.length !== 0) {
            newTransportVehicle = await TransportVehicle(connect(DB_CONNECTION, portal)).create({
                asset: data.id,
                code: data.code,
                name: data.name,
                payload: data.payload,
                volume: data.volume,
        });
        
    }

    // let example = await Example(connect(DB_CONNECTION, portal)).findById({ _id: newExample._id });;
    // return example;
}

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
 * @param {*} vehicleId id phương tiện (assetid)
 * @param {*} data {asset: id tương ứng tài sản cố định, code: mã phương tiện,
 *                  name: tên phương tiện, payload, volume, transportPlan: id plan } 
 * @returns 
 */
exports.editTransportVehicleToSetPlan = async (portal, vehicleId, data) => {
    let newTransportVehicle;
    let oldTransportVehicle = await TransportVehicle(connect(DB_CONNECTION, portal)).findOne({asset: vehicleId});
    
    if (!oldTransportVehicle) {
        newTransportVehicle = await TransportVehicle(connect(DB_CONNECTION, portal)).create({
            asset: data.id,
            code: data.code,
            name: data.name,
            payload: data.payload,
            volume: data.volume,
            transportPlan: data.transportPlan,
        });
    }
    else {
        const transportVehicleId = oldTransportVehicle._id; 
        await TransportVehicle(connect(DB_CONNECTION, portal)).update({ _id: transportVehicleId }, { $set: data });
        newTransportVehicle = await TransportVehicle(connect(DB_CONNECTION, portal)).findById({ _id: transportVehicleId });
    }
    return newTransportVehicle;
}

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
// exports.getExamples = async (portal, data) => {
//     let keySearch = {};
//     if (data?.exampleName?.length > 0) {
//         keySearch = {
//             exampleName: {
//                 $regex: data.exampleName,
//                 $options: "i"
//             }
//         }
//     }

//     let page, perPage;
//     page = data?.page ? Number(data.page) : 1;
//     perPage = data?.perPage ? Number(data.perPage) : 20;

//     let totalList = await Example(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
//     let examples = await Example(connect(DB_CONNECTION, portal)).find(keySearch)
//         .skip((page - 1) * perPage)
//         .limit(perPage);

//     return { 
//         data: examples, 
//         totalList 
//     }
// }

// // Lấy ra một phần thông tin Ví dụ (lấy ra exampleName) theo mô hình dữ liệu số  2
// exports.getOnlyExampleName = async (portal, data) => {
//     let keySearch;
//     if (data?.exampleName?.length > 0) {
//         keySearch = {
//             exampleName: {
//                 $regex: data.exampleName,
//                 $options: "i"
//             }
//         }
//     }

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

    let page, limit;
    page = data?.page ? Number(data.page) : 1;
    limit = data?.limit ? Number(data.limit) : 200;

    let totalList = await TransportVehicle(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let vehicles = await TransportVehicle(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * limit)
        .limit(limit);
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