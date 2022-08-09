import { sendRequest } from "../../../../helpers/requestHelper";

export const ProjectTemplateServices = {
    getProjectTemplateAPI,
    createProjectTemplateAPI,
    editProjectTemplateAPI,
    deleteProjectTemplateAPI,

    getSalaryMembersOfProjectTemplateAPI,
    createProjectByTemplateDispatch,
}

function getProjectTemplateAPI(params = undefined) {
    // console.log('params project', params)
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/project-templates/project-template`,
            method: "GET",
            params,
        },
        false,
        true,
        "project_template"
    );
};

function createProjectTemplateAPI(data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/project-templates/project-template`,
            method: "POST",
            data,
        },
        true,
        true,
        "project_template"
    );
};

function editProjectTemplateAPI(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/project-templates/project-template/${id}`,
            method: "PATCH",
            data,
            // params: { option },
        },
        true,
        true,
        "project_template"
    );
}

function createProjectByTemplateDispatch(id, data) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/project-templates/project-template/${id}/project/create-cpm`,
            method: "POST",
            data,
        },
        true,
        true,
        "project_template"
    );
}

function deleteProjectTemplateAPI(id) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/project-templates/project-template/${id}`,
            method: "DELETE",
        },
        true,
        true,
        "project_template"
    );
}

/**
 * lấy lương của danh sách thành viên hiện tại
 * @param {*} data list thành viên 
 */
function getSalaryMembersOfProjectTemplateAPI(data) {
    return sendRequest({
        url: `${process.env.REACT_APP_SERVER}/project-templates/project-template/salary-members`,
        method: 'POST',
        data,
    }, false, true, 'project');
}