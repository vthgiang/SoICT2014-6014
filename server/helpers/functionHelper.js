const uuid = require('uuid');
const { key } = require("./pri.json");
const crypto = require('crypto');

exports.freshObject = (data) => {
    let obj = {};
    Object.keys(data).forEach(key => {
        if (data[key] !== 0 && !data[key] || data[key] === 'undefined' || data[key] === 'null') data[key] = undefined;
        else if (data[key] === 0) data[key] = 0;
        obj[key] = data[key];
    });

    return obj;
}

exports.freshArray = (arr) => {
    let newArr = arr.reduce((ar, cur) => {
        if (cur && cur !== 'undefined' && cur !== 'null') {
            ar.push(cur);
        }

        return ar;
    }, []);

    return newArr;
}

exports.freshObject = (data) => {
    let obj = {};
    Object.keys(data).forEach(key => {
        if (data[key] !== 0 && !data[key] || data[key] === 'undefined' || data[key] === 'null') data[key] = undefined;
        else if (data[key] === 0) data[key] = 0;
        obj[key] = data[key];
    });
    return obj;
}

exports.dateParse = (date) => {
    if (!date) return undefined;
    let check = Date.parse(date);
    if (!check) return undefined;

    return new Date(date);
}

exports.generateUniqueCode = (code = 'dx', type = 'v1') => {
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

exports.decryptMessage = (encryptedMessage) => {
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