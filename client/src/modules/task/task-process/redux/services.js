import { LOCAL_SERVER_API } from '../../../../env';
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
};


/**
 * Lấy tất cả xml diagram
 */
function getAllXmlDiagram() {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/taskprocess/diagrams`,
        method: 'GET',
    }, false, true, 'task.task_process');
}

/**
 * Lấy diagram theo id
 */
function getXmlDiagramById(diagramId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/taskprocess/diagrams/${diagramId}`,
        method: 'GET',
    }, false, true, 'task.task_process');
}

/**
 * Lưu xml diagram
 * @param {Object} data 
 */
function createXmlDiagram(data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/taskprocess/diagrams`,
        method: 'POST',
        data: data
    }, false, true, 'task.task_process');
}

/**
 * Sửa xml diagram
 * @param {Object} diagramId id của diagram 
 * @param {Object} data 
 */
function editXmlDiagram(diagramId,data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/taskprocess/diagrams/${diagramId}`,
        method: 'PATCH',
        data: data
    }, false, true, 'task.task_process');
}

/**
 * Sửa xml diagram
 * @param {Object} diagramId id của diagram 
 */
function deleteXmlDiagram(diagramId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/taskprocess/diagrams/${diagramId}`,
        method: 'DELETE',
    }, false, true, 'task.task_process');
}