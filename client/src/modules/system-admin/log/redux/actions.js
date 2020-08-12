import { LogServices } from "./services";
import { LogConstants } from "./constants";

export const LogActions = {
    backupDatabase
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
