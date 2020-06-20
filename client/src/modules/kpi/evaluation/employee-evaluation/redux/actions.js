import { kpiMemberConstants } from "./constants";
import { kpiMemberServices } from "./services";
export const kpiMemberActions = {
    getAllKPIMemberOfUnit,
    getAllKPIMemberByMember,
    getKPIMemberByMonth,
    getKPIMemberById,
    approveKPIMember,
    editTargetKPIMember,
    editStatusTarget,
    getTaskById,
    setPointKPI,
    setkpiImportantLevel,
    // createComment,
    // editComment,
    // deleteComment,
    // createCommentOfComment,
    // editCommentOfComment,
    // deleteCommentOfComment
};
 
// Lấy tất cả KPI cá nhân
function getAllKPIMemberOfUnit(infosearch) {
    console.log('inforsearch action', infosearch);
    return dispatch => {
        dispatch({type: kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_REQUEST});
 
        kpiMemberServices.getAllKPIMemberOfUnit(infosearch)
            .then(res=>{
                dispatch({
                    type: kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_FAILURE,
                    payload: error
                })
            })
    };
}
// Lấy tất cả KPI cá nhân
function getAllKPIMemberByMember(member) { //member
    console.log('mmmm',member);
    return dispatch => {
        dispatch({type: kpiMemberConstants.GETALL_KPIMEMBER_REQUEST});
 
        kpiMemberServices.getAllKPIMemberByMember(member)
            .then(res=>{
                dispatch({
                    type: kpiMemberConstants.GETALL_KPIMEMBER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.GETALL_KPIMEMBER_FAILURE,
                    payload: error
                })
            })
    };
}
 
 
// Lấy KPI cá nhân theo id
function getKPIMemberById(id) {
    return dispatch => {
        dispatch({type: kpiMemberConstants.GET_KPIMEMBER_BYID_REQUEST});
 
        kpiMemberServices.getKPIMemberById(id)
            .then(res=>{
                dispatch({
                    type: kpiMemberConstants.GET_KPIMEMBER_BYID_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.GET_KPIMEMBER_BYID_FAILURE,
                    payload: error
                })
            })
    };
}
 
// Lấy KPI cá nhân theo id
function getKPIMemberByMonth(id, time) {
    return dispatch => {
        dispatch({type: kpiMemberConstants.GET_KPIMEMBER_BYMONTH_REQUEST});
 
        kpiMemberServices.getKPIMemberByMonth(id,time)
            .then(res=>{
                dispatch({
                    type: kpiMemberConstants.GET_KPIMEMBER_BYMONTH_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.GET_KPIMEMBER_BYMONTH_FAILURE,
                    payload: error
                })
            })
    };
}
 
 
 
 
 
// Phê duyệt toàn bộ KPI cá nhân
function approveKPIMember(id) {
    return dispatch => {
        dispatch({type: kpiMemberConstants.APPROVE_KPIMEMBER_REQUEST});
 
        kpiMemberServices.approveKPIMember(id)
            .then(res=>{
                dispatch({
                    type: kpiMemberConstants.APPROVE_KPIMEMBER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.APPROVE_KPIMEMBER_FAILURE,
                    payload: error
                })
            })
    };
}
 
 
 
// Chỉnh sửa mục tiêu KPI cá nhân
function editTargetKPIMember(id, newTarget) {
    return dispatch => {
        dispatch({type: kpiMemberConstants.EDITTARGET_KPIMEMBER_REQUEST, id});
 
        kpiMemberServices.editTargetKPIMember(id, newTarget)
            .then(res=>{
                dispatch({
                    type: kpiMemberConstants.EDITTARGET_KPIMEMBER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.EDITTARGET_KPIMEMBER_FAILURE,
                    payload: error
                })
            })
    };
}
 
// Chỉnh sửa trạng thái mục tiêu KPI cá nhân
function editStatusTarget(id, status) {
    return dispatch => {
        dispatch({type: kpiMemberConstants.EDITSTATUS_TARGET_KPIMEMBER_REQUEST});
 
        kpiMemberServices.editStatusTarget(id,status)
            .then(res=>{
                dispatch({
                    type: kpiMemberConstants.EDITSTATUS_TARGET_KPIMEMBER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.EDITSTATUS_TARGET_KPIMEMBER_FAILURE,
                    payload: error
                })
            })
    };
}

function getTaskById(id, employeeId, date, kpiType) {
    return dispatch => {
        dispatch({type: kpiMemberConstants.GET_TASK_BYID_REQUEST});
 
        kpiMemberServices.getTaskById(id, employeeId, date, kpiType)
            .then(res=>{
                dispatch({
                    type: kpiMemberConstants.GET_TASK_BYID_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.GET_TASK_BYID_FAILURE,
                    payload: error
                })
            })
    };
}

function setPointKPI(employeeId, data) {
    return dispatch => {
        dispatch({type: kpiMemberConstants.SET_POINTKPI_REQUEST});
 
        kpiMemberServices.setPointKPI(employeeId, data)
            .then(res=>{
                dispatch({
                    type: kpiMemberConstants.SET_POINTKPI_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.SET_POINTKPI_FAILURE,
                    payload: error
                })
            })
    };
}

function setkpiImportantLevel(id_kpi,date) {
    return dispatch => {
        dispatch({type: kpiMemberConstants.TASK_IMPORTANT_LEVEL_REQUEST});
 
        kpiMemberServices.setkpiImportantLevel(id_kpi,date)
            .then(res=>{
                dispatch({
                    type: kpiMemberConstants.TASK_IMPORTANT_LEVEL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: kpiMemberConstants.TASK_IMPORTANT_LEVEL_FAILURE,
                    payload: error
                })
            })
    };
}
