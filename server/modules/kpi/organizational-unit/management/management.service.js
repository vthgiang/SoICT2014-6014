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
    var status = Number(data.status);
    if (data.startDate !== "undefined") {
        var startDate = data.startDate.split("-");
        var startdate = new Date(startDate[1] + "-" + startDate[0] + "-" + "01");
    }
    if (data.endDate !== "undefined") {
        var endDate = data.endDate.split("-");
        if (endDate[0] === "12") {
            endDate[1] = String(parseInt(endDate[1]) + 1);
            endDate[0] = "1";
        }
        endDate[0] = String(parseInt(endDate[0]) + 1);
        var enddate = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);
    }
    var keySearch = {
        organizationalUnit: department._id

    };
    if (status !== 3) {
        keySearch = {
            ...keySearch,
            status: status
        };
    }
    if (data.startDate !== "undefined" && data.endDate !== "undefined") {
        keySearch = {
            ...keySearch,
            date: { "$gte": startdate, "$lt": enddate }
        }
    }
    if (data.startDate !== "undefined" && data.endDate == "undefined") {
        keySearch = {
            ...keySearch,
            date: { "$gte": startdate }

        }
    }
    if (data.startDate == "undefined" && data.endDate !== "undefined") {
        keySearch = {
            ...keySearch,
            date: { "$lt": enddate }
        }
    }
    var kpiunits = await KPIUnit.find(keySearch)
        .skip(0).limit(12).populate("organizationalUnit creator").populate({ path: "kpis", populate: { path: 'parent' } });
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
        if (kpiunits[i].target.length == 0) {
            childTarget[i] = {
                _id: kpiunits[i].kpis._id,
                status: kpiunits[i].kpis.status,
                automaticPoint: kpiunits[i].kpis.automaticPoint,
                employeePoint: kpiunits[i].kpis.employeePoint,
                approvedPoint: kpiunits[i].kpis.approvedPoint,
                name: kpiunits[i].kpis.name,
                parent: kpiunits[i].kpis.parent,
                criteria: kpiunits[i].kpis.criteria,
                weight: kpiunits[i].kpis.weight,
                arrtarget: arrtarget
            };
        } else {
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
                    _id: kpiunits[i].kpis._id,
                    status: kpiunits[i].kpis.status,
                    automaticPoint: kpiunits[i].kpis.automaticPoint,
                    employeePoint: kpiunits[i].kpis.employeePoint,
                    approvedPoint: kpiunits[i].kpis.approvedPoint,
                    name: kpiunits[i].kpis.name,
                    parent: kpiunits[i].kpis.parent,
                    criteria: kpiunits[i].kpis.criteria,
                    weight: kpiunits[i].kpis.weight,
                    arrtarget: arrtarget
                };
            }
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
exports.copyKPI = async (data) => {

    var date = data.dateold.split("-");
    var dateold = new Date(date[0], date[1], 0);
    var date = data.datenew.split("-");
    var dateNewKPIUnit = new Date(date[1], date[0], 0);
    var monthOldKPI = dateold.getMonth();
    var yearOldKPI = dateold.getFullYear();
    var monthNewKPI = dateNewKPIUnit.getMonth();
    var yearNewKPI = dateNewKPIUnit.getFullYear();
    var department = await Department.findOne({
        $or: [
            { dean: data.id },
            { viceDean: data.id },
            { employee: data.id }
        ]
    });
    // console.log("=========-----", department);
    var organizationalUnitOldKPI = await KPIUnit.find({ organizationalUnit: department._id })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    var check = organizationalUnitOldKPI.find(e => (e.date.getMonth() === monthNewKPI && e.date.getFullYear() === yearNewKPI));
    if (check == undefined) {
        var list = organizationalUnitOldKPI.find(e => (e.date.getMonth() === monthOldKPI && e.date.getFullYear() === yearOldKPI));
        var organizationalUnitNewKpi = await KPIUnit.create({
            organizationalUnit: list.organizationalUnit._id,
            creator: list.creator._id,
            date: dateNewKPIUnit,
            kpis: []
        })
        for (let i in list.kpis) {
            var target = await DetailKPIUnit.create({
                name: list.kpis[i].name,
                parent: list.kpis[i].parent,
                weight: list.kpis[i].weight,
                criteria: list.kpis[i].criteria,
                type: list.kpis[i].type
            })
            organizationalUnitKpi = await KPIUnit.findByIdAndUpdate(
                organizationalUnitNewKpi, { $push: { kpis: target._id } }, { new: true }
            );
        }
        organizationalUnitKpi = await KPIUnit.find({ organizationalUnit: department._id })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    }

    return organizationalUnitKpi;
}