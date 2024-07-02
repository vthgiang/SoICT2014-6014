import { forecastConstants } from './constants';
import { forecastServices } from './services';

export const forecastActions = {
    getForecasts
}

function getForecasts(queryData) {
    return (dispatch) => {
        dispatch({
            type: forecastConstants.GET_ALL_FORECASTS_REQUEST
        });

        forecastServices
            .getForecasts(queryData)
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
