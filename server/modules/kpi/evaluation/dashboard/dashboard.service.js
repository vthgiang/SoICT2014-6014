const { OrganizationalUnit, EmployeeKpiSet, UserRole } = require('../../../../models').schema;
const arrayToTree = require('array-to-tree');

/**
 * Lấy tất cả KPI của nhân viên theo chức danh
 * @role id của role
 */
exports.getAllEmployeeKpiSetOfUnitByRole = async (role) => {
    let organizationalUnit = await OrganizationalUnit.findOne({
        $or: [
            {'deans': { $in: role }}, 
            {'viceDeans':{ $in: role }}, 
            {'employees':{ $in: role }}
        ]
    });
    let employeekpis = await EmployeeKpiSet.find({
        organizationalUnit: organizationalUnit._id
    }).skip(0).limit(50).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
    return employeekpis;
}

/**
 * Lấy tất cả KPI của nhân viên theo mảng id đơn vị
 * @id Mảng id các đơn vị
 */
exports.getAllEmployeeKpiSetOfUnitByIds = async (ids) => {
    let data = [];
    for(let i = 0; i < ids.length; i++) {
        let employeekpis = await EmployeeKpiSet.find({
            organizationalUnit: ids[i]
        }).skip(0).limit(50).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
        data = data.concat(employeekpis);
    };
    return data;
}
