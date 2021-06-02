const arrayToTree = require('array-to-tree');
const ObjectId = require('mongoose').Types.ObjectId;
const RoleService = require('../role/role.service');
const Terms = require('../../../helpers/config');
const { OrganizationalUnit, UserRole, Role, RoleType, User } = require('../../../models');
const { connect } = require('../../../helpers/dbHelper');

/**
 * Lấy danh sách các đơn vị trong công ty
 * @id id công ty
 */
exports.getOrganizationalUnits = async (portal, id) => {
    return await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .find() // { company: id }
        .populate([
            {
                path: 'managers',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId"
                    }]
                }]
            },
            {
                path: 'deputyManagers',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId"
                    }]
                }]
            },
            {
                path: 'employees',
                populate: [{
                    path: "users",
                    populate: [{
                        path: "userId"
                    }]
                }]
            }
        ]);
}

/**
 * Lấy thông tin đơn vị theo id
 * @id đơn vị
 */
exports.getOrganizationalUnit = async (portal, id) => {
    return await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'managers', populate: { path: 'users', populate: { path: 'userId' } } },
            { path: 'deputyManagers', populate: { path: 'users', populate: { path: 'userId' } } },
            { path: 'employees', populate: { path: 'users', populate: { path: 'userId' } } }
        ]);
}

/**
 * Lấy thông tin các đơn vị của công ty theo dạng CÂY 
 * @id id công ty
 */
