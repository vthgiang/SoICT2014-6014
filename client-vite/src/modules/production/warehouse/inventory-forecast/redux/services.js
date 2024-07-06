import { sendRequest } from '../../../../../helpers/requestHelper';

export const forecastServices = {
    createForecast,
    getAllForecasts
};

function createForecast() {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/inventory-forecast/`,
            method: "POST"
        },
        false,
        true,
        "manage_forecast.create_forecast"
    );
}
function getAllForecasts() {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/inventory-forecast/`,
            method: "GET"
        },
        false,
        true,
        "manage_forecast.get_forecast"
    );
}
