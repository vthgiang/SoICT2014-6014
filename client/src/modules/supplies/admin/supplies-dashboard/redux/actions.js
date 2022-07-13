import { SuppliesDashboardConstants } from "./constants";
import { SuppliesDashboardService } from "./service";

export const SuppliesDashboardActions = {
    getSuppliesDashboard,
    getSuppliesOrganizationDashboard
}

function getSuppliesDashboard(data) {
    return (dispatch) => {
        dispatch({
            type: SuppliesDashboardConstants.GET_SUPPLIES_DASHBOARD_REQUEST
        });
        SuppliesDashboardService.getSuppliesDashboard(data)
            .then((res) => {
                dispatch({
                    type: SuppliesDashboardConstants.GET_SUPPLIES_DASHBOARD_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({
                    type: SuppliesDashboardConstants.GET_SUPPLIES_DASHBOARD_FAILURE,
                    error: err,
                });
            });
    };
}

function getSuppliesOrganizationDashboard(data) {
    return (dispatch) => {
        dispatch({
            type: SuppliesDashboardConstants.GET_SUPPLIES_ORGANIZATION_DASHBOARD_REQUEST
        });
        SuppliesDashboardService.getSuppliesOrganizationDashboard(data)
            .then((res) => {
                dispatch({
                    type: SuppliesDashboardConstants.GET_SUPPLIES_ORGANIZATION_DASHBOARD_SUCCESS,
                    payload: res.data.content,
                });
            })
            .catch((err) => {
                dispatch({
                    type: SuppliesDashboardConstants.GET_SUPPLIES_ORGANIZATION_DASHBOARD_FAILURE,
                    error: err,
                });
            });
    };
}