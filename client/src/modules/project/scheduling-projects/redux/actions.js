import { ProjectServices } from './services';
import { SchedulingProjectsConstants } from './constants';

export const SchedulingProjectsActions = {
    createProjectTasksFromCPMDispatch,
}

function createProjectTasksFromCPMDispatch(tasksList) {
    return (dispatch) => {
        dispatch({ type: SchedulingProjectsConstants.ADD_PROJECT_TASKS_CPM });
        ProjectServices.createProjectTasksFromCPM(tasksList)
            .then((res) => {
                dispatch({
                    type: SchedulingProjectsConstants.ADD_PROJECT_TASKS_CPM_SUCCESS,
                    // payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({ type: SchedulingProjectsConstants.ADD_PROJECT_TASKS_CPM_FAILE });
            });
    };
}