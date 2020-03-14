const NotificationServices = require('./notification.service');
const UserServices = require('../super-admin-management/users-management/user.service');
const { LogInfo, LogError } = require('../../logs');

exports.get = async (req, res) => {
    try {
        var notifications = await NotificationServices.get(req.user.company._id);

        await LogInfo(req.user.email, 'GET_NOTIFICATIONS', req.user.company._id, req.user.company.short_name);
        res.status(200).json(notifications);
    } catch (error) {
        await LogError(req.user.email, 'GET_NOTIFICATIONS', req.user.company._id, req.user.company.short_name);
        res.status(400).json(error)
    }
};

exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var notifications = await NotificationServices.getPaginate(req.user.company._id, limit, page, req.body);

        await LogInfo(req.user.email, 'GET_PAGINATE_NOTIFICATIONS', req.user.company._id, req.user.company.short_name);
        res.status(200).json(notifications);
    } catch (error) {
        
        await LogError(req.user.email, 'GET_PAGINATE_NOTIFICATIONS', req.user.company._id, req.user.company.short_name);
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        req.body.creater = req.user._id;
        var notification = await NotificationServices.create(req.body, req.user.company._id);
        var {departments} = req.body;
        departments.forEach(async(department) => {
            var userArr =  await UserServices.getUsersOfDepartment(department);
            await NotificationServices.noticeToUsers(userArr, notification._id);
        });

        await LogInfo(req.user.email, 'CREATE_NOTIFICATION', req.user.company._id, req.user.company.short_name);
        res.status(200).json(notification);
    } catch (error) {

        await LogError(req.user.email, 'CREATE_NOTIFICATION', req.user.company._id, req.user.company.short_name);
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var notification = await NotificationServices.getById(req.params.id);

        await LogInfo(req.user.email, 'SHOW_NOTIFICATION', req.user.company._id, req.user.company.short_name);
        res.status(200).json(notification)
    } catch (error) {
        
        await LogError(req.user.email, 'SHOW_NOTIFICATION', req.user.company._id, req.user.company.short_name);
        res.status(400).json(error)
    }
};

exports.edit = async (req, res) => {
    try {
        var notification = await NotificationServices.edit(req.params.id, req.body);
        
        await LogInfo(req.user.email, 'EDIT_NOTIFICATION', req.user.company._id, req.user.company.short_name);
        res.status(200).json(notification);
    } catch (error) {
        
        await LogError(req.user.email, 'EDIT_NOTIFICATION', req.user.company._id, req.user.company.short_name);
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var notification = await NotificationServices.delete(req.params.id);

        await LogInfo(req.user.email, 'DELETE_NOTIFICATION', req.user.company._id, req.user.company.short_name);
        res.status(200).json(notification);
    } catch (error) {

        await LogError(req.user.email, 'DELETE_NOTIFICATION', req.user.company._id, req.user.company.short_name);
        res.status(400).json(error)
    }
};

exports.getNotificationReceivered = async (req, res) => {
    try {
        var notifications = await NotificationServices.getNotificationReceivered(req.params.userId);

        await LogInfo(req.user.email, 'GET_NOTIFICATION_RECEIVERED', req.user.company._id, req.user.company.short_name);
        res.status(200).json(notifications);
    } catch (error) {

        await LogError(req.user.email, 'GET_NOTIFICATION_RECEIVERED', req.user.company._id, req.user.company.short_name);
        res.status(400).json(error)
    }
};

exports.getNotificationSent = async (req, res) => {
    try {
        var notifications = await NotificationServices.getNotificationSent(req.params.userId);

        await LogInfo(req.user.email, 'GET_NOTIFICATION_SENT', req.user.company._id, req.user.company.short_name);
        res.status(200).json(notifications);
    } catch (error) {

        await LogError(req.user.email, 'GET_NOTIFICATION_SENT', req.user.company._id, req.user.company.short_name);
        res.status(400).json(error)
    }
};
