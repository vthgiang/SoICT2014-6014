/**
 *  Kiểm tra xem date1 có trước date 2 không
 *  Nếu date1 và date2 trong cùng 1 ngày => trả về false (vì không trước) bằng cách set time date 1 nhiều hơn date 2
 */ 
export const isTimeZoneDateSmaller = (date1, date2) => { //Ngày bắt đầu trước ngày kết thúc
    let startTimeZoneDate = new Date(date1);
    let endTimeZoneDate = new Date(date2);
    startTimeZoneDate.setHours(11,0,1);
    endTimeZoneDate.setHours(10,0,1);
    if (startTimeZoneDate.getTime() < endTimeZoneDate.getTime()) {
        return true
    } else {
        return false
    }
}
/**
 * Trả về list day giữa 2 tham số dạng string (yy-mm-dd) time zone
 * Input: dạng time zone
 * @param {*} startDate 
 * @param {*} endDate 
 */
export const getListDateBetween = (startDate, endDate) => {
    let result = [];
    let start = new Date(startDate);
    let end = new Date(endDate);
    let k =0
    start.setHours(10,0,1)
    end.setHours(20,0,1)
    while (start.getTime() <= end.getTime()){
        result.push(start.toISOString());
        let newDate = start.getDate() + 1;
        start.setDate(newDate);
        k++;
        if (k>100) break;
    }
    return result;
}