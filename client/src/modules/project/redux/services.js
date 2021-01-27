import { sendRequest } from "../../../helpers/requestHelper";

export const ProjectServices = {
    getProjects,
    createProject,
    editProject,
    deleteProject,

}

function getProjects(params = undefined) {

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

function createProject(data) {
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

function editProject(id, data) {
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

function deleteProject(id) {
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