import { dashboardOrganizationalUnitKpiConstants } from "./constants";
import { dashboardOrganizationalUnitKpiServices } from "./services";

export const dashboardOrganizationalUnitKpiActions = {
    getAllChildTargetOfOrganizationalUnitKpis,
    getAllTaskOfOrganizationalUnit,
    getAllOrganizationalUnitKpiSetEachYear
}

// Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại
function getAllChildTargetOfOrganizationalUnitKpis(id) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_CHILDTARGET_OF_ORGANIZATIONALUNITKPIS_REQUEST });

        dashboardOrganizationalUnitKpiServices.getAllChildTargetOfOrganizationalUnitKpis(id)
            .then(res => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_CHILDTARGET_OF_ORGANIZATIONALUNITKPIS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_CHILDTARGET_OF_ORGANIZATIONALUNITKPIS_FAILURE,
                    payload: error
                })
            })
    }
}

// Lấy tất cả task của organizationalUnit theo tháng hiện tại
function getAllTaskOfOrganizationalUnit(id) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_ORGANIZATIONALUNIT_REQUEST });

        dashboardOrganizationalUnitKpiServices.getAllTaskOfOrganizationalUnit(id)
            .then(res => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_ORGANIZATIONALUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_ORGANIZATIONALUNIT_FAILURE,
                    payload: error
                })
            })
    }
}

// Lấy danh sách các tập KPI đơn vị theo từng năm của từng đơn vị 
function getAllOrganizationalUnitKpiSetEachYear(id, year) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_EACH_YEAR_REQUEST });

        dashboardOrganizationalUnitKpiServices.getAllOrganizationalUnitKpiSetEachYear(id, year)
            .then(res => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_EACH_YEAR_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_EACH_YEAR_FAILURE,
                    payload: error
                })
            })
    }
}