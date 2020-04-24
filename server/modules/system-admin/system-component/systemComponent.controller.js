const ComponentDefaultServices = require('./systemComponent.service');
const {LogInfo, LogError} = require('../../../logs');

exports.getAllSystemComponents = async (req, res) => {
    try {
        const components = await ComponentDefaultServices.getAllSystemComponents();
        
        LogInfo(req.user.email, 'GET_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            message: ['get_components_default_success'],
            content: components
        });
    } catch (error) {

        LogError(req.user.email, 'GET_COMPONENT_DEFAULT');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getPaginatedSystemComponents = async (req, res) => {
    try {
        const { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        const components = await ComponentDefaultServices.getPaginatedSystemComponents(limit, page, req.body);
        
        LogInfo(req.user.email, 'PAGINATE_COMPONENTS_DEFAULT');
        res.status(200).json({
            success: true,
            message: ['paginate_components_default_success'],
            content: components
        });
    } catch (error) {
        
        LogError(req.user.email, 'PAGINATE_COMPONENTS_DEFAULT');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.createSystemComponent = async (req, res) => {
    try {
        const { name, description, link, roles } = req.body;
        const component = await ComponentDefaultServices.createSystemComponent(name, description, link, roles);
        await ComponentDefaultServices.addSystemComponentsToSystemLink(link, component._id);
        const data = await ComponentDefaultServices.getSystemComponent(component._id);

        LogInfo(req.user.email, 'CREATE_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            message: ['create_system_component_success'],
            content: data
        });
    } catch (error) {

        LogError(req.user.email, 'CREATE_COMPONENT_DEFAULT');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getSystemComponent = async (req, res) => {
    try {
        const component = await ComponentDefaultServices.getSystemComponent(req.params.id);
        
        LogInfo(req.user.email, 'SHOW_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            message: ['show_system_component_success'],
            content: component
        });
    } catch (error) {
        
        LogError(req.user.email, 'SHOW_COMPONENT_DEFAULT');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.editSystemComponent = async (req, res) => {
    try {
        const {name, description, link, roles} = req.body;
        const component = await ComponentDefaultServices.editSystemComponent(req.params.id, name, description, link, roles);
        const resComponent = await ComponentDefaultServices.getSystemComponent(component._id);
        
        LogInfo(req.user.email, 'EDIT_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            message: ['edit_system_component_success'],
            content: resComponent
        });
    } catch (error) {
        
        LogError(req.user.email, 'EDIT_COMPONENT_DEFAULT');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.deleteSystemComponent = async (req, res) => {
    try {
        const component = await ComponentDefaultServices.deleteSystemComponent(req.params.id);
        await ComponentDefaultServices.removeSystemComponentFromSystemLink(component.link, component._id);
        
        LogInfo(req.user.email, 'DELETE_COMPONENT_DEFAULT');
        res.status(200).json({
            success: true,
            message: ['delete_system_component_success'],
            content: component
        });
    } catch (error) {
        
        LogError(req.user.email, 'DELETE_COMPONENT_DEFAULT');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

