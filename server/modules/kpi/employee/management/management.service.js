const EmployeeKpiSet = require('../../../../models/kpi/employeeKpiSet.model');
const EmployeeKpi = require('../../../../models/kpi/employeeKpi.model')
const mongoose = require("mongoose");

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

exports.copyKPI = async (data) => {

    var date = data.dateold.split("-");
    var dateold = new Date(date[0], date[1], 0);
    var date = data.datenew.split("-");
    var dateNewEmployeeKPI = new Date(date[1], date[0], 0);
    var monthOldKPI = dateold.getMonth();
    var yearOldKPI = dateold.getFullYear();
    var monthNewKPI = dateNewEmployeeKPI.getMonth();
    var yearNewKPI = dateNewEmployeeKPI.getFullYear();
    var OldEmployeeKPI = await EmployeeKpiSet.find({ creator: mongoose.Types.ObjectId(data.id) })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    var check = OldEmployeeKPI.find(e => (e.date.getMonth() === monthNewKPI && e.date.getFullYear() === yearNewKPI));
    if (check == undefined) {
        var list = OldEmployeeKPI.find(e => (e.date.getMonth() === monthOldKPI && e.date.getFullYear() === yearOldKPI));
        var NewEmployeeKpi = await EmployeeKpiSet.create({
            organizationalUnit: list.organizationalUnit._id,
            creator: list.creator._id,
            date: dateNewEmployeeKPI,
            kpis: [],
            approver: list.approver,
            
        })
        // console.log("Hiiiiiiii")
        for (let i in list.kpis) {
            var target = await EmployeeKpi.create({
                name: list.kpis[i].name,
                weight: list.kpis[i].weight,
                criteria: list.kpis[i].criteria,
                type: list.kpis[i].type,
                parent: null,
            });
            EmployeeKpis = await EmployeeKpiSet.findByIdAndUpdate(
                   NewEmployeeKpi, { $push: { kpis: target._id } }, { new: true }
            );
        }
        EmployeeKpis = await EmployeeKpiSet.find({ creator: mongoose.Types.ObjectId(data.id)  })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    }

    return EmployeeKpis;
}