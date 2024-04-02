import { DeliveryConstants } from './constants';
import { DeliveryServices } from './services';

export const DeliveryActions = {
    getDeliveries,
    saveSolution,
    changeOrderToJourney,
    createDeliveryPlan,
    getAllDeliveries,
    getAllJourney
}

function getDeliveries(queryData) {
    return (dispatch) => {
        dispatch({
            type: DeliveryConstants.GET_ALL_DELIVERY_REQUEST
        });

        DeliveryServices
            .getDeliveries(queryData)
            .then((res) => {
                dispatch({
                    type: DeliveryConstants.GET_ALL_DELIVERY_SUCCESS,
                    payload: res.data.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: DeliveryConstants.GET_ALL_DELIVERY_FAILURE,
                    error
                });
            });
    }
}

function getAllDeliveries(queryData) {
    return (dispatch) => {
        dispatch({
            type: DeliveryConstants.GET_ALL_DELIVERY_REQUEST
        });

        DeliveryServices
            .getAllDeliveries(queryData)
            .then((res) => {
                dispatch({
                    type: DeliveryConstants.GET_ALL_DELIVERY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: DeliveryConstants.GET_ALL_DELIVERY_FAILURE,
                    error
                });
            });
    }
}

function saveSolution(solution) {
    return (dispatch) => {
        dispatch({
            type: DeliveryConstants.SAVE_SOLUTION_REQUEST
        });

        DeliveryServices.saveSolution(solution)
            .then((res) => {
                dispatch({
                    type: DeliveryConstants.SAVE_SOLUTION_SUCCESS,
                });
                console.log("Luu lo trinh ok!", res.data.data);
            })
            .catch((error) => {
                dispatch({
                    type: DeliveryConstants.SAVE_SOLUTION_FAILURE,
                    error
                });
            });
    }
}

function changeOrderToJourney(data) {
    return (dispatch) => {
        dispatch({
            type: DeliveryConstants.CHANGE_ORDER_POSITION_REQUEST
        })

        DeliveryServices.changeOrderToJourney(data)
            .then((res) => {
                dispatch({
                    type: DeliveryConstants.CHANGE_ORDER_POSITION_SUCCESS,
                });
                return res.data;
            })
            .catch((error) => {
                dispatch({
                    type: DeliveryConstants.CHANGE_ORDER_POSITION_FAILURE,
                    error
                });
                return;
            });
    }
}

function createDeliveryPlan(data) {
    return (dispatch) => {
        dispatch({
            type: DeliveryConstants.CREATE_DELIVERY_PLAN_REQUEST
        });

        DeliveryServices
            .createDeliveryPlan(data)
            .then((res) => {
                dispatch({
                    type: DeliveryConstants.CREATE_DELIVERY_PLAN_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: DeliveryConstants.CREATE_DELIVERY_PLAN_FAILURE,
                    error
                });
            });
    }
}

function getAllJourney(queryData) {
    return (dispatch) => {
        dispatch({
            type: DeliveryConstants.GET_ALL_JOURNEY_REQUEST
        });

        DeliveryServices
            .getAllJourney(queryData)
            .then((res) => {
                dispatch({
                    type: DeliveryConstants.GET_ALL_JOURNEY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: DeliveryConstants.GET_ALL_JOURNEY_FAILURE,
                    error
                });
            });
    }
}