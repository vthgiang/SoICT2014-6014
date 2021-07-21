import { PrivilegeApiServices } from "./services";
import { PrivilegeApiContants } from "./constants";

export const PrivilegeApiActions = {
    getPrivilegeApis,
    createPrivilegeApi,
    updateStatusPrivilegeApi,
    deletePrivilegeApis
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

function updateStatusPrivilegeApi(data) {
    return dispatch => {
        dispatch({ type: PrivilegeApiContants.UPDATE_STATUS_PRIVILEGE_API_REQUEST });

        PrivilegeApiServices.updateStatusPrivilegeApi(data)
            .then(res => {
                dispatch({
                    type: PrivilegeApiContants.UPDATE_STATUS_PRIVILEGE_API_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: PrivilegeApiContants.UPDATE_STATUS_PRIVILEGE_API_FAILURE,
                    payload: error
                });
                
            })
    }
}

function deletePrivilegeApis(data) {
    return dispatch => {
        dispatch({ type: PrivilegeApiContants.DELETE_PRIVILEGE_APIS_REQUEST });

        PrivilegeApiServices.deletePrivilegeApis(data)
            .then(res => {
                dispatch({
                    type: PrivilegeApiContants.DELETE_PRIVILEGE_APIS_SUCCESS,
                    payload: res.data.content,
                    privilegeApiIds: data.privilegeApiIds
                })
            })
            .catch(error => {
                dispatch({ 
                    type: PrivilegeApiContants.DELETE_PRIVILEGE_APIS_FAILURE,
                    payload: error
                });
                
            })
    }
}


