const ComponentService = require('./component.service');
const LinkServices = require('../link/link.service');
const { LogInfo, LogError } = require('../../../logs');

/**
 * Chú ý: tất cả các phương thức đều xét trong ngữ cảnh một công ty
 */

exports.getAllComponents = async (req, res) => {
    try {
        const components = await ComponentService.getAllComponents(req.user.company._id);
        
        await LogInfo(req.user.email, 'GET_ALL_COMPONENTS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_components_success'],
            content: components
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_ALL_COMPONENTS', req.user.company);
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.getPaginatedComponents = async (req, res) => {
    try {
        const { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        const components = await ComponentService.getPaginatedComponents(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty
        
        await LogInfo(req.user.email, 'PAGINATE_COMPONENTS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['paginate_components_success'],
            content: components
        });
    } catch (error) {
        
        await LogError(req.user.email, 'PAGINATE_COMPONENTS', req.user.company);
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.createComponent = async (req, res) => {
    try {
        req.body.company = req.user.company._id;
        const createComponent = await ComponentService.createComponent(req.body);
        await ComponentService.relationshipComponentRole(createComponent._id, req.body.roles);
        const component = await ComponentService.getComponentById(createComponent._id);
        await LinkServices.addComponentOfLink(req.body.linkId, createComponent._id); //thêm component đó vào trang

        await LogInfo(req.user.email, 'CREATE_COMPONENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_component_success'],
            content: component
        });
    } catch (error) {
        
        await LogError(req.user.email, 'CREATE_COMPONENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.getComponentById = async (req, res) => {
    try {
        const component = await ComponentService.getComponentById(req.params.id);
        
        await LogInfo(req.user.email, 'GET_COMPONENT_BY_ID', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['show_component_success'],
            content: component
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_COMPONENT_BY_ID', req.user.company);
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.editComponent = async (req, res) => {
    try {
        await ComponentService.relationshipComponentRole(req.params.id, req.body.roles);
        const component = await ComponentService.editComponent(req.params.id, req.body);
        
        await LogInfo(req.user.email, 'EDIT_COMPONENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_component_success'],
            content: component
        });
    } catch (error) {
        
        await LogError(req.user.email, 'EDIT_COMPONENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

exports.deleteComponent = async (req, res) => {
    try {
        const component = await ComponentService.deleteComponent(req.params.id );
        
        await LogInfo(req.user.email, 'DELETE_COMPONENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_component_success'],
            content: component
        });
    } catch (error) {
        
        await LogError(req.user.email, 'DELETE_COMPONENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};

//Lấy tất cả các component của user với trang web hiện tại
exports.getComponentsOfUserInLink = async (req, res) => {
    try {
        const components  = await ComponentService.getComponentsOfUserInLink(req.params.roleId, req.params.linkId);
        
        await LogInfo(req.user.email, 'GET_COMPONENTS_OF_USER_IN_LINK', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_components_of_user_in_link_success'],
            content: components
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_COMPONENTS_OF_USER_IN_LINK', req.user.company);
        res.status(400).json({
            success: false,
            messages: error
        });
    }
};
