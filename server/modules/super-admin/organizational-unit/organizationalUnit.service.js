const arrayToTree = require('array-to-tree');
const ObjectId = require('mongoose').Types.ObjectId;

const RoleService = require('../role/role.service');
const Terms = require('../../../seed/terms');

const { OrganizationalUnit, UserRole, Role } = require('../../../models').schema;

/**
 * Lấy danh sách các đơn vị trong công ty
 * @id id công ty
 */
exports.getOrganizationalUnits = async (id) => {
    return await OrganizationalUnit
        .find({ company: id })
        .populate([
            { path: 'deans', model: Role },
            { path: 'viceDeans', model: Role },
            { path: 'employees', model: Role }
        ]);
}

/**
 * Lấy thông tin đơn vị theo id
 * @id đơn vị
 */
exports.getOrganizationalUnit = async (id) => {
    return await OrganizationalUnit.findById(id);
}

/**
 * Lấy thông tin các đơn vị của công ty theo dạng CÂY 
 * @id id công ty
 */
exports.getOrganizationalUnitsAsTree = async (id) => {
    const data = await OrganizationalUnit.find({ company: id }).populate([
        { path: 'deans', model: Role },
        { path: 'viceDeans', model: Role },
        { path: 'employees', model: Role }
    ]); 
    const newData = data.map( department => {return {
            id: department._id.toString(),
            name: department.name,
            deans: department.deans.map(dean=>{ return {_id: dean._id.toString(), name: dean.name}}),
            viceDeans: department.viceDeans.map(viceDean=>{ return {_id: viceDean._id.toString(), name: viceDean.name}}),
            employees: department.employees.map(employee=>{ return {_id: employee._id.toString(), name: employee.name}}),
            description: department.description,
            parent_id: department.parent !== null ? department.parent.toString() : null
        }
    });
    const tree = await arrayToTree(newData);

    return tree;
}

/**
 * Lấy các đơn vị con của một đơn vị và đơn vị đó
 * @id Id công ty
 * @role Id của role ứng với đơn vị cần lấy đơn vị con
 * @organizationalUnit id của đơn vị 
 */
