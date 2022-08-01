import { ProjectPhaseServices } from './services';
import { ProjectPhaseConstants } from './constants';

export const ProjectPhaseActions = {
    getAllPhaseByProject,
    getPhaseById,
    editPhase,
    createPhase,
    deletePhase
}

function getAllPhaseByProject(id) {
    return (dispatch) => {
        dispatch({ type: ProjectPhaseConstants.GET_PROJECT_PHASE_REQUEST });
        ProjectPhaseServices.getAllPhaseByProject(id)
            .then((res) => {
                dispatch({
                    type: ProjectPhaseConstants.GET_PROJECT_PHASE_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: ProjectPhaseConstants.GET_PROJECT_PHASE_FAIL });
            });
    };
}

function getPhaseById(id) {
    return (dispatch) => {
        dispatch({ type: ProjectPhaseConstants.GET_PERFORM_PHASE_REQUEST });
        ProjectPhaseServices.getPhaseById(id)
            .then((res) => {
                dispatch({
                    type: ProjectPhaseConstants.GET_PERFORM_PHASE_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: ProjectPhaseConstants.GET_PERFORM_PHASE_FAIL });
            });
    };
}

function createPhase(data) {
    return dispatch => {
        dispatch({ type: ProjectPhaseConstants.CREATE_PHASE_REQUEST });

        ProjectPhaseServices.createPhase(data)
            .then(res => {
                dispatch({
                    type: ProjectPhaseConstants.CREATE_PHASE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: ProjectPhaseConstants.CREATE_PHASE_FAIL,
                    error
                })
            })
    }
}

function editPhase(id, phase) {
    return dispatch => {
        dispatch({ type: ProjectPhaseConstants.EDIT_PHASE_REQUEST, id });

        ProjectPhaseServices.editPhase(id, phase)
            .then(res => {
                dispatch({
                    type: ProjectPhaseConstants.EDIT_PHASE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: ProjectPhaseConstants.EDIT_PHASE_FAIL,
                    error
                })
            })
    }
}

function deletePhase(id) {
    return (dispatch) => {
        dispatch({ type: ProjectPhaseConstants.DELETE_PHASE_REQUEST });
        ProjectPhaseServices.deletePhase(id)
            .then((res) => {
                dispatch({
                    type: ProjectPhaseConstants.DELETE_PHASE_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: ProjectPhaseConstants.DELETE_PHASE_FAIL });
            });
    };
}