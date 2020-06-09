const { OrganizationalUnit, OrganizationalUnitKpiSet, OrganizationalUnitKpi, EmployeeKpiSet, Task, User } = require('../../../../models/index').schema;

const EvaluationDashboardService = require('../../evaluation/dashboard/dashboard.service');

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
    var endOfCurrentMonth = new Date(currentYear, currentMonth+1);
    var endOfLastMonth = new Date(currentYear, currentMonth);
    
    var kpiunits = await OrganizationalUnitKpiSet.find({
        $and: [
            { 'organizationalUnit': organizationalUnit._id },
            { 'date': { $gt: endOfLastMonth, $lte: endOfCurrentMonth} }
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
        ]);
        Object.assign(childTargets[i], { creator: creators[0].creator });
    };
    return childTargets;   
}

/** Lấy tất cả task của organizationalUnit theo tháng hiện tại*/
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

        { $project: { 'startDate': 1, 'endDate': 1, 'evaluations': 1, 'accountableEmployees': 1, 'consultedEmployees': 1, 'informedEmployees': 1, 'status': 1 }}
    ])

    return tasks;
}

/** Lấy danh sách các tập KPI đơn vị theo từng năm của từng đơn vị */
exports.getAllOrganizationalUnitKpiSetEachYear = async (organizationalUnitId, year) => {

    var beginOfYear = new Date(year);
    var endOfYear = new Date(year, 12);
    
    var organizationalUnitKpiSets = await OrganizationalUnitKpiSet.find(
        { 'organizationalUnit': organizationalUnitId, 'date': { $gte: beginOfYear, $lte: endOfYear} },
        { automaticPoint: 1, employeePoint: 1, approvedPoint: 1, date: 1 }
    )

    return organizationalUnitKpiSets;
}

/** Lấy danh sách các tập KPI đơn vị theo từng năm của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại */
exports.getAllOrganizationalUnitKpiSetEachYearOfChildUnit = async (companyId, userRoleId, year) => {

    var arrayTreeOranizationalUnit = await EvaluationDashboardService.getChildrenOfOrganizationalUnitsAsTree(companyId, userRoleId);

    var childOrganizationalUnitKpiSets, childOrganizationalUnit, temporaryChild;

    temporaryChild = arrayTreeOranizationalUnit.children;

    childOrganizationalUnit = {
        'name': arrayTreeOranizationalUnit.name,
        'id': arrayTreeOranizationalUnit.id
    }

    // while(temporaryChild) {
    //     temporaryChild.map(x => {
    //         childOrganizationalUnit = childOrganizationalUnit.concat({
    //             'name': x.name,
    //             'id': x.id
    //         });
    //     })
    //     console.log("555")
    //     var hasNodeChild = [];
    //     temporaryChild.filter(x => x.hasOwnProperty("children")).map(x => {
    //         x.children.map(x => {
    //             hasNodeChild = hasNodeChild.concat(x)
    //         })
    //     });
        
    //     if(hasNodeChild.length === 0) {
    //         temporaryChild = undefined;
    //     } else {
    //         temporaryChild = hasNodeChild
    //     }
    // }


    // childOrganizationalUnitKpiSets = childOrganizationalUnit.map(child => {
    //     return this.getAllOrganizationalUnitKpiSetEachYear(child._id, year);
    // });

    return childOrganizationalUnit;
}

/** Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng */
exports.getAllEmployeeKpiSetInOrganizationalUnit = async (userRoleId, month) => {

    var beginOfCurrentMonth = new Date(month);
    var endOfCurrentMonth = new Date(beginOfCurrentMonth.getFullYear(), beginOfCurrentMonth.getMonth()+1);

    var organizationalUnit = await OrganizationalUnit.findOne({
        $or: [
            { 'dean': userRoleId },
            { 'viceDean': userRoleId },
            { 'employee': userRoleId }
        ]
    });

    var employeeKpiSets = await OrganizationalUnit.aggregate([
        { $match: { '_id': organizationalUnit._id } },

        { $lookup: {
            from: 'user_roles',
            let: { viceDean: '$viceDean', employee: '$employee' },
            pipeline: [
                { $match: 
                    { $expr:
                        { $or: [
                            { $eq: [ "$roleId",  "$$viceDean" ] },
                            { $eq: [ "$roleId",  "$$employee" ] }
                        ]}
                    }
                }
            ],
            as: 'employees'
        }},

        { $unwind: '$employees' },
        { $replaceRoot: { newRoot: '$employees' } },

        { $lookup: {
            from: 'employee_kpi_sets',
            localField: 'userId',
            foreignField: 'creator',
            as: 'employee_kpi_sets'
        }},

        { $unwind: '$employee_kpi_sets' },
        { $replaceRoot: { newRoot: '$employee_kpi_sets' } },

        { $match: {
            'date': { $lte: endOfCurrentMonth, $gte: beginOfCurrentMonth }
        }},

        { $project: { 'automaticPoint': 1, 'employeePoint': 1, 'approvedPoint': 1 }}
    ]);

    return employeeKpiSets;
}
