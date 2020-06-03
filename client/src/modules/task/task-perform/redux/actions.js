// import { taskManagementConstants, performTaskConstants } from "../../../../redux-constants/CombineConstants";
import { performTaskConstants } from "./constants";
import { taskManagementConstants } from "../../task-management/redux/constants";
// import { alertActions } from "../../../../redux-actions/AlertActions";
import { performTaskService } from "./services";
const FileDownload = require('js-file-download');
export const performTaskAction = {
    getTimesheetLogs,
    getTimerStatusTask,
    startTimerTask,
    stopTimerTask,
    addActionComment,
    editActionComment,
    deleteActionComment,
    createResultTask,
    editResultTask,
    addTaskAction,
    editTaskAction,
    deleteTaskAction,
    createTaskComment,
    editTaskComment,
    deleteTaskComment,
    createCommentOfTaskComment,
    editCommentOfTaskComment,
    deleteCommentOfTaskComment,
    evaluationAction,
    confirmAction,
    downloadFileActions,
    downloadFileCommentOfActions,
    downloadFileCommentOfTaskComments,
    downloadFileTaskComments,
    uploadFile
};
// Create result task
function createResultTask(result) {
    return dispatch => {
        dispatch({ type: performTaskConstants.CREATE_RESULT_TASK_REQUEST, result });
        performTaskService.createResultTask(result)
            .then(res => {
                dispatch({
                    type: performTaskConstants.CREATE_RESULT_TASK_SUCCESS,
                    task: res
                });
            })
            .catch(err => {
                dispatch({ type: performTaskConstants.CREATE_RESULT_TASK_FAILURE, err });
            });
    };
}
// edit result task
function editResultTask(result, taskid) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_RESULT_TASK_REQUEST, result });
        performTaskService.editResultTask(result, taskid)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EDIT_RESULT_TASK_SUCCESS,
                    resultTask: res
                });
            })
            .catch(err => {
                dispatch({ type: performTaskConstants.EDIT_RESULT_TASK_FAILURE, err });
            });
    };
}

// Get log timer task
function getTimesheetLogs(task) {
    return dispatch => {
        dispatch({type: performTaskConstants.GET_TIMESHEETLOGS_REQUEST});

        performTaskService.getTimesheetLogs(task)
            .then(
                payload => dispatch({ type: performTaskConstants.GET_TIMESHEETLOGS_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.GET_TIMESHEETLOGS_FAILURE, error })
            );
    };
}

// Get timer status task
function getTimerStatusTask() { //param -- , user
    return dispatch => {
        dispatch({ type: performTaskConstants.GET_TIMERSTATUS_REQUEST });
        //performTaskService.getTimerStatusTask(task,user)
        performTaskService.getTimerStatusTask()
            .then(
                payload => dispatch({ type: performTaskConstants.GET_TIMERSTATUS_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.GET_TIMERSTATUS_FAILURE, error })
            );
    };
}

// start timer task
function startTimerTask(timer) {
    return dispatch => {
        dispatch({ type: performTaskConstants.START_TIMER_REQUEST });
        performTaskService.startTimerTask(timer)
            .then(
                payload => {
                    dispatch({ type: performTaskConstants.START_TIMER_SUCCESS, payload });
                },
                error => {
                    dispatch({ type: performTaskConstants.STOP_TIMER_FAILURE, error });
                }
            );
    };
}


// stop timer task
function stopTimerTask(newTimer) {
    return dispatch => {
        dispatch({ type: performTaskConstants.STOP_TIMER_REQUEST });

        performTaskService.stopTimerTask(newTimer)
            .then(
                payload => {
                    dispatch({ type: performTaskConstants.STOP_TIMER_SUCCESS, payload})
                    dispatch({ type: taskManagementConstants.EDIT_TASK_SUCCESS, payload })
                },
                error => {
                    dispatch({ type: performTaskConstants.STOP_TIMER_FAILURE, error });
                }
            );
    };
}

