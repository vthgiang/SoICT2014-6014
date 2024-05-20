const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const LayoutSchema = new Schema({
    LOCATION: {
        type: String,
        required: true
    },
    WIDTH: {
        type: Number,
        required: true
    },
    DEPTH: {
        type: Number,
        required: false
    },
    HEIGHT: {
        type: Number,
        required: true
    },
    X: {
        type: Number,
        required: true
    },
    Y: {
        type: Number,
        required: true
    },
    Z: {
        type: Number,
        required: true
    },
    AISLE: {
        type: String,
        required: true
    },
    CENTERAXIS: {
        type: String,
        required: true
    },
    AISLESIDE: {
        type: String,
        required: true
    },
    BAY: {
        type: String,
        required: true
    },
    WAREHOUSE: {
        type: String,
        required: true
    },
    AREA: {
        type: String,
        required: true
    },
    LEVEL: {
        type: Number,
        required: true
    }
});

LayoutSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Layout)
        return db.model('Layout', LayoutSchema);
    return db.models.Layout;
}