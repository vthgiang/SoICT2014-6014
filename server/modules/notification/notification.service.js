const NotificationUser = require('../../models/notification_user.model');
const Notification = require('../../models/notification.model')

//Lấy tất cả các thông báo trong công ty
exports.get = async (company) => { //id cua cong ty do
    return await Notification.find({ company })
        .populate([
            { path: 'creater', model: User }
        ]);
}

//Lấy danh sách thông báo theo số lượng
exports.getPaginate = async (company, limit, page, data={}) => {
    const newData = await Object.assign({ company }, data );
    return await Notification
        .paginate( newData , { 
            page, 
            limit
        });
}

//Lấy thông tin về thông báo
exports.getById = async (id) => {
    return await Notification.findById(id);
}

//Tạo thông báo mới
exports.create = async (data, company) => {
    return await Notification.create({
        company,
        title: data.title,
        icon: data.icon,
        content: data.content,
        creater: data.creater
    });
}

//Thông báo tới phòng ban nào (thông báo đến các user trong phòng ban)
exports.noticeToUsers = async (userArr, notificationId) => { //mảng các userId và id của notification
    const data = userArr.map(userId => {
        return {
            userId,
            notificationId
        };
    });

    return await NotificationUser.insertMany(data);
}

exports.delete = async (id) => {
    return true;
}

//Lấy tất cả các thông báo đã nhận của user
exports.getNotificationReceivered = async (userId) => {
    var data = await NotificationUser
        .find({userId})
        .populate([{ path: 'notificationId', model: Notification }]);
    var notifications = data.map(notifi => notifi.notificationId);

    return notifications;
}

//Lấy tất cả các thông báo đã tạo của user
exports.getNotificationSent = async (userId) => {
    var notifications = await Notification.find({creater: userId});

    return notifications;
}
