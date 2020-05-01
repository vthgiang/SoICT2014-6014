const {Notification, NotificationUser} = require('../../models').schema;

/**
 * Lấy tất cả thông báo
 */
exports.getAllNotifications = async (company) => { //id cua cong ty do
    return await Notification.find({ company })
        .populate([
            { path: 'creater', model: User }
        ]);
}

/**
 * Phân trang danh sách các thông báo
 */
exports.getPaginatedNotifications = async (company, limit, page, data={}) => {
    const newData = await Object.assign({ company }, data );
    return await Notification
        .paginate( newData , { 
            page, 
            limit
        });
}

/**
 * Lấy thông báo theo id
 */
exports.getNotificationById = async (id) => {
    return await Notification.findById(id);
}

/**
 * Tạo thông báo
 */
exports.createNotification = async (data, company) => {
    
    return await Notification.create({
        company,
        title: data.title,
        level: data.level,
        content: data.content,
        creator: data.creator
    });
}

/**
 * Thông báo đến người dùng
 */
exports.noticeToUsers = async (userArr, notificationId) => {
    const data = userArr.map(userId => {
        return {
            userId,
            notificationId
        };
    });

    return await NotificationUser.insertMany(data);
}

/**
 * Xóa thông báo đã nhận 
 */
exports.deleteReceivedNotification = async (id) => {
    return true;
}

/**
 * Lấy tất cả thông báo đã nhận
 */
exports.getAllReceivedNotificationsOfUser = async (userId) => {
    var data = await NotificationUser
        .find({userId})
        .populate([{ path: 'notificationId', model: Notification }]);
    var notifications = data.map(notifi => notifi.notificationId);

    return notifications;
}

/**
 * Lấy tất cả thông báo đã tạo và gửi đi
 */
exports.getAllNotificationsSentByUser = async (userId) => {
    var notifications = await Notification.find({creator: userId});

    return notifications;
}

/**
 * Xóa thông báo đã nhận
 */
exports.deleteReceivedNotification = async (userId, notificationId) => {
    return await NotificationUser.deleteOne({userId, notificationId});
}

/**
 * Xóa thông báo đã gửi
 */
exports.deleteSentNotification = async (notificationId) => {
    await NotificationUser.deleteMany({notificationId});

    return await Notification.deleteOne({_id: notificationId});
}
