const {
    TransportPlan
} = require('../../../../models');

const {
    connect
} = require(`../../../../helpers/dbHelper`);

const TransportScheduleServices = require('../transportSchedule/transportSchedule.service');
const TransportVehicleServices = require('../transportVehicle/transportVehicle.service')

exports.createTransportPlan = async (portal, data) => {
    let newTransportPlan;
    if (data && data.length !== 0) {
            newTransportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).create({
            code: data.code,
            startTime: data.startDate,
            endTime: data.endDate,
        });
        
    }
    TransportScheduleServices.planCreateTransportRoute(portal, {transportPlan: newTransportPlan._id,})
    let transportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById({ _id: newTransportPlan._id });;
    return transportPlan;
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

exports.getAllTransportPlans = async (portal, data) => {
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

    let totalList = await TransportPlan(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let plans = await TransportPlan(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * limit)
        .limit(limit);
    return { 
        data: plans, 
        totalList 
    }
}

//     let page, perPage;
//     page = data?.page ? Number(data.page) : 1;
//     perPage = data?.perPage ? Number(data.perPage) : 20;

//     let totalList = await Example(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
//     let ExampleCollection = await Example(connect(DB_CONNECTION, portal)).find(keySearch, { exampleName: 1 })
//         .skip((page - 1) * perPage)
//         .limit(perPage);

//     return { 
//         data: ExampleCollection,
//         totalList 
//     }
// }

// Lấy ra Ví dụ theo id
exports.getPlanById = async (portal, id) => {
    console.log(id);
    let plan = await TransportPlan(connect(DB_CONNECTION, portal)).findById({ _id: id })
    .populate({
        path: 'transportRequirements',
        select: 'geocode'
    });
    if (plan) {
        return plan;
    }
    return -1;
}

// // Chỉnh sửa một Ví dụ
// exports.editExample = async (portal, id, data) => {
//     let oldExample = await Example(connect(DB_CONNECTION, portal)).findById(id);
//     if (!oldExample) {
//         return -1;
//     }

//     // Cach 2 de update
//     await Example(connect(DB_CONNECTION, portal)).update({ _id: id }, { $set: data });
//     let example = await Example(connect(DB_CONNECTION, portal)).findById({ _id: oldExample._id });

//     return example;
// }

// // Xóa một Ví dụ
// exports.deleteExample = async (portal, id) => {
//     let example = Example(connect(DB_CONNECTION, portal)).findByIdAndDelete({ _id: id });
//     return example;
// }

exports.editTransportPlan = async (portal, id, data) => {

    let oldTransportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById(id);

    if (!oldTransportPlan) {
        return -1;
    }

    // Cach 2 de update
    await TransportPlan(connect(DB_CONNECTION, portal)).update({ _id: id }, { $set: data });
    let transportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById({ _id: oldTransportPlan._id });
    return transportPlan;
}
/**
 * push requirement vào plan
 * @param {*} portal 
 * @param {*} id 
 * @param {*} data {requirement: ....} 
 * @returns 
 */
exports.addTransportRequirementToPlan = async (portal, id, data) => {
    let transportRequirement = data.requirement; // String id
    let oldTransportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById(id);

    if (!oldTransportPlan) {
        return -1;
    }

    await TransportPlan(connect(DB_CONNECTION, portal)).update({ _id: id }, {$push: {transportRequirements: transportRequirement}});
    let transportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById({ _id: oldTransportPlan._id });
    return transportPlan;
}

/**
 * Thêm xe vào kế hoạch (đồng thời lưu lại dữ liệu về xe trong vehicle)
 * @param {*} portal 
 * @param {*} id id của plan
 * @param {*} data data = {
            id: vehicle._id,
            code: vehicle.code,
            name: vehicle.assetName,
            payload: vehicle.payload,
            volume: vehicle.volume,
            transportPlan: currentTransportPlanId,
            vehicleId: vehicle._id,
        }
 * @returns 
 */

exports.addTransportVehicleToPlan = async (portal, id, data) => {
    let oldTransportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById(id);

    if (!oldTransportPlan) {
        return -1;
    }
    /**
     * Lưu lại dữ liệu xe
     */
    vehicle = await TransportVehicleServices.editTransportVehicleToSetPlan(portal, data.vehicleId, data);

    /**
     * Cập nhật xe vào plan
     */
    await TransportPlan(connect(DB_CONNECTION, portal)).update({ _id: id }, {$pull: {
        transportVehicles: {
            transportVehicle: vehicle._id
        }
    }});
    await TransportPlan(connect(DB_CONNECTION, portal)).update({ _id: id }, {$push: {
        transportVehicles: {
            transportVehicle: vehicle._id
        }
    }});
    let transportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById({ _id: oldTransportPlan._id });
    return transportPlan;    
}