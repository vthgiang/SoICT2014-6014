import { manufacturingPlanConstants } from "./constants"
import { manufacturingPlanServices } from "./services";

export const manufacturingPlanActions = {
    getAllManufacturingPlans,
    getAllApproversOfPlan,
    createManufacturingPlan,
    getDetailManufacturingPlan,
    handleEditManufacturingPlan,
    getNumberPlans,
    getNumberPlansByStatus
}

function getAllManufacturingPlans(query) {
    return dispatch => {
        dispatch({
            type: manufacturingPlanConstants.GET_ALL_MANUFACTURING_PLANS_REQUEST
        });
        manufacturingPlanServices.getAllManufacturingPlans(query)
            .then((res) => {
                dispatch({
                    type: manufacturingPlanConstants.GET_ALL_MANUFACTURING_PLANS_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: manufacturingPlanConstants.GET_ALL_MANUFACTURING_PLANS_FAILURE,
                    error
                });
            });
    }
}

function getAllApproversOfPlan(currentRole) {
    return dispatch => {
        dispatch({
            type: manufacturingPlanConstants.GET_ALL_APPROVERS_OF_PLAN_REQUEST
        });
        manufacturingPlanServices.getAllApproversOfPlan(currentRole)
            .then((res) => {
                dispatch({
                    type: manufacturingPlanConstants.GET_ALL_APPROVERS_OF_PLAN_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: manufacturingPlanConstants.GET_ALL_APPROVERS_OF_PLAN_FAILURE,
                    error
                });
            });
    }
}

function createManufacturingPlan(data) {
    return dispatch => {
        dispatch({
            type: manufacturingPlanConstants.CREATE_MANUFACTURING_PLAN_REQUEST
        });
        manufacturingPlanServices.createManufacturingPlan(data)
            .then((res) => {
                dispatch({
                    type: manufacturingPlanConstants.CREATE_MANUFACTURING_PLAN_SUCCESS,
                    payload: res.data.content
                });
            }).catch((error) => {
                dispatch({
                    type: manufacturingPlanConstants.CREATE_MANUFACTURING_PLAN_FAILURE,
                    error
                });
            });
    }
}

function getDetailManufacturingPlan(id) {
    return dispatch => {
        dispatch({
            type: manufacturingPlanConstants.GET_MANUFACTURING_PLAN_BY_ID_REQUEST
        });
        manufacturingPlanServices.getDetailManufacturingPlan(id)
            .then((res) => {
                dispatch({
                    type: manufacturingPlanConstants.GET_MANUFACTURING_PLAN_BY_ID_SUCCESS,
                    payload: res.data.content
                })
            }).catch((error) => {
                dispatch({
                    type: manufacturingPlanConstants.GET_MANUFACTURING_PLAN_BY_ID_FAILURE,
                    error
                });
            });
    }
}

function handleEditManufacturingPlan(data, id) {
    return dispatch => {
        dispatch({
            type: manufacturingPlanConstants.EDIT_MANUFACTURING_PLAN_REQUEST
        });
        manufacturingPlanServices.handleEditManufacturingPlan(data, id)
            .then((res) => {
                dispatch({
                    type: manufacturingPlanConstants.EDIT_MANUFACTURING_PLAN_SUCCESS,
                    payload: res.data.content
                })
            }).catch((error) => {
                dispatch({
                    type: manufacturingPlanConstants.EDIT_MANUFACTURING_PLAN_FAILURE,
                    error
                });
            });
    }
}

function getNumberPlans(data) {
    return dispatch => {
        dispatch({
            type: manufacturingPlanConstants.GET_NUMBER_PLAN_REQUEST
        });
        manufacturingPlanServices.getNumberPlans(data)
            .then((res) => {
                dispatch({
                    type: manufacturingPlanConstants.GET_NUMBER_PLAN_SUCCESS,
                    payload: res.data.content
                })
            }).catch((error) => {
                dispatch({
                    type: manufacturingPlanConstants.GET_NUMBER_PLAN_FAILURE,
                    error
                });
            });
    }
}

function getNumberPlansByStatus(data) {
    return dispatch => {
        dispatch({
            type: manufacturingPlanConstants.GET_NUMBER_PLAN_BY_STATUS_REQUEST
        });
        manufacturingPlanServices.getNumberPlansByStatus(data)
            .then((res) => {
                dispatch({
                    type: manufacturingPlanConstants.GET_NUMBER_PLAN_BY_STATUS_SUCCESS,
                    payload: res.data.content
                })
            }).catch((error) => {
                dispatch({
                    type: manufacturingPlanConstants.GET_NUMBER_PLAN_BY_STATUS_FAILURE,
                    error
                });
            });
    }
}