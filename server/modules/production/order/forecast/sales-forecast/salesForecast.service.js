const axios = require('axios');
const { SalesForecast,SalesOrder } = require(`../../../../../models`);
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

    // Lấy tháng có giá trị createdAt lớn nhất trong SalesOrder
    const latestOrder = await SalesOrder(dbConnection).findOne().sort({ createdAt: -1 });
    if (!latestOrder) {
        return { totalForecasts: [] };
    }

    const latestMonth = latestOrder.createdAt.getMonth() + 1;
    const latestYear = latestOrder.createdAt.getFullYear();
    const firstDayOfMonth = new Date(latestYear, latestMonth - 1, 1);
    const lastDayOfMonth = new Date(latestYear, latestMonth, 0);

    // console.log(`First day of latest month: ${firstDayOfMonth}`);
    // console.log(`Last day of latest month: ${lastDayOfMonth}`);

    const salesOrders = await SalesOrder(dbConnection).find({
        createdAt: {
            $gte: firstDayOfMonth,
            $lt: lastDayOfMonth
        }
    }).populate({
        path: "goods.good",
        select: "code name"
    });

    // console.log(`Sales Orders for the latest month: ${JSON.stringify(salesOrders, null, 2)}`);

    // Lấy tất cả dự báo
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

    // console.log(`Forecasts: ${JSON.stringify(allForecasts.docs || allForecasts, null, 2)}`);

    // Tính tổng các giá trị dự báo theo good và thêm giá trị thực tế từ SalesOrder
    let totalForecasts = {};

    // Thêm giá trị thực tế từ SalesOrder
    salesOrders.forEach(order => {
        order.goods.forEach(item => {
            if (!item.good || !item.good._id) {
                console.error(`Order item with missing 'good' reference.`); 
                return;
            }
            const goodId = item.good._id.toString();
            if (!totalForecasts[goodId]) {
                totalForecasts[goodId] = {
                    goodId: goodId,
                    goodCode: item.good.code,
                    goodName: item.good.name || 'Unknown',
                    totalCurrentMonth: 0,
                    totalForecastOrders: 0,
                    totalForecastThreeMonth: 0,
                    totalForecastSixMonth: 0
                };
            }
            totalForecasts[goodId].totalCurrentMonth += item.quantity || 0;
        });
    });

    // Thêm giá trị dự báo từ SalesForecast
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
                totalCurrentMonth: 0,
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

exports.countSalesForecast = async (query, portal) => {
    const dbConnection = connect(DB_CONNECTION, portal);

    let allForecasts = await SalesForecast(dbConnection)
        .find(query)
        .populate([
            {
                path: "good",
                select: "code name pricePerBaseUnit" // Thêm pricePerBaseUnit vào truy vấn
            }
        ]);

    let totalForecastsArray = allForecasts;
    let result = await exports.getAllForecasts(query, portal);
    let totalForecastsArray1 = result.totalForecasts;

    let totalOneMonth = totalForecastsArray1.reduce((sum, forecast) => sum + (forecast.totalForecastOrders || 0), 0);
    let totalThreeMonth = totalForecastsArray1.reduce((sum, forecast) => sum + (forecast.totalForecastThreeMonth || 0), 0);
    let totalSixMonth = totalForecastsArray1.reduce((sum, forecast) => sum + (forecast.totalForecastSixMonth || 0), 0);

    let totalAmountOneMonth = totalForecastsArray.reduce((sum, forecast) => {
        let quantity = forecast.forecastOrders || 0;
        let pricePerBaseUnit = forecast.good?.pricePerBaseUnit || 0;
        return sum + (quantity * pricePerBaseUnit);
    }, 0);

    let totalAmountThreeMonth = totalForecastsArray.reduce((sum, forecast) => {
        let quantity = forecast.forecastThreeMonth || 0;
        let pricePerBaseUnit = forecast.good?.pricePerBaseUnit || 0;
        return sum + (quantity * pricePerBaseUnit);
    }, 0);

    let totalAmountSixMonth = totalForecastsArray.reduce((sum, forecast) => {
        let quantity = forecast.forecastSixMonth || 0;
        let pricePerBaseUnit = forecast.good?.pricePerBaseUnit || 0;
        return sum + (quantity * pricePerBaseUnit);
    }, 0);

    // Tính tỷ lệ phần trăm hoàn thành
    let completionRateOneMonth = totalOneMonth > 0 ? (totalForecastsArray1.reduce((sum, forecast) => sum + (forecast.totalCurrentMonth || 0), 0) / totalOneMonth) * 100 : 0;
    let completionRateThreeMonth = totalThreeMonth > 0 ? (totalForecastsArray1.reduce((sum, forecast) => sum + (forecast.totalCurrentMonth || 0), 0) / totalThreeMonth) * 100 : 0;
    let completionRateSixMonth = totalSixMonth > 0 ? (totalForecastsArray1.reduce((sum, forecast) => sum + (forecast.totalCurrentMonth || 0), 0) / totalSixMonth) * 100 : 0;

    return {
        totalOneMonth,
        totalThreeMonth,
        totalSixMonth,
        totalAmountOneMonth,
        totalAmountThreeMonth,
        totalAmountSixMonth,
        completionRateOneMonth,
        completionRateThreeMonth,
        completionRateSixMonth
    };
};
