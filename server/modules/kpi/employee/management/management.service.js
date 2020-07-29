const EmployeeKpiSet = require('../../../../models/kpi/employeeKpiSet.model');
const EmployeeKpi = require('../../../../models/kpi/employeeKpi.model');
const OrganizationalUnit = require('../../../../models/super-admin/organizationalUnit.model');
const OrganizationalUnitKpiSet = require('../../../../models/kpi/organizationalUnitKpiSet.model');
const OrganizationalUnitKpi = require('../../../../models/kpi/organizationalUnitKpi.model');
const DashboardOrganizationalUnit = require('../dashboard/dashboard.service')
const mongoose = require("mongoose");

/**
 * get all kpi set in Organizational Unit by month
 * @data : dữ liệu lấy từ params {userId, department, date}
 */
exports.getAllKPIEmployeeSetsInOrganizationByMonth = async (data) => {
    let userId = data.user;
    let departmentId = data.department;
    let date = data.date;

    let splitterDate = date.split("-");
    let dateISO = new Date(splitterDate[2], splitterDate[1] - 1, splitterDate[0]);
    let monthOfParams = dateISO.getMonth();
    let yearOfParams = dateISO.getFullYear();

    let kpiSets = await EmployeeKpiSet.find({
        creator: userId,
        organizationalUnit: departmentId
    }).populate({ path: 'kpis', select: 'name' });

    let kpiSetsByMonth = kpiSets.find(e => (e.date.getMonth() === monthOfParams && e.date.getFullYear() === yearOfParams));

    return kpiSetsByMonth;

}

/**
 * service Khởi tạo KPI tháng mới từ KPI tháng này
 */
exports.copyKPI = async (data) => {
    let date = data.dateOld.split("-");
    let dateOld = new Date(date[0], date[1], 0);
    date = data.dateNew.split("-");
    let dateNewEmployeeKPI = new Date(date[1], date[0], 0);
    let monthOldKPI = dateOld.getMonth();
    let yearOldKPI = dateOld.getFullYear();
    let monthNewKPI = dateNewEmployeeKPI.getMonth();
    let yearNewKPI = dateNewEmployeeKPI.getFullYear();
    let OldEmployeeKPI = await EmployeeKpiSet.find({ creator: mongoose.Types.ObjectId(data.id), organizationalUnit: data.unitId })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    var check = OldEmployeeKPI.find(e => (e.date.getMonth() === monthNewKPI && e.date.getFullYear() === yearNewKPI));
    if (check == undefined) {
        var list = OldEmployeeKPI.find(e => (e.date.getMonth() === monthOldKPI && e.date.getFullYear() === yearOldKPI));
        if(list) {
            var NewEmployeeKpi = await EmployeeKpiSet.create({
            organizationalUnit: list.organizationalUnit._id,
            creator: list.creator._id,
            date: dateNewEmployeeKPI,
            kpis: [],
            approver: list.approver,
            })
            for (let i in list.kpis) {
                var target = await EmployeeKpi.create({
                    name: list.kpis[i].name,
                    weight: list.kpis[i].weight,
                    criteria: list.kpis[i].criteria,
                    type: list.kpis[i].type,
                    parent: null,
                });
                EmployeeKpis = await EmployeeKpiSet.findByIdAndUpdate(
                    NewEmployeeKpi, { $push: { kpis: target._id } }, { new: true }
                );
            }
        }
        EmployeeKpis = await EmployeeKpiSet.find({ creator: mongoose.Types.ObjectId(data.id) })
            .populate("organizationalUnit creator")
            .populate({ path: "kpis", populate: { path: 'parent' } });
    }

    return EmployeeKpis;
}

/**
 * Lấy tất cả employeeKpi thuộc organizationalUnitKpi hiện tại
 * @query {*} organizationalUnitId 
 * @query {*} month 
 */
exports.getAllEmployeeKpiInOrganizationalUnit = async (query) => {

    let organizationalUnit;
    let now, currentYear, currentMonth, endOfCurrentMonth, endOfLastMonth;

    if (query.month) {
        now = new Date(query.month);
        currentYear = now.getFullYear();
        currentMonth = now.getMonth();
        endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
        endOfLastMonth = new Date(currentYear, currentMonth);
    } else {
        now = new Date();
        currentYear = now.getFullYear();
        currentMonth = now.getMonth();
        endOfCurrentMonth = new Date(currentYear, currentMonth + 1);
        endOfLastMonth = new Date(currentYear, currentMonth);
    }

    if (!query.organizationalUnitId) {
        organizationalUnit = await OrganizationalUnit.findOne({
            $or: [
                { 'deans': query.roleId },
                { 'viceDeans': query.roleId },
                { 'employees': query.roleId }
            ]
        });
    } else {
        organizationalUnit = await OrganizationalUnit.findOne({ '_id': query.organizationalUnitId });
    }

    let employeeKpis = await OrganizationalUnitKpiSet.aggregate([
        {
            $match:
            {
                $and: [
                    { 'organizationalUnit': organizationalUnit._id },
                    { 'date': { $gt: endOfLastMonth, $lte: endOfCurrentMonth } }
                ]
            }
        },

        {
            $lookup: {
                from: "organizational_unit_kpis",
                localField: "kpis",
                foreignField: "_id",
                as: "organizationalUnitKpis"
            }
        },
        { $unwind: "$organizationalUnitKpis" },

        {
            $lookup: {
                from: "employee_kpis",
                localField: "organizationalUnitKpis._id",
                foreignField: "parent",
                as: "employeeKpis"
            }
        },
        { $unwind: "$employeeKpis" },

        {
            $lookup: {
                from: "employee_kpi_sets",
                localField: "employeeKpis._id",
                foreignField: "kpis",
                as: "employeeKpiSet"
            }
        },
        { $unwind: "$employeeKpiSet" },

        {
            $addFields: {
                "employeeKpis.organizationalUnitKpiParent": "$organizationalUnitKpis.parent",
                "employeeKpis.creator": "$employeeKpiSet.creator"
            }
        },

        { $replaceRoot: { newRoot: "$employeeKpis" } }
    ])

    return employeeKpis;
}

