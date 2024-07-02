const axios = require('axios');
const {
    SalesForecast
} = require(`../../../../../models`);

const { connect
} = require(`../../../../../helpers/dbHelper`);


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

    if (!page || !limit) {
        let allForecasts = await SalesForecast(dbConnection)
            .find(option)
            .populate([
                {
                    path: "good",
                    select: "code name"
                }
            ]);
        return { allForecasts };
    } else {
        let allForecasts = await SalesForecast(dbConnection).paginate(option, {
            page,
            limit,
            populate: [{
                path: "good",
                select: "code name"
            }]
        });
        return { allForecasts };
    }
};

exports.getForecastById = async (id, portal) => {
    const dbConnection = connect(DB_CONNECTION, portal);
    return await SalesForecast(dbConnection).findById(id).populate([
        {
            path: "good",
            select: "code name"
        }
    ]);
};



// exports.getForecast = async (portal) => {
//     try {
//         const dbConnection = connect(DB_CONNECTION, portal);

//         const orders = await SalesOrder(dbConnection).find();
//         const transformedOrders = orders.map(order => ({
//             order_id: order._id.toString(),
//             date: order.createdAt.toISOString(),
//             quantity: order.goods.reduce((total, good) => total + good.quantity, 0),
//             total_amount: order.paymentAmount,
//             order_status: order.status.toString(),
//             sales_channel: order.salesChannel,
//             marketing_id: order.marketingCampaign ? order.marketingCampaign.toString() : '',
//             product_id: order.goods.map(good => good.good.toString()).join(', '),
//             product_name: order.goods.map(good => good.name).join(', '),
//             product_description: order.goods.map(good => good.description).join(', '),
//         }));

//         const response = await axios.post('http://localhost:5000/forecast', transformedOrders);

//         const forecastResults = response.data.forecast;

//         // Lưu kết quả vào database
//         await Promise.all(forecastResults.map(async result => {
//             const forecast = new Forecast({
//                 good: result.product_id,
//                 forecastOrders: result.forecastOrders,
//                 forecastThreeMonth: result.forecastThreeMonth,
//                 forecastSixMonth: result.forecastSixMonth,
//                 forecastInventory: result.forecastInventory
//             });
//             await forecast.save();
//         }));

//         return forecastResults;
//     } catch (error) {
//         console.error('Error in calling Python API:', error);
//         throw new Error('Failed to get forecast');
//     }
// };
