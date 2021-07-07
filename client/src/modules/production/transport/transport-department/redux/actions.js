import { transportDepartmentConstants } from './constants';
import { transportDepartmentServices } from './services';

export const transportDepartmentActions = {
    getAllTransportDepartments,
    createTransportDepartment,
    getUserByRole,
    deleteTransportDepartment,
}

function getAllTransportDepartments(queryData) {
    return (dispatch) => {
        dispatch({
            type: transportDepartmentConstants.GET_ALL_TRANSPORT_DEPARTMENTS_REQUEST
        });

        transportDepartmentServices
            .getAllTransportDepartments(queryData)
            .then((res) => {
                dispatch({
                    type: transportDepartmentConstants.GET_ALL_TRANSPORT_DEPARTMENTS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportDepartmentConstants.GET_ALL_TRANSPORT_DEPARTMENTS_FAILURE,
                    error
                });
            });
    }
}

function createTransportDepartment(data) {
    return (dispatch) => {
        dispatch({
            type: transportDepartmentConstants.CREATE_TRANSPORT_DEPARTMENT_REQUEST
        });
        transportDepartmentServices
            .createTransportDepartment(data)
            .then((res) => {
                dispatch({
                    type: transportDepartmentConstants.CREATE_TRANSPORT_DEPARTMENT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportDepartmentConstants.CREATE_TRANSPORT_DEPARTMENT_FAILURE,
                    error
                });
            });
    }
}

function getUserByRole(queryData) {
    return (dispatch) => {
        dispatch({
            type: transportDepartmentConstants.GET_USER_BY_ROLE_REQUEST
        });

        transportDepartmentServices
            .getUserByRole(queryData)
            .then((res) => {
                dispatch({
                    type: transportDepartmentConstants.GET_USER_BY_ROLE_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportDepartmentConstants.GET_USER_BY_ROLE_FAILURE,
                    error
                });
            });
    } 
}
function deleteTransportDepartment(id) {
    return (dispatch) => {
        dispatch({
            type: transportDepartmentConstants.DELETE_TRANSPORT_DEPARTMENT_SUCCESS
        });

        transportDepartmentServices
            .deleteTransportDepartment(id)
            .then((res) => {
                dispatch({
                    type: transportDepartmentConstants.DELETE_TRANSPORT_DEPARTMENT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportDepartmentConstants.DELETE_TRANSPORT_DEPARTMENT_FAILURE,
                    error
                });
            });
    }
}