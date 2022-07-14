import { dashboardEmployeeKpiConstants } from "./constants";
import { dashboardEmployeeKpiService } from "./services";

export const DashboardEvaluationEmployeeKpiSetAction = {
    getAllEmployeeKpiSetOfUnitByRole,
    getAllEmployeeKpiSetOfUnitByIds,
    getChildrenOfOrganizationalUnitsAsTree,
    getEmployeeKpiPerformance,
    balanceEmployeeKpiSet,
};

/**
 * Lấy tất cả KPI cá nhân theo role
 * @param {*} role 
 */
function getAllEmployeeKpiSetOfUnitByRole(role) {
    return dispatch => {
        dispatch({ type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ROLE_REQUEST });

        dashboardEmployeeKpiService.getAllEmployeeKpiSetOfUnitByRole(role)
            .then(res => {
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ROLE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ROLE_FAILURE,
                    payload: error
                })
            })
    };
}
/**
 * Lấy tất cả KPI cá nhân theo mảng id đơn vị
 * @param {*} ids 
 */
function getAllEmployeeKpiSetOfUnitByIds(ids, month) {
    return dispatch => {
        dispatch({ type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ID_REQUEST });

        dashboardEmployeeKpiService.getAllEmployeeKpiSetOfUnitByIds(ids)
            .then(res => {
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ID_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ID_FAILURE,
                    payload: error
                })
            })
    };
}


/**
 * Lấy các đơn vị con của một đơn vị và đơn vị đó
 * @param {*} role 
 */
function getChildrenOfOrganizationalUnitsAsTree(role) {
    return dispatch => {
        dispatch({ type: dashboardEmployeeKpiConstants.GET_ALL_CHILDREN_OF_UNIT_REQUEST });

        dashboardEmployeeKpiService.getChildrenOfOrganizationalUnitsAsTree(role)
            .then(res => {
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_CHILDREN_OF_UNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_CHILDREN_OF_UNIT_FAILURE,
                    payload: error
                })
            })
    };
}

/**
 * Lay diem danh gia nhan vien
 * @param {*} ids 
 */
function getEmployeeKpiPerformance(ids) {
    return dispatch => {
        dispatch({ type: dashboardEmployeeKpiConstants.GET_EMPLOYEE_KPI_PERFORMANCE_REQUEST });

        dashboardEmployeeKpiService.getEmployeeKpiPerformance(ids)
            .then(res => {
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_EMPLOYEE_KPI_PERFORMANCE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_EMPLOYEE_KPI_PERFORMANCE_FAILURE,
                    payload: error
                })
            })
    };
}

// Can bang muc tieu của KPI cá nhân
function balanceEmployeeKpiSet(data) {
    return dispatch => {
        dispatch({ type: dashboardEmployeeKpiConstants.BALANCE_EMPLOYEE_KPI_SET_REQUEST });

        dashboardEmployeeKpiService.balanceEmployeeKpiSet(data)
            .then(res => {
                dispatch({
                    type: dashboardEmployeeKpiConstants.BALANCE_EMPLOYEE_KPI_SET_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardEmployeeKpiConstants.BALANCE_EMPLOYEE_KPI_SET_FAILURE,
                    payload: error
                })
            })
    };
}
