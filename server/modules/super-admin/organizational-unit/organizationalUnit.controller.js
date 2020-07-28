const OrganizationalUnitService = require('./organizationalUnit.service');
const RoleService = require('../role/role.service');
const { LogInfo, LogError } = require('../../../logs');

/**
 * Chú ý: tất cả các phương thức đều xét trong ngữ cảnh một công ty
 */

exports.getOrganizationalUnits = async (req, res) => {
    if (req.query.deanOfOrganizationalUnit !== undefined){
        getOrganizationalUnitsThatUserIsDean(req, res);
    } else {
        try {
            var list = await OrganizationalUnitService.getOrganizationalUnits(req.user.company._id); 
            var tree = await OrganizationalUnitService.getOrganizationalUnitsAsTree(req.user.company._id);
            
            await LogInfo(req.user.email, 'GET_DEPARTMENTS', req.user.company);
            res.status(200).json({
                success: true,
                messages: ['get_departments_success'],
                content: { list, tree }
            });
        } catch (error) {
            
            await LogError(req.user.email, 'GET_DEPARTMENTS', req.user.company);
            res.status(400).json({
                success: false,
                messages: Array.isArray(error) ? error : ['get_departments_faile'],
                content: error
            });
        }
    }
};

getOrganizationalUnitsThatUserIsDean = async (req, res) =>{
    try {
        const department = await OrganizationalUnitService.getOrganizationalUnitsThatUserIsDean(req.query.deanOfOrganizationalUnit);
        
        await LogInfo(req.user.email, 'GET_DEPARTMENT_THAT_USER_IS_DEAN', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_department_that_user_is_dean_success'],
            content: department
        });
    }
    catch (error) {
        await LogError(req.user.email, 'GET_DEPARTMENT_THAT_USER_IS_DEAN', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_department_that_user_is_dean_faile'],
            content: error
        });
    }
}

exports.getOrganizationalUnit = async (req, res) => {
    try {
        var department = await OrganizationalUnitService.getOrganizationalUnit(req.params.id);
        
        await LogInfo(req.user.email, 'SHOW_DEPARTMENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['show_department_success'],
            content: department
        });
    } catch (error) {
        
        await LogError(req.user.email, 'SHOW_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_department_faile'],
            content: error
        });
    }
};

/**
 *  Lấy các đơn vị con của một đơn vị và đơn vị đó
 * @param {*} req 
 * @param {*} res 
 */
exports.getChildrenOfOrganizationalUnitsAsTree = async (req, res) => {
    try {
        var tree = await OrganizationalUnitService.getChildrenOfOrganizationalUnitsAsTree(req.user.company._id, req.params.role);
        
        await LogInfo(req.user.email, 'GET_CHILDREN_DEPARTMENTS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_children_departments_success'],
            content: tree
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_CHILDREN_DEPARTMENTS', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_children_departments_faile'],
            content: error
        });
    }  
};

exports.createOrganizationalUnit = async (req, res) => {
    try {
        let roles = await RoleService
            .createRolesForOrganizationalUnit(
                req.body, 
                req.user.company._id
            );
        let organizationalUnit = await OrganizationalUnitService
            .createOrganizationalUnit( 
                req.body, req.user.company._id,
                roles.deans.map(dean=>dean._id), 
                roles.viceDeans.map(vice=>vice._id), 
                roles.employees.map(em=>em._id)
            );
        
        let tree = await OrganizationalUnitService
            .getOrganizationalUnitsAsTree(req.user.company._id);

        await LogInfo(req.user.email, 'CREATE_DEPARTMENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_department_success'],
            content: { department: organizationalUnit, tree }
        });
    } catch (error) {
        console.log('eerrror:', error)
        await LogError(req.user.email, 'CREATE_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_department_faile'],
            content: error
        });
    }
};

exports.editOrganizationalUnit = async (req, res) => {
    try {
        var department = await OrganizationalUnitService.editOrganizationalUnit(req.params.id, req.body);
        await OrganizationalUnitService.editRolesInOrganizationalUnit(department._id, req.body);
        
        var tree = await OrganizationalUnitService.getOrganizationalUnitsAsTree(req.user.company._id);

        await LogInfo(req.user.email, 'EDIT_DEPARTMENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_department_success'],
            content: { department, tree }
        });
    } catch (error) {
        
        console.log('eerrror:', error)
        await LogError(req.user.email, 'EDIT_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_department_faile'],
            content: error
        });
    }
};

exports.deleteOrganizationalUnit = async (req, res) => {
    try {
        var role = await OrganizationalUnitService.deleteOrganizationalUnit(req.params.id);
        var tree = await OrganizationalUnitService.getOrganizationalUnitsAsTree(req.user.company._id);

        await LogInfo(req.user.email, 'DELETE_DEPARTMENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_department_success'],
            content: { role, tree }
        });
    } catch (error) {
        
        await LogError(req.user.email, 'DELETE_DEPARTMENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_department_faile'],
            content: error
        });
    }
};