const {
    TransportSchedule, TransportPlan, TransportRequirement
} = require('../../../../models');
const {
    connect
} = require(`../../../../helpers/dbHelper`);

/**
 * Tạo transportRoute mới với id = transportPlan._id
 * data = {transportPlan: _id}
 * @param {*} portal 
 * @param {*} data 
 * @returns 
 */
exports.planCreateTransportRoute = async (portal, data) => {
    let newTransportRoute;
    if (data && data.length !== 0) {
        newTransportRoute = await TransportSchedule(connect(DB_CONNECTION, portal)).create({
            transportPlan: data.transportPlan,
        });
    }
    let transportRoute = await TransportSchedule(connect(DB_CONNECTION, portal)).findById({ _id: newTransportRoute._id });;
    return transportRoute;
}

exports.getTransportRouteByPlanId = async (portal, id) => {
    let transportRoute = await TransportSchedule(connect(DB_CONNECTION, portal)).findOne({transportPlan: id})
    .populate(
        {
            path: 'transportPlan',
            select: 'transportVehicles transportRequirements',
            populate: [
                {
                    path: 'transportRequirements',
                    model: 'TransportRequirement'
                },
                {
                    path: 'transportVehicles.transportVehicle',
                    model: 'TransportVehicle'
                }
            ]
        }   
    )
    if (transportRoute) {
        return transportRoute;
    }
    else return -1;
}

/**
 * 
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


// Chỉnh sửa một Ví dụ
exports.editTransportRouteByPlanId = async (portal, id, data) => {
    let oldTransportRoute = await TransportSchedule(connect(DB_CONNECTION, portal)).findOne({transportPlan: id});
    if (!oldTransportRoute) {
        return -1;
    }

    // Cach 2 de update
    await TransportSchedule(connect(DB_CONNECTION, portal)).update({ _id: oldTransportRoute._id }, { $set: data });
    let newTransportRoute = await TransportSchedule(connect(DB_CONNECTION, portal)).findById({ _id: oldTransportRoute._id });

    return newTransportRoute;
}

// // Xóa một Ví dụ
// exports.deleteExample = async (portal, id) => {
//     let example = Example(connect(DB_CONNECTION, portal)).findByIdAndDelete({ _id: id });
//     return example;
// }