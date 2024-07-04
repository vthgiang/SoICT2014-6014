const axios = require('axios');
const { SalesForecast } = require(`../../../../../models`);
const { connect } = require(`../../../../../helpers/dbHelper`);

exports.saveForecasts = async (forecasts, portal) => {
    const dbConnection = connect(DB_CONNECTION, portal);
    await SalesForecast(dbConnection).insertMany(forecasts);
};

exports.getAllForecasts = async (query, portal) => {
    let { page, limit } = query;
    let option = {};

    if (query.code) {
        option.code = new RegExp(query.code, "i");
    }

    if (query.good) {
        option.good = query.good;
    }

    const dbConnection = connect(DB_CONNECTION, portal);

    let allForecasts;
    if (!page || !limit) {
        allForecasts = await SalesForecast(dbConnection)
            .find(option)
            .populate([
                {
                    path: "good",
                    select: "code name"
                }
            ]);
    } else {
        allForecasts = await SalesForecast(dbConnection).paginate(option, {
            page,
            limit,
            populate: [{
                path: "good",
                select: "code name"
            }]
        });
    }

    // Tính tổng các giá trị dự báo theo good
    let totalForecasts = {};

    (allForecasts.docs || allForecasts).forEach(forecast => {
        if (!forecast.good || !forecast.good._id) {
            console.error(`Forecast with ID ${forecast._id} has an invalid or missing 'good' reference.`);
            return;
        }
        const goodId = forecast.good._id.toString();
        if (!totalForecasts[goodId]) {
            totalForecasts[goodId] = {
                goodId: goodId,
                goodName: forecast.good.name || 'Unknown',
                totalForecastOrders: 0,
                totalForecastThreeMonth: 0,
                totalForecastSixMonth: 0
            };
        }

        totalForecasts[goodId].totalForecastOrders += forecast.forecastOrders || 0;
        totalForecasts[goodId].totalForecastThreeMonth += forecast.forecastThreeMonth || 0;
        totalForecasts[goodId].totalForecastSixMonth += forecast.forecastSixMonth || 0;
    });

    // Chuyển đối tượng tổng kết thành mảng
    let totalForecastsArray = Object.values(totalForecasts);

    return { 
        totalForecasts: totalForecastsArray
    };
};

exports.getTop5Products = async (query, portal) => {
    let result = await exports.getAllForecasts(query, portal);
    let totalForecastsArray = result.totalForecasts;

    let top5OneMonth = [...totalForecastsArray].sort((a, b) => b.totalForecastOrders - a.totalForecastOrders).slice(0, 5);
    let top5ThreeMonth = [...totalForecastsArray].sort((a, b) => b.totalForecastThreeMonth - a.totalForecastThreeMonth).slice(0, 5);
    let top5SixMonth = [...totalForecastsArray].sort((a, b) => b.totalForecastSixMonth - a.totalForecastSixMonth).slice(0, 5);

    return { 
        top5OneMonth,
        top5ThreeMonth,
        top5SixMonth
    };
};

exports.getBottom5Products = async (query, portal) => {
    let result = await exports.getAllForecasts(query, portal);
    let totalForecastsArray = result.totalForecasts;

    let bottom5OneMonth = [...totalForecastsArray].sort((a, b) => a.totalForecastOrders - b.totalForecastOrders).slice(0, 5);
    let bottom5ThreeMonth = [...totalForecastsArray].sort((a, b) => a.totalForecastThreeMonth - b.totalForecastThreeMonth).slice(0, 5);
    let bottom5SixMonth = [...totalForecastsArray].sort((a, b) => a.totalForecastSixMonth - b.totalForecastSixMonth).slice(0, 5);

    return { 
        bottom5OneMonth,
        bottom5ThreeMonth,
        bottom5SixMonth
    };
};
