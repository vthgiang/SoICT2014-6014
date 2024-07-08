const axios = require('axios');
const forecastService = require('./inventoryForecast.service');
const Log = require(`../../../../logs`);

exports.createForecast = async (req, res) => {
    try {
        // Gọi đến server Python để dự báo
        const pythonResponse = await axios.post('http://localhost:8080/api/dxclan/forecast/inventory', req.body);

        // Kiểm tra phản hồi từ server Python
        if (pythonResponse.data.success) {
            // Lưu kết quả vào cơ sở dữ liệu
            const forecasts = pythonResponse.data.forecasts;
            await forecastService.saveForecasts(forecasts, req.portal);

            // Lấy lại tất cả dữ liệu dự báo từ cơ sở dữ liệu
            let allForecasts = await forecastService.getAllForecasts({}, req.portal);

            await Log.info(req.user.email, "CREATE_FORECAST", req.portal);

            // Trả về dữ liệu dự báo cho frontend
            res.status(200).json({
                success: true,
                messages: ["create_forecast_successfully"],
                content: allForecasts.allForecasts
            });
        } else {
            // Nếu thất bại, trả về lỗi
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
        // Lấy dữ liệu dự báo từ service
        let allForecasts = await forecastService.getAllForecasts(req.query, req.portal);

        await Log.info(req.user.email, "GET_ALL_FORECASTS", req.portal);

        // Trả về dữ liệu dự báo cho frontend
        res.status(200).json({
            success: true,
            messages: ["get_all_forecasts_successfully"],
            content: allForecasts.allForecasts
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_FORECASTS", req.portal);
        console.error('Error in getting forecasts:', error);

        res.status(400).json({
            success: false,
            messages: ["get_all_forecasts_failed"],
            content: error.message
        });
    }
};