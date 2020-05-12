const { OrganizationalUnit, OrganizationalUnitKpiSet, OrganizationalUnitKpi, EmployeeKpi, Department } = require('../../../../models/index').schema;

/**
 * Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại
 * @id Id của role người dùng
 */
exports.getChildTargetOfOrganizationalUnitKpis = async (id) => {
    var organizationalUnit = await OrganizationalUnit.findOne({
        $or: [
            { 'dean': id },
            { 'viceDean': id },
            { 'employee': id }
        ]
    });
    var kpiunits = await OrganizationalUnitKpiSet.findOne({organizationalUnit: organizationalUnit._id})
    
    var childTargets = await OrganizationalUnitKpiSet.aggregate([
        {$lookup:{
                from: "organizational_unit_kpis",
                localField: "kpis",
                foreignField: "_id",
                as : "organizationalUnitKpis"
        }},

        {$match: {_id : kpiunits._id }},
        {$lookup: {
            from : "empoloyee_kpis",
            localField : "organizationalUnitKpis._id",
            foreignField: "parent",
            as:"employeeKpis" 
        }},

        {$project: { "employeeKpis": 1, "_id": 0 }},
        {$unwind: "$employeeKpis"},
        {$group: {
            _id: "$employeeKpis.parent",
            count: { $sum: 1 }
        }}

    ])
    
    return childTargets;   
}