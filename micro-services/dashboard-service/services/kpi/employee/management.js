const mongoose = require('mongoose');
const Models = require('../../../models');
const { EmployeeKpiSet, EmployeeKpi, OrganizationalUnit, OrganizationalUnitKpiSet } = Models;
const OrganizationalUnitService = require('../../super-admin/organizationalUnit');
const { connect } = require('../../../helpers/dbHelper');
const { getDbConnection } = require('../../../database')

/**
 * get all kpi set in Organizational Unit by month
 * @data : dữ liệu lấy từ params {userId, department, date}
 */
exports.getAllKPIEmployeeSetsInOrganizationByMonth = async (portal, data) => {
    let userId = data.user;
    let departmentId = data.department;
    let date = data.date;

    let splitterDate = date.split('-');
    let dateISO = new Date(splitterDate[2], splitterDate[1] - 1, splitterDate[0]);
    let monthOfParams = dateISO.getMonth();
    let yearOfParams = dateISO.getFullYear();

    let kpiSets = await EmployeeKpiSet(connect(getDbConnection(), portal))
        .find({
            creator: userId,
            organizationalUnit: departmentId
        })
        .populate({ path: 'kpis', select: 'name type' });

    let kpiSetsByMonth = kpiSets.find(e => (e.date.getMonth() === monthOfParams && e.date.getFullYear() === yearOfParams));

    return kpiSetsByMonth;

}

/** 
 * service Khởi tạo KPI tháng mới từ KPI tháng này
 */
exports.copyKPI = async (portal, id, data) => {
    let { unitId, dateNew, creator } = data;
    let monthSearch, nextMonthSearch;

    monthSearch = new Date(dateNew);
    nextMonthSearch = new Date(dateNew);
    nextMonthSearch.setMonth(nextMonthSearch.getMonth() + 1);


    let checkEmployeeKPISet = await EmployeeKpiSet(connect(getDbConnection(), portal)).findOne({
        organizationalUnit: unitId,
        creator: creator,
        '$and': [
            {
                '$expr': {
                    '$eq': [{ '$month': '$date' }, monthSearch.getMonth() + 1]
                }
            },
            {
                '$expr': {
                    '$eq': [{ '$year': '$date' }, monthSearch.getFullYear()]
                }
            }
        ]
    })

    if (checkEmployeeKPISet) {
        throw { messages: 'employee_kpi_set_exist' }
    } else {
        let employeeKpiSet, oldEmployeeKpiSet, newEmployeeKpiSet;

        oldEmployeeKpiSet = await EmployeeKpiSet(connect(getDbConnection(), portal))
            .findById(id)
            .populate('organizationalUnit')
            .populate({ path: 'creator', select: '_id name email avatar' })
            .populate({ path: 'kpis', populate: { path: 'parent' } })
            .populate({ path: 'logs.creator', select: '_id name email avatar' })

        let parentUnitKpiSet = await OrganizationalUnitKpiSet(connect(getDbConnection(), portal))
            .findOne({
                organizationalUnit: mongoose.Types.ObjectId(oldEmployeeKpiSet?.organizationalUnit?._id),
                date: { $gte: monthSearch, $lt: nextMonthSearch }
            })
            .populate({ path: 'kpis' });

        newEmployeeKpiSet = await EmployeeKpiSet(connect(getDbConnection(), portal))
            .create({
                organizationalUnit: oldEmployeeKpiSet?.organizationalUnit?._id,
                creator: creator,
                date: monthSearch,
                kpis: [],
                approver: oldEmployeeKpiSet?.approver,
            })

        for (let i in oldEmployeeKpiSet.kpis) {
            let parentKpi = parentUnitKpiSet?.kpis?.filter(item => {
                return item?.name === oldEmployeeKpiSet.kpis[i]?.parent?.name
            })

            let parent = parentKpi?.[0]?._id

            let target = await EmployeeKpi(connect(getDbConnection(), portal))
                .create({
                    name: oldEmployeeKpiSet.kpis[i].name,
                    weight: oldEmployeeKpiSet.kpis[i].weight,
                    criteria: oldEmployeeKpiSet.kpis[i].criteria,
                    type: oldEmployeeKpiSet.kpis[i].type,
                    parent: parent,
                });
            employeeKpiSet = await EmployeeKpiSet(connect(getDbConnection(), portal))
                .findByIdAndUpdate(
                    newEmployeeKpiSet, { $push: { kpis: target._id } }, { new: true }
                );
        }

        employeeKpiSet = await EmployeeKpiSet(connect(getDbConnection(), portal))
            .findById(newEmployeeKpiSet)
            .populate('organizationalUnit')
            .populate({ path: 'approver', select: '_id name email avatar' })
            .populate({ path: 'creator', select: '_id name email avatar' })
            .populate({ path: 'kpis', populate: { path: 'parent' } })
            .populate({ path: 'logs.creator', select: '_id name email avatar' })

        return {
            employeeKpiSet: employeeKpiSet,
            copyKpi: oldEmployeeKpiSet
        };
    }
}

