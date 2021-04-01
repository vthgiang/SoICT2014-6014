import { ProjectServices } from './services';
import { ProjectConstants } from './constants';

export const ProjectActions = {
    getProjectsDispatch,
    createProjectDispatch,
    editProjectDispatch,
    deleteProjectDispatch,
}

function getProjectsDispatch(data = undefined) {
    return (dispatch) => {
        dispatch({
            type: ProjectConstants.GET_PROJECTS_REQUEST,
            calledId: data.calledId ? data.calledId : "",
        });
        ProjectServices.getProjectsAPI(data)
            .then((res) => {
                dispatch({
                    type: ProjectConstants.GET_PROJECTS_SUCCESS,
                    payload: res.data.content,
                    calledId: data.calledId,
                });
            })
            .catch((err) => {
                dispatch({ type: ProjectConstants.GET_PROJECTS_FAILE });
            });
    };
};

function createProjectDispatch(data) {
    return (dispatch) => {
        dispatch({
            type: ProjectConstants.CREATE_PROJECTS_REQUEST,
        });
        ProjectServices.createProjectAPI(data)
            .then((res) => {
                dispatch({
                    type: ProjectConstants.CREATE_PROJECTS_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: ProjectConstants.CREATE_PROJECTS_FAILE });
            });
    };
};
function editProjectDispatch(id, data) {
    return (dispatch) => {
        dispatch({ type: ProjectConstants.EDIT_PROJECTS_REQUEST });
        ProjectServices.editProjectAPI(id, data)
            .then((res) => {
                dispatch({
                    type: ProjectConstants.EDIT_PROJECTS_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({
                    type: ProjectConstants.EDIT_PROJECTS_FAILE,
                });
            });
    };
}


function deleteProjectDispatch(id) {
    return (dispatch) => {
        dispatch({ type: ProjectConstants.DELETE_PROJECTS_REQUEST });
        ProjectServices.deleteProjectAPI(id)
            .then((res) => {
                dispatch({
                    type: ProjectConstants.DELETE_PROJECTS_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: ProjectConstants.DELETE_PROJECTS_FAILE });
            });
    };
}

