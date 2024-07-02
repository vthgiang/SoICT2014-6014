const forecastService = require('./salesForecast.service');
const Log = require(`../../../../../logs`);



exports.getAllForecasts = async (req, res) => {
    try {
        let query = req.query;
        let allForecasts = await forecastService.getAllForecasts(query, req.portal);

        await Log.info(req.user.email, "GET_ALL_FORECAST", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: allForecasts.allForecasts // Sử dụng allForecasts.allForecasts để lấy dữ liệu
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_FORECAST", req.portal);
        console.error('Error in getting forecasts:', error);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
};

exports.getForecastById = async (req, res) => {
    try {
        const forecast = await forecastService.getForecastById(req.params.id, req.portal);
        
        await Log.info(req.user.email, "GET_FORECAST_BY_ID", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_forecast_by_id_successfully"],
            content: forecast
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_FORECAST_BY_ID", req.portal);
        console.error('Error in getting forecast by id:', error);

        res.status(400).json({
            success: false,
            messages: ["get_forecast_by_id_failed"],
            content: error.message
        });
    }
};


// exports.getForecast = async (req, res) => {
//     try {
//         const portal = req.portal; // Assuming `portal` is part of the request
//         const forecastResult = await forecastService.getForecast(portal);

//         await Log.info(req.user.email, "GET_FORECAST", req.portal);

//         res.status(200).json({
//             success: true,
//             messages: ["forecast_successfully"],
//             content: forecastResult
//         });
//     } catch (error) {
//         await Log.error(req.user.email, "GET_FORECAST", req.portal);
//         console.error('Error in getting forecast:', error);

//         res.status(400).json({
//             success: false,
//             messages: ["forecast_failed"],
//             content: error.message
//         });
//     }
// };
