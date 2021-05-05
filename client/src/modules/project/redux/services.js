import { sendRequest } from "../../../helpers/requestHelper";

export const ProjectServices = {
    getProjectsAPI,
    createProjectAPI,
    editProjectAPI,
    deleteProjectAPI,

    getListTasksEvalDispatchAPI,
    createProjectTasksFromCPM,
    getSalaryMembersAPI,
}

function getProjectsAPI(params = undefined) {
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
    }, true, true, 'project');
}