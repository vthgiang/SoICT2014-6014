const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerLocationSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    district: [{
        name: {
            type: String
        }
    }]
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

CustomerLocationSchema.plugin(mongoosePaginate);

module.exports = CustomerLocation = mongoose.model("customer_locations", CustomerLocationSchema);