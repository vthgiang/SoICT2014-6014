import { createKpiConstants } from "./constants";
import { createKpiService } from "./services";
export const createKpiActions = {
    getCurrentKPIPersonal,
    editKPIPersonal,
    editStatusKPIPersonal,
    deleteKPIPersonal,
    deleteTarget,

    addNewTargetPersonal,
    editTargetKPIPersonal,
    createKPIPersonal,
    approveKPIPersonal
};


// Lấy KPI cá nhân hiện tại
function getCurrentKPIPersonal() {
    return dispatch => {
        dispatch({ type: createKpiConstants.GETCURRENT_KPIPERSONAL_REQUEST });

        createKpiService.getCurrentKPIPersonal()
            .then(res => {
                dispatch({ 
                    type: createKpiConstants.GETCURRENT_KPIPERSONAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: createKpiConstants.GETCURRENT_KPIPERSONAL_FAILURE,
                    payload: error
                })
            })
    }
}


// Chỉnh sửa KPI cá nhân
function editKPIPersonal(id, kpipersonal) {
    return dispatch => {
        dispatch({ type: createKpiConstants.EDIT_KPIPERSONAL_REQUEST });

        createKpiService.editKPIPersonal(id, kpipersonal)
            .then(res => {
                dispatch({
                    type: createKpiConstants.EDIT_KPIPERSONAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiConstants.EDIT_KPIPERSONAL_FAILURE,
                    payload: error
                })
            }) 
    };
}

// Chỉnh sửa trạng thái KPI cá nhân
function editStatusKPIPersonal(id, status) {
    return dispatch => {
        dispatch({ type: createKpiConstants.EDITSTATUS_KPIPERSONAL_REQUEST });

        createKpiService.editStatusKPIPersonal(id, status)
            .then(res => {
                dispatch({
                    type: createKpiConstants.EDITSTATUS_KPIPERSONAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiConstants.EDITSTATUS_KPIPERSONAL_FAILURE,
                    payload: error
                })
            })
    };
}


// Xóa KPI cá nhân
function deleteKPIPersonal(id) {
    return dispatch => {
        dispatch({ type: createKpiConstants.DELETE_KPIPERSONAL_REQUEST });

        createKpiService.deleteKPIPersonal(id)
            .then(res => {
                dispatch({
                    type: createKpiConstants.DELETE_KPIPERSONAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiConstants.DELETE_KPIPERSONAL_FAILURE,
                    payload: error
                })
            })
    };
}


// Xóa mục tiêu KPI cá nhân
function deleteTarget(id, kpipersonal) {
    return dispatch => {
        dispatch({ type: createKpiConstants.DELETETARGET_KPIPERSONAL_REQUEST });

        createKpiService.deleteTarget(id, kpipersonal)
            .then(res => {
                dispatch({
                    type: createKpiConstants.DELETETARGET_KPIPERSONAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiConstants.DELETETARGET_KPIPERSONAL_FAILURE,
                    payload: error
                })
            })
    };
}

// thêm mục tiêu KPI cá nhân
function addNewTargetPersonal(newTarget) {
    console.log(newTarget);
    return dispatch => {
        dispatch({ type: createKpiConstants.ADDTARGET_KPIPERSONAL_REQUEST });

        createKpiService.addNewTargetPersonal(newTarget)
            .then(res => {
                dispatch({
                    type: createKpiConstants.ADDTARGET_KPIPERSONAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiConstants.ADDTARGET_KPIPERSONAL_FAILURE,
                    payload: error
                })
            })
    };
}

// Chỉnh sửa mục tiêu KPI cá nhân
function editTargetKPIPersonal(id, newTarget) {
    return dispatch => {
        dispatch({ 
            type: createKpiConstants.EDITTARGET_KPIPERSONAL_REQUEST,
            payload: id
        });

        createKpiService.editTargetKPIPersonal(id, newTarget)
            .then(res => {
                dispatch({
                    type: createKpiConstants.EDITTARGET_KPIPERSONAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiConstants.EDITTARGET_KPIPERSONAL_FAILURE,
                    payload: error
                })
            })
    };
}

// Khởi tạo KPI cá nhân
function createKPIPersonal(newKPI) {
    return dispatch => {
        dispatch({ type: createKpiConstants.ADD_KPIPERSONAL_REQUEST });

        createKpiService.createKPIPersonal(newKPI)
            .then(res => {
                dispatch({
                    type: createKpiConstants.ADD_KPIPERSONAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createKpiConstants.ADD_KPIPERSONAL_FAILURE,
                    payload: error
                })
            })
    };
}

// Phê duyệt toàn bộ KPI cá nhân
function approveKPIPersonal(id) {
    return dispatch => {
        dispatch({ type: createKpiConstants.APPROVE_KPIPERSONAL_REQUEST });

        createKpiService.approveKPIPersonal(id)
            .then(res => {
                dispatch({
                    type: createKpiConstants.APPROVE_KPIPERSONAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: createKpiConstants.APPROVE_KPIPERSONAL_FAILURE,
                    payload: error
                })
            })
    };
}