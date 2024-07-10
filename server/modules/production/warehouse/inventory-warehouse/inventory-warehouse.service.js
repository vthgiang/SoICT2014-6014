const { InventoryWarehouse } = require("../../../../models");
const { connect } = require("../../../../helpers/dbHelper");

exports.getAllInventories = async (portal) => {
  let inventories = await InventoryWarehouse(connect(DB_CONNECTION, portal))
    .find()
    .populate({ path: 'good', select: 'name -_id' })
    .select("-_id -weekly_mvmt -item_wgt -item_cost -contained -color_cases_damaged -size -cases_damaged -capacity -item_description -link_ -__v")
    .lean(); // Sử dụng lean() để trả về plain JavaScript objects

  // Biến đổi kết quả để 'good' chỉ là tên, không phải là object
  inventories = inventories.map(inventory => {
    if (inventory.good && inventory.good.name) {
      inventory.good = inventory.good.name;
    }
    return inventory;
  });

  return inventories;
};