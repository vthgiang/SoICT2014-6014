const NotificationServices = require('./notification.service');
const UserServices = require('../super-admin/user/user.service');
const { LogInfo, LogError } = require('../../logs');

exports.getAllNotifications = async (req, res) => {
    try {
        var notifications = await NotificationServices.getAllNotifications(req.user.company._id);

        await LogInfo(req.user.email, 'GET_NOTIFICATIONS', req.user.company._id );
        res.status(200).json({
            success: true,
            messages: ['get_all_notifications_success'],
            content: notifications
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_NOTIFICATIONS', req.user.company._id );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_all_notifications_faile'],
            content: error
        })
    }
};

exports.getPaginatedNotifications = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var notifications = await NotificationServices.getPaginatedNotifications(req.user.company._id, limit, page, req.body);

        await LogInfo(req.user.email, 'GET_PAGINATE_NOTIFICATIONS', req.user.company._id );
        res.status(200).json({
            success: true,
            messages: ['paginate_notifications_success'],
            content: notifications
        });
    } catch (error) {
        
        await LogError(req.user.email, 'GET_PAGINATE_NOTIFICATIONS', req.user.company._id );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['paginate_notifications_faile'],
            content: error
        });
    }
};

exports.createNotification = async (req, res) => {
    try {
        req.body.creater = req.user._id;
        const notification = await NotificationServices.createNotification(req.body, req.user.company._id);
        const {departments} = req.body;
        console.log("fdsfsdfsdfs", notification)
        for (let i = 0; i < departments.length; i++) {
            const userArr =  await UserServices.getAllUsersInOrganizationalUnit(departments[i]);
            console.log("fdsfsdfsdfs", userArr)
            await NotificationServices.noticeToUsers(userArr, notification._id);
        }

        await LogInfo(req.user.email, 'CREATE_NOTIFICATION', req.user.company._id );
        res.status(200).json({
            success: true,
            messages: ['create_notification_success'],
            content: notification
        });
    } catch (error) {

        await LogError(req.user.email, 'CREATE_NOTIFICATION', req.user.company._id );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_notification_faile'],
            content: error
        });
    }
};

exports.getNotification = async (req, res) => {
    try {
        var notification = await NotificationServices.getNotificationById(req.params.id);

        await LogInfo(req.user.email, 'SHOW_NOTIFICATION', req.user.company._id );
        res.status(200).json(notification)
    } catch (error) {
        
        await LogError(req.user.email, 'SHOW_NOTIFICATION', req.user.company._id );
        res.status(400).json(error)
    }
};

exports.editNotification = async (req, res) => {
    try {
        var notification = await NotificationServices.editNotification(req.params.id, req.body);
        
        await LogInfo(req.user.email, 'EDIT_NOTIFICATION', req.user.company._id );
        res.status(200).json(notification);
    } catch (error) {
        
        await LogError(req.user.email, 'EDIT_NOTIFICATION', req.user.company._id );
        res.status(400).json(error);
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        var notification = await NotificationServices.deleteReceivedNotification(req.params.id);

        await LogInfo(req.user.email, 'DELETE_NOTIFICATION', req.user.company._id );
        res.status(200).json(notification);
    } catch (error) {

        await LogError(req.user.email, 'DELETE_NOTIFICATION', req.user.company._id );
        res.status(400).json(error)
    }
};

exports.getNotificationReceivered = async (req, res) => {
    try {
        var notifications = await NotificationServices.getAllReceivedNotificationsOfUser(req.params.userId);

        await LogInfo(req.user.email, 'GET_NOTIFICATION_RECEIVERED', req.user.company._id );
        res.status(200).json(notifications);
    } catch (error) {

        await LogError(req.user.email, 'GET_NOTIFICATION_RECEIVERED', req.user.company._id );
        res.status(400).json(error)
    }
};

exports.getNotificationSent = async (req, res) => {
    try {
        var notifications = await NotificationServices.getAllNotificationsSentByUser(req.params.userId);

        await LogInfo(req.user.email, 'GET_NOTIFICATION_SENT', req.user.company._id );
        res.status(200).json(notifications);
    } catch (error) {

        await LogError(req.user.email, 'GET_NOTIFICATION_SENT', req.user.company._id );
        res.status(400).json(error)
    }
};

exports.deleteNotificationReceivered = async (req, res) => {
    try {
        var notification = await NotificationServices.deleteReceivedNotification(req.params.userId, req.params.notificationId);

        await LogInfo(req.user.email, 'DELETE_NOTIFICATION_RECEIVERED', req.user.company._id );
        res.status(200).json({
            success: true,
            message: 'delete_notification_receivered_success',
            content: notification
        });
    } catch (error) {

        await LogError(req.user.email, 'DELETE_NOTIFICATION_RECEIVERED', req.user.company._id );
        res.status(400).json({
            success: false,
            message: 'delete_notification_receivered__faile'
        });
    }
};

exports.deleteNotificationSent = async (req, res) => {
    try {
        var notification = await NotificationServices.deleteSentNotification(req.params.id);

        await LogInfo(req.user.email, 'DELETE_NOTIFICATION_SENT', req.user.company._id );
        res.status(200).json({
            success: true,
            message: 'delete_notification_sent_success',
            content: notification
        });
    } catch (error) {

        await LogError(req.user.email, 'DELETE_NOTIFICATION_SENT', req.user.company._id );
        res.status(400).json({
            success: false,
            message: 'delete_notification_sent_faile'
        });
    }
};
