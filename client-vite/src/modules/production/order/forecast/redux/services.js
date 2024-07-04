import { sendRequest } from '../../../../../helpers/requestHelper';

export const forecastServices = {
    createForecast,
    getTop5Products,
    getBottom5Products,
    getAllForecasts // Thêm hàm này
};

function createForecast() {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/forecasts`,
            method: "POST"
        },
        false,
        true,
        "manage_forecast"
    );
}

function getTop5Products() {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/forecasts/top5`,
            method: "GET"
        },
        false,
        true,
        "manage_forecast"
    );
}

function getBottom5Products() {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/forecasts/bottom5`,
            method: "GET"
        },
        false,
        true,
        "manage_forecast"
    );
}

// Thêm hàm này
function getAllForecasts() {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/forecasts`,
            method: "GET"
        },
        false,
        true,
        "manage_forecast"
    );
}
