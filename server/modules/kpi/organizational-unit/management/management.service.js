const Department = require('../../../../models/super-admin/organizationalUnit.model');
const KPIUnit = require('../../../../models/kpi/organizationalUnitKpiSet.model');
const DetailKPIUnit = require('../../../../models/kpi/organizationalUnitKpi.model');
const DetailKPIPersonal = require('../../../../models/kpi/employeeKpi.model');

// get all kpi unit của một đơn vị
exports.get = async (id) => {
    //req.params.id
    console.log(id);
    
    var department = await Department.findOne({
        $or: [
            { 'dean': id },
            { 'viceDean': id },
            { 'employee': id }
        ]
    });
    console.log(department);
    var kpiunits = await KPIUnit.find({organizationalUnit : department._id }).sort({ 'date': 'desc' }).skip(0).limit(12)
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpiunits;   
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
        var kpis, childUnitTarget, childPersonalTarget, pointkpi;
        var kpiunit = await KPIUnit.findById(id).populate('kpis');
        if (kpiunit.kpis) kpis = kpiunit.kpis;
        // Tính điểm cho từng mục tiêu của KPI đơn vị
        if (kpis) {
            kpis = await Promise.all(kpis.map(async (item) => {
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
            var totaltarget = kpis.length;
            var totalpoint = kpis.reduce((sum, item) => sum + item.result, 0);
            // console.log(totalpoint);
            pointkpi = Math.round((totalpoint / totaltarget) * 10) / 10;
            kpiunit = await KPIUnit.findByIdAndUpdate(id, { result: pointkpi }, { new: true });
            kpiunit = await kpiunit.populate("organizationalUnit creater").populate({ path: "kpis", populate: { path: 'parent' } }).execPopulate();
        }
        return kpiunit;
        
}
