import { forecastConstants } from './constants';
import { forecastServices } from './services';

export const forecastActions = {
    createForecast,
    getTop5Products,
    getBottom5Products,
    getAllForecasts, 
    countSalesForecast 
};

function createForecast() {
    return (dispatch) => {
        dispatch({ type: forecastConstants.CREATE_FORECAST_REQUEST });

        forecastServices.createForecast()
            .then((res) => {
                dispatch({
                    type: forecastConstants.CREATE_FORECAST_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: forecastConstants.CREATE_FORECAST_FAILURE,
                    error
                });
            });
    }
}

function getTop5Products() {
    return (dispatch) => {
        dispatch({ type: forecastConstants.GET_TOP5_PRODUCTS_REQUEST });

        forecastServices.getTop5Products()
            .then((res) => {
                dispatch({
                    type: forecastConstants.GET_TOP5_PRODUCTS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: forecastConstants.GET_TOP5_PRODUCTS_FAILURE,
                    error
                });
            });
    }
}

function getBottom5Products() {
    return (dispatch) => {
        dispatch({ type: forecastConstants.GET_BOTTOM5_PRODUCTS_REQUEST });

        forecastServices.getBottom5Products()
            .then((res) => {
                dispatch({
                    type: forecastConstants.GET_BOTTOM5_PRODUCTS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: forecastConstants.GET_BOTTOM5_PRODUCTS_FAILURE,
                    error
                });
            });
    }
}

function getAllForecasts() {
    return (dispatch) => {
        dispatch({ type: forecastConstants.GET_ALL_FORECASTS_REQUEST });

        forecastServices.getAllForecasts()
            .then((res) => {
                dispatch({
                    type: forecastConstants.GET_ALL_FORECASTS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: forecastConstants.GET_ALL_FORECASTS_FAILURE,
                    error
                });
            });
    }
}

// Thêm hàm này
function countSalesForecast() {
    return (dispatch) => {
        dispatch({ type: forecastConstants.GET_COUNT_FORECASTS_REQUEST });

        forecastServices.countSalesForecast()
            .then((res) => {
                dispatch({
                    type: forecastConstants.GET_COUNT_FORECASTS_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch((error) => {
                dispatch({
                    type: forecastConstants.GET_COUNT_FORECASTS_FAILURE,
                    error
                });
            });
    }
}
