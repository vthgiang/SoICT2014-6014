const Department = require('../../../models/department.model');
const KPIUnit = require('../../../models/kpi-unit.model');
const DetailKPIUnit = require('../../../models/detailKPIUnit.model');
const DetailKPIPersonal = require('../../../models/detailKPIPersonal.model');

// lấy KPI đơn vị hiện tại theo role
exports.getByRole = async (req, res) => {
    try {
        var department = await Department.findOne({
            $or: [
                { dean: req.params.id },
                { vice_dean: req.params.id },
                { employee: req.params.id }
            ]
        });
        var kpiunit = await KPIUnit.findOne({ unit: department._id, status: { $ne: 2 } })
            .populate("unit creater")
            .populate({ path: "listtarget", populate: { path: 'parent' } });
        res.json({
            message: "Lấy kpi đơn vị hiện tại",
            content: kpiunit
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Chỉnh sửa thông tin chung của KPI đơn vị
exports.editById = async (req, res) => {
    try {
        var time = req.body.time.split("-");
        var date = new Date(time[1], time[0], 0)
        var kpiunit = await KPIUnit.findByIdAndUpdate(req.params.id, { $set: { time: date } }, { new: true });
        kpiunit = await kpiunit.populate("unit creater").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        res.json({
            message: "Chỉnh sửa thành công KPI của đơn vị",
            kpiunit: kpiunit
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// lấy KPI đơn vị cha
exports.getParentByUnit = async (req, res) => {
    try {
        var department = await Department.findOne({
            $or: [
                { 'dean': req.params.id },
                { 'vice_dean': req.params.id },
                { 'employee': req.params.id }
            ]
        });
        var kpiunit = await KPIUnit.findOne({ unit: department.parent, status: { $ne: 2 } })
            .populate("unit creater")
            .populate({ path: "listtarget", populate: { path: 'parent' } });
        res.json({
            message: "Lấy kpi đơn vị cha",
            content: kpiunit
        });
    } catch (error) {
        res.json({ message: error });
    }
}
// Khởi tạo KPI đơn vị
exports.create = async (req, res) => {
    try {
        var time = req.body.time.split("-");
        var date = new Date(time[1], time[0], 0)
        // Tạo thông tin chung cho KPI đơn vị
        var kpiunit = await KPIUnit.create({
            unit: req.body.unit,
            creater: req.body.creater,
            time: date,
            listtarget: []
        });
        // Tìm kiếm phòng ban hiện tại và kiểm tra xem nó có phòng ban cha hay không
        var department = await Department.findById(req.body.unit);
        if (department.parent !== null) {
            var kpiunitparent = await KPIUnit.findOne({ unit: department.parent, status: 1 }).populate("listtarget");
            var defaultTarget;
            if (kpiunitparent.listtarget) defaultTarget = kpiunitparent.listtarget.filter(item => item.default !== 0);
            if (defaultTarget !== []) {
                var defaultTarget = await Promise.all(defaultTarget.map(async (item) => {
                    var defaultT = await DetailKPIUnit.create({
                        name: item.name,
                        parent: item._id,
                        weight: 5,
                        criteria: item.criteria,
                        default: item.default
                    })
                    return defaultT._id;
                }))
                kpiunit = await KPIUnit.findByIdAndUpdate(
                    kpiunit, { listtarget: defaultTarget }, { new: true }
                );
            }
        } else {
            var targetA = await DetailKPIUnit.create({
                name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
                parent: null,
                weight: 5,
                criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
                default: 1
            })
            kpiunit = await KPIUnit.findByIdAndUpdate(
                kpiunit, { $push: { listtarget: targetA._id } }, { new: true }
            );
            var targetC = await DetailKPIUnit.create({
                name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
                parent: null,
                weight: 5,
                criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
                default: 2
            })
            kpiunit = await KPIUnit.findByIdAndUpdate(
                kpiunit, { $push: { listtarget: targetC._id } }, { new: true }
            );
        }
        kpiunit = await kpiunit.populate("unit creater").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        res.json({
            message: "Khởi tạo thành công KPI đơn vị",
            kpiunit: kpiunit
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Thêm mục tiêu cho KPI đơn vị
exports.createTarget = async (req, res) => {
    try {
        // Thiết lập mục tiêu cho KPI đơn vị
        var target = await DetailKPIUnit.create({
            name: req.body.name,
            parent: req.body.parent,
            weight: req.body.weight,
            criteria: req.body.criteria
        })
        var kpiunit = await KPIUnit.findByIdAndUpdate(
            req.body.kpiunit, { $push: { listtarget: target._id } }, { new: true }
        );
        kpiunit = await kpiunit.populate("unit creater").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        res.json({
            message: "Thêm mới thành công một mục tiêu của đơn vị",
            kpiunit: kpiunit
        });
    } catch (error) {
        res.json({ message: error });
    }
}
// Chỉnh sửa mục tiêu của KPI đơn vị
exports.editTargetById = async (req, res) => {
    try {
        var objUpdate = {
            name: req.body.name,
            parent: req.body.parent,
            weight: req.body.weight,
            criteria: req.body.criteria
        }
        var target = await DetailKPIUnit.findByIdAndUpdate(req.params.id, { $set: objUpdate }, { new: true });
        target = await target.populate("parent").execPopulate();
        res.json({
            message: "Chỉnh sửa thành công một mục tiêu của đơn vị",
            target: target
        });
    } catch (error) {
        res.json({ message: error });
    }
}
// Xóa mục tiêu của KPI đơn vị
exports.deleteTarget = async (req, res) => {
    try {
        var target = await DetailKPIUnit.findByIdAndDelete(req.params.id);
        var kpiunit = await KPIUnit.findByIdAndUpdate(req.params.kpiunit, { $pull: { listtarget: req.params.id } }, { new: true });
        kpiunit = await kpiunit.populate("unit creater").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        res.json({
            message: "Xóa thành công một mục tiêu của đơn vị",
            kpiunit: kpiunit,
        });
    } catch (error) {
        res.json({ message: error });
    }
}
// Kích hoạt KPI đơn vị
exports.editStatusKPIUnit = async (req, res) => {
    try {
        var kpiunit = await KPIUnit.findByIdAndUpdate(req.params.id, { $set: { status: req.params.status } }, { new: true });
        kpiunit = await kpiunit.populate("unit creater").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        res.json({
            message: "Xác nhận kích hoạt kpi đơn vị thành công",
            kpiunit: kpiunit
        });
    } catch (error) {
        res.json({ message: error });
    }
}

// Xóa toàn bộ KPI đơn vị
exports.delete = async (req, res) => {
    try {
        var listTarget = [];
        var kpiunit = await KPIUnit.findById(req.params.id);
        if (kpiunit.listtarget) listTarget = kpiunit.listtarget;
        if (listTarget !== []) {
            listTarget = await Promise.all(listTarget.map(async (item) => {
                return DetailKPIUnit.findByIdAndDelete(item._id);
            }))
        }
        kpiunit = await KPIUnit.findByIdAndDelete(req.params.id);
        res.json({
            message: "Xóa thành công kpi đơn vị",
            kpiunit: kpiunit,
            listtarget: listTarget
        });
    } catch (error) {
        res.json({ message: error });
    }
}
