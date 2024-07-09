const mongoose = require("mongoose");
const { CustomerGroup, CustomerStatus, CustomerCareType, CustomerRankPoint, CustomerCareUnit } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { getOrganizationalUnitByUserRole } = require("../../super-admin/organizational-unit/organizationalUnit.service");

exports.getCrmUnits = async (portal, companyId, query) => {
    let keySearch = {};
    return await CustomerCareUnit(connect(DB_CONNECTION, portal)).find(keySearch)
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
    const newCrmUnit = await CustomerCareUnit(connect(DB_CONNECTION, portal)).create({
        creator: userId,
        organizationalUnit: organizationalUnit,
        createdAt: new Date(),
    })

    const getNewCrmUnit = await CustomerCareUnit(connect(DB_CONNECTION, portal)).findById(newCrmUnit._id)
        .populate({ path: 'creator', select: '_id name' })
        .populate({ path: 'organizationalUnit', select: '_id name description' })
        ;
    
    // Tạo dữ liệu mẫu ban đầu cho đơn vị chăm sóc khách hàng để đề phòng trường hợp khách hàng không biết dùng, hoặc thao tác sai
    await CustomerGroup(connect(DB_CONNECTION, portal)).create({
        creator: userId,
        updatedBy: userId,
        code: "KHVIP1",
        name: "Khách VIP",
        description: "Khách VIP",
        customerCareUnit: getNewCrmUnit._id
    },{
        creator: userId,
        updatedBy: userId,
        code: "NKHKV",
        name: "Nhóm khách theo khu vực",
        description: "Nhóm khách theo khu vực",
        customerCareUnit: getNewCrmUnit._id
    })

    await CustomerStatus(connect(DB_CONNECTION, portal)).create({
        creator: userId,
        updatedBy: userId,
        name: "Tiềm năng",
        description: "Khách hàng mới toanh",
        customerCareUnit: getNewCrmUnit._id
    },{
        creator: userId,
        updatedBy: userId,
        name: "Đã kí hợp đồng",
        description: "Khách hàng đã kỹ hợp đồng với công ty",
        customerCareUnit: getNewCrmUnit._id
    })

    await CustomerCareType(connect(DB_CONNECTION, portal)).create({
        creator: userId,
        updatedBy: userId,
        name: "Gọi điện tư vấn",
        description: "Gọi điện tư vấn",
        customerCareUnit: getNewCrmUnit._id
    },{
        creator: userId,
        updatedBy: userId,
        name: "Gửi Email",
        description: "Gửi Email giới thiệu ...",
        customerCareUnit: getNewCrmUnit._id
    })

    await CustomerRankPoint(connect(DB_CONNECTION, portal)).create({
        creator: userId,
        updatedBy: userId,
        name: "Vàng",
        point: 1000,
        description: "Xếp hạng vàng",
        customerCareUnit: getNewCrmUnit._id
    },{
        creator: userId,
        updatedBy: userId,
        name: "Bạc",
        point: 500,
        description: "Xếp hạng bạc",
        customerCareUnit: getNewCrmUnit._id
    },{
        creator: userId,
        updatedBy: userId,
        name: "Đồng",
        point: 0,
        description: "Xếp hạng đồng",
        customerCareUnit: getNewCrmUnit._id
    })
    

    return getNewCrmUnit;
}

exports.deleteCrmUnit = async (portal, companyId, id) => {
    let deleteCrmUnit = await CustomerCareUnit(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return deleteCrmUnit;
}


