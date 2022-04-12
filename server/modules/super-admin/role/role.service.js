const Terms = require('../../../helpers/config');
const { OrganizationalUnit, Role, RoleType, UserRole, Privilege, Attribute } = require('../../../models');
const { connect } = require('../../../helpers/dbHelper');
const RoleService = require('./role.service');
const mongoose = require('mongoose');
/**
 * Lấy danh sách tất cả các role của 1 công ty
 * @portal portal của db
 */
exports.getRoles = async (portal, query) => {
    var page = query.page;
    var limit = query.limit;
    var roleId = query.roleId;
    var type = query.type;


    if (!page && !limit && !roleId) {
        return await Role(connect(DB_CONNECTION, portal))
            .find()
            .populate([
                { path: 'users', populate: { path: 'userId' } },
                { path: 'parents' },
                { path: 'type' }
            ]);
    } else if (page && limit && !roleId) {
        const option = (query.key !== undefined && query.value !== undefined)
            ? Object.assign({}, { [`${query.key}`]: new RegExp(query.value, "i") })
            : {};
        return await Role(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [
                    { path: 'users', populate: { path: 'userId' } },
                    { path: 'parents' },
                    { path: 'type' }
                ]
            });
    } else if (!page && !limit && roleId) {
        const roles = await OrganizationalUnit(connect(DB_CONNECTION, portal))
            .findOne({
                $or: [
                    { 'managers': roleId },
                    { 'deputyManagers': roleId },
                    { 'employees': roleId }
                ]
            }).populate([
                { path: 'managers' },
                { path: 'deputyManagers' },
                { path: 'employees' },
            ]);

        if (type === 'same') {
            let roleOrg = [...roles.managers, ...roles.deputyManagers, ...roles.employees]; //mảng các role cùng phòng bạn với role truyền vào

            let roleParents = await Role(connect(DB_CONNECTION, portal)).find({
                parents: roleId
            });

            let roleParentInOrg = [];
            for (let i = 0; i < roleOrg.length; i++) {
                for (let j = 0; j < roleParents.length; j++) {
                    if (roleOrg[i]._id.toString() === roleParents[j]._id.toString()) {
                        roleParentInOrg.push(roleOrg[i])
                    }
                }
            }

            return roleParentInOrg;
        }

        return roles;
    }
}


/**
 * Lấy thông tin của 1 role
 * @roleId id role
 */
exports.getRole = async (portal, roleId) => {
    return await Role(connect(DB_CONNECTION, portal))
        .findById(roleId)
        .populate([
            { path: 'users', populate: { path: 'userId' } },
            { path: 'parents' },
            { path: 'type' }
        ]);
}

/**
 * Tạo role do công ty tự định nghĩa
 * @data dữ liệu tạo
 * @companyId id công ty
 */
exports.createRole = async (portal, data) => {
    console.log("create-role")
    const checkRoleCreated = await Role(connect(DB_CONNECTION, portal)).findOne({ name: data.name }).collation({ "locale": "vi", strength: 2, alternate: "shifted", maxVariable: "space" })

    console.log("create-role", checkRoleCreated)
    if (checkRoleCreated) {
        throw ['role_name_exist'];
    }

    const filterValidAttributeArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            if ((new Set(array.map(attr => attr.attributeId.toLowerCase().replace(/ /g, "")))).size !== array.length) {
                throw ['attribute_selected_duplicate'];
            }

            for (let i = 0; i < array.length; i++) {
                // const attribute = await Attribute(connect(DB_CONNECTION, portal)).findOne({ _id: array[i].attributeId });
                if (array[i]) {
                    // array[i] = { ...array[i], name: attribute.attributeName};
                    resArray = [...resArray, array[i]];
                }
            }

            return resArray;
        } else {
            return [];
        }
    }

    const attrArray = await filterValidAttributeArray(data.attributes);
    const dataAttr = attrArray.map(attr => {
        return {
            attributeId: attr.attributeId,
            // name: attr.name.trim(),
            value: attr.value.trim(),
            description: attr.description.trim()
        }
    });

    const roleTuTao = await RoleType(connect(DB_CONNECTION, portal))
        .findOne({ name: Terms.ROLE_TYPES.COMPANY_DEFINED });
    const role = await Role(connect(DB_CONNECTION, portal)).create({
        name: data.name.trim(),
        parents: data.parents,
        attributes: dataAttr,
        type: roleTuTao._id
    });

    return role;
}

