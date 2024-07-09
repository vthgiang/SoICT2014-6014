const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const MarketingEffectiveSchema = new Schema(
  {
    marketingId: { type: Schema.Types.ObjectId, ref: 'MarketingCampaign' },
    date: {
      type: Date,
    },
    code: {
      type: String,
      required: true,
    },
    click: {
      type: Number,
    },
    impression: {
      type: Number,
    },
    session: {
      type: Number,
    },
    transaction: {
      type: Number,
    },
    revenue: {
      type: Number,
    },
    positiveRes: {
      type: Number,
    },
    negativeRes: {
      type: Number,
    },
    conversion: {
      type: Number,
    },
    cost: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

MarketingEffectiveSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.MarketingEffective)
    return db.model("MarketingEffective", MarketingEffectiveSchema);
  return db.models.MarketingEffective;
};