// add comment task
function addActionComment(newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.ADDNEW_ACTIONCOMMENT_REQUEST });

        performTaskService.addActionComment(newComment)
            .then(
                payload => {
                    dispatch({ type: performTaskConstants.ADDNEW_ACTIONCOMMENT_SUCCESS, payload });
                },
                error => {
                    dispatch({ type: performTaskConstants.ADDNEW_ACTIONCOMMENT_FAILURE, error });
                }
            );
    };
}
//add action task
function addTaskAction(newAction) {
    return dispatch => {
        dispatch({ type: performTaskConstants.ADDNEW_TASKACTION_REQUEST });

        performTaskService.addTaskAction(newAction)
            .then(
                payload => dispatch({ type: performTaskConstants.ADDNEW_TASKACTION_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.ADDNEW_TASKACTION_FAILURE, error })
            );
    };
}

// edit comment task
function editActionComment(id, newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_ACTIONCOMMENT_REQUEST });

        performTaskService.editActionComment(id, newComment)
            .then(
                payload => {
                    dispatch({ type: performTaskConstants.EDIT_ACTIONCOMMENT_SUCCESS, payload });
                },
                error => {
                    dispatch({ type: performTaskConstants.EDIT_ACTIONCOMMENT_FAILURE, error });
                }
            );
    };
}
function editTaskAction(id, newAction) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_TASKACTION_REQUEST });
        performTaskService.editTaskAction(id, newAction)
            .then(
                payload => {
                    dispatch({ type: performTaskConstants.EDIT_TASKACTION_SUCCESS, payload });
                },
                error => {
                    dispatch({ type: performTaskConstants.EDIT_TASKACTION_FAILURE, error });
                }
            )
    }
}
// delete comment task: prefixed function name with underscore because delete is a reserved word in javascript
function deleteActionComment(id,task) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_ACTIONCOMMENT_REQUEST });

        performTaskService.deleteActionComment(id,task)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_ACTIONCOMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_ACTIONCOMMENT_FAILURE, id, error })
            );
    };
}
function deleteTaskAction(id,task) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_TASKACTION_REQUEST });

        performTaskService.deleteTaskAction(id,task)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_TASKACTION_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_TASKACTION_FAILURE, id, error })
            );
    };
}