/**
 * Lấy tất cả employeeKpi thuộc organizationalUnitKpi hiện tại
 * @query {*} organizationalUnitId 
 * @query {*} month 
 */
exports.getAllEmployeeKpiInOrganizationalUnit = async (portal, roleId, organizationalUnitId, month) => {

    let organizationalUnit, employeeKpis;
    let time = month ? new Date(month) : new Date();
    let currentYear = time.getFullYear();
    let currentMonth = time.getMonth() + 1;

    if (!organizationalUnitId) {
        organizationalUnit = await OrganizationalUnit(connect(getDbConnection(), portal))
            .findOne({
                $or: [
                    { 'managers': roleId },
                    { 'deputyManagers': roleId },
                    { 'employees': roleId }
                ]
            });
    } else {
        organizationalUnit = { '_id': new mongoose.Types.ObjectId(organizationalUnitId) }
    }

    if (organizationalUnit) {
        employeeKpis = await OrganizationalUnitKpiSet(connect(getDbConnection(), portal))
            .aggregate([
                {
                    $match:
                    {
                        $and: [
                            {
                                $expr: {
                                    $eq: [{ $year: '$date' }, currentYear],
                                    $eq: [{ $month: '$date' }, currentMonth],

                                }
                            },
                            { organizationalUnit: organizationalUnit._id }
                        ]

                    }
                },

                // Tìm các organizationalUnitKpis từ bảng organizationalunitkpis
                {
                    $lookup: {
                        from: 'organizationalunitkpis',
                        localField: 'kpis',
                        foreignField: '_id',
                        as: 'organizationalUnitKpis'
                    }
                },
                { $unwind: '$organizationalUnitKpis' },

                // Tìm các employeeKpis từ bảng employeekpis
                {
                    $lookup: {
                        from: 'employeekpis',
                        localField: 'organizationalUnitKpis._id',
                        foreignField: 'parent',
                        as: 'employeeKpis'
                    }
                },
                {
                    $unwind: {
                        path: '$employeeKpis',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        'employeeKpis.parent': '$organizationalUnitKpis._id',
                        'employeeKpis.parentName': '$organizationalUnitKpis.name',
                        'employeeKpis.parentWeight': '$organizationalUnitKpis.weight'
                    }
                },

                // Tìm các parentNameOfUnitKpi từ bảng organizationalunitkpis
                {
                    $lookup: {
                        from: 'organizationalunitkpis',
                        localField: 'organizationalUnitKpis.parent',
                        foreignField: '_id',
                        as: 'parentNameOfUnitKpi'
                    }
                },
                {
                    $addFields: {
                        'employeeKpis.parentNameOfUnitKpi': '$parentNameOfUnitKpi.name',
                        'employeeKpis.parentOfUnitKpi': '$organizationalUnitKpis.parent',
                        'employeeKpis.organizationalUnitImportances': '$organizationalUnitImportances'
                    }
                },

                // Tìm các employeeKpiSet từ bảng employeekpisets
                {
                    $lookup: {
                        from: 'employeekpisets',
                        localField: 'employeeKpis._id',
                        foreignField: 'kpis',
                        as: 'employeeKpiSet'
                    }
                },

                // Lấy thông tin employee
                {
                    $lookup: {
                        from: 'users',
                        localField: 'employeeKpiSet.creator',
                        foreignField: '_id',
                        as: 'employee'
                    }
                },
                {
                    $addFields: {
                        'employeeKpis.creator': '$employeeKpiSet.creator',
                        'employeeKpis.creatorInfo': {
                            '_id': '$employee._id',
                            'name': '$employee.name',
                            'email': '$employee.email'
                        }
                    }
                },

                { $replaceRoot: { newRoot: '$employeeKpis' } },

                // Nhóm theo các organizational unit kpi
                {
                    $group: {
                        '_id': '$parentName',
                        'employeeKpi': { $push: '$$ROOT' }
                    }
                }
            ])
    }
    return employeeKpis;
}

/** 
 * Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng 
 * @query {*} organizationalUnitId 
 * @query {*} month
 */
