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
export const compareTime = (time1, time2, type='dmy') => {
    switch(type) {
        case 'dmy': 
            let c1 = new Date(time1);
            let c2 = new Date(time2);
            if(!c1 || !c2) return 0; // Không thể so sánh do giá trị nhập vào lỗi

            let timer1 = new Date(c1.getFullYear(), c1.getMonth()+1, c1.getDate());
            let timer2 = new Date(c2.getFullYear(), c2.getMonth()+1, c2.getDate());

            if(timer1 <= timer2) return -1;
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