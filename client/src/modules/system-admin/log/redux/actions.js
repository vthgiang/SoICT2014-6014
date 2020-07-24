import { LogServices } from "./services";
import { LogConstants } from "./constants";

export const LogActions = {
    getLogState,
    toggleLogState
}

function getLogState() {
    return dispatch => {
        dispatch({ type: LogConstants.GET_LOG_STATE_REQUEST });

        LogServices.getLogState()
            .then(res => {
                dispatch({
                    type: LogConstants.GET_LOG_STATE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: LogConstants.GET_LOG_STATE_FAILURE,
                    payload: error
                })
                
            })
    }
}

function toggleLogState() {
    return dispatch => {
        dispatch({ type: LogConstants.TOGGLE_LOG_STATE_REQUEST });

        LogServices.toggleLogState()
            .then(res => {
                dispatch({
                    type: LogConstants.TOGGLE_LOG_STATE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: LogConstants.TOGGLE_LOG_STATE_FAILURE,
                    payload: error
                })
                
            })
    }
}