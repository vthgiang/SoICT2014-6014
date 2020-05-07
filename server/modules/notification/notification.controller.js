const NotificationServices = require('./notification.service');
const { LogInfo, LogError } = require('../../logs');

exports.getAllManualNotifications = async (req, res) => {
    try {
        const manualNotifications = await NotificationServices.getAllManualNotifications(req.user._id);

        await LogInfo(req.user.email, 'GET_MANUAL_NOTIFICATIONS', req.user.company._id );
        res.status(200).json({
            success: true,
            messages: ['get_all_manual_notifications_success'],
            content: manualNotifications
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_MANUAL_NOTIFICATIONS', req.user.company._id );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_all_manual_notifications__faile'],
            content: error
        })
    }
};

exports.getPaginateManualNotifications = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var notifications = await NotificationServices.getPaginateManualNotifications(req.user._id, limit, page, req.body);

        await LogInfo(req.user.email, 'PAGINATE_MANUAL_NOTIFICATIONS', req.user.company._id );
        res.status(200).json({
            success: true,
            messages: ['paginate_manual_notifications_success'],
            content: notifications
        });
    } catch (error) {
        
        await LogError(req.user.email, 'PAGINATE_MANUAL_NOTIFICATIONS', req.user.company._id );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['paginate_manual_notifications_faile'],
            content: error
        });
    }
};

exports.createNotification = async (req, res) => {
    try {
        const notification = await NotificationServices.createManualNotification(req.body);
        console.log("fsfsdfsd", notification)
        await NotificationServices.createNotification(req.user.company._id, req.body, notification._id);

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

// Lấy tất cả các thông báo mà người dùng nhận được
exports.getAllNotifications = async (req, res) => {
    try {
        var notification = await NotificationServices.getAllNotifications(req.user._id);

        await LogInfo(req.user.email, 'GET_ALL_NOTIFICATIONS', req.user.company._id );
        res.status(200).json({
            success: true,
            messages: ['get_all_notification_success'],
            content: notification
        })
    } catch (error) {
        
        await LogError(req.user.email, 'GET_ALL_NOTIFICATIONS', req.user.company._id );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_all_notification_faile'],
            content: error
        })
    }
};

// exports.editNotification = async (req, res) => {
//     try {
//         var notification = await NotificationServices.editNotification(req.params.id, req.body);
        
//         await LogInfo(req.user.email, 'EDIT_NOTIFICATION', req.user.company._id );
//         res.status(200).json({
//             success: true,
//             messages: ['edit_notification_success'],
//             content: notification
//         });
//     } catch (error) {
        
//         await LogError(req.user.email, 'EDIT_NOTIFICATION', req.user.company._id );
//         res.status(400).json({
//             success: false,
//             messages: Array.isArray(error) ? error : ['edit_notification_faile'],
//             content: error
//         });
//     }
// };

// exports.deleteNotification = async (req, res) => {
//     try {
//         var notification = await NotificationServices.deleteReceivedNotification(req.params.id);

//         await LogInfo(req.user.email, 'DELETE_NOTIFICATION', req.user.company._id );
//         res.status(200).json({
//             success: true,
//             messages: ['delete_notification_success'],
//             content: notification
//         });
//     } catch (error) {

//         await LogError(req.user.email, 'DELETE_NOTIFICATION', req.user.company._id );
//         res.status(400).json({
//             success: false,
//             messages: Array.isArray(error) ? error : ['delete_notification_faile'],
//             content: error
//         })
//     }
// };

// exports.getNotificationReceivered = async (req, res) => {
//     try {
//         var notifications = await NotificationServices.getAllReceivedNotificationsOfUser(req.params.userId);

//         await LogInfo(req.user.email, 'GET_NOTIFICATION_RECEIVERED', req.user.company._id );
//         res.status(200).json({
//             success: true,
//             messages: ['get_notification_receivered_success'],
//             content: notifications
//         });
//     } catch (error) {

//         await LogError(req.user.email, 'GET_NOTIFICATION_RECEIVERED', req.user.company._id );
//         res.status(400).json({
//             success: false,
//             messages: Array.isArray(error) ? error : ['get_notification_receivered_faile'],
//             content: error
//         })
//     }
// };

// exports.getNotificationSent = async (req, res) => {
//     try {
//         var notifications = await NotificationServices.getAllNotificationsSentByUser(req.params.userId);

//         await LogInfo(req.user.email, 'GET_NOTIFICATION_SENT', req.user.company._id );
//         res.status(200).json({
//             success: true,
//             messages: ['get_notification_sent_success'],
//             content: notifications
//         });
//     } catch (error) {

//         await LogError(req.user.email, 'GET_NOTIFICATION_SENT', req.user.company._id );
//         res.status(400).json({
//             success: false,
//             messages: Array.isArray(error) ? error : ['get_notification_sent_faile'],
//             content: error
//         })
//     }
// };

// exports.deleteNotificationReceivered = async (req, res) => {
//     try {
//         var notification = await NotificationServices.deleteReceivedNotification(req.params.userId, req.params.notificationId);

//         await LogInfo(req.user.email, 'DELETE_NOTIFICATION_RECEIVERED', req.user.company._id );
//         res.status(200).json({
//             success: true,
//             message: 'delete_notification_receivered_success',
//             content: notification
//         });
//     } catch (error) {

//         await LogError(req.user.email, 'DELETE_NOTIFICATION_RECEIVERED', req.user.company._id );
//         res.status(400).json({
//             success: false,
//             messages: Array.isArray(error) ? error : ['delete_notification_receivered_faile'],
//             content: error
//         });
//     }
// };

// exports.deleteNotificationSent = async (req, res) => {
//     try {
//         var notification = await NotificationServices.deleteSentNotification(req.params.id);

//         await LogInfo(req.user.email, 'DELETE_NOTIFICATION_SENT', req.user.company._id );
//         res.status(200).json({
//             success: true,
//             message: 'delete_notification_sent_success',
//             content: notification
//         });
//     } catch (error) {

//         await LogError(req.user.email, 'DELETE_NOTIFICATION_SENT', req.user.company._id );
//         res.status(400).json({
//             success: false,
//             messages: Array.isArray(error) ? error : ['delete_notification_sent_faile'],
//             content: error
//         });
//     }
// };

exports.changeNotificationStateToReaded = async (req, res) => {
    try {
        var notification = await NotificationServices.changeNotificationStateToReaded(req.params.id);
        console.log("Read notify: ", notification)
        await LogInfo(req.user.email, 'CHANGE_NOTIFICATION_STATE_TO_READED', req.user.company._id );
        res.status(200).json({
            success: true,
            message: 'change_notification_state_to_readed_success',
            content: notification
        });
    } catch (error) {

        await LogError(req.user.email, 'CHANGE_NOTIFICATION_STATE_TO_READED', req.user.company._id );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['change_notification_state_to_readed_faile'],
            content: error
        });
    }
};

