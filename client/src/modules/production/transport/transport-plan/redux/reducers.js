import { transportPlanConstants } from './constants';

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
}
export function transportPlan(state = initialState, action) {
    let index = -1;
    switch (action.type) {
		case transportPlanConstants.GET_ALL_TRANSPORT_PLANS_REQUEST:
        case transportPlanConstants.CREATE_TRANSPORT_PLAN_REQUEST:
        case transportPlanConstants.GET_DETAIL_TRANSPORT_PLAN_REQUEST:
        case transportPlanConstants.EDIT_TRANSPORT_PLAN_REQUEST:
		return {
                ...state,
                isLoading: true
            }
		
		case transportPlanConstants.GET_ALL_TRANSPORT_PLANS_FAILURE:
        case transportPlanConstants.CREATE_TRANSPORT_PLAN_FAILURE:    
        case transportPlanConstants.GET_DETAIL_TRANSPORT_PLAN_FAILURE:   
        case transportPlanConstants.EDIT_TRANSPORT_PLAN_FAILURE:
		return {
                ...state,
                isLoading: false,
                error: action.error
            }
		case transportPlanConstants.GET_ALL_TRANSPORT_PLANS_SUCCESS:
		return {
                ...state,
                lists: action.payload.data,
                isLoading: false
            }
        case transportPlanConstants.CREATE_TRANSPORT_PLAN_SUCCESS:
            return {
                ...state,
                lists: [
                    ...state.lists,
                    action.payload
                ],
                isLoading: false
            }

        case transportPlanConstants.GET_DETAIL_TRANSPORT_PLAN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                currentTransportPlan: action.payload,
            }

        case transportPlanConstants.EDIT_TRANSPORT_PLAN_SUCCESS:
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
