import { transportPlanConstants } from './constants';
const initialState = {
    lists: [],
    isLoading: true,
}
export function transportPlan(state = initialState, action) {
switch (action.type) {
		case transportPlanConstants.GET_ALL_TRANSPORT_PLANS_REQUEST:
        case transportPlanConstants.CREATE_TRANSPORT_PLAN_REQUEST:
        case transportPlanConstants.GET_DETAIL_TRANSPORT_PLAN_REQUEST:
		return {
                ...state,
                isLoading: true
            }
		
		case transportPlanConstants.GET_ALL_TRANSPORT_PLANS_FAILURE:
        case transportPlanConstants.CREATE_TRANSPORT_PLAN_FAILURE:    
        case transportPlanConstants.GET_DETAIL_TRANSPORT_PLAN_FAILURE:   
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

		default:
            		return state
}
}
