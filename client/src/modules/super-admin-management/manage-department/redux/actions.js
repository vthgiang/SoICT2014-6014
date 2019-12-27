import { DepartmentServices } from "./services";
import { DepartmentConstants } from "./constants";

export const get = () => {
    return dispatch => {
        dispatch({ type: DepartmentConstants.GET_DEPARTMENTS_REQUEST});
        DepartmentServices.get()
            .then(res => {
                dispatch({
                    type: DepartmentConstants.GET_DEPARTMENTS_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const create = (data) => {
    return dispatch => {
        dispatch({ type: DepartmentConstants.CREATE_DEPARTMENT_REQUEST});
        DepartmentServices.create(data)
            .then(res => {
                dispatch({
                    type: DepartmentConstants.CREATE_DEPARTMENT_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}