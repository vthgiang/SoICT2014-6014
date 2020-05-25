const { OrganizationalUnit, EmployeeKpiSet } = require('../../../../models').schema;
const arrayToTree = require('array-to-tree');

/**
 * Lấy tất cả KPI của nhân viên theo vai trò
 * @role id của role
 */
exports.getAllEmployeeKpiSetOfUnitByRole = async (role) => {

    var organizationalUnit = await OrganizationalUnit.findOne({
        $or: [
            { 'dean': role },
            { 'viceDean': role },
            { 'employee': role }
        ]
    });

    var employeekpis = await EmployeeKpiSet.find({
        organizationalUnit: organizationalUnit._id
    }).skip(0).limit(50).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });

    return employeekpis;
}

/**
 * Lấy tất cả nhân viên theo vai trò
 * @role id của role
 */
exports.getAllEmployeeOfUnitByRole = async (role) => {
        var organizationalUnit = await OrganizationalUnit.findOne({
            $or: [
                { 'dean': role },
                { 'viceDean': role },
                { 'employee': role }
            ]
        });

        var employees = await UserRole.find({ roleId: organizationalUnit.employee}).populate('userId roleId');

        return employees;
}

/**
 * Lấy tất cả KPI của nhân viên theo mảng id đơn vị
 * @id Mảng id các đơn vị
 */
exports.getAllEmployeeKpiSetOfUnitByIds = async (id) => {
    var data = [];

    for(var i = 0; i < id.length; i++) {
        var employeekpis = await EmployeeKpiSet.find({
            organizationalUnit: id[i]
        }).skip(0).limit(50).populate("organizationalUnit creator approver").populate({ path: "kpis", populate: { path: 'parent' } });

        data = data.concat(employeekpis);
        
    };
       
    return data;
}

/**
 * Lấy tất cả nhân viên theo mảng id đơn vị
 * @id Mảng id các đơn vị
 */
exports.getAllEmployeeOfUnitByIds = async (id) => {
    var data = [];

    for(var i = 0; i < id.length; i++) {
        var organizationalUnit = await OrganizationalUnit.findById(id[i]);

        var employees = await UserRole.find({ roleId: organizationalUnit.employee}).populate('userId roleId');

        data = data.concat(employees);
    };
    
    return data;
}

/**
 * Lấy các đơn vị con của một đơn vị và đơn vị đó
 * @id Id công ty
 * @role Id của role ứng với đơn vị cần lấy đơn vị con
 */
exports.getChildrenOfOrganizationalUnitsAsTree = async (id, role) => {
    var organizationalUnit = await OrganizationalUnit.findOne({
        $or: [
            { 'dean': role },
            { 'viceDean': role },
            { 'employee': role }
        ]
    });
    
    const data = await OrganizationalUnit.find({ company: id })

    const newData = data.map( department => {return {
            id: department._id.toString(),
            name: department.name,
            description: department.description,
            dean:department.dean.toString(),
            viceDean:department.viceDean.toString(),
            employee:department.employee.toString(),
            parent_id: department.parent !== null ? department.parent.toString() : null
        }
    });
    const tree = await arrayToTree(newData);
        
    // BFS tìm các phòng ban con của role hiện tại
    for(var j = 0; j < tree.length; j++){
        var queue = [];
        if(organizationalUnit.name === tree[j].name){
            return tree[j];
        }
        queue.push(tree[j]);
        
        while(queue.length > 0){
            v = queue.shift();

            if(v.children !== undefined){
                for(var i = 0; i < v.children.length; i++){
                    var u = v.children[i];
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