import { overviewKpiConstants } from "./constants";
import { overviewKpiServices } from "./services";
export const overviewKpiActions = {
    getAllKPIPersonalByMember
};

// Lấy tất cả KPI cá nhân
function getAllKPIPersonalByMember(member) {
    return dispatch => {
        dispatch(request(member));

        overviewKpiServices.getAllKPIPersonalByMember(member)
            .then(
                kpipersonals => dispatch(success(kpipersonals)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(member) { return { type: overviewKpiConstants.GETALL_KPIPERSONAL_REQUEST, member } }
    function success(kpipersonals) { return { type: overviewKpiConstants.GETALL_KPIPERSONAL_SUCCESS, kpipersonals } }
    function failure(error) { return { type: overviewKpiConstants.GETALL_KPIPERSONAL_FAILURE, error } }
}
