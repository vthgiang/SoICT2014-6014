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

exports.delete = async (id) => {
    return true;
}