const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const SalesForecastSchema = new Schema(
  {
    good: {
        type: Schema.Types.ObjectId,
        ref: 'Good'
    },
    forecastOrders: {
        type: Number,
    },
    forecastThreeMonth:{
        type: Number,
    },
    forecastSixMonth:{
        type: Number,
    },
    forecastInventory:{
        type: Number,
    }
  },
  {
    timestamps: true,
  }
)

SalesForecastSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.SalesForecast)
    return db.model("SalesForecast", SalesForecastSchema);
  return db.models.SalesForecast;
};
