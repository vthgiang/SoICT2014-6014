import {handleResponse} from '../../../../helpers/HandleResponse';
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
    getAccounatableTaskByUser,
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
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/tasks`, requestOptions).then(handleResponse);
}

// get a task by id 
function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/tasks/${id}`, requestOptions).then(handleResponse);
}

// get all task by Role
function getAllTaskByRole(id, role) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/tasks/role/${id}/${role}`, requestOptions).then(handleResponse);

}
// get all task by Role
async function getResponsibleTaskByUser(unit, number, perpage, status, priority, specical, name) {//param -- user,
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;

    const requestOptions = {//user = localStorage.getItem('id')
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/tasks/user/task-responsible/${unit}/${user}/${number}/${perpage}/${status}/${priority}/${specical}/${name}`, requestOptions).then(handleResponse);
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

    return fetch(`${LOCAL_SERVER_API}/tasks/user/task-accounatable/${unit}/${user}/${number}/${perpage}/${status}/${priority}/${specical}/${name}`, requestOptions).then(handleResponse);
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

    return fetch(`${LOCAL_SERVER_API}/tasks/user/task-consulted/${unit}/${user}/${number}/${perpage}/${status}/${priority}/${specical}/${name}`, requestOptions).then(handleResponse);
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

    return fetch(`${LOCAL_SERVER_API}/tasks/user/task-informed/${unit}/${user}/${number}/${perpage}/${status}/${priority}/${specical}/${name}`, requestOptions).then(handleResponse);
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

    return fetch(`${LOCAL_SERVER_API}/tasks/user/task-creator/${unit}/${user}/${number}/${perpage}/${status}/${priority}/${specical}/${name}`, requestOptions).then(handleResponse);
}

// add new task
function addNewTask(newTask) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newTask)
    };

    return fetch(`${LOCAL_SERVER_API}/tasks/create`, requestOptions).then(handleResponse);
}

// edit a task
function editTask(id, newTask) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newTask)
    };

    return fetch(`${LOCAL_SERVER_API}/tasks/${id}`, requestOptions).then(handleResponse);
}

// delete a task
function deleteTaskById(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/tasks/${id}`, requestOptions).then(handleResponse);
}

/**
 * exports.editStatusOfTask = async (taskID, status) => {
 *   var task = await Task.findByIdAndUpdate(taskID, { $set: {status: status }}, { new: true } );
 *   // console.log("----------------------editStatusOfTask-------------------------",task);
 *   return task;
 *   }
 * function edit(id, data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user/${id}`,
        method: 'PATCH',
        data: data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}
 */

// function editStatusOfTask(id, status){
//     const requestOptions = {
//         url: `${ LOCAL_SERVER_API }/tasks/${id}`,
//         method: 'PATCH',
//         data: status,
//         headers: AuthenticateHeader()
//     }

//     return axios(requestOptions);
// }
// edit status of task
function editStatusOfTask(id, status){
    const requestOptions = {
        method: 'PATCH',
        headers: AuthenticateHeader(),
        body: JSON.stringify(status)
    };

    return fetch(`${LOCAL_SERVER_API}/tasks/${id}`, requestOptions).then(handleResponse);
}