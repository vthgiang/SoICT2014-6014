const KPIPersonal = require('../../models/kpi-personal.model');
const Department = require('../../models/department.model');
// const KPIUnit = require('../../models/kpi-unit.model');
// const DetailKPIPersonal = require('../../models/DetailKPIPersonal.model');


// Lấy tất cả KPI cá nhân hiện tại của một phòng ban
exports.getKPIAllMember = async (req, res) => {
    try {
        var department = await Department.findOne({
            $or: [
                { 'dean': req.params.role },
                { 'vice_dean': req.params.role },
                { 'employee': req.params.role }
            ]
        });
        var kpipersonals;
        var starttime = req.params.starttime.split("-");
        var startdate = new Date(starttime[1], starttime[0], 0);
        var endtime = req.params.endtime.split("-");
        var enddate = new Date(endtime[1], endtime[0], 28);
        var status = parseInt(req.params.status);
        console.log(enddate);
        if (req.params.user === "all") {
            if (status===5) {
                kpipersonals = await KPIPersonal.find({ 
                    unit: department._id, 
                    time: {"$gte": startdate, "$lt": enddate} 
                }).skip(0).limit(12).populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } });
            } else if(status===4){
                kpipersonals = await KPIPersonal.find({ 
                    unit: department._id, 
                    status: { $ne: 3 }, 
                    time: {"$gte": startdate, "$lt": enddate} 
                }).skip(0).limit(12).populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } });
            } else {
                kpipersonals = await KPIPersonal.find({ 
                    unit: department._id, 
                    status: status, 
                    time: {"$gte": startdate, "$lt": enddate} 
                }).skip(0).limit(12).populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } });
            }
        } else {
            if (status===5) {
                kpipersonals = await KPIPersonal.find({ 
                    unit: department._id, 
                    creater: req.params.user,
                    time: {"$gte": startdate, "$lt": enddate} 
                }).skip(0).limit(12).populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } });
            } else if(status===4){
                kpipersonals = await KPIPersonal.find({ 
                    unit: department._id, 
                    creater: req.params.user,
                    status: { $ne: 3 }, 
                    time: {"$gte": startdate, "$lt": enddate} 
                }).skip(0).limit(12).populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } });
            } else {
                kpipersonals = await KPIPersonal.find({ 
                    unit: department._id, 
                    creater: req.params.user,
                    status: status, 
                    time: {"$gte": startdate, "$lt": enddate} 
                }).skip(0).limit(12).populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } });
            }
        }
        res.json({
            message: "Tìm kiếm KPI nhân viên thành công",
            content: kpipersonals
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Lấy tất cả KPI cá nhân theo người thiết lập
exports.getByMember = async (req, res) => {
    try {
        var kpipersonals = await KPIPersonal.find({ creater: { $in: req.params.member.split(",") } })
            .sort({ 'time': 'desc' })
            .populate("unit creater approver")
            .populate({ path: "listtarget"});
        res.json({
            message: "Lấy tất cả các mục tiêu kpi cá nhân thành công",
            content: kpipersonals
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Lấy tất cả kpi cá nhân theo tháng
exports.getByMonth = async (req, res) => {
    try {
        var time = req.params.time.split("-");
        var month = new Date(time[1], time[0], 0);
        var kpipersonals = await KPIPersonal.findOne({ creater: req.params.id, time: month})
            .populate("unit creater approver")
            .populate({ path: "listtarget", populate: { path: 'parent' } });
        res.json({
            message: "Lấy tất cả các mục tiêu kpi cá nhân thành công",
            content: kpipersonals
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Phê duyệt tất cả các mục tiêu
exports.approveAllTarget = async (req, res) => {
    try {
        var kpipersonal = await KPIPersonal.findByIdAndUpdate(req.params.id, { $set: { status: 2 } }, { new: true });
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
        res.json({
            message: "Xác nhận yêu cầu phê duyệt thành công",
            kpimember: kpipersonal,
            listtarget: targets
        });
    } catch (error) {
        res.send("Lỗi")
        res.json({ message: "err"});
    }
}

// Phê duyệt từng mục tiêu
exports.editStatusTarget = async (req, res) => {
    try {
        var target = await DetailKPIPersonal.findByIdAndUpdate(req.params.id, { $set: { status: req.params.status } }, { new: true });
        var kpipersonal = await KPIPersonal.findOne({listtarget: { $in: req.params.id }}).populate("listtarget");
        var listtarget = kpipersonal.listtarget;
        var checkFullApprove = 2;
        await listtarget.map(item=>{
            if(item.status===null||item.status===0){
                if(parseInt(req.params.status) === 1){
                    checkFullApprove = 1;
                } else {
                    checkFullApprove = 0;
                }
            }
            return true;
        })
        kpipersonal = await KPIPersonal.findByIdAndUpdate(kpipersonal._id, {$set: {status: checkFullApprove}}, { new: true })
            .populate("unit creater approver")
            .populate({ path: "listtarget", populate: { path: 'parent' } });
        res.json({
            message: "Phê duyệt mục tiêu thành công",
            newKPI: kpipersonal
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Chỉnh sửa mục tiêu của KPI cá nhân
exports.editTarget = async (req, res) => {
    try {
        var objUpdate = {
            name: req.body.name,
            parent: req.body.parent,
            weight: req.body.weight,
            criteria: req.body.criteria
        }
        var target = await DetailKPIPersonal.findByIdAndUpdate(req.params.id, { $set: objUpdate }, { new: true }).populate("parent");
        res.json({
            message: "Chỉnh sửa thành công một mục tiêu của cá nhân",
            target: target
        });
    } catch (error) {
        res.json({ message: error }, {status : 0});
    }
}
// Lấy kpi cá nhân theo id
exports.getById = async (req, res) => {
    try {
        var kpipersonal = await KPIPersonal.findById(req.params.id)
            .populate("unit creater approver")
            .populate({ path: "listtarget", populate: { path: 'parent' } });
        res.json({
            message: "Lấy kpi cá nhân theo id thành công",
            content: kpipersonal
        });
    } catch (error) {

        res.json({ message: error });
    }
}