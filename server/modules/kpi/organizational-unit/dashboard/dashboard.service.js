const Department = require('../../../../models/super-admin/organizationalUnit.model');
const KPIUnit = require('../../../../models/kpi/organizationalUnitKpiSet.model');
const DetailKPIUnit = require('../../../../models/kpi/organizationalUnitKpi.model');
const DetailKPIPersonal = require('../../../../models/kpi/employeeKpi.model');

// get all kpi unit của một đơn vị
exports.get = async (id) => {
    //req.params.id
    var department = await Department.findOne({
        $or: [
            { 'dean': id },
            { 'vice_dean': id },
            { 'employee': id }
        ]
    });
    var kpiunits = await KPIUnit.find({ unit: department._id }).sort({ 'time': 'desc' }).skip(0).limit(12)
        .populate("unit creater")
        .populate({ path: "listtarget", populate: { path: 'parent' } });
    return kpiunits;   
}

// lấy KPI đơn vị hiện tại theo role
exports.getByRole = async (id) => {
    //req.params.id,
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
        return kpiunit;
}
// Lấy tất cả mục tiêu con của mục tiêu hiện tại
exports.getChildTargetByParentId = async (id) => {
    //req.params.id
    var childTarget = await DetailKPIUnit.find({parent: id});
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
        var kpiunit = await KPIUnit.findById(id).populate('listtarget');
        if (kpiunit.listtarget) listtarget = kpiunit.listtarget;
        // Tính điểm cho từng mục tiêu của KPI đơn vị
        if (listtarget) {
            listtarget = await Promise.all(listtarget.map(async (item) => {
                var pointUnit, pointPersonal, totalunit, totalpersonal, target;
                // var temp = Object.assign({}, item);
                childUnitTarget = await DetailKPIUnit.find({ parent: item._id });
                if (childUnitTarget) {
                    pointUnit = childUnitTarget.reduce((sum, item) => sum + item.result, 0);
                    totalunit = childUnitTarget.length;
                }
                childPersonalTarget = await DetailKPIPersonal.find({ parent: item._id });
                if (childPersonalTarget) {
                    pointPersonal = childPersonalTarget.reduce((sum, item) => sum + item.approverpoint, 0);
                    totalpersonal = childPersonalTarget.length;
                }
                // temp.result = Math.round(((pointUnit + pointPersonal) / (totalunit + totalpersonal)) * 10) / 10;
                if (totalunit + totalpersonal !== 0) {
                    target = await DetailKPIUnit.findByIdAndUpdate(item._id, { result: Math.round(((pointUnit + pointPersonal) / (totalunit + totalpersonal)) * 10) / 10 }, { new: true });
                    return target;
                }
                return item;
            }));
            // tính điểm cho cả KPI đơn vị
            var totaltarget = listtarget.length;
            var totalpoint = listtarget.reduce((sum, item) => sum + item.result, 0);
            // console.log(totalpoint);
            pointkpi = Math.round((totalpoint / totaltarget) * 10) / 10;
            kpiunit = await KPIUnit.findByIdAndUpdate(id, { result: pointkpi }, { new: true });
            kpiunit = await kpiunit.populate("unit creater").populate({ path: "listtarget", populate: { path: 'parent' } }).execPopulate();
        }
        return kpiunit;
        
}
