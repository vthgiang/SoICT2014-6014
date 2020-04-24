const OrganizationalUnit = require ('../../../../models/super-admin/organizationalUnit.model');
const OrganizationalUnitKpiSet = require('../../../../models/kpi/organizationalUnitKpiSet.model');
const OrganizationalUnitKpi = require('../../../../models/kpi/organizationalUnitKpi.model');
const EmployeeKpi = require('../../../../models/kpi/employeeKpi.model');

// lấy KPI đơn vị hiện tại theo role
exports.getByRole = async (id) => {
    //req.params.id
    var department = await OrganizationalUnit.findOne({
        $or: [
            { dean: id },
            { viceDean: id },
            { employee: id }
        ]
    });
    var kpiunit = await OrganizationalUnitKpiSet.findOne({ organizationalUnit: department._id, status: { $ne: 2 } })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    
    return kpiunit;    
}

// Chỉnh sửa thông tin chung của KPI đơn vị
exports.editById = async (timeString, id) => {
    //req.body.time,req.params.id
    var time = timeString.split("-");
        var date = new Date(time[1], time[0], 0)
        var kpiunit = await OrganizationalUnitKpiSet.findByIdAndUpdate(id, { $set: { time: date } }, { new: true });
        kpiunit = await kpiunit.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
        return kpiunit;
}

// lấy KPI đơn vị cha
exports.getParentByUnit = async (id) => {
    //req.params.id,
    var department = await OrganizationalUnit.findOne({
        $or: [
            { 'dean': id },
            { 'viceDean': id },
            { 'employee': id }
        ]
    });
    var kpiunit = await OrganizationalUnitKpiSet.findOne({ organizationalUnit: department.parent, status: { $ne: 2 } })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
        return kpiunit;
    
}
// Khởi tạo KPI đơn vị
exports.create = async (timeId,unitId,createrId) => {
    //req.body.time,req.body.unit,req.body.creater
    var time = timeId.split("-");
        var date = new Date(time[1], time[0], 0)
        // Tạo thông tin chung cho KPI đơn vị
        var kpiunit = await OrganizationalUnitKpiSet.create({
            organizationalUnit: unitId,
            creator: createrId,
            time: date,
            kpis: []
        });
        // Tìm kiếm phòng ban hiện tại và kiểm tra xem nó có phòng ban cha hay không
        var department = await OrganizationalUnit.findById(unitId);
        if (department.parent !== null) {
            var kpiunitparent = await OrganizationalUnitKpiSet.findOne({ organizationalUnit: department.parent, status: 1 }).populate("kpis");
            var defaultTarget;
            if (kpiunitparent.kpis) defaultTarget = kpiunitparent.kpis.filter(item => item.default !== 0);//default Target là nhưng mục tiêu có default !== 0
            if (defaultTarget !== []) {
                var defaultTarget = await Promise.all(defaultTarget.map(async (item) => {
                    var defaultT = await OrganizationalUnitKpi.create({
                        name: item.name,
                        parent: item._id,
                        weight: 5,
                        criteria: item.criteria,
                        default: item.default
                    })
                    return defaultT._id;
                }))
                kpiunit = await OrganizationalUnitKpiSet.findByIdAndUpdate(
                    kpiunit, { kpis: defaultTarget }, { new: true }
                );
            }
        } else {
            var targetA = await OrganizationalUnitKpi.create({
                name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
                parent: null,
                weight: 5,
                criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
                default: 1
            })
            kpiunit = await OrganizationalUnitKpiSet.findByIdAndUpdate(
                kpiunit, { $push: { kpis: targetA._id } }, { new: true }
            );
            var targetC = await OrganizationalUnitKpi.create({
                name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
                parent: null,
                weight: 5,
                criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
                default: 2
            })
            kpiunit = await OrganizationalUnitKpiSet.findByIdAndUpdate(
                kpiunit, { $push: { kpis: targetC._id } }, { new: true }
            );
        }
        kpiunit = await kpiunit.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
        
        return kpiunit;
        
}

// Thêm mục tiêu cho KPI đơn vị
exports.createTarget = async (nameId,parentId,weightId,criteriaId,kpiunitId) => {
    //req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.body.kpiunit
    var target = await OrganizationalUnitKpi.create({
        name: nameId,
        parent: parentId,
        weight: weightId,
        criteria: criteriaId
    })
    var kpiunit = await OrganizationalUnitKpiSet.findByIdAndUpdate(
        kpiunitId, { $push: { kpis: target._id } }, { new: true }
    );
    kpiunit = await kpiunit.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
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
    var target = await OrganizationalUnitKpi.findByIdAndUpdate(id, { $set: objUpdate }, { new: true });
    target = await target.populate("parent").execPopulate();
    
    return target;  
}

// Xóa mục tiêu của KPI đơn vị
exports.deleteTarget = async (id,kpiunitId) => {
    //req.params.id,req.params.kpiunit
    var target = await OrganizationalUnitKpi.findByIdAndDelete(id);
        var kpiunit = await OrganizationalUnitKpiSet.findByIdAndUpdate(kpiunitId, { $pull: { kpis: id } }, { new: true });
        kpiunit = await kpiunit.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
        return kpiunit;
        
}
// Kích hoạt KPI đơn vị
exports.editStatusKPIUnit = async (id, statusId) => {
    //req.params.id,req.params.status
    var kpiunit = await OrganizationalUnitKpiSet.findByIdAndUpdate(id, { $set: { status: statusId } }, { new: true });
        kpiunit = await kpiunit.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
        return kpiunit;     
}

// Xóa toàn bộ KPI đơn vị
exports.delete = async (id) => {
    //req.params.id
    var kpis = [];
        var kpiunit = await OrganizationalUnitKpiSet.findById(id);
        if (kpiunit.kpis) kpis = kpiunit.kpis;
        if (kpis !== []) {
            kpis = await Promise.all(kpis.map(async (item) => {
                return OrganizationalUnitKpi.findByIdAndDelete(item._id);
            }))
        }
        kpiunit = await OrganizationalUnitKpiSet.findByIdAndDelete(id);
        return [kpiunit,kpis];      
}
