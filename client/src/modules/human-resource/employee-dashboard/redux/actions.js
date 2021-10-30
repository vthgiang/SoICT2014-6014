import { getEmployeeDashboardDataConstant } from './constants';
import { getEmployeeDashboardDataServices } from './services';

export const getEmployeeDashboardActions = {
    getEmployeeDashboardData
}

function getEmployeeDashboardData(data) {
    return (dispatch) => {
        dispatch({
            type: getEmployeeDashboardDataConstant.GET_EMPLOYEE_DASHBOARD_DATA_REQUEST
        });

        getEmployeeDashboardDataServices
            .getEmployeeDashboardData(data)
            .then((res) => {
                dispatch({
                    type: getEmployeeDashboardDataConstant.GET_EMPLOYEE_DASHBOARD_DATA_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: getEmployeeDashboardDataConstant.GET_EMPLOYEE_DASHBOARD_DATA_FAILURE,
                    error
                });
            });
    }
}