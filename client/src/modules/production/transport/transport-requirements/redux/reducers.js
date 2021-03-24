import { transportRequirementsConstants } from './constants';
const initialState = {
    lists: [],
    isLoading: true,
}
export function transportRequirements(state = initialState, action) {
switch (action.type) {
		case transportRequirementsConstants.GET_ALL_TRANSPORT_REQUIREMENTS_REQUEST:
		return {
                ...state,
                isLoading: true
            }
		
		case transportRequirementsConstants.GET_ALL_TRANSPORT_REQUIREMENTS_FAILURE:
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

		default:
            		return state
}
}
