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
    downloadFile,
    uploadFile,
    addTaskLog,
    deleteFileAction,
    deleteFileCommentOfAction,
    deleteFileTaskComment,
    deleteFileChildTaskComment,
    getTaskLog,

    editTaskByAccountableEmployees,
    editTaskByResponsibleEmployees,

    evaluateTaskByAccountableEmployees,
    evaluateTaskByConsultedEmployees,
    evaluateTaskByResponsibleEmployees,
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
        dispatch({ type: performTaskConstants.GET_TIMESHEETLOGS_REQUEST });

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
                    dispatch({ type: performTaskConstants.STOP_TIMER_SUCCESS, payload })
                    dispatch({ type: taskManagementConstants.EDIT_TASK_SUCCESS, payload })
                },
                error => {
                    dispatch({ type: performTaskConstants.STOP_TIMER_FAILURE, error });
                }
            );
    };
}

// add comment task
function addActionComment(taskId, actionId, newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.ADDNEW_ACTIONCOMMENT_REQUEST });

        performTaskService.addActionComment(taskId, actionId, newComment)
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
function addTaskAction(taskId, newAction) {
    return dispatch => {
        dispatch({ type: performTaskConstants.ADDNEW_TASKACTION_REQUEST });

        performTaskService.addTaskAction(taskId, newAction)
            .then(
                payload => dispatch({ type: performTaskConstants.ADDNEW_TASKACTION_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.ADDNEW_TASKACTION_FAILURE, error })
            );
    };
}

// edit comment task
function editActionComment(taskId, actionId, commentId, newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_ACTIONCOMMENT_REQUEST });

        performTaskService.editActionComment(taskId, actionId, commentId, newComment)
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
function editTaskAction(id, newAction, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_TASKACTION_REQUEST });
        performTaskService.editTaskAction(id, newAction, taskId)
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
function deleteActionComment(taskId, actionId, commentId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_ACTIONCOMMENT_REQUEST });

        performTaskService.deleteActionComment(taskId, actionId, commentId)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_ACTIONCOMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_ACTIONCOMMENT_FAILURE, error })
            );
    };
}
function deleteTaskAction(id, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_TASKACTION_REQUEST });

        performTaskService.deleteTaskAction(id, taskId)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_TASKACTION_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_TASKACTION_FAILURE, id, error })
            );
    };
}

function createTaskComment(taskId, newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.CREATE_TASKCOMMENT_REQUEST });

        performTaskService.createTaskComment(taskId, newComment)
            .then(
                payload => dispatch({ type: performTaskConstants.CREATE_TASKCOMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.CREATE_TASKCOMMENT_FAILURE, error })
            );
    }
}
function editTaskComment(taskId, commentId, newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_TASKCOMMENT_REQUEST });
        performTaskService.editTaskComment(taskId, commentId, newComment)
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
function deleteTaskComment(commentId, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_TASKCOMMENT_REQUEST });
        performTaskService.deleteTaskComment(commentId, taskId)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_TASKCOMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_TASKCOMMENT_FAILURE, error })
            );
    }
}
function createCommentOfTaskComment(commentId, taskId, newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.CREATE_COMMENT_OF_TASKCOMMENT_REQUEST });
        performTaskService.createCommentOfTaskComment(commentId, taskId, newComment)
            .then(
                payload => dispatch({ type: performTaskConstants.CREATE_COMMENT_OF_TASKCOMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.CREATE_COMMENT_OF_TASKCOMMENT_FAILURE, error })
            );
    }
}
function editCommentOfTaskComment(commentId, taskId, newComment) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_COMMENT_OF_TASKCOMMENT_REQUEST });
        performTaskService.editCommentOfTaskComment(commentId, taskId, newComment)
            .then(
                payload => dispatch({ type: performTaskConstants.EDIT_COMMENT_OF_TASKCOMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.EDIT_COMMENT_OF_TASKCOMMENT_FAILURE, error })
            );
    }
}
function deleteCommentOfTaskComment(task, id) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_COMMENT_OF_TASKCOMMENT_REQUEST });
        performTaskService.deleteCommentOfTaskComment(task, id)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_COMMENT_OF_TASKCOMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_COMMENT_OF_TASKCOMMENT_FAILURE, error })
            );
    }
}
function evaluationAction(id, evaluations) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EVALUATION_ACTION_REQUEST });
        performTaskService.evaluationAction(id, evaluations)
            .then(
                payload => dispatch({ type: performTaskConstants.EVALUATION_ACTION_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.EVALUATION_ACTION_FAILURE, error })
            );
    }
}
function confirmAction(id, idUser, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.CONFIRM_ACTION_REQUEST });
        performTaskService.confirmAction(id, idUser, taskId)
            .then(
                payload => dispatch({ type: performTaskConstants.CONFIRM_ACTION_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.CONFIRM_ACTION_FAILURE, error })
            );
    }
}
function downloadFile(path, fileName) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DOWNLOAD_FILE_REQUEST });
        performTaskService.downloadFile(path)
            .then(res => {
                dispatch({ type: performTaskConstants.DOWNLOAD_FILE_SUCCESS });
                console.log(res)
                const content = res.headers['content-type'];
                FileDownload(res.data, fileName, content)
            })
            .catch(err => { dispatch({ type: performTaskConstants.DOWNLOAD_FILE_FAILURE }) })
    }
}
function uploadFile(data) {
    return dispatch => {
        dispatch({ type: performTaskConstants.UPLOAD_FILE_REQUEST });
        performTaskService.uploadFile(data)
            .then(
                payload => dispatch({ type: performTaskConstants.UPLOAD_FILE_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.UPLOAD_FILE_FAILURE, error })
            );
    }
}
function deleteFileAction(fileId, actionId, taskId, type) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_FILE_ACTION_REQUEST });
        performTaskService.deleteFileAction(fileId, actionId, taskId, type)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_FILE_ACTION_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_FILE_ACTION_FAILURE, error })
            );
    }
}
function deleteFileCommentOfAction(fileId, actionId, taskId, type) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_FILE_COMMENT_OF_ACTION_REQUEST });
        performTaskService.deleteFileCommentOfAction(fileId, actionId, taskId, type)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_FILE_COMMENT_OF_ACTION_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_FILE_COMMENT_OF_ACTION_FAILURE, error })
            );
    }
}
function deleteFileTaskComment(fileId, actionId, taskId, type) {
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_FILE_TASK_COMMENT_REQUEST });
        performTaskService.deleteFileTaskComment(fileId, actionId, taskId, type)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_FILE_TASK_COMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_FILE_TASK_COMMENT_FAILURE, error })
            );
    }
}
function deleteFileChildTaskComment(fileId, actionId, taskId, type) {
    console.log("action")
    return dispatch => {
        dispatch({ type: performTaskConstants.DELETE_FILE_CHILD_TASK_COMMENT_REQUEST });
        performTaskService.deleteFileChildTaskComment(fileId, actionId, taskId, type)
            .then(
                payload => dispatch({ type: performTaskConstants.DELETE_FILE_CHILD_TASK_COMMENT_SUCCESS, payload }),
                error => dispatch({ type: performTaskConstants.DELETE_FILE_CHILD_TASK_COMMENT_FAILURE, error })
            );
    }
}
// Hàm thêm nhật ký cho một công việc
function addTaskLog(log) {
    return dispatch => {
        dispatch({ type: performTaskConstants.ADD_TASK_LOG_REQUEST });
        performTaskService.addTaskLog(log)
            .then(
                res => dispatch({
                    type: performTaskConstants.ADD_TASK_LOG_SUCCESS,
                    payload: res.data.content
                }),
                error => dispatch({ type: performTaskConstants.ADD_TASK_LOG_FAILURE, error })
            );
    }
}

