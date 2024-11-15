const ComponentService = require('./component.service');
const PolicyService = require(`../../super-admin/policy/policy.service`);
const { differenceAttributes } = require('../../../helpers/functionHelper');
const Logger = require(`../../../logs`);

/**
 * Chú ý: tất cả các phương thức đều xét trong ngữ cảnh một công ty
 */

exports.getComponents = async (req, res) => {
    try {
        let portal = !req.query.portal ? req.portal : req.query.portal;
        let components = await ComponentService.getComponents(portal, req.query);

        await Logger.info(req.user.email, 'get_components_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_components_success'],
            content: components
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.user.email, 'get_components_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_components_faile'],
            content: error
        });
    }
};

exports.getComponent = async (req, res) => {
    try {
        let portal = !req.query.portal ? req.portal : req.query.portal;
        let component = await ComponentService.getComponent(portal, req.params.id);

        await Logger.info(req.user.email, 'show_component_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['show_component_success'],
            content: component
        });
    } catch (error) {

        await Logger.error(req.user.email, 'show_component_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_component_faile'],
            content: error
        });
    }
};

exports.createComponent = async (req, res) => {
    try {
        let portal = !req.query.portal ? req.portal : req.query.portal;
        let createComponent = await ComponentService.createComponent(portal, req.body);
        await ComponentService.relationshipComponentRole(portal, createComponent._id, req.body.roles);
        let component = await ComponentService.getComponent(portal, createComponent._id);
        await LinkServices.addComponentOfLink(portal, req.body.linkId, createComponent._id); // Thêm component đó vào trang

        await Logger.info(req.user.email, 'create_component_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_component_success'],
            content: component
        });
    } catch (error) {

        await Logger.error(req.user.email, 'create_component_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_component_faile'],
            content: error
        });
    }
};

exports.createComponentAttribute = async (req, res) => {
    try {
        const componentAttr = await ComponentService.createComponentAttribute(req.portal, req.body);

        await PolicyService.checkAllPolicies(req.portal);

        Logger.info(req.user.email, 'create_component_attribute_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_component_attribute_success'],
            content: componentAttr
        });
    } catch (error) {
        console.log(error)
        Logger.error(req.user.email, 'create_component_attribute_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_component_attribute_faile'],
            content: error
        });
    }
};

exports.editComponent = async (req, res) => {
    try {
        let portal = !req.query.portal ? req.portal : req.query.portal;
        var componentBeforeEditing = await ComponentService.getComponent(portal, req.params.id);
        await ComponentService.relationshipComponentRole(portal, req.params.id, req.body.roles);
        let component = await ComponentService.editComponent(portal, req.params.id, req.body);
        let resComponent = await ComponentService.getComponent(portal, component._id);

        // Nếu attributes thay đổi thì check lại tất cả policies
        if (differenceAttributes(componentBeforeEditing.attributes, resComponent.attributes).length > 0) {
            await PolicyService.checkAllPolicies(portal);
            // console.log("diff", differenceAttributes(componentBeforeEditing.attributes, resComponent.attributes))
        }

        await Logger.info(req.user.email, 'edit_component_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_component_success'],
            content: resComponent
        });
    } catch (error) {

        await Logger.error(req.user.email, 'edit_component_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_component_faile'],
            content: error
        });
    }
};

exports.deleteComponent = async (req, res) => {
    try {
        let portal = !req.query.portal ? req.portal : req.query.portal;
        let { id } = req.params;
        let { type } = req.query;
        let component = await ComponentService.deleteComponent(portal, id, type);

        await Logger.info(req.user.email, 'delete_component_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_component_success'],
            content: component
        });
    } catch (error) {

        await Logger.error(req.user.email, 'delete_component_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_component_faile'],
            content: error
        });
    }
};

exports.updateCompanyComponents = async (req, res) => {
    try {
        let portal = !req.query.portal ? req.portal : req.query.portal;
        let data = req.body;
        let content = await ComponentService.updateCompanyComponents(portal, data);

        await Logger.info(req.user.email, 'update_company_components_success');
        res.status(200).json({
            success: true,
            messages: ['update_company_components_success'],
            content
        });
    } catch (error) {
        await Logger.info(req.user.email, 'update_company_components_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['update_company_components_faile'],
            content: error
        });
    }
};
