const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerLocationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

CustomerLocationSchema.plugin(mongoosePaginate);

module.exports = CustomerLocation = mongoose.model("customer_locations", CustomerLocationSchema);