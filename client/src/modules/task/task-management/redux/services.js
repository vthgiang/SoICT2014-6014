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
    getTasksByUser,
    getTaskEvaluations,
};

/**
 * lấy công việc theo id
 * @param {*} taskId id công việc
 */
function getById(taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/task/tasks/${taskId}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}

/**
 * lấy tất cả công việc
 */
function getAll() {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/task/tasks`,
        method: 'GET',
        params: {
            type: 'all',
        }
    }, false, true, 'task.task_management');
}


/**
 * lấy tất cả công việc theo vai trò
 * @param {*} userId id nhân viên
 * @param {*} role vai trò nhân viên
 */

function getAllTaskByRole(userId, roleId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/task/tasks`,
        method: 'GET',
        params: {
            type: 'get_all_task_created_by_user',
            userId: userId,
            roleId: roleId,
        }
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

    return sendRequest({
        url: `${LOCAL_SERVER_API}/task/tasks`,
        method: 'GET',
        params: {
            type: 'responsible',
            unit: unit,
            user: user,
            number: number,
            perPage: perPage,
            status: status,
            priority: priority,
            special: special,
            name: name,
            startDate: startDate,
            endDate: endDate,
            startDateAfter: startDateAfter,
            endDateBefore: endDateBefore,
        }
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
        url: `${LOCAL_SERVER_API}/task/tasks`,
        method: 'GET',
        params: {
            type: 'accountable',
            unit: unit,
            user: user,
            number: number,
            perPage: perPage,
            status: status,
            priority: priority,
            special: special,
            name: name,
            startDate: startDate,
            endDate: endDate,
        }
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
        url: `${LOCAL_SERVER_API}/task/tasks`,
        method: 'GET',
        params: {
            type: 'consulted',
            unit: unit,
            user: user,
            number: number,
            perPage: perPage,
            status: status,
            priority: priority,
            special: special,
            name: name,
            startDate: startDate,
            endDate: endDate,
        }
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
        url: `${LOCAL_SERVER_API}/task/tasks`,
        method: 'GET',
        params: {
            type: 'informed',
            unit: unit,
            user: user,
            number: number,
            perPage: perPage,
            status: status,
            priority: priority,
            special: special,
            name: name,
            startDate: startDate,
            endDate: endDate,
        }
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
        url: `${LOCAL_SERVER_API}/task/tasks`,
        method: 'GET',
        params: {
            type: 'creator',
            unit: unit,
            user: user,
            number: number,
            perPage: perPage,
            status: status,
            priority: priority,
            special: special,
            name: name,
            startDate: startDate,
            endDate: endDate,
        }
    }, false, true, 'task.task_management');
}

/**
 * thêm công việc mới
 * @param {*} newTask công việc mới 
 */

function addNewTask(newTask) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/task/tasks`,
        method: 'POST',
        data: newTask
    }, true, true, 'task.task_management');
}

/**
 * chỉnh sửa công việc
 * @param {*} id id công việc
 * @param {*} newTask công việc mới sau khi sửa
 */

function editTask(taskId, newTask) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/task/tasks/${taskId}`,
        method: 'PUT',
        data: newTask
    }, true, true, 'task.task_management');
}

/**
 * xóa công việc theo id
 * @param {*} id id công việc 
 */

function deleteTaskById(taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/task/tasks/${taskId}`,
        method: 'DELETE',
    }, true, true, 'task.task_management');
}

/**
 * edit status of task
 * @param {*} taskId id cua task
 * @param {*} status trang thai muon cap nhat
 */
function editStatusOfTask(taskId, status) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/task/tasks/${taskId}`,
        method: 'PATCH',
        data: status,
    }, false, true, 'task.task_management');
}

/**
 * chỉnh sửa trạng thái lưu kho
 * @param {*} taskId id công việc
 */

function editArchivedOfTask(taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/task/tasks/${taskId}/archived`,
        method: 'PATCH',
    }, false, true, 'task.task_management');
}

/**
 * lấy công việc con
 * @param {*} taskId id công việc cha
 */

function getSubTask(taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/task/tasks/${taskId}/sub-task`,
        method: 'GET'
    }, false, true, 'task.task_management');
}

/**
 * lấy công việc theo người dùng
 */
function getTasksByUser() {
    var id = getStorage("userId")

    return sendRequest({
        url: `${LOCAL_SERVER_API}/task/tasks`,
        method: 'GET',
        params: { userId: id, type: 'all' }
    }, false, true, 'task.task_management');
}


function getTaskEvaluations(data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/task/task-evaluations`,
        method: 'GET',
        params: data,
    }, false, true, 'task.task_management');
}

