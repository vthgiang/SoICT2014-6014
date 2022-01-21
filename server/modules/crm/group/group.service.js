const mongoose = require("mongoose");
const { CustomerGroup, Customer } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { getCrmUnitByRole } = require("../crmUnit/crmUnit.service");
const { addPromotion, editPromotion, deletePromotion } = require("../customer/customer.service");
const { result } = require("lodash");

const createGroupCareCode = async (portal, groupId) => {

    // Tạo mã khuyến mãi
    const group = await CustomerGroup(connect(DB_CONNECTION, portal)).findById(groupId);

    const lastGroupCare = group.promotions[group.promotions.length - 1];
    let code;
    if (lastGroupCare == null) code = 'KMN001';
    else {
        let groupCareNumber = await lastGroupCare.code;
        groupCareNumber = groupCareNumber.slice(3);
        groupCareNumber = parseInt(groupCareNumber) + 1;
        if (groupCareNumber < 10) code = 'KMN00' + groupCareNumber;
        else if (groupCareNumber < 100) code = 'KMN0' + groupCareNumber;
        else code = 'KMN' + groupCareNumber;
    }
    return code;
}

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

exports.getGroupById = async (portal, companyId, id, data, userId) => {

    let groupById = await CustomerGroup(connect(DB_CONNECTION, portal)).findById(id)
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'updatedBy', select: '_id name' })
        .populate({ path: 'promotions.exceptCustomer', select:'_id name'});
    const numberOfUsers = await Customer(connect(DB_CONNECTION, portal)).countDocuments({ customerGroup: id });

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

exports.addGroupPromotion = async (portal, companyId, groupId, userId, data, role) => {
    let { value, description, minimumOrderValue, promotionalValueMax, expirationDate, exceptCustomer } = data;
    expirationDate = formatDate(expirationDate);

    const code = await createGroupCareCode(portal, groupId);
    
    let modifyGroup = await CustomerGroup(connect(DB_CONNECTION, portal)).findById(groupId);
    
    let promotions = [];
    if (modifyGroup.promotions) promotions = modifyGroup.promotions;
    const promo = {code, value, description, minimumOrderValue, promotionalValueMax, expirationDate, exceptCustomer};   
    promotions = await [...promotions, promo];
    modifyGroup.promotions = promotions;
    
    await CustomerGroup(connect(DB_CONNECTION, portal)).findByIdAndUpdate(groupId,{
        $set: modifyGroup
    }, { new: true });
    const result = await CustomerGroup(connect(DB_CONNECTION, portal)).findById(groupId)
                        .populate({ path: 'creator', select: '_id name' })
                        .populate({ path: 'updatedBy', select: '_id name' });
    return result;
}

exports.editGroupPromotion = async (portal, companyId, groupId, userId, data, role) => {
    const { promotion } = data;
    let modifyGroup = await CustomerGroup(connect(DB_CONNECTION, portal)).findById(groupId);

    let promotions = [];
    let listPromotions;
    if (modifyGroup.promotions) listPromotions = modifyGroup.promotions;
    listPromotions.forEach(x => {
        if (x.code !== promotion.code) {
            promotions = [...promotions, x];
        } else {
            promotions = [...promotions, promotion];
        }
    })
    modifyGroup.promotions = promotions;
    
    await CustomerGroup(connect(DB_CONNECTION, portal)).findByIdAndUpdate(groupId,{
        $set: modifyGroup
    }, { new: true });
    
    const result = await CustomerGroup(connect(DB_CONNECTION, portal)).findById(groupId)
                        .populate({ path: 'creator', select: '_id name' })
                        .populate({ path: 'updatedBy', select: '_id name' });
    return result;
}

exports.deleteGroupPromotion = async (portal, companyId, groupId, userId, data, role) => {

    let modifyGroup = await CustomerGroup(connect(DB_CONNECTION, portal)).findById(groupId);
    
    let promotions = [];
    let listPromotions;
    if (modifyGroup.promotions) listPromotions = modifyGroup.promotions;
    listPromotions.forEach(x => {
        if (x.code !== data.code) {
            promotions = [...promotions, x];
        }
    })
    modifyGroup.promotions = promotions;

    await CustomerGroup(connect(DB_CONNECTION, portal)).findByIdAndUpdate(groupId,{
        $set: modifyGroup
    }, { new: true });
    
    const result = await CustomerGroup(connect(DB_CONNECTION, portal)).findById(groupId)
                        .populate({ path: 'creator', select: '_id name' })
                        .populate({ path: 'updatedBy', select: '_id name' });
    return result;
}

exports.getMembersInGroup = async (portal, companyId, groupId, userId, role) => {
    let keySearch = {};
    if ( groupId ) {
        keySearch = {...keySearch, customerGroup: groupId}
    };

    let membersGroup = await Customer(connect(DB_CONNECTION, portal)).find(keySearch, "_id name");
    return membersGroup;
}