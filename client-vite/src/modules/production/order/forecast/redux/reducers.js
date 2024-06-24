import { forecastConstants } from './constants';

const initialState = {
    lists: [],
    isLoading: true,
}

export function forecasts(state = initialState, action) {
    switch (action.type) {
        case forecastConstants.GET_ALL_FORECASTS_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case forecastConstants.GET_ALL_FORECASTS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            }
        case forecastConstants.GET_ALL_FORECASTS_SUCCESS:
            return {
                ...state,
                lists: action.payload,
                isLoading: false
            }
        default:
            return state
    }
}
