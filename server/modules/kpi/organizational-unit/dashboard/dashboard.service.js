const { OrganizationalUnit, OrganizationalUnitKpiSet, OrganizationalUnitKpi, EmployeeKpiSet, Task } = require('../../../../models/index').schema;

/** Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại */
exports.getAllChildTargetOfOrganizationalUnitKpis = async (userRoleId) => {
    var organizationalUnit = await OrganizationalUnit.findOne({
        $or: [
            { 'dean': userRoleId },
            { 'viceDean': userRoleId },
            { 'employee': userRoleId }
        ]
    });

    var now = new Date();
    var currentYear = now.getFullYear();
    var currentMonth = now.getMonth();
    var date = new Date(currentYear, currentMonth + 1, 0);
    
    var kpiunits = await OrganizationalUnitKpiSet.find({
        $and: [
            { 'organizationalUnit': organizationalUnit._id },
            { 'date': date }
        ]
    })

    var childTargets = await OrganizationalUnitKpiSet.aggregate([
        { $match: { '_id' : kpiunits[0]._id } },

        { $lookup: {
                from: "organizational_unit_kpis",
                localField: "kpis",
                foreignField: "_id",
                as : "organizationalUnitKpis"
        }},

        { $lookup: {
            from: "employee_kpis",
            localField: "organizationalUnitKpis._id",
            foreignField: "parent",
            as: "employeeKpis" 
        }},

        { $project: { 'employeeKpis': 1, '_id': 0 } },
        { $unwind: "$employeeKpis"},
        { $replaceRoot: { newRoot: "$employeeKpis" } }
    ])

    for(var i=0; i<childTargets.length; i++) {
        var creators = await EmployeeKpiSet.aggregate([
            { $unwind: "$kpis"},
            { $match: { 'kpis': childTargets[i]._id}}
        ])
        Object.assign(childTargets[i], { creator: creators[0].creator })
    };
    return childTargets;   
}

/** Lấy tất cả task của organizationalUnit hiện tại (chỉ lấy phần evaluations của tháng hiện tại) */
exports.getAllTaskOfOrganizationalUnit = async (userRoleId) => {
    var organizationalUnit = await OrganizationalUnit.findOne({
        $or: [
            { 'dean': userRoleId },
            { 'viceDean': userRoleId },
            { 'employee': userRoleId }
        ]
    });

    var now = new Date();
    var currentYear = now.getFullYear();
    var currentMonth = now.getMonth();
    var endOfCurrentMonth = new Date(currentYear, currentMonth+1);
    var endOfLastMonth = new Date(currentYear, currentMonth);
    var tasks = await Task.aggregate([
        { $match: { 'organizationalUnit': organizationalUnit._id }},
        { $match: { 
            $or: [
                { 'endDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth }},
                { 'startDate': { $lte: endOfCurrentMonth, $gt: endOfLastMonth }},
                {$and: [{ 'endDate': { $gte: endOfCurrentMonth }}, {'startDate': { $lte: endOfLastMonth }}]}
            ]
        }},

        { $unwind: "$evaluations"},
        { $match: {
            $or: [
                { 'evaluations.date': undefined },
                { 'evaluations.date': { $lte: endOfCurrentMonth, $gt: endOfLastMonth }}
            ]
        }},

        { $project: { 'startDate': 1, 'endDate': 1, 'evaluations': 1, 'accountableEmployees': 1, 'consultedEmployees': 1, 'informedEmployees': 1 }}
    ])

    return tasks;
}

/** Lấy danh sách các tập KPI đơn vị theo từng năm của từng đơn vị */
exports.getAllOrganizationalUnitKpiSetEachYear = async (userRoleId, year) => {
    
    var organizationalUnit = await OrganizationalUnit.findOne({
        $or: [
            { 'dean': userRoleId },
            { 'viceDean': userRoleId },
            { 'employee': userRoleId }
        ]
    });

    var beginOfYear = new Date(year);
    var endOfYear = new Date(year, 12);

    var organizational_unit_kpi_sets = await OrganizationalUnitKpiSet.find(
        { 'organizationalUnit': organizationalUnit._id, 'date': { $gte: beginOfYear, $lte: endOfYear} },
        { automaticPoint: 1, employeePoint: 1, approvedPoint: 1, date: 1 }
    )
    
    return organizational_unit_kpi_sets;
}
