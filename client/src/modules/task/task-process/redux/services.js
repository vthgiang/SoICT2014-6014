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
};


/**
 * Lấy tất cả xml diagram
 */
function getAllXmlDiagram( pageNumber, noResultsPerPage, name ) {
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
function getAllTaskProcess( pageNumber, noResultsPerPage, name ) {
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
 * Tạo công việc theo quy trình
 * @param {String} processId dữ liệu gửi lên body 
 * @param {String} diagram id của process
 */
function updateDiagram(processId, diagram) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/process/processes/${processId}/diagram`,
        method: 'PATCH',
        data: diagram,
    }, true, true, 'task.task_process');
}
