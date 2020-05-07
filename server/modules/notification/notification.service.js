const {OrganizationalUnit, UserRole, Notification, ManualNotification} = require('../../models').schema;

/**
 * Lấy tất cả thông báo mà admin, giám đốc... đã tạo - get manual notification
 */
exports.getAllManualNotifications = async (creatorId) => { //id cua cong ty do
    return await ManualNotification.find({ creator: creatorId })
        .sort({createdAt: -1})
        .populate([
            {path: 'users', model: User},
            {path: 'organizationalUnits', model: OrganizationalUnit}
        ]);
}

/**
 * Phân trang danh sách các thông báo
 */
exports.getPaginateManualNotifications = async (creator, limit, page, data={}) => {
    const newData = await Object.assign({ creator }, data );
    return await Notification
        .sort({createdAt: -1})
        .paginate( newData , { 
            page, 
            limit
        });
}

/**
 * Tạo thông báo manual notification
 * @company id của công ty
 * @data thông tin về thông báo muốn tạo
 */
exports.createManualNotification = async (data) => {
    
    return await ManualNotification.create({
        creator: data.creator,
        sender: data.sender,
        title: data.title,
        level: data.level,
        content: data.content,
        users: data.users,
        organizationalUnits: data.organizationalUnits
    });
}

/**
 * Lấy danh sách các user của organizationalUnit để gửi thông báo
 * @return trả về một mảng các id các user
 */
exports.getAllUsersInOrganizationalUnit = async (departmentId) => {
    var department = await OrganizationalUnit.findById(departmentId)
        .populate([
            {path: 'dean', model: Role, populate: { path: 'users', model: UserRole}},
            {path: 'viceDean', model: Role, populate: { path: 'users', model: UserRole}},
            {path: 'employee', model: Role, populate: { path: 'users', model: UserRole}}
        ]);
    var users = [];
    users = users.concat(
        department.dean.users.map(user => user.userId), 
        department.viceDean.users.map(user => user.userId), 
        department.employee.users.map(user => user.userId)
    );

    return users;
}

// Tạo notification và gửi đến cho user
exports.createNotification = async (company, data, manualNotification=undefined) => {
    const notificationToUsers = data.users.map(user=>{
        return {
            company,
            title: data.title,
            level: data.level,
            content: data.content,
            creator: data.creator,
            sender: data.sender,
            user,
            manualNotification
        }
    });
    
    const users = await Notification.insertMany(notificationToUsers);

    for (let i = 0; i < data.organizationalUnits.length; i++) {
        const organizationalUnit = data.organizationalUnits[i]; // id đơn vị hiện tại
        const userArr = await this.getAllUsersInOrganizationalUnit(organizationalUnit);
        const notificationToOrganizationalUnits = userArr.map(user => {
            return {
                company,
                title: data.title,
                level: data.level,
                content: data.content,
                creator: data.creator,
                sender: data.sender,
                user,
                manualNotification
            }
        });
        const organs = await Notification.insertMany(notificationToOrganizationalUnits);
    }

    return true;
}

/**
 * Lấy tất cả thông báo mà một user nhận được
 * @user id của user đó
 */
exports.getAllNotifications = async (user) => {
    return await Notification.find({user}).sort({readed: 1});
}

// /**
//  * Thông báo đến người dùng
//  */
// exports.noticeToUsers = async (userArr, notificationId) => {
//     const data = userArr.map(userId => {
//         return {
//             userId,
//             notificationId
//         };
//     });

//     return await NotificationUser.insertMany(data);
// }

// /**
//  * Xóa thông báo đã nhận 
//  */
// exports.deleteReceivedNotification = async (id) => {
//     return true;
// }

// /**
//  * Lấy tất cả thông báo đã nhận
//  */
// exports.getAllReceivedNotificationsOfUser = async (userId) => {
//     const data = await NotificationUser
//         .find({userId})
//         .populate([{ path: 'notificationId', model: Notification }]);
    
//     return data.map(res => {
//         return {
//             _id: res.notificationId._id,
//             title: res.notificationId.title,
//             content: res.notificationId.content,
//             level: res.notificationId.level,
//             readed: res.readed,
//             date: res.notificationId.createdAt
//         }
//     })
// }

// /**
//  * Lấy tất cả thông báo đã tạo và gửi đi
//  */
// exports.getAllNotificationsSentByUser = async (userId) => {
//     var notifications = await Notification.find({creator: userId});

//     return notifications;
// }

// /**
//  * Xóa thông báo đã nhận
//  */
// exports.deleteReceivedNotification = async (userId, notificationId) => {
//     return await NotificationUser.deleteOne({userId, notificationId});
// }

// /**
//  * Xóa thông báo đã gửi
//  */
// exports.deleteSentNotification = async (notificationId) => {
//     await NotificationUser.deleteMany({notificationId});

//     return await Notification.deleteOne({_id: notificationId});
// }

/**
 * Đánh dấu thông báo nhận đã được đọc
 */
exports.changeNotificationStateToReaded = async (notificationId) => {
    const notification = await Notification.findById(notificationId);
    notification.readed = true;
    await notification.save();

    return notification;
}
