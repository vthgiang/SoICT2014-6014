import { policyConstants } from './constants';
import { policyServices } from './services';

export const PolicyActions = {
    getPolicies,
    deletePolicies,
    createPolicy,
    editPolicy,
    getPolicyById
}

function getPolicies(queryData) {
    return (dispatch) => {
        dispatch({
            type: policyConstants.GET_ALL_POLICIES_REQUEST
        });

        policyServices
            .getPolicies(queryData)
            .then((res) => {
                dispatch({
                    type: policyConstants.GET_ALL_POLICIES_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: policyConstants.GET_ALL_POLICIES_FAILURE,
                    error
                });
            });
    }
}

function getPolicyById(id) {
    return (dispatch) => {
        dispatch({
            type: policyConstants.GET_POLICY_BY_ID_REQUEST
        });
        policyServices
            .getPolicyById(id)
            .then((res) => {
                dispatch({
                    type: policyConstants.GET_POLICY_BY_ID_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: policyConstants.GET_POLICY_BY_ID_FAILURE,
                    error
                });
            });
    }
}

function deletePolicies(data) {
    return (dispatch) => {
        dispatch({
            type: policyConstants.DELETE_POLICY_REQUEST
        });

        policyServices
            .deletePolicies(data)
            .then((res) => {
                dispatch({
                    type: policyConstants.DELETE_POLICY_SUCCESS,
                    payload: res.data.content,
                    policyIds: data.policyIds
                });
            })
            .catch((error) => {
                dispatch({
                    type: policyConstants.DELETE_POLICY_FAILURE,
                    error
                });
            });
    }
}

function createPolicy(data) {
    return (dispatch) => {
        dispatch({
            type: policyConstants.CREATE_POLICY_REQUEST
        });
        policyServices
            .createPolicy(data)
            .then((res) => {
                dispatch({
                    type: policyConstants.CREATE_POLICY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: policyConstants.CREATE_POLICY_FAILURE,
                    error
                });
            });
    }
}

function editPolicy(id, data) {
    return (dispatch) => {
        dispatch({
            type: policyConstants.EDIT_POLICY_REQUEST
        });
        policyServices
            .editPolicy(id, data)
            .then((res) => {
                dispatch({
                    type: policyConstants.EDIT_POLICY_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: policyConstants.EDIT_POLICY_FAILURE,
                    error
                });
            });
    }
}