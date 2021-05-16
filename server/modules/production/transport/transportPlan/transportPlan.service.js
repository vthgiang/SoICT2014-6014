const {
    TransportPlan
} = require('../../../../models');

const {
    connect
} = require(`../../../../helpers/dbHelper`);

const TransportScheduleServices = require('../transportSchedule/transportSchedule.service');
const TransportVehicleServices = require('../transportVehicle/transportVehicle.service');
const TransportRequirementServices = require('../transportRequirements/transportRequirements.service')

/**
 * Tạo transportPlan mới
 * @param {*} portal 
 * @param {*} data 
 * @returns 
 */
exports.createTransportPlan = async (portal, data) => {
    let newTransportPlan;
    if (data && data.length !== 0) {        
        newTransportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        supervisor: data.supervisor,
        name: data.name,
        status: 1,
        startTime: data.startDate,
        endTime: data.endDate,
        transportRequirements: data.transportRequirements,
        transportVehicles: data.transportVehicles,
        });
        // Nếu có requirements đi kèm {transportRequirements: [id, id, id...]}
        if (data.transportRequirements && data.transportRequirements.length!==0){
            for (let i=0; i<data.transportRequirements.length;i++ ){
                // Lấy dữ liệu chi tiết từng requirement để lấy transportPlan._id
                transportRequirement = await TransportRequirementServices.getTransportRequirementById(portal,data.transportRequirements[i]);
                // Xóa requirement trong plan.id cũ bảng transportPlan và cập nhật lại transportPlan mới cho requirement
                if (transportRequirement.transportPlan){
                    await this.deleteTransportRequirementByPlanId(portal, transportRequirement.transportPlan._id, data.transportRequirements[i]);
                    
                    await TransportRequirementServices.editTransportRequirement(portal, data.transportRequirements[i], {transportPlan: newTransportPlan._id, status: 3});
                }
                else {
                    await TransportRequirementServices.editTransportRequirement(portal, data.transportRequirements[i], {transportPlan: newTransportPlan._id, status: 3});
                }
            }
            
        }
    }
    await TransportScheduleServices.planCreateTransportRoute(portal, {transportPlan: newTransportPlan._id,})
    // await TransportScheduleServices.planCreateTransportRoute(portal, {transportPlan: newTransportPlan._id, planCode: newTransportPlan.code})
    let transportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById({ _id: newTransportPlan._id })
    .populate([
        {
            path : "transportRequirements transportVehicles.vehicle"
        },
        {
            path: 'transportVehicles.carriers.carrier'
        },
        {
            path: 'supervisor'
        }
    ])
    ;;
    return transportPlan;
}

/**
 * Lấy dữ liệu tất cả transportPlans
 * @param {*} portal 
 * @param {*} data 
 * @returns 
 */
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
        .populate([
            {
                path: "transportRequirements transportVehicles.vehicle"
            },
            {
                path: 'transportVehicles.carriers.carrier'
            },
            {
                path: 'supervisor'
            }
        ])
        .skip((page - 1) * limit)
        .limit(limit);
    return { 
        data: plans, 
        totalList 
    }
}

/**
 * Lấy transportPlan theo id
 * @param {*} portal 
 * @param {*} id 
 * @returns 
 */
exports.getPlanById = async (portal, id) => {
    let plan = await TransportPlan(connect(DB_CONNECTION, portal)).findById({ _id: id })
    .populate([
        {
            path: 'transportRequirements',
            select: 'geocode'
        },
        {
            path: 'transportVehicles.carriers.carrier'
        },
        {
            path: 'supervisor'
        }
    ]);
    if (plan) {
        return plan;
    }
    return -1;
}

/**
 * Chỉnh sửa transportPlan theo id
 * @param {*} portal 
 * @param {*} id 
 * @param {*} data giống transportPlan.model
 * @returns 
 */
