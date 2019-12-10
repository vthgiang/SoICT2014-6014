const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('./company.model');

// Create Schema
const LinkSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    }
});

module.exports = Link = mongoose.model("links", LinkSchema);