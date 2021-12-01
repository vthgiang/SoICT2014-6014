const mongoose = require("mongoose");
const { CustomerStatus } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { getCrmUnitByRole } = require("../crmUnit/crmUnit.service");

exports.getStatus = async (portal, companyId, userId, query,role) => {
    const { limit, page,getAll } = query;
    let keySearch = {};
    if (!getAll) {
        const crmUnit = await getCrmUnitByRole(portal, companyId, role);
        //if (!crmUnit) return { listStatusTotal: 0, listStatus: [] }
        if (!crmUnit){
            keySearch = { ...keySearch, creator: userId };
        } 
        keySearch = { ...keySearch, customerCareUnit: crmUnit._id };
    }
    const listStatusTotal = await CustomerStatus(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    const listStatus = await CustomerStatus(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate({ path: 'creator', select: '_id name' })
    // .skip(parseInt(page)).limit(parseInt(limit));
    return { listStatusTotal, listStatus };
}

exports.getStatusById = async (portal, companyId, id) => {
    const statusById = await CustomerStatus(connect(DB_CONNECTION, portal)).findById(id);
    return statusById;
}

exports.createStatus = async (portal, companyId, userId, data,role) => {
    const { name, description } = data;
    // tao du lieu truong don vi CSKH
      const crmUnit = await getCrmUnitByRole(portal, companyId, role);
    const newStatus = await CustomerStatus(connect(DB_CONNECTION, portal)).create({
        creator: userId,
        name: name,
        description: description ? description : '',
        customerCareUnit: crmUnit._id
    })

    const getNewStatus = await CustomerStatus(connect(DB_CONNECTION, portal)).findById(newStatus._id)
        .populate({ path: 'creator', select: '_id name' })
        ;
    return getNewStatus;
}

exports.editStatus = async (portal, companyId, id, data, userId) => {
    const { name, description } = data;

    await CustomerStatus(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: {
            creator: userId,
            name: name,
            description: description ? description : '',
        }
    }, { new: true });

    return await CustomerStatus(connect(DB_CONNECTION, portal)).findOne({ _id: id }).populate({ path: 'creator', select: '_id name' });
}

exports.deleteStatus = async (portal, companyId, id) => {
    let deleteStatus = await CustomerStatus(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return deleteStatus;
}


