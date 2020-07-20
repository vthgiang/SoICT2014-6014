import {
    LOCAL_SERVER_API
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import { sendRequest } from '../../../../helpers/requestHelper';

export const taskManagementService = {
    getAll,
    getById,
    getAllTaskByRole,
    getResponsibleTaskByUser,
    getAccountableTaskByUser,
    getConsultedTaskByUser,
    getInformedTaskByUser,
    getCreatorTaskByUser,
    addNewTask,
    editTask,
    editArchivedOfTask,
    deleteTaskById,
    editStatusOfTask,
    getSubTask,

    editTaskByAccountableEmployees,
    editTaskByResponsibleEmployees,

    evaluateTaskByAccountableEmployees,
    evaluateTaskByConsultedEmployees,
    evaluateTaskByResponsibleEmployees,

    getTasksByUser,
};

/**
 * lấy tất cả công việc
 */
function getAll() {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks`,
        method: 'GET',
    }, false, true, 'task.task_management');
}

/**
 * lấy công việc theo id
 * @param {*} id id công việc
 */
function getById(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/${id}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}

/**
 * lấy tất cả công việc theo vai trò
 * @param {*} id id nhân viên
 * @param {*} role vai trò nhân viên
 */

function getAllTaskByRole(id, role) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/role/${id}/${role}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}


/**
 * lấy công việc theo người thực hiện
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getResponsibleTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore) {//param -- user,
    var user = getStorage("userId");
    
    return sendRequest({//user = localStorage.getItem('id')
        url: `${LOCAL_SERVER_API}/tasks/user/task-responsible/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}/${startDate}/${endDate}/${startDateAfter}/${endDateBefore}`,
        method: 'GET',
        
    }, false, true, 'task.task_management');
}


/**
 * lấy công việc theo người phê duyệt
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getAccountableTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate) {
    var user = getStorage("userId");
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/user/task-accountable/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}/${startDate}/${endDate}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}


/**
 * lấy công việc theo người hỗ trợ
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getConsultedTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate) {
    var user = getStorage("userId");
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/user/task-consulted/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}/${startDate}/${endDate}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}


/**
 * lấy công việc theo người quan sát
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getInformedTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate) {
    var user = getStorage("userId");
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/user/task-informed/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}/${startDate}/${endDate}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}


/**
 * lấy công việc theo người tạo
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getCreatorTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate) {
    var user = getStorage("userId");
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/user/task-creator/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}/${startDate}/${endDate}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}

/**
 * thêm công việc mới
 * @param {*} newTask công việc mới 
 */

function addNewTask(newTask) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/create`,
        method: 'POST',
        data: newTask
    }, true, true, 'task.task_management');
}

/**
 * chỉnh sửa công việc
 * @param {*} id id công việc
 * @param {*} newTask công việc mới sau khi sửa
 */

function editTask(id, newTask) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/${id}`,
        method: 'PUT',
        data: newTask
    }, true, true, 'task.task_management');
}

/**
 * xóa công việc theo id
 * @param {*} id id công việc 
 */

function deleteTaskById(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/${id}`,
        method: 'DELETE',
    }, true, true, 'task.task_management');
}

/**
 * edit status of task
 * @param {*} id id cua task
 * @param {*} status trang thai muon cap nhat
 */
function editStatusOfTask(id, status) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/${id}`,
        method: 'PATCH',
        data: status,
    }, false, true, 'task.task_management');
}

/**
 * chỉnh sửa trạng thái lưu kho
 * @param {*} id id công việc
 */

function editArchivedOfTask(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/archived/${id}`,
        method: 'PATCH',
    }, false, true, 'task.task_management');
}

/**
 * lấy công việc con
 * @param {*} taskId id công việc cha
 */

function getSubTask(taskId){
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/sub-task/${taskId}`,
        method: 'GET'
    },false,true,'task.task_management');
}

/**
 * edit Task By Responsible Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function editTaskByResponsibleEmployees(data, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/edit/task-responsible/${taskId}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'task.task_management');
}

/**
 * edit Task By Accountable Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function editTaskByAccountableEmployees(data, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/edit/task-accountable/${taskId}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'task.task_management');
}

/**
 * evaluate Task By Responsible Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByResponsibleEmployees(data, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/evaluate/task-responsible/${taskId}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'task.task_management');
}

/**
 * evaluate Task By Consulted Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByConsultedEmployees(data, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/evaluate/task-consulted/${taskId}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'task.task_management');
}

/**
 * evaluate Task By Accountable Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByAccountableEmployees(data, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/evaluate/task-accountable/${taskId}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'task.task_management');
}

/**
 * lấy công việc theo người dùng
 */

function getTasksByUser() {
    var id  = getStorage("userId")

    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks`,
        method: 'GET',
        params: {userId: id}
    }, false, true, 'task.task_management');
}


