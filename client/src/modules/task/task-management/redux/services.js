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
    getTaskEvaluations,
};

// get all task
function getAll() {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks`,
        method: 'GET',
    }, false, true, 'task.task_management');
}

// get a task by id 
function getById(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/${id}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}

// get all task by Role
function getAllTaskByRole(id, role) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/role/${id}/${role}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}

// get all task by Role
function getResponsibleTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate, startDateAfter, endDateBefore) {//param -- user,
    var user = getStorage("userId");

    return sendRequest({//user = localStorage.getItem('id')
        url: `${LOCAL_SERVER_API}/tasks/user/task-responsible/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}/${startDate}/${endDate}/${startDateAfter}/${endDateBefore}`,
        method: 'GET',

    }, false, true, 'task.task_management');
}

// get all task by Role
function getAccountableTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate) {
    var user = getStorage("userId");
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/user/task-accountable/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}/${startDate}/${endDate}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}

// get all task by Role
function getConsultedTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate) {
    var user = getStorage("userId");
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/user/task-consulted/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}/${startDate}/${endDate}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}

// get all task by Role
function getInformedTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate) {
    var user = getStorage("userId");
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/user/task-informed/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}/${startDate}/${endDate}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}

// get all task by Role
function getCreatorTaskByUser(unit, number, perPage, status, priority, special, name, startDate, endDate) {
    var user = getStorage("userId");
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/user/task-creator/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}/${startDate}/${endDate}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}

// add new task
function addNewTask(newTask) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/create`,
        method: 'POST',
        data: newTask
    }, true, true, 'task.task_management');
}

// edit a task
function editTask(id, newTask) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/${id}`,
        method: 'PUT',
        data: newTask
    }, true, true, 'task.task_management');
}

// delete a task
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

// Chỉnh sửa lưu kho của công việc
function editArchivedOfTask(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/archived/${id}`,
        method: 'PATCH',
    }, false, true, 'task.task_management');
}

function getSubTask(taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/sub-task/${taskId}`,
        method: 'GET'
    }, false, true, 'task.task_management');
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

function getTasksByUser() {
    var id = getStorage("userId")

    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks`,
        method: 'GET',
        params: { userId: id }
    }, false, true, 'task.task_management');
}


function getTaskEvaluations(data) {
    console.log('printData::::', data)
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/get-task/evaluations`,
        method: 'GET',
        params: data,
    }, false, true, 'task.task_management');
}

