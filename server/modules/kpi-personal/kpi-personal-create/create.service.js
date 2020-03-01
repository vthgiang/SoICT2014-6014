const KPIPersonal = require('../../../models/kpi-personal.model');
const Department = require('../../../models/department.model');
const KPIUnit = require('../../../models/kpi-unit.model');
const DetailKPIPersonal = require('../../../models/detailKPIPersonal.model');

// File này làm nhiệm vụ thao tác với cơ sở dữ liệu của module quản lý kpi cá nhân

// Lấy kpi hiện tại cá nhân theo người dùng
exports.getByUser = async (req, res) => {
    try {
        var kpipersonals = await KPIPersonal.findOne({ creater: req.params.id, status: { $ne: 3 } })
            .populate("unit creater approver")
            .populate({ path: "listtarget", populate: { path: 'parent' } });
        res.json({
            message: "Lấy danh sách các mục tiêu hiện tại của kpi cá nhân",
            content: kpipersonals
        });
    } catch (error) {
        res.json({ message: error });
    }
}
// Khởi tạo KPI cá nhân
exports.create = async (req, res) => {
    try {
        var message = "Khởi tạo thành công KPI cá nhân";
        var time = req.body.time.split("-");
        var date = new Date(time[1], time[0], 0);
        // Tạo thông tin chung cho KPI cá nhân
        var kpipersonal = await KPIPersonal.create({
            unit: req.body.unit,
            creater: req.body.creater,
            approver: req.body.approver,
            time: date,
            listtarget: []
        });
        // Tìm kiếm danh sách các mục tiêu mặc định của phòng ban
        var kpiUnit = await KPIUnit.findOne({ unit: req.body.unit, status: 1 }).populate("listtarget");
        var defaultKPIUnit;
        if (kpiUnit.listtarget) defaultKPIUnit = kpiUnit.listtarget.filter(item => item.default !== 0);
        if (defaultKPIUnit !== []) {
            var defaultKPIUnit = await Promise.all(defaultKPIUnit.map(async (item) => {
                var defaultT = await DetailKPIPersonal.create({
                    name: item.name,
                    parent: item._id,
                    weight: 5,
                    criteria: item.criteria,
                    default: item.default
                })
                return defaultT._id;
            }))
            kpipersonal = await KPIPersonal.findByIdAndUpdate(
                kpipersonal, { listtarget: defaultKPIUnit }, { new: true }
            );
        } else {
            message = "Chưa thiết lập KPI đơn vị";
        }
        kpipersonal = await kpipersonal.populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        res.json({
            message: message,
            kpipersonal: kpipersonal
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
        res.json({ message: error });
    }
}
// Xóa mục tiêu của KPI cá nhân
exports.deleteTarget = async (req, res) => {
    try {
        var target = await DetailKPIPersonal.findByIdAndDelete(req.params.id);
        var kpipersonal = await KPIPersonal.findByIdAndUpdate(req.params.kpipersonal, { $pull: { listtarget: req.params.id } }, { new: true });
        kpipersonal = await kpipersonal.populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        res.json({
            message: "Xóa thành công một mục tiêu của cá nhân",
            kpipersonal: kpipersonal,
        });
    } catch (error) {
        res.json({ message: error });
    }
}
// Chỉnh sửa trạng thái KPI: yêu cầu phê duyệt, hủy bỏ yêu cầu phê duyệt, khóa KPI
exports.editStatusKPIPersonal = async (req, res) => {
    try {
        var kpipersonal = await KPIPersonal.findByIdAndUpdate(req.params.id, { $set: { status: req.params.status } }, { new: true });
        kpipersonal = await kpipersonal.populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        res.json({
            message: "Xác nhận yêu cầu phê duyệt thành công",
            kpipersonal: kpipersonal
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Chỉnh sửa thông tin chung của KPI cá nhân
exports.editById = async (req, res) => {
    try {
        var time = req.body.time.split("-");
        var date = new Date(time[1], time[0], 0)
        var kpipersonal = await KPIPersonal.findByIdAndUpdate(req.params.id, { $set: { time: date } }, { new: true });
        kpipersonal = await kpipersonal.populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        res.json({
            message: "Chỉnh sửa thành công KPI của cá nhân",
            kpipersonal: kpipersonal
        });
    } catch (error) {
        res.json({ message: error });
    }
}
// Xóa toàn bộ KPI cá nhân
exports.delete = async (req, res) => {
    try {
        var listTarget = [];
        var kpipersonal = await KPIPersonal.findById(req.params.id);
        if (kpipersonal.listtarget) listTarget = kpipersonal.listtarget;
        if (listTarget !== []) {
            listTarget = await Promise.all(listTarget.map(async (item) => {
                return DetailKPIPersonal.findByIdAndDelete(item._id);
            }))
        }
        kpipersonal = await KPIPersonal.findByIdAndDelete(req.params.id);
        res.json({
            message: "Xóa thành công một mục tiêu của cá nhân",
            kpipersonal: kpipersonal,
            listtarget: listTarget
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
        kpipersonal = await kpipersonal.populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        res.json({
            message: "Xác nhận yêu cầu phê duyệt thành công",
            kpipersonal: kpipersonal,
            listtarget: targets
        });
    } catch (error) {
        res.json({ message: error });
    }
}
