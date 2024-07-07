const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const RevenuesForecastSchema = new Schema(
  {
    campaign:{
        type: Schema.Types.ObjectId,
        ref: 'MarketingCampaign'
    },
    forecastRevenue: {
        type: Number,
    }
  },
  {
    timestamps: true,
  }
)

RevenuesForecastSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.RevenuesForecast)
    return db.model("RevenuesForecast", RevenuesForecastSchema);
  return db.models.RevenuesForecast;
};