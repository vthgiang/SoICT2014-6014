import { transportScheduleConstants } from './constants';
const initialState = {
    lists: [],
    isLoading: true,
}
export function transportSchedule(state = initialState, action) {
switch (action.type) {
		case transportScheduleConstants.GET_ALL_TRANSPORT_SCHEDULES_REQUEST:
        case transportScheduleConstants.CREATE_TRANSPORT_SCHEDULE_REQUEST:
		return {
                ...state,
                isLoading: true
            }
		
		case transportScheduleConstants.GET_ALL_TRANSPORT_SCHEDULES_FAILURE:
        case transportScheduleConstants.CREATE_TRANSPORT_SCHEDULE_FAILURE:        
		return {
                ...state,
                isLoading: false,
                error: action.error
            }
		case transportScheduleConstants.GET_ALL_TRANSPORT_SCHEDULES_SUCCESS:
		return {
                ...state,
                lists: action.payload.data,
                isLoading: false
            }
        case transportScheduleConstants.CREATE_TRANSPORT_SCHEDULE_SUCCESS:
            return {
                ...state,
                lists: [
                    ...state.lists,
                    action.payload
                ],
                isLoading: false
            }
		default:
            		return state
}
}
