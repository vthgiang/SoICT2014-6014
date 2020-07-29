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
        description: data.description,
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
        description: data.description,
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
/**
 * Hàm tiện ích convertdate thành yyyy-mm-dd
 * @param {Hàm} date : ngày cần convert
 */
exports.formatDate = (date) => {
    let d = date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
}

/**
 * import dữ liệu bảng lương 
 * @param {*} data : Dữ liệu import
 * @param {*} company : Id công ty
 */
exports.importHolidays = async (data, company) => {
    let holidayExisted = await Holiday.find({
        company: company
    });
    let rowError = [];
    data = data.map((x, index) => {
        if (holidayExisted.length !== 0) {
            let holiday = holidayExisted.filter(y => x.startDate === this.formatDate(y.startDate) && x.endDate === this.formatDate(y.endDate));
            if (holiday.length !== 0) {
                x = {
                    ...x,
                    errorAlert: [...x.errorAlert, "holiday_have_exist"],
                    error: true
                };
                rowError = [...rowError, index + 1];
            }
        }
        return {
            ...x,
            company: company
        };
    })
    if (rowError.length !== 0) {
        for (let n in data) {
            let partStart = data[n].startDate.split('-');
            let startDate = [partStart[2], partStart[1], partStart[0]].join('-');
            let partEnd = data[n].endDate.split('-');
            let endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
            data[n] = {
                ...data[n],
                startDate: startDate,
                endDate: endDate
            };
        };
        return {
            data,
            rowError
        }
    } else {
        return await Holiday.insertMany(data);
    }
}