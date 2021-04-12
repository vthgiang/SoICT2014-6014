import { transportRequirementsConstants } from './constants';

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
    isLoading: true,
    error: null,
    totalList: 0,
}
export function transportRequirements(state = initialState, action) {
    let index = -1;
    switch (action.type) {
		case transportRequirementsConstants.GET_ALL_TRANSPORT_REQUIREMENTS_REQUEST:
        case transportRequirementsConstants.CREATE_TRANSPORT_REQUIREMENT_REQUEST:
        case transportRequirementsConstants.GET_DETAIL_TRANSPORT_REQUIREMENT_REQUEST:
        case transportRequirementsConstants.EDIT_TRANSPORT_REQUIREMENT_REQUEST:
        case transportRequirementsConstants.DELETE_TRANSPORT_REQUIREMENT_REQUEST:
		return {
                ...state,
                isLoading: true
            }
		
		case transportRequirementsConstants.GET_ALL_TRANSPORT_REQUIREMENTS_FAILURE:
        case transportRequirementsConstants.CREATE_TRANSPORT_REQUIREMENT_FAILURE:
        case transportRequirementsConstants.GET_DETAIL_TRANSPORT_REQUIREMENT_FAILURE:
        case transportRequirementsConstants.EDIT_TRANSPORT_REQUIREMENT_FAILURE:
        case transportRequirementsConstants.DELETE_TRANSPORT_REQUIREMENT_FAILURE:
		return {
                ...state,
                isLoading: false,
                error: action.error
            }
		case transportRequirementsConstants.GET_ALL_TRANSPORT_REQUIREMENTS_SUCCESS:
		return {
                ...state,
                lists: action.payload.data,
                isLoading: false
            }
        case transportRequirementsConstants.CREATE_TRANSPORT_REQUIREMENT_SUCCESS:
            return {
                ...state,
                lists: [
                    ...state.lists,
                    action.payload
                ],
                isLoading: false
            }
        case transportRequirementsConstants.GET_DETAIL_TRANSPORT_REQUIREMENT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                currentTransportRequirement: action.payload,
            }
        case transportRequirementsConstants.EDIT_TRANSPORT_REQUIREMENT_SUCCESS:
            index = findIndex(state.lists, action.payload._id);
            if (index !== -1) {
                state.lists[index] = action.payload
            }
            return {
                ...state,
                isLoading: false
            }
        case transportRequirementsConstants.DELETE_TRANSPORT_REQUIREMENT_SUCCESS:
            return {
                ...state,
                lists: state.lists.filter(transportRequirement => (transportRequirement?._id !== action.payload?._id)),
                isLoading: false
            }
		default:
            		return state
    }
}
