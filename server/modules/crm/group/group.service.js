const mongoose = require("mongoose");
const { CustomerGroup, Customer } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { getCrmUnitByRole } = require("../crmUnit/crmUnit.service");

exports.createGroup = async (portal, companyId, userId, data, role) => {
    const { code, name, description, promotion } = data;
    //tạo trường đơn vị CSKH'
    const crmUnit = await getCrmUnitByRole(portal, companyId, role);
    //if (!crmUnit) return {};
    const newGroup = await CustomerGroup(connect(DB_CONNECTION, portal)).create({
        creator: userId,
        code: code,
        name: name,
        description: description ? description : '',
        updatedBy: userId,
        updatedAt: new Date(),
        customerCareUnit: crmUnit._id
    })
    const getNewGroup = await CustomerGroup(connect(DB_CONNECTION, portal)).findById(newGroup._id);
    console.log(getNewGroup);
    return getNewGroup;
}

exports.getGroups = async (portal, companyId, query, userId, role) => {
    const { limit, page, code, getAll } = query;
    let keySearch = {};
    if (!getAll) {
        // kta đơn vị CSKH
        const crmUnit = await getCrmUnitByRole(portal, companyId, role);
        //if (!crmUnit) return { listGroupTotal: 0, groups: [] }
        if (!crmUnit){
            keySearch = { ...keySearch, creator: userId };
        } 
        keySearch = { ...keySearch, customerCareUnit: crmUnit._id };
    }
    if (code) {
        keySearch = { ...keySearch, code: { $regex: code, $options: "i" } }
    }

    const listGroupTotal = await CustomerGroup(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let groups;
    if (page && limit)
        groups = await CustomerGroup(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
            .skip(parseInt(page)).limit(parseInt(limit));
    else
        groups = await CustomerGroup(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
    //  Tạo dữ liệu mẫu cho người lần đầu được phân quyền vào trang nhưng dữ liệu trống
    if (!groups || !groups.length) {
        await CustomerGroup(connect(DB_CONNECTION, portal)).create({
            creator: userId,
            code: "KHVIP1",
            name: "Khách VIP",
            description: "Khách VIP",
        },{
            creator: userId,
            code: "NKHKV",
            name: "Nhóm khách theo khu vực",
            description: "Nhóm khách theo khu vực",
        })
        const listGroupTotal = await CustomerGroup(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
        groups = await CustomerGroup(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
            .skip(parseInt(page)).limit(parseInt(limit));
        return { listGroupTotal, groups };
    }
    return { listGroupTotal, groups };
}

exports.getGroupById = async (portal, companyId, id) => {

    let groupById = await CustomerGroup(connect(DB_CONNECTION, portal)).findById(id)
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'updatedBy', select: '_id name' });
    const numberOfUsers = await Customer(connect(DB_CONNECTION, portal)).countDocuments({ group: id });

    return { groupById, numberOfUsers: numberOfUsers };
}


exports.editGroup = async (portal, companyId, id, data, userId) => {
    const { code, name, description, promotion } = data;

    await CustomerGroup(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: {
            updatedBy: userId,
            updatedAt: new Date(),
            code: code,
            name: name,
            description: description ? description : '',
            promotion: promotion ? promotion : '',
        }
    }, { new: true });

    return await CustomerGroup(connect(DB_CONNECTION, portal)).findOne({ _id: id });
}

exports.deleteGroup = async (portal, companyId, id) => {
    let delGroup = await CustomerGroup(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return delGroup;
}