exports.createRoleAttribute = async (portal, data) => {
    console.log("create-role-attribute")

    // Lấy danh sách các attribute valid
    const filterValidAttributeArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            if ((new Set(array.map(attr => attr.attributeId.toLowerCase().replace(/ /g, "")))).size !== array.length) {
                throw ['attribute_selected_duplicate'];
            }

            for (let i = 0; i < array.length; i++) {
                // const attribute = await Attribute(connect(DB_CONNECTION, portal)).findOne({ _id: array[i].attributeId });
                if (array[i]) {
                    // array[i] = { ...array[i], name: attribute.attributeName };
                    resArray = [...resArray, array[i]];
                }
            }

            return resArray;
        } else {
            return [];
        }
    }

    const attrArray = await filterValidAttributeArray(data.attributes);
    const dataAttr = attrArray.map(attr => {
        return {
            attributeId: attr.attributeId,
            // name: attr.name.trim(),
            value: attr.value.trim(),
            description: attr.description.trim()
        }
    });

    // lấy ds các role cập nhật thuộc tính
    const roleAddAttribute = await Role(connect(DB_CONNECTION, portal)).find({
        _id: {
            $in: data.roleList.map(id => mongoose.Types.ObjectId(id))
        }
    }).populate([
        { path: 'users', populate: { path: 'userId' } },
        { path: 'parents' },
        { path: 'type' }
    ]);

    // Thêm - cập nhật thuộc tính
    roleAddAttribute.forEach(async (role) => {
        // Kiểm tra trùng thuộc tính thì không têm mới mà chỉ cập nhật value và description
        role.attributes.forEach((attr) => {
            dataAttr.forEach((inputAttr) => {
                if (attr.attributeId == inputAttr.attributeId) {
                    attr.value = inputAttr.value;
                    attr.description = inputAttr.description
                }
            })
        })
        // Thêm các thuộc tính chưa có
        if (role.attributes.length > 0) {
            const roleAttrId = role.attributes.map(attr => attr.attributeId);
            role.attributes = role.attributes.concat(dataAttr.filter(a => !roleAttrId.includes(a.attributeId)));
        }
        // Thêm mới nếu chưa có thuộc tính nào
        else {
            role.attributes = dataAttr

        }
        await role.save()

    })

    console.log("roleAddAttribute", roleAddAttribute)
    return roleAddAttribute;

}

/**
 * Tạo root role cho công ty
 * @data dữ liệu tạo
 * @companyID id công ty
 */
exports.createRootRole = async (portal, data) => {
    const rootRole = await RoleType(connect(DB_CONNECTION, portal))
        .findOne({ name: Terms.ROLE_TYPES.ROOT });
    const check = await Role(connect(DB_CONNECTION, portal))
        .findOne({ name: data.name });

    if (check !== null) throw ["role_name_exist"];

    const role = await Role(connect(DB_CONNECTION, portal))
        .create({
            name: data.name,
            type: rootRole._id,
            parents: data.parents
        });

    return role;
}

/**
 * Tạo các role chức danh của đơn vị
 * @companyID id công ty
 * @data dữ liệu tạo
 */
