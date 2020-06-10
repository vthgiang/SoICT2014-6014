import { managerConstants } from "./constants";
import { managerServices } from "./services";

export const managerActions = {
    getAllKPIUnit,
    getKPIUnits,
    getChildTargetOfCurrentTarget,
    evaluateKPIUnit,
    copyKPIUnit
}

// lấy tất cả các KPI của đơn vị
function getAllKPIUnit(id) {
    return dispatch => {
        dispatch({ type: managerConstants.GETALL_KPIUNIT_REQUEST })

        managerServices.getAllKPIUnit(id)
            .then(res => {
                dispatch({
                    type: managerConstants.GETALL_KPIUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: managerConstants.GETALL_KPIUNIT_FAILURE,
                    payload: error
                })
            })

    };
}
function getKPIUnits(infosearch) {
    return dispatch => {
        dispatch({ type: managerConstants.GET_KPIUNITS_REQUEST });

        managerServices.getKPIUnits(infosearch)
            .then(res => {
                dispatch({
                    type: managerConstants.GET_KPIUNITS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: managerConstants.GET_KPIUNITS_FAILURE,
                    payload: error
                })
            })
    };
}


// lấy mục tiêu con của mục tiêu hiện tại
function getChildTargetOfCurrentTarget(id, date) {
    return dispatch => {
        dispatch({ type: managerConstants.GETCHILDTARGET_CURRENTTARGET_REQUEST });

        managerServices.getChildTargetOfCurrentTarget(id, date)
            .then(res => {
                dispatch({
                    type: managerConstants.GETCHILDTARGET_CURRENTTARGET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: managerConstants.GETCHILDTARGET_CURRENTTARGET_FAILURE,
                    payload: error
                })
            })
    }
}

// Cập nhật dữ liệu cho kpi đơn vị
function evaluateKPIUnit(id) {
    return dispatch => {
        dispatch({ type: managerConstants.EVALUATE_KPIUNIT_REQUEST });
        managerServices.evaluateKPIUnit(id)
            .then(res => {
                dispatch({
                    type: managerConstants.EVALUATE_KPIUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: managerConstants.EVALUATE_KPIUNIT_FAILURE,
                    payload: error
                })
            })
    }
}

function copyKPIUnit(id, dateold, datenew){
    return dispatch => {
        dispatch({ type: managerConstants.COPY_KPIUNIT_REQUEST });

        managerServices.copyKPIUnit(id, dateold, datenew)
            .then(res => {
                dispatch({
                    type: managerConstants.COPY_KPIUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: managerConstants.COPY_KPIUNIT_FAILURE,
                    payload: error
                })
            })
    }
}