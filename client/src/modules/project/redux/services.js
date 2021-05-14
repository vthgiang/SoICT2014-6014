import { sendRequest } from "../../../helpers/requestHelper";

export const ProjectServices = {
    getProjectsAPI,
    createProjectAPI,
    editProjectAPI,
    deleteProjectAPI,

    getListTasksEvalDispatchAPI,
    createProjectTasksFromCPM,
    getSalaryMembersAPI,
    createProjectChangeRequestAPI,
    updateStatusProjectChangeRequestAPI,
    getListProjectChangeRequestsAPI,
}

function getProjectsAPI(params = undefined) {
    // console.log('params project', params)
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project`,
            method: "GET",
            params,
        },
        false,
        true,
        "project"
    );
};

function createProjectAPI(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project`,
            method: "POST",
            data,
        },
        true,
        true,
        "project"
    );
};

function editProjectAPI(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project/${id}`,
            method: "PATCH",
            data,
            // params: { option },
        },
        true,
        true,
        "project"
    );
}

function deleteProjectAPI(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project/${id}`,
            method: "DELETE",
        },
        true,
        true,
        "project"
    );
}

function getListTasksEvalDispatchAPI(id, evalMonth) {
    console.log('evalMonth', evalMonth)
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/projects/project/${id}/getListTasksEval/${evalMonth}`,
            method: "GET",
            params: {
                id,
                evalMonth,
            },
        },
        false,
        true,
        "project"
    );
}

/**
 * thêm list công việc mới cho dự án theo CPM
 * @param {*} tasksList list công việc mới 
 */
function createProjectTasksFromCPM(tasksList) {
    console.log('------', tasksList)
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/task/tasks/project-tasks/cpm`,
        method: 'POST',
        data: tasksList
    }, true, true, 'task.task_management');
}

/**
 * lấy lương của danh sách thành viên hiện tại
 * @param {*} data list thành viên 
 */
function getSalaryMembersAPI(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/projects/project/salary-members`,
        method: 'POST',
        data,
    }, false, true, 'project');
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