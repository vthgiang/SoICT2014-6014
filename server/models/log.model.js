const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const LogSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
});

module.exports = Log = mongoose.model("logs", LogSchema);