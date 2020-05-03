const KPIPersonal = require('../../../../models/kpi/employeeKpiSet.model');
const Department = require('../../../../models/super-admin/organizationalUnit.model');
const Task= require('../../../../models/task/task.model'); 
const DetailKPIPersonal= require('../../../../models/kpi/employeeKpi.model')

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

// Lấy tất cả kpi cá nhân theo tháng
exports.getByMonth = async (data) => {
    var time = data.time.split("-");
    var month = new Date(time[1], time[0], 0);
    var kpipersonals = await KPIPersonal.findOne({ creator: data.id, time: month })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpipersonals;
}

// Phê duyệt tất cả các mục tiêu
exports.approveAllTarget = async (id) => {
    var kpipersonal = await KPIPersonal.findByIdAndUpdate(id, { $set: { status: 2 } }, { new: true });
    var targets;
    if (kpipersonal.kpis) targets = kpipersonal.kpis;
    if (targets !== []) {
        var targets = await Promise.all(targets.map(async (item) => {
            var defaultT = await DetailKPIPersonal.findByIdAndUpdate(item._id, { $set: { status: 1 } }, { new: true })
            return defaultT;
        }))
    }
    kpipersonal = await kpipersonal.populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } })
        .execPopulate();
    return [kpipersonal,targets];
    
}

// Phê duyệt từng mục tiêu
exports.editStatusTarget = async (data) => {

    var target = await DetailKPIPersonal.findByIdAndUpdate(data.id, { $set: { status: data.status } }, { new: true });
    var kpipersonal = await KPIPersonal.findOne({ kpis: { $in: data.id } }).populate("kpis");
    var kpis = kpipersonal.kpis;
    var checkFullApprove = 2;
    await kpis.map(item => {
        if (item.status === null || item.status === 0) {
            if (parseInt(data.status) === 1) {
                checkFullApprove = 1;
            } else {
                checkFullApprove = 0;
            }
        }
        return true;
    })
    kpipersonal = await KPIPersonal.findByIdAndUpdate(kpipersonal._id, { $set: { status: checkFullApprove } }, { new: true })
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpipersonal;
    
}

// Chỉnh sửa mục tiêu của KPI cá nhân
exports.editTarget = async (id, data) => {
    var objUpdate = {
        name: data.name,
        parent: data.parent,
        weight: data.weight,
        criteria: data.criteria
    }
    var target = await DetailKPIPersonal.findByIdAndUpdate(id, { $set: objUpdate }, { new: true }).populate("parent");
    return target;
}
// Lấy kpi cá nhân theo id
exports.getById = async (id) => {
    var kpipersonal = await KPIPersonal.findById(id)
        .populate("organizationalUnit creator approver")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpipersonal;
}

exports.getTaskById= async (id) =>{
    var task = await Task.find({kpi: id}) 
    .populate({ path: "organizationalUnit responsibleEmployees accountableEmployees consultedEmployees informedEmployees results parent taskTemplate " });
    
    return task;
}

exports.getSystemPoint= async(id)=>{
    var task = await Task.find({ kpi: id })
    .populate({ path: "organizationalUnit responsibleEmployees accountableEmployees consultedEmployees informedEmployees results parent taskTemplate " });
    var kpi= await DetailKPIPersonal.findById(id);
    
    var sum = 0,i=0;
    for (i=0; i<task.length;i++){
        sum +=task[i].point;
    }
    
    var systempoint= sum/task.length*kpi.weight/100;
    
    var kpipersonal= await DetailKPIPersonal.findByIdAndUpdate(id, { $set: { systempoint: systempoint} }, { new: true });
    return kpipersonal;
}

exports.setPointKPI = async(id_kpi, id_target, data) =>{
    var kpi = await DetailKPIPersonal.findByIdAndUpdate(id_target, {$set: {approverpoint: data.point}}, {new: true} );
    var kpipersonal = await KPIPersonal.findById(id_kpi)
    .populate("organizationalUnit creator approver")
    .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpipersonal;
}