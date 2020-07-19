import { LOCAL_SERVER_API } from '../../../../env';
import {
    getStorage
} from '../../../../config';
import { sendRequest } from '../../../../helpers/requestHelper';


export const taskTemplateService = {
    getAll,
    getById,
    getAllTaskTemplateByRole,
    getAllTaskTemplateByUser,
    addNewTaskTemplate,
    editTaskTemplate,
    deleteTaskTemplateById,    
    importTaskTemplate,
};
// get all task template
function getAll() {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasktemplates`,
        method: 'GET',
    }, false, true, 'task.task_template');
}

// get a task template by id 
function getById(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasktemplates/${id}`,
        method: 'GET',
    }, false, true, 'task.task_template');
}

// get all task template by Role
function getAllTaskTemplateByRole(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasktemplates/role/${id}`,
        method: 'GET',
    }, false, true, 'task.task_template');
}

// get all task template by User
// Để lấy tất cả kết quả: cho pageNumber=1, noResultsPerPage = 0
function getAllTaskTemplateByUser(pageNumber, noResultsPerPage, arrayUnit, name="") {
    var id = getStorage("userId");
    const data = {
        id:id,
        pageNumber: pageNumber,
        noResultsPerPage: noResultsPerPage,
        arrayUnit: arrayUnit,
        name: name
    };

    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasktemplates/user`,
        method: 'POST',
        data: data
    }, false, true, 'task.task_template');
}

// add new task template
 function addNewTaskTemplate(newTaskTemplate) {
    var id = getStorage("userId");
    newTaskTemplate = {...newTaskTemplate, creator: id};

    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasktemplates/create`,
        method: 'POST',
        data: newTaskTemplate
    }, true, true, 'task.task_template');
 }


function editTaskTemplate(id, newTaskTemplate) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasktemplates/edit/${id}`,
        method: 'PATCH',
        data: newTaskTemplate
    }, true, true, 'task.task_template');
}


// delete a task template
function deleteTaskTemplateById(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasktemplates/${id}`,
        method: 'DELETE',
    }, true, true, 'task.task_template');
}

// import a task Task Template 

function importTaskTemplate(data){
    console.log('reer', data);
    return sendRequest({
        url: `${LOCAL_SERVER_API}/tasktemplates/importTaskTemplate`,
        method: 'POST',
        data: data,
    },true, true, 'task.task_template');
}