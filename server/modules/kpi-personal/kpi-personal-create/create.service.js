const KPIPersonal = require('../../../models/kpi-personal.model');
const Department = require('../../../models/department.model');
const KPIUnit = require('../../../models/kpi-unit.model');
const DetailKPIPersonal = require('../../../models/detailKPIPersonal.model');

// File này làm nhiệm vụ thao tác với cơ sở dữ liệu của module quản lý kpi cá nhân

// Lấy kpi hiện tại cá nhân theo người dùng
exports.getByUser = async (id) => {
    var kpipersonals = await KPIPersonal.findOne({ creater: id, status: { $ne: 3 } })
            .populate("unit creater approver")
            .populate({ path: "listtarget", populate: { path: 'parent' } });
     return kpipersonals;
}

// Khởi tạo KPI cá nhân
exports.create = async (createrId,approverId,unitId,timeId) => {
        // Tìm kiếm danh sách các mục tiêu mặc định của phòng ban
        var kpiUnit = await KPIUnit.findOne({ unit: unitId, status: 1 }).populate("listtarget");//status = 1 là kpi đã đc phê duyệt
        
        var defaultKPIUnit;
        if (kpiUnit.listtarget) defaultKPIUnit = kpiUnit.listtarget.filter(item => item.default !== 0);
        if (defaultKPIUnit !== []) {
            var time = timeId.split("-");
            var date = new Date(time[1], time[0], 0);
            
        // Tạo thông tin chung cho KPI cá nhân
            var kpipersonal = await KPIPersonal.create({
                unit: unitId,
                creater: createrId,
                approver: approverId,
                time: date,
                listtarget: []
            });
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
        
            kpipersonal = await kpipersonal.populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
            var message = "Khởi tạo thành công KPI cá nhân";
            return kpipersonal;
        } else {
            return null;
            
        }
}

// Thêm mục tiêu cho KPI cá nhân
exports.createTarget = async (nameId,parentId,weightId,criteriaId,kpipersonalId) => {
    //req.body.name,req.body.parent,req.body.weight,req.body.criteria
    // Thiết lập mục tiêu cho KPI cá nhân
    var target = await DetailKPIPersonal.create({
        name: nameId,
        parent: parentId,
        weight: weightId,
        criteria:criteriaId
    })

    var kpipersonal = await KPIPersonal.findByIdAndUpdate(
        kpipersonalId, { $push: { listtarget: target._id } }, { new: true }
    );
    kpipersonal = await kpipersonal.populate('creater approver unit').populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
    return kpipersonal;
}

// Chỉnh sửa mục tiêu của KPI cá nhân
exports.editTarget = async (nameId,parentId,weightId,criteriaId,id) => {
    //req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.params.id
    var objUpdate = {
        name: nameId,
        parent: parentId,
        weight: weightId,
        criteria: criteriaId
    }
    var target = await DetailKPIPersonal.findByIdAndUpdate(id, { $set: objUpdate }, { new: true }).populate("parent");
    return target;
}
// Xóa mục tiêu của KPI cá nhân
exports.deleteTarget = async (id,kpipersonalId) => {
    //req.params.id,req.params.kpipersonal
    var target = await DetailKPIPersonal.findByIdAndDelete(id);
        var kpipersonal = await KPIPersonal.findByIdAndUpdate(kpipersonalId, { $pull: { listtarget: id } }, { new: true });
        kpipersonal = await kpipersonal.populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        return kpipersonal;
}
// Chỉnh sửa trạng thái KPI: yêu cầu phê duyệt, hủy bỏ yêu cầu phê duyệt, khóa KPI
exports.editStatusKPIPersonal = async (id,statusId) => {
    //req.params.id,req.params.status
    
    var kpipersonal = await KPIPersonal.findByIdAndUpdate(id, { $set: { status: statusId } }, { new: true });
        kpipersonal = await kpipersonal.populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        
        return kpipersonal;
}

// Chỉnh sửa thông tin chung của KPI cá nhân
exports.editById = async (timeId,id) => {
    //req.body.time,req.params.id
    var time = timeId.split("-");
        var date = new Date(time[1], time[0], 0)
        var kpipersonal = await KPIPersonal.findByIdAndUpdate(id, { $set: { time: date } }, { new: true });
        kpipersonal = await kpipersonal.populate("unit creater approver").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
    return kpipersonal;
}
// Xóa toàn bộ KPI cá nhân
exports.delete = async (id) => {
    //req.params.id
    var listTarget = [];
        var kpipersonal = await KPIPersonal.findById(id);
        if (kpipersonal.listtarget) listTarget = kpipersonal.listtarget;
        if (listTarget !== []) {
            listTarget = await Promise.all(listTarget.map(async (item) => {
                return DetailKPIPersonal.findByIdAndDelete(item._id);
            }))
        }
        kpipersonal = await KPIPersonal.findByIdAndDelete(id);
        return [kpipersonal,listTarget]
}

