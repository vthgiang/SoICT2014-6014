import { SystemSettingServices } from "./services";
import { SystemSettingConstants } from "./constants";

export const SystemSettingActions = {
    backup,
    deleteBackup,
    getRestoreData,
    restore
}

function backup(params=undefined, data=undefined) {
    if(params === undefined && data === undefined){
        return dispatch => {
            dispatch({ type: SystemSettingConstants.CREATE_BACKUP_REQUEST });
            SystemSettingServices.backup()
            .then(res => {
                dispatch({
                    type: SystemSettingConstants.CREATE_BACKUP_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.CREATE_BACKUP_FAILE,
                    payload: error
                }) 
            })
        }
    } else {
        return dispatch => {
            dispatch({ type: SystemSettingConstants.SET_SCHEDULE_BACKUP_AUTOMATIC_REQUEST });
            SystemSettingServices.backup(params, data)
            .then(res => {
                dispatch({
                    type: SystemSettingConstants.SET_SCHEDULE_BACKUP_AUTOMATIC_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.SET_SCHEDULE_BACKUP_AUTOMATIC_FAILE,
                    payload: error
                }) 
            })
        }
    }
}

function deleteBackup(version) {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.DELETE_BACKUP_REQUEST });

        SystemSettingServices.deleteBackup(version)
            .then(res => {
                dispatch({
                    type: SystemSettingConstants.DELETE_BACKUP_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.DELETE_BACKUP_FAILE,
                    payload: error
                })
                
            })
    }
}

function getRestoreData() {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.GET_RESTORE_DATA_REQUEST });

        SystemSettingServices.getRestoreData()
            .then(res => {
                dispatch({
                    type: SystemSettingConstants.GET_RESTORE_DATA_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.GET_RESTORE_DATA_FAILE,
                    payload: error
                })
                
            })
    }
}

function restore(version) {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.RESTORE_REQUEST });

        SystemSettingServices.restore(version)
            .then(res => {
                dispatch({
                    type: SystemSettingConstants.RESTORE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.RESTORE_FAILE,
                    payload: error
                })
                
            })
    }
}
