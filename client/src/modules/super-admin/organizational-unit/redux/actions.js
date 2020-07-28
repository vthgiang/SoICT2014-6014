import { DepartmentServices } from "./services";
import { DepartmentConstants } from "./constants";

export const DepartmentActions = {
    get,
    create,
    edit,
    destroy,
    getDepartmentsThatUserIsDean,
}

/**
 * Lấy danh sách các đơn vị trong công ty
 */
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

/**
 * Tạo đơn vị 
 * @data thông tin về đơn vị
 */
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

/**
 * Chỉnh sửa thông tin đơn vị
 * @data dữ liệu sửa
 */
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

/**
 * Xóa đơn vị
 * @departmentId id của đơn vị
 */
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

/**
 * Lấy thông tin đơn vị mà user làm trưởng
 */
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