exports.getChildrenOfOrganizationalUnitsAsTree = async (id, role, organizationalUnitId = undefined) => {
    
    let organizationalUnit;

    if (!organizationalUnitId) {
        organizationalUnit = await OrganizationalUnit.findOne({
            $or: [
                {'deans': { $in: role }}, 
                {'viceDeans':{ $in: role }}, 
                {'employees':{ $in: role }}
            ]
        });
    } else {
        organizationalUnit = await OrganizationalUnit.findById(organizationalUnitId);
    }
    
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

        if (organizationalUnit.name === tree[j].name) {
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

/**
 * SERVICE: Lấy thông tin của đơn vị và các role trong đơn vị đó của user
 * Chi tiết dữ liệu trả về:
 * 1. Thông tin về đơn vị
 * 2. Thông tin về các vai trò trong đơn vị (Trưởng dv, Phó dv, Nhân viên dv)
 * 3. Id của các user tương ứng với từng vai trò của đơn vị
 * --------------------------------------
 * Thông tin xác định dựa trên 3 tham số
 * 1. companyId - tìm kiếm trong phạm vi công ty của người dùng
 * 2. userId - id của người dùng
 * 3. roleId - xác định vai trò truy cập hiện tại của người dùng trên website (vd: đang truy cập với quyền là Nhân viên phòng hành chính,...)
 */
exports.getOrganizationalUnitByUserRole = async (companyId, roleId) => {
    const department = await OrganizationalUnit.findOne({
        $or: [
            {'deans': roleId, company: companyId }, 
            {'viceDeans': roleId, company: companyId }, 
            {'employees': roleId, company: companyId }
        ]
    }).populate([
        { path: 'deans', model: Role, populate: { path: 'users', model: UserRole} },
        { path: 'viceDeans', model: Role, populate: { path: 'users', model: UserRole}  },
        { path: 'employees', model: Role, populate: { path: 'users', model: UserRole}  }
    ]);

    return department;
}

/**
 * Lấy thông tin đơn vị của user
 * @userId id của user
 */
exports.getOrganizationalUnitsOfUser = async (userId) => {
    const roles = await UserRole.find({ userId });
    const newRoles = roles.map(role => role.roleId.toString());
    const departments = await OrganizationalUnit.find({
        $or: [
            { 'deans': { $in: newRoles } },
            { 'viceDeans': { $in: newRoles } },
            { 'employees': { $in: newRoles } }
        ]
    });

    return departments;
}

/**
 * Lấy thông tin đơn vị mà user làm trưởng
 * @userId id của user
 */
exports.getOrganizationalUnitsThatUserIsDean = async (userId) => {
    const roles = await UserRole.find({ 'userId': userId });
    const newRoles = roles.map( role => role.roleId);
    const departments = await OrganizationalUnit.find({'deans': { $in: newRoles } });
    return departments;
}

/**
 * Phân loại các role được thêm, sửa, xóa
 * Mảng chứa các cặp giá trị {id, value} - id của role và tên role
 */
exports.getDiffRolesInOrganizationalUnit = async (oldArr, newArr) => {
    let deleteRoles = [];
    let createRoles = [];
    let editRoles = [];

    // Phân loại các role xóa
    for (let i = 0; i < oldArr.length; i++) {
        const index = await this.getIndex(oldArr[i], newArr);

        if( index === -1) { // Không thấy role này trong mảng mới -> role xóa
            deleteRoles.push(oldArr[i]); // Thêm vào mảng các role bị xóa
        }
    }

    // Phân loại role thêm mới
    for (let i = 0; i < newArr.length; i++) {
        const index = await this.getIndex(newArr[i], oldArr);

        if (index === -1) { // Không thấy role này trong mảng mới -> role xóa
            createRoles = [...createRoles, newArr[i]];
        } else {
            editRoles = [...editRoles, newArr[i]]; // Thêm vào mảng các role giữ nguyên hoặc chỉnh sửa
        } 
    }

    return {
        createRoles,
        editRoles,
        deleteRoles
    }
}

exports.getIndex = async(node, array) => {
    var result = -1;
    
    array.forEach((value, index) => {
        if(node._id && value._id && value._id.toString() === node._id.toString()){
            result = index;
        }
    });

    return result;
}

/**
 * Tạo đơn vị 
 * @data thông tin về đơn vị
 * @deanId id của trưởng đơn vị
 * @viceDeanId id phó đơn vị
 * @employeeId id nhân viên đơn vị
 * @companyID id công ty
 */
exports.createOrganizationalUnit = async(data,companyId, deanArr=[], viceDeanArr=[], employeeArr=[]) => {
    const check = await OrganizationalUnit.findOne({name: data.name, company: companyId});

    if (check) {
        throw['department_name_exist'];
    }

    const department = await OrganizationalUnit.create({
        name: data.name,
        description: data.description,
        company: companyId,
        deans: deanArr,
        viceDeans: viceDeanArr,
        employees: employeeArr,
        parent: ObjectId.isValid(data.parent) ? data.parent : null
    });

    return department;
}

/**
 * Chỉnh sửa thông tin đơn vị
 * @id id đơn vị
 * @data dữ liệu sửa
 */
exports.editOrganizationalUnit = async(id, data) => {
    const department = await OrganizationalUnit.findById(id).populate([
        { path: 'deans', model: Role },
        { path: 'viceDeans', model: Role },
        { path: 'employees', model: Role }
    ]);
    
    if(department === null) {
        throw['department_not_found'];
    }

    //Chỉnh sửa thông tin phòng ban
    department.name = data.name;
    department.description = data.description;
    department.parent = ObjectId.isValid(data.parent) ? data.parent : null;
    await department.save();

    return department;
}

/**
 * Chỉnh sửa các chức danh của đơn vị đơn vị
 * @id id của đơn vị
 * @data dữ liệu về thông tin các chức danh muốn cập nhật
 */
exports.editRolesInOrganizationalUnit = async(id, data) => {
    const roleChucDanh = await RoleType.findOne({ name: Terms.ROLE_TYPES.POSITION });
    const deanAb = await Role.findOne({ name: Terms.ROOT_ROLES.DEAN.name });
    const viceDeanAb = await Role.findOne({ name: Terms.ROOT_ROLES.VICE_DEAN.name });
    const employeeAb = await Role.findOne({ name: Terms.ROOT_ROLES.EMPLOYEE.name });
    const department = await OrganizationalUnit.findById(id).populate([
        { path: 'deans', model: Role },
        { path: 'viceDeans', model: Role },
        { path: 'employees', model: Role }
    ]);

    //1.Chỉnh sửa nhân viên đơn vị
    const employees = await this.getDiffRolesInOrganizationalUnit(department.employees, data.employees);
    console.log("EMPLOYEES CHECK:", employees);

    for (let i = 0; i < employees.editRoles.length; i++) {
        const updateRole = await Role.findById(employees.editRoles[i]._id);
        updateRole.name = employees.editRoles[i].name;
        await updateRole.save();
    }

    for (let j = 0; j < employees.deleteRoles.length; j++) {
        await RoleService.deleteRole(employees.deleteRoles[j]._id);
        await department.employees.splice(this.getIndex(employees.deleteRoles[j], department.employees), 1);
    }

    const newDataEmployees = employees.createRoles.map(role=>{
        return {
            name: role.name,
            type: roleChucDanh._id,
            parents: [employeeAb._id],
            company: department.company
        }
    });

    const newEmployees = await Role.insertMany(newDataEmployees);
    const employeeIdArr = [...newEmployees.map(em=>em._id), ...department.employees.map(em=>em._id)]; //id của tất cả các employee trong đơn vị dùng để kế thừa cho vicedean

    //2.Chỉnh sửa phó đơn vị
    const viceDeans = await this.getDiffRolesInOrganizationalUnit(department.viceDeans, data.viceDeans);
    console.log("VICEDEANS CHECK:", viceDeans);

    for (let i = 0; i < viceDeans.editRoles.length; i++) {
        await Role.updateOne({_id: viceDeans.editRoles[i]._id}, {
            name: viceDeans.editRoles[i].name,
            parents: [viceDeanAb._id, ...employeeIdArr]
        });
    }

    for (let j = 0; j < viceDeans.deleteRoles.length; j++) {
        await RoleService.deleteRole(viceDeans.deleteRoles[j]._id);
        await department.viceDeans.splice(this.getIndex(viceDeans.deleteRoles[j], department.viceDeans), 1);
    }

    const newDataViceDeans = viceDeans.createRoles.map(role=>{
        return {
            name: role.name,
            type: roleChucDanh._id,
            parents: [viceDeanAb._id, ...employeeIdArr],
            company: department.company
        }
    });

    const newViceDeans = await Role.insertMany(newDataViceDeans);
    const viceDeanIdArr = [...newViceDeans.map(vice=>vice._id), ...department.viceDeans.map(vice=>vice._id)]; //id của tất cả các viceDean trong đơn vị dùng để kế thừa cho dean

    //3.Chỉnh sửa trưởng đơn vị
    const deans = await this.getDiffRolesInOrganizationalUnit(department.deans, data.deans);
    console.log("DEANS CHECK:", deans);

    for (let i = 0; i < deans.editRoles.length; i++) {
        await Role.updateOne({_id: deans.editRoles[i]._id}, {
            name: deans.editRoles[i].name,
            parents: [deanAb._id, ...employeeIdArr, ...viceDeanIdArr]
        });
    }

    for (let j = 0; j < deans.deleteRoles.length; j++) {
        await RoleService.deleteRole(deans.deleteRoles[j]._id);
    }

    const newDataDeans = deans.createRoles.map(role=>{
        return {
            name: role.name,
            type: roleChucDanh._id,
            parents: [deanAb._id, ...employeeIdArr, ...viceDeanIdArr],
            company: department.company
        }
    });

    const newDeans = await Role.insertMany(newDataDeans);
    const deanIdArr = [...newDeans.map(dean=>dean._id), ...department.deans.map(dean=>dean._id)]; //id của tất cả các dean

    const departmentSave = await OrganizationalUnit.findById(id);
    departmentSave.deans = deanIdArr;
    departmentSave.viceDeans = viceDeanIdArr;
    departmentSave.employees = employeeIdArr;
    await departmentSave.save();

    return departmentSave;
}


/**
 * Xóa đơn vị
 * @departmentId id của đơn vị
 */
exports.deleteOrganizationalUnit = async (departmentId) => {
    const department = await OrganizationalUnit.findById(departmentId);

    const roles = await Role.find({
        _id: { $in: [...department.deans, ...department.viceDeans, ...department.employees]}
    });

    const userroles = await UserRole.find({
        roleId: { $in: roles.map(role=>role._id)}
    });
    
    if (userroles.length === 0) {
        await Role.deleteMany({
            _id: { $in: roles.map(role=>role._id)}
        });

        if (department.parent) {
            await OrganizationalUnit.updateMany({ 
                parent: department._id
            },{
                $set :{ parent: department.parent }
            }); 

            return await OrganizationalUnit.deleteOne({ _id: departmentId });
        }
    } else {
        throw ['department_has_user'];
    }
    console.log(departmentId);
}