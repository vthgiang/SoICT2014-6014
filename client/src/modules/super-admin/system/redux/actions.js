import { SystemServices } from "./services";
import { SystemConstants } from "./constants";
const FileDownload = require("js-file-download");

export const SystemActions = {
    getBackups,
    getConfigBackup,
    createBackup,
    configBackup,
    deleteBackup,
    restore,
    editBackupInfo,
    downloadBackupVersion
}

function getBackups() {
    return dispatch => {
        dispatch({ type: SystemConstants.GET_BACKUPS_REQUEST });
        SystemServices.getBackups()
        .then(res => {
            dispatch({
                type: SystemConstants.GET_BACKUPS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(error => {
            dispatch({
                type: SystemConstants.GET_BACKUPS_FAILE,
                payload: error
            }) 
        })
    }
}

function getConfigBackup() {
    return dispatch => {
        dispatch({ type: SystemConstants.GET_CONFIG_BACKUP_REQUEST });
        SystemServices.getConfigBackup()
        .then(res => {
            dispatch({
                type: SystemConstants.GET_CONFIG_BACKUP_SUCCESS,
                payload: res.data.content.backup
            })
        })
        .catch(error => {
            dispatch({
                type: SystemConstants.GET_CONFIG_BACKUP_FAILE,
                payload: error
            }) 
        })
    }
}

function deleteBackup(version) {
    return dispatch => {
        dispatch({ type: SystemConstants.DELETE_BACKUP_REQUEST });

        SystemServices.deleteBackup(version)
            .then(res => {
                dispatch({
                    type: SystemConstants.DELETE_BACKUP_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemConstants.DELETE_BACKUP_FAILE,
                    payload: error
                })
                
            })
    }
}

function createBackup() {
    return dispatch => {
        dispatch({ type: SystemConstants.CREATE_BACKUP_REQUEST });

        SystemServices.createBackup()
            .then(res => {
                dispatch({
                    type: SystemConstants.CREATE_BACKUP_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemConstants.CREATE_BACKUP_FAILE,
                    payload: error
                })
                
            })
    }
}

function configBackup(params, data=undefined) {
    return dispatch => {
        dispatch({ type: SystemConstants.CONFIG_BACKUP_REQUEST });

        SystemServices.configBackup(params, data)
            .then(res => {
                dispatch({
                    type: SystemConstants.CONFIG_BACKUP_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemConstants.CONFIG_BACKUP_FAILE,
                    payload: error
                })
                
            })
    }
}

function restore(version) {
    return dispatch => {
        dispatch({ type: SystemConstants.RESTORE_REQUEST });

        SystemServices.restore(version)
            .then(res => {
                dispatch({
                    type: SystemConstants.RESTORE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemConstants.RESTORE_FAILE,
                    payload: error
                })
                
            })
    }
}

function editBackupInfo(version, data) {
    return dispatch => {
        dispatch({ type: SystemConstants.EDIT_BACKUP_INFO_REQUEST });

        SystemServices.editBackupInfo(version, data)
            .then(res => {
                dispatch({
                    type: SystemConstants.EDIT_BACKUP_INFO_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemConstants.EDIT_BACKUP_INFO_FAILE,
                    payload: error
                })
            })
    }
}

function downloadBackupVersion(path) {
    return dispatch => {
        dispatch({ type: SystemConstants.DOWNLOAD_BACKUP_VERSION_REQUEST });

        SystemServices.downloadBackupVersion(path)
            .then(res => {
                dispatch({ type: SystemConstants.DOWNLOAD_BACKUP_VERSION_SUCCESS })
                const content = res.headers["content-type"];
                FileDownload(res.data, 'data', content);
            })
            .catch(error => {
                dispatch({ type: SystemConstants.DOWNLOAD_BACKUP_VERSION_FAILE })
            })
    }
}

