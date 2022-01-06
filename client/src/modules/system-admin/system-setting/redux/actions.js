import { SystemSettingServices } from "./services";
import { SystemSettingConstants } from "./constants";
const FileDownload = require("js-file-download");

export const SystemSettingActions = {
    getBackups,
    getConfigBackup,
    createBackup,
    configBackup,
    editBackupInfo,
    deleteBackup,
    downloadBackupVersion,
    restore,
    uploadBackupFiles
}
function uploadBackupFiles(data) {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.UPLOAD_BACKUP_FILE_REQUEST });

        SystemSettingServices.uploadBackupFiles(data)
            .then(res => {
                dispatch({
                    type: SystemSettingConstants.UPLOAD_BACKUP_FILE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.UPLOAD_BACKUP_FILE_FAILURE,
                    payload: error
                })
            })
    }
}
function getBackups() {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.GET_BACKUPS_REQUEST });

        SystemSettingServices.getBackups()
        .then(res => {
            dispatch({
                type: SystemSettingConstants.GET_BACKUPS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(error => {
            dispatch({
                type: SystemSettingConstants.GET_BACKUPS_FAILURE,
                payload: error
            }) 
        })
    }
}

function getConfigBackup() {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.GET_CONFIG_BACKUP_REQUEST });
        SystemSettingServices.getConfigBackup()
            .then(res => {
                dispatch({
                    type: SystemSettingConstants.GET_CONFIG_BACKUP_SUCCESS,
                    payload: res.data.content.backup
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.GET_CONFIG_BACKUP_FAILURE,
                    payload: error
                }) 
            })
    }
}

function editBackupInfo(version, data) {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.EDIT_BACKUP_INFO_REQUEST });

        SystemSettingServices.editBackupInfo(version, data)
            .then(res => {
                dispatch({
                    type: SystemSettingConstants.EDIT_BACKUP_INFO_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.EDIT_BACKUP_INFO_FAILURE,
                    payload: error
                })
            })
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
                    type: SystemSettingConstants.DELETE_BACKUP_FAILURE,
                    payload: error
                })
                
            })
    }
}

function downloadBackupVersion(path) {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.DOWNLOAD_BACKUP_VERSION_REQUEST });

        SystemSettingServices.downloadBackupVersion(path)
            .then(res => {
                dispatch({ type: SystemSettingConstants.DOWNLOAD_BACKUP_VERSION_SUCCESS })
                const content = res.headers["content-type"];
                FileDownload(res.data, 'data', content);
            })
            .catch(error => {
                dispatch({ type: SystemSettingConstants.DOWNLOAD_BACKUP_VERSION_FAILURE })
            })
    }
}

function createBackup() {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.CREATE_BACKUP_REQUEST });

        SystemSettingServices.createBackup()
            .then(res => {
                dispatch({
                    type: SystemSettingConstants.CREATE_BACKUP_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.CREATE_BACKUP_FAILURE,
                    payload: error
                })
                
            })
    }
}

function configBackup(params, data=undefined) {
    return dispatch => {
        dispatch({ type: SystemSettingConstants.CONFIG_BACKUP_REQUEST });

        SystemSettingServices.configBackup(params, data)
            .then(res => {
                dispatch({
                    type: SystemSettingConstants.CONFIG_BACKUP_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemSettingConstants.CONFIG_BACKUP_FAILURE,
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
                    type: SystemSettingConstants.RESTORE_FAILURE,
                    payload: error
                })
                
            })
    }
}
