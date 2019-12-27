const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

ItemSchema.virtual('stores', {
    ref: 'ItemStore',
    localField: '_id',
    foreignField: 'itemId'
  });

module.exports = Item = mongoose.model("Item", ItemSchema);