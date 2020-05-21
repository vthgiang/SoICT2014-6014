import {
    HolidayConstants
} from './constants';
const initState = {
    listHoliday: [],
    isLoading: false
}

export function holiday(state = initState, action) {
    switch (action.type) {
        case HolidayConstants.GET_HOLIDAY_REQUEST:
        case HolidayConstants.CREATE_HOLIDAY_REQUEST:
        case HolidayConstants.DELETE_HOLIDAY_REQUEST:
        case HolidayConstants.UPDATE_HOLIDAY_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case HolidayConstants.GET_HOLIDAY_SUCCESS:
            return {
                ...state,
                listHoliday: action.payload,
                isLoading: false,
            };
        case HolidayConstants.CREATE_HOLIDAY_SUCCESS:
            return {
                ...state,
                listHoliday: [
                        ...state.listHoliday,
                        action.payload
                    ],
                isLoading: false,
            };
        case HolidayConstants.DELETE_HOLIDAY_SUCCESS:
            return {
                ...state,
                listHoliday: state.listHoliday.filter(holiday => (holiday._id !== action.payload._id)),
                isLoading: false,
            };
        case HolidayConstants.UPDATE_HOLIDAY_SUCCESS:
            return {
                ...state,
                listHoliday: state.listHoliday.map(holiday =>
                        (holiday._id === action.payload._id) ?
                        action.payload : holiday
                    ),
                isLoading: false,
            };
        case HolidayConstants.GET_HOLIDAY_FAILURE:
        case HolidayConstants.CREATE_HOLIDAY_FAILURE:
        case HolidayConstants.DELETE_HOLIDAY_FAILURE:
        case HolidayConstants.UPDATE_HOLIDAY_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error.message
            };
        default:
            return state
    }
}