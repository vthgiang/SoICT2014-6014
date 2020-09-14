const EmployeeService = require('../human-resource/profile/profile.service');
const TaskManagementService = require('../task/task-management/task.service');

/**
 * Hàm tiện ích cấu hình thời gian gọi Api
 * @param {*} date : ngày gọi Api
 * @param {*} hours : giờ gọi APi
 * @param {*} repetitionTime : thời gian gọi lại function(tính bằng ms)
 */
setTimeCallApi = async (date = false, hours = false, repetitionTime, func) => {
    await setInterval(async () => {
        let dateNow = new Date();
        if (date) {
            if (hours) {
                if (dateNow.getDay() === date && dateNow.getHours() === hours) {
                    await func();
                }
            } else {
                if (dateNow.getDay() === date) {
                    await func();
                }
            }
        } else {
            if (hours) {
                if (dateNow.getHours() === hours) {
                    await func();
                }
            } else {
                await func();
            }
        }
    }, repetitionTime);
}

exports.chedulesCallApi = () => {
    // Function thông báo sinh nhật vào mỗi 8h hàng ngày
    setTimeCallApi(false, 8, 59 * 60 * 1000, EmployeeService.createNotificationForEmployeesHaveBrithdayCurrent);
    
    // Function thông báo sắp hết hợp đồng lao động
    setTimeCallApi(false, false, 23*60*60*1000, EmployeeService.createNotificationEndOfContract);

    // Function gửi email nhắc nhở công việc
    // setTimeCallApi(false, 8, 23*60*60*1000, TaskManagementService.sendEmailCheckTaskLastMonth);
}