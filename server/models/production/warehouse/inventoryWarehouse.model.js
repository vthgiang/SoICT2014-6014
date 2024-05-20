const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const InventoryWarehouseSchema = new Schema({
    LOCATION: {
        type: String,
        required: true
    },
    ITEM_NO: {
        type: Number,
        required: true
    },
    ITEM_DESCRIPTION: {
        type: String,
        required: false
    },
    PACK: {
        type: Number,
        required: true
    },
    SIZE: {
        type: String,
        required: true
    },
    ITEM_WGT: {
        type: Number,
        required: true
    },
    WEEKLY_MVMT: {
        type: Number,
        required: true
    },
    ITEM_COST: {
        type: Number,
        required: true
    },
    CASES_DAMAGED: {
        type: String,
        required: true
    },
    COLOR_CASES_DAMAGED: {
        type: String,
        required: true
    },
    LINK_: {
        type: String,
        required: true
    }
});

InventoryWarehouseSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.InventoryWarehouse)
        return db.model('InventoryWarehouse', InventoryWarehouseSchema);
    return db.models.InventoryWarehouse;
}