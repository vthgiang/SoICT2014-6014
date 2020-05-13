import {  dashboardEmployeeKpiConstants } from "./constants";
import {  dashboardEmployeeKpiService } from "./services";

export const DashboardEvaluationEmployeeKpiSetAction = {
    getAllEmployeeKpiSetOfUnit
};

// Lấy tất cả KPI cá nhân
function getAllEmployeeKpiSetOfUnit(role) {
    return dispatch => {
        dispatch({type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_REQUEST});
 
        dashboardEmployeeKpiService.getAllEmployeeKpiSetOfUnit(role)
            .then(res=>{                
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_FAILURE,
                    payload: error
                })
            })
    };
}

