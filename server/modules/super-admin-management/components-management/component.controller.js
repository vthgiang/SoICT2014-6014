const ComponentService = require('./component.service');
const LinkServices = require('../links-management/link.service');
const { LogInfo, LogError } = require('../../../logs');

exports.get = async (req, res) => {
    try {
        var components = await ComponentService.get(req.user.company._id);
        
        await LogInfo(req.user.email, 'GET_COMPONENTS', req.user.company);
        res.status(200).json({
            success: true,
            message: 'get_components_success',
            content: components
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_COMPONENTS', req.user.company);
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'get_components_faile'
        });
    }
};

exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var components = await ComponentService.getPaginate(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty
        
        await LogInfo(req.user.email, 'PAGINATE_COMPONENTS', req.user.company);
        res.status(200).json({
            success: true,
            message: 'paginate_components_success',
            content: components
        });
    } catch (error) {
        
        await LogError(req.user.email, 'PAGINATE_COMPONENTS', req.user.company);
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'paginate_components_faile'
        });
    }
};

exports.create = async (req, res) => {
    try {
        req.body.company = req.user.company._id;
        var createComponent = await ComponentService.create(req.body);
        await ComponentService.relationshipComponentRole(createComponent._id, req.body.roles);
        var component = await ComponentService.getById(createComponent._id);
        await LinkServices.addComponentOfLink(req.body.linkId, createComponent._id); //thêm component đó vào trang

        await LogInfo(req.user.email, 'CREATE_COMPONENT', req.user.company);
        res.status(200).json({
            success: true,
            message: 'create_component_success',
            content: component
        });
    } catch (error) {
        
        await LogError(req.user.email, 'CREATE_COMPONENT', req.user.company);
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'create_component_faile'
        });
    }
};

exports.show = async (req, res) => {
    try {
        var component = await ComponentService.getById(req.params.id);
        
        await LogInfo(req.user.email, 'SHOW_COMPONENT', req.user.company);
        res.status(200).json({
            success: true,
            message: 'show_component_success',
            content: component
        });
    } catch (error) {
        
        await LogError(req.user.email, 'SHOW_COMPONENT', req.user.company);
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'show_component_faile'
        });
    }
};

exports.edit = async (req, res) => {
    try {
        await ComponentService.relationshipComponentRole(req.params.id, req.body.roles);
        var component = await ComponentService.edit(req.params.id, req.body);
        
        await LogInfo(req.user.email, 'EDIT_COMPONENT', req.user.company);
        res.status(200).json({
            success: true,
            message: 'edit_component_success',
            content: component
        });
    } catch (error) {
        
        await LogError(req.user.email, 'EDIT_COMPONENT', req.user.company);
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'edit_component_faile'
        });
    }
};

exports.delete = async (req, res) => {
    try {
        var component = await ComponentService.delete(req.params.id );
        
        await LogInfo(req.user.email, 'DELETE_COMPONENT', req.user.company);
        res.status(200).json({
            success: true,
            message: 'delete_component_success',
            content: component
        });
    } catch (error) {
        
        await LogError(req.user.email, 'DELETE_COMPONENT', req.user.company);
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'delete_component_faile'
        });
    }
};

//Lấy tất cả các component của user với trang web hiện tại
exports.getComponentsOfUserInLink = async (req, res) => {
    try {
        var components  = await ComponentService.getComponentsOfUserInLink(req.params.roleId, req.params.linkId);
        
        await LogInfo(req.user.email, 'GET_COMPONENTS_OF_USER_IN_LINK', req.user.company);
        res.status(200).json({
            success: true,
            message: 'get_components_of_user_in_link_success',
            content: components
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_COMPONENTS_OF_USER_IN_LINK', req.user.company);
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'get_components_of_user_in_link_faile'
        });
    }
};