/** 
 * Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng 
 * @query {*} organizationalUnitId 
 * @query {*} month
 */
exports.getAllEmployeeKpiSetInOrganizationalUnit = async (query) => {

    let beginOfCurrentMonth = new Date(query.month);
    let endOfCurrentMonth = new Date(beginOfCurrentMonth.getFullYear(), beginOfCurrentMonth.getMonth() + 1);

    let organizationalUnit = await OrganizationalUnit.findOne({ '_id': query.organizationalUnitId });

    let employeeKpiSets = await OrganizationalUnit.aggregate([
        { $match: { '_id': organizationalUnit._id } },

        {
            $lookup: {
                from: 'user_roles',
                let: { viceDeans: '$viceDeans', employees: '$employees' },
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $or: [
                                    { $in: ["$roleId", "$$viceDeans"] },
                                    { $in: ["$roleId", "$$employees"] }
                                ]
                            }
                        }
                    }
                ],
                as: 'employeeInOrganizationalUnit'
            }
        },

        { $unwind: '$employeeInOrganizationalUnit' },
        { $replaceRoot: { newRoot: '$employeeInOrganizationalUnit' } },

        {
            $lookup: {
                from: 'employee_kpi_sets',
                localField: 'userId',
                foreignField: 'creator',
                as: 'employee_kpi_sets'
            }
        },

        { $unwind: '$employee_kpi_sets' },
        { $replaceRoot: { newRoot: '$employee_kpi_sets' } },

        {
            $match: {
                'date': { $lte: endOfCurrentMonth, $gte: beginOfCurrentMonth }
            }
        },

        { $project: { 'automaticPoint': 1, 'employeePoint': 1, 'approvedPoint': 1 } }
    ]);

    return employeeKpiSets;
}

/** 
 * Lấy tất cả các đơn vị con của 1 đơn vị xếp vào 1 mảng 
 */
getAllChildrenOrganizational = async (companyId, roleId) => {

    let arrayTreeOranizationalUnit = DashboardOrganizationalUnit.getChildrenOfOrganizationalUnitsAsTree(companyId, roleId);

    let childrenOrganizationalUnits, temporaryChild, deg = 0;

    temporaryChild = arrayTreeOranizationalUnit.children;

    childrenOrganizationalUnits = [{
        'name': arrayTreeOranizationalUnit.name,
        'id': arrayTreeOranizationalUnit.id,
        'deg': deg
    }]

    while (temporaryChild) {
        temporaryChild.map(x => {
            childrenOrganizationalUnits = childrenOrganizationalUnits.concat({
                'name': x.name,
                'id': x.id,
                'deg': deg + 1
            });
        })

        let hasNodeChild = [];
        temporaryChild.filter(x => x.hasOwnProperty("children")).map(x => {
            x.children.map(x => {
                hasNodeChild = hasNodeChild.concat(x)
            })
        });

        if (hasNodeChild.length === 0) {
            temporaryChild = undefined;
        } else {
            temporaryChild = hasNodeChild;
            deg++;
        }
    }

    return childrenOrganizationalUnits
}

/** 
 * Lấy tất cả EmployeeKpi thuộc các đơn vị con của đơn vị hiện tại 
 */
exports.getAllEmployeeKpiInChildrenOrganizationalUnit = async (companyId, roleId) => {

    let employeeKpisInChildrenOrganizationalUnit = [], childrenOrganizationalUnits;

    childrenOrganizationalUnits = await getAllChildrenOrganizational(companyId, roleId);

    for (let i = 0; i < childrenOrganizationalUnits.length; i++) {
        employeeKpisInChildrenOrganizationalUnit.push(await this.getAllEmployeeKpiInOrganizationalUnit("null", childrenOrganizationalUnits[i].id));
        employeeKpisInChildrenOrganizationalUnit[i].unshift({ 'name': childrenOrganizationalUnits[i].name, 'deg': childrenOrganizationalUnits[i].deg })
    }

    return employeeKpisInChildrenOrganizationalUnit;
}

/**
 * Lấy tất cả mục tiêu con của mục tiêu hiện tại của KPI đơn vị 
 * @param {*} kpiId id của OrganizationalUnitKPIset 
 */
exports.getChildTargetByParentId = async (data) => {
    var kpiunits = await OrganizationalUnitKpiSet.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(data.organizationalUnitKpiSetId) } },
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
                var employeekpiset = await EmployeeKpiSet.findOne({
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
