const Department = require('../../../../models/super-admin/organizationalUnit.model');
const KPIUnit = require('../../../../models/kpi/organizationalUnitKpiSet.model');
const DetailKPIUnit = require('../../../../models/kpi/organizationalUnitKpi.model');
const DetailKPIPersonal = require('../../../../models/kpi/employeeKpi.model');
const EmployeeKPISet = require('../../../../models/kpi/employeeKpiSet.model');
const mongoose = require("mongoose");


// get all kpi unit của một đơn vị
exports.get = async (id) => {
    //req.params.id
    // console.log(id);

    var department = await Department.findOne({
        $or: [
            { 'dean': id },
            { 'viceDean': id },
            { 'employee': id }
        ]
    });
    // console.log(department);
    var kpiunits = await KPIUnit.find({ organizationalUnit: department._id }).sort({ 'date': 'desc' }).skip(0).limit(12)
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpiunits;
}

exports.getKPIUnits = async (data) => {
    var department = await Department.findOne({
        $or: [
            { 'dean': data.role },
            { 'viceDean': data.role },
            { 'employee': data.role }
        ]
    });
    var kpiunits;
    var startDate = data.startDate.split("-");
    var startdate = new Date(startDate[1] + "-" + startDate[0] + "-" + "01");
    var endDate = data.endDate.split("-");
    if (endDate[0] === "12") {
        endDate[1] = String(parseInt(endDate[1]) + 1);
        endDate[0] = "1";
    }
    endDate[0] = String(parseInt(endDate[0]) + 1);
    var enddate = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);
    var status = parseInt(data.status);

    if (status === 3) {
        kpiunits = await KPIUnit.find({
            organizationalUnit: department._id,
            date: { "$gte": startdate, "$lt": enddate }
        }).skip(0).limit(12).populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } });
    } else if (status === 1) {
        kpiunits = await KPIUnit.find({
            organizationalUnit: department._id,
            status: { $ne: 2 },
            date: { "$gte": startdate, "$lt": enddate }
        }).skip(0).limit(12).populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } });
    } else {
        kpiunits = await KPIUnit.find({
            organizationalUnit: department._id,
            status: status,
            date: { "$gte": startdate, "$lt": enddate }
        }).skip(0).limit(12).populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } });
    }
    return kpiunits;
}

// Lấy tất cả mục tiêu con của mục tiêu hiện tại
exports.getChildTargetByParentId = async (data) => {
    //req.params.id
    var date = new Date(data.date);
    var monthkpi = date.getMonth() + 1;
    var yearkpi = date.getFullYear();
    var kpiunits = await KPIUnit.aggregate([
        { $match: { organizationalUnit: mongoose.Types.ObjectId(data.id) } },
        { $addFields: { "month": { $month: '$date' }, "year": { $year: '$date' } } },
        { $match: { month: monthkpi } },
        { $match: { year: yearkpi } },
        {
            $lookup: {
                from: "organizational_unit_kpis",
                localField: "kpis",
                foreignField: "_id",
                as: "kpis"

            }
        },

        { $unwind: "$kpis" },
        {
            $lookup: {
                from: "employee_kpis",
                localField: "kpis._id",
                foreignField: "parent",
                as: "target"
            }
        },
        {
            $project: {
                "kpis": 1,
                "target": 1

            }
        },
    ])

    var childTarget = [], target = [];
    for (let i in kpiunits) {
        var arrtarget = [];
        for (let j in kpiunits[i].target) {
            var employeekpiset = await EmployeeKPISet.findOne({
                kpis: kpiunits[i].target[j]._id
            }).populate("organizationalUnit creator").select("organizationalUnit creator");
            target = {
                organizationalUnit: employeekpiset.organizationalUnit,
                creator: employeekpiset.creator,
                target: kpiunits[i].target[j]
            }

            arrtarget.push(target)
            childTarget[i] = {
                _id: kpiunits[i].target[j]._id,
                status: kpiunits[i].target[j].status,
                automaticPoint: kpiunits[i].target[j].automaticPoint,
                employeePoint: kpiunits[i].target[j].employeePoint,
                approvedPoint: kpiunits[i].target[j].approvedPoint,
                name: kpiunits[i].target[j].name,
                parent: kpiunits[i].target[j].parent,
                criteria: kpiunits[i].target[j].criteria,
                weight: kpiunits[i].target[j].weight,
                arrtarget: arrtarget
            };
        }
    }
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
