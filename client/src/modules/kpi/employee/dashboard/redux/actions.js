import { dashboardEmployeeKpiSetConstants } from "./constants";
import { dashboardEmployeeKpiSetService } from "./services";
export const dashboardEmployeeKpiSetActions = {
    getEmployeeKpiSetByMember,
    getEmployeeKpiSetOfResponsible,
    getEmployeeKpiSetByUserID
};

// Lấy tất cả KPI cá nhân
function getEmployeeKpiSetByMember() {
    return dispatch => {
        dispatch({ type: dashboardEmployeeKpiSetConstants.GET_EMPLOYEE_KPI_SET_BY_MEMBER_REQUEST });//member

        dashboardEmployeeKpiSetService.getEmployeeKpiSetByMember()
            .then(res => {
                dispatch({
                    type: dashboardEmployeeKpiSetConstants.GET_EMPLOYEE_KPI_SET_BY_MEMBER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardEmployeeKpiSetConstants.GET_EMPLOYEE_KPI_SET_BY_MEMBER_FAILURE,
                    payload: error
                })
            })
    };
}

// Lấy tất cả KPI cá nhân
function getEmployeeKpiSetByUserID(member) {
    return dispatch => {
        dispatch({ type: dashboardEmployeeKpiSetConstants.GET_EMPLOYEE_KPI_SET_BY_ID_REQUEST });

        dashboardEmployeeKpiSetService.getEmployeeKpiSetByUserID(member)
            .then(res => {
                dispatch({
                    type: dashboardEmployeeKpiSetConstants.GET_EMPLOYEE_KPI_SET_BY_ID_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardEmployeeKpiSetConstants.GET_EMPLOYEE_KPI_SET_BY_ID_FAILURE,
                    payload: error
                })
            })
    };
}

// Lấy tất cả KPI cá nhân
function getEmployeeKpiSetOfResponsible(member) {
    return dispatch => {
        dispatch({ type: dashboardEmployeeKpiSetConstants.GET_EMPLOYEE_KPI_SET_OF_TASK_REQUEST });

        dashboardEmployeeKpiSetService.getEmployeeKpiSetOfTask(member)
            .then(res => {
                dispatch({
                    type: dashboardEmployeeKpiSetConstants.GETALL_KPIPERSONAL_OFTASK_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardEmployeeKpiSetConstants.GETALL_KPIPERSONAL_OFTASK_FAILURE,
                    payload: error
                })
            })
    };
}
