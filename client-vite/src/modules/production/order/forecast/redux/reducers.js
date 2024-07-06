import { forecastConstants } from './constants';

const initialState = {
    forecasts: [],
    top5Products: [],
    bottom5Products: [],
    countForecasts: {
        totalOneMonth: 0,
        totalThreeMonth: 0,
        totalSixMonth: 0
    }, // Đảm bảo khởi tạo state với cấu trúc phù hợp
    isLoading: false,
    error: null
};

export const forecasts = (state = initialState, action) => {
    switch (action.type) {
        case forecastConstants.CREATE_FORECAST_REQUEST:
        case forecastConstants.GET_TOP5_PRODUCTS_REQUEST:
        case forecastConstants.GET_BOTTOM5_PRODUCTS_REQUEST:
        case forecastConstants.GET_ALL_FORECASTS_REQUEST:
        case forecastConstants.GET_COUNT_FORECASTS_REQUEST:
            return { ...state, isLoading: true, error: null };
        
        case forecastConstants.CREATE_FORECAST_SUCCESS:
        case forecastConstants.GET_ALL_FORECASTS_SUCCESS:
            return { ...state, isLoading: false, forecasts: action.payload };
        
        case forecastConstants.GET_TOP5_PRODUCTS_SUCCESS:
            return { ...state, isLoading: false, top5Products: action.payload };
        
        case forecastConstants.GET_BOTTOM5_PRODUCTS_SUCCESS:
            return { ...state, isLoading: false, bottom5Products: action.payload };

        case forecastConstants.GET_COUNT_FORECASTS_SUCCESS:
            return { ...state, isLoading: false, countForecasts: action.payload };
        
        case forecastConstants.CREATE_FORECAST_FAILURE:
        case forecastConstants.GET_TOP5_PRODUCTS_FAILURE:
        case forecastConstants.GET_BOTTOM5_PRODUCTS_FAILURE:
        case forecastConstants.GET_ALL_FORECASTS_FAILURE:
        case forecastConstants.GET_COUNT_FORECASTS_FAILURE:
            return { ...state, isLoading: false, error: action.error };
        
        default:
            return state;
    }
};
