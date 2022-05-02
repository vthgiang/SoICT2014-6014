import { delegationConstants } from './constants';
import { delegationServices } from './services';

export const DelegationActions = {
    getDelegations,
    deleteDelegations,
    createDelegation,
    editDelegation
}

function getDelegations(queryData) {
    return (dispatch) => {
        dispatch({
            type: delegationConstants.GET_ALL_DELEGATIONS_REQUEST
        });

        delegationServices
            .getDelegations(queryData)
            .then((res) => {
                dispatch({
                    type: delegationConstants.GET_ALL_DELEGATIONS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: delegationConstants.GET_ALL_DELEGATIONS_FAILURE,
                    error
                });
            });
    }
}

function deleteDelegations(data) {
    return (dispatch) => {
        dispatch({
            type: delegationConstants.DELETE_DELEGATION_REQUEST
        });

        delegationServices
            .deleteDelegations(data)
            .then((res) => {
                dispatch({
                    type: delegationConstants.DELETE_DELEGATION_SUCCESS,
                    payload: res.data.content,
                    delegationIds: data.delegationIds
                });
            })
            .catch((error) => {
                dispatch({
                    type: delegationConstants.DELETE_DELEGATION_FAILURE,
                    error
                });
            });
    }
}

function createDelegation(data) {
    return (dispatch) => {
        dispatch({
            type: delegationConstants.CREATE_DELEGATION_REQUEST
        });
        delegationServices
            .createDelegation(data)
            .then((res) => {
                dispatch({
                    type: delegationConstants.CREATE_DELEGATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: delegationConstants.CREATE_DELEGATION_FAILURE,
                    error
                });
            });
    }
}

function editDelegation(id, data) {
    return (dispatch) => {
        dispatch({
            type: delegationConstants.EDIT_DELEGATION_REQUEST
        });
        delegationServices
            .editDelegation(id, data)
            .then((res) => {
                dispatch({
                    type: delegationConstants.EDIT_DELEGATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: delegationConstants.EDIT_DELEGATION_FAILURE,
                    error
                });
            });
    }
}