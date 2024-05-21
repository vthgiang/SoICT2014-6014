const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const MarketingChartSchema = new Schema({
  x: {
    type: Number,
    required: true,
    default: 4,
  },

  y: {
    type: Number,
    required: true,
    default: 4,
  },

  w: {
    type: Number,
    required: true,
    default: 3,
  },

  h: {
    type: Number,
    required: true,
    default: 6,
  },

  minW: {
    type: Number,
    required: true,
    default: 2,
  },

  maxW: {
    type: Number,
    required: true,
    default: 10,
  },
});

MarketingChartSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.MarketingChart)
    return db.model("MarketingChart", MarketingChartSchema);
  return db.models.MarketingChart;
};
