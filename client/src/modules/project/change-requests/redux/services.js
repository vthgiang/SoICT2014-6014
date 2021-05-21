import { sendRequest } from "../../../../helpers/requestHelper";

export const ChangeRequestServices = {
    createProjectChangeRequestAPI,
    updateStatusProjectChangeRequestAPI,
    getListProjectChangeRequestsAPI,
}

/**
 * tạo 1 change request cho project
 * @param {*} task công việc 
 */
function createProjectChangeRequestAPI(changeRequest) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/projects/project/change-requests`,
        method: 'POST',
        data: changeRequest,
    }, true, true, 'project');
}

/**
 * update status 1 change request cho project
 * @param {*} data
 */
function updateStatusProjectChangeRequestAPI(data) {
    if (!Array.isArray(data?.newChangeRequestsList)) {
        return sendRequest({
            url: `${process.env.REACT_APP_SERVER}/projects/project/change-requests/${data.changeRequestId}/${data.requestStatus}`,
            method: 'PATCH',
            params: {
                id: data.changeRequestId,
                status: data.requestStatus,
            },
        }, false, true, 'project');
    }
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/projects/project/change-requests/update-lists`,
        method: 'POST',
        data,
    }, true, true, 'project');
}

/**
 * lấy danh sách các change requests cho project
 */
function getListProjectChangeRequestsAPI(projectId) {
    // console.log('taskProject', projectId)
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/projects/project/change-requests/${projectId}`,
        method: 'GET',
        params: {
            projectId,
        },
    }, false, true, 'project');
}