exports.getOrganizationalUnitsAsTree = async (portal, id = undefined) => {
    const data = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .find() // { company: id }
        .populate([
            { path: 'managers' },
            { path: 'deputyManagers' },
            { path: 'employees' }
        ]);
    const newData = data.map(department => {
        return {
            id: department._id.toString(),
            name: department.name,
            managers: department.managers.map(manager => { return { _id: manager._id.toString(), name: manager.name } }),
            deputyManagers: department.deputyManagers.map(deputyManager => { return { _id: deputyManager._id.toString(), name: deputyManager.name } }),
            employees: department.employees.map(employee => { return { _id: employee._id.toString(), name: employee.name } }),
            description: department.description,
            parent_id: (department.parent !== null && department.parent !== undefined) ? department.parent.toString() : null
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
exports.getChildrenOfOrganizationalUnitsAsTree = async (portal, role, organizationalUnitId = undefined) => {
    let organizationalUnit;

    if (!organizationalUnitId) {
        organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findOne({
                $or: [
                    { 'managers': { $in: role } },
                    { 'deputyManagers': { $in: role } },
                    { 'employees': { $in: role } }
                ]
            });
    } else {
        organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findById(organizationalUnitId);
    }

    const data = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find(); //{ company: id }

    const newData = data.map(department => {
        return {
            id: department._id.toString(),
            name: department.name,
            description: department.description,
            managers: department.managers.map(item => item.toString()),
            deputyManagers: department.deputyManagers.map(item => item.toString()),
            employees: department.employees.map(item => item.toString()),
            parent_id: (department.parent !== null && department.parent !== undefined) ? department.parent.toString() : null
        }
    });

    const tree = await arrayToTree(newData);

    if (organizationalUnit) {
        for (let j = 0; j < tree.length; j++) {
            let queue = [];

            if (organizationalUnit.name === tree[j].name) {
                return tree[j];
            }

            queue.push(tree[j]);
            while (queue.length > 0) {
                v = queue.shift();
                if (v.children !== undefined) {
                    for (let i = 0; i < v.children.length; i++) {
                        let u = v.children[i];
                        if (organizationalUnit.name === u.name) {
                            return u;
                        }
                        else {
                            queue.push(u);
                        }
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
exports.getOrganizationalUnitByUserRole = async (portal, roleId) => {
    const department = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({
        $or: [
            { 'managers': roleId },
            { 'deputyManagers': roleId },
            { 'employees': roleId }
        ]
    }).populate([
        { path: 'managers', populate: { path: 'users' } },
        { path: 'deputyManagers', populate: { path: 'users' } },
        { path: 'employees', populate: { path: 'users' } }
    ]);

    return department;
}

/**
 * Lấy thông tin đơn vị của user
 * @userId id của user
 */
exports.getOrganizationalUnitsOfUser = async (portal, userId) => {
    const roles = await UserRole(connect(DB_CONNECTION, portal)).find({ userId });
    const newRoles = roles.map(role => role.roleId.toString());
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({
        $or: [
            { 'managers': { $in: newRoles } },
            { 'deputyManagers': { $in: newRoles } },
            { 'employees': { $in: newRoles } }
        ]
    });

    return departments;
}

/**
 * Lấy thông tin đơn vị của user theo email
 * @email email của user
 */
exports.getOrganizationalUnitsOfUserByEmail = async (portal, email) => {
    let userId = await User(connect(DB_CONNECTION, portal)).findOne({ email: email }, { _id: 1 });
    if (userId) {
        const roles = await UserRole(connect(DB_CONNECTION, portal)).find({ userId: userId._id });
        const newRoles = roles.map(role => role.roleId.toString());
        const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({
            $or: [
                { 'managers': { $in: newRoles } },
                { 'deputyManagers': { $in: newRoles } },
                { 'employees': { $in: newRoles } }
            ]
        });
        return { departmentsByEmail: departments };
    }
    return { departmentsByEmail: [] };
}

/**
 * Lấy thông tin đơn vị mà user làm trưởng
 * @userId id của user
 */
exports.getOrganizationalUnitsThatUserIsManager = async (portal, userId) => {
    const roles = await UserRole(connect(DB_CONNECTION, portal)).find({ 'userId': userId });
    const newRoles = roles.map(role => role.roleId);
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: newRoles } });
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

        if (index === -1) { // Không thấy role này trong mảng mới -> role xóa
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

exports.getIndex = async (node, array) => {
    var result = -1;

    array.forEach((value, index) => {
        if (node._id && value._id && value._id.toString() === node._id.toString()) {
            result = index;
        }
    });

    return result;
}

/**
 * Tạo đơn vị 
 * @data thông tin về đơn vị
 * @managerId id của trưởng đơn vị
 * @deputyManagerId id phó đơn vị
 * @employeeId id nhân viên đơn vị
 * @companyID id công ty
 */
exports.createOrganizationalUnit = async (portal, data, managerArr = [], deputyManagerArr = [], employeeArr = []) => {
    const check = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({ name: data.name });

    if (check) {
        throw ['department_name_exist'];
    }

    const department = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .create({
            name: data.name,
            description: data.description,
            managers: managerArr,
            deputyManagers: deputyManagerArr,
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
exports.editOrganizationalUnit = async (portal, id, data) => {
    const department = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'managers' },
            { path: 'deputyManagers' },
            { path: 'employees' }
        ]);

    if (department === null) {
        throw ['department_not_found'];
    }

    //Chỉnh sửa thông tin phòng ban
    department.name = data.name;
    department.description = data.description;

    // Kiểm tra phòng ban cha muốn sửa đổi
    if (ObjectId.isValid(data.parent)) {
        const upOrg = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findById(data.parent);
        if (upOrg.parent !== null && upOrg.parent.toString() === id.toString()) {
            var oldP = department.parent;
            upOrg.parent = oldP;
            await upOrg.save();
        }
        department.parent = data.parent;
    } else {
        department.parent = null;
    }
    await department.save();

    return department;
}

/**
 * Chỉnh sửa các chức danh của đơn vị đơn vị
 * @id id của đơn vị
 * @data dữ liệu về thông tin các chức danh muốn cập nhật
 */
exports.editRolesInOrganizationalUnit = async (portal, id, data) => {
    const roleChucDanh = await RoleType(connect(DB_CONNECTION, portal)).findOne({ name: Terms.ROLE_TYPES.POSITION });
    const managerAb = await Role(connect(DB_CONNECTION, portal)).findOne({ name: Terms.ROOT_ROLES.MANAGER.name });
    const deputyManagerAb = await Role(connect(DB_CONNECTION, portal)).findOne({ name: Terms.ROOT_ROLES.DEPUTY_MANAGER.name });
    const employeeAb = await Role(connect(DB_CONNECTION, portal)).findOne({ name: Terms.ROOT_ROLES.EMPLOYEE.name });
    const department = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'managers' },
            { path: 'deputyManagers' },
            { path: 'employees' }
        ]);

    //1.Chỉnh sửa nhân viên đơn vị
    const employees = await this.getDiffRolesInOrganizationalUnit(department.employees, data.employees);

    for (let i = 0; i < employees.editRoles.length; i++) {
        const updateRole = await Role(connect(DB_CONNECTION, portal)).findById(employees.editRoles[i]._id);
        updateRole.name = employees.editRoles[i].name;
        await updateRole.save();
    }

    for (let j = 0; j < employees.deleteRoles.length; j++) {
        await RoleService.deleteRole(portal, employees.deleteRoles[j]._id);
        await department.employees.splice(this.getIndex(employees.deleteRoles[j], department.employees), 1);
    }

    const newDataEmployees = employees.createRoles.map(role => {
        return {
            name: role.name,
            type: roleChucDanh._id,
            parents: [employeeAb._id]
        }
    });

    const newEmployees = await Role(connect(DB_CONNECTION, portal)).insertMany(newDataEmployees);
    const employeeIdArr = [...newEmployees.map(em => em._id), ...department.employees.map(em => em._id)]; //id của tất cả các employee trong đơn vị dùng để kế thừa cho vicemanager

    //2.Chỉnh sửa phó đơn vị
    const deputyManagers = await this.getDiffRolesInOrganizationalUnit(department.deputyManagers, data.deputyManagers);

    for (let i = 0; i < deputyManagers.editRoles.length; i++) {
        await Role(connect(DB_CONNECTION, portal)).updateOne({ _id: deputyManagers.editRoles[i]._id }, {
            name: deputyManagers.editRoles[i].name,
            parents: [deputyManagerAb._id, ...employeeIdArr]
        });
    }

    for (let j = 0; j < deputyManagers.deleteRoles.length; j++) {
        await RoleService.deleteRole(portal, deputyManagers.deleteRoles[j]._id);
        await department.deputyManagers.splice(this.getIndex(deputyManagers.deleteRoles[j], department.deputyManagers), 1);
    }

    const newDataDeputyManagers = deputyManagers.createRoles.map(role => {
        return {
            name: role.name,
            type: roleChucDanh._id,
            parents: [deputyManagerAb._id, ...employeeIdArr]
        }
    });

    const newDeputyManagers = await Role(connect(DB_CONNECTION, portal)).insertMany(newDataDeputyManagers);
    const deputyManagerIdArr = [...newDeputyManagers.map(vice => vice._id), ...department.deputyManagers.map(vice => vice._id)]; //id của tất cả các deputyManager trong đơn vị dùng để kế thừa cho manager

    //3.Chỉnh sửa trưởng đơn vị
    const managers = await this.getDiffRolesInOrganizationalUnit(department.managers, data.managers);

    for (let i = 0; i < managers.editRoles.length; i++) {
        await Role(connect(DB_CONNECTION, portal)).updateOne({ _id: managers.editRoles[i]._id }, {
            name: managers.editRoles[i].name,
            parents: [managerAb._id, ...employeeIdArr, ...deputyManagerIdArr]
        });
    }

    for (let j = 0; j < managers.deleteRoles.length; j++) {
        await RoleService.deleteRole(portal, managers.deleteRoles[j]._id);
    }

    const newDataManagers = managers.createRoles.map(role => {
        return {
            name: role.name,
            type: roleChucDanh._id,
            parents: [managerAb._id, ...employeeIdArr, ...deputyManagerIdArr]
        }
    });

    const newManagers = await Role(connect(DB_CONNECTION, portal)).insertMany(newDataManagers);
    const managerIdArr = [...newManagers.map(manager => manager._id), ...department.managers.map(manager => manager._id)]; //id của tất cả các manager

    const departmentSave = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findById(id);
    departmentSave.managers = managerIdArr;
    departmentSave.deputyManagers = deputyManagerIdArr;
    departmentSave.employees = employeeIdArr;
    await departmentSave.save();

    return departmentSave;
}


/**
 * Xóa đơn vị
 * @departmentId id của đơn vị
 */
exports.deleteOrganizationalUnit = async (portal, departmentId) => {
    const department = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findById(departmentId);

    const roles = await Role(connect(DB_CONNECTION, portal)).find({
        _id: { $in: [...department.managers, ...department.deputyManagers, ...department.employees] }
    });

    const userroles = await UserRole(connect(DB_CONNECTION, portal)).find({
        roleId: { $in: roles.map(role => role._id) }
    });

    if (userroles.length === 0) {
        await Role(connect(DB_CONNECTION, portal)).deleteMany({
            _id: { $in: roles.map(role => role._id) }
        });

        if (department.parent) {
            await OrganizationalUnit(connect(DB_CONNECTION, portal)).updateMany({
                parent: department._id
            }, {
                $set: { parent: department.parent }
            });
        }
        return await OrganizationalUnit(connect(DB_CONNECTION, portal)).deleteOne({ _id: departmentId });
    } else {
        throw ['department_has_user'];
    }
}

exports.importOrganizationalUnits = async (portal, data) => {
    let organizationalUnits = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].parent) {
            let parent = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({ name: data[i].parent });
            if (parent) {
                data[i].parent = parent._id
            }
        } else {
            data[i].parent = null;
        }
        let roles = await RoleService.createRolesForOrganizationalUnit(portal, data[i]);
        let organizationalUnit = await this.createOrganizationalUnit(
            portal,
            data[i],
            roles.managers.map(manager => manager._id),
            roles.deputyManagers.map(vice => vice._id),
            roles.employees.map(em => em._id)
        );
        organizationalUnits = [...organizationalUnits, organizationalUnit];
        await this.getOrganizationalUnitsAsTree(portal);
    }
    let tree = await this.getOrganizationalUnitsAsTree(portal);

    return { department: organizationalUnits, tree }
}