function createTaskComment(newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.CREATE_TASKCOMMENT_REQUEST});

        performTaskService.createTaskComment(newComment)
            .then(
                payload => dispatch({ type: performTaskConstants.CREATE_TASKCOMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.CREATE_TASKCOMMENT_FAILURE, error })
            );
    }
}
function editTaskComment(id, newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_TASKCOMMENT_REQUEST });
        performTaskService.editTaskComment(id, newComment)
            .then(
                payload => {
                    dispatch({ type: performTaskConstants.EDIT_TASKCOMMENT_SUCCESS, payload });
                },
                error => {
                    dispatch({ type: performTaskConstants.EDIT_TASKCOMMENT_FAILURE, error });
                }
            )
    }
}
function deleteTaskComment(id,task) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_TASKCOMMENT_REQUEST});
        performTaskService.deleteTaskComment(id,task)
        .then(
            payload => dispatch({ type: performTaskConstants.DELETE_TASKCOMMENT_SUCCESS, payload }),
            error => dispatch({ type: performTaskConstants.DELETE_TASKCOMMENT_FAILURE, error })
        );
    }
}
function createCommentOfTaskComment(newComment){
    return dispatch => {
        dispatch({ type: performTaskConstants.CREATE_COMMENT_OF_TASKCOMMENT_REQUEST });
        performTaskService.createCommentOfTaskComment(newComment)
        .then(
            payload => dispatch({ type: performTaskConstants.CREATE_COMMENT_OF_TASKCOMMENT_SUCCESS, payload }),
            error => dispatch({ type: performTaskConstants.CREATE_COMMENT_OF_TASKCOMMENT_FAILURE, error })
        );
    }
}
function editCommentOfTaskComment(id,newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_COMMENT_OF_TASKCOMMENT_REQUEST });
        performTaskService.editCommentOfTaskComment(id,newComment)
        .then(
            payload => dispatch({ type: performTaskConstants.EDIT_COMMENT_OF_TASKCOMMENT_SUCCESS, payload }),
            error => dispatch({ type: performTaskConstants.EDIT_COMMENT_OF_TASKCOMMENT_FAILURE, error })
        );
    }
}
function deleteCommentOfTaskComment(task,id) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_COMMENT_OF_TASKCOMMENT_REQUEST });
        performTaskService.deleteCommentOfTaskComment(task,id)
        .then(
            payload => dispatch({ type: performTaskConstants.DELETE_COMMENT_OF_TASKCOMMENT_SUCCESS, payload }),
            error => dispatch({ type: performTaskConstants.DELETE_COMMENT_OF_TASKCOMMENT_FAILURE, error })
        );
    }
}
function evaluationAction(id,evaluations) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EVALUATION_ACTION_REQUEST });
        performTaskService.evaluationAction(id,evaluations)
        .then(
            payload => dispatch({ type: performTaskConstants.EVALUATION_ACTION_SUCCESS, payload }),
            error => dispatch({ type: performTaskConstants.EVALUATION_ACTION_FAILURE, error })
        );
    }
}
function confirmAction(id,idUser) {
    return dispatch => {
        dispatch({ type: performTaskConstants.CONFIRM_ACTION_REQUEST });
        performTaskService.confirmAction(id,idUser)
        .then(
            payload => dispatch({ type: performTaskConstants.CONFIRM_ACTION_SUCCESS, payload }),
            error => dispatch({ type: performTaskConstants.CONFIRM_ACTION_FAILURE, error })
        );
    }
}
function downloadFileActions(id,fileName,type){
    return dispatch => {
        dispatch({ type: performTaskConstants.DOWNLOAD_FILE_REQUEST});
        performTaskService.downloadFileActions(id,type)
            .then(res => { 
                dispatch({ type: performTaskConstants.DOWNLOAD_FILE_SUCCESS });
                const content = res.headers['content-type'];
                FileDownload(res.data ,fileName, content)
            })
            .catch(err => { dispatch({ type: performTaskConstants.DOWNLOAD_FILE_FAILURE})})
    }
}
function downloadFileCommentOfActions(id,fileName,type){
    return dispatch => {
        dispatch({ type: performTaskConstants.DOWNLOAD_FILE_REQUEST});
        performTaskService.downloadFileCommentOfActions(id,type)
            .then(res => { 
                dispatch({ type: performTaskConstants.DOWNLOAD_FILE_SUCCESS });
                const content = res.headers['content-type'];
                FileDownload(res.data ,fileName, content)
            })
            .catch(err => { dispatch({ type: performTaskConstants.DOWNLOAD_FILE_FAILURE})})
    }
}
function downloadFileTaskComments(id,fileName,type){
    return dispatch => {
        dispatch({ type: performTaskConstants.DOWNLOAD_FILE_REQUEST});
        performTaskService.downloadFileTaskComments(id,type)
            .then(res => { 
                dispatch({ type: performTaskConstants.DOWNLOAD_FILE_SUCCESS });
                const content = res.headers['content-type'];
                FileDownload(res.data ,fileName, content)
            })
            .catch(err => { dispatch({ type: performTaskConstants.DOWNLOAD_FILE_FAILURE})})
    }
}
function downloadFileCommentOfTaskComments(id,fileName,type){
    return dispatch => {
        dispatch({ type: performTaskConstants.DOWNLOAD_FILE_REQUEST});
        performTaskService.downloadFileCommentOfTaskComments(id,type)
            .then(res => { 
                dispatch({ type: performTaskConstants.DOWNLOAD_FILE_SUCCESS });
                const content = res.headers['content-type'];
                FileDownload(res.data ,fileName, content)
            })
            .catch(err => { dispatch({ type: performTaskConstants.DOWNLOAD_FILE_FAILURE})})
    }
}
function uploadFile(task,data) {
    return dispatch => {
        dispatch({ type: performTaskConstants.UPLOAD_FILE_REQUEST });
        performTaskService.uploadFile(task,data)
        .then(
            payload => dispatch({ type: performTaskConstants.UPLOAD_FILE_SUCCESS, payload }),
            error => dispatch({ type: performTaskConstants.UPLOAD_FILE_FAILURE, error })
        );
    }
}