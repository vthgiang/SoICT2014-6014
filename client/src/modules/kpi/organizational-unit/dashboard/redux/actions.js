import { dashboardOrganizationalUnitKpiConstants } from "./constants";
import { dashboardOrganizationalUnitKpiServices } from "./services";

export const dashboardOrganizationalUnitKpiActions = {
    getChildTargetOfOrganizationalUnitKpis
}

// Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại
function getChildTargetOfOrganizationalUnitKpis(id) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_CHILDTARGET_OF_ORGANIZATIONALUNITKPIS_REQUEST });

        dashboardOrganizationalUnitKpiServices.getChildTargetOfOrganizationalUnitKpis(id)
            .then(res => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_CHILDTARGET_OF_ORGANIZATIONALUNITKPIS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_CHILDTARGET_OF_ORGANIZATIONALUNITKPIS_FAILURE,
                    payload: error
                })
            })
    }
}