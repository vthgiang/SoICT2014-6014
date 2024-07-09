const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const InventoryWarehouseSchema = new Schema({
  location: {
    type: String,
  },
  item_no: {
    type: Number,
  },
  item_description: {
    type: String,
    required: false,
  },
  pack: {
    type: Number,
  },
  size: {
    type: String,
  },
  item_wgt: {
    type: Number,
  },
  weekly_mvmt: {
    type: Number,
  },
  item_cost: {
    type: Number,
  },
  cases_damaged: {
    type: String,
  },
  color_cases_damaged: {
    type: String,
  },
  link_: {
    type: String,
  },
  good: {
    type: Schema.Types.ObjectId,
    ref: "Good",
    require: false,
  },
  contained: {
    type: String,
  },
  capacity: {
    type: String,
  },
});

InventoryWarehouseSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.InventoryWarehouse)
    return db.model("InventoryWarehouse", InventoryWarehouseSchema);
  return db.models.InventoryWarehouse;
};
