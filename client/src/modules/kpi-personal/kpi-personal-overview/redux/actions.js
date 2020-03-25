import { overviewKpiConstants } from "./constants";
import { overviewKpiServices } from "./services";
export const overviewKpiActions = {
    getAllKPIPersonalByMember,
    getAllKPIPersonalOfResponsible,
    getAllKPIPersonalByUserID
};

// Lấy tất cả KPI cá nhân
function getAllKPIPersonalByMember() {
    return dispatch => {
        dispatch(request());//member

        overviewKpiServices.getAllKPIPersonalByMember()
            .then(
                kpipersonals => dispatch(success(kpipersonals)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: overviewKpiConstants.GETALL_KPIPERSONAL_REQUEST } }
    function success(kpipersonals) { return { type: overviewKpiConstants.GETALL_KPIPERSONAL_SUCCESS, kpipersonals } }
    function failure(error) { return { type: overviewKpiConstants.GETALL_KPIPERSONAL_FAILURE, error } }
}

// Lấy tất cả KPI cá nhân
function getAllKPIPersonalByUserID(member) {
    return dispatch => {
        dispatch(request(member));

        overviewKpiServices.getAllKPIPersonalByUserID(member)
            .then(
                kpipersonals => dispatch(success(kpipersonals)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(member) { return { type: overviewKpiConstants.GETALL_KPIPERSONAL_REQUEST, member } }
    function success(kpipersonals) { return { type: overviewKpiConstants.GETALL_KPIPERSONAL_SUCCESS, kpipersonals } }
    function failure(error) { return { type: overviewKpiConstants.GETALL_KPIPERSONAL_FAILURE, error } }

}

// Lấy tất cả KPI cá nhân
function getAllKPIPersonalOfResponsible(member) {
    return dispatch => {
        dispatch(request(member));

        overviewKpiServices.getAllKPIPersonalOfTask(member)
            .then(
                kpipersonals => dispatch(success(kpipersonals)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(member) { return { type: overviewKpiConstants.GETALL_KPIPERSONAL_OFTASK_REQUEST, member } }
    function success(kpipersonals) { return { type: overviewKpiConstants.GETALL_KPIPERSONAL_OFTASK_SUCCESS, kpipersonals } }
    function failure(error) { return { type: overviewKpiConstants.GETALL_KPIPERSONAL_OFTASK_FAILURE, error } }
}
