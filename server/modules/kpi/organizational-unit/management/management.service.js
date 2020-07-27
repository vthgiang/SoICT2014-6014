const OrganizationalUnit = require('../../../../models/super-admin/organizationalUnit.model');
const KPIUnit = require('../../../../models/kpi/organizationalUnitKpiSet.model');
const DetailKPIUnit = require('../../../../models/kpi/organizationalUnitKpi.model');
const EmployeeKPI = require('../../../../models/kpi/employeeKpi.model');
const EmployeeKPISet = require('../../../../models/kpi/employeeKpiSet.model');

const mongoose = require("mongoose");


//Lấy tất cả KPI của đơn vị
exports.getKPIUnits = async (data) => {
    var department = await OrganizationalUnit.findOne({
        $or: [
            { 'deans': data.roleId },
            { 'viceDeans': data.roleId },
            { 'employees': data.roleId }
        ]
    });
    let status = Number(data.status);
    if (data.startDate) {
        let startDate = data.startDate.split("-");
        var startdate = new Date(startDate[1] + "-" + startDate[0] + "-" + "01");
    }
    if (data.endDate) {
        var endDate = data.endDate.split("-");
        if (endDate[0] === "12") {
            endDate[1] = String(parseInt(endDate[1]) + 1);
            endDate[0] = "1";
        }
        endDate[0] = String(parseInt(endDate[0]) + 1);
        var enddate = new Date(endDate[2] + "-" + endDate[1] + "-" + endDate[0]);
    }
    let keySearch = {
        organizationalUnit: department._id
    };
    if (status !== -1) {
        keySearch = {
            ...keySearch,
            status: status
        };
    }
    if (data.startDate && data.endDate) {
        keySearch = {
            ...keySearch,
            date: { "$gte": startdate, "$lt": enddate }
        }
    }
    if (data.startDate) {
        keySearch = {
            ...keySearch,
            date: { "$gte": startdate }
        }
    }
    if (data.endDate) {
        keySearch = {
            ...keySearch,
            date: { "$lt": enddate }
        }
    }
    var kpiunits = await KPIUnit.find(keySearch)
        .skip(0).limit(12).populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    return kpiunits;
}

//Lấy tất cả mục tiêu con của mục tiêu hiện tại
exports.getChildTargetByParentId = async (data, query) => {
    var date = new Date(query.date);
    var monthkpi = date.getMonth() + 1;
    var yearkpi = date.getFullYear();
    var kpiunits = await KPIUnit.aggregate([
        { $match: { organizationalUnit: mongoose.Types.ObjectId(data.kpiId) } },
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


exports.copyKPI = async (query, data) => {
    var date, dateold, dateNewKPIUnit, monthOldKPI, yearOldKPI, monthNewKPI, yearNewKPI;
    date = data.dateold.split("-");
    dateold = new Date(date[0], date[1], 0);
    date = data.datenew.split("-");
    dateNewKPIUnit = new Date(date[1], date[0], 0);
    monthOldKPI = dateold.getMonth();
    yearOldKPI = dateold.getFullYear();
    monthNewKPI = dateNewKPIUnit.getMonth();
    yearNewKPI = dateNewKPIUnit.getFullYear();
    organizationalUnitOldKPI = await KPIUnit.find({ organizationalUnit: data.idunit })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });

    var check = organizationalUnitOldKPI.find(e => (e.date.getMonth() === monthNewKPI && e.date.getFullYear() === yearNewKPI));
    if (check == undefined) {
        var list = organizationalUnitOldKPI.find(e => (e.date.getMonth() === monthOldKPI && e.date.getFullYear() === yearOldKPI));
        var organizationalUnitNewKpi = await KPIUnit.create({
            organizationalUnit: list.organizationalUnit._id,
            creator: query.kpiId,
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
        organizationalUnitKpi = await KPIUnit.find({ organizationalUnit: data.idunit })
            .populate("organizationalUnit creator")
            .populate({ path: "kpis", populate: { path: 'parent' } });
    }
    return organizationalUnitKpi;
}