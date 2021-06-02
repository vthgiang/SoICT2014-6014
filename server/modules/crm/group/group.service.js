const mongoose = require("mongoose");
const { Group, Customer } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);

exports.createGroup = async (portal, companyId, userId, data) => {
    const { code, name, description, promotion } = data;
    const newGroup = await Group(connect(DB_CONNECTION, portal)).create({
        creator: userId,
        code: code,
        name: name,
        description: description ? description : '',
        updatedBy:userId,
        updatedAt: new Date()
    })

    const getNewGroup = await Group(connect(DB_CONNECTION, portal)).findById(newGroup._id);
    return getNewGroup;
}

exports.getGroups = async (portal, companyId, query) => {
    const { limit, page, code } = query;
    let keySearch = {};
    if(code){
        keySearch = {...keySearch, code: { $regex: code, $options: "i" }}
    }

    const listGroupTotal = await Group(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    const groups = await Group(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
        .skip(parseInt(page)).limit(parseInt(limit));
    return { listGroupTotal, groups };
}

exports.getGroupById = async (portal, companyId, id) => {

    let groupById = await Group(connect(DB_CONNECTION, portal)).findById(id)
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'updatedBy', select: '_id name' });
        const numberOfUsers = await Customer(connect(DB_CONNECTION, portal)).countDocuments({group : id });
        
    return {groupById,numberOfUsers: numberOfUsers};
}


exports.editGroup = async (portal, companyId, id, data, userId) => {
    const { code, name, description, promotion } = data;

    await Group(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: {
            updatedBy:userId,
            updatedAt: new Date(),
            code: code,
            name: name,
            description: description ? description : '',
            promotion: promotion ? promotion : '',
        }
    }, { new: true });

    return await Group(connect(DB_CONNECTION, portal)).findOne({ _id: id });
}

exports.deleteGroup = async (portal, companyId, id) => {
    let delGroup = await Group(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return delGroup;
}