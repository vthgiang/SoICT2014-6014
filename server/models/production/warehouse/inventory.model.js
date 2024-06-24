const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const InventorySchema = new Schema({
    marketingCampaign: {
        type: Schema.Types.ObjectId,
        ref: 'MarketingCampaign'
    },
    good: {
        type: Schema.Types.ObjectId,
        ref: 'Good'
    },
    maxQuantity: {
        type: Number,
        // required: true
    },
    month: {
        type: Number
    },
    year: {
        type: Number
    },
    inventory: {
        type: Number
    },
    
}, {
    timestamps: true,
})

InventorySchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Inventory)
        return db.model('Inventory', InventorySchema)
    return db.models.Inventory
}