exports.editTransportPlan = async (portal, id, data) => {
    let oldTransportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById(id);

    if (!oldTransportPlan) {
        return -1;
    }
    /**
     * Xử lí thay đổi thêm, xóa yêu cầu vận chuyển trong kế hoạch, giữ lại những yêu cầu vận chuyển chung giữa mới và cũ
     * Nếu không có điểm chung, tạo mới hoàn toàn lệnh vận chuyển
     * Xóa bỏ các kế hoạch trong plan mới, xóa bỏ trong schedule
     * Set lại plan mới
     */
    if (data.transportRequirements && data.transportRequirements.length!==0){
        data.transportRequirements.map(async requirementId => {
            await TransportRequirementServices.editTransportRequirement(portal, requirementId, {
                transportPlan: id,
                status: 3,
            }) 
        })
    }
    if (oldTransportPlan.transportRequirements && oldTransportPlan.transportRequirements.length!==0
        && data.transportRequirements && data.transportRequirements.length!==0){

            let sameTransportRequirements = oldTransportPlan.transportRequirements.filter(r=>{
                return data.transportRequirements.indexOf(String(r)) !==-1;
            })
            if (sameTransportRequirements && sameTransportRequirements.length!==0){
                let needRemoveTransportRequirements = oldTransportPlan.transportRequirements.filter(r=>{
                    return sameTransportRequirements.indexOf(String(r)) ===-1;
                })
                if (needRemoveTransportRequirements && needRemoveTransportRequirements.length!==0){
                    needRemoveTransportRequirements.map(requirementId => {
                        TransportScheduleServices.deleteTransportRequirementByPlanId(portal, id, requirementId)
                        TransportRequirementServices.editTransportRequirement(portal, requirementId, {
                            transportPlan: null,
                            status: 2,
                        })
                    })
                }
            }
            else{
                await TransportScheduleServices.planDeleteTransportSchedule(portal, id);
                await TransportScheduleServices.planCreateTransportRoute(portal,{transportPlan:id});
            }
    }
    else {
        await TransportScheduleServices.planDeleteTransportSchedule(portal, id);
        await TransportScheduleServices.planCreateTransportRoute(portal,{transportPlan:id});
    }
    if (oldTransportPlan.transportVehicles && oldTransportPlan.transportVehicles.length!==0
        && data.transportVehicles && data.transportVehicles.length!==0){
            let sameVehicle = oldTransportPlan.transportVehicles.filter(r=>{
                let flag = false;
                if (r.vehicle){
                    for (let i=0;i<data.transportVehicles.length;i++){
                        if (String(data.transportVehicles[i].vehicle) === String(r.vehicle)){
                            flag = true
                        }
                    }
                    return flag;
                }
                else{
                    return false;
                }
            })
            if (sameVehicle && sameVehicle.length!==0){
                let needRemoveTransportVehicles = oldTransportPlan.transportVehicles.filter(r=>{
                    if (r.vehicle){
                        let flag = true;
                        for (let i = 0; i< sameVehicle.length;i++){
                            if (String(sameVehicle[i].vehicle) === String(r.vehicle)){
                                flag = false;
                            }
                        }
                        if (flag){
                            return true;
                        }
                    }
                    return false;
                })
                if (needRemoveTransportVehicles && needRemoveTransportVehicles.length!==0){
                    needRemoveTransportVehicles.map(transportVehicle => {
                        TransportScheduleServices.deleteTransportVehiclesByPlanId(portal, id, transportVehicle.vehicle)
                    })
                }
            }
            else{
                await TransportScheduleServices.planDeleteTransportSchedule(portal, id);
                await TransportScheduleServices.planCreateTransportRoute(portal,{transportPlan:id});
            }
    }
    // Cach 2 de update
    data.status = 1
    await TransportPlan(connect(DB_CONNECTION, portal)).update({ _id: id }, { $set: data });
    let transportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById({ _id: oldTransportPlan._id })
    .populate([
        {
            path: "transportRequirements transportVehicles.vehicle"
        },
        {
            path: 'transportVehicles.carriers.carrier'
        },
        {
            path: 'supervisor'
        }
    ])
    return transportPlan;
}
exports.editTransportPlanStatus = async (portal, id, value) => {
    let oldTransportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById(id);

    if (!oldTransportPlan) {
        return -1;
    }
    // Cach 2 de update
    await TransportPlan(connect(DB_CONNECTION, portal)).update({ _id: id }, { $set: {status: value} });
    let transportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById({ _id: oldTransportPlan._id })
    .populate([
        {
            path: "transportRequirements transportVehicles.vehicle"
        },
        {
            path: 'transportVehicles.carriers.carrier'
        },
        {
            path: 'supervisor'
        }
    ])
    return transportPlan;    
}
/**
 * push requirement vào plan
 * @param {*} portal 
 * @param {*} planId 
 * @param {*} data = {requirement:....}
 * @returns 
 */
