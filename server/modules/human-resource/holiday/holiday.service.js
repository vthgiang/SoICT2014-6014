const {
    Holiday
} = require('../../../models').schema;

/**
 * Lấy danh sách lịch làm việc
 * @company : Id công ty
 */
exports.getAllHolidays = async (company) => {
    let data = await Holiday.findOne({
        company: company
    }).sort({
        'holidays.startDate': 'ASC'
    });
    return {
        maximumNumberOfLeaveDays: data ? data.maximumNumberOfLeaveDays : 0,
        holidays: data ? data.holidays : []
    };
}

/**
 * Lấy danh sách kế hoạch làm việc theo năm
 * @param {*} year : Năm
 * @param {*} company : Id công ty
 */
exports.getHolidaysOfYear = async (company, year) => {
    let firstDay = new Date(year, 0, 1);
    let lastDay = new Date(Number(year) + 1, 0, 1);
    let data = await Holiday.findOne({
        company: company,
        'holidays.startDate': {
            "$gt": firstDay,
            "$lte": lastDay
        }
    }).sort({
        'holidays.startDate': 'ASC'
    });
    return {
        maximumNumberOfLeaveDays: data ? data.maximumNumberOfLeaveDays : 0,
        holidays: data ? data.holidays : []
    };
}

/**
 * Thêm mới lịch làm việc
 * @data : dữ liệu lịch làm việc cần thêm
 * @company : id công ty cần thêm
 */
exports.createHoliday = async (data, company) => {
    let newHoliday = {
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
    }
    let holiday = await Holiday.findOne({
        company: company,
    });
    if (holiday === null) {
        holiday = await Holiday.create({
            company: company,
            maximumNumberOfLeaveDays: 0,
            holidays: [],
        });
    };
    holiday.holidays.push(newHoliday);
    holiday.save();
    return holiday.holidays[holiday.holidays.length - 1];
}

/**
 * Xoá thông tin lịch làm việc
 * @id : id thông tin lịch làm việc cần xoá
 */
exports.deleteHoliday = async (id, company) => {
    let holiday = await Holiday.findOne({
        company: company,
    });
    let deleteholiday = holiday.holidays.find(x => x._id.toString() === id);
    holiday.holidays = holiday.holidays.filter(x => x._id.toString() !== id);
    holiday.save();
    return deleteholiday;
}

/**
 * Cập nhật thông tin lịch làm việc
 * @id : id thông tin lịch làm việc cần chỉnh sửa
 * @data : dữ liệu chỉnh sửa thông tin lịch làm việc
 */
exports.updateHoliday = async (id, data, company) => {
    let holiday = await Holiday.findOne({
        company: company
    });
    holiday.holidays = holiday.holidays.map(x => {
        if (x._id.toString() === id) {
            x.type = data.type;
            x.startDate = data.startDate;
            x.endDate = data.endDate;
            x.description = data.description;
        }
        return x;
    })
    holiday.save();
    return {
        holiday: holiday.holidays.find(x => x._id.toString() === id)
    };
}

/**
 * Cập nhật tổng số ngày nghỉ phép trong năm
 * @param {*} maximumNumberOfLeaveDays : Tổng số ngày nghỉ phép trong năm 
 */
exports.updateNumberDateLeaveOfYear = async (maximumNumberOfLeaveDays, company) => {
    let holiday = await Holiday.findOne({
        company: company
    });
    if (holiday === null) {
        holiday = await Holiday.create({
            company: company,
            maximumNumberOfLeaveDays: 0,
            holidays: [],
        });
    };
    holiday.maximumNumberOfLeaveDays = maximumNumberOfLeaveDays;
    holiday.save();
    return {
        maximumNumberOfLeaveDays: holiday.maximumNumberOfLeaveDays
    };
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
    let holiday = await Holiday.findOne({
        company: company,
    });
    if (holiday === null) {
        holiday = await Holiday.create({
            company: company,
            maximumNumberOfLeaveDays: 0,
            holidays: [],
        });
    };
    let holidayExisted = holiday.holidays;
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
        holiday.holidays = holiday.holidays.concat(data);
        holiday.save();
        return holiday.holidays;
    }
}