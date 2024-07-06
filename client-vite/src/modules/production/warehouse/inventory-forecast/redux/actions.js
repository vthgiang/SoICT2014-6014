import { forecastConstants } from './constants';
import { forecastServices } from './services';

export const forecastActions = {
    createForecast,
    getAllForecasts
};

function createForecast() {
    return (dispatch) => {
        dispatch({
            type: forecastConstants.CREATE_FORECAST_REQUEST
        });

        forecastServices
            .createForecast()
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
