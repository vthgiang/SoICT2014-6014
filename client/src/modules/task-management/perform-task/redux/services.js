import {handleResponse} from '../../../../helpers/HandleResponse';
import { AuthenticateHeader } from '../../../../config';
import {
    TOKEN_SECRET,LOCAL_SERVER_API
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';
// import { LOCAL_SERVER_API } from '../redux-constants/config';
export const performTaskService = {
    getLogTimerTask,
    getTimerStatusTask,
    startTimerTask,
    stopTimerTask,
    pauseTimerTask,
    continueTimerTask,
    addCommentTask,
    deleteCommentTask,
    editCommentTask,
    getCommentTask,
    createResultTask,
    editResultTask,
    addActionTask,
    getActionTask,
    editActionTask,
    deleteActionTask
};

// Create result task
function createResultTask(result) { 
    const requestOptions = {
        method: 'POST',
        headers: AuthenticateHeader(),
        body: JSON.stringify(result),  // result { result, _idtask}
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/result-task/create`, requestOptions).then(handleResponse);
}

// Create result task
function editResultTask(listResult, taskid) { 
    const requestOptions = {
        method: 'PUT',
        headers: AuthenticateHeader(),
        body: JSON.stringify(listResult),  // listResult = [...] (= task.results)
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/result-task/${taskid}`, requestOptions).then(handleResponse);
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
function getActionTask(task) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/action-task/${task}`, requestOptions).then(handleResponse);
    
}
// get all comment task
function getCommentTask(task) {
    const requestOptions = {
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/comment-task/${task}`, requestOptions).then(handleResponse);
}
// add comment task
function addCommentTask(newComment) {
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(newComment),
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/comment-task/create`, requestOptions).then(handleResponse);
}
function addActionTask(newAction){
    const requestOptions = {
        method :'POST',
        body: JSON.stringify(newAction),
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/action-task/create`, requestOptions).then(handleResponse);
}

// edit comment task
function editCommentTask(id, newComment) {
    const requestOptions = {
        method: 'PUT',
        body: JSON.stringify(newComment),
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/comment-task/${id}`, requestOptions).then(handleResponse);
}
function editActionTask(id,newAction) {
    const requestOptions = {
        method: 'PUT',
        body: JSON.stringify(newAction),
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/action-task/${id}`, requestOptions).then(handleResponse);
}

// delete comment task
function deleteCommentTask(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/comment-task/${id}`, requestOptions).then(handleResponse);
}

function deleteActionTask(id){
    const requestOptions = {
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return fetch(`${LOCAL_SERVER_API}/performtask/action-task/${id}`, requestOptions).then(handleResponse);
}
