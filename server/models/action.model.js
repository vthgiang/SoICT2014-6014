const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ActionSchema = new Schema({
    name: {
        type: String
    },
    see: {
        type: String,
        required: true
    },   
    open: {
        type: String,
        required: true
    },  
    edit: {
        type: String,
        required: true
    },  
    delete: {
        type: String,
        required: true
    },  
    enable: {
        type: String,
        required: true
    },  
    disable: {
        type: String,
        required: true
    }
});

module.exports = Action = mongoose.model("actions", ActionSchema);