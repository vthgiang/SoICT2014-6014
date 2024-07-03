const mongoose = require("mongoose");
const { CustomerMarketing } = require("../models");
const customerMarketings = require('./Customer.json'); // Tên file chứa dữ liệu JSON của CustomerMarketing
require("dotenv").config();

const initCustomerMarketing = async () => {
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
        if (!db.models.CustomerMarketing) CustomerMarketing(db);
    };

    initModels(vnistDB);

    // Xóa dữ liệu cũ
    await CustomerMarketing(vnistDB).deleteMany({});
    console.log('Dữ liệu cũ trong bảng CustomerMarketing đã được xóa');

    var listCustomerMarketings = customerMarketings.map((customer) => {
        return {
            ...customer,
            birthDate: new Date(customer.birthDate),
            dt_Customer: new Date(customer.dt_Customer)
        };
    });

    await CustomerMarketing(vnistDB).insertMany(listCustomerMarketings);
    console.log('Khởi tạo dữ liệu khách hàng Marketing thành công!');
}

initCustomerMarketing().then(() => {
    console.log("Xong! Khởi tạo dữ liệu khách hàng Marketing!");
    process.exit(0);
}).catch(err => {
    console.log(err);
});
