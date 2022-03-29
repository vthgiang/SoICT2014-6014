const {
    Policy,
    Attribute
} = require('../../../models');

const {
    connect
} = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

// Tạo mới mảng Ví dụ
exports.createPolicy = async (portal, data) => {
    let newPolicy;

    const filterValidPolicyArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            for (let i = 0; i < array.length; i++) {
                const checkPolicyCreated = await Policy(connect(DB_CONNECTION, portal)).findOne({ policyName: array[i].policyName }).collation({ "locale": "vi", strength: 2, alternate: "shifted", maxVariable: "space" })
                if (checkPolicyCreated) {
                    throw ['policy_name_exist'];
                }
                if (array[i]) resArray = [...resArray, array[i]];
            }

            return resArray;
        } else {
            return [];
        }
    }
    const filterValidAttributeArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            if ((new Set(array.map(attr => attr.attributeId.toLowerCase().replace(/ /g, "")))).size !== array.length) {
                throw ['attribute_selected_duplicate'];
            }

            for (let i = 0; i < array.length; i++) {
                const attribute = await Attribute(connect(DB_CONNECTION, portal)).findOne({ _id: array[i].attributeId });
                if (array[i]) {
                    array[i] = { ...array[i], name: attribute.attributeName };
                    resArray = [...resArray, array[i]];
                }
            }

            return resArray;
        } else {
            return [];
        }
    }
    const filterValidAttributeData = async (array) => {
        const attrArray = await filterValidAttributeArray(array);
        const dataAttr = attrArray.map(attr => {
            return {
                attributeId: attr.attributeId,
                name: attr.name.trim(),
                value: attr.value.trim(),
            }
        });
        return dataAttr
    }

    const polArray = await filterValidPolicyArray(data);
    console.log(data)
    if (polArray && polArray.length !== 0) {
        for (let i = 0; i < polArray.length; i++) {
            const userDataAttr = await filterValidAttributeData(polArray[i].subject.user.userAttributes);
            const roleDataAttr = await filterValidAttributeData(polArray[i].subject.role.roleAttributes);
            const resourceDataAttr = await filterValidAttributeData(polArray[i].resource.resourceAttributes);

            newPolicy = await Policy(connect(DB_CONNECTION, portal)).create({
                policyName: polArray[i].policyName.trim(),
                description: polArray[i].description.trim(),
                subject: {
                    user: {
                        userAttributes: userDataAttr,
                        userRule: polArray[i].subject.user.userRule
                    },
                    role: {
                        roleAttributes: roleDataAttr,
                        roleRule: polArray[i].subject.role.roleRule
                    }
                },
                resource: {
                    resourceAttributes: resourceDataAttr,
                    resourceRule: polArray[i].resource.resourceRule
                },
            });
        }

    }

    let policy = await Policy(connect(DB_CONNECTION, portal)).findById({ _id: newPolicy._id });;
    return policy;
}

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getPolicies = async (portal, data) => {
    let keySearch = {};
    if (data?.policyName?.length > 0) {
        keySearch = {
            policyName: {
                $regex: data.policyName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Policy(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let policies = await Policy(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        data: policies,
        totalList
    }
}

// Lấy ra một phần thông tin Ví dụ (lấy ra policyName) theo mô hình dữ liệu số  2
exports.getOnlyPolicyName = async (portal, data) => {
    let keySearch;
    if (data?.policyName?.length > 0) {
        keySearch = {
            policyName: {
                $regex: data.policyName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Policy(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let PolicyCollection = await Policy(connect(DB_CONNECTION, portal)).find(keySearch, { policyName: 1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        data: PolicyCollection,
        totalList
    }
}

// Lấy ra Ví dụ theo id
exports.getPolicyById = async (portal, id) => {
    let policy = await Policy(connect(DB_CONNECTION, portal)).findById({ _id: id });
    if (policy) {
        return policy;
    }
    return -1;
}

// Chỉnh sửa một Ví dụ
exports.editPolicy = async (portal, id, data) => {
    let oldPolicy = await Policy(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldPolicy) {
        return -1;
    }
    const check = await Policy(connect(DB_CONNECTION, portal)).findOne({ policyName: data.policyName }).collation({ "locale": "vi", strength: 2, alternate: "shifted", maxVariable: "space" })

    if (oldPolicy.policyName.trim().toLowerCase().replace(/ /g, "") !== data.policyName.trim().toLowerCase().replace(/ /g, "")) {
        if (check) throw ['policy_name_exist'];
    }

    const filterValidAttributeArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            if ((new Set(array.map(attr => attr.attributeId.toLowerCase().replace(/ /g, "")))).size !== array.length) {
                throw ['attribute_selected_duplicate'];
            }

            for (let i = 0; i < array.length; i++) {
                const attribute = await Attribute(connect(DB_CONNECTION, portal)).findOne({ _id: array[i].attributeId });
                if (array[i]) {
                    array[i] = { ...array[i], name: attribute.attributeName };
                    resArray = [...resArray, array[i]];
                }
            }

            return resArray;
        } else {
            return [];
        }
    }
    const filterValidAttributeData = async (array) => {
        const attrArray = await filterValidAttributeArray(array);
        const dataAttr = attrArray.map(attr => {
            return {
                attributeId: attr.attributeId,
                name: attr.name.trim(),
                value: attr.value.trim(),
            }
        });
        return dataAttr
    }

    const userDataAttr = await filterValidAttributeData(data.subject.user.userAttributes);
    const roleDataAttr = await filterValidAttributeData(data.subject.role.roleAttributes);
    const resourceDataAttr = await filterValidAttributeData(data.resource.resourceAttributes);

    await Policy(connect(DB_CONNECTION, portal)).update({ _id: id }, {
        $set: {
            policyName: data.policyName.trim(),
            description: data.description.trim(),
            subject: {
                user: {
                    userAttributes: userDataAttr,
                    userRule: data.subject.user.userRule
                },
                role: {
                    roleAttributes: roleDataAttr,
                    roleRule: data.subject.role.roleRule
                }
            },
            resource: {
                resourceAttributes: resourceDataAttr,
                resourceRule: data.resource.resourceRule
            },
        }
    });


    // Cach 2 de update
    // await Policy(connect(DB_CONNECTION, portal)).update({ _id: id }, { $set: data });
    let policy = await Policy(connect(DB_CONNECTION, portal)).findById({ _id: oldPolicy._id });

    return policy;
}

// Xóa một Ví dụ
exports.deletePolicies = async (portal, policyIds) => {
    let policies = await Policy(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: policyIds.map(item => mongoose.Types.ObjectId(item)) } });

    return policies;
}