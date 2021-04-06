import { transportPlanConstants } from './constants';
import { transportPlanServices } from './services';

export const transportPlanActions = {
    getAllTransportPlans,
    createTransportPlan,
}

function getAllTransportPlans(queryData) {
    return (dispatch) => {
        dispatch({
            type: transportPlanConstants.GET_ALL_TRANSPORT_PLANS_REQUEST
        });

        transportPlanServices
            .getAllTransportPlans(queryData)
            .then((res) => {
                dispatch({
                    type: transportPlanConstants.GET_ALL_TRANSPORT_PLANS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportPlanConstants.GET_ALL_TRANSPORT_PLANS_FAILURE,
                    error
                });
            });
    }
}

function createTransportPlan(data) {
    return (dispatch) => {
        dispatch({
            type: transportPlanConstants.CREATE_TRANSPORT_PLAN_REQUEST
        });
        transportPlanServices
            .createTransportPlan(data)
            .then((res) => {
                dispatch({
                    type: transportPlanConstants.CREATE_TRANSPORT_PLAN_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportPlanConstants.CREATE_TRANSPORT_PLAN_FAILURE,
                    error
                });
            });
    }
}