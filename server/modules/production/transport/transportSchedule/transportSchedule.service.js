const {
    TransportSchedule, TransportPlan, TransportRequirement
} = require('../../../../models');
const {
    connect
} = require(`../../../../helpers/dbHelper`);

const TransportRequirementServices = require('../transportRequirements/transportRequirements.service');
const TransportPlanServices = require('../transportPlan/transportPlan.service')

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
    // SOCKET_IO.emit("hihi", "nguyen dang trung kien");
    SOCKET_IO.on("hihi", data => {
        console.log(data);
    })
    let transportRoute = await TransportSchedule(connect(DB_CONNECTION, portal)).findOne({transportPlan: id})
    .populate([
        {
            path: 'transportPlan',
            select: 'transportVehicles transportRequirements code startTime endTime',
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
    // Nếu có data.transportVehicles -> xếp lại hàng hóa -> clear route
    if (data.transportVehicles && data.transportVehicles.length!==0){
        await TransportSchedule(connect(DB_CONNECTION, portal)).update({ _id: oldTransportSchedule._id }, { $set: {route: []} });
        await TransportPlanServices.editTransportPlanStatus(portal, planId, 1);
    }
    // Cach 2 de update
    await TransportSchedule(connect(DB_CONNECTION, portal)).update({ _id: oldTransportSchedule._id }, { $set: data });
    let newTransportSchedule = await TransportSchedule(connect(DB_CONNECTION, portal)).findById({ _id: oldTransportSchedule._id })
    .populate([
        {
            path: 'transportPlan',
            select: 'transportVehicles transportRequirements code startTime endTime',
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
    ]);
    // Đếm số lượng requirement trong route
    if (newTransportSchedule && newTransportSchedule.route && newTransportSchedule.route.length!==0
        && newTransportSchedule.transportPlan && newTransportSchedule.transportPlan.transportRequirements && newTransportSchedule.transportPlan.transportRequirements.length!==0){
        let countRequirement = 0;
        newTransportSchedule.route.map(item => {
            if (item && item.routeOrdinal){
                countRequirement += item.routeOrdinal.length;
            }
        })
        console.log(countRequirement, newTransportSchedule.transportPlan.transportRequirements.length)
        if (countRequirement === 2*newTransportSchedule.transportPlan.transportRequirements.length){
            await TransportPlanServices.editTransportPlanStatus(portal, planId, 2); 
        }
    }
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
    if (oldTransportSchedule && oldTransportSchedule.transportVehicles && oldTransportSchedule.transportVehicles.length!==0){
        let transportVehicles= oldTransportSchedule.transportVehicles;
        let newTransportRequirements = [];
        for (let i = 0; i<transportVehicles.length;i++){
            newTransportRequirements = transportVehicles[i].transportRequirements.filter(r =>String(r)!==String(requirementId))
            if (newTransportRequirements.length !==0){
                newTransportVehicles.push({
                    transportVehicle: transportVehicles[i].transportVehicle,
                    transportRequirements: newTransportRequirements,
                })
            }
        }
        this.editTransportRouteByPlanId(portal, planId, {
            transportVehicles: newTransportVehicles,
        })
    }
    // Xóa bỏ requirement trong route
    let newTransportRoute = []
    if (oldTransportSchedule && oldTransportSchedule.route && oldTransportSchedule.route.length!==0 ){
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

exports.deleteTransportVehiclesByPlanId = async (portal, planId, vehicleId) => {
    let oldTransportSchedule = await TransportSchedule(connect(DB_CONNECTION, portal)).findOne({transportPlan: planId});

    let newTransportVehicles = [];
    
    if (oldTransportSchedule && oldTransportSchedule.transportVehicles && oldTransportSchedule.transportVehicles.length!==0){
        newTransportVehicles = oldTransportSchedule.transportVehicles.filter(r=>{
            return String(r.transportVehicle) !== String(vehicleId);
        })
        this.editTransportRouteByPlanId(portal, planId, {
            transportVehicles: newTransportVehicles,
        })
    }
    // Xóa vehicle trong route
    let newTransportRoute = []
    if (oldTransportSchedule && oldTransportSchedule.route && oldTransportSchedule.route.length!==0 ){
        newTransportRoute = oldTransportSchedule.route.filter(r => {
            return  r.transportVehicle !==vehicleId;
        })
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

exports.changeTransportRequirementProcess = async (portal, data) => {

    const status = data?.status;
    const description = data?.description;
    const planId = data?.planId;
    const requirementId = data?.requirementId;
    const value = {
        transportStatus: {
            status: status,
            description: description,
        }
    }
    await TransportRequirementServices.editTransportRequirement(portal, requirementId, value);
    let transportRoute = await this.getTransportRouteByPlanId(portal, planId);
    return transportRoute;
}

exports.getAllTransportScheduleRouteByCarrierId = async (portal, carrierId) => {
    console.log(carrierId)
    let planHaveCarrierId = await TransportPlanServices.findPlansHaveCarrierId(portal, carrierId);
    let listSchedule = []
    let schedule;
    if (planHaveCarrierId && planHaveCarrierId.length!==0){
        for (let i=0;i<planHaveCarrierId.length;i++){
            schedule = await this.getTransportRouteByPlanId(portal, planHaveCarrierId[i]._id);
            if (schedule.route && schedule.route.length!==0){
                let vehicleId;
                schedule.transportPlan?.transportVehicles?.map(r => {
                    if (r.carriers && r.carriers.length!==0){
                        r.carriers.map(carrier => {
                            if (String(carrier.carrier) === String(carrierId)){
                                vehicleId = r.vehicle._id;
                            }
                        })
                    }
                })
                console.log(vehicleId);
                for (let j=0;j<schedule.route.length;j++){
                    if (String(schedule.route[j].transportVehicle._id) === String(vehicleId)){
                        listSchedule.push({
                            route: schedule.route[j],
                            transportPlan: {
                                startTime: schedule.transportPlan?.startTime,
                                endTime: schedule.transportPlan?.endTime,
                                code: schedule.transportPlan?.code,
                            }
                        })
                    }
                }
                // listSchedule.push(schedule);
            }
        }
    }
    return listSchedule;
}

exports.changeTransportStatusByCarrierId = async (portal, carrierId, data) => {
    if (data) {
        let requirementId= data.requirementId;
        let transportStatus = {
            status: data.status,
            detail: data.detail,
            locate: data.locate,
            carrier: data.carrierId,
            time: data.time
        }
        let requirementStatus = 4;
        // Khi không nhận được hàng hoặc giao được hàng => cập nhật trạng thái yêu cầu vận chuyển thất bại
        if (String(data.status)==="2"){
            requirementStatus = 6; 
        }
        if (String(data.type) === "1"){
            if (String(data.status)!=="2"){
                requirementStatus = 4;
            }
            await TransportRequirementServices.editTransportRequirement(portal, requirementId, {"transportStatus.fromAddress": transportStatus, status: requirementStatus})
        }
        else {
            if (String(data.status)!=="2"){
                requirementStatus = 5;
            }
            await TransportRequirementServices.editTransportRequirement(portal, requirementId, {"transportStatus.toAddress": transportStatus, status: requirementStatus})
        }
        let listSchedule = this.getAllTransportScheduleRouteByCarrierId(portal, carrierId);
        return listSchedule;
    }
    return -1;
}

exports.driverSendMessage = async (portal, data, userId) => {
    if (data.position){
        SOCKET_IO.emit("current position", data.position); 
    }
    return 1;   
}