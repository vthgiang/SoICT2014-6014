const SystemComponentServices = require('./systemComponent.service');
const {LogInfo, LogError} = require('../../../logs');

exports.getAllSystemComponents = async (req, res) => {
    try {
        const components = await SystemComponentServices.getAllSystemComponents(req.query);
        
        LogInfo(req.user.email, 'GET_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            messages: ['get_components_default_success'],
            content: components
        });
    } catch (error) {
        LogError(req.user.email, 'GET_COMPONENT_DEFAULT');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_components_default_faile'],
            content: error
        });
    }
};

exports.createSystemComponent = async (req, res) => {
    try {
        
        const { name, description, link, roles } = req.body;
        const component = await SystemComponentServices.createSystemComponent(name, description, link, roles);
        
        await SystemComponentServices.addSystemComponentsToSystemLink(link, component._id);
       
        const data = await SystemComponentServices.getSystemComponent(component._id);

        LogInfo(req.user.email, 'CREATE_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            messages: ['create_system_component_success'],
            content: data
        });
    } catch (error) {
        LogError(req.user.email, 'CREATE_COMPONENT_DEFAULT');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_system_component_faile'],
            content: error
        });
    }
};

exports.getSystemComponent = async (req, res) => {
    try {
        const component = await SystemComponentServices.getSystemComponent(req.params.id);
        
        LogInfo(req.user.email, 'SHOW_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            messages: ['show_system_component_success'],
            content: component
        });
    } catch (error) {
        LogError(req.user.email, 'SHOW_COMPONENT_DEFAULT');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_system_component_faile'],
            content: error
        });
    }
};

exports.editSystemComponent = async (req, res) => {
    try {
        const { name, description, link, roles } = req.body;
        const component = await SystemComponentServices.editSystemComponent(req.params.id, name, description, link, roles);
        const resComponent = await SystemComponentServices.getSystemComponent(component._id);
        
        LogInfo(req.user.email, 'EDIT_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            messages: ['edit_system_component_success'],
            content: resComponent
        });
    } catch (error) {
        LogError(req.user.email, 'EDIT_COMPONENT_DEFAULT');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_system_component_faile'],
            content: error
        });
    }
};

exports.deleteSystemComponent = async (req, res) => {
    try {
        const component = await SystemComponentServices.deleteSystemComponent(req.params.id);
        await SystemComponentServices.removeSystemComponentFromSystemLink(component.link, component._id);
        
        LogInfo(req.user.email, 'DELETE_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            messages: ['delete_system_component_success'],
            content: component
        });
    } catch (error) {
        LogError(req.user.email, 'DELETE_COMPONENT_DEFAULT');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_system_component_faile'],
            content: error
        });
    }
};

