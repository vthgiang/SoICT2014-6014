const Holiday = require('../../../models/human-resource/holiday.model');

//lấy danh sách ngà nghỉ lễ tết
exports.get = async (company) => {
    var listHoliday = await Holiday.find({
        company: company
    }).sort({
        'startDate': 'ASC'
    })
    return listHoliday;

}

// thêm mới ngày nghỉ lễ tết
exports.create = async (data, company) => {
    var partStart = data.startDate.split('-');
    var startDate = new Date(partStart[2], partStart[1] - 1, partStart[0]);
    var partEnd = data.endDate.split('-');
    var endDate = new Date(partEnd[2], partEnd[1] - 1, partEnd[0]);
    var createHoliday = await Holiday.create({
        company: company,
        startDate: startDate,
        endDate: endDate,
        reason: data.reason,
    });
    return createHoliday
}

// Xoá thông tin nghỉ lễ tết
exports.delete = async (id) => {
    return await Holiday.findOneAndDelete({
        _id: id
    });
}

// Update thông tin nghỉ lễ tết
exports.update = async (id, data) => {
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