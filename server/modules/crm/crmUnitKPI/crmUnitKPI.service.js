const { CrmUnitKPI } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { getCrmUnitByRole, createCrmUnit } = require('../crmUnit/crmUnit.service');


exports.getCrmUnitKPI = async (portal, companyId, userId, role) => {
    let keySearch = {};
    const crmUnit = await getCrmUnitByRole(portal, companyId, role);
    //if (!crmUnit) return { listDocsTotal: 0, CrmUnitKPI: {} }
    if (!crmUnit){
        keySearch = { ...keySearch, creator: userId };
    } 
    keySearch = { ...keySearch, crmUnit: crmUnit._id };
    const listDocsTotal = await CrmUnitKPI(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    const getCrmUnitKPI = await CrmUnitKPI(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate({ path: 'creator', select: '_id name' })
    if (!getCrmUnitKPI || !getCrmUnitKPI.length) {
        //
        const data = {
            completionRate: {value:100,weight:30},
            solutionRate: {value:100,weight:30},
            customerRetentionRate: {value:100,weight:30},
            numberOfNewCustomers: {value:100,weight:30},
            newCustomerBuyingRate: {value:100,weight:30},
            totalActions:{value:100,weight:30}
        }
        const crmUnitKPI = await createCrmUnitKPI(portal, companyId, data, userId, role);
        return { listDocsTotal, crmUnitKPI: crmUnitKPI}
    }
    return { listDocsTotal, crmUnitKPI: getCrmUnitKPI[0] };
}

const createCrmUnitKPI = async (portal, companyId, data, userId, role) => {
    if (userId) {
        data = { ...data, creator: userId, updatedBy: userId, updatedAt: new Date(), createdAt: new Date() };
    }
    const crmUnit = await getCrmUnitByRole(portal, companyId, role);
    //if (!crmUnit) return {};
    if (!crmUnit){
        data = { ...data, creator: userId };
    }
    data = { ...data, crmUnit: crmUnit._id };
    const newCrmUnitKPI = await CrmUnitKPI(connect(DB_CONNECTION, portal)).create(data);
    const getNewCrmUnitKPI = await CrmUnitKPI(connect(DB_CONNECTION, portal)).findById(newCrmUnitKPI._id)
        .populate({ path: 'creator', select: '_id name' })
    return getNewCrmUnitKPI;
}
exports.editCrmUnitKPI = async (portal, companyId, id, data, userId) => {

    if (userId) {
        data = { ...data, updatedBy: userId, updatedAt: new Date() };
    }
    await CrmUnitKPI(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: data
    }, { new: true });

    return await CrmUnitKPI(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'updatedBy', select: '_id name' })
}
