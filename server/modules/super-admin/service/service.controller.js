const ServiceService = require('./service.service');
const Logger = require(`../../../logs`);

exports.getServices = async (req, res) => {
    try {
        var services = await ServiceService.getServices(req.portal, req.query);
        Logger.info(req.user.email, 'get_services_success', req.portal);

        res.status(200).json({
            success: true,
            messages: ['get_services_success'],
            content: services
        });
    } catch (error) {
        Logger.error(req.user.email, 'get_services_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_services_faile'],
            content: error
        })
    }
};

exports.getService = async (req, res) => {
    try {
        var service = await ServiceService.getService(req.portal, req.params.id);

        Logger.info(req.user.email, 'SHOW_SERVICE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['show_service_success'],
            content: service
        });
    } catch (error) {
        Logger.error(req.user.email, 'SHOW_SERVICE', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_service_faile'],
            content: error
        })
    }
};

exports.createService = async (req, res) => {
    try {
        var service = await ServiceService.createService(req.portal, req.body, req.user.company._id);
        var result = await ServiceService.getService(req.portal, service._id);

        Logger.info(req.user.email, 'create_service_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_service_success'],
            content: result
        });
    } catch (error) {

        Logger.error(req.user.email, 'create_service_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_service_faile'],
            content: error
        })
    }
};

exports.editService = async (req, res) => {
    try {
        var service = await ServiceService.editService(req.portal, req.params.id, req.body);
        var result = await ServiceService.getService(req.portal, req.params.id);

        Logger.info(req.user.email, 'edit_service_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_service_success'],
            content: result
        });
    } catch (error) {
        console.log(error)
        Logger.error(req.user.email, 'edit_service_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_service_faile'],
            content: error
        });
    }
};

exports.deleteService = async (req, res) => {
    try {
        var deleteService = await ServiceService.deleteService(req.portal, req.params.id);

        Logger.info(req.user.email, 'delete_service_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_service_success'],
            content: deleteService
        });
    } catch (error) {

        Logger.error(req.user.email, 'delete_service_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_service_faile'],
            content: error
        });
    }
};

exports.importServices = async (req, res) => {
    try {
        if (Array.isArray(req.body.data)) {
            for (let i = 0; i < req.body.data.length; i++) {
                let dataService = req.body.data[i];
                let service = await ServiceService.createService(req.portal, dataService, req.user.company._id);
            }
        }
        let servicelist = await ServiceService.getServices(req.portal);

        Logger.info(req.user.email, 'import_services_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['import_services_success'],
            content: servicelist
        });
    } catch (error) {

        Logger.error(req.user.email, 'import_services_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['import_services_faile'],
            content: error
        });
    }
}

exports.sendEmailResetPasswordService = async (req, res) => {
    try {
        let requestReset = await ServiceService.sendEmailResetPasswordService(req.portal, req.body.email);

        Logger.info(req.user.email, 'reset_password_service_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['reset_password_service_success'],
            content: requestReset
        });
    } catch (error) {

        Logger.error(req.user.email, 'reset_password_service_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['reset_password_service_faile'],
            content: error
        });
    }
}
