import { handleResponse } from '../../../../helpers/handleResponse';
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
    addActionComment,
    deleteActionComment,
    editActionComment,
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
    uploadFile,
    addTaskLog,
    deleteFileAction,
    deleteFileCommentOfAction,
    deleteFileTaskComment,
    deleteFileChildTaskComment,
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


/**
 * lấy lịch sử bấm giờ
 * @param {*} taskId  id của task
 */
function getTimesheetLogs(taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/log-timer`,
        method: 'GET',
    }, false, false, 'task.task_perform');
};

/**
 * Lấy lịch sử bấm giờ ?????
 */ 
function getTimerStatusTask() {
    var userId = getStorage("userId");
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/currentTimer/user/${userId}`,
        method: 'GET',
    }, false, false, 'task.task_perform');
};

/**
 * Bắt đầu bấm giờ
 * @param {*} newTimer dữ liệu gửi lên
 */
function startTimerTask(newTimer) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/start-timer`,
        method: 'POST',
        data: newTimer,
    }, false, true, 'task.task_perform');
}

/**
 * Dừng bấm giờ
 * @param {*} newTimer dữ liệu gửi lên
 */
function stopTimerTask(newTimer) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/log-timer/stop-timer`,
        method: 'POST',
        data: newTimer
    }, false, true, 'task.task_perform');
}


/**
 * Tạo mới bình luận của hoạt động
 * @param {*} taskId id của task
 * @param {*} actionId id của hoạt động cha
 * @param {*} newComment nội dung bình luận
 */
function addActionComment(taskId, actionId, newComment) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-actions/${actionId}/comments`,
        method: 'POST',
        data: newComment
    }, false, true, 'task.task_perform');
}

/**
 * Thêm mới hoạt động
 * @param {*} taskId id của task
 * @param {*} newAction nội dung hành động
 */
function addTaskAction(taskId, newAction) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-actions`,
        method: 'POST',
        data: newAction
    }, false, true, 'task.task_perform');
}

/**
 * Sửa bình luận cho hoạt động
 * @param {*} taskId id của task
 * @param {*} actionId id của hoạt động cha
 * @param {*} commentId id của bình luận cần sửa
 * @param {*} newComment nội dung chỉnh sửa
 */
function editActionComment(taskId, actionId, commentId, newComment) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-actions/${actionId}/comments/${commentId}`,
        method: 'PATCH',
        data: newComment
    }, false, true, 'task.task_perform');
}

/**
 * Chỉnh sửa hoạt động
 * @param {*} actionId id của hoạt động
 * @param {*} newAction dữ liệu
 * @param {*} taskId id của task
 */
function editTaskAction(actionId, newAction, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-actions/${actionId}`,
        method: 'PATCH',
        data: newAction,
    }, false, true, 'task.task_perform')
}
/**
 * Xóa bình luận của hoạt động
 * @param {*} taskId id của task
 * @param {*} actionId id của hoạt động cha
 * @param {*} commentId id của bình luận cần xóa
 */
function deleteActionComment(taskId, actionId, commentId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-actions/${actionId}/comments/${commentId}/delete`,
        method: 'PATCH'
    }, false, true, 'task.task_perform')
}

/**
 * Xóa hoạt động
 * @param {*} actionId id của hoat động cần xóa
 * @param {*} taskId id của task
 */
function deleteTaskAction(actionId, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-actions/${actionId}/delete`,
        method: 'PATCH'
    }, false, true, 'task.task_perform');
}

/**
 * Tạo bình luận công việc
 * @param {*} taskId id của task cần tạo
 * @param {*} newComment nội dung bình luận
 */
function createTaskComment(taskId, newComment) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-comments`,
        method: 'POST',
        data: newComment
    }, false, true, 'task.task_perform')
}

/**
 * Sửa bình luận công việc
 * @param {*} taskId id của task
 * @param {*} commentId id của bình luận cần sửa
 * @param {*} newComment nội dung sửa
 */
function editTaskComment(taskId, commentId, newComment) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-comments/${commentId}`,
        method: 'PATCH',
        data: newComment
    }, false, true, 'task.task_perform')
}

/**
 * Xóa bình luận công việc
 * @param {*} commentId id của bình luận cần xóa
 * @param {*} taskId id của task chứa bình luận
 */
function deleteTaskComment(commentId, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-comments/${commentId}/delete`,
        method: 'PATCH'
    }, false, true, 'task.task_perform')
}

/**
 * Tạo bình luận cho bình luận
 * @param {*} commentId id của bình luận cha
 * @param {*} taskId id của task
 * @param {*} newComment nội dung bình luận
 */
function createCommentOfTaskComment(commentId, taskId, newComment) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-comments/${commentId}/comments`,
        method: 'POST',
        data: newComment
    }, false, true, 'task.task_perform')
}

/**
 * Sửa bình luận của bình luận
 * @param {*} commentId id của bình luận cần xóa        
 * @param {*} taskId id của task
 * @param {*} newComment bình luận mới
 */
