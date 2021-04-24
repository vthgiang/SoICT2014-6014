const {
    TransportRequirement
} = require('../../../../models');

const {
    connect
} = require(`../../../../helpers/dbHelper`);

const TransportPlanServices = require("../transportPlan/transportPlan.service")

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
        newTransportRequirement = await TransportRequirement(connect(DB_CONNECTION, portal)).create({
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
            }
        });
        
    }

    let requirement = await TransportRequirement(connect(DB_CONNECTION, portal)).findById({ _id: newTransportRequirement._id })
                            .populate({
                                path: 'creator'
                            });
    return requirement;
}


exports.getAllTransportRequirements = async (portal, data) => {

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
    console.log(keySearch)
    let page, limit;
    page = data?.page ? Number(data.page) : 1;
    limit = data?.limit ? Number(data.limit) : 20;

    let totalList = await TransportRequirement(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let requirements = await TransportRequirement(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate({path:'transportPlan'})
        .populate({
            path: 'creator'
        })
        .populate({
            path: 'goods.good'
        })
        .skip((page - 1) * limit)
        .limit(limit);
        // .populate('TransportPlan');
    return { 
        data: requirements, 
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