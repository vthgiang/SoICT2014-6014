const KPIPersonal = require('../../models/kpi-personal.model');
const Department = require('../../models/department.model');

// Lấy tất cả KPI cá nhân hiện tại của một phòng ban
exports.getKPIAllMember = async (data) => {
    var department = await Department.findOne({
        $or: [
            { 'dean': data.role },
            { 'vice_dean': data.role },
            { 'employee': data.role }
        ]
    });
    var kpipersonals;
    var starttime = data.starttime.split("-");
    var startdate = new Date(starttime[1], starttime[0], 0);
    var endtime = data.endtime.split("-");
    var enddate = new Date(endtime[1], endtime[0], 28);
    var status = parseInt(data.status);
    console.log(enddate);
    if (data.user === "all") {
        if (status === 5) {
            kpipersonals = await KPIPersonal.find({
                unit: department._id,
                time: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } });
        } else if (status === 4) {
            kpipersonals = await KPIPersonal.find({
                unit: department._id,
                status: { $ne: 3 },
                time: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } });
        } else {
            kpipersonals = await KPIPersonal.find({
                unit: department._id,
                status: status,
                time: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } });
        }
    } else {
        if (status === 5) {
            kpipersonals = await KPIPersonal.find({
                unit: department._id,
                creater: data.user,
                time: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } });
        } else if (status === 4) {
            kpipersonals = await KPIPersonal.find({
                unit: department._id,
                creater: data.user,
                status: { $ne: 3 },
                time: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } });
        } else {
            kpipersonals = await KPIPersonal.find({
                unit: department._id,
                creater: data.user,
                status: status,
                time: { "$gte": startdate, "$lt": enddate }
            }).skip(0).limit(12).populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } });
        }
    }
    return {
        message: "Tìm kiếm KPI nhân viên thành công",
        content: kpipersonals
    }
}

// Lấy tất cả KPI cá nhân theo người thiết lập
exports.getByMember = async (createrID) => {

    var kpipersonals = await KPIPersonal.find({ creater: { $in: createrID.split(",") } })
        .sort({ 'time': 'desc' })
        .populate("unit creater approver")
        .populate({ path: "listtarget" });
    return {
        message: "Lấy tất cả các mục tiêu kpi cá nhân thành công",
        content: kpipersonals
    }
}

// Lấy tất cả kpi cá nhân theo tháng
exports.getByMonth = async (data) => {
    var time = data.time.split("-");
    var month = new Date(time[1], time[0], 0);
    var kpipersonals = await KPIPersonal.findOne({ creater: data.id, time: month })
        .populate("unit creater approver")
        .populate({ path: "listtarget", populate: { path: 'parent' } });
    return {
        message: "Lấy tất cả các mục tiêu kpi cá nhân thành công",
        content: kpipersonals
    }
}

// Phê duyệt tất cả các mục tiêu
exports.approveAllTarget = async (id) => {
    var kpipersonal = await KPIPersonal.findByIdAndUpdate(id, { $set: { status: 2 } }, { new: true });
    var targets;
    if (kpipersonal.listtarget) targets = kpipersonal.listtarget;
    if (targets !== []) {
        var targets = await Promise.all(targets.map(async (item) => {
            var defaultT = await DetailKPIPersonal.findByIdAndUpdate(item._id, { $set: { status: 1 } }, { new: true })
            return defaultT;
        }))
    }
    kpipersonal = await kpipersonal.populate("unit creater approver")
        .populate({ path: "listtarget", populate: { path: 'parent' } })
        .execPopulate();
    return {
        message: "Xác nhận yêu cầu phê duyệt thành công",
        kpimember: kpipersonal,
        listtarget: targets
    }
}

// Phê duyệt từng mục tiêu
exports.editStatusTarget = async (data) => {

    var target = await DetailKPIPersonal.findByIdAndUpdate(data.id, { $set: { status: data.status } }, { new: true });
    var kpipersonal = await KPIPersonal.findOne({ listtarget: { $in: data.id } }).populate("listtarget");
    var listtarget = kpipersonal.listtarget;
    var checkFullApprove = 2;
    await listtarget.map(item => {
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
        .populate("unit creater approver")
        .populate({ path: "listtarget", populate: { path: 'parent' } });
    return {
        message: "Phê duyệt mục tiêu thành công",
        newKPI: kpipersonal
    }
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
    return {
        message: "Chỉnh sửa thành công một mục tiêu của cá nhân",
        target: target
    }
}
// Lấy kpi cá nhân theo id
exports.getById = async (id) => {
    var kpipersonal = await KPIPersonal.findById(id)
        .populate("unit creater approver")
        .populate({ path: "listtarget", populate: { path: 'parent' } });
    return {
        message: "Lấy kpi cá nhân theo id thành công",
        content: kpipersonal
    }
}