function editCommentOfTaskComment(commentId, taskId, newComment) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-comments/comments/${commentId}`,
        method: 'PATCH',
        data: newComment
    }, false, true, 'task.task_perform')
}

/**
 * Xóa bình luận của bình luận
 * @param {*} commentId 
 * @param {*} taskId 
 */
function deleteCommentOfTaskComment(commentId, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-comments/comments/${commentId}/delete`,
        method: 'PATCH',
    }, false, true, 'task.task_perform')
}

/**
 * Đánh giá hoạt động
 * @param {*} actionId id của action
 * @param {*} evaluation điểm rating người khác chấm
 */
function evaluationAction(actionId, evaluation) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/task-actions/${actionId}`,
        method: 'PATCH',
        data: evaluation,
    }, false, true, 'task.task_perform')
}

/**
 * Xác nhận hành động
 * @param {*} actionId id của action cần xác nhận
 * @param {*} idUser id của người xác nhận
 * @param {*} taskId id của task
 */
function confirmAction(actionId, idUser, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-actions`,
        method: 'GET',
        params: { actionId: actionId, idUser: idUser }
    }, false, true, 'task.task_perform');
};


/**
 * Upload file
 * @param {*} taskId: id của task chứa file cần xóa 
 * @param {*} data: dữ liệu cần upload 
 */
function uploadFile(taskId, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/upload-files`,
        method: 'POST',
        data: data
    }, false, true, 'task.task_perform');
};

/**
 * Xóa tài liệu của hoạt động
 * @param {*} fileId: id của file cần xóa
 * @param {*} actionId: id của hoạt động chứa file cần xóa
 * @param {*} taskId: id của task chứa file cần xóa
 * @param {*} type 
 */
function deleteFileAction(fileId, actionId, taskId, type) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-actions/${actionId}/files/${fileId}`,
        method: 'PATCH',
    }, false, true, 'task.task_perform');
};

/**
 * Xóa tài liệu của bình luận hoạt động
 * @param {*} fileId: id của file cần xóa
 * @param {*} actionId: id của hoạt động chứa file cần xóa
 * @param {*} taskId: id của task chứa file cần xóa
 * @param {*} type 
 */
function deleteFileCommentOfAction(fileId, actionId, taskId, type) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-actions/${actionId}/comments/files/${fileId}`,
        method: 'PATCH',

    }, false, true, 'task.task_perform');
};

/**
 * Xóa tài liệu của trao đổi
 * @param {*} fileId: id của file cần xóa
 * @param {*} commentId: id của bình luận chứa file cần xóa
 * @param {*} taskId: id của task chứa file cần xóa
 * @param {*} type 
 */
function deleteFileTaskComment(fileId, commentId, taskId, type) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-comments/${commentId}/files/${fileId}`,
        method: 'PATCH'
    }, false, true, 'task.task_perform');
};

/**
 * Xóa tài liệu của bình luận
 * @param {*} fileId: id của file cần xóa
 * @param {*} commentId: id của bình luận chứa file cần xóa
 * @param {*} taskId: id của task chứa file cần xóa
 * @param {*} type: 
 */
function deleteFileChildTaskComment(fileId, commentId, taskId, type) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/task-comments/${commentId}/comments/files/${fileId}`,
        method: 'PATCH',
    }, false, true, 'task.task_perform');
}

/**
 *  Thêm nhật kí cho cộng việc
 */
function addTaskLog(log) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/logs`,
        method: 'POST',
        data: log
    }, false, false, 'task.task_perform');
};

// Hàm thêm nhật ký cho một công việc
function getTaskLog(taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/logs`,
        method: 'GET',
    }, false, false, 'task.task_perform');
};

/**
 * edit Task By Responsible Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function editTaskByResponsibleEmployees(data, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}`,
        method: 'PATCH',
        data: data,
        params: {
            role: 'responsible',
        }
    }, true, true, 'task.task_management');
}

/**
 * edit Task By Accountable Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function editTaskByAccountableEmployees(data, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}`,
        method: 'PATCH',
        data: data,
        params: {
            role: 'accountable',
        }
    }, true, true, 'task.task_management');
}

/**
 * evaluate Task By Responsible Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByResponsibleEmployees(data, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/evaluate`,
        method: 'PATCH',
        data: data,
        params: {
            role: 'responsible',
        }
    }, true, true, 'task.task_management');
}

/**
 * evaluate Task By Consulted Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByConsultedEmployees(data, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/evaluate`,
        method: 'PATCH',
        data: data,
        params: {
            role: 'consulted',
        }
    }, true, true, 'task.task_management');
}

/**
 * evaluate Task By Accountable Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByAccountableEmployees(data, taskId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/performtask/tasks/${taskId}/evaluate`,
        method: 'PATCH',
        data: data,
        params: {
            role: 'accountable',
        }
    }, true, true, 'task.task_management');
}

