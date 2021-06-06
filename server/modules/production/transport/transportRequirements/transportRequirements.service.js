const {
    TransportRequirement
} = require('../../../../models');

const {
    connect
} = require(`../../../../helpers/dbHelper`);

const TransportPlanServices = require("../transportPlan/transportPlan.service")
const TransportDepartmentServices = require("../transportDepartment/transportDepartment.service")

// Tạo mới mảng Ví dụ
exports.createTransportRequirement = async (portal, data, userId) => {
    let newTransportRequirement;
    if (data && data.length !== 0) {
        let listGoods = [];
        if (data.goods){
            data.goods.map(item => {
                listGoods.push({
                    good: item.good,
                    quantity: item.quantity,
                    volume: item.volume,
                    payload: item.payload
                })
            })
        }
        let listTime = [];
        if (data.timeRequests){
            data.timeRequests.map(item => {
                listTime.push({
                    timeRequest: item.timeRequest,
                    description: item.description,
                })
            })
        }
        let newTransportRequirementData = {
            status: data.status,
            code: data.code,
            type: data.type,
            creator: userId,
            fromAddress: data.fromAddress,
            toAddress: data.toAddress,
            goods: listGoods,
            timeRequests: listTime,
            volume: data.volume,
            payload: data.payload,
            geocode: {
                fromAddress: {
                    lat: data.fromLat,
                    lng: data.fromLng,
                },
                toAddress: {
                    lat: data.toLat,
                    lng: data.toLng,
                },
            },
            approver: data.approver,
            department: data.department,

        }
        if (data.bill){
            newTransportRequirementData.bill = data.bill;
        };
        if (data.detail1){
            newTransportRequirementData.detail1 = data.detail1;
        };
        if (data.detail2){
            newTransportRequirementData.detail2 = data.detail2;
        };
        newTransportRequirement = await TransportRequirement(connect(DB_CONNECTION, portal)).create(newTransportRequirementData);
        
    }

    let requirement = await TransportRequirement(connect(DB_CONNECTION, portal)).findById({ _id: newTransportRequirement._id })
                            .populate([
                                {
                                    path: 'creator'
                                },
                                {
                                    path: 'approver'
                                }
                            ])                            
                            .populate({
                                path: 'goods.good'
                            });
    return requirement;
}


