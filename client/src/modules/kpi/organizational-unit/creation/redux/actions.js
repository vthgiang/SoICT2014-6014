import { createUnitKpiConstants } from "./constants";
import { createUnitKpiServices } from "./services";

export const createUnitKpiActions = {
    getCurrentKPIUnit,
    editKPIUnit,
    deleteKPIUnit,
    deleteTargetKPIUnit,
    getKPIParent,
    getAllOrganizationalUnitKpiSetByTime,
    getAllOrganizationalUnitKpiSetByTimeOfChildUnit,
    addTargetKPIUnit,
    editTargetKPIUnit,
    addKPIUnit
}


/**
 * Get organizational unit kpi set
 * @param {*} organizationalUnitId 
 * @param {*} month 
 */
function getCurrentKPIUnit(roleId, organizationalUnitId = undefined, month = undefined) {
    return dispatch => {
        dispatch({ type: createUnitKpiConstants.GETCURRENT_KPIUNIT_REQUEST });

        createUnitKpiServices.getCurrentKPIUnit(roleId, organizationalUnitId, month)
            .then(res => {
                dispatch({
                    type: createUnitKpiConstants.GETCURRENT_KPIUNIT_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(error => {
                dispatch({
                    type: createUnitKpiConstants.GETCURRENT_KPIUNIT_FAILURE,
                    payload: error
                })
            })
    };
}

// Lấy danh sách các tập KPI đơn vị theo từng năm của từng đơn vị 
function getAllOrganizationalUnitKpiSetByTime(roleId, organizationalUnitId, startDate, endDate) {
    return dispatch => {
        dispatch({ type: createUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_BY_TIME_REQUEST });

        createUnitKpiServices.getAllOrganizationalUnitKpiSetByTime(roleId, organizationalUnitId, startDate, endDate)
            .then(res => {
                dispatch({
                    type: createUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_BY_TIME_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_BY_TIME_FAILURE,
                    payload: error
                })
            })
    }
}

// Lấy danh sách các tập KPI đơn vị theo từng năm của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại
function getAllOrganizationalUnitKpiSetByTimeOfChildUnit(roleId, startDate, endDate) {
    return dispatch => {
        dispatch({ type: createUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_BY_TIME_OF_CHILDUNIT_REQUEST });

        createUnitKpiServices.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(roleId, startDate, endDate)
            .then(res => {
                dispatch({
                    type: createUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_BY_TIME_OF_CHILDUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_BY_TIME_OF_CHILDUNIT_FAILURE,
                    payload: error
                })
            })
    }
}
// Chỉnh sửa kpi đơn vị
function editKPIUnit(id, data, type) {
    return dispatch => {
        dispatch({
            type: createUnitKpiConstants.EDIT_KPIUNIT_REQUEST,
            payload: id
        });

        createUnitKpiServices.editKPIUnit(id, data, type)
            .then(res => {
                dispatch({
                    type: createUnitKpiConstants.EDIT_KPIUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createUnitKpiConstants.EDIT_KPIUNIT_FAILURE,
                    payload: error
                })
            })
    };
}


// Xóa KPI đơn vị
function deleteKPIUnit(id) {
    return dispatch => {
        dispatch({
            type: createUnitKpiConstants.DELETE_KPIUNIT_REQUEST,
            payload: id
        });

        createUnitKpiServices.deleteKPIUnit(id)
            .then(res => {
                dispatch({
                    type: createUnitKpiConstants.DELETE_KPIUNIT_SUCCESS,
                    payload: id
                })
            })
            .catch(error => {
                dispatch({
                    type: createUnitKpiConstants.DELETE_KPIUNIT_FAILURE,
                    payload: error
                })
            })
    };
}

// Xóa mục tiêu KPI đơn vị
function deleteTargetKPIUnit(id, organizationalUnitKpiSetId) {
    return dispatch => {
        dispatch({
            type: createUnitKpiConstants.DELETETARGET_KPIUNIT_REQUEST,
            payload: id
        });

        createUnitKpiServices.deleteTargetKPIUnit(id, organizationalUnitKpiSetId)
            .then(res => {
                dispatch({
                    type: createUnitKpiConstants.DELETETARGET_KPIUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createUnitKpiConstants.DELETETARGET_KPIUNIT_FAILURE,
                    payload: error
                })
            })
    };
}


/** Lấy KPI đơn vị cha của 1 đơn vị trong 1 tháng
 * @data gồm các thuộc tính: roleId, organizationalUnitId, month
 */
function getKPIParent(data) {
    return dispatch => {
        dispatch({
            type: createUnitKpiConstants.GETPARENT_KPIUNIT_REQUEST,
            payload: data ? data.roleId : null
        });

        createUnitKpiServices.getKPIParent(data)
            .then(res => {
                dispatch({
                    type: createUnitKpiConstants.GETPARENT_KPIUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createUnitKpiConstants.GETPARENT_KPIUNIT_FAILURE,
                    payload: error
                })
            })
    };
}

// Thêm mục tiêu cho KPI đơn vị
function addTargetKPIUnit(newTarget) {
    return dispatch => {
        dispatch({
            type: createUnitKpiConstants.ADDTARGET_KPIUNIT_REQUEST,
            payload: newTarget
        });

        createUnitKpiServices.addTargetKPIUnit(newTarget)
            .then(res => {
                dispatch({
                    type: createUnitKpiConstants.ADDTARGET_KPIUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createUnitKpiConstants.ADDTARGET_KPIUNIT_FAILURE,
                    payload: error
                })
            })
    };
}

// Chỉnh sửa mục tiêu của kpi đơn vị
function editTargetKPIUnit(id, newTarget) {
    return dispatch => {
        dispatch({
            type: createUnitKpiConstants.EDITTARGET_KPIUNIT_REQUEST,
            payload: id
        });

        createUnitKpiServices.editTargetKPIUnit(id, newTarget)
            .then(res => {
                dispatch({
                    type: createUnitKpiConstants.EDITTARGET_KPIUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createUnitKpiConstants.EDITTARGET_KPIUNIT_FAILURE,
                    payload: error
                })
            })
    };
}

// Khởi tạo KPI đơn vị
function addKPIUnit(newKPI) {
    return dispatch => {
        dispatch({
            type: createUnitKpiConstants.ADD_KPIUNIT_REQUEST,
            payload: newKPI
        });

        createUnitKpiServices.addKPIUnit(newKPI)
            .then(res => {
                dispatch({
                    type: createUnitKpiConstants.ADD_KPIUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: createUnitKpiConstants.ADD_KPIUNIT_FAILURE,
                    payload: error
                })
            })
    };
}