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
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/${task}`,
        method: 'GET',
    },false, 'task.task_perform');
};

// get current status task
async function getTimerStatusTask(task) { //function getTimerStatusTask(task, user)
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    return  sendRequest =({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/currentTimer/${task}/${user}`,
        method: 'GET',
    },false,'task.task_perform');
};
// start timer task
function startTimerTask(newTimer) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/start-timer`,
        method : 'POST',
        data : newTimer,
    },false,'task.task_perform');
}

// stop timer task
function stopTimerTask(id, newTimer) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/stop-timer/${id}`,
        method : 'PUT',
        data : newTimer
    },false,'task.task_perform');
}

// pause timer task
function pauseTimerTask(id, newTimer) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/pause-timer/${id}`,
        method :'PUT',
        data : newTimer
    },false,'task.task_perform');
}

// continue timer task
function continueTimerTask(id, newTimer) {
    return sendRequest({
        url : `${LOCAL_SERVER_API}/performtask/log-timer/continue-timer/${id}`,
        method : 'PUT',
        data : newTimer
    },false,'task.task_perform')
}

//getall Action task
function getTaskAction(task) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-action/${task}`,
        method : 'GET'
    },false,'task.task_perform');  
};
// add comment task
function addActionComment(newComment) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/action-comment/create`,
        method: 'POST',
        data : newComment
    },true,'task.task_perform');
}
function addTaskAction(newAction){
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-action/create`,
        method : 'POST',
        data : newAction
    },true,'task.task_perform');
}

// edit comment task
function editActionComment(id, newComment) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/action-comment/${id}`,
        method:'PUT',
        data : newComment
    },true,'task.task_perform');
}
function editTaskAction(id,newAction) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-action/${id}`,
        method:'PUT',
        data : newAction
    },true,'task.task_perform')
}

// delete comment task
function deleteActionComment(id,task) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/action-comment/${task}/${id}`,
        method: 'DELETE'
    },true,'task.task_perform')
}

function deleteTaskAction(id,task){
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-action/${task}/${id}`,
        method:'DELETE'
    },true,'task.task_perform');
}
