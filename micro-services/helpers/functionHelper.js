const uuid = require('uuid');
const { key } = require("./pri.json");
const crypto = require('crypto');

const freshObject = (data) => {
    let obj = {};
    Object.keys(data).forEach(key => {
        if (data[key] !== 0 && !data[key] || data[key] === 'undefined' || data[key] === 'null') data[key] = undefined;
        else if (data[key] === 0) data[key] = 0;
        obj[key] = data[key];
    });

    return obj;
}

const freshArray = (arr) => {
    let newArr = arr.reduce((ar, cur) => {
        if (cur && cur !== 'undefined' && cur !== 'null') {
            ar.push(cur);
        }

        return ar;
    }, []);

    return newArr;
}

const dateParse = (date) => {
    if (!date) return undefined;
    let check = Date.parse(date);
    if (!check) return undefined;

    return new Date(date);
}

const generateUniqueCode = (code = 'dx', type = 'v1') => {
    switch (type) {
        case 'v3':
            return code + uuid.v3();
        case 'v4':
            return code + uuid.v4();
        case 'v5':
            return code + uuid.v5();
        default:
            return code + uuid.v1();
    }
}

const decryptMessage = (encryptedMessage) => {
    if (!encryptedMessage) throw ['request_invalid'];
    const privateKey = key;
    const rsaPrivateKey = {
        key: privateKey,
        passphrase: '',
        padding: crypto.constants.RSA_PKCS1_PADDING,
    };

    const decryptedMessage = crypto.privateDecrypt(
        rsaPrivateKey,
        Buffer.from(encryptedMessage, 'base64'),
    );

    return decryptedMessage.toString('utf-8');
}

/** Hàm lọc url image trong mô tả công việc */
const filterImageUrlInString = (text) => {
    let imgRegex = /(<img src="upload\/private\/[^\s]+>)/g;
    let urlRegex = /(upload\/private\/[^\s]+).png/g;
    let imgs = text?.match(imgRegex);
    let urls = [];

    if (imgs?.length > 0) {
        imgs.map((item) => {
            let url = item.match(urlRegex);
            if (url?.[0]) {
                urls.push(url[0]);
            }
        });
    }

    return urls
}

// Hàm lọc ra các object khác trong 2 array of objects
const getDifferenceObjects = (array1, array2) => {
    return array1.filter(object1 => {
        return !array2.some(object2 => {
            return object1.attributeId.equals(object2.attributeId) && object1.value == object2.value;
        });
    });
}

const differenceAttributes = (array1, array2) => {
    var difference = [
        ...this.getDifferenceObjects(array1, array2),
        ...this.getDifferenceObjects(array2, array1)
    ];
    return difference
}

const arrayEquals = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val?.toString() === b[index]?.toString());
}

const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear() &&
        someDate.getMinutes() == today.getMinutes()
    // return someDate.getTime() == today.getTime()

}

const compareDate = (g1, g2) => {
    if (g1.getTime() < g2.getTime()) {
        return -1;
    }
    else if (g1.getTime() > g2.getTime()) {
        return 1;
    }
    else {
        return 0;
    }
}

module.exports = {
    freshObject,
    freshArray,
    dateParse,
    generateUniqueCode,
    decryptMessage,
    filterImageUrlInString,
    getDifferenceObjects,
    differenceAttributes,
    arrayEquals,
    isToday,
    compareDate
}