import { BusinessDepartmentConstants } from './constants';
import { BusinessDepartmentServices } from './services';

export const BusinessDepartmentActions = {
    getAllBusinessDepartments,
    createBusinessDepartment,
    editBusinessDepartment,
}

function getAllBusinessDepartments(queryData) {
    return (dispatch) => {
        dispatch({
            type: BusinessDepartmentConstants.GET_ALL_BUSINESS_DEPARTMENT_REQUEST
        });
        BusinessDepartmentServices.getAllBusinessDepartments(queryData)
            .then((res) => {
                console.log(res.data);
                dispatch({
                    type: BusinessDepartmentConstants.GET_ALL_BUSINESS_DEPARTMENT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: BusinessDepartmentConstants.GET_ALL_BUSINESS_DEPARTMENT_FAILURE,
                    error
                });
            });

    }
}

function createBusinessDepartment(data) {
    return (dispatch) => {
        dispatch({
            type: BusinessDepartmentConstants.CREATE_BUSINESS_DEPARTMENT_REQUEST
        });
        BusinessDepartmentServices.createBusinessDepartment(data)
            .then((res) => {
                dispatch({
                    type: BusinessDepartmentConstants.CREATE_BUSINESS_DEPARTMENT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: BusinessDepartmentConstants.CREATE_BUSINESS_DEPARTMENT_FAILURE,
                    error
                });
            });
    }
}

function editBusinessDepartment(id, data) {
    return (dispatch) => {
        dispatch({
            type: BusinessDepartmentConstants.UPDATE_BUSINESS_DEPARTMENT_REQUEST
        });
        BusinessDepartmentServices.editBusinessDepartment(id, data)
            .then((res) => {
                dispatch({
                    type: BusinessDepartmentConstants.UPDATE_BUSINESS_DEPARTMENT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: BusinessDepartmentConstants.UPDATE_BUSINESS_DEPARTMENT_FAILURE,
                    error
                });
            });
    }
}