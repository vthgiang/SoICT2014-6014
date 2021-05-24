import { sendRequest } from "../../../../helpers/requestHelper";

export const ProjectServices = {
    getProjectsAPI,
    createProjectAPI,
    editProjectAPI,
    deleteProjectAPI,

    getSalaryMembersAPI,
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