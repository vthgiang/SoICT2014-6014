const {
    Delegation,
    Privilege,
    UserRole,
    Role
} = require('../../models');

const {
    connect
} = require(`../../helpers/dbHelper`);
const mongoose = require('mongoose');

// Tạo mới mảng Ví dụ
exports.createDelegation = async (portal, data) => {
    let newDelegation;
    const filterValidDelegationArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            for (let i = 0; i < array.length; i++) {
                const checkDelegationCreated = await Delegation(connect(DB_CONNECTION, portal)).findOne({ delegationName: array[i].delegationName }).collation({ "locale": "vi", strength: 2, alternate: "shifted", maxVariable: "space" })
                if (checkDelegationCreated) {
                    throw ['delegation_name_exist'];
                }
                if (array[i]) resArray = [...resArray, array[i]];
            }

            return resArray;
        } else {
            return [];
        }
    }

    const delArray = await filterValidDelegationArray(data);
    if (delArray && delArray.length !== 0) {
        for (let i = 0; i < delArray.length; i++) {
            let delegateRole = await Role(connect(DB_CONNECTION, portal)).findById({ _id: delArray[i].delegateRole });
            let delegatePrivileges = delArray[i].allPrivileges ? null : await Privilege(connect(DB_CONNECTION, portal)).find({ roleId: { $in: [delArray[i].delegateRole].concat(delegateRole.parents) }, resourceId: { $in: delArray[i].delegateLinks } })
            // console.log('delegatePrivileges', delegatePrivileges)
            newDelegation = await Delegation(connect(DB_CONNECTION, portal)).create({
                delegationName: delArray[i].delegationName,
                description: delArray[i].description,
                delegator: delArray[i].delegator,
                delegatee: delArray[i].delegatee,
                delegateType: "Role",
                delegateRole: delArray[i].delegateRole,
                allPrivileges: delArray[i].allPrivileges,
                delegatePrivileges: delegatePrivileges != null ? delegatePrivileges.map(p => p._id) : null,
                startDate: delArray[i].delegationStart,
                endDate: delArray[i].delegationEnd
            });
        }

    }

    let delegation = await Delegation(connect(DB_CONNECTION, portal)).findById({ _id: newDelegation._id });
    let newUserRole = await UserRole(connect(DB_CONNECTION, portal)).create({
        userId: delegation.delegatee,
        roleId: delegation.delegateRole
    });
    newUserRole.delegations.indexOf(delegation._id) === -1 ? newUserRole.delegations.push(delegation._id) : null
    newUserRole.save();

    return delegation;
}

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getDelegations = async (portal, data) => {
    let keySearch = { delegator: data.userId };
    if (data?.delegationName?.length > 0) {
        keySearch = {
            ...keySearch,
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
    delegationIds.forEach(async delegationId => {
        await UserRole(connect(DB_CONNECTION, portal)).deleteOne({ delegations: delegationId });
    })
    return delegations;
}