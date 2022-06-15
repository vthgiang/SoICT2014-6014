import { delegationConstants } from './constants';
import { delegationServices } from './services';

export const DelegationActions = {
    getDelegations,
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

function editDelegation(id, data) {
    return (dispatch) => {
        dispatch({
            type: delegationConstants.REPLY_DELEGATION_REQUEST
        });
        delegationServices
            .replyDelegation(id, data)
            .then((res) => {
                dispatch({
                    type: delegationConstants.REPLY_DELEGATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: delegationConstants.REPLY_DELEGATION_FAILURE,
                    error
                });
            });
    }
}