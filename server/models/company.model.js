const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CompanySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    short_name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
},{
    timestamps: true
});

CompanySchema.plugin(mongoosePaginate);

module.exports = Company = mongoose.model("companies", CompanySchema);