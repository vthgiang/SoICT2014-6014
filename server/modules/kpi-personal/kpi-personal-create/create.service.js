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
        var kpiUnit = await KPIUnit.findOne({ unit: req.body.unit, status: 0 }).populate("listtarget");//status = 1 là kpi đã đc phê duyệt
        //lỗi ở dòng tr3n k tim dc thang kpiunit do bon minh chua co db nen chua phe duyet ben kia dc. h muon chay dc thi sua thah 0
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
            var targetA = await DetailKPIPersonal.create({
                name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
                parent: null,
                weight: 5,
                criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
                default: 1
            })
            kpipersonal = await KPIPersonal.findByIdAndUpdate(
                kpipersonal, { $push: { listtarget: targetA._id } }, { new: true }
            );
            var targetC = await DetailKPIPersonal.create({
                name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
                parent: null,
                weight: 5,
                criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
                default: 2
            })
            kpipersonal = await KPIPersonal.findByIdAndUpdate(
                kpipersonal, { $push: { listtarget: targetC._id } }, { new: true }
            );
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

// Thêm mục tiêu cho KPI cá nhân
exports.createTarget = async (req, res) => {
    try {
        // Thiết lập mục tiêu cho KPI cá nhân
        var target = await DetailKPIPersonal.create({
            name: req.body.name,
            parent: req.body.parent,
            weight: req.body.weight,
            criteria: req.body.criteria
        })
        var kpipersonal = await KPIPersonal.findByIdAndUpdate(
            req.body.kpipersonal, { $push: { listtarget: target._id } }, { new: true }
        );
        kpipersonal = await kpipersonal.populate('creater approver unit').populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        res.json({
            message: "Thêm mới thành công một mục tiêu của kpi cá nhân",
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
