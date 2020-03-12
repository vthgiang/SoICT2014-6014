import { overviewKpiConstants } from "./constants";
import { overviewKpiServices } from "./services";
export const overviewKpiActions = {
    getAllKPIPersonalByMember
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
