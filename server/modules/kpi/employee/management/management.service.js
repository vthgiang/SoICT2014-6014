const EmployeeKpiSet = require('../../../../models/kpi/employeeKpiSet.model');

// Lấy tất cả KPI cá nhân theo người thiết lập
exports.getByMember = async (member) => {
    //req.params.member 
    console.log(member);
    var kpipersonals = await EmployeeKpiSet.find({ creator: { $in: member.split(",") } })
        .sort({ 'time': 'desc' })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis"}); 
        console.log(kpipersonals);
        return kpipersonals;
}

// Lấy tất cả KPI cá nhân của người thực hiện trong công việc
exports.getKPIResponsible = async (member) => {
    var kpipersonals = await EmployeeKpiSet.find({ creator: { $in: member.split(",") }, status: { $ne: 3 } })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis"});
    return kpipersonals;
}