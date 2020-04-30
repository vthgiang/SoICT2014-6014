import {handleResponse} from '../../../../helpers/handleResponse';
// sua duong dan sau khi sang prj moi
import { AuthenticateHeader } from '../../../../config';
import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import {
    TOKEN_SECRET
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';


export const taskTemplateService = {
    getAll,
    getById,
    getAllTaskTemplateByRole,
    getAllTaskTemplateByUser,
    addNewTaskTemplate,
    editTaskTemplate,
    deleteTaskTemplateById
};
// get all task template
function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch('${LOCAL_SERVER_API}/tasktemplates', requestOptions).then(handleResponse);
}

// get a task template by id 
function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/tasktemplates/${id}`, requestOptions).then(handleResponse);
}

// get all task template by Role
function getAllTaskTemplateByRole(id) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/tasktemplates/role/${id}`, requestOptions).then(handleResponse);
}

// get all task template by User
// Để lấy tất cả kết quả: cho pageNumber=1, noResultsPerPage = 0
async function getAllTaskTemplateByUser(pageNumber, noResultsPerPage, arrayUnit, name="") {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;
    const data = {
        id:id,
        pageNumber: pageNumber,
        noResultsPerPage: noResultsPerPage,
        arrayUnit: arrayUnit,
        name: name};
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: AuthenticateHeader(),
    };
    return fetch(`${LOCAL_SERVER_API}/tasktemplates/user`, requestOptions).then(handleResponse);
}

// add new task template
 async function addNewTaskTemplate(newTaskTemplate) {
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;
    newTaskTemplate = {...newTaskTemplate, creator: id};
     const requestOptions = {
         method: 'POST',
         headers: AuthenticateHeader(),
         body: JSON.stringify(newTaskTemplate)
     };

     return fetch(`${LOCAL_SERVER_API}/tasktemplates/create`, requestOptions).then(handleResponse);
 }

// function addNewTaskTemplate(newTaskTemplate) {
//     const requestOptions = {
//         url: `${ LOCAL_SERVER_API }/tasktemplates/create`,
//         method: 'POST',
//         body: JSON.stringify(newTaskTemplate),
//         headers: { 'Content-Type': 'application/json' },
//     };

//     return axios(requestOptions).then(handleResponse);;
// }

// edit a task template
function editTaskTemplate(id, newTaskTemplate) {
    const requestOptions = {
        method: 'PATCH',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newTaskTemplate)
    };

    return fetch(`${LOCAL_SERVER_API}/tasktemplates/edit/${id}`, requestOptions).then(handleResponse);
}


// delete a task template
function deleteTaskTemplateById(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/tasktemplates/${id}`, requestOptions).then(handleResponse);
}