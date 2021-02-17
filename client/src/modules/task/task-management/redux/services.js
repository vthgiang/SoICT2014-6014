import {
    getStorage
} from '../../../../config';
import { sendRequest } from '../../../../helpers/requestHelper';

export const taskManagementService = {
    getAll,
    getAllTaskByRole,
    getResponsibleTaskByUser,
    getAccountableTaskByUser,
    getConsultedTaskByUser,
    getInformedTaskByUser,
    getCreatorTaskByUser,
    addNewTask,
    editTask,
    deleteTaskById,
    getSubTask,
    getTasksByUser,
    getTaskEvaluations,
    getTaskInOrganizationUnitByMonth,
    getPaginateTasksByUser,
    getPaginateTasks,
    getPaginatedTasksByOrganizationalUnit,
    getTaskAnalysOfUser,
    getTaskByPriorityInOrganizationUnit,
    getTimeSheetOfUser,
    getAllUserTimeSheet
};

/**
 * lấy tất cả công việc
 */
function getAll() {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks`,
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
        url: `${process.env.REACT_APP_SERVER}/task/tasks`,
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

function getResponsibleTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime) {//param -- user,
    var user = getStorage("userId");

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks`,
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
            aPeriodOfTime: aPeriodOfTime
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

function getAccountableTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime) {
    var user = getStorage("userId");
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks`,
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
            startDateAfter: startDateAfter,
            endDateBefore: endDateBefore,
            aPeriodOfTime: aPeriodOfTime
        }
    }, false, true, 'task.task_management');
}


/**
 * lấy công việc theo người tư vấn
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

function getConsultedTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime) {
    var user = getStorage("userId");
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks`,
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
            startDateAfter: startDateAfter,
            endDateBefore: endDateBefore,
            aPeriodOfTime: aPeriodOfTime
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

function getInformedTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime) {
    var user = getStorage("userId");
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks`,
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
            startDateAfter: startDateAfter,
            endDateBefore: endDateBefore,
            aPeriodOfTime: aPeriodOfTime
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

function getCreatorTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime) {
    var user = getStorage("userId");
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks`,
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
            startDateAfter: startDateAfter,
            endDateBefore: endDateBefore,
            aPeriodOfTime: aPeriodOfTime
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

function getPaginateTasksByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore, aPeriodOfTime) {
    var user = getStorage("userId");
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks`,
        method: 'GET',
        params: {
            type: 'all_role',
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
            aPeriodOfTime: aPeriodOfTime
        }
    }, false, true, 'task.task_management');
}

/**
 * Tìm kiếm công việc đơn vị theo 1 roleId
 * @param {*} roleId 
 * @param {*} number 
 * @param {*} perPage 
 * @param {*} status 
 * @param {*} priority 
 * @param {*} special 
 * @param {*} name 
 * @param {*} startDate 
 * @param {*} endDate 
 * @param {*} startDateAfter 
 * @param {*} endDateBefore 
 * @param {*} aPeriodOfTime 
 */
function getPaginatedTasksByOrganizationalUnit(unit, number, perPage, status, priority, special, name, startDate, endDate, isAssigned,responsibleEmployees,accountableEmployees, creatorEmployees) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks`,
        method: 'GET',
        params: {
            type: 'paginated_task_by_unit',
            unit: unit,
            number: number,
            perPage: perPage,
            status: status,
            priority: priority,
            special: special,
            name: name,
            startDate: startDate,
            endDate: endDate,
            isAssigned: isAssigned,
            responsibleEmployees,
            accountableEmployees,
            creatorEmployees,
        }
    }, false, true, 'task.task_management');
}


/**
 * lấy công việc
 * @param {*} unit đơn vị
 * @param {*} role vai trò
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getPaginateTasks(role, unit, number, perPage, status, priority, special, name, startDate, endDate,responsibleEmployees,accountableEmployees, creatorEmployees, startDateAfter, endDateBefore, aPeriodOfTime) {
    var user = getStorage("userId");

    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks`,
        method: 'GET',
        params: {
            type: 'choose_multi_role',
            unit: unit,
            user: user,
            role: role,
            number: number,
            perPage: perPage,
            status: status,
            priority: priority,
            special: special,
            name: name,
            startDate: startDate,
            endDate: endDate,
            responsibleEmployees: responsibleEmployees,
            accountableEmployees: accountableEmployees,
            creatorEmployees: creatorEmployees,
            startDateAfter: startDateAfter,
            endDateBefore: endDateBefore,
            aPeriodOfTime: aPeriodOfTime
        }
    }, false, true, 'task.task_management');
}

/**
 * thêm công việc mới
 * @param {*} newTask công việc mới 
 */

function addNewTask(newTask) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks`,
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
        url: `${process.env.REACT_APP_SERVER}/task/tasks/${taskId}`,
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
        url: `${process.env.REACT_APP_SERVER}/task/tasks/${taskId}`,
        method: 'DELETE',
    }, true, true, 'task.task_management');
}

/**
 * lấy công việc liên quan
 * @param {*} taskId id công việc liên quan
 */
function getSubTask(taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks/${taskId}/sub-tasks`,
        method: 'GET'
    }, false, true, 'task.task_management');
}

/**
 * lấy công việc theo người dùng
 */
function getTasksByUser(data) {
    var id = getStorage("userId")
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks`,
        method: 'GET',
        params: {
            userId: id,
            type: 'all',
            organizationUnitId: data.organizationUnitId,
            data: data.type
        }
    }, false, true, 'task.task_management');
}


function getTaskEvaluations(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/task-evaluations`,
        method: 'GET',
        params: data,
    }, false, true, 'task.task_management');
}

function getTaskInOrganizationUnitByMonth(organizationUnitId, startDateAfter, endDateBefore) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks`,
        method: 'GET',
        params: {
            type: 'task_in_unit',
            organizationUnitId: organizationUnitId,
            startDateAfter: startDateAfter,
            endDateBefore: endDateBefore,
        }
    }, false, true, 'task.task_management');
}

function getTaskAnalysOfUser(userId, type){
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/analys/user/${userId}`,
        method: 'GET',
        params: { type }
    }, false, true, 'task.task_management');
}

function getTaskByPriorityInOrganizationUnit(organizationUnitId, date) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks`,
        method: 'GET',
        params: {
            type: 'priority',
            organizationUnitId: organizationUnitId,
            date: date,
        }
    }, false, true, 'task.task_management');
}

function getTimeSheetOfUser(userId, month, year) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/time-sheet`,
        method: 'GET',
        params: { userId, month, year }
    }, false, true, 'task.task_management');
}


function getAllUserTimeSheet(month, year) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/time-sheet/all`,
        method: 'GET',
        params: { month, year }
    }, false, true, 'task.task_management');
}