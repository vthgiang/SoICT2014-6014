import {handleResponse} from '../../../../helpers/handleResponse';
import { AuthenticateHeader } from '../../../../config';
import {
    LOCAL_SERVER_API
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import { sendRequest } from '../../../../helpers/requestHelper';

export const performTaskService = {
    getTimesheetLogs,
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
    editTaskAction,
    deleteTaskAction,
    createTaskComment,
    editTaskComment,
    deleteTaskComment,
    createCommentOfTaskComment,
    editCommentOfTaskComment,
    deleteCommentOfTaskComment,
    evaluationAction,
    confirmAction,
    downloadFile,
    uploadFile,
    addTaskLog,
    deleteFile,
    getTaskLog,

    editTaskByAccountableEmployees,
    editTaskByResponsibleEmployees,

    evaluateTaskByAccountableEmployees,
    evaluateTaskByConsultedEmployees,
    evaluateTaskByResponsibleEmployees,
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
    }, true, true, 'task.task_perform'); // them vao dong 1098 trong file language vn nhe Thanh
}

// Create result task
function editResultTask(listResult, taskid) { 
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/result-task/${taskid}`,
        method: 'PUT',
        data: listResult
    }, false, true, 'task.task_perform');
}

// get all log timer task
function getTimesheetLogs(task) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/${task}`,
        method: 'GET',
    }, false, false, 'task.task_perform');
};

// get current status task
function getTimerStatusTask() { //function getTimerStatusTask(task, user)
    var user = getStorage("userId");
    return  sendRequest ({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/currentTimer/${user}`,
        method: 'GET',
    }, false, false, 'task.task_perform');
};
// start timer task
function startTimerTask(newTimer) {        
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/start-timer`,
        method : 'POST',
        data : newTimer,
    }, false, true, 'task.task_perform');
}

// stop timer task
function stopTimerTask(newTimer) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/stop-timer`,
        method : 'POST',
        data : newTimer
    }, false, true, 'task.task_perform');
}

// pause timer task
function pauseTimerTask(id, newTimer) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/pause-timer/${id}`,
        method :'PUT',
        data : newTimer
    }, false, true, 'task.task_perform');
}

// continue timer task
function continueTimerTask(id, newTimer) {
    return sendRequest({
        url : `${LOCAL_SERVER_API}/performtask/log-timer/continue-timer/${id}`,
        method : 'PUT',
        data : newTimer
    }, false, true, 'task.task_perform')
}

// add comment task
function addActionComment(newComment) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/action-comment/create`,
        method: 'POST',
        data : newComment
    }, false, true, 'task.task_perform');
}
function addTaskAction(newAction){ 
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-action/create`,
        method : 'POST',
        data : newAction
    }, false, true, 'task.task_perform');
}
// edit comment task
function editActionComment(id, newComment) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/action-comment/${id}`,
        method:'PUT',
        data : newComment
    }, false, true, 'task.task_perform');
}
function editTaskAction(id,newAction) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-action`,
        method:'PUT',
        data : newAction,
        params: {edit:id}
    }, false, true, 'task.task_perform')
}

// delete comment task
function deleteActionComment(id,task) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/action-comment/${task}/${id}`,
        method: 'DELETE'
    }, false, true, 'task.task_perform')
}

function deleteTaskAction(id,task){
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-action/${task}/${id}`,
        method:'DELETE'
    }, false, true, 'task.task_perform');
}
function createTaskComment(newComment){
    return sendRequest({
        url : `${LOCAL_SERVER_API}/performtask/task-comment/create`,
        method : 'POST',
        data: newComment
    },false, true, 'task.task_perform')
}
function editTaskComment(id,newComment){
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/task-comment/${id}`,
        method: 'PUT',
        data: newComment
    },false, true, 'task.task_perform')
}
function deleteTaskComment(id,task){
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-comment/${task}/${id}`,
        method: 'DELETE'
    },false, true, 'task.task_perform')
}
function createCommentOfTaskComment(newComment){
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-comment/comment/create`,
        method: 'POST',
        data: newComment
    },false, true, 'task.task_perform')
}
function editCommentOfTaskComment(id,newComment){
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-comment/comment/${id}`,
        method : 'PUT',
        data: newComment
    },false, true, 'task.task_perform')
}
function deleteCommentOfTaskComment(id,task){
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-comment/comment/${id}/${task}`,
        method : 'DELETE',
    },false, true, 'task.task_perform')
}
function evaluationAction(id,evaluation){
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-action`,
        method : 'PUT',
        data: evaluation,
        params: {evaluation:id}
    },false,true,'task.task_perform')
}

//getall Action task
function confirmAction(id,idUser) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-action/${id}/${idUser}`,
        method : 'GET',
    }, false, true, 'task.task_perform');  
};
function downloadFile(path) {  
    return sendRequest({
        url: `${LOCAL_SERVER_API}/auth/download-file/`,
        method: 'GET',
        responseType: 'blob',
        params:{path:path}
    }, false, false, 'task.task_perform');
}
function uploadFile(task,data) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/${task}`,
        method : 'POST',
        data : data
    }, false, true, 'task.task_perform');  
};
function deleteFile(id,actionId) {
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/task-action/files/${id}/${actionId}`,
        method : 'DELETE'
    }, false, true, 'task.task_perform');  
};
// Hàm thêm nhật ký cho một công việc
function addTaskLog(log) {    
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/logs/history`,
        method : 'POST',
        data : log
    }, false, false, 'task.task_perform');
};

// Hàm thêm nhật ký cho một công việc
function getTaskLog(id) {    
    return sendRequest({
        url:`${LOCAL_SERVER_API}/performtask/logs/${id}`,
        method : 'GET',
    }, false, false, 'task.task_perform');
};

/**
 * edit Task By Responsible Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function editTaskByResponsibleEmployees(data, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/edit/task-responsible/${taskId}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'task.task_management');
}

/**
 * edit Task By Accountable Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function editTaskByAccountableEmployees(data, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/edit/task-accountable/${taskId}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'task.task_management');
}

/**
 * evaluate Task By Responsible Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByResponsibleEmployees(data, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/evaluate/task-responsible/${taskId}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'task.task_management');
}

/**
 * evaluate Task By Consulted Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByConsultedEmployees(data, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/evaluate/task-consulted/${taskId}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'task.task_management');
}

/**
 * evaluate Task By Accountable Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByAccountableEmployees(data, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/evaluate/task-accountable/${taskId}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'task.task_management');
}

