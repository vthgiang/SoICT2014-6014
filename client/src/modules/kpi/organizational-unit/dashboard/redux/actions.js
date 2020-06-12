import { dashboardOrganizationalUnitKpiConstants } from "./constants";
import { dashboardOrganizationalUnitKpiServices } from "./services";
import { dashboardEmployeeKpiConstants } from "../../../evaluation/dashboard/redux/constants";

export const dashboardOrganizationalUnitKpiActions = {
    getAllChildTargetOfOrganizationalUnitKpis,
    getAllTaskOfOrganizationalUnit,
    getAllOrganizationalUnitKpiSetEachYear,
    getAllOrganizationalUnitKpiSetEachYearOfChildUnit,
    getAllEmployeeKpiSetInOrganizationalUnit
}

// Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại
function getAllChildTargetOfOrganizationalUnitKpis(userRoleId) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_CHILDTARGET_OF_ORGANIZATIONALUNITKPIS_REQUEST });

        dashboardOrganizationalUnitKpiServices.getAllChildTargetOfOrganizationalUnitKpis(userRoleId)
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
function getAllTaskOfOrganizationalUnit(userRoleId) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_ORGANIZATIONALUNIT_REQUEST });

        dashboardOrganizationalUnitKpiServices.getAllTaskOfOrganizationalUnit(userRoleId)
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
function getAllOrganizationalUnitKpiSetEachYear(organizationalUnitId, year) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_EACH_YEAR_REQUEST });

        dashboardOrganizationalUnitKpiServices.getAllOrganizationalUnitKpiSetEachYear(organizationalUnitId, year)
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

// Lấy danh sách các tập KPI đơn vị theo từng năm của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại
function getAllOrganizationalUnitKpiSetEachYearOfChildUnit(userRoleId, year) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_EACH_YEAR_OF_CHILDUNIT_REQUEST});

        dashboardOrganizationalUnitKpiServices.getAllOrganizationalUnitKpiSetEachYearOfChildUnit(userRoleId, year)
            .then(res => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_EACH_YEAR_OF_CHILDUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_EACH_YEAR_OF_CHILDUNIT_FAILURE,
                    payload: error
                })
            })
    }
}

// Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng
function getAllEmployeeKpiSetInOrganizationalUnit(userRoleId, month) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNIT_REQUEST });

        dashboardOrganizationalUnitKpiServices.getAllEmployeeKpiSetInOrganizationalUnit(userRoleId, month)
            .then(res => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNIT_FAILURE,
                    payload: error
                })
            })
    }
}