import { managerConstants } from "./constants";
import { managerServices } from "./services";

export const managerActions = {
    getAllKPIUnit,
    getCurrentKPIUnit,
    getChildTargetOfCurrentTarget,
    addKPIUnit,
    evaluateKPIUnit,
}

// lấy tất cả các KPI của đơn vị
function getAllKPIUnit(id) {
    return dispatch => {
        dispatch({ type: managerConstants.GETALL_KPIUNIT_REQUEST})

        managerServices.getAllKPIUnit(id)
            .then(res =>{
                dispatch({
                    type: managerConstants.GETALL_KPIUNIT_SUCCESS,
                    payload: res.data.content.kpiunits
                })
            })
            .catch(error =>{
                dispatch({
                    type: managerConstants.GETALL_KPIUNIT_FAILURE,
                    payload: error
                })
            })
           
    };
}


// lấy kpi đơn vị hiện tại
function getCurrentKPIUnit(id) {
    return dispatch => {
        dispatch({type: managerConstants.GETCURRENT_KPIUNIT_REQUEST});

        managerServices.getCurrentKPIUnit(id)
            .then(res =>{
                dispatch({
                    type: managerConstants.GETCURRENT_KPIUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: managerConstants.GETCURRENT_KPIUNIT_FAILURE,
                    payload: error
                })
            })
    }
}

// lấy mục tiêu con của mục tiêu hiện tại
function getChildTargetOfCurrentTarget(id) {
    return dispatch => {
        dispatch({type: managerConstants.GETCHILDTARGET_CURRENTTARGET_REQUEST});

        managerServices.getChildTargetOfCurrentTarget(id)
            .then(res => {
                dispatch({
                    type: managerConstants.GETCHILDTARGET_CURRENTTARGET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error =>{
                dispatch({
                    type: managerConstants.GETCHILDTARGET_CURRENTTARGET_FAILURE,
                    payload: error
                })
            })
    }
}

// Khởi tạo KPI đơn vị
function addKPIUnit(newKPI) {
    return dispatch => {
        dispatch({type: managerConstants.ADD_KPIUNIT_REQUEST});

        managerServices.addKPIUnit(newKPI)
            .then(res => {
                dispatch({
                    type: managerConstants.ADD_KPIUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: managerConstants.ADD_KPIUNIT_FAILURE,
                    payload: error
                })
            })
    }
}


// Cập nhật dữ liệu cho kpi đơn vị
function evaluateKPIUnit(id) {
    return dispatch => {
        dispatch({type: managerConstants.EVALUATE_KPIUNIT_REQUEST});
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