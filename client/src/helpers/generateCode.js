const padLeft = (number, base, chr) => {
    var len = (String(base || 10).length - String(number).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + number : number;
}

const hash = function (s) {
    var a = 1, c = 0, h, o;
    if (s) {
        a = 0;
        for (h = s.length - 1; h >= 0; h--) {
            o = s.charCodeAt(h);
            a = (a << 6 & 268435455) + o + (o << 14);
            c = a & 266338304;
            a = c !== 0 ? a ^ c >> 21 : a;
        }
    }
    return String(a).substr(0, 6);
};

export const generateCode = (code) => {
    const date = new Date();
    const year = String(date.getFullYear());
    const month = padLeft(date.getMonth() + 1, 10, '0');
    const day = padLeft(date.getDate(), 10, '0');
    const hour = padLeft(date.getHours(), 10, '0');
    const minute = padLeft(date.getMinutes(), 10, '0');
    const second = padLeft(date.getSeconds(), 10, '0');
    const milisecond = padLeft(date.getMilliseconds(), 10, '0');
    const stringCode = code + year + month + day + "." + hash("" + hour + minute + second + milisecond);
    return stringCode;
}