import { createUnitKpiConstants } from "./constants";
import { createUnitKpiServices } from "./services";

export const createUnitKpiActions = {
    getCurrentKPIUnit,
    editKPIUnit,
    deleteKPIUnit,
    deleteTargetKPIUnit,
    editStatusKPIUnit,
    getKPIParent,
    addTargetKPIUnit,
    editTargetKPIUnit,
    addKPIUnit
}


// lấy kpi đơn vị hiện tại
function getCurrentKPIUnit(id) {
    return dispatch => {
        dispatch(request(id));

        createUnitKpiServices.getCurrentKPIUnit(id)
            .then(
                currentKPI => dispatch(success(currentKPI)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(id) { return { type: createUnitKpiConstants.GETCURRENT_KPIUNIT_REQUEST, id } }
    function success(currentKPI) { return { type: createUnitKpiConstants.GETCURRENT_KPIUNIT_SUCCESS, currentKPI } }
    function failure(error) { return { type: createUnitKpiConstants.GETCURRENT_KPIUNIT_FAILURE, error } }
}

// Chỉnh sửa kpi đơn vị
function editKPIUnit(id, newKPI) {
    return dispatch => {
        dispatch(request(id));

        createUnitKpiServices.editKPIUnit(id, newKPI)
            .then(
                newKPI => { 
                    dispatch(success(newKPI));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(id) { return { type: createUnitKpiConstants.EDIT_KPIUNIT_REQUEST, id } }
    function success(newKPI) { return { type: createUnitKpiConstants.EDIT_KPIUNIT_SUCCESS, newKPI } }
    function failure(error) { return { type: createUnitKpiConstants.EDIT_KPIUNIT_FAILURE, error } }
}



// Xóa KPI đơn vị
function deleteKPIUnit(id) {
    return dispatch => {
        dispatch(request(id));

        createUnitKpiServices.deleteKPIUnit(id)
            .then(
                kpiUnit => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: createUnitKpiConstants.DELETE_KPIUNIT_REQUEST, id } }
    function success(id) { return { type: createUnitKpiConstants.DELETE_KPIUNIT_SUCCESS, id } }
    function failure(id, error) { return { type: createUnitKpiConstants.DELETE_KPIUNIT_FAILURE, id, error } }
}

// Xóa mục tiêu KPI đơn vị
function deleteTargetKPIUnit(id, organizationalUnitKpiSetId) {
    return dispatch => {
        dispatch(request(id));

        createUnitKpiServices.deleteTargetKPIUnit(id, organizationalUnitKpiSetId)
            .then(
                newKPI => dispatch(success(newKPI)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: createUnitKpiConstants.DELETETARGET_KPIUNIT_REQUEST, id } }
    function success(newKPI) { return { type: createUnitKpiConstants.DELETETARGET_KPIUNIT_SUCCESS, newKPI } }
    function failure(id, error) { return { type: createUnitKpiConstants.DELETETARGET_KPIUNIT_FAILURE, id, error } }
}

// Chỉnh sửa trạng thái KPI đơn vị
function editStatusKPIUnit(id, status) {
    return dispatch => {
        dispatch(request(id));

        createUnitKpiServices.editStatusKPIUnit(id, status)
            .then(
                newKPI => { 
                    dispatch(success(newKPI));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(id) { return { type: createUnitKpiConstants.EDITSTATUS_KPIUNIT_REQUEST, id } }
    function success(newKPI) { return { type: createUnitKpiConstants.EDITSTATUS_KPIUNIT_SUCCESS, newKPI } }
    function failure(error) { return { type: createUnitKpiConstants.EDITSTATUS_KPIUNIT_FAILURE, error } }
}


// lấy kpi đơn vị cha
function getKPIParent(currentRole) {
    return dispatch => {
        dispatch(request(currentRole));

        createUnitKpiServices.getKPIParent(currentRole)
            .then(
                parentKPI => dispatch(success(parentKPI)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(currentRole) { return { type: createUnitKpiConstants.GETPARENT_KPIUNIT_REQUEST, currentRole } }
    function success(parentKPI) { return { type: createUnitKpiConstants.GETPARENT_KPIUNIT_SUCCESS, parentKPI } }
    function failure(error) { return { type: createUnitKpiConstants.GETPARENT_KPIUNIT_FAILURE, error } }
}

// Thêm mục tiêu cho KPI đơn vị
function addTargetKPIUnit(newTarget) {
    return dispatch => {
        dispatch(request(newTarget));

        createUnitKpiServices.addTargetKPIUnit(newTarget)
            .then(
                newKPI => { 
                    dispatch(success(newKPI));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(newTarget) { return { type: createUnitKpiConstants.ADDTARGET_KPIUNIT_REQUEST, newTarget } }
    function success(newKPI) { return { type: createUnitKpiConstants.ADDTARGET_KPIUNIT_SUCCESS, newKPI } }
    function failure(error) { return { type: createUnitKpiConstants.ADDTARGET_KPIUNIT_FAILURE, error } }
}

// Chỉnh sửa mục tiêu của kpi đơn vị
function editTargetKPIUnit(id, newTarget) {
    return dispatch => {
        dispatch(request(id));

        createUnitKpiServices.editTargetKPIUnit(id, newTarget)
            .then(
                newTarget => { 
                    dispatch(success(newTarget));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(id) { return { type: createUnitKpiConstants.EDITTARGET_KPIUNIT_REQUEST, id } }
    function success(newTarget) { return { type: createUnitKpiConstants.EDITTARGET_KPIUNIT_SUCCESS, newTarget } }
    function failure(error) { return { type: createUnitKpiConstants.EDITTARGET_KPIUNIT_FAILURE, error } }
}

// Khởi tạo KPI đơn vị
function addKPIUnit(newKPI) {
    return dispatch => {
        dispatch(request(newKPI));

        createUnitKpiServices.addKPIUnit(newKPI)
            .then(
                newKPI => { 
                    dispatch(success(newKPI));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request(newKPI) { return { type: createUnitKpiConstants.ADD_KPIUNIT_REQUEST, newKPI } }
    function success(newKPI) { return { type: createUnitKpiConstants.ADD_KPIUNIT_SUCCESS, newKPI } }
    function failure(error) { return { type: createUnitKpiConstants.ADD_KPIUNIT_FAILURE, error } }
}