const { CustomerRankPoint } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { getCrmUnitByRole } = require('../crmUnit/crmUnit.service');


exports.getCustomerRankPoints = async (portal, companyId, userId, query, role) => {

    const { page, limit,getAll } = query;
    let keySearch = {};
    if (!getAll) {
        const crmUnit = await getCrmUnitByRole(portal, companyId, role);
        //if (!crmUnit) return { listDocsTotal: 0, customerRankPoints: [] }
        if (!crmUnit){
            keySearch = { ...keySearch, creator: userId };
        } 
        keySearch = { ...keySearch, crmUnit: crmUnit._id };
    }
    const listDocsTotal = await CustomerRankPoint(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    const customerRankPoints = await CustomerRankPoint(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'updatedBy', select: '_id name' })


    return { listDocsTotal, customerRankPoints: customerRankPoints.sort((a, b) => (a.point < b.point) ? 1 : -1) };
}
//.sort((a, b) => (a.point > b.point) ? 1 : -1)
exports.createCustomerRankPoint = async (portal, companyId, data, userId,role) => {
    const crmUnit = await getCrmUnitByRole(portal, companyId, role);
    //if (!crmUnit) return {}
    data = { ...data, crmUnit: crmUnit._id };
    if (userId) {
        data = { ...data, creator: userId, updatedBy: userId };
    }
    const newCustomerRankPoint = await CustomerRankPoint(connect(DB_CONNECTION, portal)).create(data);

    const getNewCustomerRankPoint = await CustomerRankPoint(connect(DB_CONNECTION, portal)).findById(newCustomerRankPoint._id)
        .populate({ path: 'creator', select: '_id name' });

    return getNewCustomerRankPoint;
}
exports.editCustomerRankPoint = async (portal, companyId, id, data, userId) => {

    if (userId) {
        data = { ...data, updatedBy: userId };
    }



    await CustomerRankPoint(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: data
    }, { new: true });

    return await CustomerRankPoint(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'updatedBy', select: '_id name' })
}

exports.deleteCustomerRankPoint = async (portal, companyId, id) => {
    let delCustomerRankPoint = await CustomerRankPoint(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return delCustomerRankPoint;
}