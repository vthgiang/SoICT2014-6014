const EmployeeKpiSet = require('../../../../models/kpi/employeeKpiSet.model');
const EmployeeKpi = require('../../../../models/kpi/employeeKpi.model');
const OrganizationalUnit = require('../../../../models/super-admin/organizationalUnit.model');
const OrganizationalUnitKpiSet = require('../../../../models/kpi/organizationalUnitKpiSet.model');
const OrganizationalUnitKpi = require('../../../../models/kpi/organizationalUnitKpi.model');

const OrganizationalUnitService = require('../../../super-admin/organizational-unit/organizationalUnit.service');
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
    }).populate({ path: 'kpis', select: 'name type' });

    let kpiSetsByMonth = kpiSets.find(e => (e.date.getMonth() === monthOfParams && e.date.getFullYear() === yearOfParams));

    return kpiSetsByMonth;

}

/**
 * service Khởi tạo KPI tháng mới từ KPI tháng này
 */
exports.copyKPI = async (id, data) => {
    let OldEmployeeKpiSet = await EmployeeKpiSet.findById(id)
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });
    let date, dateNewEmployeeKPI, employeeKpiSet;
    date = data.dateNew.split("-");
    dateNewEmployeeKPI = new Date(date[1], date[0], 0);

    var NewEmployeeKpiSet = await EmployeeKpiSet.create({
        organizationalUnit: OldEmployeeKpiSet.organizationalUnit._id,
        creator: data.creator,
        date: dateNewEmployeeKPI,
        kpis: [],
        approver: OldEmployeeKpiSet.approver,
    })

    for (let i in OldEmployeeKpiSet.kpis) {
        var target = await EmployeeKpi.create({
            name: OldEmployeeKpiSet.kpis[i].name,
            weight: OldEmployeeKpiSet.kpis[i].weight,
            criteria: OldEmployeeKpiSet.kpis[i].criteria,
            type: OldEmployeeKpiSet.kpis[i].type,
            parent: null,
        });
        employeeKpiSet = await EmployeeKpiSet.findByIdAndUpdate(
            NewEmployeeKpiSet, { $push: { kpis: target._id } }, { new: true }
        );
    }

    employeeKpiSet = await EmployeeKpiSet.find({ creator: mongoose.Types.ObjectId(data.creator) })
        .populate("organizationalUnit creator")
        .populate({ path: "kpis", populate: { path: 'parent' } });

    return employeeKpiSet;
}

/**
 * Lấy tất cả employeeKpi thuộc organizationalUnitKpi hiện tại
 * @query {*} organizationalUnitId 
 * @query {*} month 
 */
exports.getAllEmployeeKpiInOrganizationalUnit = async (roleId, organizationalUnitId, month) => {

    let organizationalUnit;
    let now, currentYear, currentMonth, endOfCurrentMonth, endOfLastMonth;

    if (month) {
        now = new Date(month);
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

    if (!organizationalUnitId) {
        organizationalUnit = await OrganizationalUnit.findOne({
            $or: [
                { 'deans': roleId },
                { 'viceDeans': roleId },
                { 'employees': roleId }
            ]
        });
    } else {
        organizationalUnit = { '_id': new mongoose.Types.ObjectId(organizationalUnitId) }
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

        // Tìm các organizationalUnitKpis từ bảng organizational_unit_kpis
        {
            $lookup: {
                from: "organizational_unit_kpis",
                localField: "kpis",
                foreignField: "_id",
                as: "organizationalUnitKpis"
            }
        },
        { $unwind: "$organizationalUnitKpis" },

        // Tìm các employeeKpis từ bảng employee_kpis
        {
            $lookup: {
                from: "employee_kpis",
                localField: "organizationalUnitKpis._id",
                foreignField: "parent",
                as: "employeeKpis"
            }
        },
        {
            $unwind: {
                path: "$employeeKpis",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                'employeeKpis.parentName': "$organizationalUnitKpis.name"
            }
        },
        
        // Tìm các parentNameOfUnitKpi từ bảng organizational_unit_kpis
        {
            $lookup: {
                from: "organizational_unit_kpis",
                localField: "organizationalUnitKpis.parent",
                foreignField: "_id",
                as: "parentNameOfUnitKpi"
            }
        },
        {
            $addFields: {
                'employeeKpis.parentNameOfUnitKpi': "$parentNameOfUnitKpi.name"
            }
        },

        // Tìm các employeeKpiSet từ bảng employee_kpi_sets
        {
            $lookup: {
                from: "employee_kpi_sets",
                localField: "employeeKpis._id",
                foreignField: "kpis",
                as: "employeeKpiSet"
            }
        },
        {
            $addFields: {
                "employeeKpis.creator": "$employeeKpiSet.creator"
            }
        },

        { $replaceRoot: { newRoot: "$employeeKpis" } },

        // Nhóm theo các organizational unit kpi
        {
            $group: {
                '_id': "$parentName",
                'employeeKpi': { $push: "$$ROOT" }
            }
        }
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

    let organizationalUnit;
    if (!query.organizationalUnitId) {
        organizationalUnit = await OrganizationalUnit.findOne({
            $or: [
                { 'deans': query.roleId },
                { 'viceDeans': query.roleId },
                { 'employees': query.roleId }
            ]
        });
    } else {
        organizationalUnit = { '_id': new mongoose.Types.ObjectId(query.organizationalUnitId) }
    }

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
exports.getAllChildrenOrganizational = async (companyId, roleId, organizationalUnitId) => {

    let arrayTreeOranizationalUnit = await OrganizationalUnitService.getChildrenOfOrganizationalUnitsAsTree(companyId, roleId, organizationalUnitId);

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
exports.getAllEmployeeKpiInChildrenOrganizationalUnit = async (companyId, roleId, month, organizationalUnitId) => {

    let employeeKpisInChildrenOrganizationalUnit = [], childrenOrganizationalUnits;

    childrenOrganizationalUnits = await this.getAllChildrenOrganizational(companyId, roleId, organizationalUnitId);

    for (let i = 0; i < childrenOrganizationalUnits.length; i++) {
        employeeKpisInChildrenOrganizationalUnit.push(await this.getAllEmployeeKpiInOrganizationalUnit(null, childrenOrganizationalUnits[i].id, month));
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
