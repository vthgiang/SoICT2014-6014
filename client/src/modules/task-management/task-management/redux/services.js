import {handleResponse} from '../../../../helpers/HandleResponse';
import { AuthenticateHeader } from '../../../../config';//authHeader-cũ
import {
    TOKEN_SECRET
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';
export const taskManagementService = {
    getAll,
    getById,
    getAllTaskByRole,
    getResponsibleTaskByUser,
    getAccounatableTaskByUser,
    getConsultedTaskByUser,
    getInformedTaskByUser,
    getCreatorTaskByUser,
    addNewTask,
    editTask,
    deleteTaskById
};
// get all task
function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch('/tasks', requestOptions).then(handleResponse);
}

// get a task by id 
function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`/tasks/${id}`, requestOptions).then(handleResponse);
}

// get all task by Role
function getAllTaskByRole(id, role) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`/tasks/role/${id}/${role}`, requestOptions).then(handleResponse);

}
// get all task by Role
async function getResponsibleTaskByUser(unit, number, perpage, status, priority, specical, name) {//param -- user,
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    console.log('-------------------Responsible Info-----------------------', unit, user, perpage, status, priority, specical, name);

    const requestOptions = {//user = localStorage.getItem('id')
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`/tasks/user/task-responsible/${unit}/${user}/${number}/${perpage}/${status}/${priority}/${specical}/${name}`, requestOptions).then(handleResponse);
}
// get all task by Role
async function getAccounatableTaskByUser(unit, number, perpage, status, priority, specical, name) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`/tasks/user/task-accounatable/${unit}/${user}/${number}/${perpage}/${status}/${priority}/${specical}/${name}`, requestOptions).then(handleResponse);
}
// get all task by Role
async function getConsultedTaskByUser(unit, number, perpage, status, priority, specical, name) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`/tasks/user/task-consulted/${unit}/${user}/${number}/${perpage}/${status}/${priority}/${specical}/${name}`, requestOptions).then(handleResponse);
}
// get all task by Role
async function getInformedTaskByUser( unit, number, perpage, status, priority, specical, name) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`/tasks/user/task-informed/${unit}/${user}/${number}/${perpage}/${status}/${priority}/${specical}/${name}`, requestOptions).then(handleResponse);
}
// get all task by Role
async function getCreatorTaskByUser( unit, number, perpage, status, priority, specical, name) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`/tasks/user/task-creator/${unit}/${user}/${number}/${perpage}/${status}/${priority}/${specical}/${name}`, requestOptions).then(handleResponse);
}

// add new task
function addNewTask(newTask) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
    };

    return fetch(`/tasks/create`, requestOptions).then(handleResponse);
}

// edit a task
function editTask(id, newTask) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newTask)
    };

    return fetch(`/tasks/${id}`, requestOptions).then(handleResponse);
}

// delete a task
function deleteTaskById(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return fetch(`/tasks/${id}`, requestOptions).then(handleResponse);
}