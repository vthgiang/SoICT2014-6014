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
        method: 'PATCH',
        data,
    }, true, true, 'project');
}

/**
 * lấy dữ liệu các yêu cầu thay đổi công việc
 * @param {*} data dữ liệu về công việc cần tìm
 * @param {*} status trạng thái của yêu cầu
 * @param {*} name tên yêu cầu
 * @param {*} creator người tạo yêu cầu
 * @param {*} creationTime thời điểm tạo yêu cầu
 * @param {*} affectedTask công việc bị ảnh hưởng
 * @param {*} projectId id của dự án
 * @param {*} page số trang
 * @param {*} perPage số bản ghi trên trang
 * @param {*} callId có lấy tất cả các yêu cầu hay không
 */
function getListProjectChangeRequestsAPI(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/projects/project/change-requests/${data?.projectId}`,
        method: 'GET',
        params: data
    }, false, true, 'project');
}