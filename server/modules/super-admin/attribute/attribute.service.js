const {
    Attribute, Role, User, Policy, Component, Link
} = require('../../../models');

const {
    connect
} = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

// Tạo mới mảng Ví dụ
exports.createAttribute = async (portal, data) => {
    let newAttribute;

    const filterValidAttributeArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            for (let i = 0; i < array.length; i++) {
                const checkAttributeCreated = await Attribute(connect(DB_CONNECTION, portal)).findOne({ attributeName: array[i].attributeName }).collation({ "locale": "vi", strength: 2, alternate: "shifted", maxVariable: "space" })
                if (checkAttributeCreated) {
                    throw ['attribute_name_exist'];
                }
                if (array[i]) resArray = [...resArray, array[i]];
            }

            return resArray;
        } else {
            return [];
        }
    }

    const attrArray = await filterValidAttributeArray(data);

    if (attrArray && attrArray.length !== 0) {
        for (let i = 0; i < attrArray.length; i++) {
            newAttribute = await Attribute(connect(DB_CONNECTION, portal)).create({
                attributeName: attrArray[i].attributeName.trim(),
                description: attrArray[i].description.trim()
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
    const check = await Attribute(connect(DB_CONNECTION, portal)).findOne({ attributeName: data.attributeName }).collation({ "locale": "vi", strength: 2, alternate: "shifted", maxVariable: "space" })

    if (oldAttribute.attributeName.trim().toLowerCase().replace(/ /g, "") !== data.attributeName.trim().toLowerCase().replace(/ /g, "")) {
        if (check) throw ['attribute_name_exist'];
    }

    // Cach 2 de update
    await Attribute(connect(DB_CONNECTION, portal)).updateOne({ _id: id }, { $set: data });
    let attribute = await Attribute(connect(DB_CONNECTION, portal)).findById({ _id: oldAttribute._id });

    return attribute;
}

// Xóa một Ví dụ
exports.deleteAttributes = async (portal, attributeIds) => {
    let attributes = await Attribute(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: attributeIds.map(item => mongoose.Types.ObjectId(item)) } });

    let currentRolesHaveThisAttribute;
    let currentUsersHaveThisAttribute;
    let currentLinksHaveThisAttribute;
    let currentComponentsHaveThisAttribute;
    let currentPoliciesHaveThisAttribute;


    attributeIds.forEach(async attributeId => {
        currentRolesHaveThisAttribute = await Role(connect(DB_CONNECTION, portal))
            .find({ 'attributes.attributeId': attributeId });
        console.log('currentRolesHaveThisAttribute', currentRolesHaveThisAttribute)
        currentUsersHaveThisAttribute = await User(connect(DB_CONNECTION, portal))
            .find({ 'attributes.attributeId': attributeId });
        console.log('currentUsersHaveThisAttribute', currentUsersHaveThisAttribute)
        currentLinksHaveThisAttribute = await Link(connect(DB_CONNECTION, portal))
            .find({ 'attributes.attributeId': attributeId });
        console.log('currentLinksHaveThisAttribute', currentLinksHaveThisAttribute)
        currentComponentsHaveThisAttribute = await Component(connect(DB_CONNECTION, portal))
            .find({ 'attributes.attributeId': attributeId });
        console.log('currentComponentsHaveThisAttribute', currentComponentsHaveThisAttribute)
        currentPoliciesHaveThisAttribute = await Policy(connect(DB_CONNECTION, portal))
            .find({
                $or: [
                    { 'subject.user.userAttributes.attributeId': attributeId },
                    { 'subject.role.roleAttributes.attributeId': attributeId },
                    { 'resource.resourceAttributes.attributeId': attributeId }
                ]
            });
        console.log('currentPoliciesHaveThisAttribute', currentPoliciesHaveThisAttribute)

        if (currentRolesHaveThisAttribute.length > 0) {
            currentRolesHaveThisAttribute.forEach(async role => {
                role.attributes.splice(role.attributes.findIndex(a => a.attributeId == attributeId), 1)
                role.save()
            })
        }
        if (currentUsersHaveThisAttribute.length > 0) {
            currentUsersHaveThisAttribute.forEach(async user => {
                user.attributes.splice(user.attributes.findIndex(a => a.attributeId == attributeId), 1)
                user.save()
            })
        }
        if (currentLinksHaveThisAttribute.length > 0) {
            currentLinksHaveThisAttribute.forEach(async link => {
                link.attributes.splice(link.attributes.findIndex(a => a.attributeId == attributeId), 1)
                link.save()
            })
        }
        if (currentComponentsHaveThisAttribute.length > 0) {
            currentComponentsHaveThisAttribute.forEach(async component => {
                component.attributes.splice(component.attributes.findIndex(a => a.attributeId == attributeId), 1)
                component.save()
            })
        }
        if (currentPoliciesHaveThisAttribute.length > 0) {
            currentPoliciesHaveThisAttribute.forEach(async policy => {
                policy.subject.user.userAttributes.splice(policy.subject.user.userAttributes.findIndex(a => a.attributeId == attributeId), 1)
                policy.subject.role.roleAttributes.splice(policy.subject.role.roleAttributes.findIndex(a => a.attributeId == attributeId), 1)
                policy.resource.resourceAttributes.splice(policy.resource.resourceAttributes.findIndex(a => a.attributeId == attributeId), 1)
                policy.save()
            })
        }
    })

    return attributes;
}