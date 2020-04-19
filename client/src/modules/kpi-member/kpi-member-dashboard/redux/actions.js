import { kpiMemberConstants } from "./constants";
import { kpiMemberServices } from "./services";
export const kpiMemberActions = {
    getAllKPIMemberOfUnit,
    getAllKPIMemberByMember,
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



