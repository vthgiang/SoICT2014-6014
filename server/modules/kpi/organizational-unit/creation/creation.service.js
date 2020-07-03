const { OrganizationalUnitKpi, OrganizationalUnit, OrganizationalUnitKpiSet } = require('../../../../models/index').schema;

/**
 * Lấy tập KPI đơn vị của đơn vị ứng với role người dùng
 * @id Id của role người dùng
 * @organizationalUnitId params Id đơn vị
 */
exports.getOrganizationalUnitKpiSet = async (roleId, organizationalUnitId=undefined) => {
    
    if(!organizationalUnitId) {
        var department = await OrganizationalUnit.findOne({
            $or: [
                { 'deans': roleId },
                { 'viceDeans': roleId },
                { 'employees': roleId }
            ]
        });
    } else {
        var department = { '_id': organizationalUnitId };
    }

    var now = new Date();
    var currentYear = now.getFullYear();
    var currentMonth = now.getMonth();
    var endOfCurrentMonth = new Date(currentYear, currentMonth+1);
    var endOfLastMonth = new Date(currentYear, currentMonth);

    // Status khác 2 --> chưa kết thúc
    var kpiunit = await OrganizationalUnitKpiSet.findOne({ organizationalUnit: department._id, status: { $ne: 2 }, date: { $lte: endOfCurrentMonth, $gt: endOfLastMonth } })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    
    return kpiunit;    
}

/**
 * Chỉnh sửa thông tin chung của tập KPI đơn vị
 * @dateString thời gian mới 
 * @id Id của tập KPI đơn vị
 */
exports.editOrganizationalUnitKpiSet = async (dateString, id) => {
    //req.body.time,req.params.id
    var time = dateString.split("-");
    var date = new Date(time[1], time[0], 0)
    var organizationalUnitKpiSet = await OrganizationalUnitKpiSet.findByIdAndUpdate(id, { $set: { date: date } }, { new: true });
    organizationalUnitKpiSet = await organizationalUnitKpiSet.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    
    return organizationalUnitKpiSet;
}

/**
 * Lấy tập KPI đơn vị của đơn vị cha của đơn vị ứng với role người dùng
 * @id Id role người dùng
 */
exports.getParentOrganizationalUnitKpiSet = async (id) => {
    //req.params.id,
    var department = await OrganizationalUnit.findOne({
        $or: [
            { 'deans': id },
            { 'viceDeans': id },
            { 'employees': id }
        ]
    });

    let now = new Date();
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth();
    let startOfCurrentMonth = new Date(currentYear, currentMonth);
    let startOfNextMonth = new Date(currentYear, currentMonth + 1);

    var kpiunit = await OrganizationalUnitKpiSet.findOne({
            organizationalUnit: department.parent,
            date: { $gte: startOfCurrentMonth, $lt: startOfNextMonth }
        })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
        return kpiunit;
    
}

/**
 * Khởi tạo tập KPI đơn vị
 * @data thông tin chung của tập Kpi đơn vị
 */
exports.createOrganizationalUnitKpiSet = async (data) => {
    var dateId =  data.date;
    var creatorId = data.creator;
    var organizationalUnitId = data.organizationalUnit;

    var time = dateId.split("-");
    var date = new Date(time[1], time[0], 0);

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
        if (organizationalUnitParent.kpis) defaultTarget = organizationalUnitParent.kpis.filter(item => item.type !== 0);//default Target là nhưng mục tiêu có default !== 0
        if (defaultTarget !== []) {
            var defaultTarget = await Promise.all(defaultTarget.map(async (item) => {
                var defaultT = await OrganizationalUnitKpi.create({
                    name: item.name,
                    parent: item._id,
                    weight: 5,
                    criteria: item.criteria,
                    type: item.type
                })
                return defaultT._id;
            }))
            organizationalUnitKpi = await OrganizationalUnitKpiSet.findByIdAndUpdate(
                organizationalUnitKpi, { kpis: defaultTarget }, { new: true }
            );
        }
    } else {
        var targetA = await OrganizationalUnitKpi.create({
            name: "Phê duyệt công việc",
            parent: null,
            weight: 5,
            criteria: "Thực hiện tốt vai trò người phê duyệt trong các công việc. Người phê duyệt là người chịu trách nhiệm về thành công/thất bại của công việc",
            type: 1
        })
        organizationalUnitKpi = await OrganizationalUnitKpiSet.findByIdAndUpdate(
            organizationalUnitKpi, { $push: { kpis: targetA._id } }, { new: true }
        );
        var targetC = await OrganizationalUnitKpi.create({
            name: "Hỗ trợ thực hiện công việc",
            parent: null,
            weight: 5,
            criteria: "Thực hiện tốt vai trò người hỗ trợ (consulted) trong các công việc",
            type: 2
        })
        organizationalUnitKpi = await OrganizationalUnitKpiSet.findByIdAndUpdate(
            organizationalUnitKpi, { $push: { kpis: targetC._id } }, { new: true }
        );
    }
    organizationalUnitKpi = await organizationalUnitKpi.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    
    return organizationalUnitKpi;
        
}

/**
 * Thêm một KPI vào tập KPI đơn vị
 * @data thông tin về KPI cần thêm vào tập KPI đơn vị
 */
exports.createOrganizationalUnitKpi = async (data) => {
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
 * Chỉnh sửa KPI đơn vị
 * @data thông tin KPI cần chỉnh sửa
 * @id Id của KPI đơn vị
 */
exports.editOrganizationalUnitKpi = async (data, id) => {
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
 * Xóa KPI đơn vị
 * @id Id của KPI đơn vị
 * @organizationalUnitKpiSetId Id của tập KPI đơn vị
 */
exports.deleteOrganizationalUnitKpi = async (id, organizationalUnitKpiSetId) => {
    var organizationalUnitKpi = await OrganizationalUnitKpi.findByIdAndDelete(id);
    var organizationalUnitKpiSet = await OrganizationalUnitKpiSet.findByIdAndUpdate(organizationalUnitKpiSetId, { $pull: { kpis: id } }, { new: true });
    organizationalUnitKpiSet = await organizationalUnitKpiSet.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    return organizationalUnitKpiSet;
}

/**
 * Chỉnh sửa trạng thái của tập KPI đơn vị
 * @id Id của tập KPI đơn vị
 * @statusId trạng thái mới của tập KPI đơn vị
 */
exports.editOrganizationalUnitKpiSetStatus = async (id, statusId) => {
    var kpiunit = await OrganizationalUnitKpiSet.findByIdAndUpdate(id, { $set: { status: statusId } }, { new: true });
    kpiunit = await kpiunit.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
    return kpiunit;     
}

/**
 * Xóa tập KPI đơn vị
 * @id Id của tập KPI đơn vị
 */
exports.deleteOrganizationalUnitKpiSet = async (id) => {
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
