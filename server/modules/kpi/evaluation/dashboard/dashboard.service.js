const EmployeeKpiSet = require('../../../../models/kpi/employeeKpiSet.model');
const OrganizationalUnit = require('../../../../models/super-admin/organizationalUnit.model');
const Task= require('../../../../models/task/task.model'); 
const EmployeeKpi= require('../../../../models/kpi/employeeKpi.model');

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
    }).skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
       
    return employeekpis;
}