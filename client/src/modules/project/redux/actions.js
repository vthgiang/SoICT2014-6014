import { ProjectServices } from './services';
import { ProjectConstants } from './constants';

export const ProjectActions = {
    getProjectsDispatch,
    createProjectDispatch,
    editProjectDispatch,
    deleteProjectDispatch,

    getListTasksEvalDispatch,
    createProjectTasksFromCPMDispatch,
    getSalaryMembersDispatch,
    createProjectChangeRequestDispatch,
    updateStatusProjectChangeRequestDispatch,
    getListProjectChangeRequestsDispatch,
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
            calledId: data.calledId ? data.calledId : "",
        });
        ProjectServices.createProjectAPI(data)
            .then((res) => {
                dispatch({
                    type: ProjectConstants.CREATE_PROJECTS_SUCCESS,
                    payload: res.data.content,
                    calledId: data.calledId,
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
                console.log('res.data.content', res.data.content)
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

function getListTasksEvalDispatch(id, evalMonth) {
    return (dispatch) => {
        dispatch({ type: ProjectConstants.GET_LIST_TASKS_EVAL });
        ProjectServices.getListTasksEvalDispatchAPI(id, evalMonth)
            .then((res) => {
                dispatch({
                    type: ProjectConstants.GET_LIST_TASKS_EVAL_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: ProjectConstants.GET_LIST_TASKS_EVAL_FAILE });
            });
    };
}

function createProjectTasksFromCPMDispatch(tasksList) {
    return (dispatch) => {
        dispatch({ type: ProjectConstants.ADD_PROJECT_TASKS_CPM });
        ProjectServices.createProjectTasksFromCPM(tasksList)
            .then((res) => {
                dispatch({
                    type: ProjectConstants.ADD_PROJECT_TASKS_CPM_SUCCESS,
                    // payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: ProjectConstants.ADD_PROJECT_TASKS_CPM_FAILE });
            });
    };
}

function getSalaryMembersDispatch(data) {
    return (dispatch) => {
        dispatch({ type: ProjectConstants.GET_SALARY_MEMBER });
        ProjectServices.getSalaryMembersAPI(data)
            .then((res) => {
                dispatch({
                    type: ProjectConstants.GET_SALARY_MEMBER_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: ProjectConstants.GET_SALARY_MEMBER_FAILE });
            });
    };
}

function createProjectChangeRequestDispatch(changeRequest) {
    return (dispatch) => {
        dispatch({ type: ProjectConstants.CREATE_PROJECT_CHANGE_REQUEST });
        ProjectServices.createProjectChangeRequestAPI(changeRequest)
            .then((res) => {
                dispatch({
                    type: ProjectConstants.CREATE_PROJECT_CHANGE_REQUEST_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: ProjectConstants.CREATE_PROJECT_CHANGE_REQUEST_FAILE });
            });
    };
}

function getListProjectChangeRequestsDispatch(data) {
    console.log('data', data)
    return (dispatch) => {
        dispatch({ type: ProjectConstants.GET_LIST_PROJECT_CHANGE_REQUESTS });
        ProjectServices.getListProjectChangeRequestsAPI(data)
            .then((res) => {
                dispatch({
                    type: ProjectConstants.GET_LIST_PROJECT_CHANGE_REQUESTS_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: ProjectConstants.GET_LIST_PROJECT_CHANGE_REQUESTS_FAILE });
            });
    };
}

function updateStatusProjectChangeRequestDispatch(data) {
    return (dispatch) => {
        dispatch({ type: ProjectConstants.UPDATE_STATUS_PROJECT_CHANGE_REQUEST });
        ProjectServices.updateStatusProjectChangeRequestAPI(data)
            .then((res) => {
                dispatch({
                    type: ProjectConstants.UPDATE_STATUS_PROJECT_CHANGE_REQUEST_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: ProjectConstants.UPDATE_STATUS_PROJECT_CHANGE_REQUEST_FAILE });
            });
    };
}
