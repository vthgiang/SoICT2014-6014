const {OrganizationalUnit, UserRole, Notification, ManualNotification} = require('../../models').schema;

/**
 * Lấy tất cả thông báo mà admin, giám đốc... đã tạo - get manual notification
 */
exports.getAllManualNotifications = async (creator) => { //id cua cong ty do
    return await ManualNotification.find({ creator })
        .populate([
            {path: 'users', model: User},
            {path: 'organizationalUnits', model: OrganizationalUnit}
        ]).sort({createdAt: -1});
}

/**
 * Phân trang danh sách các thông báo đã được tạo bởi admin, giám đốc ..
 */
exports.paginateManualNotifications = async (creator, limit, page) => {
    return await ManualNotification
        .paginate( {creator} , { 
            page, 
            limit,
            sort: { createdAt: -1 }, 
            populate: [
                {path: 'users', model: User},
                {path: 'organizationalUnits', model: OrganizationalUnit}
            ]
        });
}

/**
 * Tạo thông báo manual notification
 * @company id của công ty
 * @data thông tin về thông báo muốn tạo
 */
exports.createManualNotification = async (data) => {
    
    const notify = await ManualNotification.create({
        creator: data.creator,
        sender: data.sender,
        title: data.title,
        level: data.level,
        content: data.content,
        users: data.users,
        organizationalUnits: data.organizationalUnits
    });

    return await ManualNotification.findById(notify._id).populate([
        {path: 'users', model: User},
        {path: 'organizationalUnits', model: OrganizationalUnit}
    ]);
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
    return await Notification.find({user}).sort({createdAt: -1});
}

/**
 * Phân trang danh sách các thông báo của người dùng nhận được
 */
exports.paginateNotifications = async (user, limit, page) => {
    return await Notification
        .paginate( {user} , { 
            page, 
            limit,
            sort: { createdAt: -1 }
        });
}

/**
 * Đánh dấu thông báo nhận đã được đọc
 */
exports.changeNotificationStateToReaded = async (notificationId) => {
    const notification = await Notification.findById(notificationId);
    notification.readed = true;
    await notification.save();

    return notification;
}

/**
 * Xóa manual notification
 */
exports.deleteManualNotification = async (notificationId) => {
    return await ManualNotification.deleteOne({_id: notificationId});
}

/**
 * Xóa notification của user
 */
exports.deleteNotification = async (notificationId) => {
    return await Notification.deleteOne({_id: notificationId});
}
