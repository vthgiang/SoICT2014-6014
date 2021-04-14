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
        },
    )
    if (transportRoute) {
        return transportRoute;
    }
    else return -1;
}

/**
 * Edit transportschedule qua plan id
 * @param {*} portal 
 * @param {*} id 
 * @param {*} data 
 * @returns 
 */
exports.editTransportRouteByPlanId = async (portal, planId, data) => {
    console.log(planId, " planId", data, " data");
    let oldTransportSchedule = await TransportSchedule(connect(DB_CONNECTION, portal)).findOne({transportPlan: planId});
    if (!oldTransportSchedule) {
        return -1;
    }

    // Cach 2 de update
    await TransportSchedule(connect(DB_CONNECTION, portal)).update({ _id: oldTransportSchedule._id }, { $set: data });
    let newTransportSchedule = await TransportSchedule(connect(DB_CONNECTION, portal)).findById({ _id: oldTransportSchedule._id });

    return newTransportSchedule;
}

// // Xóa một Ví dụ
// exports.deleteExample = async (portal, id) => {
//     let example = Example(connect(DB_CONNECTION, portal)).findByIdAndDelete({ _id: id });
//     return example;
// }