exports.getAllTransportRequirements = async (portal, data) => {
    let currentUserId = String(data.currentUserId);
    let currentRole = String(data.currentRole);
    let keySearch = {};
    // if (data?.exampleName?.length > 0) {
    //     keySearch = {
    //         exampleName: {
    //             $regex: data.exampleName,
    //             $options: "i"
    //         }
    //     }
    // }
    if (data.status){
        keySearch.status = data.status;
    }
    let page, limit;
    page = data?.page ? Number(data.page) : 1;
    limit = data?.limit ? Number(data.limit) : 20;
    let totalList;
    let requirements;
    if (data?.page && data?.limit){    
        totalList = await TransportRequirement(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
        requirements = await TransportRequirement(connect(DB_CONNECTION, portal)).find(keySearch)
            .populate({path:'transportPlan'})
            .populate({
                path: 'creator'
            })
            .populate({
                path: 'goods.good'
            })
            .populate({
                path: 'transportPlan',
                populate: {
                    path: 'supervisor'
                }
            })
            .populate({
                path: 'department',
                populate: {
                    path: 'type.roleOrganizationalUnit organizationalUnit',
                    populate: [{
                        path: "users",
                        populate: [{
                            path: "userId"
                        }]
                    }]
                }
            })
            .skip((page - 1) * limit)
            .limit(limit);
    }
    else {
        totalList = await TransportRequirement(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
        requirements = await TransportRequirement(connect(DB_CONNECTION, portal)).find(keySearch)
            .populate({path:'transportPlan'})
            .populate({
                path: 'creator'
            })
            .populate({
                path: 'goods.good'
            })
            .populate({
                path: 'approver'
            })
            .populate({                
                path: 'transportPlan',
                populate: {
                    path: 'supervisor'
                }
            })
            .populate({
                path: 'department',
                populate: {
                    path: 'type.roleOrganizationalUnit organizationalUnit',
                    populate: [{
                        path: "users",
                        populate: [{
                            path: "userId"
                        }]
                    }]
                }
            })
    }
    let res = [];

    // Lấy danh sách người phê duyệt, xếp lịch
    // let headerUser = await TransportDepartmentServices.getUserByRole(portal, {currentUserId: currentUserId, role: 1});
    
    // let checkCurrentIdIsHearder = false;
    // if (headerUser && headerUser.list && headerUser.list.length!==0){
    //     headerUser.list.map(item => {
    //         if (String(item._id) === currentUserId){
    //             checkCurrentIdIsHearder = true;
    //         }
    //     })
    // }
    for (let i=0;i<requirements.length;i++){
        // Trưởng đơn vị, người xếp lịch được xem các yêu cầu gửi tới đơn vị mình
        let flag=true;
        let checkCurrentIdIsHearder = false;
        // if (flag && checkCurrentIdIsHearder && headerUser && headerUser.list && headerUser.list.length!==0){
            let department = requirements[i].department;
            if (department){
                let type = department.type.filter(r => Number(r.roleTransport) === 1);
                if (type && type.length !==0){
                    type.map(x => {
                        if (x.roleOrganizationalUnit && x.roleOrganizationalUnit.length !==0){
                            x.roleOrganizationalUnit.map(organization => {
                                if (String(organization._id) === currentRole){
                                    if (organization.users && organization.users.length !==0){
                                        organization.users.map(user => {
                                            if (user.userId && String(user.userId._id) === String(currentUserId)){
                                                checkCurrentIdIsHearder = true;
                                            }
                                        });
                                        if (checkCurrentIdIsHearder){
                                            
                                            organization.users.map(user => {
                                                
                                                if (String(user.userId?._id) === String(requirements[i].approver?._id) && flag){                                                    
                                                    res.push(requirements[i]);
                                                    flag = false;
                                                }
                                            });
                                        }
                                    }
                                }
                            })
                        }
                    })
                // }
            }
            // headerUser.list.map(item => {
            //     if (String(item._id) === String(requirements[i].approver?._id) && flag){
            //         res.push(requirements[i]);
            //         flag=false;
            //     }
            // })
        }
        // Người tạo được xem
        if (flag && String(requirements[i].creator?._id) === String(currentUserId)){
            res.push(requirements[i]);
            flag=false;
            continue;
        }
        if (flag && (String(requirements[i].transportPlan?.supervisor?._id) === currentUserId)){
            res.push(requirements[i]);
            flag=false;
            continue;
        }

    }

        // .populate('TransportPlan');
    return { 
        data: res, 
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

// // Lấy ra Ví dụ theo id
// exports.getExampleById = async (portal, id) => {
//     let example = await Example(connect(DB_CONNECTION, portal)).findById({ _id: id });
//     if (example) {
//         return example;
//     }
//     return -1;
// }

// Chỉnh sửa một Ví dụ
exports.editTransportRequirement = async (portal, id, data) => {

    let oldTransportRequirement = await TransportRequirement(connect(DB_CONNECTION, portal)).findById(id);

    if (!oldTransportRequirement) {
        return -1;
    }

    // Cach 2 de update
    await TransportRequirement(connect(DB_CONNECTION, portal)).update({ _id: id }, { $set: data });


    let transportRequirement = await TransportRequirement(connect(DB_CONNECTION, portal)).findById({ _id: oldTransportRequirement._id })
    .populate([
        {
            path: 'transportPlan'
        },
        {
            path: 'creator'
        },
        {
            path: 'goods.good'
        },
        {
            path: 'approver'
        }
    ])        
    return transportRequirement;
}

/**
 * Xóa yêu cầu vận chuyển => xóa trong plan => xóa trong lịch vận chuyển: route, transportVehicles(hàng trên xe)
 * @param {*} portal 
 * @param {*} id 
 * @returns 
 */
exports.deleteTransportRequirement = async (portal, id) => {
    let deleteRequirement = await TransportRequirement(connect(DB_CONNECTION, portal)).findOne({_id: id});
    if (deleteRequirement && deleteRequirement.transportPlan){
        await TransportPlanServices.deleteTransportRequirementByPlanId(portal, deleteRequirement.transportPlan, id);
    }
    let requirement = await TransportRequirement(connect(DB_CONNECTION, portal)).findByIdAndDelete({ _id: id });
    return requirement;
}

exports.getTransportRequirementById = async (portal, id) => {
    let transportRequirement = await TransportRequirement(connect(DB_CONNECTION, portal)).findById({ _id: id })
    .populate([
        {
            path: 'transportPlan',
        },
        {
            path: 'goods.good',
        }
    ]);
    if (transportRequirement) {
        return transportRequirement;
    }
    return -1;
}