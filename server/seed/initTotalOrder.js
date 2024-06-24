const mongoose = require("mongoose");
const { TotalOrder, Good, MarketingCampaign } = require("../models");
const totalOrders = require('./TotalOrders.json')
require("dotenv").config();

const initTotalOrder = async () => {

    let connectOptions =
        process.env.DB_AUTHENTICATION === "true"
            ? {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
                user: process.env.DB_USERNAME,
                pass: process.env.DB_PASSWORD,
            }
            : {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            };
    const vnistDB = mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || "27017"}/vnist`,
        connectOptions
    );
    if (!vnistDB) throw "DB vnist cannot connect";

    console.log("DB vnist connected");

    const initModels = (db) => {
        if (!db.models.TotalOrder) TotalOrder(db);
    };

    initModels(vnistDB);
    /**
    * Tạo dữ liệu
    */

    let newTotalOrders = [];
    let products = await Good(vnistDB).find({});
    let listMarketing = await MarketingCampaign(vnistDB).find({});

    for (let i = 0; i < totalOrders.length; i++) {
        let totalOrder = totalOrders[i];
        let product = products.find(product => product.code === String(totalOrder.product_id));
        let marketing = listMarketing.find(marketing => marketing.code === String(totalOrder.campaign_id));
        let newTotalOrder = {
            good: product._id,
            month: totalOrder.month,
            year: totalOrder.year,
            pricePerBaseUnit: totalOrder.price,
            productionCost: totalOrder.purchase_price,
            totalOrder: totalOrder.total_item_cnt_month,
            marketingCampaign: marketing._id
        };

        newTotalOrders.push(newTotalOrder);
    }

    try {
        console.log("Inserting all orders at once");
        await TotalOrder(vnistDB).insertMany(newTotalOrders);
        console.log("All total orders inserted successfully");
    } catch (error) {
        console.error("Error inserting orders:", error);
    }



}
initTotalOrder().then(() => {
    console.log("Xong! Khởi tạo dữ liệu doanh số từng tháng!")
    process.exit(0)

}).catch(err => {
    console.log(err)
})