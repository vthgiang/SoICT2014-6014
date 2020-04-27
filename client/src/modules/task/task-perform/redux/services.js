import {handleResponse} from '../../../../helpers/handleResponse';
import { AuthenticateHeader } from '../../../../config';
import {
    TOKEN_SECRET,LOCAL_SERVER_API
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { sendRequest } from '../../../../helpers/requestHelper';

export const performTaskService = {
    getLogTimerTask,
    getTimerStatusTask,
    startTimerTask,
    stopTimerTask,
    pauseTimerTask,
    continueTimerTask,
    addActionComment,
    deleteActionComment,
    editActionComment,
    getActionComment,
    createResultTask,
    editResultTask,
    addTaskAction,
    getTaskAction,
    editTaskAction,
    deleteTaskAction
};
/**
 * // example for axios
 * 
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

// Create result task
function createResultTask(result) { 
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/result-task/create`,
        method: 'POST',
        data: result
    }, true, 'task.task_perform'); // them vao dong 1098 trong file language vn nhe Thanh
}

// Create result task
function editResultTask(listResult, taskid) { 
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/result-task/${taskid}`,
        method: 'PUT',
        data: listResult
    }, false, 'task.task_perform');
}

// get all log timer task
function getLogTimerTask(task) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/log-timer/${task}`, requestOptions).then(handleResponse);
}

// get current status task
async function getTimerStatusTask(task) { //function getTimerStatusTask(task, user)
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/log-timer/currentTimer/${task}/${user}`, requestOptions).then(handleResponse);
}

// start timer task
function startTimerTask(newTimer) {
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newTimer),
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/log-timer/start-timer`, requestOptions).then(handleResponse);
}
// stop timer task
function stopTimerTask(id, newTimer) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newTimer),
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/log-timer/stop-timer/${id}`, requestOptions).then(handleResponse);
}

// pause timer task
function pauseTimerTask(id, newTimer) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newTimer)
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/log-timer/pause-timer/${id}`, requestOptions).then(handleResponse);
}

// continue timer task
function continueTimerTask(id, newTimer) {
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(newTimer)
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/log-timer/continue-timer/${id}`, requestOptions).then(handleResponse);
}
//getall Action task
function getTaskAction(task) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/task-action/${task}`, requestOptions).then(handleResponse);
    
}
// get all comment task
function getActionComment(task) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/action-comment/${task}`, requestOptions).then(handleResponse);
}
// add comment task
function addActionComment(newComment) {
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(newComment),
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/action-comment/create`, requestOptions).then(handleResponse);
}
function addTaskAction(newAction){
    const requestOptions = {
        method :'POST',
        body: JSON.stringify(newAction),
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/task-action/create`, requestOptions).then(handleResponse);
}

// edit comment task
function editActionComment(id, newComment) {
    const requestOptions = {
        method: 'PUT',
        body: JSON.stringify(newComment),
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/action-comment/${id}`, requestOptions).then(handleResponse);
}
function editTaskAction(id,newAction) {
    const requestOptions = {
        method: 'PUT',
        body: JSON.stringify(newAction),
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/task-action/${id}`, requestOptions).then(handleResponse);
}

// delete comment task
function deleteActionComment(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/action-comment/${id}`, requestOptions).then(handleResponse);
}

function deleteTaskAction(id){
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/task-action/${id}`, requestOptions).then(handleResponse);
}
