// import { taskManagementConstants, performTaskConstants } from "../../../../redux-constants/CombineConstants";
import { performTaskConstants } from "./constants";
import { taskManagementConstants } from "../../task-management/redux/constants";
// import { alertActions } from "../../../../redux-actions/AlertActions";
import { performTaskService } from "./services";

export const performTaskAction = {
    getLogTimerTask,
    getTimerStatusTask,
    startTimerTask,
    stopTimerTask,
    pauseTimerTask,
    continueTimerTask,
    getCommentTask,
    addCommentTask,
    editCommentTask,
    deleteCommentTask,
    createResultTask,
    editResultTask,
    addActionTask,
    getActionTask,
    editActionTask,
    deleteActionTask
};

// Create result task
function createResultTask(result) {
    return dispatch => {
        dispatch(request(result));

        performTaskService.createResultTask(result)
            .then(
                task => dispatch(success(task)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(result) { return { type: performTaskConstants.CREATE_RESULT_TASK_REQUEST, result } }
    function success(task) { return { type: performTaskConstants.CREATE_RESULT_TASK_SUCCESS, task } }
    function failure(error) { return { type: performTaskConstants.CREATE_RESULT_TASK_FAILURE, error } }
}
// edit result task
function editResultTask(result, taskid) {
    return dispatch => {
        dispatch(request(result,taskid));

        performTaskService.editResultTask(result,taskid)
            .then(
                resultTask => dispatch(success(resultTask)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(result) { return { type: performTaskConstants.EDIT_RESULT_TASK_REQUEST, result } }
    function success(resultTask) { return { type: performTaskConstants.EDIT_RESULT_TASK_SUCCESS, resultTask } }
    function failure(error) { return { type: performTaskConstants.EDIT_RESULT_TASK_FAILURE, error } }
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
    function success(newTask) { return { type: performTaskConstants.STOP_TIMER_SUCCESS, newTask} }
    function updatetask(newTask) { return { type: taskManagementConstants.EDIT_TASK_SUCCESS, newTask} }
    function failure(error) { return { type: performTaskConstants.STOP_TIMER_FAILURE, error } }
}
//get Action task
function getActionTask(task){
    return dispatch => {
        dispatch(request(task));

        performTaskService.getActionTask(task)
            .then(
                actionTask => dispatch(success(actionTask)),
                error => dispatch(failure(error.toString()))
            )
    };
    function request(task) { return { type: performTaskConstants.GET_ACTIONTASK_REQUEST, task } }
    function success(actionTask) { return { type: performTaskConstants.GET_ACTIONTASK_SUCCESS, actionTask } }
    function failure(error) { return { type: performTaskConstants.GET_ACTIONTASK_FAILURE, error } }
}
// get comment task
function getCommentTask(task) {
    return dispatch => {
        dispatch(request(task));

        performTaskService.getCommentTask(task)
            .then(
                commentTasks => dispatch(success(commentTasks)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(task) { return { type: performTaskConstants.GET_COMMENTTASK_REQUEST, task } }
    function success(commentTasks) { return { type: performTaskConstants.GET_COMMENTTASK_SUCCESS, commentTasks } }
    function failure(error) { return { type: performTaskConstants.GET_COMMENTTASK_FAILURE, error } }
}

// add comment task
function addCommentTask(newComment) {
    return dispatch => {
        dispatch(request(newComment));

        performTaskService.addCommentTask(newComment)
            .then(
                newComment => { 
                    dispatch(success(newComment));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(newComment) { return { type: performTaskConstants.ADDNEW_COMMENTTASK_REQUEST, newComment } }
    function success(newComment) { return { type: performTaskConstants.ADDNEW_COMMENTTASK_SUCCESS, newComment } }
    function failure(error) { return { type: performTaskConstants.ADDNEW_COMMENTTASK_FAILURE, error } }
}
//add action task
function addActionTask(newAction){
    return dispatch => {
        dispatch(request(newAction));

        performTaskService.addActionTask(newAction)
            .then(
                newAction => dispatch(success(newAction)),
                error => dispatch(failure(newAction, error.toString()))
            );
    };

    function request(newAction) { return { type: performTaskConstants.ADDNEW_ACTIONTASK_REQUEST, newAction } }
    function success(newAction) { return { type: performTaskConstants.ADDNEW_ACTIONTASK_SUCCESS, newAction } }
    function failure( error) { return { type: performTaskConstants.ADDNEW_ACTIONTASK_FAILURE, error } }
}

// edit comment task
function editCommentTask(id, newComment) {
    return dispatch => {
        dispatch(request(id));

        performTaskService.editCommentTask(id, newComment)
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

    function request(id) { return { type: performTaskConstants.EDIT_COMMENTTASK_REQUEST, id } }
    function success(newComment) { return { type: performTaskConstants.EDIT_COMMENTTASK_SUCCESS, newComment } }
    function failure(error) { return { type: performTaskConstants.EDIT_COMMENTTASK_FAILURE, error } }
}
function editActionTask(id,newAction){
    return dispatch => {
        dispatch(request(id));
        performTaskService.editActionTask(id,newAction)
            .then(
                newAction => {
                    dispatch(success(newAction));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            )
    }
    function request(id) { return { type: performTaskConstants.EDIT_ACTIONTASK_REQUEST, id } }
    function success(newAction) { return { type: performTaskConstants.EDIT_ACTIONTASK_SUCCESS, newAction } }
    function failure(error) { return { type: performTaskConstants.EDIT_ACTIONTASK_FAILURE, error } }
}
// delete comment task: prefixed function name with underscore because delete is a reserved word in javascript
function deleteCommentTask(id) {
    return dispatch => {
        dispatch(request(id));

        performTaskService.deleteCommentTask(id)
            .then(
                comment => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: performTaskConstants.DELETE_COMMENTTASK_REQUEST, id } }
    function success(id) { return { type: performTaskConstants.DELETE_COMMENTTASK_SUCCESS, id } }
    function failure(id, error) { return { type: performTaskConstants.DELETE_COMMENTTASK_FAILURE, id, error } }
}
function deleteActionTask(id){
    return dispatch => {
        dispatch(request(id));

        performTaskService.deleteActionTask(id)
            .then(
                comment => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: performTaskConstants.DELETE_ACTIONTASK_REQUEST, id } }
    function success(id) { return { type: performTaskConstants.DELETE_ACTIONTASK_SUCCESS, id } }
    function failure(id, error) { return { type: performTaskConstants.DELETE_ACTIONTASK_FAILURE, id, error } }
}
