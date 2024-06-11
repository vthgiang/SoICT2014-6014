const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const MarketingCampaignSchema = new Schema(
  {
    code:{
        type: String,
        required: true,
    },
    cost: {
        type: Number,
    },
    channel: {
      type: String,
    },

    name: {
      type: String,
      
    },
    status: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
)

MarketingCampaignSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.MarketingCampaign)
    return db.model("MarketingCampaign", MarketingCampaignSchema);
  return db.models.MarketingCampaign;
};
