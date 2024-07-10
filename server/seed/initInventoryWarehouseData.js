const mongoose = require('mongoose');
const listInventory = require('./inventoryData.json');
const { InventoryWarehouse, Good } = require('../models');

require('dotenv').config();

const initInventoryWarehouseData = async () => {
  let connectOptions =
    process.env.DB_AUTHENTICATION === 'true'
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
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/vnist`,
    connectOptions
  );
  if (!vnistDB) throw 'DB vnist cannot connect';

  console.log('DB vnist connected');

  const initModels = (db) => {
    if (!db.models.InventoryWarehouse) InventoryWarehouse(db);
  };

  // get data from model Good
  const listProducts = await Good(vnistDB).find({});

  let newInventories = [];

  await InventoryWarehouse(vnistDB).deleteMany({});
  let productIndex = 0;
  let maxRepeats = Math.ceil(listInventory.length / 1000); // Tính số lần lặp lại tối đa cho mỗi sản phẩm

  listInventory.forEach((item, index) => {
    let newInventory = {
      location: item.location,
      item_description: item.item_description,
      pack: item.pack,
      size: item.size,
      item_wgt: item.item_wgt,
      weekly_mvmt: item.weekly_mvmt,
      item_cost: item.item_cost,
      cases_damaged: item.cases_damaged,
      color_cases_damaged: item.color_cases_damaged,
      link_: item.link_,
      good: productIndex < 1000 ? listProducts[productIndex+10]._id : undefined,
      contained: item.contained,
      capacity: item.capacity,
    };
    newInventories.push(newInventory);

    // Tăng productIndex sau mỗi maxRepeats lần lặp
    if ((index + 1) % maxRepeats === 0) {
      productIndex++; // Chỉ tăng productIndex sau khi đã lặp đủ số lần maxRepeats
      if (productIndex >= 1000) {
        productIndex = 0; // Reset productIndex về 0 sau khi đạt 400
      }
    }
  });

  await InventoryWarehouse(vnistDB).insertMany(newInventories);

  initModels(vnistDB);
  await vnistDB.close();

  console.log('End init inventory warehouse database!');
};

initInventoryWarehouseData().catch((err) => {
  console.log(err);
  process.exit(0);
});
