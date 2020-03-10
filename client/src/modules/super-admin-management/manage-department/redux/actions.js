import { DepartmentServices } from "./services";
import { DepartmentConstants } from "./constants";

export const DepartmentActions = {
    get,
    create,
    edit,
    destroy,
    getAll,
    getDepartmentOfUser
}

function get(){
    return dispatch => {
        dispatch({ type: DepartmentConstants.GET_DEPARTMENTS_REQUEST});
        return new Promise((resolve, reject) => {
            DepartmentServices.get()
                .then(res => {
                    dispatch({
                        type: DepartmentConstants.GET_DEPARTMENTS_SUCCESS,
                        payload: res.data
                    });
                    resolve(res);
                })
                .catch(err => {
                    console.log("Error: ", err);
                    if(err.response.data.msg === 'USER_ROLE_INVALID' || err.response.data.msg === 'PRIVILEGE_INVALID'){
                        alert("Phân quyền của bạn không hợp lệ hoặc đã bị thay đổi! Vui lòng đăng nhập lại!");
                        localStorage.clear();
                        dispatch({
                            type: 'RESET_APP'
                        })
                    }else{
                        dispatch({
                            type: DepartmentConstants.GET_DEPARTMENTS_FAILE
                        });
                        reject(err);
                    }
                })
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
                    dispatch({
                        type: DepartmentConstants.CREATE_DEPARTMENT_FAILE
                    })
                    console.log("Error: ", err);
                    reject(err);
                })
        })
    }
}

function edit(data){
    return dispatch => {
        dispatch({ type: DepartmentConstants.EDIT_DEPARTMENT_REQUEST});
        return new Promise((resolve, reject) => {
            DepartmentServices
                .edit(data)
                .then(res => {
                    dispatch({
                        type: DepartmentConstants.EDIT_DEPARTMENT_SUCCESS,
                        payload: res.data
                    });
                    resolve(res.data);
                })
                .catch(err => {
                    dispatch({
                        type: DepartmentConstants.EDIT_DEPARTMENT_FAILE
                    })
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
                dispatch({
                    type: DepartmentConstants.DELETE_DEPARTMENT_FAILE
                })
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