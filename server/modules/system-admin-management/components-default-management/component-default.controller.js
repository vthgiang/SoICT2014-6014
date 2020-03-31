const ComponentDefaultServices = require('./component-default.service');
const {LogInfo, LogError} = require('../../../logs');
exports.get = async (req, res) => {
    try {
        var components = await ComponentDefaultServices.get();
        
        LogInfo(req.user.email, 'GET_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            message: 'get_components_default_success',
            content: components
        });
    } catch (error) {

        LogError(req.user.email, 'GET_COMPONENT_DEFAULT');
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'get_components_default_faile',
            content: error
        });
    }
};

exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var components = await ComponentDefaultServices.getPaginate(limit, page, req.body);
        
        LogInfo(req.user.email, 'PAGINATE_COMPONENTS_DEFAULT');
        res.status(200).json({
            success: true,
            message: 'paginate_components_default_success',
            content: components
        });
    } catch (error) {
        
        LogError(req.user.email, 'PAGINATE_COMPONENTS_DEFAULT');
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'paginate_components_default_faile',
            content: error
        });
    }
};

exports.create = async (req, res) => {
    try {
        var { name, description, link, roles } = req.body;
        var component = await ComponentDefaultServices.create(name, description, link, roles);
        await ComponentDefaultServices.addComponentsToLink(link, component._id);
        var data = await ComponentDefaultServices.show(component._id);

        LogInfo(req.user.email, 'CREATE_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            message: 'create_component_default_success',
            content: data
        });
    } catch (error) {

        LogError(req.user.email, 'CREATE_COMPONENT_DEFAULT');
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'create_component_default_faile',
            content: error
        });
    }
};

exports.show = async (req, res) => {
    try {
        var component = await ComponentDefaultServices.show(req.params.id);
        
        LogInfo(req.user.email, 'SHOW_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            message: 'show_component_default_success',
            content: component
        });
    } catch (error) {
        
        LogError(req.user.email, 'SHOW_COMPONENT_DEFAULT');
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'show_component_default_faile',
            content: error
        });
    }
};

exports.edit = async (req, res) => {
    try {
        var {name, description, link, roles} = req.body;
        var component = await ComponentDefaultServices.edit(req.params.id, name, description, link, roles);
        
        LogInfo(req.user.email, 'EDIT_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            message: 'edit_component_default_success',
            content: component
        });
    } catch (error) {
        
        LogError(req.user.email, 'EDIT_COMPONENT_DEFAULT');
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'edit_component_default_faile',
            content: error
        });
    }
};

exports.delete = async (req, res) => {
    try {
        var component = await ComponentDefaultServices.delete(req.params.id);
        await ComponentDefaultServices.deleteComponentInLink(component.link, component._id);
        
        LogInfo(req.user.email, 'DELETE_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            message: 'delete_component_default_success',
            content: component
        });
    } catch (error) {
        
        LogError(req.user.email, 'DELETE_COMPONENT_DEFAULT');
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'delete_component_default_faile',
            content: error
        });
    }
};

