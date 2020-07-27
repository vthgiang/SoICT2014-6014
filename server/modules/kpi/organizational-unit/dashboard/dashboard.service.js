const { OrganizationalUnit, OrganizationalUnitKpiSet} = require('../../../../models/index').schema;
const arrayToTree = require('array-to-tree');
const EvaluationDashboardService = require('../../evaluation/dashboard/dashboard.service');

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
 * Lấy danh sách các tập KPI đơn vị theo thời gian của từng đơn vị
 * @query {*} organizationalUnitId 
 * @query {*} startDate
 * @query {*} endDate
 */
exports.getAllOrganizationalUnitKpiSetByTime = async (query) => {
    let organizationalUnitKpiSets = await OrganizationalUnitKpiSet.find(
        {
            'organizationalUnit': query.organizationalUnitId,
            'date': {
                $gte: query.startDate,
                $lt: query.endDate
            }
        },
        { automaticPoint: 1, employeePoint: 1, approvedPoint: 1, date: 1 }
    )
    return organizationalUnitKpiSets;
}

/** 
 * Lấy danh sách các tập KPI đơn vị theo thời gian của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại 
 * @query {*} roleId 
 * @query {*} startDate
 * @query {*} endDate
 */
exports.getAllOrganizationalUnitKpiSetByTimeOfChildUnit = async (companyId, query) => {

    let childOrganizationalUnitKpiSets = [], childrenOrganizationalUnits;

    childrenOrganizationalUnits = await getAllChildrenOrganizational(companyId, query.roleId);

    for (let i = 0; i < childrenOrganizationalUnits.length; i++) {
        childOrganizationalUnitKpiSets.push(await this.getAllOrganizationalUnitKpiSetByTime(childrenOrganizationalUnits[i].id, query.startDate, query.endDate));
        childOrganizationalUnitKpiSets[i].unshift({ 'name': childrenOrganizationalUnits[i].name })
    }

    return childOrganizationalUnitKpiSets;
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

    let arrayTreeOranizationalUnit = await this.getChildrenOfOrganizationalUnitsAsTree(companyId, roleId);

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
 * Lấy các đơn vị con của một đơn vị và đơn vị đó
 * @id Id công ty
 * @role Id của role ứng với đơn vị cần lấy đơn vị con
 */
exports.getChildrenOfOrganizationalUnitsAsTree = async (id, role) => {
    let organizationalUnit = await OrganizationalUnit.findOne({
        $or: [
            {'deans': { $in: role }}, 
            {'viceDeans':{ $in: role }}, 
            {'employees':{ $in: role }}
        ]
    });
    const data = await OrganizationalUnit.find({ company: id });
    
    const newData = data.map( department => {return {
            id: department._id.toString(),
            name: department.name,
            description: department.description,
            deans: department.deans.map(item => item.toString()),
            viceDeans: department.viceDeans.map(item => item.toString()),
            employees: department.employees.map(item => item.toString()),
            parent_id: department.parent !== null ? department.parent.toString() : null
        }
    });
    
    const tree = await arrayToTree(newData);
    for(let j = 0; j < tree.length; j++){
        let queue = [];
        if(organizationalUnit.name === tree[j].name){
            return tree[j];
        }
        queue.push(tree[j]);
        while(queue.length > 0){
            v = queue.shift();
            if(v.children !== undefined){
                for(let i = 0; i < v.children.length; i++){
                    let u = v.children[i];
                    if(organizationalUnit.name === u.name){                        
                        return u;
                    }
                    else{
                        queue.push(u);
                    }
                }
            }
        }
    }

    return null;
}