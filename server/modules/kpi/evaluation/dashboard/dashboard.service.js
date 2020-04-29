const KPIPersonal = require('../../../../models/kpi/employeeKpiSet.model');
const Department = require('../../../../models/super-admin/organizationalUnit.model');
const Task= require('../../../../models/task/task.model'); 
const DetailKPIPersonal= require('../../../../models/kpi/employeeKpi.model');

// Lấy tất cả KPI cá nhân hiện tại của một phòng ban
exports.getKPIAllMember = async (data) => {
    var department = await Department.findOne({
        $or: [
            { 'dean': data.role },
            { 'viceDean': data.role },
            { 'employee': data.role }
        ]
    });
    var kpipersonals;
    var starttime = data.starttime.split("-");
    var startdate = new Date(starttime[1], starttime[0], 0);
    var endtime = data.endtime.split("-");
    var enddate = new Date(endtime[1], endtime[0], 28);
    var status = parseInt(data.status);
    
    if (data.user === "all") {
        if (status === 5) {
            kpipersonals = await KPIPersonal.find({
                organizationalUnit: department._id,
                time: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
        } else if (status === 4) {
            kpipersonals = await KPIPersonal.find({
                organizationalUnit: department._id,
                status: { $ne: 3 },
                time: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
        } else {
            kpipersonals = await KPIPersonal.find({
                organizationalUnit: department._id,
                status: status,
                time: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
        }
    } else {
        if (status === 5) {
            kpipersonals = await KPIPersonal.find({
                organizationalUnit: department._id,
                creator: data.user,
                time: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
        } else if (status === 4) {
            kpipersonals = await KPIPersonal.find({
                organizationalUnit: department._id,
                creator: data.user,
                status: { $ne: 3 },
                time: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
        } else {
            kpipersonals = await KPIPersonal.find({
                organizationalUnit: department._id,
                creator: data.user,
                status: status,
                time: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });
        }
    }
    return kpipersonals;
}

// Lấy tất cả KPI cá nhân theo người thiết lập
exports.getByMember = async (creatorID) => {

    var kpipersonals = await KPIPersonal.find({ creator: { $in: creatorID.split(",") } })
        .sort({ 'time': 'desc' })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis" });
    return kpipersonals;
}