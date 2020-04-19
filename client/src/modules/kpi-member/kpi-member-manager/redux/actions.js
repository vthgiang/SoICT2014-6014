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
    setPointKPI
};
 
// Lấy tất cả KPI cá nhân
function getAllKPIMemberOfUnit(infosearch) {
    return dispatch => {
        dispatch(request(infosearch));
 
        kpiMemberServices.getAllKPIMemberOfUnit(infosearch)
            .then(
                kpimembers => dispatch(success(kpimembers)),
                error => dispatch(failure(error.toString()))
            );
    };
 
    function request(infosearch) { return { type: kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_REQUEST, infosearch } }
    function success(kpimembers) { return { type: kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_SUCCESS, kpimembers } }
    function failure(error) { return { type: kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_FAILURE, error } }
}
// Lấy tất cả KPI cá nhân
function getAllKPIMemberByMember() { //member
    return dispatch => {
        dispatch(request());
 
        kpiMemberServices.getAllKPIMemberByMember()
            .then(
                kpimembers => dispatch(success(kpimembers)),
                error => dispatch(failure(error.toString()))
            );
    };
 
    function request() { return { type: kpiMemberConstants.GETALL_KPIMEMBER_REQUEST } }
    function success(kpimembers) { return { type: kpiMemberConstants.GETALL_KPIMEMBER_SUCCESS, kpimembers } }
    function failure(error) { return { type: kpiMemberConstants.GETALL_KPIMEMBER_FAILURE, error } }
}
 
 
// Lấy KPI cá nhân theo id
function getKPIMemberById(id) {
    return dispatch => {
        dispatch(request(id));
 
        kpiMemberServices.getKPIMemberById(id)
            .then(
                kpimember => dispatch(success(kpimember)),
                error => dispatch(failure(error.toString()))
            );
    };
 
    function request(id) { return { type: kpiMemberConstants.GET_KPIMEMBER_BYID_REQUEST, id } }
    function success(kpimember) { return { type: kpiMemberConstants.GET_KPIMEMBER_BYID_SUCCESS, kpimember } }
    function failure(error) { return { type: kpiMemberConstants.GET_KPIMEMBER_BYID_FAILURE, error } }
}
 
// Lấy KPI cá nhân theo id
function getKPIMemberByMonth(id, time) {
    return dispatch => {
        dispatch(request(id));
 
        kpiMemberServices.getKPIMemberByMonth(id, time)
            .then(
                kpimember => dispatch(success(kpimember)),
                error => dispatch(failure(error.toString()))
            );
    };
 
    function request(id) { return { type: kpiMemberConstants.GET_KPIMEMBER_BYMONTH_REQUEST, id } }
    function success(kpimember) { return { type: kpiMemberConstants.GET_KPIMEMBER_BYMONTH_SUCCESS, kpimember } }
    function failure(error) { return { type: kpiMemberConstants.GET_KPIMEMBER_BYMONTH_FAILURE, error } }
}
 
 
 
 
 
// Phê duyệt toàn bộ KPI cá nhân
function approveKPIMember(id) {
    return dispatch => {
        dispatch(request(id));
 
        kpiMemberServices.approveKPIMember(id)
            .then(
                newKPI => { 
                    dispatch(success(newKPI));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };
 
    function request(id) { return { type: kpiMemberConstants.APPROVE_KPIMEMBER_REQUEST, id } }
    function success(newKPI) { return { type: kpiMemberConstants.APPROVE_KPIMEMBER_SUCCESS, newKPI } }
    function failure(error) { return { type: kpiMemberConstants.APPROVE_KPIMEMBER_FAILURE, error } }
}
 
 
 
// Chỉnh sửa mục tiêu KPI cá nhân
function editTargetKPIMember(id, newTarget) {
    return dispatch => {
        dispatch(request(id));
 
        kpiMemberServices.editTargetKPIMember(id, newTarget)
            .then(
                newTarget => { 
                    dispatch(success(newTarget));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };
 
    function request(id) { return { type: kpiMemberConstants.EDITTARGET_KPIMEMBER_REQUEST, id } }
    function success(newTarget) { return { type: kpiMemberConstants.EDITTARGET_KPIMEMBER_SUCCESS, newTarget } }
    function failure(error) { return { type: kpiMemberConstants.EDITTARGET_KPIMEMBER_FAILURE, error } }
}
 
// Chỉnh sửa trạng thái mục tiêu KPI cá nhân
function editStatusTarget(id, status) {
    return dispatch => {
        dispatch(request(id));
 
        kpiMemberServices.editStatusTarget(id, status)
            .then(
                newTarget => { 
                    dispatch(success(newTarget));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };
 
    function request(id) { return { type: kpiMemberConstants.EDITSTATUS_TARGET_KPIMEMBER_REQUEST, id } }
    function success(newKPI) { return { type: kpiMemberConstants.EDITSTATUS_TARGET_KPIMEMBER_SUCCESS, newKPI } }
    function failure(error) { return { type: kpiMemberConstants.EDITSTATUS_TARGET_KPIMEMBER_FAILURE, error } }
}

function getTaskById(id) {
    return dispatch => {
        dispatch(request(id));
 
        kpiMemberServices.getTaskById(id)
            .then(
                tasks => dispatch(success(tasks)),
                error => dispatch(failure(error.toString()))
            );
    };
 
    function request(id) { return { type: kpiMemberConstants.GET_TASK_BYID_REQUEST, id } }
    function success(tasks) { return { type: kpiMemberConstants.GET_TASK_BYID_SUCCESS, tasks } }
    function failure(error) { return { type: kpiMemberConstants.GET_TASK_BYID_FAILURE, error } }
}

function setPointKPI(id_kpi, id_target, newPoint) {
    return dispatch => {
        dispatch(request(id_target));
 
        kpiMemberServices.setPointKPI(id_kpi,id_target, newPoint)
            .then(
                newPoint => { 
                    dispatch(success(newPoint));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };
 
    function request(id) { return { type: kpiMemberConstants.SET_POINTKPI_REQUEST, id } }
    function success(newPoint) { return { type: kpiMemberConstants.SET_POINTKPI_SUCCESS, newPoint } }
    function failure(error) { return { type: kpiMemberConstants.SET_POINTKPI_FAILURE, error } }
}