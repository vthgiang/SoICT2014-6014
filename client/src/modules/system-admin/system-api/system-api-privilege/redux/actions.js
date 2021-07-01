import { PrivilegeApiServices } from "./services";
import { PrivilegeApiContants } from "./constants";

export const PrivilegeApiActions = {
    getPrivilegeApis,
    createPrivilegeApi,
}

function createPrivilegeApi(data) {
    return dispatch => {
        dispatch({ type: PrivilegeApiContants.CREATE_PRIVILEGE_API_REQUEST });

        PrivilegeApiServices.createPrivilegeApi(data)
            .then(res => {
                dispatch({
                    type: PrivilegeApiContants.CREATE_PRIVILEGE_API_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: PrivilegeApiContants.CREATE_PRIVILEGE_API_FAILURE,
                    payload: error
                });
                
            })
    }
}

function getPrivilegeApis(data) {
    return dispatch => {
        dispatch({ type: PrivilegeApiContants.GET_PRIVILEGE_API_REQUEST });

        PrivilegeApiServices.getPrivilegeApis(data)
            .then(res => {
                dispatch({
                    type: PrivilegeApiContants.GET_PRIVILEGE_API_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: PrivilegeApiContants.GET_PRIVILEGE_API_FAILURE,
                    payload: error
                });
                
            })
    }
}

