export const capitalize = (letter) => {
    letter = letter.toLowerCase();
    letter = letter.charAt(0).toUpperCase() + letter.slice(1);
    letter = letter.replace(/,\s*$/, "")
    return letter;
}

/**
 * So sánh hai giá trị ngày nhập vào
 * @param {*} time1
 * @param {*} time2 
 * @param {*} type 
 * Kết quả trả về: 0: không thể so sánh, -1: time1 <= time2, 1: time1 > time2
 */
export const compareTime = (time1, time2, type = 'dmy') => {
    switch (type) {
        case 'dmy':
            let c1 = new Date(time1);
            let c2 = new Date(time2);
            if (!c1 || !c2) return 0; // Không thể so sánh do giá trị nhập vào lỗi

            let timer1 = new Date(c1.getFullYear(), c1.getMonth() + 1, c1.getDate());
            let timer2 = new Date(c2.getFullYear(), c2.getMonth() + 1, c2.getDate());

            if (timer1 <= timer2) return -1;
            else return 1;

        default:
            return time1 > time2 ? 1 : -1;
    }
}

/**
 * Hàm lấy ra một thuộc tính của một giá trị đầu vào cho trước
 * Giá trị có thể có hoặc không phụ thuộc vào một mảng các giá trị mà giá trị đầu vào có hoặc không thuộc trong mảng
 * @param {*} value 
 * @param {*} property 
 * @param {*} getValue 
 * @param {*} arr 
 */
export const getPropertyOfValue = (value, property = "name", getValue = true, arr) => {
    if (!value) return '';
    if (!arr) {
        if (typeof (value) !== 'object') return getValue ? value : '';
        else return value[property];
    } else {
        if (typeof (value) === 'object') {
            return value[property];
        } else {
            let findValue = arr.find(item => item._id === value);
            if (!findValue) return '';
            else return findValue[property];
        }
    }
}

/**
 * Hàm lấy định dạng thời gian theo format
 * @param {*} time 
 * @param {*} type 
 */
export const getFormatDateFromTime = (time, format = 'date') => {
    if (!time) return null;

    let d = new Date(time);
    if (!d) return null;

    let day = d.getDate();
    day = day < 10 ? `0${day}` : day;

    let month = d.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;

    let year = d.getFullYear();

    switch (format) {
        case 'mm-yyyy':
            return [month, year].join('-');
        case 'dd-mm-yyyy':
            return [day, month, year].join('-');
        default:
            return d;
    }
}

/**
 * Hàm lấy giá trị thời gian theo format
 * @param {*} time 
 * @param {*} format 
 */
export const getTimeFromFormatDate = (time, format = 'date', subTime = null) => {
    if (!time) return null;

    let formatedTime, dataTime, year, month, day, hour;
    switch (format) {
        case 'mm-yyyy':
            dataTime = time.split('-');
            month = dataTime[0];
            year = dataTime[1];
            formatedTime = new Date(`${year}-${month}`);
            break;

        case 'dd-mm-yyyy':
            dataTime = time.split('-');
            day = dataTime[0];
            month = dataTime[1];
            year = dataTime[2];
            formatedTime = new Date(`${year}-${month}-${day}`);
            break;

        case 'hour dd-mm-yyyy':
            dataTime = time.split('-');
            day = dataTime[0];
            month = dataTime[1];
            year = dataTime[2];
            hour = subTime ? subTime : '00:00:00';
            formatedTime = new Date(`${year}-${month}-${day} ${hour}`);
            break;

        default:
            formatedTime = new Date(time);
    }

    if (!formatedTime) return null;
    return formatedTime;
}

export const convertTime = (ms) => {
    if (!ms) return '00:00:00';
    let hour = Math.floor(ms / (60 * 60 * 1000));
    let minute = Math.floor((ms - hour * 60 * 60 * 1000) / (60 * 1000));
    let second = Math.floor((ms - hour * 60 * 60 * 1000 - minute * 60 * 1000) / 1000);

    return `${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`}`;
}

export const compactString = (str, numberCompact = 32) => {
    const compactedString =
        str && str.length > numberCompact
            ? str.substr(0, numberCompact) + '...'
            : str;

    return compactedString;
};

export const nonAccentVietnamese = (str) => {
    if (str === null || str === undefined) return str;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}