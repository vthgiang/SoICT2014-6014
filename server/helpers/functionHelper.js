const uuid = require('uuid');

exports.freshObject = (data) => {
    let obj = {};
    Object.keys(data).forEach(key => {
        if(data[key] !== 0 && !data[key] || data[key] === 'undefined' || data[key] === 'null') data[key] = undefined;
        else if(data[key] === 0) data[key] = 0;
        obj[key] = data[key];
    });
    return obj;
}

exports.dateParse = (date) => {
    if(!date) return undefined;
    let check = Date.parse(date);
    if(!check) return undefined;

    return new Date(date);
}

exports.generateUniqueCode = (code='dx', type='v1') => {
    switch(type){
        case 'v3': 
            return code+uuid.v3();
        case 'v4': 
            return code+uuid.v4();
        case 'v5':    
            return code+uuid.v5();
        default: 
            return code+uuid.v1();
    }
}