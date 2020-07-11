const {OrganizationalUnit, UserRole, Notification, ManualNotification, Role, User} = require('../../models').schema;

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
exports.paginateManualNotifications = async (creator, data) => {
    var info = Object.assign({creator}, data.content);
    
    return await ManualNotification
        .paginate( info , { 
            page: data.page, 
            limit: data.limit,
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
            { path: 'deans', model: Role, populate: { path: 'users', model: UserRole}},
            { path: 'viceDeans', model: Role, populate: { path: 'users', model: UserRole}},
            { path: 'employees', model: Role, populate: { path: 'users', model: UserRole}}
        ]);
    var users = [];
    for (let i = 0; i < department.deans.length; i++) {
        users = [...users, ...department.deans[i].users.map(user=>user.userId)]
    }
    for (let j = 0; j < department.viceDeans.length; j++) {
        users = [...users, ...department.viceDeans[j].users.map(user=>user.userId)]
    }
    for (let k = 0; k < department.employees.length; k++) {
        users = [...users, ...department.employees[k].users.map(user=>user.userId)]
    }

    return users;
}

// Tạo notification và gửi đến cho user
exports.createNotification = async (company, data, manualNotification=undefined) => {
    let usersArr = data.users;
    console.log("User nhận thông báo1:", usersArr)
    for (let i = 0; i < data.organizationalUnits.length; i++) {
        let organizationalUnit = data.organizationalUnits[i]; // id đơn vị hiện tại
        let userArr = await this.getAllUsersInOrganizationalUnit(organizationalUnit);
        usersArr = await usersArr.concat(userArr);
    }

    console.log("User nhận thông báo2:", usersArr)

    // Loại bỏ các giá trị trùng nhau
    usersArr = usersArr.map(user => user.toString());
    for(let i = 0, max = usersArr.length; i < max; i++) {
        if(usersArr.indexOf(usersArr[i]) != usersArr.lastIndexOf(usersArr[i])) {
            usersArr.splice(usersArr.indexOf(usersArr[i]), 1);
            i--;
        }
    }
    
    // Gửi thông báo cho các user
    let notifications = usersArr.map(user => {
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
    await Notification.insertMany(notifications);
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
exports.paginateNotifications = async (user, data) => {
    var info = Object.assign({user}, data.content);
    
    return await Notification
        .paginate( info , { 
            page: data.page, 
            limit: data.limit,
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
