import { handleResponse } from '../../../../helpers/handleResponse';
import axios from 'axios';
import { AuthenticateHeader } from '../../../../config';//authHeader-cũ
import {
    TOKEN_SECRET, LOCAL_SERVER_API
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';
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
    deleteTaskById,
    editStatusOfTask
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
async function getResponsibleTaskByUser(unit, number, perPage, status, priority, special, name) {//param -- user,
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;

    return sendRequest({//user = localStorage.getItem('id')
        url: `${LOCAL_SERVER_API}/tasks/user/task-responsible/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}
// get all task by Role
async function getAccountableTaskByUser(unit, number, perPage, status, priority, special, name) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/user/task-accountable/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}
// get all task by Role
async function getConsultedTaskByUser(unit, number, perPage, status, priority, special, name) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/user/task-consulted/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}
// get all task by Role
async function getInformedTaskByUser(unit, number, perPage, status, priority, special, name) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/user/task-informed/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}`,
        method: 'GET',
    }, false, true, 'task.task_management');
}
// get all task by Role
async function getCreatorTaskByUser(unit, number, perPage, status, priority, special, name) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/user/task-creator/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}`,
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

function editStatusOfTask(id, status) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasks/${id}`,
        method: 'PATCH',
        data: status,
    }, false, true, 'task.task_management');
}