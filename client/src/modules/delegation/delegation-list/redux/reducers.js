import { delegationConstants } from './constants';

var findIndex = (array, id) => {
    var result = -1;
    array.forEach((value, index) => {
        if (value._id === id) {
            result = index;
        }
    });
    return result;
}

const initialState = {
    lists: [],
    isLoading: false,
    error: null,
    totalList: 0,
}

export function delegation(state = initialState, action) {
    let index = -1;
    switch (action.type) {
        case delegationConstants.GET_ALL_DELEGATIONS_REQUEST:
        case delegationConstants.DELETE_DELEGATION_REQUEST:
        case delegationConstants.CREATE_DELEGATION_REQUEST:
        case delegationConstants.EDIT_DELEGATION_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case delegationConstants.GET_ALL_DELEGATIONS_FAILURE:
        case delegationConstants.DELETE_DELEGATION_FAILURE:
        case delegationConstants.CREATE_DELEGATION_FAILURE:
        case delegationConstants.EDIT_DELEGATION_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case delegationConstants.GET_ALL_DELEGATIONS_SUCCESS:
            return {
                ...state,
                lists: action.payload.data,
                totalList: action.payload.totalList,
                isLoading: false
            }
        case delegationConstants.DELETE_DELEGATION_SUCCESS:
            return {
                ...state,
                lists: state.lists.filter(delegation => !action.delegationIds.includes(delegation?._id)),
                isLoading: false
            }
        case delegationConstants.CREATE_DELEGATION_SUCCESS:
            return {
                ...state,
                lists: [
                    ...state.lists,
                    action.payload
                ],
                isLoading: false
            }
        case delegationConstants.EDIT_DELEGATION_SUCCESS:
            index = findIndex(state.lists, action.payload._id);
            if (index !== -1) {
                state.lists[index] = action.payload
            }
            return {
                ...state,
                isLoading: false
            }
        default:
            return state
    }
}