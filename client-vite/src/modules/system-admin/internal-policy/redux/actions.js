import { InternalPolicyServices } from "./services";
import { InternalPolicyConstants } from "./constants";

export const InternalPolicyActions = {
    getInternalPolicies,
    createInternalPolicy,
    editInternalPolicy,
    deleteInternalPolicy,
}

function getInternalPolicies(data) {
    return dispatch => {
        dispatch({ type: InternalPolicyConstants.GET_INTERNAL_POLICY_REQUEST });

        InternalPolicyServices.getInternalPolicies(data)
            .then(res => {
                dispatch({
                    type: InternalPolicyConstants.GET_INTERNAL_POLICY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: InternalPolicyConstants.GET_INTERNAL_POLICY_FAILURE,
                    payload: error
                });
                
            })
    }
}

function createInternalPolicy(data) {
    return dispatch => {
        dispatch({ type: InternalPolicyConstants.CREATE_INTERNAL_POLICY_REQUEST });

        InternalPolicyServices.createInternalPolicy(data)
            .then(res => {
                dispatch({
                    type: InternalPolicyConstants.CREATE_INTERNAL_POLICY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: InternalPolicyConstants.CREATE_INTERNAL_POLICY_FAILURE,
                    payload: error
                });
                
            })
    }
}

function editInternalPolicy(internalPolicyId, data) {
    return dispatch => {
        dispatch({ type: InternalPolicyConstants.EDIT_INTERNAL_POLICY_REQUEST });

        InternalPolicyServices.editInternalPolicy(internalPolicyId, data)
            .then(res => {
                dispatch({
                    type: InternalPolicyConstants.EDIT_INTERNAL_POLICY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error => {
                dispatch({ 
                    type: InternalPolicyConstants.EDIT_INTERNAL_POLICY_FAILURE,
                    payload: error
                });
                
            })
    }
}

function deleteInternalPolicy(internalPolicyId) {
    return dispatch => {
        dispatch({ type: InternalPolicyConstants.DELETE_INTERNAL_POLICY_REQUEST });

        InternalPolicyServices.deleteInternalPolicy(internalPolicyId)
            .then(res => {
                dispatch({
                    type: InternalPolicyConstants.DELETE_INTERNAL_POLICY_SUCCESS,
                    payload: internalPolicyId
                })
            })
            .catch(error => {
                dispatch({ 
                    type: InternalPolicyConstants.DELETE_INTERNAL_POLICY_FAILURE,
                    payload: error
                });
                
            })
    }
}
