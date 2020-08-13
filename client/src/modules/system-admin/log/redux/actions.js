import { LogServices } from "./services";
import { LogConstants } from "./constants";

export const LogActions = {
    backupDatabase,
    restoreDatabase
}

function backupDatabase() {
    return dispatch => {
        dispatch({ type: LogConstants.BACKUP_DATABASE_REQUEST });

        LogServices.backupDatabase()
            .then(res => {
                dispatch({
                    type: LogConstants.BACKUP_DATABASE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: LogConstants.BACKUP_DATABASE_FAILURE,
                    payload: error
                })
                
            })
    }
}

function restoreDatabase() {
    return dispatch => {
        dispatch({ type: LogConstants.RESTORE_DATABASE_REQUEST });

        LogServices.restoreDatabase()
            .then(res => {
                dispatch({
                    type: LogConstants.RESTORE_DATABASE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: LogConstants.RESTORE_DATABASE_FAILURE,
                    payload: error
                })
                
            })
    }
}
