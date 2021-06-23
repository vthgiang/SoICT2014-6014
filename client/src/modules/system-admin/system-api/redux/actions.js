import { SystemApiServices } from "./services";
import { SystemApiConstants } from "./constants";

export const SystemApiActions = {
    getSystemApis,
    createSystemApi,
    updateSystemApiAutomatic
}

function getSystemApis(data) {
    return dispatch => {
        dispatch({ type: SystemApiConstants.GET_SYSTEM_API_REQUEST });

        SystemApiServices.getSystemApis(data)
            .then(res => {
                dispatch({
                    type: SystemApiConstants.GET_SYSTEM_API_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: SystemApiConstants.GET_SYSTEM_API_FAILURE,
                    payload: error
                });
                
            })
    }
}

function createSystemApi(data) {
    return dispatch => {
        dispatch({ type: SystemApiConstants.CREATE_SYSTEM_API_REQUEST });

        SystemApiServices.createSystemApi(data)
            .then(res => {
                dispatch({
                    type: SystemApiConstants.CREATE_SYSTEM_API_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: SystemApiConstants.CREATE_SYSTEM_API_FAILURE,
                    payload: error
                });
                
            })
    }
}

function updateSystemApiAutomatic() {
    return dispatch => {
        dispatch({
            type: SystemApiConstants.UPDATE_AUTO_SYSTEM_API_REQUEST,
        })

        SystemApiServices.updateSystemApiAutomatic()
            .then(res => {
                dispatch({
                    type: SystemApiConstants.UPDATE_AUTO_SYSTEM_API_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: SystemApiConstants.UPDATE_AUTO_SYSTEM_API_FAILURE,
                    payload: error
                });
                
            })
    }
}

