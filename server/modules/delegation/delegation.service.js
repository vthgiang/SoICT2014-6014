const {
    Delegation
} = require('../../models');

const {
    connect
} = require(`../../helpers/dbHelper`);
const mongoose = require('mongoose');

// Tạo mới mảng Ví dụ
exports.createDelegation = async (portal, data) => {
    let newDelegation;
    if (data && data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
            newDelegation = await Delegation(connect(DB_CONNECTION, portal)).create({
                delegationName: data[i].delegationName,
                description: data[i].description
            });
        }

    }

    let delegation = await Delegation(connect(DB_CONNECTION, portal)).findById({ _id: newDelegation._id });;
    return delegation;
}

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getDelegations = async (portal, data) => {
    let keySearch = {};
    if (data?.delegationName?.length > 0) {
        keySearch = {
            delegationName: {
                $regex: data.delegationName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Delegation(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let delegations = await Delegation(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        data: delegations,
        totalList
    }
}

// Lấy ra một phần thông tin Ví dụ (lấy ra delegationName) theo mô hình dữ liệu số  2
exports.getOnlyDelegationName = async (portal, data) => {
    let keySearch;
    if (data?.delegationName?.length > 0) {
        keySearch = {
            delegationName: {
                $regex: data.delegationName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Delegation(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let DelegationCollection = await Delegation(connect(DB_CONNECTION, portal)).find(keySearch, { delegationName: 1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        data: DelegationCollection,
        totalList
    }
}

// Lấy ra Ví dụ theo id
exports.getDelegationById = async (portal, id) => {
    let delegation = await Delegation(connect(DB_CONNECTION, portal)).findById({ _id: id });
    if (delegation) {
        return delegation;
    }
    return -1;
}

// Chỉnh sửa một Ví dụ
exports.editDelegation = async (portal, id, data) => {
    let oldDelegation = await Delegation(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldDelegation) {
        return -1;
    }

    // Cach 2 de update
    await Delegation(connect(DB_CONNECTION, portal)).update({ _id: id }, { $set: data });
    let delegation = await Delegation(connect(DB_CONNECTION, portal)).findById({ _id: oldDelegation._id });

    return delegation;
}

// Xóa một Ví dụ
exports.deleteDelegations = async (portal, delegationIds) => {
    let delegations = await Delegation(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: delegationIds.map(item => mongoose.Types.ObjectId(item)) } });

    return delegations;
}