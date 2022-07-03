import { delegationConstants } from './constants';
import { delegationServices } from './services';

export const DelegationActions = {
    getDelegations,
    confirmDelegation,
    rejectDelegation,
    getDelegationsTask
}

function getDelegations(queryData) {
    console.log('alo1')
    return (dispatch) => {
        dispatch({
            type: delegationConstants.GET_ALL_DELEGATIONS_REQUEST
        });

        delegationServices
            .getDelegations(queryData)
            .then((res) => {
                console.log(res.data.content)
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

function getDelegationsTask(queryData) {
    console.log('alo2')

    return (dispatch) => {
        dispatch({
            type: delegationConstants.GET_ALL_DELEGATIONS_TASK_REQUEST
        });

        delegationServices
            .getDelegationsTask(queryData)
            .then((res) => {
                console.log(res.data.content)

                dispatch({
                    type: delegationConstants.GET_ALL_DELEGATIONS_TASK_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: delegationConstants.GET_ALL_DELEGATIONS_TASK_FAILURE,
                    error
                });
            });
    }
}

function confirmDelegation(data) {
    return (dispatch) => {
        dispatch({
            type: delegationConstants.CONFIRM_DELEGATION_REQUEST
        });

        delegationServices
            .confirmDelegation(data)
            .then((res) => {
                dispatch({
                    type: delegationConstants.CONFIRM_DELEGATION_SUCCESS,
                    payload: res.data.content,
                    delegationId: data.delegationId
                });
            })
            .catch((error) => {
                dispatch({
                    type: delegationConstants.CONFIRM_DELEGATION_FAILURE,
                    error
                });
            });
    }
}

function rejectDelegation(data) {
    return (dispatch) => {
        dispatch({
            type: delegationConstants.REJECT_DELEGATION_REQUEST
        });

        delegationServices
            .rejectDelegation(data)
            .then((res) => {
                dispatch({
                    type: delegationConstants.REJECT_DELEGATION_SUCCESS,
                    payload: res.data.content,
                    delegationId: data.delegationId,
                    reason: data.reason
                });
            })
            .catch((error) => {
                dispatch({
                    type: delegationConstants.REJECT_DELEGATION_FAILURE,
                    error
                });
            });
    }
}