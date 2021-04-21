export const isTimeZoneDateSmaller = (date1, date2) => { //Ngày bắt đầu trước ngày kết thúc
    let startTimeZoneDate = new Date(date1);
    let endTimeZoneDate = new Date(date2);
    if (startTimeZoneDate.getTime() < endTimeZoneDate.getTime()) {
        return true
    } else {
        return false
    }
}