export const formatDate = (date) => {
    let d = new Date(date);
    const day = d.getUTCDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;

    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
}

export const formatFullDate = (date) => {
    let d = new Date(date);
    const hour = date.getHours() + 7;
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const day = d.getUTCDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;

    if (day.length < 2)
        day = '0' + day;

    if (hour.length < 2)
        hour = '0' + hour;

    if (minute.length < 2)
        minute = '0' + minute;

    if (second.length < 2)
        second = '0' + second;

    //hh:mm:ss dd/mm/yyyy
    const dateFormat = hour + ':' + minute + ':' + second + ' ' + day + '/' + month + '/' + year;
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
    console.log(d);
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    if (month.length < 2 || month < 10) {
        month = '0' + month
    }

    return `${month}-${year}`
}
