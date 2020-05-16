import {  dashboardEmployeeKpiConstants } from "./constants";
import {  dashboardEmployeeKpiService } from "./services";

export const DashboardEvaluationEmployeeKpiSetAction = {
    getAllEmployeeKpiSetOfUnit,
    getAllEmployeeOfUnit,
    getChildrenOfOrganizationalUnitsAsTree
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

// Lấy tất cả nhân viên của đơn vị
function getAllEmployeeOfUnit(role) {
    return dispatch => {
        dispatch({type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_OF_UNIT_REQUEST});
 
        dashboardEmployeeKpiService.getAllEmployeeOfUnit(role)
            .then(res=>{ 
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_OF_UNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({
                    type: dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_OF_UNIT_FAILURE,
                    payload: error
                })
            })
    };
}

// Lấy các đơn vị con của một đơn vị và đơn vị đó
function getChildrenOfOrganizationalUnitsAsTree(role) {
    return dispatch => {
        dispatch({type: dashboardEmployeeKpiConstants.GET_ALL_CHILDREN_OF_UNIT_REQUEST});
 
        dashboardEmployeeKpiService.getChildrenOfOrganizationalUnitsAsTree(role)
            .then(res=>{ 
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
