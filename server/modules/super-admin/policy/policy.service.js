const {
    Policy
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

    const polArray = await filterValidPolicyArray(data);
    
    if (polArray && polArray.length !== 0) {
        for (let i = 0; i < polArray.length; i++) {
            newPolicy = await Policy(connect(DB_CONNECTION, portal)).create({
                policyName: polArray[i].policyName.trim(),
                description: polArray[i].description.trim(),
                rules: polArray[i].rules
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

    // Cach 2 de update
    await Policy(connect(DB_CONNECTION, portal)).update({ _id: id }, { $set: data });
    let policy = await Policy(connect(DB_CONNECTION, portal)).findById({ _id: oldPolicy._id });

    return policy;
}

// Xóa một Ví dụ
exports.deletePolicies = async (portal, policyIds) => {
    let policies = await Policy(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: policyIds.map(item => mongoose.Types.ObjectId(item)) } });

    return policies;
}