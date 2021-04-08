import { transportPlanConstants } from './constants';
import { transportPlanServices } from './services';

export const transportPlanActions = {
    getAllTransportPlans,
    createTransportPlan,
    getDetailTransportPlan,
    getDetailTransportPlan2,
    editTransportPlan,
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

function getDetailTransportPlan(id) {
    return dispatch => {
        dispatch({
            type: transportPlanConstants.GET_DETAIL_TRANSPORT_PLAN_REQUEST
        });
        transportPlanServices.getDetailTransportPlan(id)
            .then((res) => {
                dispatch({
                    type: transportPlanConstants.GET_DETAIL_TRANSPORT_PLAN_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: transportPlanConstants.GET_DETAIL_TRANSPORT_PLAN_FAILURE,
                    error
                });
            });
    }
}

function getDetailTransportPlan2(id) {
    return dispatch => {
        dispatch({
            type: transportPlanConstants.GET_DETAIL_TRANSPORT_PLAN_2_REQUEST
        });
        transportPlanServices.getDetailTransportPlan(id)
            .then((res) => {
                dispatch({
                    type: transportPlanConstants.GET_DETAIL_TRANSPORT_PLAN_2_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: transportPlanConstants.GET_DETAIL_TRANSPORT_PLAN_2_FAILURE,
                    error
                });
            });
    }
}

function editTransportPlan(id, data) {
    return (dispatch) => {
        dispatch({
            type: transportPlanConstants.EDIT_TRANSPORT_PLAN_REQUEST
        });
        transportPlanServices
            .editTransportPlan(id, data)
            .then((res) => {
                dispatch({
                    type: transportPlanConstants.EDIT_TRANSPORT_PLAN_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: transportPlanConstants.EDIT_TRANSPORT_PLAN_FAILURE,
                    error
                });
            });
    }
}