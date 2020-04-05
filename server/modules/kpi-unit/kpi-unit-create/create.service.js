const Department = require('../../../models/department.model');
const KPIUnit = require('../../../models/kpi-unit.model');
const DetailKPIUnit = require('../../../models/detailKPIUnit.model');
const DetailKPIPersonal = require('../../../models/detailKPIPersonal.model');

// lấy KPI đơn vị hiện tại theo role
exports.getByRole = async (id) => {
    //req.params.id
    var department = await Department.findOne({
        $or: [
            { dean: id },
            { vice_dean: id },
            { employee: id }
        ]
    });
    var kpiunit = await KPIUnit.findOne({ unit: department._id, status: { $ne: 2 } })
        .populate("unit creater")
        .populate({ path: "listtarget", populate: { path: 'parent' } });
    return kpiunit;    
}

// Chỉnh sửa thông tin chung của KPI đơn vị
exports.editById = async (timeId,id) => {
    //req.body.time,req.params.id
    var time = timeId.split("-");
        var date = new Date(time[1], time[0], 0)
        var kpiunit = await KPIUnit.findByIdAndUpdate(id, { $set: { time: date } }, { new: true });
        kpiunit = await kpiunit.populate("unit creater").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        return kpiunit;
}

// lấy KPI đơn vị cha
exports.getParentByUnit = async (id) => {
    //req.params.id,
    var department = await Department.findOne({
        $or: [
            { 'dean': id },
            { 'vice_dean': id },
            { 'employee': id }
        ]
    });
    var kpiunit = await KPIUnit.findOne({ unit: department.parent, status: { $ne: 2 } })
        .populate("unit creater")
        .populate({ path: "listtarget", populate: { path: 'parent' } });
        return kpiunit;
    
}
// Khởi tạo KPI đơn vị
exports.create = async (timeId,unitId,createrId) => {
    //req.body.time,req.body.unit,req.body.creater
    var time = timeId.split("-");
        var date = new Date(time[1], time[0], 0)
        // Tạo thông tin chung cho KPI đơn vị
        var kpiunit = await KPIUnit.create({
            unit: unitId,
            creater: createrId,
            time: date,
            listtarget: []
        });
        // Tìm kiếm phòng ban hiện tại và kiểm tra xem nó có phòng ban cha hay không
        var department = await Department.findById(unitId);
        if (department.parent !== null) {
            var kpiunitparent = await KPIUnit.findOne({ unit: department.parent, status: 1 }).populate("listtarget");
            var defaultTarget;
            if (kpiunitparent.listtarget) defaultTarget = kpiunitparent.listtarget.filter(item => item.default !== 0);//default Target là nhưng mục tiêu có default !== 0
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
        return kpiunit;
        
}

// Thêm mục tiêu cho KPI đơn vị
exports.createTarget = async (nameId,parentId,weightId,criteriaId,kpiunitId) => {
    //req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.body.kpiunit
    var target = await DetailKPIUnit.create({
        name: nameId,
        parent: parentId,
        weight: weightId,
        criteria: criteriaId
    })
    var kpiunit = await KPIUnit.findByIdAndUpdate(
        kpiunitId, { $push: { listtarget: target._id } }, { new: true }
    );
    kpiunit = await kpiunit.populate("unit creater").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
    return kpiunit;
    
}
// Chỉnh sửa mục tiêu của KPI đơn vị
exports.editTargetById = async (nameId,parentId,weightId,criteriaId,id) => {
    //req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.params.id
    var objUpdate = {
        name: nameId,
        parent: parentId,
        weight: weightId,
        criteria: criteriaId
    }
    var target = await DetailKPIUnit.findByIdAndUpdate(id, { $set: objUpdate }, { new: true });
    target = await target.populate("parent").execPopulate();
    return target;  
}
// Xóa mục tiêu của KPI đơn vị
exports.deleteTarget = async (id,kpiunitId) => {
    //req.params.id,req.params.kpiunit
    var target = await DetailKPIUnit.findByIdAndDelete(id);
        var kpiunit = await KPIUnit.findByIdAndUpdate(kpiunitId, { $pull: { listtarget: id } }, { new: true });
        kpiunit = await kpiunit.populate("unit creater").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        return kpiunit;
        
}
// Kích hoạt KPI đơn vị
exports.editStatusKPIUnit = async (id, statusId) => {
    //req.params.id,req.params.status
    var kpiunit = await KPIUnit.findByIdAndUpdate(id, { $set: { status: statusId } }, { new: true });
        kpiunit = await kpiunit.populate("unit creater").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        return kpiunit;     
}

// Xóa toàn bộ KPI đơn vị
exports.delete = async (id) => {
    //req.params.id
    var listTarget = [];
        var kpiunit = await KPIUnit.findById(id);
        if (kpiunit.listtarget) listTarget = kpiunit.listtarget;
        if (listTarget !== []) {
            listTarget = await Promise.all(listTarget.map(async (item) => {
                return DetailKPIUnit.findByIdAndDelete(item._id);
            }))
        }
        kpiunit = await KPIUnit.findByIdAndDelete(id);
        return [kpiunit,listTarget];      
}
