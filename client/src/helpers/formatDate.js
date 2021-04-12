import dayjs from 'dayjs';
export const formatDate = (date, monthYear = false) => {
   if (date) {
       let d = new Date(date);
       if (monthYear) {
           return dayjs(d).format("MM-YYYY");
       } else {
            return dayjs(d).format("DD-MM-YYYY");
       }
    }
    return date;
}


export const formatFullDate = (date) => {
    let d = new Date(date);
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();

    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();

    if (month < 10)
        month = '0' + month;

    if (day < 10)
        day = '0' + day;

    if (hour < 10)
        hour = '0' + hour;

    if (minute < 10)
        minute = '0' + minute;

    if (second < 10)
        second = '0' + second;

    //hh:mm:ss dd/mm/yyyy
    const dateFormat = hour + ':' + minute + ':' + second + ' ' + day + '-' + month + '-' + year;
    return dateFormat;
}

export const formatToTimeZoneDate = (stringDate) => {
    let dateArray = stringDate.split("-");
    if (dateArray.length == 3) {
        let day = dateArray[0];
        let month = dateArray[1];
        let year = dateArray[2];
        return `${year}-${month}-${day}`
    }
    else if (dateArray.length == 2) {
        let month = dateArray[0];
        let year = dateArray[1];
        return `${year}-${month}`
    }
}

export const formatYearMonth = (date) => {
    let d = new Date(date);
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    if (month.length < 2 || month < 10) {
        month = '0' + month
    }

    return `${month}-${year}`
}

export const compareLtDate = (startDate, endDate) => { //Ngày bắt đầu trước hoặc cùng ngày kết thúc
    let startTimeZoneDate = new Date(formatToTimeZoneDate(startDate));
    let endTimeZoneDate = new Date(formatToTimeZoneDate(endDate));

    if (startTimeZoneDate.getTime() >= endTimeZoneDate.getTime()) {
        return {
            status: false,
            message: "Ngày bắt đầu phải trước hoặc cùng ngày kết thúc"
        }
    } else {
        return {
            status: true,
            message: undefined
        }
    }
}

export const compareLteDate = (startDate, endDate) => { //Ngày bắt đầu trước ngày kết thúc
    let startTimeZoneDate = new Date(formatToTimeZoneDate(startDate));
    let endTimeZoneDate = new Date(formatToTimeZoneDate(endDate));
    if (startTimeZoneDate.getTime() > endTimeZoneDate.getTime()) {
        return {
            status: false,
            message: "Ngày bắt đầu phải trước hoặc cùng ngày kết thúc"
        }
    } else {
        return {
            status: true,
            message: undefined
        }
    }
}

export const compareLteMonth = (startMonth, toMonth) => {
    let startTimeZoneDate = new Date(formatToTimeZoneDate(startMonth));
    let endTimeZoneDate = new Date(formatToTimeZoneDate(toMonth));
    if (startTimeZoneDate.getTime() > endTimeZoneDate.getTime()) {
        return {
            status: false,
            message: "Tháng bắt đầu phải trước hoặc cùng ngày kết thúc"
        }
    } else {
        return {
            status: true,
            message: undefined
        }
    }
}
