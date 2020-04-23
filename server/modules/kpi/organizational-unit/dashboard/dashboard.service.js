const OrganizationalUnit = require('../../../../models/super-admin/organizationalUnit.model');
const OrganizationalUnitKpiSet = require('../../../../models/kpi/organizationalUnitKpiSet.model');
const OrganizationalUnitKpi = require('../../../../models/kpi/organizationalUnitKpi.model');
const EmployeeKpi = require('../../../../models/kpi/employeeKpi.model');

// get all kpi unit của một đơn vị
exports.get = async (id) => {
    //req.params.id
    var department = await OrganizationalUnit.findOne({
        $or: [
            { 'dean': id },
            { 'viceDean': id },
            { 'employee': id }
        ]
    });
    var kpiunits = await OrganizationalUnitKpiSet.find({ organizationalUnit: department._id }).sort({ 'time': 'desc' }).skip(0).limit(12)
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpiunits;   
}

// lấy KPI đơn vị hiện tại theo role
exports.getByRole = async (id) => {
    //req.params.id,
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
// Lấy tất cả mục tiêu con của mục tiêu hiện tại
exports.getChildTargetByParentId = async (id) => {
    //req.params.id
    var childTarget = await OrganizationalUnitKpi.find({parent: id});
    return childTarget;   
}

// Cập nhật điểm mới nhất (Refresh Data)
exports.evaluateKPI = async (id) => {
    //req.params.id
    // Tìm kiếm KPI đơn vị => Để lấy danh sách các mục tiêu của kpi đơn vị
        // Lấy tất cả các mục tiêu hướng đến từng mục tiêu đơn vị
        // Tính điểm cho từng mục tiêu
        // Cập nhật lại data cho từng mục tiêu đơn vị
        // Cập nhật dữ liệu cho KPI đơn vị
        var listtarget, childUnitTarget, childPersonalTarget, pointkpi;
        var kpiunit = await OrganizationalUnitKpiSet.findById(id).populate('kpis');
        if (kpiunit.kpis) listtarget = kpiunit.kpis;
        // Tính điểm cho từng mục tiêu của KPI đơn vị
        if (listtarget) {
            listtarget = await Promise.all(listtarget.map(async (item) => {
                var pointUnit, pointPersonal, totalunit, totalpersonal, target;
                // var temp = Object.assign({}, item);
                childUnitTarget = await OrganizationalUnitKpi.find({ parent: item._id });
                if (childUnitTarget) {
                    pointUnit = childUnitTarget.reduce((sum, item) => sum + item.result, 0);
                    totalunit = childUnitTarget.length;
                }
                childPersonalTarget = await EmployeeKpi.find({ parent: item._id });
                if (childPersonalTarget) {
                    pointPersonal = childPersonalTarget.reduce((sum, item) => sum + item.approverpoint, 0);
                    totalpersonal = childPersonalTarget.length;
                }
                // temp.result = Math.round(((pointUnit + pointPersonal) / (totalunit + totalpersonal)) * 10) / 10;
                if (totalunit + totalpersonal !== 0) {
                    target = await OrganizationalUnitKpi.findByIdAndUpdate(item._id, { result: Math.round(((pointUnit + pointPersonal) / (totalunit + totalpersonal)) * 10) / 10 }, { new: true });
                    return target;
                }
                return item;
            }));
            // tính điểm cho cả KPI đơn vị
            var totaltarget = listtarget.length;
            var totalpoint = listtarget.reduce((sum, item) => sum + item.result, 0);
            
            pointkpi = Math.round((totalpoint / totaltarget) * 10) / 10;
            kpiunit = await OrganizationalUnitKpiSet.findByIdAndUpdate(id, { result: pointkpi }, { new: true });
            kpiunit = await kpiunit.populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
        }
        return kpiunit;
        
}
