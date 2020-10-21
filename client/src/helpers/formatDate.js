export const formatDate = (date) => {
    let d = new Date(date);
    console.log(date);
    const day = d.getUTCDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    //
    const dateFormat = day + '/' + month + '/' + year;
    return dateFormat; 
}

export const formatFullDate = (date) => {
    let d = new Date(date);
    console.log(date);
    const hour = date.getHours();
    const minute= date.getMinutes();
    const second = date.getSeconds();

    const day = d.getUTCDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    //ss:mm:hh dd/mm/yyyy
    const dateFormat = second + ':' + minute + ':' + hour + ' ' + day + '/' + month + '/' + year;
    return dateFormat; 
}
