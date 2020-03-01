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
function getCurrentKPIPersonal(id) {
    return dispatch => {
        dispatch(request(id));

        createKpiService.getCurrentKPIPersonal(id)
            .then(
                kpipersonal => dispatch(success(kpipersonal)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(id) { return { type: createKpiConstants.GETCURRENT_KPIPERSONAL_REQUEST, id } }
    function success(kpipersonal) { return { type: createKpiConstants.GETCURRENT_KPIPERSONAL_SUCCESS, kpipersonal } }
    function failure(error) { return { type: createKpiConstants.GETCURRENT_KPIPERSONAL_FAILURE, error } }
}


// Chỉnh sửa KPI cá nhân
function editKPIPersonal(id, kpipersonal) {
    return dispatch => {
        dispatch(request(id));

        createKpiService.editKPIPersonal(id, kpipersonal)
            .then(
                kpipersonal => { 
                    dispatch(success(kpipersonal));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(id) { return { type: createKpiConstants.EDIT_KPIPERSONAL_REQUEST, id } }
    function success(kpipersonal) { return { type: createKpiConstants.EDIT_KPIPERSONAL_SUCCESS, kpipersonal } }
    function failure(error) { return { type: createKpiConstants.EDIT_KPIPERSONAL_FAILURE, error } }
}

// Chỉnh sửa trạng thái KPI cá nhân
function editStatusKPIPersonal(id, status) {
    return dispatch => {
        dispatch(request(id));
        createKpiService.editStatusKPIPersonal(id, status)
            .then(
                newKPI => { 
                    dispatch(success(newKPI));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(id) { return { type: createKpiConstants.EDITSTATUS_KPIPERSONAL_REQUEST, id } }
    function success(newKPI) { return { type: createKpiConstants.EDITSTATUS_KPIPERSONAL_SUCCESS, newKPI } }
    function failure(error) { return { type: createKpiConstants.EDITSTATUS_KPIPERSONAL_FAILURE, error } }
}


// Xóa KPI cá nhân
function deleteKPIPersonal(id) {
    return dispatch => {
        dispatch(request(id));

        createKpiService.deleteKPIPersonal(id)
            .then(
                target => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: createKpiConstants.DELETE_KPIPERSONAL_REQUEST, id } }
    function success(id) { return { type: createKpiConstants.DELETE_KPIPERSONAL_SUCCESS, id } }
    function failure(id, error) { return { type: createKpiConstants.DELETE_KPIPERSONAL_FAILURE, id, error } }
}


// Xóa mục tiêu KPI cá nhân
function deleteTarget(id, kpipersonal) {
    return dispatch => {
        dispatch(request(id));

        createKpiService.deleteTarget(id, kpipersonal)
            .then(
                newKPI => dispatch(success(newKPI)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: createKpiConstants.DELETETARGET_KPIPERSONAL_REQUEST, id } }
    function success(newKPI) { return { type: createKpiConstants.DELETETARGET_KPIPERSONAL_SUCCESS, newKPI } }
    function failure(id, error) { return { type: createKpiConstants.DELETETARGET_KPIPERSONAL_FAILURE, id, error } }
}

// thêm mục tiêu KPI cá nhân
function addNewTargetPersonal(newTarget) {
    console.log(newTarget);
    return dispatch => {
        dispatch(request(newTarget));

        createKpiService.addNewTargetPersonal(newTarget)
            .then(
                newKPI => { 
                    dispatch(success(newKPI));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(newTarget) { return { type: createKpiConstants.ADDTARGET_KPIPERSONAL_REQUEST, newTarget } }
    function success(newKPI) { return { type: createKpiConstants.ADDTARGET_KPIPERSONAL_SUCCESS, newKPI } }
    function failure(error) { return { type: createKpiConstants.ADDTARGET_KPIPERSONAL_FAILURE, error } }
}

// Chỉnh sửa mục tiêu KPI cá nhân
function editTargetKPIPersonal(id, newTarget) {
    return dispatch => {
        dispatch(request(id));

        createKpiService.editTargetKPIPersonal(id, newTarget)
            .then(
                newTarget => { 
                    dispatch(success(newTarget));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(id) { return { type: createKpiConstants.EDITTARGET_KPIPERSONAL_REQUEST, id } }
    function success(newTarget) { return { type: createKpiConstants.EDITTARGET_KPIPERSONAL_SUCCESS, newTarget } }
    function failure(error) { return { type: createKpiConstants.EDITTARGET_KPIPERSONAL_FAILURE, error } }
}

// Khởi tạo KPI cá nhân
function createKPIPersonal(newKPI) {
    return dispatch => {
        dispatch(request(newKPI));

        createKpiService.createKPIPersonal(newKPI)
            .then(
                newKPI => { 
                    dispatch(success(newKPI));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(newKPI) { return { type: createKpiConstants.ADD_KPIPERSONAL_REQUEST, newKPI } }
    function success(newKPI) { return { type: createKpiConstants.ADD_KPIPERSONAL_SUCCESS, newKPI } }
    function failure(error) { return { type: createKpiConstants.ADD_KPIPERSONAL_FAILURE, error } }
}

// Phê duyệt toàn bộ KPI cá nhân
function approveKPIPersonal(id) {
    return dispatch => {
        dispatch(request(id));

        createKpiService.approveKPIPersonal(id)
            .then(
                newKPI => { 
                    dispatch(success(newKPI));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(id) { return { type: createKpiConstants.APPROVE_KPIPERSONAL_REQUEST, id } }
    function success(newKPI) { return { type: createKpiConstants.APPROVE_KPIPERSONAL_SUCCESS, newKPI } }
    function failure(error) { return { type: createKpiConstants.APPROVE_KPIPERSONAL_FAILURE, error } }
}