// Hàm lấy tất cả nhật ký của một công việc
function getTaskLog(id) {
    return dispatch => {
        dispatch({ type: performTaskConstants.GET_TASK_LOG_REQUEST });
        performTaskService.getTaskLog(id)
            .then(
                res => dispatch({
                    type: performTaskConstants.GET_TASK_LOG_SUCCESS,
                    payload: res.data.content
                }),
                error => dispatch({ type: performTaskConstants.GET_TASK_LOG_FAILURE, error })
            );
    }
}

/**
 * edit Task By Accountable Employees
 * @param {*} data du lieu gui di
 * @param {*} taskId id task
 */
function editTaskByAccountableEmployees(data, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_TASK_BY_ACCOUNTABLE_REQUEST, taskId });
        performTaskService.editTaskByAccountableEmployees(data, taskId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EDIT_TASK_BY_ACCOUNTABLE_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.EDIT_TASK_BY_ACCOUNTABLE_FAILURE, error });
            });
    };
}

/**
 * edit Task By Responsible Employees
 * @param {*} data du lieu gui di
 * @param {*} taskId id task
 */
function editTaskByResponsibleEmployees(data, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EDIT_TASK_BY_RESPONSIBLE_REQUEST, taskId });
        performTaskService.editTaskByResponsibleEmployees(data, taskId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EDIT_TASK_BY_RESPONSIBLE_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.EDIT_TASK_BY_RESPONSIBLE_FAILURE, error });
            });
    };
}

/**
 * evaluate Task By Accountable Employees
 * @param {*} data du lieu gui di
 * @param {*} taskId id task
 */
function evaluateTaskByAccountableEmployees(data, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EVALUATE_TASK_BY_ACCOUNTABLE_REQUEST, taskId });
        performTaskService.evaluateTaskByAccountableEmployees(data, taskId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EVALUATE_TASK_BY_ACCOUNTABLE_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.EVALUATE_TASK_BY_ACCOUNTABLE_FAILURE, error });
            });
    };
}

/**
 * evaluate Task By Consulted Employees
 * @param {*} data du lieu gui di
 * @param {*} taskId id task
 */
function evaluateTaskByConsultedEmployees(data, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EVALUATE_TASK_BY_CONSULTED_REQUEST, taskId });
        performTaskService.evaluateTaskByConsultedEmployees(data, taskId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EVALUATE_TASK_BY_CONSULTED_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.EVALUATE_TASK_BY_CONSULTED_FAILURE, error });
            });
    };
}

/**
 * evaluate Task By Responsible Employees
 * @param {*} data du lieu gui di
 * @param {*} taskId id task
 */
function evaluateTaskByResponsibleEmployees(data, taskId) {
    return dispatch => {
        dispatch({ type: performTaskConstants.EVALUATE_TASK_BY_RESPONSIBLE_REQUEST, taskId });
        performTaskService.evaluateTaskByResponsibleEmployees(data, taskId)
            .then(res => {
                dispatch({
                    type: performTaskConstants.EVALUATE_TASK_BY_RESPONSIBLE_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: performTaskConstants.EVALUATE_TASK_BY_RESPONSIBLE_FAILURE, error });
            });
    };
}
