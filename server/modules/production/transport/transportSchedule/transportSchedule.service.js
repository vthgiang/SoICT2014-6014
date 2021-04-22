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
    .populate([
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
                },
                {
                    path: 'transportVehicles.vehicle',
                    populate: [
                        {
                            path: 'asset'
                        }
                    ]
                }
            ]
        },
        {
            path: 'transportVehicles.transportVehicle',
            model: 'TransportVehicle',
        },
        {
            path: 'transportVehicles.transportRequirements',
            model: 'TransportRequirement'
        },
        {
            path: 'route.transportVehicle',
            model: 'TransportVehicle'
        },
        {
            path: 'route.routeOrdinal.transportRequirement',
            model: 'TransportRequirement'       
        }
    ])
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
    let oldTransportSchedule = await TransportSchedule(connect(DB_CONNECTION, portal)).findOne({transportPlan: planId});

    if (!oldTransportSchedule) {
        return -1;
    }

    // Cach 2 de update
    await TransportSchedule(connect(DB_CONNECTION, portal)).update({ _id: oldTransportSchedule._id }, { $set: data });
    let newTransportSchedule = await TransportSchedule(connect(DB_CONNECTION, portal)).findById({ _id: oldTransportSchedule._id });

    return newTransportSchedule;
}

/**
 * Xóa tất cả các requirementId trong transportSchedule có transportPlanId
 * @param {} portal 
 * @param {*} planId 
 * @param {*} requirementId 
 */
exports.deleteTransportRequirementByPlanId = async (portal, planId, requirementId) => {
    let oldTransportSchedule = await TransportSchedule(connect(DB_CONNECTION, portal)).findOne({transportPlan: planId});
    // Xóa bỏ requirement trong transportVehicles
    /**
     * transportVehicles = [
     * transportRequirements: array,
     * transportVehicle: id
     * ]
     */
    let newTransportVehicles = [];
    if (oldTransportSchedule.transportVehicles && oldTransportSchedule.transportVehicles.length!==0){
        let transportVehicles= oldTransportSchedule.transportVehicles;
        let newTransportRequirements = [];
        for (let i = 0; i<transportVehicles.length;i++){
            newTransportRequirements = transportVehicles[i].transportRequirements;
            if (String(requirementId) in transportVehicles[i].transportRequirements){
                newTransportRequirements = transportVehicles[i].transportRequirements.filter(r => r!==requirementId);
            }
            newTransportVehicles.push({
                transportVehicle: transportVehicles[i].transportVehicle,
                transportRequirements: newTransportRequirements,
            })
        }
        this.editTransportRouteByPlanId(portal, planId, {
            transportVehicles: newTransportVehicles,
        })
    }
    // Xóa bỏ requirement trong route
    let newTransportRoute = []
    if (oldTransportSchedule.route && oldTransportSchedule.route.length!==0 ){
        let route = oldTransportSchedule.route;
        for ( let i=0;i<route.length;i++){
            let newTransportRouteOrdinal = route[i].routeOrdinal.filter(r => String(r.transportRequirement)!==String(requirementId))
            newTransportRoute.push({
                transportVehicle: route[i].transportVehicle,
                routeOrdinal: newTransportRouteOrdinal,
            })
        }
        this.editTransportRouteByPlanId(portal, planId, {
            route: newTransportRoute,
        })
    }
}

/**
 * Xóa plan xóa bỏ cả schedule
 * @param {} portal 
 * @param {*} planId 
 */
exports.planDeleteTransportSchedule = async (portal, planId) => {
    // Tìm plan hiện tại, lấy array transportRequirements, và xóa bỏ trường transportPlan trong các requirement này
    let transportSchedule = await TransportSchedule(connect(DB_CONNECTION, portal)).findOne({transportPlan: planId });
    if (transportSchedule){
        await TransportSchedule(connect(DB_CONNECTION, portal)).findByIdAndDelete({ _id: transportSchedule._id });
    }
    // return transportPlan;
}