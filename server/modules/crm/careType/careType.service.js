const { CareType } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { getCrmUnitByRole } = require('../crmUnit/crmUnit.service');


exports.getCareTypes = async (portal, companyId, query, userId, role) => {
    const { page, limit, getAll } = query;
    let keySearch = {};
    if (!getAll) {
        const crmUnit = await getCrmUnitByRole(portal, companyId, role);
        if (!crmUnit){
            keySearch = { ...keySearch, creator: userId };
        } 
        keySearch = { ...keySearch, crmUnit: crmUnit._id };
    }
    //console.log('keySearch', keySearch)
    const listDocsTotal = await CareType(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    const careTypes = await CareType(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate({ path: 'creator', select: '_id name' })
    return { listDocsTotal, careTypes };
}

exports.createCareType = async (portal, companyId, data, userId, role) => {
    if (userId) {
        data = { ...data, creator: userId };
    }
    const crmUnit = await getCrmUnitByRole(portal, companyId, role);
    if (!crmUnit) return {};
    data = { ...data, crmUnit: crmUnit._id };
    const newCareType = await CareType(connect(DB_CONNECTION, portal)).create(data);
    const getNewCareType = await CareType(connect(DB_CONNECTION, portal)).findById(newCareType._id)
        .populate({ path: 'creator', select: '_id name' })
    return getNewCareType;
}
exports.editCareType = async (portal, companyId, id, data, userId) => {

    if (userId) {
        data = { ...data, updatedBy: userId };
    }



    await CareType(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: data
    }, { new: true });

    return await CareType(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'updatedBy', select: '_id name' })
}

exports.deleteCareType = async (portal, companyId, id) => {
    let delCareType = await CareType(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return delCareType;
}