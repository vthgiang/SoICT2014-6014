import { ExternalPolicyServices } from "./services";
import { ExternalPolicyConstants } from "./constants";

export const ExternalPolicyActions = {
    getExternalPolicies,
    createExternalPolicy,
    editExternalPolicy,
    deleteExternalPolicy,
}

function getExternalPolicies(data) {
    return dispatch => {
        dispatch({ type: ExternalPolicyConstants.GET_EXTERNAL_POLICY_REQUEST });

        ExternalPolicyServices.getExternalPolicies(data)
            .then(res => {
                dispatch({
                    type: ExternalPolicyConstants.GET_EXTERNAL_POLICY_SUCCESS,
                    payload: res.data.content
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

function createExternalPolicy(data) {
    return dispatch => {
        dispatch({ type: ExternalPolicyConstants.CREATE_EXTERNAL_POLICY_REQUEST });

        ExternalPolicyServices.createExternalPolicy(data)
            .then(res => {
                dispatch({
                    type: ExternalPolicyConstants.CREATE_EXTERNAL_POLICY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: ExternalPolicyConstants.CREATE_EXTERNAL_POLICY_FAILURE,
                    payload: error
                });
                
            })
    }
}

function editExternalPolicy(externalPolicyId, data) {
    return dispatch => {
        dispatch({ type: ExternalPolicyConstants.EDIT_EXTERNAL_POLICY_REQUEST });

        ExternalPolicyServices.editExternalPolicy(externalPolicyId, data)
            .then(res => {
                dispatch({
                    type: ExternalPolicyConstants.EDIT_EXTERNAL_POLICY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: ExternalPolicyConstants.EDIT_EXTERNAL_POLICY_FAILURE,
                    payload: error
                });
                
            })
    }
}

function deleteExternalPolicy(externalPolicyId) {
    return dispatch => {
        dispatch({ type: ExternalPolicyConstants.DELETE_EXTERNAL_POLICY_REQUEST });

        ExternalPolicyServices.deleteExternalPolicy(externalPolicyId)
            .then(res => {
                dispatch({
                    type: ExternalPolicyConstants.DELETE_EXTERNAL_POLICY_SUCCESS,
                    payload: externalPolicyId
                })
            })
            .catch(error => {
                dispatch({ 
                    type: ExternalPolicyConstants.DELETE_EXTERNAL_POLICY_FAILURE,
                    payload: error
                });
                
            })
    }
}
