import { createKpiSetConstants } from "./constants";
import { createKpiSetService } from "./services";
export const createKpiSetActions = {
    getEmployeeKpiSet,
    getAllEmployeeKpiSetByMonth,
    editEmployeeKpiSet,
    updateEmployeeKpiSetStatus,
    deleteEmployeeKpiSet,
    deleteEmployeeKpi,

    createEmployeeKpi,
    editEmployeeKpi,
    createEmployeeKpiSet,
    approveEmployeeKpiSet,
    createComment,
    editComment,
    deleteComment,
    createCommentOfComment,
    editCommentOfComment,
    deleteCommentOfComment    
};


// Lấy tập KPI cá nhân hiện tại
function getEmployeeKpiSet() {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.GET_EMPLOYEE_KPI_SET_REQUEST });

        createKpiSetService.getEmployeeKpiSet()
            .then(res => {
                dispatch({ 
                    type: createKpiSetConstants.GET_EMPLOYEE_KPI_SET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: createKpiSetConstants.GET_EMPLOYEE_KPI_SET_FAILURE,
                    payload: error
                })
            })
    }
}

// Lấy tất cả các tập KPI của 1 nhân viên theo thời gian cho trước
function getAllEmployeeKpiSetByMonth(userId, startDate, endDate) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_BY_MONTH_REQUEST });

        createKpiSetService.getAllEmployeeKpiSetByMonth(userId, startDate, endDate)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_BY_MONTH_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_BY_MONTH_FAILURE,
                    payload: error
                })
            })
    }
}

// Chỉnh sửa thông tin chung của KPI cá nhân
function editEmployeeKpiSet(id, kpipersonal) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.EDIT_EMPLOYEE_KPI_SET_REQUEST });

        createKpiSetService.editEmployeeKpiSet(id, kpipersonal)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.EDIT_EMPLOYEE_KPI_SET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.EDIT_EMPLOYEE_KPI_SET_FAILURE,
                    payload: error
                })
            }) 
    };
}

// Chỉnh sửa trạng thái của KPI cá nhân
function updateEmployeeKpiSetStatus(id, status) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.UPDATE_EMPLOYEE_KPI_SET_STATUS_REQUEST });

        createKpiSetService.updateEmployeeKpiSetStatus(id, status)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.UPDATE_EMPLOYEE_KPI_SET_STATUS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.UPDATE_EMPLOYEE_KPI_SET_STATUS_FAILURE,
                    payload: error
                })
            })
    };
}


// Xóa KPI cá nhân
function deleteEmployeeKpiSet(id) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.DELETE_EMPLOYEE_KPI_SET_REQUEST });

        createKpiSetService.deleteEmployeeKpiSet(id)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.DELETE_EMPLOYEE_KPI_SET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.DELETE_EMPLOYEE_KPI_SET_FAILURE,
                    payload: error
                })
            })
    };
}


// Xóa mục tiêu KPI cá nhân
function deleteEmployeeKpi(id, kpipersonal) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.DELETE_EMPLOYEE_KPI_REQUEST });

        createKpiSetService.deleteEmployeeKpi(id, kpipersonal)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.DELETE_EMPLOYEE_KPI_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.DELETE_EMPLOYEE_KPI_FAILURE,
                    payload: error
                })
            })
    };
}

// Tạo 1 mục tiêu KPI cá nhân mới
function createEmployeeKpi(newTarget) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.CREATE_EMPLOYEE_KPI_REQUEST });

        createKpiSetService.createEmployeeKpi(newTarget)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.CREATE_EMPLOYEE_KPI_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.CREATE_EMPLOYEE_KPI_FAILURE,
                    payload: error
                })
            })
    };
}

// Chỉnh sửa mục tiêu KPI cá nhân
function editEmployeeKpi(id, newTarget) {
    return dispatch => {
        dispatch({ 
            type: createKpiSetConstants.EDIT_EMPLOYEE_KPI_REQUEST,
            payload: id
        });

        createKpiSetService.editEmployeeKpi(id, newTarget)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.EDIT_EMPLOYEE_KPI_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.EDIT_EMPLOYEE_KPI_FAILURE,
                    payload: error
                })
            })
    };
}

// Khởi tạo KPI cá nhân
function createEmployeeKpiSet(newKPI) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.CREATE_EMPLOYEE_KPI_SET_REQUEST });

        createKpiSetService.createEmployeeKpiSet(newKPI)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.CREATE_EMPLOYEE_KPI_SET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.CREATE_EMPLOYEE_KPI_SET_FAILURE,
                    payload: error
                })
            })
    };
}

// Phê duyệt toàn bộ KPI cá nhân
function approveEmployeeKpiSet(id) {
    return dispatch => {
        dispatch({ type: createKpiSetConstants.APPROVE_EMPLOYEE_KPI_SET_REQUEST });

        createKpiSetService.approveEmployeeKpiSet(id)
            .then(res => {
                dispatch({
                    type: createKpiSetConstants.APPROVE_EMPLOYEE_KPI_SET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: createKpiSetConstants.APPROVE_KPIPERSONAL_FAILURE,
                    payload: error
                })
            })
    };
}

function createComment(data) {
    return dispatch => {
        dispatch({type: createKpiSetConstants.CREATE_COMMENT_REQUEST});
        createKpiSetService.createComment(data)
            .then(res=>{
                dispatch({
                    type: createKpiSetConstants.CREATE_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.CREATE_COMMENT_FAILURE,
                    payload : error
                })
            })
    }
}

function editComment(id,data) {
    return dispatch => {
        dispatch({type: createKpiSetConstants.EDIT_COMMENT_REQUEST});
        createKpiSetService.editComment(id,data)
            .then(res=>{
                dispatch({
                    type: createKpiSetConstants.EDIT_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.EDIT_COMMENT_FAILURE,
                    payload : error
                })
            })
    }
}
function deleteComment(id,idKPI) {
    return dispatch => {
        dispatch({type: createKpiSetConstants.DELETE_COMMENT_REQUEST});
        createKpiSetService.deleteComment(id,idKPI)
            .then(res=>{
                dispatch({
                    type: createKpiSetConstants.DELETE_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.DELETE_COMMENT_FAILURE,
                    payload : error
                })
            })
    }
}


function createCommentOfComment(data) {
    return dispatch => {
        dispatch({type: createKpiSetConstants.CREATE_COMMENT_OF_COMMENT_REQUEST});
        createKpiSetService.createCommentOfComment(data)
            .then(res=>{
                dispatch({
                    type: createKpiSetConstants.CREATE_COMMENT_OF_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.CREATE_COMMENT_OF_COMMENT_FAILURE,
                    payload : error
                })
            })
    }
}

function editCommentOfComment(id,data) {
    return dispatch => {
        dispatch({type: createKpiSetConstants.EDIT_COMMENT_OF_COMMENT_REQUEST});
        createKpiSetService.editCommentOfComment(id,data)
            .then(res=>{
                dispatch({
                    type: createKpiSetConstants.EDIT_COMMENT_OF_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.EDIT_COMMENT_OF_COMMENT_FAILURE,
                    payload : error
                })
            })
    }
}

function deleteCommentOfComment(id,idKPI) {
    return dispatch => {
        dispatch({type: createKpiSetConstants.DELETE_COMMENT_OF_COMMENT_REQUEST});
        createKpiSetService.deleteCommentOfComment(id,idKPI)
            .then(res=>{
                dispatch({
                    type: createKpiSetConstants.DELETE_COMMENT_OF_COMMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiSetConstants.DELETE_COMMENT_OF_COMMENT_FAILURE,
                    payload : error
                })
            })
    }
}
