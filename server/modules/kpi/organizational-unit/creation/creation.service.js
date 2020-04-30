const { OrganizationalUnitKpi, OrganizationalUnit, OrganizationalUnitKpiSet } = require('../../../../models/index').schema;

/**
 * Lấy KPI đơn vị hiện tại theo role
 * @id Id cuả vai trò hiện tại
 */
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

/**
 * Chỉnh sửa thông tin chung của KPI đơn vị
 */
exports.editById = async (dateString, id) => {
    //req.body.time,req.params.id
    var time = dateString.split("-");
        var date = new Date(time[1], time[0], 0)
        var organizationalUnitKpiSet = await OrganizationalUnitKpiSet.findByIdAndUpdate(id, { $set: { date: date } }, { new: true });
        organizationalUnitKpiSet = await organizationalUnitKpiSet.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
        return organizationalUnitKpiSet;
}

/**
 * Lấy KPI đơn vị cha
 */
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

/**
 * Khởi tạo KPI đơn vị
 * @data thông tin chung của Kpi đơn vị
 */
exports.create = async (data) => {
    var dateId =  data.date;
    var creatorId = data.creator;
    var organizationalUnitId = data.organizationalUnit;

    var time = dateId.split("-");
    var date = new Date(time[1], time[0], 0)
    // Tạo thông tin chung cho KPI đơn vị
    var organizationalUnitKpi = await OrganizationalUnitKpiSet.create({
        organizationalUnit: organizationalUnitId,
        creator: creatorId,
        date: date,
        kpis: []
    });
    // Tìm kiếm phòng ban hiện tại và kiểm tra xem nó có phòng ban cha hay không
    var organizationalUnit = await OrganizationalUnit.findById(organizationalUnitId);
    if (organizationalUnit.parent !== null) {
        var organizationalUnitParent = await OrganizationalUnitKpiSet.findOne({ organizationalUnit: organizationalUnit.parent, status: 1 }).populate("kpis");
        var defaultTarget;
        if (organizationalUnitParent.kpis) defaultTarget = organizationalUnitParent.kpis.filter(item => item.default !== 0);//default Target là nhưng mục tiêu có default !== 0
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
            organizationalUnitKpi = await OrganizationalUnitKpiSet.findByIdAndUpdate(
                organizationalUnitKpi, { kpis: defaultTarget }, { new: true }
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
        organizationalUnitKpi = await OrganizationalUnitKpiSet.findByIdAndUpdate(
            organizationalUnitKpi, { $push: { kpis: targetA._id } }, { new: true }
        );
        var targetC = await OrganizationalUnitKpi.create({
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: null,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            default: 2
        })
        organizationalUnitKpi = await OrganizationalUnitKpiSet.findByIdAndUpdate(
            organizationalUnitKpi, { $push: { kpis: targetC._id } }, { new: true }
        );
    }
    organizationalUnitKpi = await organizationalUnitKpi.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    
    return organizationalUnitKpi;
        
}

/**
 * Thêm mục tiêu cho KPI đơn vị
 * @data mục tiêu cần thêm vào KPI đơn vị
 */
exports.createTarget = async (data) => {
    //req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.body.organizationalUnitKpiSet
    var target = await OrganizationalUnitKpi.create({
        name: data.name,
        parent: data.parent,
        weight: data.weight,
        criteria: data.criteria
    })
    var organizationalUnitKpiSet = await OrganizationalUnitKpiSet.findByIdAndUpdate(
        data.organizationalUnitKpiSetId, { $push: { kpis: target._id } }, { new: true }
    );
    organizationalUnitKpiSet = await organizationalUnitKpiSet.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    return organizationalUnitKpiSet;
    
}

/**
 * Chỉnh sửa mục tiêu của KPI đơn vị
 * @data thông tin của mục tiêu cần chỉnh sửa
 * @id Id của KPI đơn vị đó
 */
exports.editTargetById = async (data, id) => {
    //req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.params.id
    var objUpdate = {
        name: data.name,
        parent: data.parent,
        weight: data.weight,
        criteria: data.criteria
    }
    var target = await OrganizationalUnitKpi.findByIdAndUpdate(id, { $set: objUpdate }, { new: true });
    target = await target.populate("parent").execPopulate();
    
    return target;  
}

/**
 * Xóa mục tiêu của KPI đơn vị
 */
exports.deleteTarget = async (id,organizationalUnitKpiSetId) => {
    //req.params.id,req.params.organizationalUnitKpiSetId
    var target = await OrganizationalUnitKpi.findByIdAndDelete(id);
    var organizationalUnitKpiSet = await OrganizationalUnitKpiSet.findByIdAndUpdate(organizationalUnitKpiSetId, { $pull: { kpis: id } }, { new: true });
    organizationalUnitKpiSet = await organizationalUnitKpiSet.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    return organizationalUnitKpiSet;
        
}

/**
 * Kích hoạt KPI đơn vị
 */
exports.editStatusKPIUnit = async (id, statusId) => {
    //req.params.id,req.params.status
    var kpiunit = await OrganizationalUnitKpiSet.findByIdAndUpdate(id, { $set: { status: statusId } }, { new: true });
        kpiunit = await kpiunit.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
        return kpiunit;     
}

/**
 * Xóa toàn bộ KPI đơn vị
 */
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
