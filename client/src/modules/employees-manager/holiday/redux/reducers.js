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
            return {
                ...state,
                isLoading: true,
            };
        case HolidayConstants.GET_HOLIDAY_SUCCESS:
            return {
                ...state,
                listHoliday: action.listHoliday.content,
                    isLoading: false,
            };
        case HolidayConstants.GET_HOLIDAY_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case HolidayConstants.CREATE_HOLIDAY_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case HolidayConstants.CREATE_HOLIDAY_SUCCESS:
            return {
                ...state,
                listHoliday: [
                        ...state.listHoliday,
                        action.newHoliday.content
                    ],
                    isLoading: false,
            };
        case HolidayConstants.CREATE_HOLIDAY_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case HolidayConstants.DELETE_HOLIDAY_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case HolidayConstants.DELETE_HOLIDAY_SUCCESS:
            return {
                ...state,
                listHoliday: state.listHoliday.filter(Holiday => (Holiday._id !== action.holidayDelete.content._id)),
                    isLoading: false,
            };
        case HolidayConstants.DELETE_HOLIDAY_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        case HolidayConstants.UPDATE_HOLIDAY_REQUEST:
            return {
                ...state,
                isLoading: true,
            };
        case HolidayConstants.UPDATE_HOLIDAY_SUCCESS:
            return {
                ...state,
                listHoliday: state.listHoliday.map(Holiday =>
                        (Holiday._id === action.infoHoliday.content._id) ?
                        action.infoHoliday.content : Holiday
                    ),
                    isLoading: false,
            };
        case HolidayConstants.UPDATE_HOLIDAY_FAILURE:
            return {
                error: action.error,
                isLoading: false,
            };
        default:
            return state
    }
}