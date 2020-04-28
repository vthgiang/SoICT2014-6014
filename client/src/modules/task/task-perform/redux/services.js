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
import {sendRequest} from '../../../../helpers/requestHelper'
// import { LOCAL_SERVER_API } from '../redux-constants/config';
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
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/performtask/result-task/create`,
        method: 'POST',
        headers: AuthenticateHeader(),
        data: result // result { result, _idtask}
    };
    return axios(requestOptions);
}

// Create result task
function editResultTask(listResult, taskid) { 
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/performtask/result-task/${taskid}`,
        method: 'PUT',
        headers: AuthenticateHeader(),
        data: listResult // listResult = [...] (= task.results)
    };
    return axios(requestOptions);
}

// get all log timer task
function getLogTimerTask(task) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/${task}`,
        method: 'GET',
    },false);
};

// get current status task
async function getTimerStatusTask(task) { //function getTimerStatusTask(task, user)
    const token = getStorage();
    const verified = await jwt.verify(token, TOKEN_SECRET);
    var user = verified._id;
    return  sendRequest =({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/currentTimer/${task}/${user}`,
        method: 'GET',
    },false);
};
// start timer task
function startTimerTask(newTimer) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/start-timer`,
        method : 'POST',
        data : newTimer,
    },false);
}

// stop timer task
function stopTimerTask(id, newTimer) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/stop-timer/${id}`,
        method : 'PUT',
        data : newTimer
    },false);
}

// pause timer task
function pauseTimerTask(id, newTimer) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/pause-timer/${id}`,
        method :'PUT',
        data : newTimer
    },false);
}

// continue timer task
function continueTimerTask(id, newTimer) {
    return sendRequest({
        url : `${LOCAL_SERVER_API}/performtask/log-timer/continue-timer/${id}`,
        method : 'PUT',
        data : newTimer
    },false)
}

//getall Action task
function getTaskAction(task) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-action/${task}`,
        method : 'GET'
    },false);  
};
// get all comment task
function getActionComment(task) {
    return sendRequest({
        url : `${LOCAL_SERVER_API}/performtask/action-comment/${task}`,
        method : 'GET'
    },false);
}
// add comment task
function addActionComment(newComment) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/action-comment/create`,
        method: 'POST',
        data : newComment
    },false);
}
function addTaskAction(newAction){
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-action/create`,
        method : 'POST',
        data : newAction
    },false);
}

// edit comment task
function editActionComment(id, newComment) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/action-comment/${id}`,
        method:'PUT',
        data : newComment
    },false);
}
function editTaskAction(id,newAction) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-action/${id}`,
        method:'PUT',
        data : newAction
    },false)
}

// delete comment task
function deleteActionComment(id) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/action-comment/${id}`,
        method: 'DELETE'
    },false)
}

function deleteTaskAction(id){
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-action/${id}`,
        method:'DELETE'
    },false);
}
