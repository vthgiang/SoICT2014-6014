import { forecastConstants } from './constants';

const initialState = {
    forecasts: [],
    isLoading: false,
    error: null
};

export const inventoryForecast = (state = initialState, action) => {
    switch (action.type) {
        case forecastConstants.CREATE_FORECAST_REQUEST:
        case forecastConstants.GET_ALL_FORECASTS_REQUEST: 
            return { ...state, isLoading: true, error: null };

        case forecastConstants.CREATE_FORECAST_SUCCESS:
        case forecastConstants.GET_ALL_FORECASTS_SUCCESS:
            return { ...state, isLoading: false, forecasts: action.payload };

        case forecastConstants.CREATE_FORECAST_FAILURE:
        case forecastConstants.GET_ALL_FORECASTS_FAILURE:
            return { ...state, isLoading: false, error: action.error };
        default:
            return state;
    }
};
