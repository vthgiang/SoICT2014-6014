import { SystemSettingServices } from "./services";
import { SystemSettingConstants } from "./constants";

export const SystemSettingActions = {
    backup,
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
            SystemSettingServices.backup()
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

function restore() {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.RESTORE_DATABASE_REQUEST });

        SystemSettingServices.restore()
            .then(res => {
                dispatch({
                    type: SystemSettingConstants.RESTORE_DATABASE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.RESTORE_DATABASE_FAILE,
                    payload: error
                })
                
            })
    }
}
