import { policyConstants } from './constants';

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

export function policyDelegation(state = initialState, action) {
    let index = -1;
    switch (action.type) {
        case policyConstants.GET_ALL_POLICIES_REQUEST:
        case policyConstants.DELETE_POLICY_REQUEST:
        case policyConstants.CREATE_POLICY_REQUEST:
        case policyConstants.EDIT_POLICY_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case policyConstants.GET_ALL_POLICIES_FAILURE:
        case policyConstants.DELETE_POLICY_FAILURE:
        case policyConstants.CREATE_POLICY_FAILURE:
        case policyConstants.EDIT_POLICY_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case policyConstants.GET_ALL_POLICIES_SUCCESS:
            return {
                ...state,
                lists: action.payload.data,
                totalList: action.payload.totalList,
                isLoading: false
            }
        case policyConstants.DELETE_POLICY_SUCCESS:
            return {
                ...state,
                lists: state.lists.filter(policy => !action.policyIds.includes(policy?._id)),
                isLoading: false
            }
        case policyConstants.CREATE_POLICY_SUCCESS:
            return {
                ...state,
                lists: [
                    ...state.lists,
                    action.payload
                ],
                isLoading: false
            }
        case policyConstants.EDIT_POLICY_SUCCESS:
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