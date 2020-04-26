import {handleResponse} from '../../../../helpers/handleResponse';
import axios from 'axios';
import { AuthenticateHeader } from '../../../../config';//authHeader-cũ
import {
    TOKEN_SECRET, LOCAL_SERVER_API
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
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/tasks`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    // return fetch(`${LOCAL_SERVER_API}/tasks`, requestOptions).then(handleResponse);
    return axios(requestOptions);
}

// get a task by id 
function getById(id) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/tasks/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    // return fetch(`${LOCAL_SERVER_API}/tasks/${id}`, requestOptions).then(handleResponse);
    return axios(requestOptions);
}

// get all task by Role
function getAllTaskByRole(id, role) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/tasks/role/${id}/${role}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    // return fetch(`${LOCAL_SERVER_API}/tasks/role/${id}/${role}`, requestOptions).then(handleResponse);
    return axios(requestOptions);

}
// get all task by Role
async function getResponsibleTaskByUser(unit, number, perPage, status, priority, special, name) {//param -- user,
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;

    const requestOptions = {//user = localStorage.getItem('id')
        url: `${LOCAL_SERVER_API}/tasks/user/task-responsible/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    // return fetch(`${LOCAL_SERVER_API}/tasks/user/task-responsible/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}`, requestOptions).then(handleResponse);
    return axios(requestOptions);
}
// get all task by Role
async function getAccountableTaskByUser(unit, number, perPage, status, priority, special, name) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/tasks/user/task-accountable/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    // return fetch(`${LOCAL_SERVER_API}/tasks/user/task-accountable/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}`, requestOptions).then(handleResponse);
    return axios(requestOptions);
}
// get all task by Role
async function getConsultedTaskByUser(unit, number, perPage, status, priority, special, name) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/tasks/user/task-consulted/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    // return fetch(`${LOCAL_SERVER_API}/tasks/user/task-consulted/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}`, requestOptions).then(handleResponse);
    return axios(requestOptions);
}
// get all task by Role
async function getInformedTaskByUser( unit, number, perPage, status, priority, special, name) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/tasks/user/task-informed/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    // return fetch(`${LOCAL_SERVER_API}/tasks/user/task-informed/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}`, requestOptions).then(handleResponse);
    return axios(requestOptions);
}
// get all task by Role
async function getCreatorTaskByUser( unit, number, perPage, status, priority, special, name) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/tasks/user/task-creator/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    // return fetch(`${LOCAL_SERVER_API}/tasks/user/task-creator/${unit}/${user}/${number}/${perPage}/${status}/${priority}/${special}/${name}`, requestOptions).then(handleResponse);
    return axios(requestOptions);
}

// add new task
function addNewTask(newTask) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/tasks/create`,
        method: 'POST',
        headers: AuthenticateHeader(),
        data: newTask
        // body: JSON.stringify(newTask)
    };

    // return fetch(`${LOCAL_SERVER_API}/tasks/create`, requestOptions).then(handleResponse);
    return axios(requestOptions);
}

// edit a task
function editTask(id, newTask) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/tasks/${id}`,
        method: 'PUT',
        headers: AuthenticateHeader(),
        data: newTask
        // body: JSON.stringify(newTask)
    };

    // return fetch(`${LOCAL_SERVER_API}/tasks/${id}`, requestOptions).then(handleResponse);
    return axios(requestOptions);
}

// delete a task
function deleteTaskById(id) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/tasks/${id}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    // return fetch(`${LOCAL_SERVER_API}/tasks/${id}`, requestOptions).then(handleResponse);
    return axios(requestOptions);
}

function editStatusOfTask(id, status){
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/tasks/${id}`,
        method: 'PATCH',
        data: status,
        headers: AuthenticateHeader()
    }

    return axios(requestOptions);
}