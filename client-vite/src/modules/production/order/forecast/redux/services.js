import { sendRequest } from '../../../../../helpers/requestHelper'

export const forecastServices = {
    getForecasts,
}

function getForecasts(queryData) {
    return sendRequest(
        {
            url: `${process.env.REACT_APP_SERVER}/forecasts`,
            method: "GET",
            params: {
                code: queryData !== undefined ? queryData.code : "",
                good: queryData !== undefined ? queryData.good : "",
                page: queryData !== undefined ? queryData.page : null,
                limit: queryData !== undefined ? queryData.limit : null
            }
        },
        false,
        true,
        "manage_forecast"
    );
}
