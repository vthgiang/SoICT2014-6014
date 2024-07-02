const mongoose = require("mongoose");
const { Inventory, Good } = require("../models");
const inventories = require('./ListInventory.json')
require("dotenv").config();

const initInventory = async () => {

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
        if (!db.models.Inventory) Inventory(db);
    };

    initModels(vnistDB);
    /**
    * Tạo dữ liệu
    */

    let newInventories = [];
    let products = await Good(vnistDB).find({});
 

    for (let i = 0; i < inventories.length; i++) {
        let inventory = inventories[i];
        let product = products.find(product => product.code === String(inventory.product_id));
        let newInventory = {
            good: product._id,
            month: inventory.month,
            year: inventory.year,
            maxQuantity: inventory.max_storage,
            inventory: inventory.current_inventory
        };

        newInventories.push(newInventory);
    }

    try {
        console.log("Inserting all at once");
        await Inventory(vnistDB).insertMany(newInventories);
        console.log("All total orders inserted successfully");
    } catch (error) {
        console.error("Error inserting:", error);
    }



}
initInventory().then(() => {
    console.log("Xong! Khởi tạo dữ liệu inventory!")
    process.exit(0)

}).catch(err => {
    console.log(err)
})