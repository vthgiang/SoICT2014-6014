import { ProjectServices } from './services';
import { SchedulingProjectsConstants } from './constants';

export const SchedulingProjectsActions = {
    createProjectTasksFromCPMDispatch,
    createProjectPhaseFromCPMDispatch,
}

function createProjectTasksFromCPMDispatch(tasksList) {
    return (dispatch) => {
        dispatch({ type: SchedulingProjectsConstants.ADD_PROJECT_TASKS_CPM_REQUEST });
        ProjectServices.createProjectTasksFromCPM(tasksList)
            .then((res) => {
                dispatch({
                    type: SchedulingProjectsConstants.ADD_PROJECT_TASKS_CPM_SUCCESS,
                    // payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: SchedulingProjectsConstants.ADD_PROJECT_TASKS_CPM_FAIL });
            });
    };
}

function createProjectPhaseFromCPMDispatch(phaseList) {
    return (dispatch) => {
        dispatch({ type: SchedulingProjectsConstants.ADD_PROJECT_PHASE_CPM_REQUEST });
        ProjectServices.createProjectPhaseFromCPM(phaseList)
            .then((res) => {
                dispatch({
                    type: SchedulingProjectsConstants.ADD_PROJECT_PHASE_CPM_SUCCESS,
                    // payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: SchedulingProjectsConstants.ADD_PROJECT_PHASE_CPM_FAIL });
            });
    };
}