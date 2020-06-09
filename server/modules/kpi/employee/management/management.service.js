const EmployeeKpiSet = require('../../../../models/kpi/employeeKpiSet.model');

/** Lấy tất cả KPI cá nhân theo người thiết lập */
exports.getAllEmployeeKpiSets = async (member) => { // getEmployeeKpiSets(unitID, month,iduser) // TODO:...
    var kpipersonals = await EmployeeKpiSet.find({ creator: { $in: member.split(",") } })
        .sort({ 'time': 'desc' })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis"}); 
        return kpipersonals;
}

// Lấy tất cả KPI cá nhân của người thực hiện trong công việc
exports.getAllFinishedEmployeeKpiSets = async (member) => {
    var kpipersonals = await EmployeeKpiSet.find({ creator: { $in: member.split(",") }, status: { $ne: 3 } })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis"});
    return kpipersonals;
}

/**
 * get all kpi set in Organizational Unit by month
 * @data : dữ liệu lấy từ params {userId, department, date}
 */
exports.getAllKPIEmployeeSetsInOrganizationByMonth = async (data) => {
    var userId = data.user;
    var departmentId = data.department;
    var date = data.date;

    var splitterDate = date.split("-");
    var dateISO = new Date(splitterDate[2], splitterDate[1]-1, splitterDate[0]);
    var monthOfParams = dateISO.getMonth();
    var yearOfParams = dateISO.getFullYear();

    var kpiSets = await EmployeeKpiSet.find({
        creator: userId,
        organizationalUnit: departmentId
    }).populate({ path: 'kpis', select: 'name'});

    var kpiSetsByMonth = kpiSets.find(e => (e.date.getMonth() === monthOfParams && e.date.getFullYear() === yearOfParams));

    return kpiSetsByMonth;
    
}