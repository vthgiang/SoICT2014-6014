const {
    Example
} = require('../../models');

const {
    connect
} = require(`../../helpers/dbHelper`);
const mongoose = require('mongoose');

// Tạo mới mảng Ví dụ
exports.createExample = async (portal, data) => {
    let newExample;
    if (data && data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
            newExample = await Example(connect(DB_CONNECTION, portal)).create({
                exampleName: data[i].exampleName,
                description: data[i].description
            });
        }
        
    }

    let example = await Example(connect(DB_CONNECTION, portal)).findById({ _id: newExample._id });;
    return example;
}

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getExamples = async (portal, data) => {
    let keySearch = {};
    if (data?.exampleName?.length > 0) {
        keySearch = {
            exampleName: {
                $regex: data.exampleName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Example(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let examples = await Example(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * perPage)
        .limit(perPage);

    return { 
        data: examples, 
        totalList 
    }
}

// Lấy ra một phần thông tin Ví dụ (lấy ra exampleName) theo mô hình dữ liệu số  2
exports.getOnlyExampleName = async (portal, data) => {
    let keySearch;
    if (data?.exampleName?.length > 0) {
        keySearch = {
            exampleName: {
                $regex: data.exampleName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Example(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let ExampleCollection = await Example(connect(DB_CONNECTION, portal)).find(keySearch, { exampleName: 1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    return { 
        data: ExampleCollection,
        totalList 
    }
}

// Lấy ra Ví dụ theo id
exports.getExampleById = async (portal, id) => {
    let example = await Example(connect(DB_CONNECTION, portal)).findById({ _id: id });
    if (example) {
        return example;
    }
    return -1;
}

// Chỉnh sửa một Ví dụ
exports.editExample = async (portal, id, data) => {
    let oldExample = await Example(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldExample) {
        return -1;
    }

    // Cach 2 de update
    await Example(connect(DB_CONNECTION, portal)).update({ _id: id }, { $set: data });
    let example = await Example(connect(DB_CONNECTION, portal)).findById({ _id: oldExample._id });

    return example;
}

// Xóa một Ví dụ
exports.deleteExamples = async (portal, exampleIds) => {
    let examples = await Example(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: exampleIds.map(item => mongoose.Types.ObjectId(item)) } });

    return examples;
}