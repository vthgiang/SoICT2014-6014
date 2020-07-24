import { managerConstants } from "./constants";
import { managerServices } from "./services";

export const managerActions = {
    getAllKPIUnit,
    getChildTargetOfCurrentTarget,
    evaluateKPIUnit,
    copyKPIUnit
}

// lấy tất cả các KPI của đơn vị
function getAllKPIUnit(infosearch) {
    return dispatch => {
        dispatch({ type: managerConstants.GETALL_KPIUNIT_REQUEST })
        managerServices.getAllKPIUnit(infosearch)
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

// lấy mục tiêu con của mục tiêu hiện tại
function getChildTargetOfCurrentTarget(kpiId, date) {
    return dispatch => {
        dispatch({ type: managerConstants.GETCHILDTARGET_CURRENTTARGET_REQUEST });

        managerServices.getChildTargetOfCurrentTarget(kpiId, date)
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

function copyKPIUnit(kpiId, data){
    return dispatch => {
        dispatch({ type: managerConstants.COPY_KPIUNIT_REQUEST });
        managerServices.copyKPIUnit(kpiId, data)
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