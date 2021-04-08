const {
    TransportRequirement
} = require('../../../../models');

const {
    connect
} = require(`../../../../helpers/dbHelper`);

// Tạo mới mảng Ví dụ
exports.createTransportRequirement = async (portal, data) => {
    let newTransportRequirement;
    if (data && data.length !== 0) {
        let listGoods = [];
        if (data.goods){
            data.goods.map(item => {
                listGoods.push({
                    good: item.good,
                    quantity: item.quantity,
                    volume: item.volume
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
            type: data.type,
            fromAddress: data.fromAddress,
            toAddress: data.toAddress,
            goods: listGoods,
            timeRequests: listTime,
        });
        
    }

    // let example = await Example(connect(DB_CONNECTION, portal)).findById({ _id: newExample._id });;
    // return example;
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

    let page, limit;
    page = data?.page ? Number(data.page) : 1;
    limit = data?.limit ? Number(data.limit) : 20;

    let totalList = await TransportRequirement(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let requirements = await TransportRequirement(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * limit)
        .limit(limit);
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
    let transportRequirement = await TransportRequirement(connect(DB_CONNECTION, portal)).findById({ _id: oldTransportRequirement._id });
    return transportRequirement;
}

// // Xóa một Ví dụ
// exports.deleteExample = async (portal, id) => {
//     let example = Example(connect(DB_CONNECTION, portal)).findByIdAndDelete({ _id: id });
//     return example;
// }