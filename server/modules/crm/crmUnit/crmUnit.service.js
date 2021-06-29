const mongoose = require("mongoose");
const { CrmUnit } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { getOrganizationalUnitByUserRole } = require("../../super-admin/organizational-unit/organizationalUnit.service");

exports.getCrmUnits = async (portal, companyId, query) => {
    let keySearch = {};
    return await CrmUnit(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'organizationalUnit', select: '_id name description' })
}

exports.getCrmUnitByRole = async (portal, companyId, role) => {
    // lấy danh sách đơn vị chăm sóc khách hàng
    const crmUnits = await this.getCrmUnits(portal, companyId, {});
    //lấy đơn vị từ role
    const userUnit = await getOrganizationalUnitByUserRole(portal, role);
    if (!userUnit) return 0;
    for (let i = 0; i < crmUnits.length; i++) {
        if (userUnit._id.toString() == crmUnits[i].organizationalUnit._id.toString() || (userUnit.parent && userUnit.parent.toString() == crmUnits[i].organizationalUnit._id.toString())) {
            return crmUnits[i];
        }
    }

    return 0;
}

exports.createCrmUnit = async (portal, companyId, userId, data) => {
    const { organizationalUnit } = data;
    const newCrmUnit = await CrmUnit(connect(DB_CONNECTION, portal)).create({
        creator: userId,
        organizationalUnit: organizationalUnit,
        createdAt: new Date(),
    })

    const getNewCrmUnit = await CrmUnit(connect(DB_CONNECTION, portal)).findById(newCrmUnit._id)
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'organizationalUnit', select: '_id name description' })
        ;
    return getNewCrmUnit;
}

exports.deleteCrmUnit = async (portal, companyId, id) => {
    let deleteCrmUnit = await CrmUnit(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return deleteCrmUnit;
}


