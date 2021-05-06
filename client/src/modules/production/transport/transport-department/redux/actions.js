import { transportDepartmentConstants } from './constants';
import { transportDepartmentServices } from './services';

export const transportDepartmentActions = {
    getAllTransportDepartments,
    createTransportDepartment,
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
