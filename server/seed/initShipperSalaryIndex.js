const mongoose = require("mongoose");
const models = require('../models');
const {
    ShipperCost
} = models;
require('dotenv').config();

const initShipperFormulaIndex = async () => {

    let connectOptions = process.env.DB_AUTHENTICATION === 'true' ?
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            user: process.env.DB_USERNAME,
            pass: process.env.DB_PASSWORD
        } : {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    const vnistDB = mongoose.createConnection(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/vnist`, connectOptions);
    const initModels = (db) => {
        console.log("models", db.models);
        if (!db, models.ShipperCost) ShipperCost(db);
    }
    initModels(vnistDB);
    /**
    * Tạo dữ liệu
    */
    let dataInsert = [
        {code: "PRODUCTIVITY_BONUS_1", name: "Bonus theo vùng 1", cost: 4000, quota: ""},
        {code: "PRODUCTIVITY_BONUS_2", name: "Bonus theo vùng 2 (>10km)", cost: 11000, quota: ""},
        {code: "PRODUCTIVITY_BONUS_3", name: "Bonus theo vùng 3 (>25km)", cost: 16000, quota: ""},
        {code: "PRODUCTIVITY_BONUS_4", name: "Bonus theo vùng 4 (>50km)", cost: 24000, quota: ""},
        {name: "Tỷ lệ giao hàng thành công 1", code: "RATE_SUCCESS_1", cost: 10, quota: 85},
        {name: "Tỷ lệ giao hàng thành công 2", code: "RATE_SUCCESS_2", cost: 20, quota: 90},
        {name: "Tỷ lệ giao hàng thành công 3", code: "RATE_SUCCESS_3", cost: 25, quota: 95},
        {name: "Tỷ lệ giao hàng thành công 4", code: "RATE_SUCCESS_4", cost: 40, quota: 100},
    ];
    await ShipperCost(vnistDB).insertMany(dataInsert);

}
initShipperFormulaIndex().then(() => {
    console.log("Xong! Khởi tạo dữ liệu cho công thức tính lương shipper!")
    process.exit(0)

}).catch(err => {
    console.log(err)
})
