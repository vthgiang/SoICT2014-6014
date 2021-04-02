const {
    TransportSchedule
} = require('../../../../models');

const {
    connect
} = require(`../../../../helpers/dbHelper`);

exports.createTransportSchedule = async (portal, data) => {
    let newScheduleRequirement;
    if (data && data.length !== 0) {
            newScheduleRequirement = await TransportSchedule(connect(DB_CONNECTION, portal)).create({
            code: data.code,
            startTime: data.startDate,
            endTime: data.endDate,
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

exports.getAllTransportSchedules = async (portal, data) => {
    console.log("lay du lieu schedules trong service");
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

    let totalList = await TransportSchedule(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let schedules = await TransportSchedule(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * limit)
        .limit(limit);
    return { 
        data: schedules, 
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