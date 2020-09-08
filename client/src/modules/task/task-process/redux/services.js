import {
    getStorage
} from '../../../../config';
import { sendRequest } from '../../../../helpers/requestHelper';

export const TaskProcessService = {
    createXmlDiagram,
    getAllXmlDiagram,
    getXmlDiagramById,
    editXmlDiagram,
    deleteXmlDiagram,
    createTaskByProcess,
    getAllTaskProcess,
    updateDiagram,

    editProcessInfo,

    createComment,
    editComment,
    deleteComment,
    createChildComment,
    editChildComment,
    deleteChildComment,
    deleteFileComment,
    deleteFileChildComment
};


/**
 * Lấy tất cả xml diagram
 */
function getAllXmlDiagram(pageNumber, noResultsPerPage, name) {
    let userId = getStorage("userId");
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process`,
        method: 'GET',
        params: {
            userId: userId,
            pageNumber: pageNumber,
            noResultsPerPage: noResultsPerPage,
            name: name,
            type: "template"
        },
    }, false, true, 'task.task_process');
}

/**
 * Lấy tất cả task-process
 */
function getAllTaskProcess(pageNumber, noResultsPerPage, name) {
    let userId = getStorage("userId");
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process`,
        method: 'GET',
        params: {
            userId: userId,
            pageNumber: pageNumber,
            noResultsPerPage: noResultsPerPage,
            name: name,
            type: "task"
        },
    }, false, true, 'task.task_process');
}

/**
 * Lấy diagram theo id
 */
function getXmlDiagramById(diagramId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/diagrams/${diagramId}`,
        method: 'GET',
    }, false, true, 'task.task_process');
}

/**
 * Lưu xml diagram
 * @param {Object} data 
 */
function createXmlDiagram(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/diagrams`,
        method: 'POST',
        data: data
    }, true, true, 'task.task_process');
}

/**
 * Sửa xml diagram
 * @param {Object} diagramId id của diagram 
 * @param {Object} data 
 */
function editXmlDiagram(diagramId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/diagrams/${diagramId}`,
        method: 'PATCH',
        data: data
    }, true, true, 'task.task_process');
}

/**
 * Sửa xml diagram
 * @param {Object} diagramId id của diagram 
 */
function deleteXmlDiagram(diagramId, pageNumber, noResultsPerPage, name) {
    let userId = getStorage("userId");
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/diagrams/${diagramId}`,
        method: 'DELETE',
        params: {
            userId: userId,
            pageNumber: pageNumber,
            noResultsPerPage: noResultsPerPage,
            name: name,
        },
    }, false, true, 'task.task_process');
}

/**
 * Tạo công việc theo quy trình
 * @param {Object} data dữ liệu gửi lên body 
 * @param {String} processId id của process
 */
function createTaskByProcess(data, processId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/processes/${processId}/tasks/create`,
        method: 'POST',
        data: data,
    }, true, true, 'task.task_process');
}

/**
 * Chỉnh sửa diagram cho quy trình
 * @param {String} processId id của process
 * @param {String} diagram dữ liệu gửi lên body 
 */
function updateDiagram(processId, diagram) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/processes/${processId}/diagram`,
        method: 'PATCH',
        data: diagram,
    }, true, true, 'task.task_process');
}

/**
 * Tạo công việc theo quy trình
 * @param {String} processId id của process 
 * @param {Object} data dữ liệu cần chỉnh sửa
 */
function editProcessInfo(processId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/processes/${processId}`,
        method: 'PATCH',
        data: data,
    }, true, true, 'task.task_process');
}

/**
 * Tạo comment cho kpi set
 */
function createComment(taskId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/tasks/${taskId}/comments`,
        method: 'POST',
        data: data
    }, false, true)
}
/**
 * Tạo comment cho kpi set
 */
function createChildComment(taskId, commentId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/tasks/${taskId}/comments/${commentId}/child-comments`,
        method: 'POST',
        data: data
    }, false, true)
}

/**
 * Edit comment cho kpi set
 */
function editComment(taskId, commentId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/tasks/${taskId}/comments/${commentId}`,
        method: 'PATCH',
        data: data
    }, false, true)
}
/**
 * Delete comment
 */
function deleteComment(taskId, commentId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/tasks/${taskId}/comments/${commentId}`,
        method: 'DELETE',
    }, false, true)
}
/**
 * Edit comment of comment
 */
function editChildComment(taskId, commentId, childCommentId, data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/tasks/${taskId}/comments/${commentId}/child-comments/${childCommentId}`,
        method: 'PATCH',
        data: data
    }, false, true)
}
/**
 * Delete comment of comment
 */
function deleteChildComment(taskId, commentId, childCommentId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/tasks/${taskId}/comments/${commentId}/child-comments/${childCommentId}`,
        method: 'DELETE',
    }, false, true)
}

/**
 * Delete file of comment
 */
function deleteFileComment(fileId, commentId, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/tasks/${taskId}}/comments/${commentId}/files/${fileId}`,
        method: 'DELETE',
    }, false, true)
}
/**
 * Delete file child comment
 */
function deleteFileChildComment(fileId, childCommentId, commentId, taskId) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/tasks/${taskId}/comments/${commentId}/child-comments/${childCommentId}/files/${fileId}`,
        method: 'DELETE',
    }, false, true)
}