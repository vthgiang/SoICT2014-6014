import { manufacturingPlanConstants } from "./constants"
import { manufacturingPlanServices } from "./services";

export const manufacturingPlanActions = {
    getAllManufacturingPlans,
    getAllApproversOfPlan,
    createManufacturingPlan,
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