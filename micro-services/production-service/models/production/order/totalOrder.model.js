const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const TotalOrderSchema = new Schema({
    marketingCampaign: {
        type: Schema.Types.ObjectId,
        ref: 'MarketingCampaign'
    },
    good: {
        type: Schema.Types.ObjectId,
        ref: 'Good'
    },
    pricePerBaseUnit: {
        type: Number,
        // required: true
    },
    productionCost: {
        type: Number
    },
    month: {
        type: Number
    },
    year: {
        type: Number
    },
    totalOrder: {
        type: Number
    },
    
}, {
    timestamps: true,
})

TotalOrderSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.TotalOrder)
        return db.model('TotalOrder', TotalOrderSchema)
    return db.models.TotalOrder
}
