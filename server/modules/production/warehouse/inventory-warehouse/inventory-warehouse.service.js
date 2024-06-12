const { InventoryWarehouse } = require('../../../../models');
const { connect } = require('../../../../helpers/dbHelper');

exports.getAllInventories = async (portal) => {
        // return InventoryWarehouse(connect(DB_CONNECTION, portal)).find().select('-_id -__v');
        return InventoryWarehouse(connect(DB_CONNECTION, portal)).find().select('-_id -weekly_mvmt -item_wgt -item_cost -color_cases_damaged -pack -size -cases_damaged -contained -capacity -__v');
}

