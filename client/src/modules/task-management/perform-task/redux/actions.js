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
    deleteCommentTask
};

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