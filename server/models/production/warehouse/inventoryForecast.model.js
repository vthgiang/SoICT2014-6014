const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const InventoryForecastSchema = new Schema(
  {
    good: {
        type: Schema.Types.ObjectId,
        ref: 'Good'
    },
    inventoryForecast: {
        type: Number,
    },
    forecastThreeMonth:{
        type: Number,
    },
    forecastSixMonth:{
        type: Number,
    },
  },
  {
    timestamps: true,
  }
)

InventoryForecastSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.InventoryForecast)
    return db.model("InventoryForecast", InventoryForecastSchema);
  return db.models.InventoryForecast;
};
