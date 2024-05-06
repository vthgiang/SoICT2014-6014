import { ExternalPolicyServices } from "./services";
import { ExternalPolicyConstants } from "./constants";

export const ExternalPolicyActions = {
    getExternalPolicies,
}

function getExternalPolicies(data) {
    return dispatch => {
        dispatch({ type: ExternalPolicyConstants.GET_EXTERNAL_POLICY_REQUEST });

        ExternalPolicyServices.getExternalPolicies(data)
            .then(res => {
                dispatch({
                    type: ExternalPolicyConstants.GET_EXTERNAL_POLICY_SUCCESS,
                    payload: res.data
                })
            })
            .catch(error => {
                dispatch({ 
                    type: ExternalPolicyConstants.GET_EXTERNAL_POLICY_FAILURE,
                    payload: error
                });
                
            })
    }
}
