import { SystemPageServices } from "./services";
import { SystemPageConstants } from "./constants";

const getPageApis = (data) => {
    return dispatch => {
        dispatch({ type: SystemPageConstants.GET_SYSTEM_PAGE_APIS });

        SystemPageServices.getPageApis(data)
            .then(res => {
                dispatch({
                    type: SystemPageConstants.GET_SYSTEM_PAGE_APIS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: SystemPageConstants.GET_SYSTEM_PAGE_APIS_FAILURE,
                    payload: error
                });

            })
    }
}
const getSystemAdminPage = (queryData) => {
    return dispatch => {
        dispatch({
            type: SystemPageConstants.GET_SYSTEM_ADMIN_PAGE_REQUEST
        })
        SystemPageServices
            .getSystemAdminPage(queryData)
            .then((res) => {
                dispatch({
                    type: SystemPageConstants.GET_SYSTEM_ADMIN_PAGE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: SystemPageConstants.GET_SYSTEM_ADMIN_PAGE_FAILURE,
                    error
                });
            });
    }
}
const addSystemAdminPage = (data) => {
    return dispatch => {
        dispatch({
            type: SystemPageConstants.ADD_SYSTEM_ADMIN_PAGE_REQUEST
        })
        SystemPageServices
            .addSystemAdminPage(data)
            .then((res) => {
                dispatch({
                    type: SystemPageConstants.ADD_SYSTEM_ADMIN_PAGE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: SystemPageConstants.ADD_SYSTEM_ADMIN_PAGE_FAILURE,
                    error
                });
            });
    }
}

const deleteSystemAdminPage = (data) => {
    return (dispatch) => {
        dispatch({
            type: SystemPageConstants.DEL_SYSTEM_ADMIN_PAGE_REQUEST
        });

        SystemPageServices
            .deleteSystemAdminPage(data)
            .then((res) => {
                dispatch({
                    type: SystemPageConstants.DEL_SYSTEM_ADMIN_PAGE_SUCCESS,
                    payload: res.data.content,
                    exampleIds: data.exampleIds
                });
            })
            .catch((error) => {
                dispatch({
                    type: SystemPageConstants.DEL_SYSTEM_ADMIN_PAGE_FAILURE,
                    error
                });
            });
    }
}

export const SystemPageActions = {
    getPageApis,
    getSystemAdminPage,
    addSystemAdminPage,
    deleteSystemAdminPage
}