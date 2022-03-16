const {
    Attribute
} = require('../../../models');

const {
    connect
} = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

// Tạo mới mảng Ví dụ
exports.createAttribute = async (portal, data) => {
    let newAttribute;
    if (data && data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
            newAttribute = await Attribute(connect(DB_CONNECTION, portal)).create({
                attributeName: data[i].attributeName,
                description: data[i].description
            });
        }
        
    }

    let attribute = await Attribute(connect(DB_CONNECTION, portal)).findById({ _id: newAttribute._id });;
    return attribute;
}

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getAttributes = async (portal, data) => {
    let keySearch = {};
    if (data?.attributeName?.length > 0) {
        keySearch = {
            attributeName: {
                $regex: data.attributeName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Attribute(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let attributes = await Attribute(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * perPage)
        .limit(perPage);

    return { 
        data: attributes, 
        totalList 
    }
}

// Lấy ra một phần thông tin Ví dụ (lấy ra attributeName) theo mô hình dữ liệu số  2
exports.getOnlyAttributeName = async (portal, data) => {
    let keySearch;
    if (data?.attributeName?.length > 0) {
        keySearch = {
            attributeName: {
                $regex: data.attributeName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Attribute(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let AttributeCollection = await Attribute(connect(DB_CONNECTION, portal)).find(keySearch, { attributeName: 1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    return { 
        data: AttributeCollection,
        totalList 
    }
}

// Lấy ra Ví dụ theo id
exports.getAttributeById = async (portal, id) => {
    let attribute = await Attribute(connect(DB_CONNECTION, portal)).findById({ _id: id });
    if (attribute) {
        return attribute;
    }
    return -1;
}

// Chỉnh sửa một Ví dụ
exports.editAttribute = async (portal, id, data) => {
    let oldAttribute = await Attribute(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldAttribute) {
        return -1;
    }

    // Cach 2 de update
    await Attribute(connect(DB_CONNECTION, portal)).update({ _id: id }, { $set: data });
    let attribute = await Attribute(connect(DB_CONNECTION, portal)).findById({ _id: oldAttribute._id });

    return attribute;
}

// Xóa một Ví dụ
exports.deleteAttributes = async (portal, attributeIds) => {
    let attributes = await Attribute(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: attributeIds.map(item => mongoose.Types.ObjectId(item)) } });

    return attributes;
}