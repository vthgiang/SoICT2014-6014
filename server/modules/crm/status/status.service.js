const mongoose = require("mongoose");
const { Status } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { getCrmUnitByRole } = require("../crmUnit/crmUnit.service");

exports.getStatus = async (portal, companyId, query,role) => {
    const { limit, page,getAll } = query;
    let keySearch = {};
    if (!getAll) {
        const crmUnit = await getCrmUnitByRole(portal, companyId, role);
        if (!crmUnit) return { listStatusTotal: 0, listStatus: [] }
        keySearch = { ...keySearch, crmUnit: crmUnit._id }
    }
    const listStatusTotal = await Status(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    const listStatus = await Status(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate({ path: 'creator', select: '_id name' })
    // .skip(parseInt(page)).limit(parseInt(limit));
    return { listStatusTotal, listStatus };
}

exports.getStatusById = async (portal, companyId, id) => {
    const statusById = await Status(connect(DB_CONNECTION, portal)).findById(id);
    return statusById;
}

exports.createStatus = async (portal, companyId, userId, data,role) => {
    const { name, description } = data;
    // tao du lieu truong don vi CSKH
      const crmUnit = await getCrmUnitByRole(portal, companyId, role);
    const newStatus = await Status(connect(DB_CONNECTION, portal)).create({
        creator: userId,
        name: name,
        description: description ? description : '',
        crmUnit: crmUnit._id
    })

    const getNewStatus = await Status(connect(DB_CONNECTION, portal)).findById(newStatus._id)
        .populate({ path: 'creator', select: '_id name' })
        ;
    return getNewStatus;
}

exports.editStatus = async (portal, companyId, id, data, userId) => {
    const { name, description } = data;

    await Status(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: {
            creator: userId,
            name: name,
            description: description ? description : '',
        }
    }, { new: true });

    return await Status(connect(DB_CONNECTION, portal)).findOne({ _id: id }).populate({ path: 'creator', select: '_id name' });
}

exports.deleteStatus = async (portal, companyId, id) => {
    let deleteStatus = await Status(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return deleteStatus;
}


