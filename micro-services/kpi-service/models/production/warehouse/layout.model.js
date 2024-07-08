const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const LayoutSchema = new Schema({
  location: {
    type: String,
  },
  width: {
    type: Number,
  },
  depth: {
    type: Number,
    required: false,
  },
  height: {
    type: Number,
  },
  x: {
    type: Number,
  },
  y: {
    type: Number,
  },
  z: {
    type: Number,
  },
  aisle: {
    type: String,
  },
  centeraxis: {
    type: String,
  },
  aisleside: {
    type: String,
  },
  bay: {
    type: String,
  },
  warehouse: {
    type: String,
  },
  area: {
    type: String,
  },
  level: {
    type: Number,
  },
});

LayoutSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.Layout) return db.model("Layout", LayoutSchema);
  return db.models.Layout;
};
