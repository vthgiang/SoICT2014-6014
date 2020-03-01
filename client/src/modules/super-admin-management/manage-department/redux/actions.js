import { DepartmentServices } from "./services";
import { DepartmentConstants } from "./constants";

export const DepartmentActions = {
    get,
    create,
    destroy,
    getAll,
    getDepartmentOfUser
}

function get(){
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

function create(data){
    return dispatch => {
        dispatch({ type: DepartmentConstants.CREATE_DEPARTMENT_REQUEST});
        return new Promise((resolve, reject) => {
            DepartmentServices
                .create(data)
                .then(res => {
                    dispatch({
                        type: DepartmentConstants.CREATE_DEPARTMENT_SUCCESS,
                        payload: res.data
                    });
                    resolve(res.data);
                })
                .catch(err => {
                    console.log("Error: ", err);
                    reject(err);
                })
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
                        data: res.data,
                        id: departmentId
                    }
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        DepartmentServices.getAll()
            .then(
                departments => dispatch(success(departments)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: DepartmentConstants.GETALL_REQUEST} }
    function success(departments) { return { type: DepartmentConstants.GETALL_SUCCESS, departments } }
    function failure(error) { return { type: DepartmentConstants.GETALL_FAILURE, error } }
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