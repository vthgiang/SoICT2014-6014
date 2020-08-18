const ComponentService = require('./component.service');
const LinkServices = require('../link/link.service');
const { LogInfo, LogError } = require('../../../logs');

/**
 * Chú ý: tất cả các phương thức đều xét trong ngữ cảnh một công ty
 */

exports.getComponents = async (req, res) => {
    try {
        let {company} = req.query;
        let components = await ComponentService.getComponents(company, req.query);
        console.log("components",components)
        await LogInfo(req.user.email, 'GET_ALL_COMPONENTS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_components_success'],
            content: components
        });
    } catch (error) {
        console.log("error: ", error)
        await LogError(req.user.email, 'GET_ALL_COMPONENTS', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)? error: ['get_components_faile'],
            content: error
        });
    }
};

exports.getComponent = async (req, res) => {
    try {
        let {id} = req.params;
        let component = await ComponentService.getComponent(id);
        
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
            messages: Array.isArray(error)? error: ['show_component_faile'],
            content: error
        });
    }
};

exports.createComponent = async (req, res) => {
    try {
        let {company} = req.query;
        req.body.company = company;
        let createComponent = await ComponentService.createComponent(req.body);
        await ComponentService.relationshipComponentRole(createComponent._id, req.body.roles);
        let component = await ComponentService.getComponent(createComponent._id);
        await LinkServices.addComponentOfLink(req.body.linkId, createComponent._id); // Thêm component đó vào trang

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
            messages: Array.isArray(error)? error: ['create_component_faile'],
            content: error
        });
    }
};

exports.editComponent = async (req, res) => {
    try {
        await ComponentService.relationshipComponentRole(req.params.id, req.body.roles);
        let component = await ComponentService.editComponent(req.params.id, req.body);
        let resComponent = await ComponentService.getComponent(component._id);

        await LogInfo(req.user.email, 'EDIT_COMPONENT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_component_success'],
            content: resComponent
        });
    } catch (error) {
        
        await LogError(req.user.email, 'EDIT_COMPONENT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)? error: ['edit_component_faile'],
            content: error
        });
    }
};

exports.deleteComponent = async (req, res) => {
    try {
        let {id} = req.params;
        let {type} = req.query;
        let component = await ComponentService.deleteComponent(id, type);
        
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
            messages: Array.isArray(error)? error: ['delete_component_faile'],
            content: error
        });
    }
};
