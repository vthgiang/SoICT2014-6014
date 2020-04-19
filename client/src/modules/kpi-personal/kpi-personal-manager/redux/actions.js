import { managerKPIConstants } from "./constants";
import { managerKPIPerService } from "./services";
export const managerKpiActions = {
    getAllKPIPersonalByMember,
    getAllKPIPersonalOfResponsible,
    getAllKPIPersonalByUserID
};

// Lấy tất cả KPI cá nhân
function getAllKPIPersonalByMember() {
    return dispatch => {
        dispatch(request());//member

        managerKPIPerService.getAllKPIPersonalByMember()
            .then(
                kpipersonals => dispatch(success(kpipersonals)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: managerKPIConstants.GETALL_KPIPERSONAL_REQUEST } }
    function success(kpipersonals) { return { type: managerKPIConstants.GETALL_KPIPERSONAL_SUCCESS, kpipersonals } }
    function failure(error) { return { type: managerKPIConstants.GETALL_KPIPERSONAL_FAILURE, error } }
}

// Lấy tất cả KPI cá nhân
function getAllKPIPersonalByUserID(member) {
    return dispatch => {
        dispatch(request(member));

        managerKPIPerService.getAllKPIPersonalByUserID(member)
            .then(
                kpipersonals => dispatch(success(kpipersonals)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(member) { return { type: managerKPIConstants.GETALL_KPIPERSONAL_REQUEST, member } }
    function success(kpipersonals) { return { type: managerKPIConstants.GETALL_KPIPERSONAL_SUCCESS, kpipersonals } }
    function failure(error) { return { type: managerKPIConstants.GETALL_KPIPERSONAL_FAILURE, error } }

}

// Lấy tất cả KPI cá nhân
function getAllKPIPersonalOfResponsible(member) {
    return dispatch => {
        dispatch(request(member));

        managerKPIPerService.getAllKPIPersonalOfTask(member)
            .then(
                kpipersonals => dispatch(success(kpipersonals)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(member) { return { type: managerKPIConstants.GETALL_KPIPERSONAL_OFTASK_REQUEST, member } }
    function success(kpipersonals) { return { type: managerKPIConstants.GETALL_KPIPERSONAL_OFTASK_SUCCESS, kpipersonals } }
    function failure(error) { return { type: managerKPIConstants.GETALL_KPIPERSONAL_OFTASK_FAILURE, error } }
}
