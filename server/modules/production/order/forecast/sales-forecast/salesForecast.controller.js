const axios = require('axios');
const forecastService = require('./salesForecast.service');
const Log = require(`../../../../../logs`);

exports.createForecast = async (req, res) => {
    try {
        const pythonResponse = await axios.post(`${process.env.PYTHON_URL_SERVER}/api/dxclan/forecast/orders`, req.body)


        if (pythonResponse.data.success) {
            const forecasts = pythonResponse.data.forecasts;
            await forecastService.saveForecasts(forecasts, req.portal);

            let allForecasts = await forecastService.getAllForecasts({}, req.portal);

            await Log.info(req.user.email, "CREATE_FORECAST", req.portal);

            res.status(200).json({
                success: true,
                messages: ["create_forecast_successfully"],
                content: allForecasts.totalForecasts
            });
        } else {
            res.status(500).json({ message: 'Lỗi khi dự báo', error: pythonResponse.data.error });
        }
    } catch (error) {
        await Log.error(req.user.email, "CREATE_FORECAST", req.portal);
        console.error('Error in creating forecast:', error);

        res.status(400).json({
            success: false,
            messages: ["create_forecast_failed"],
            content: error.message
        });
    }
};

exports.getAllForecasts = async (req, res) => {
    try {
        let allForecasts = await forecastService.getAllForecasts(req.query, req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_all_forecasts_successfully"],
            content: allForecasts.totalForecasts
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_FORECASTS", req.portal);
        console.error('Error in getting all forecasts:', error);

        res.status(400).json({
            success: false,
            messages: ["get_all_forecasts_failed"],
            content: error.message
        });
    }
};

exports.getTop5Products = async (req, res) => {
    try {
        let top5Products = await forecastService.getTop5Products(req.query, req.portal);

        await Log.info(req.user.email, "GET_TOP5_PRODUCTS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_top5_products_successfully"],
            content: top5Products
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_TOP5_PRODUCTS", req.portal);
        console.error('Error in getting top 5 products:', error);

        res.status(400).json({
            success: false,
            messages: ["get_top5_products_failed"],
            content: error.message
        });
    }
};

exports.getBottom5Products = async (req, res) => {
    try {
        let bottom5Products = await forecastService.getBottom5Products(req.query, req.portal);

        await Log.info(req.user.email, "GET_BOTTOM5_PRODUCTS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_bottom5_products_successfully"],
            content: bottom5Products
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_BOTTOM5_PRODUCTS", req.portal);
        console.error('Error in getting bottom 5 products:', error);

        res.status(400).json({
            success: false,
            messages: ["get_bottom5_products_failed"],
            content: error.message
        });
    }
};

exports.countSalesForecast = async (req, res) => {
    try {
        let totalForecasts = await forecastService.countSalesForecast(req.query, req.portal);

        await Log.info(req.user.email, "GET_TOTAL_FORECASTS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_total_forecasts_successfully"],
            content: totalForecasts
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_TOTAL_FORECASTS", req.portal);
        console.error('Error in getting total forecasts:', error);

        res.status(400).json({
            success: false,
            messages: ["get_total_forecasts_failed"],
            content: error.message
        });
    }
};
