const NotificationServices = require('./notification.service');
const { Log } = require('../../logs');

exports.get = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET NOTIFICATIONS');
    try {
        var notifications = await NotificationServices.get(req.user.company._id);

        isLog && Logger.info(req.user.email);
        res.status(200).json(notifications);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error)
    }
};

exports.getPaginate = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET PAGINATE NOTIFICATIONS');
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var notifications = await NotificationServices.getPaginate(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty

        isLog && Logger.info(req.user.email);
        res.status(200).json(notifications);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'CREATE NOTIFICATION');
    try {
        req.body.creater = req.user._id;
        var notification = await NotificationServices.create(req.body, req.user.company._id);

        isLog && Logger.info(req.user.email);
        res.status(200).json(notification);
    } catch (error) {

        isLog && Logger.error(req.user.email);
        res.status(400).json(error)
    }
};

exports.show = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'SHOW NOTIFICATION');
    try {
        var notification = await NotificationServices.getById(req.params.id);

        isLog && Logger.info(req.user.email);
        res.status(200).json(notification)
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error)
    }
};

exports.edit = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'EDIT NOTIFICATION');
    try {
        var notification = await NotificationServices.edit(req.params.id, req.body);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(notification);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'DELETE NOTIFICATION');
    try {
        var notification = await NotificationServices.delete(req.params.id);

        isLog && Logger.info(req.user.email);
        res.status(200).json(notification);
    } catch (error) {

        isLog && Logger.error(req.user.email);
        res.status(400).json(error)
    }
};
