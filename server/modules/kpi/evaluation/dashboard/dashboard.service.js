const { OrganizationalUnit, EmployeeKpiSet, UserRole } = require('../../../../models').schema;

// Lấy tất cả KPI cá nhân hiện tại của một phòng ban
exports.getAllEmployeeKpiSetOfUnit = async (role) => {
    var organizationalUnit = await OrganizationalUnit.findOne({
        $or: [
            { 'dean': role },
            { 'viceDean': role },
            { 'employee': role }
        ]
    });

    var employeekpis = await EmployeeKpiSet.find({
        organizationalUnit: organizationalUnit._id
    }).skip(0).limit(50).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
       
    return employeekpis;
}

// Lấy tất cả KPI cá nhân hiện tại của một phòng ban
exports.getAllEmployeeOfUnit = async (role) => {
    var organizationalUnit = await OrganizationalUnit.findOne({
        $or: [
            { 'dean': role },
            { 'viceDean': role },
            { 'employee': role }
        ]
    });

    var employees = await UserRole.find({ roleId: organizationalUnit.employee}).populate('userId roleId');
    
    return employees;
}