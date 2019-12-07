const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const LinkSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

module.exports = Link = mongoose.model("links", LinkSchema);