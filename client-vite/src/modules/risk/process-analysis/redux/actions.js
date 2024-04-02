import { TaskPertConstants } from './constants';
import { TaskPertServices } from './services';

export const TaskPertActions = {
    countTask
    ,updateTask,
    updateProcessList,
    closeProcess,
    changeTime
};
function changeTime(data){
    return dispatch => {
        dispatch({
            type: TaskPertConstants.CHANGE_TIME_REQUEST
        });
        TaskPertServices.changeTime(data)
            .then(res => {
                dispatch({
                    type: TaskPertConstants.CHANGE_TIME_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: TaskPertConstants.CHANGE_TIME_FAILURE
                })
            })

    }
}
function closeProcess(data){
    return dispatch => {
        dispatch({
            type: TaskPertConstants.CLOSE_PROCESS_REQUEST
        });
        TaskPertServices.closeProcess(data)
            .then(res => {
                dispatch({
                    type: TaskPertConstants.CLOSE_PROCESS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: TaskPertConstants.CLOSE_PROCESS_FAILURE
                })
            })

    }
}
function updateProcessList(processList) {
    return dispatch => {
        dispatch({
            type: TaskPertConstants.UPDATE_PROCESS_LIST_REQUEST
        });
        TaskPertServices.updateProcessList(processList)
            .then(res => {
                dispatch({
                    type: TaskPertConstants.UPDATE_PROCESS_LIST_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: TaskPertConstants.UPDATE_PROCESS_LIST_FAILURE
                })
            })

    }
}
function updateTask(process) {
    return dispatch => {
        dispatch({
            type: TaskPertConstants.UPDATE_TASK_REQUEST
        });
        TaskPertServices.updateTask(process)
            .then(res => {
                dispatch({
                    type: TaskPertConstants.UPDATE_TASK_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: TaskPertConstants.UPDATE_TASK_FAILURE
                })
            })

    }
}
function countTask(data) {
    return dispatch => {
        dispatch({
            type: TaskPertConstants.COUNT_TASK_REQUEST
        });
        TaskPertServices.countTask(data)
            .then(res => {
                dispatch({
                    type: TaskPertConstants.COUNT_TASK_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({
                    type: TaskPertConstants.COUNT_TASK_FAILURE
                })
            })

    }
}