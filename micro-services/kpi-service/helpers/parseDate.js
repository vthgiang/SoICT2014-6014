exports.parseDate = (dateFormat, date) => {
    if(dateFormat === 'dd-mm-yy') {
        const dateArr = date.split("-");
        return `${dateArr[1]}/${dateArr[0]}/${dateArr[2]}`
    }
}