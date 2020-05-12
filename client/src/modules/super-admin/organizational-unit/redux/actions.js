import { DepartmentServices } from "./services";
import { DepartmentConstants } from "./constants";

export const DepartmentActions = {
    get,
    create,
    edit,
    destroy,
    getDepartmentOfUser,
    getDepartmentsThatUserIsDean,
}

function get(){
    return dispatch => {
        dispatch({ type: DepartmentConstants.GET_DEPARTMENTS_REQUEST});
        DepartmentServices.get()
            .then(res => {
                dispatch({
                    type: DepartmentConstants.GET_DEPARTMENTS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: DepartmentConstants.GET_DEPARTMENTS_FAILE});
            })
    }
}

function create(data){
    return dispatch => {
        dispatch({ type: DepartmentConstants.CREATE_DEPARTMENT_REQUEST});
        DepartmentServices
            .create(data)
            .then(res => {
                dispatch({
                    type: DepartmentConstants.CREATE_DEPARTMENT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: DepartmentConstants.CREATE_DEPARTMENT_FAILE});
            })
    }
}

function edit(data){
    return dispatch => {
        dispatch({ type: DepartmentConstants.EDIT_DEPARTMENT_REQUEST});
        DepartmentServices
            .edit(data)
            .then(res => {
                dispatch({
                    type: DepartmentConstants.EDIT_DEPARTMENT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: DepartmentConstants.EDIT_DEPARTMENT_FAILE});
            })
    }
}

function destroy(departmentId){
    return dispatch => {
        dispatch({ type: DepartmentConstants.DELETE_DEPARTMENT_REQUEST});
        DepartmentServices.destroy(departmentId)
            .then(res => {
                dispatch({
                    type: DepartmentConstants.DELETE_DEPARTMENT_SUCCESS,
                    payload: {
                        data: res.data.content,
                        id: departmentId
                    }
                });
            })
            .catch(err => {
                dispatch({ type: DepartmentConstants.DELETE_DEPARTMENT_FAILE});
            })
    }
}

function getDepartmentOfUser() {
    return dispatch => {
        dispatch(request());

        DepartmentServices.getDepartmentOfUser()
            .then(
                departments => dispatch(success(departments)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: DepartmentConstants.GETDEPARTMENT_OFUSER_REQUEST} }
    function success(departments) { return { type: DepartmentConstants.GETDEPARTMENT_OFUSER_SUCCESS, departments } }
    function failure(error) { return { type: DepartmentConstants.GETDEPARTMENT_OFUSER_FAILURE, error } }
}

function getDepartmentsThatUserIsDean(){
    return dispatch => {
        dispatch({ type: DepartmentConstants.GET_DEPARTMENTS_THAT_USER_IS_DEAN_REQUEST});
        DepartmentServices.getDepartmentsThatUserIsDean()
            .then(res => {
                dispatch({
                    type: DepartmentConstants.GET_DEPARTMENTS_THAT_USER_IS_DEAN_SUCCESS,
                    payload: {
                        data: res.data.content
                    }
                });
            })
            .catch(err => {
                dispatch({ type: DepartmentConstants.GET_DEPARTMENTS_THAT_USER_IS_DEAN_FAILURE});
            })
    }
    function request(currentRole) { return { type: DepartmentConstants.GET_DEPARTMENTS_THAT_USER_IS_DEAN_REQUEST, currentRole } }
    function success(Department) { return { type: DepartmentConstants.GET_DEPARTMENTS_THAT_USER_IS_DEAN_SUCCESS, Department } }
    function failure(error) { return { type: DepartmentConstants.GET_DEPARTMENTS_THAT_USER_IS_DEAN_FAILURE, error } }
}