const {
    TransportVehicle
} = require('../../../../models');

const {
    connect
} = require(`../../../../helpers/dbHelper`);

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