const OrganizationalUnitService = require('./organizationalUnit.service');
const RoleService = require(`../../super-admin/role/role.service`);
const Logger = require(`../../../logs`);

/**
 * Chú ý: tất cả các phương thức đều xét trong ngữ cảnh một công ty
 */

exports.getOrganizationalUnits = async (req, res) => {
    if (req.query.managerOfOrganizationalUnit) {
        getOrganizationalUnitsThatUserIsManager(req, res);
    } else if (req.query.userId || req.query.email) {
        getOrganizationalUnitsOfUser(req, res);
    } else if (req.query.getAsTree && roleId) {
        getChildrenOfOrganizationalUnitsAsTree(req, res);
    } else {
        try {
            var list = await OrganizationalUnitService.getOrganizationalUnits(req.portal, req.user.company._id);
            var tree = await OrganizationalUnitService.getOrganizationalUnitsAsTree(req.portal, req.user.company._id);

            await Logger.info(req.user.email, 'get_departments_success', req.portal);
            res.status(200).json({
                success: true,
                messages: ['get_departments_success'],
                content: { list, tree }
            });
        } catch (error) {

            await Logger.error(req.user.email, 'get_departments_faile', req.portal);
            res.status(400).json({
                success: false,
                messages: Array.isArray(error) ? error : ['get_departments_faile'],
                content: error
            });
        }
    }
};

getOrganizationalUnitsOfUser = async (req, res) => {
    try {
        let department = [];
        if (req.query.email) {
            department = await OrganizationalUnitService.getOrganizationalUnitsOfUserByEmail(req.portal, req.query.email);
        } else {
            department = await OrganizationalUnitService.getOrganizationalUnitsOfUser(req.portal, req.query.userId);
        }

        await Logger.info(req.user.email, 'get_departments_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_departments_success'],
            content: department
        });
    }
    catch (error) {
        await Logger.error(req.user.email, 'get_departments_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_departments_faile'],
            content: error
        });
    }
}

getOrganizationalUnitsThatUserIsManager = async (req, res) => {
    try {
        const department = await OrganizationalUnitService.getOrganizationalUnitsThatUserIsManager(req.portal, req.query.managerOfOrganizationalUnit);

        await Logger.info(req.user.email, 'get_department_that_user_is_manager_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_department_that_user_is_manager_success'],
            content: department
        });
    }
    catch (error) {

        await Logger.error(req.user.email, 'get_department_that_user_is_manager_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_department_that_user_is_manager_faile'],
            content: error
        });
    }
}

/**
 *  Lấy các đơn vị con của một đơn vị và đơn vị đó
 * @param {*} req 
 * @param {*} res 
 */
getChildrenOfOrganizationalUnitsAsTree = async (req, res) => {
    try {
        var tree = await OrganizationalUnitService.getChildrenOfOrganizationalUnitsAsTree(req.portal, req.query.roleId, req.query.organizationalUnitId);

        await Logger.info(req.user.email, 'get_children_departments_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_children_departments_success'],
            content: tree
        });
    } catch (error) {
        await Logger.error(req.user.email, 'get_children_departments_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_children_departments_faile'],
            content: error
        });
    }
};

exports.getOrganizationalUnit = async (req, res) => {
    try {
        var department = await OrganizationalUnitService.getOrganizationalUnit(req.portal, req.params.id);

        await Logger.info(req.user.email, 'show_department_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['show_department_success'],
            content: department
        });
    } catch (error) {

        await Logger.error(req.user.email, 'show_department_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_department_faile'],
            content: error
        });
    }
};

exports.createOrganizationalUnit = async (req, res) => {
    try {
        let { name, description, managers, deputyManagers, employees, parent} = req.body;
        const data = {
            name: name ? name.trim() : '',
            description: description ? description.trim() : '',
            managers: managers?.length > 0 ? managers.map(o => o.trim()) : [],
            deputyManagers: deputyManagers?.length > 0 ? deputyManagers.map(o => o.trim()) : [],
            employees: employees?.length > 0 ? employees.map(o => o.trim()) : [],
            parent: parent
        }

        let roles = await RoleService.createRolesForOrganizationalUnit(req.portal, data);
        let organizationalUnit = await OrganizationalUnitService.createOrganizationalUnit(
            req.portal,
            data,
            roles.managers.map(manager => manager._id),
            roles.deputyManagers.map(vice => vice._id),
            roles.employees.map(em => em._id)
        );

        let tree = await OrganizationalUnitService.getOrganizationalUnitsAsTree(req.portal, req.user.company._id);

        await Logger.info(req.user.email, 'create_department_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_department_success'],
            content: { department: organizationalUnit, tree }
        });
    } catch (error) {

        await Logger.error(req.user.email, 'create_department_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_department_faile'],
            content: error
        });
    }
};

exports.editOrganizationalUnit = async (req, res) => {
    try {
        let { name, description, managers, deputyManagers, employees, parent} = req.body;
        const data = {
            name: name ? name.trim() : '',
            description: description ? description.trim() : '',
            managers: managers?.length > 0 ? managers.map(o=> o._id ? ({name: o?.name.trim(), _id: o._id}) : ({name: o?.name.trim()})) : [],
            deputyManagers: deputyManagers?.length > 0 ? deputyManagers.map(o=> o._id ? ({name: o?.name.trim(), _id: o._id}) : ({name: o?.name.trim()})) : [],
            employees: employees?.length > 0 ? employees.map(o=> o._id ? ({name: o?.name.trim(), _id: o._id}) : ({name: o?.name.trim()})) : [],
            parent: parent
        }
      
        var department = await OrganizationalUnitService.editOrganizationalUnit(req.portal, req.params.id, data);
        await OrganizationalUnitService.editRolesInOrganizationalUnit(req.portal, department._id, data);
        var tree = await OrganizationalUnitService.getOrganizationalUnitsAsTree(req.portal, req.user.company._id);

        await Logger.info(req.user.email, 'edit_department_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_department_success'],
            content: { department, tree }
        });
    } catch (error) {
        console.log(error);
        await Logger.error(req.user.email, 'edit_department_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_department_faile'],
            content: error
        });
    }
};

exports.deleteOrganizationalUnit = async (req, res) => {
    try {
        var org = await OrganizationalUnitService.deleteOrganizationalUnit(req.portal, req.params.id);
        var tree = await OrganizationalUnitService.getOrganizationalUnitsAsTree(req.portal, req.user.company._id);

        await Logger.info(req.user.email, 'delete_department_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_department_success'],
            content: { org, tree }
        });
    } catch (error) {

        await Logger.error(req.user.email, 'delete_department_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_department_faile'],
            content: error
        });
    }
};

exports.importOrganizationalUnits = async (req, res) => {
    try {
        var data = await OrganizationalUnitService.importOrganizationalUnits(req.portal, req.body);

        await Logger.info(req.user.email, 'import_department_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ["import_department_success"],
            content: data
        });
    } catch (error) {

        await Logger.error(req.user.email, 'import_department_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: ["import_department_faile"],
            content: {
                error: error
            }
        });
    }
}