exports.createRolesForOrganizationalUnit = async (portal, data) => {
    const filterValidRoleArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {
            const checkRoleValid = await Role(connect(DB_CONNECTION, portal)).findOne({ name: { $in: array } }).collation({ "locale": "vi", strength: 2, alternate: "shifted", maxVariable: "space" });

            if (checkRoleValid) throw ['role_name_exist'];

            console.log(checkRoleValid)

            for (let i = 0; i < array.length; i++) {
                if (array[i]) resArray = [...resArray, array[i]];
            }

            return resArray;
        } else {
            return [];
        }
    }

    const roleChucDanh = await RoleType(connect(DB_CONNECTION, portal)).findOne({ name: Terms.ROLE_TYPES.POSITION });
    const managerAb = await Role(connect(DB_CONNECTION, portal)).findOne({ name: Terms.ROOT_ROLES.MANAGER.name });
    const deputyManagerAb = await Role(connect(DB_CONNECTION, portal)).findOne({ name: Terms.ROOT_ROLES.DEPUTY_MANAGER.name });
    const employeeAb = await Role(connect(DB_CONNECTION, portal)).findOne({ name: Terms.ROOT_ROLES.EMPLOYEE.name });

    const managerArr = await filterValidRoleArray(data.managers);
    const deputyManagerArr = await filterValidRoleArray(data.deputyManagers);
    const employeeArr = await filterValidRoleArray(data.employees);

    const allInputRole = managerArr.concat(deputyManagerArr, employeeArr)
    if ((new Set(allInputRole.map(role => role.toLowerCase().replace(/ /g, "")))).size !== allInputRole.length) {
        throw ['role_name_duplicate'];
    }

    const dataEmployee = employeeArr.map(em => {
        return {
            name: em.trim(),
            type: roleChucDanh._id,
            parents: [employeeAb._id]
        }
    });
    const employees = dataEmployee.length > 0 ?
        await Role(connect(DB_CONNECTION, portal)).insertMany(dataEmployee) : [];


    const dataDeputyManager = deputyManagerArr.map(vice => {
        return {
            name: vice.trim(),
            type: roleChucDanh._id,
            parents: [...employees.map(em => em._id), deputyManagerAb._id]
        }
    });
    const deputyManagers = dataDeputyManager.length > 0 ?
        await Role(connect(DB_CONNECTION, portal)).insertMany(dataDeputyManager) : [];


    const dataManager = managerArr.map(manager => {
        return {
            name: manager.trim(),
            type: roleChucDanh._id,
            parents: [...employees.map(em => em._id), ...deputyManagers.map(vice => vice._id), managerAb._id]
        }
    });
    const managers = dataManager.length > 0 ?
        await Role(connect(DB_CONNECTION, portal)).insertMany(dataManager) : [];

    return {
        managers, deputyManagers, employees // danh sách các mảng các chức danh đã tạo
    }
}

/**
 * Tạo mối quan hệ cho user và role
 * @userId id user
 * @roleId id role
 */
exports.createRelationshipUserRole = async (portal, userId, roleId) => {
    const relationship = await UserRole(connect(DB_CONNECTION, portal))
        .create({
            userId,
            roleId
        });

    return relationship;
}

/**
 * Chỉnh sửa thông tin role
 * @id id role
 * @data dữ liệu chỉnh sửa, mặc định không truyền vào thì là {}
 */
exports.editRole = async (portal, id, data = {}) => {
    const role = await Role(connect(DB_CONNECTION, portal)).findById(id);
    const check = await Role(connect(DB_CONNECTION, portal)).findOne({ name: data.name }).collation({ "locale": "vi", strength: 2, alternate: "shifted", maxVariable: "space" })

    const filterValidAttributeArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            if ((new Set(array.map(attr => attr.attributeId.toLowerCase().replace(/ /g, "")))).size !== array.length) {
                throw ['attribute_selected_duplicate'];
            }

            for (let i = 0; i < array.length; i++) {
                // const attribute = await Attribute(connect(DB_CONNECTION, portal)).findOne({ _id: array[i].attributeId });
                if (array[i]) {
                    // array[i] = { ...array[i], name: attribute.attributeName };
                    resArray = [...resArray, array[i]];
                }
            }

            return resArray;
        } else {
            return [];
        }
    }

    if (role.name.trim().toLowerCase().replace(/ /g, "") !== data.name.trim().toLowerCase().replace(/ /g, "")) {
        if (check) throw ['role_name_exist'];
    }
    if (data.name) {
        role.name = data.name.trim();
    }

    if (data.parents) {
        role.parents = data.parents;
    }


    const attrArray = await filterValidAttributeArray(data.attributes);
    const dataAttr = attrArray.map(attr => {
        return {
            attributeId: attr.attributeId,
            // name: attr.name.trim(),
            value: attr.value.trim(),
            description: attr.description?.trim(),
        }
    });
    if (data.attributes) {
        role.attributes = dataAttr;
    }

    await role.save();

    return role;
}

