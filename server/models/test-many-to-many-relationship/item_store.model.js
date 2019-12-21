const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemStoreSchema = new Schema({
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true }
});

module.exports = ItemStore = mongoose.model('ItemStore', ItemStoreSchema);