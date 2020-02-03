import { SystemServices } from "./services";
import { SystemConsts } from "./constants";

export const getLogState = () => {
    return dispatch => {
        dispatch({ type: SystemConsts.GET_LOG_STATE_REQUEST});
        SystemServices.getLogState()
            .then(res => {
                dispatch({
                    type: SystemConsts.GET_LOG_STATE_REQUEST_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                dispatch({
                    type: SystemConsts.GET_LOG_STATE_REQUEST_FAILE,
                    payload: err.response
                })
            })
    }
}

export const toggleLogState = () => {
    return dispatch => {
        dispatch({ type: SystemConsts.TOGGLE_LOG_STATE_REQUEST});
        SystemServices.toggleLogState()
            .then(res => {
                dispatch({
                    type: SystemConsts.TOGGLE_LOG_STATE_REQUEST_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                dispatch({
                    type: SystemConsts.TOGGLE_LOG_STATE_REQUEST_FAILE,
                    payload: err.response
                })
            })
    }
}