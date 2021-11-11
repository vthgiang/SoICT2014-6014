import {
    DashboardUnitServices
} from "./services";
import {
    DashboardUnitConstants
} from "./constants";

export const DashboardUnitActions = {
    getAllUnitDashboardData,
}

function getAllUnitDashboardData(data) {
    return dispatch => {
        dispatch({
            type: DashboardUnitConstants.GET_ALL_UNIT_DASHBOARD_DATA_REQUEST,
            chartNameArr: Object.keys(data),
        });
        DashboardUnitServices.getAllUnitDashboardData(data)
            .then(res => {
                dispatch({
                    type: DashboardUnitConstants.GET_ALL_UNIT_DASHBOARD_DATA_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({
                    type: DashboardUnitConstants.GET_ALL_UNIT_DASHBOARD_DATA_FAILURE,
                    message : err
                });
            })
    }
}