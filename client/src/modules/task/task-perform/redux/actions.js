// import { taskManagementConstants, performTaskConstants } from "../../../../redux-constants/CombineConstants";
import { performTaskConstants } from "./constants";
import { taskManagementConstants } from "../../task-management/redux/constants";
// import { alertActions } from "../../../../redux-actions/AlertActions";
import { AlertActions } from "../../../alert/redux/actions";
import { performTaskService } from "./services";

export const performTaskAction = {
    getLogTimerTask,
    getTimerStatusTask,
    startTimerTask,
    stopTimerTask,
    pauseTimerTask,
    continueTimerTask,
    getActionComments,
    addActionComment,
    editActionComment,
    deleteActionComment,
    createResultTask,
    editResultTask,
    addTaskAction,
    getTaskActions,
    editTaskAction,
    deleteTaskAction
};

// Create result task
function createResultTask(result) {
    return dispatch => {
        dispatch({ type: performTaskConstants.CREATE_RESULT_TASK_REQUEST, result });
        return new Promise((resolve, reject) => {
            performTaskService.createResultTask(result)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.CREATE_RESULT_TASK_SUCCESS,
                        task: res.data
                    });
                    resolve(res.data);
                })
                .catch(err => {
                    dispatch({ type: performTaskConstants.CREATE_RESULT_TASK_FAILURE, err });
                    AlertActions.handleAlert(dispatch, err);
                    reject(err);
                });
        });

    };
}
// edit result task
function editResultTask(result, taskid) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_RESULT_TASK_REQUEST, result });
        return new Promise((resolve, reject) => {
            performTaskService.editResultTask(result, taskid)
                .then(res => {
                    dispatch({
                        type: performTaskConstants.EDIT_RESULT_TASK_SUCCESS,
                        resultTask: res.data
                    });
                    resolve(res.data);
                })
                .catch(err => {
                    dispatch({ type: performTaskConstants.EDIT_RESULT_TASK_FAILURE, err });
                    AlertActions.handleAlert(dispatch, err);
                    reject(err);
                });
        });
    };
}

