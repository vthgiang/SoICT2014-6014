const EmployeeKpiSet = require('../../../../models/kpi/employeeKpiSet.model');

// Lấy tất cả KPI cá nhân theo người thiết lập
exports.getByMember = async (member) => {
    //req.params.member 
    var kpipersonals = await EmployeeKpiSet.find({ creator: { $in: member.split(",") } })
        .sort({ 'time': 'desc' })
        .populate("unit creater approver")
        .populate({ path: "listtarget"}); 
    return {
        message: "Lấy tất cả các mục tiêu kpi cá nhân thành công",
        content: kpipersonals
    };    
}

// Lấy tất cả KPI cá nhân của người thực hiện trong công việc
exports.getKPIResponsible = async (member) => {
    var kpipersonals = await EmployeeKpiSet.find({ creator: { $in: member.split(",") }, status: { $ne: 3 } })
        .populate("unit creater approver")
        .populate({ path: "listtarget"});
    return kpipersonals;
}