exports.getAllEmployeeKpiSetInOrganizationalUnit = async (portal, query) => {
    let beginOfCurrentMonth = new Date(query.month);
    let endOfCurrentMonth = new Date(beginOfCurrentMonth.getFullYear(), beginOfCurrentMonth.getMonth() + 1);
    let organizationalUnit, employeeKpiSets;
    if (!query.organizationalUnitId) {
        organizationalUnit = await OrganizationalUnit(connect(getDbConnection(), portal))
            .findOne({
                $or: [
                    { 'managers': query.roleId },
                    { 'deputyManagers': query.roleId },
                    { 'employees': query.roleId }
                ]
            });
    } else {
        organizationalUnit = { '_id': new mongoose.Types.ObjectId(query.organizationalUnitId) }
    }

    if (organizationalUnit) {
        employeeKpiSets = await OrganizationalUnit(connect(getDbConnection(), portal))
            .aggregate([
                { $match: { '_id': organizationalUnit._id } },

                {
                    $lookup: {
                        from: 'userroles',
                        let: { deputyManagers: '$deputyManagers', employees: '$employees' },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        $or: [
                                            { $in: ['$roleId', '$$deputyManagers'] },
                                            { $in: ['$roleId', '$$employees'] }
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
                        from: 'employeekpisets',
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
    }

    return employeeKpiSets;
}

/** 
 * Lấy tất cả các đơn vị con của 1 đơn vị xếp vào 1 mảng 
 */
exports.getAllChildrenOrganizational = async (portal, roleId, organizationalUnitId) => {  // portal, companyId, roleId, organizationalUnitId //

    let arrayTreeOranizationalUnit = await OrganizationalUnitService.getChildrenOfOrganizationalUnitsAsTree(portal, roleId, organizationalUnitId); // portal, companyId, roleId, organizationalUnitId
    let childrenOrganizationalUnits, temporaryChild, deg = 0;

    if (arrayTreeOranizationalUnit) {
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
            temporaryChild.filter(x => x.hasOwnProperty('children')).map(x => {
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
    }

    return childrenOrganizationalUnits
}

/** 
 * Lấy tất cả EmployeeKpi thuộc các đơn vị con của đơn vị hiện tại 
 */
exports.getAllEmployeeKpiInChildrenOrganizationalUnit = async (portal, roleId, month, organizationalUnitId) => {

    let employeeKpisInChildrenOrganizationalUnit = [], childrenOrganizationalUnits;

    childrenOrganizationalUnits = await this.getAllChildrenOrganizational(portal, roleId, organizationalUnitId);

    if (childrenOrganizationalUnits) {
        for (let i = 0; i < childrenOrganizationalUnits.length; i++) {
            employeeKpisInChildrenOrganizationalUnit.push(await this.getAllEmployeeKpiInOrganizationalUnit(portal, null, childrenOrganizationalUnits[i].id, month));
            employeeKpisInChildrenOrganizationalUnit[i].unshift({
                'organizationalUnitId': childrenOrganizationalUnits[i].id,
                'name': childrenOrganizationalUnits[i].name,
                'deg': childrenOrganizationalUnits[i].deg
            })
        }
    }

    return employeeKpisInChildrenOrganizationalUnit;
}

/**
 * Lấy tất cả mục tiêu con của mục tiêu hiện tại của KPI đơn vị 
 * @param {*} kpiId id của OrganizationalUnitKPIset 
 */
exports.getChildTargetByParentId = async (portal, data) => {
    let kpiunits = await OrganizationalUnitKpiSet(connect(getDbConnection(), portal))
        .aggregate([
            { $match: { _id: mongoose.Types.ObjectId(data.organizationalUnitKpiSetId) } },
            {
                $lookup: {
                    from: 'organizationalunitkpis',
                    localField: 'kpis',
                    foreignField: '_id',
                    as: 'kpis'

                }
            },
            { $unwind: '$kpis' },
            {
                $lookup: {
                    from: 'employeekpis',
                    localField: 'kpis._id',
                    foreignField: 'parent',
                    as: 'target'
                }
            },
            {
                $project: {
                    'kpis': 1,
                    'target': 1

                }
            },
        ])

    let childTarget = [], target = [];
    for (let i in kpiunits) {
        let arrtarget = [];
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
                let employeekpiset = await EmployeeKpiSet(connect(getDbConnection(), portal))
                    .findOne({
                        kpis: kpiunits[i].target[j]._id
                    })
                    .populate('organizationalUnit')
                    .populate({ path: 'creator', select: '_id name email avatar' })
                    .select('organizationalUnit creator');
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

exports.createEmployeeKpiSetLogs = async (portal, data) => {
    const { creator, title, description, employeeKpiSetId } = data;

    let log = {
        creator: creator,
        title: title,
        description: description,
    };

    await EmployeeKpiSet(connect(getDbConnection(), portal))
        .updateOne(
            { '_id': employeeKpiSetId },
            { $push: { logs: log } },
            { new: true }
        )
        .populate({ path: 'logs.creator', select: '_id name emmail avatar' });

    let kpiLogs = await this.getEmployeeKpiSetLogs(portal, employeeKpiSetId);

    return kpiLogs;
}

exports.getEmployeeKpiSetLogs = async (portal, employeeKpiSetId) => {
    let kpiLogs = await EmployeeKpiSet(connect(getDbConnection(), portal))
        .findById(employeeKpiSetId)
        .populate({ path: 'logs.creator', select: '_id name emmail avatar' });

    return kpiLogs?.logs?.reverse();
}
