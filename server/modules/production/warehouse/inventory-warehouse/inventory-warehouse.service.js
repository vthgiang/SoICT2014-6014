const { InventoryWarehouse } = require('../../../../models');
const { connect } = require('../../../../helpers/dbHelper');

exports.getAllInventories = async (portal) => {
        return InventoryWarehouse(connect(DB_CONNECTION, portal)).find().select('-_id -__v');
}

