import { dashboardKpiConstants } from "./constants";
import { dashboardKPIPerService } from "./services";
export const dashboardKpiActions = {
    getEmployeeKpiSetByMember,
    getEmployeeKpiSetOfResponsible,
    getEmployeeKpiSetByUserID
};

// Lấy tất cả KPI cá nhân
function getEmployeeKpiSetByMember() {
    return dispatch => {
        dispatch({ type: dashboardKpiConstants.GET_EMPLOYEE_KPI_SET_BY_MEMBER_REQUEST });//member

        dashboardKPIPerService.getEmployeeKpiSetByMember()
            .then(res => {
                dispatch({
                    type: dashboardKpiConstants.GET_EMPLOYEE_KPI_SET_BY_MEMBER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardKpiConstants.GET_EMPLOYEE_KPI_SET_BY_MEMBER_FAILURE,
                    payload: error
                })
            })
    };
}

// Lấy tất cả KPI cá nhân
function getEmployeeKpiSetByUserID(member) {
    return dispatch => {
        dispatch({ type: dashboardKpiConstants.GET_EMPLOYEE_KPI_SET_BY_ID_REQUEST });

        dashboardKPIPerService.getEmployeeKpiSetByUserID(member)
            .then(res => {
                dispatch({
                    type: dashboardKpiConstants.GET_EMPLOYEE_KPI_SET_BY_ID_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardKpiConstants.GET_EMPLOYEE_KPI_SET_BY_ID_FAILURE,
                    payload: error
                })
            })
    };
}

// Lấy tất cả KPI cá nhân
function getEmployeeKpiSetOfResponsible(member) {
    return dispatch => {
        dispatch({ type: dashboardKpiConstants.GET_EMPLOYEE_KPI_SET_OF_TASK_REQUEST });

        dashboardKPIPerService.getEmployeeKpiSetOfTask(member)
            .then(res => {
                dispatch({
                    type: dashboardKpiConstants.GETALL_KPIPERSONAL_OFTASK_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardKpiConstants.GETALL_KPIPERSONAL_OFTASK_FAILURE,
                    payload: error
                })
            })
    };
}