// Get log timer task
function getLogTimerTask(task) {
    return dispatch => {
        dispatch(request(task));

        performTaskService.getLogTimerTask(task)
            .then(
                logTimer => dispatch(success(logTimer)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(task) { return { type: performTaskConstants.GET_LOGTIMER_REQUEST, task } }
    function success(logTimer) { return { type: performTaskConstants.GET_LOGTIMER_SUCCESS, logTimer } }
    function failure(error) { return { type: performTaskConstants.GET_LOGTIMER_FAILURE, error } }
}

// Get timer status task
function getTimerStatusTask(task) { //param -- , user
    return dispatch => {
        dispatch(request(task));
        //performTaskService.getTimerStatusTask(task,user)
        performTaskService.getTimerStatusTask(task)
            .then(
                currentTimer => dispatch(success(currentTimer)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(task) { return { type: performTaskConstants.GET_TIMERSTATUS_REQUEST, task } }
    function success(currentTimer) { return { type: performTaskConstants.GET_TIMERSTATUS_SUCCESS, currentTimer } }
    function failure(error) { return { type: performTaskConstants.GET_TIMERSTATUS_FAILURE, error } }
}

// start timer task
function startTimerTask(timer) {
    return dispatch => {
        dispatch(request(timer));
        performTaskService.startTimerTask(timer)
            .then(
                timer => {
                    dispatch(success(timer));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(timer) { return { type: performTaskConstants.START_TIMER_REQUEST, timer } }
    function success(timer) { return { type: performTaskConstants.START_TIMER_SUCCESS, timer } }
    function failure(error) { return { type: performTaskConstants.STOP_TIMER_FAILURE, error } }
}

// pause timer task
function pauseTimerTask(id, newTimer) {
    return dispatch => {
        dispatch(request(id));

        performTaskService.pauseTimerTask(id, newTimer)
            .then(
                newTimer => {
                    dispatch(success(newTimer));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(id) { return { type: performTaskConstants.PAUSE_TIMER_REQUEST, id } }
    function success(newTimer) { return { type: performTaskConstants.PAUSE_TIMER_SUCCESS, newTimer } }
    function failure(error) { return { type: performTaskConstants.PAUSE_TIMER_FAILURE, error } }
}

// continue timer task
function continueTimerTask(id, newTimer) {
    return dispatch => {
        dispatch(request(id));

        performTaskService.continueTimerTask(id, newTimer)
            .then(
                newTimer => {
                    dispatch(success(newTimer));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(id) { return { type: performTaskConstants.CONTINUE_TIMER_REQUEST, id } }
    function success(newTimer) { return { type: performTaskConstants.CONTINUE_TIMER_SUCCESS, newTimer } }
    function failure(error) { return { type: performTaskConstants.CONTINUE_TIMER_FAILURE, error } }
}

// stop timer task
function stopTimerTask(id, newTimer) {
    return dispatch => {
        dispatch(request(id));

        performTaskService.stopTimerTask(id, newTimer)
            .then(
                newTask => {
                    dispatch(success(newTask))
                    dispatch(updatetask(newTask))
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(id) { return { type: performTaskConstants.STOP_TIMER_REQUEST, id } }
    function success(newTask) { return { type: performTaskConstants.STOP_TIMER_SUCCESS, newTask } }
    function updatetask(newTask) { return { type: taskManagementConstants.EDIT_TASK_SUCCESS, newTask } }
    function failure(error) { return { type: performTaskConstants.STOP_TIMER_FAILURE, error } }
}
//get Action task
function getTaskActions(task) {
    return dispatch => {
        dispatch(request(task));

        performTaskService.getTaskActions(task)
            .then(
                taskActions => dispatch(success(taskActions)),
                error => dispatch(failure(error.toString()))
            )
    };
    function request(task) { return { type: performTaskConstants.GET_TASKACTION_REQUEST, task } }
    function success(taskActions) { return { type: performTaskConstants.GET_TASKACTION_SUCCESS, taskActions } }
    function failure(error) { return { type: performTaskConstants.GET_TASKACTION_FAILURE, error } }
}
// get comment task
function getActionComments(task) {
    return dispatch => {
        dispatch(request(task));

        performTaskService.getActionComments(task)
            .then(
                actionComments => dispatch(success(actionComments)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(task) { return { type: performTaskConstants.GET_ACTIONCOMMENT_REQUEST, task } }
    function success(actionComments) { return { type: performTaskConstants.GET_ACTIONCOMMENT_SUCCESS, actionComments } }
    function failure(error) { return { type: performTaskConstants.GET_ACTIONCOMMENT_FAILURE, error } }
}

// add comment task
function addActionComment(newComment) {
    return dispatch => {
        dispatch(request(newComment));

        performTaskService.addActionComment(newComment)
            .then(
                newComment => {
                    dispatch(success(newComment));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(newComment) { return { type: performTaskConstants.ADDNEW_ACTIONCOMMENT_REQUEST, newComment } }
    function success(newComment) { return { type: performTaskConstants.ADDNEW_ACTIONCOMMENT_SUCCESS, newComment } }
    function failure(error) { return { type: performTaskConstants.ADDNEW_ACTIONCOMMENT_FAILURE, error } }
}
//add action task
function addTaskAction(newAction) {
    return dispatch => {
        dispatch(request(newAction));

        performTaskService.addTaskAction(newAction)
            .then(
                newAction => dispatch(success(newAction)),
                error => dispatch(failure(newAction, error.toString()))
            );
    };

    function request(newAction) { return { type: performTaskConstants.ADDNEW_TASKACTION_REQUEST, newAction } }
    function success(newAction) { return { type: performTaskConstants.ADDNEW_TASKACTION_SUCCESS, newAction } }
    function failure(error) { return { type: performTaskConstants.ADDNEW_TASKACTION_FAILURE, error } }
}

// edit comment task
function editActionComment(id, newComment) {
    return dispatch => {
        dispatch(request(id));

        performTaskService.editActionComment(id, newComment)
            .then(
                newComment => {
                    dispatch(success(newComment));
                },
                error => {
                    dispatch(failure(error.toString()));
                    // dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(id) { return { type: performTaskConstants.EDIT_ACTIONCOMMENT_REQUEST, id } }
    function success(newComment) { return { type: performTaskConstants.EDIT_ACTIONCOMMENT_SUCCESS, newComment } }
    function failure(error) { return { type: performTaskConstants.EDIT_ACTIONCOMMENT_FAILURE, error } }
}
function editTaskAction(id, newAction) {
    return dispatch => {
        dispatch(request(id));
        performTaskService.editTaskAction(id, newAction)
            .then(
                newAction => {
                    dispatch(success(newAction));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            )
    }
    function request(id) { return { type: performTaskConstants.EDIT_TASKACTION_REQUEST, id } }
    function success(newAction) { return { type: performTaskConstants.EDIT_TASKACTION_SUCCESS, newAction } }
    function failure(error) { return { type: performTaskConstants.EDIT_TASKACTION_FAILURE, error } }
}
// delete comment task: prefixed function name with underscore because delete is a reserved word in javascript
function deleteActionComment(id) {
    return dispatch => {
        dispatch(request(id));

        performTaskService.deleteActionComment(id)
            .then(
                comment => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: performTaskConstants.DELETE_ACTIONCOMMENT_REQUEST, id } }
    function success(id) { return { type: performTaskConstants.DELETE_ACTIONCOMMENT_SUCCESS, id } }
    function failure(id, error) { return { type: performTaskConstants.DELETE_ACTIONCOMMENT_FAILURE, id, error } }
}
function deleteTaskAction(id) {
    return dispatch => {
        dispatch(request(id));

        performTaskService.deleteTaskAction(id)
            .then(
                comment => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: performTaskConstants.DELETE_TASKACTION_REQUEST, id } }
    function success(id) { return { type: performTaskConstants.DELETE_TASKACTION_SUCCESS, id } }
    function failure(id, error) { return { type: performTaskConstants.DELETE_TASKACTION_FAILURE, id, error } }
}
