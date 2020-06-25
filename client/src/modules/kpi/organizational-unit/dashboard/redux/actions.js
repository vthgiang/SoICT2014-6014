import { dashboardOrganizationalUnitKpiConstants } from "./constants";
import { dashboardOrganizationalUnitKpiServices } from "./services";
import { dashboardEmployeeKpiConstants } from "../../../evaluation/dashboard/redux/constants";

export const dashboardOrganizationalUnitKpiActions = {
    getAllEmployeeKpiInOrganizationalUnit,
    getAllTaskOfOrganizationalUnit,
    getAllOrganizationalUnitKpiSetEachYear,
    getAllOrganizationalUnitKpiSetEachYearOfChildUnit,
    getAllEmployeeKpiSetInOrganizationalUnit
}

// Lấy tất cả employeeKpi thuộc organizationalUnitKpi hiện tại
function getAllEmployeeKpiInOrganizationalUnit(roleId, organizationalUnitId=undefined) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_ORGANIZATIONALUNIT_REQUEST });

        dashboardOrganizationalUnitKpiServices.getAllEmployeeKpiInOrganizationalUnit(roleId, organizationalUnitId)
            .then(res => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_ORGANIZATIONALUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_ORGANIZATIONALUNIT_FAILURE,
                    payload: error
                })
            })
    }
}

// Lấy tất cả task của organizationalUnit theo tháng hiện tại
function getAllTaskOfOrganizationalUnit(roleId, organizationalUnitId=undefined) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_ORGANIZATIONALUNIT_REQUEST });

        dashboardOrganizationalUnitKpiServices.getAllTaskOfOrganizationalUnit(roleId, organizationalUnitId)
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
function getAllOrganizationalUnitKpiSetEachYearOfChildUnit(roleId, year) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_EACH_YEAR_OF_CHILDUNIT_REQUEST});

        dashboardOrganizationalUnitKpiServices.getAllOrganizationalUnitKpiSetEachYearOfChildUnit(roleId, year)
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
function getAllEmployeeKpiSetInOrganizationalUnit(roleId, month) {
    return dispatch => {
        dispatch({ type: dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNIT_REQUEST });

        dashboardOrganizationalUnitKpiServices.getAllEmployeeKpiSetInOrganizationalUnit(roleId, month)
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