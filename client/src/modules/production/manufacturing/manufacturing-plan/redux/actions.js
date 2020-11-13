import { manufacturingPlanConstants } from "./constants"
import { manufacturingPlanServices } from "./services";

export const manufacturingPlanActions = {
    getAllManufacturingPlans,
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