exports.addTransportRequirementToPlan = async (portal, planId, data) => {
    let requirementId = data.requirement;
    let transportRequirement = await TransportRequirementServices.getTransportRequirementById(portal, requirementId); // String id

    // Xóa bỏ kế hoạch vận chuyển trong kế hoạch cũ
    if (transportRequirement.transportPlan){
        console.log(transportRequirement.transportPlan._id)
        await this.deleteTransportRequirementByPlanId(portal, transportRequirement.transportPlan._id, requirementId);
    }
    // Xóa bỏ trong kế hoạch mới (chỉ để tránh trùng lặp)
    await this.deleteTransportRequirementByPlanId(portal, planId, requirementId);
    // Thêm yêu plan mới vào trường transportPlan của yêu cầu vận chuyển
    await TransportRequirementServices.editTransportRequirement(portal, requirementId, {transportPlan: planId})
    // Thêm yêu cầu vận chuyển vào kế hoạch
    let oldTransportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById(planId);

    if (!oldTransportPlan) {
        return -1;
    }
    await TransportPlan(connect(DB_CONNECTION, portal)).update({ _id: planId }, {$push: {transportRequirements: requirementId}});
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

/**
 * Xóa bỏ yêu cầu vận chuyển trong kế hoạch vận chuyển
 * @param {*} portal 
 * @param {*} planId 
 * @param {*} requirementId 
 */
exports.deleteTransportRequirementByPlanId = async (portal, planId, requirementId) => {
    let oldTransportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById(planId);
    if (oldTransportPlan){
        let listTransportRequirements = oldTransportPlan.transportRequirements;
        if (listTransportRequirements && listTransportRequirements.length!==0){
            let newListTransportRequirements = listTransportRequirements.filter(r => String(r) !== String(requirementId));
            // Set lại danh sách requirement trong plan
            await TransportPlan(connect(DB_CONNECTION, portal)).update({ _id: planId }, { $set: {transportRequirements: newListTransportRequirements}});
        }
        // Xóa bỏ yêu cầu vận chuyển trong lịch vận chuyển (nếu có)
        await TransportScheduleServices.deleteTransportRequirementByPlanId(portal, planId, requirementId);
    }
}

/**
 * Xóa kế hoạch vận chuyển hiện tại
 * Đồng thời xóa bỏ lịch vận chuyển và xóa bỏ giá trị transportPlan tương ứng trong các yêu cầu vận chuyển
 * @param {*} portal 
 * @param {*} planId 
 * @returns 
 */
exports.deleteTransportPlan = async (portal, planId) => {
    // Tìm plan hiện tại, lấy array transportRequirements, và xóa bỏ trường transportPlan trong các requirement này
    let transportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById({ _id: planId });
    if (transportPlan && transportPlan.transportRequirements && transportPlan.transportRequirements.length !==0){
        transportPlan.transportRequirements.map((item,index) => {
            TransportRequirementServices.editTransportRequirement(portal, item, {transportPlan: null, status:2})
        })
    }
    await TransportScheduleServices.planDeleteTransportSchedule(portal, planId);
    transportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findByIdAndDelete({ _id: planId });
    return transportPlan;
}

exports.onlyDeleteTransportRequirementFromPlan = async (portal, planId, requirementId) => {
    let oldTransportPlan = await TransportPlan(connect(DB_CONNECTION, portal)).findById(planId);
    if (oldTransportPlan){
        let listTransportRequirements = oldTransportPlan.transportRequirements;
        if (listTransportRequirements && listTransportRequirements.length!==0){
            let newListTransportRequirements = listTransportRequirements.filter(r => String(r) !== String(requirementId));
            await this.editTransportPlan(portal, planId, {transportRequirements: newListTransportRequirements})
        }
        // Xóa bỏ yêu cầu vận chuyển trong lịch vận chuyển (nếu có)
        await TransportScheduleServices.deleteTransportRequirementByPlanId(portal, planId, requirementId);
    }
    await TransportRequirementServices.editTransportRequirement(portal, requirementId, {transportPlan: null})
}

exports.findPlansHaveCarrierId = async (portal, carrierId) => {
    let listPlan = await TransportPlan(connect(DB_CONNECTION, portal)).find({
        "transportVehicles.carriers.carrier": carrierId,
    })
    return listPlan;
}