import { sendRequest } from "../../../helpers/requestHelper";

export const ProjectServices = {
    getProjectsAPI,
    createProjectAPI,
    editProjectAPI,
    deleteProjectAPI,
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