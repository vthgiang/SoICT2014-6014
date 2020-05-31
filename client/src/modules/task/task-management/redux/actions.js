import { taskManagementConstants } from "./constants";
import { taskManagementService } from "./services";
export const taskManagementActions = {
    getAll,
    getAllTaskByRole,
    getResponsibleTaskByUser,
    getAccountableTaskByUser,
    getConsultedTaskByUser,
    getInformedTaskByUser,
    getCreatorTaskByUser,
    getTaskById,
    addTask,
    editTask,
    editStatusOfTask,
    _delete,
    getSubTask
};

// Get all task
function getAll() {
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GETALL_TASK_REQUEST
        });

        taskManagementService.getAll()
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GETALL_TASK_SUCCESS,
                    // payload: res.data.content.tasks
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GETALL_TASK_FAILURE,
                    error
                })
            });
    };
}

// Get all task by role and creator
function getAllTaskByRole(id, role) {
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GETTASK_BYROLE_REQUEST,
            id
        });

        taskManagementService.getAllTaskByRole(id, role)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GETTASK_BYROLE_SUCCESS,
                    // payload: res.data.content.tasks
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GETTASK_BYROLE_FAILURE,
                    error
                })
            });
    }
}

// Get all task by user
function getResponsibleTaskByUser(unit, number, perPage, status, priority, special, name) { //user, -- param
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_REQUEST
        });

        taskManagementService.getResponsibleTaskByUser(unit, number, perPage, status, priority, special, name)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_SUCCESS,
                    // payload: res.data.content.responsibleTasks
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_FAILURE,
                    error
                })
            })
    }
}

// Get all task by user
function getAccountableTaskByUser(unit, number, perPage, status, priority, special, name) {
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_REQUEST
        });
        taskManagementService.getAccountableTaskByUser(unit, number, perPage, status, priority, special, name)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_SUCCESS,
                    // payload: res.data.content.accountableTasks
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_FAILURE,
                    error
                })
            })
    }
}

// Get all task by user
function getConsultedTaskByUser(unit, number, perPage, status, priority, special, name) {
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GETTASK_CONSULTED_BYUSER_REQUEST
        });

        taskManagementService.getConsultedTaskByUser(unit, number, perPage, status, priority, special, name)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GETTASK_CONSULTED_BYUSER_SUCCESS,
                    // payload: res.data.content.consultedTasks
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GETTASK_CONSULTED_BYUSER_FAILURE,
                    error
                })
            })
    }
}

// Get all task by user
function getInformedTaskByUser(unit, number, perPage, status, priority, special, name) {
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GETTASK_INFORMED_BYUSER_REQUEST
        });

        taskManagementService.getInformedTaskByUser(unit, number, perPage, status, priority, special, name)
            .then( res => {
                dispatch({
                    type: taskManagementConstants.GETTASK_INFORMED_BYUSER_SUCCESS, 
                    // payload: res.data.content.informedTasks
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GETTASK_INFORMED_BYUSER_FAILURE, 
                    error
                });
            })
    }
}

// Get all task by user
function getCreatorTaskByUser(unit, number, perPage, status, priority, special, name) {
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GETTASK_CREATOR_BYUSER_REQUEST
        });

        taskManagementService.getCreatorTaskByUser(unit, number, perPage, status, priority, special, name)
            .then( res=> {
                dispatch({
                    type: taskManagementConstants.GETTASK_CREATOR_BYUSER_SUCCESS, 
                    // payload: res.data.content.creatorTasks 
                    payload: res.data.content
                })
            })
            .catch(error=>{
                dispatch({
                    type: taskManagementConstants.GETTASK_CREATOR_BYUSER_FAILURE, 
                    error
                })
            })
    }
}

// Get task template by id
function getTaskById(id) {
    return dispatch => {
        dispatch({
            type: taskManagementConstants.GETTASK_BYID_REQUEST, 
            id
        });

        taskManagementService.getById(id)
            .then(res=> {
                dispatch({
                    type: taskManagementConstants.GETTASK_BYID_SUCCESS, 
                    // payload: res.data.content.task
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.GETTASK_BYID_FAILURE, 
                    error
                })
            })
    }
}

// Add a new task of user
function addTask(task) {
    return dispatch => {
        dispatch({type: taskManagementConstants.ADDNEW_TASK_REQUEST, task});

        taskManagementService.addNewTask(task)
            .then(res=>{
                dispatch({
                    type: taskManagementConstants.ADDNEW_TASK_SUCCESS, 
                    // payload: res.data.content.task
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.ADDNEW_TASK_FAILURE, error
                })
            })
    }
}

// TODO: Edit a task
function editTask(id, task) {
    return dispatch => {
        dispatch({ type: taskManagementConstants.EDIT_TASK_REQUEST, id });

        taskManagementService.editTaskTemplate(id, task)
            .then(res=> {
                dispatch({
                    type: taskManagementConstants.EDIT_TASK_SUCCESS, 
                    // payload: res.data.content.task
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: taskManagementConstants.EDIT_TASK_FAILURE, 
                    error
                })
            })
    }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch({ type: taskManagementConstants.DELETE_TASK_REQUEST, id });

        taskManagementService.deleteTaskById(id)
            .then(res=> {
                dispatch({
                    type: taskManagementConstants.DELETE_TASK_SUCCESS, 
                    id 
                })
            })
            .catch(error=>{
               dispatch({
                    type: taskManagementConstants.DELETE_TASK_FAILURE, 
                    id, 
                    error
               })
            })
    }
}

// Edit status of task
function editStatusOfTask(id, status) {
    return dispatch => {
        dispatch({ type: taskManagementConstants.EDIT_STATUS_OF_TASK_REQUEST, id });
        taskManagementService.editStatusOfTask(id, status) //(taskid, { status: "dang thuc hien" })
            .then(res => {
                dispatch({
                    type: taskManagementConstants.EDIT_STATUS_OF_TASK_SUCCESS,
                    // payload: res.data.content.task
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: taskManagementConstants.EDIT_STATUS_OF_TASK_FAILURE, error });
            });
    };
}
// Get SubTask
function getSubTask(taskId){
    return dispatch => {
        dispatch({ type: taskManagementConstants.GET_SUBTASK_REQUEST, taskId });
        taskManagementService.getSubTask(taskId)
            .then(res => {
                dispatch({
                    type: taskManagementConstants.GET_SUBTASK_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({ type: taskManagementConstants.GET_SUBTASK_FAILURE, error });
            });
    }; 
}