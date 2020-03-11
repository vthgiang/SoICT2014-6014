const Holiday = require('../../../models/holiday.model');

//lấy danh sách ngà nghỉ lễ tết
exports.get = async (company) => {
    var listHoliday = await Holiday.find({
        company: company
    })
    return listHoliday;

}

// thêm mới ngày nghỉ lễ tết
exports.create = async (data, company) => {
    var createHoliday = await Holiday.create({
        company: company,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
    });
    // var content = {
    //     company: company,
    //     startDate: data.startDate,
    //     endDate: data.type,
    //     reason: data.reason,
    // }
    return createHoliday
}

// Xoá thông tin nghỉ lễ tết
exports.delete = async (id) => {
    return await Holiday.findOneAndDelete({
        _id: id
    });
}

// Update thông tin nghỉ lễ tết
exports.update = async (id, data, company) => {
    var holidayChange = {
        company: company,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
    };
    await Praise.findOneAndUpdate({
        _id: id
    }, {
        $set: holidayChange
    });
    var updateHoliday = {
        _id: id,
        company: company,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
    }
    return updateHoliday;
}