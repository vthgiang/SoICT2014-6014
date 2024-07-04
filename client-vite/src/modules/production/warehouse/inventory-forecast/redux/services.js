import { sendRequest } from '../../../../../helpers/requestHelper';

export const forecastServices = {
    createForecast
};

function createForecast() {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/inventory-forecast`,
            method: "POST"
        },
        false,
        true,
        "manage_forecast"
    );
}
