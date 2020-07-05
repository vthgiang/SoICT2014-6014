const {
    Holiday
} = require('../../../models').schema;

/**
 * Lấy danh sách ngày nghỉ lễ tết
 * @company : Id công ty
 */
exports.getAllHolidays = async (company) => {
    return await Holiday.find({
        company: company
    }).sort({
        'startDate': 'ASC'
    })
}

/**
 * Thêm mới ngày nghỉ lễ tết
 * @data : dữ liệu ngày nghỉ lễ tết cần thêm
 * @company : id công ty cần thêm
 */
exports.createHoliday = async (data, company) => {
    var partStart = data.startDate.split('-');
    var startDate = new Date(partStart[2], partStart[1] - 1, partStart[0]);
    var partEnd = data.endDate.split('-');
    var endDate = new Date(partEnd[2], partEnd[1] - 1, partEnd[0]);

    return await Holiday.create({
        company: company,
        startDate: startDate,
        endDate: endDate,
        reason: data.reason,
    });
}

/**
 * Xoá thông tin nghỉ lễ tết
 * @id : id thông tin nghỉ lễ tết cần xoá
 */
exports.deleteHoliday = async (id) => {
    return await Holiday.findOneAndDelete({
        _id: id
    });
}

/**
 * Cập nhật thông tin nghỉ lễ tết
 * @id : id thông tin nghỉ lễ tết cần chỉnh sửa
 * @data : dữ liệu chỉnh sửa thông tin nghỉ lễ tết
 */
exports.updateHoliday = async (id, data) => {
    var partStart = data.startDate.split('-');
    var startDate = new Date(partStart[2], partStart[1] - 1, partStart[0]);
    var partEnd = data.endDate.split('-');
    var endDate = new Date(partEnd[2], partEnd[1] - 1, partEnd[0]);

    var holidayChange = {
        startDate: startDate,
        endDate: endDate,
        reason: data.reason,
    };
    await Holiday.findOneAndUpdate({
        _id: id
    }, {
        $set: holidayChange
    });
    return await Holiday.findOne({
        _id: id
    })
}