/**
 * Chỉnh sửa mối quan hệ giữa user và role
 * @roleId id role
 * @userArr mảng id các user
 */
exports.editRelationshipUserRole = async (portal, roleId, userArr = []) => {
    const check = await Role(connect(DB_CONNECTION, portal)).findById(roleId);
    if (!check) throw ['role_not_found'];

    await UserRole(connect(DB_CONNECTION, portal)).deleteMany({
        roleId: roleId
    });
    if (userArr.length > 0) {
        const user_role = userArr.map(user => {
            return {
                roleId: roleId,
                userId: user
            };
        })
        return await UserRole(connect(DB_CONNECTION, portal)).insertMany(user_role);
    }
}


/**
 * Xóa role theo id
 * @id id role
 * 1. Xóa role
 * 2. Xóa thông tin liên quan của các role kế thừa role hiện tại
 * 3. Xóa thông tin trong UserRole
 * 4. Xóa thông tin trong Privilege
 * 5. Xóa thông tin trong OrganizationalUnit (nếu có)
 */
exports.deleteRole = async (portal, id) => {
    await Role(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
    const roles = await Role(connect(DB_CONNECTION, portal)).find({ parents: id });

    for (let i = 0; i < roles.length; i++) {
        const role = await Role(connect(DB_CONNECTION, portal)).findById(roles[i]._id);
        role.parents.splice(role.parents.indexOf(roles[i]._id), 1);
        await role.save();
    }
    await UserRole(connect(DB_CONNECTION, portal)).deleteMany({ roleId: id });
    await Privilege(connect(DB_CONNECTION, portal)).deleteMany({ roleId: id });
    const organD = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({ managers: id });
    if (organD) {
        organD.managers.splice(organD.managers.indexOf(id));
        await organD.save();
    }

    const organV = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({ deputyManagers: id });
    if (organV) {
        organV.deputyManagers.splice(organV.deputyManagers.indexOf(id));
        await organV.save();
    }

    const organE = await OrganizationalUnit(connect(DB_CONNECTION, portal)).findOne({ employees: id });
    if (organE) {
        organE.employees.splice(organE.employees.indexOf(id));
        await organE.save();
    }

    return id; // trả về id của role vừa xóa

}

exports.importRoles = async (portal, data) => {
    let rowError = [], roleTuTao;
    let dataConvert = [];

    if (data?.length) {
        roleTuTao = await RoleType(connect(DB_CONNECTION, portal))
            .findOne({ name: Terms.ROLE_TYPES.COMPANY_DEFINED });

        const roles = await Role(connect(DB_CONNECTION, portal))
            .find({});


        data.forEach((x, index) => {
            let item = x;
            if (roles?.length) {
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name.trim().toLowerCase().replace(/ /g, "") === x.name.trim().toLowerCase().replace(/ /g, "")) {
                        item = {
                            ...item,
                            errorAlert: ["role_name_exist"],
                            error: true
                        }
                        rowError = [...rowError, index + 1];
                        break;
                    }
                }
            }
            item = {
                ...item,
                type: roleTuTao?._id
            }
            dataConvert = [...dataConvert, item];
        })
    }

    if (rowError.length !== 0) {
        return {
            data: dataConvert,
            rowError
        }
    } else {
        const role = await Role(connect(DB_CONNECTION, portal)).insertMany(dataConvert)
        let roleNames = [];
        if (role?.length) {
            for (let k = 0; k < role.length; k++) {
                roleNames = [...roleNames, role[k].name];
                await RoleService.editRelationshipUserRole(portal, role[k]._id, dataConvert[k].users);
            }
        }


        const roleImports = await Role(connect(DB_CONNECTION, portal)).find({
            name: {
                $in: roleNames
            }
        }).populate([
            { path: 'users', populate: { path: 'userId' } },
            { path: 'parents' },
            { path: 'type' }
        ]);

        return roleImports;
    }
}