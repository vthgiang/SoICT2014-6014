const { Log } = require('../../../models').schema;

exports.getLogState = async () => {
    let log =  await Log.findOne({ name: 'log' }); 
    if (log !== null) {
        return log.status;
    } 

    return false; //trả về trạng thái ghi log TRUE or FALSE
}

exports.toggleLogState = async () => {
    let log =  await Log.findOne({ name: 'log' }); 
    if (log !== null) {
        log.status = !log.status; //chuyển đổi lại trạng thái ghi log
        log.save();
        isLog = !isLog;
        return true; //thực hiện thành công
    }
    
    return false; //thực hiện thất bại
}