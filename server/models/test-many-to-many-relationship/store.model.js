const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StoreSchema = new Schema({
    name: {
        type: String,
        required: true
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

StoreSchema.virtual('items', {
    ref: 'ItemStore',
    localField: '_id',
    foreignField: 'storeId'
});

module.exports = Store = mongoose.model("Store", StoreSchema);