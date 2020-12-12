import { AdminDepartmentConstants } from './constants';
import { AdminDepartmentServices } from './services';

export const AdminDepartmentActions = {
    getAllAdminDepartments,
    createAdminDepartment,
    editAdminDepartment,
}

function getAllAdminDepartments(queryData) {
    return (dispatch) => {
        dispatch({
            type: AdminDepartmentConstants.GET_ALL_ADMIN_DEPARTMENT_REQUEST
        });
        AdminDepartmentServices.getAllAdminDepartments(queryData)
            .then((res) => {
                console.log(res.data);
                dispatch({
                    type: AdminDepartmentConstants.GET_ALL_ADMIN_DEPARTMENT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: AdminDepartmentConstants.GET_ALL_ADMIN_DEPARTMENT_FAILURE,
                    error
                });
            });

    }
}

function createAdminDepartment(data) {
    return (dispatch) => {
        dispatch({
            type: AdminDepartmentConstants.CREATE_ADMIN_DEPARTMENT_REQUEST
        });
        AdminDepartmentServices.createAdminDepartment(data)
            .then((res) => {
                dispatch({
                    type: AdminDepartmentConstants.CREATE_ADMIN_DEPARTMENT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: AdminDepartmentConstants.CREATE_ADMIN_DEPARTMENT_FAILURE,
                    error
                });
            });
    }
}

function editAdminDepartment(id, data) {
    return (dispatch) => {
        dispatch({
            type: AdminDepartmentConstants.UPDATE_ADMIN_DEPARTMENT_REQUEST
        });
        AdminDepartmentServices.editAdminDepartment(id, data)
            .then((res) => {
                dispatch({
                    type: AdminDepartmentConstants.UPDATE_ADMIN_DEPARTMENT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: AdminDepartmentConstants.UPDATE_ADMIN_DEPARTMENT_FAILURE,
                    error
                });
            });
    }
}