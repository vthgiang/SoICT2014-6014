exports.freshObject = (data) => {
    let obj = {};
    Object.keys(data).forEach(key => {
        if(data[key] !== 0 && !data[key] || data[key] === 'undefined' || data[key] === 'null') data[key] = undefined;
        else if(data[key] === 0) data[key] = 0;
        obj[key] = data[key];
    });
    return obj;
}