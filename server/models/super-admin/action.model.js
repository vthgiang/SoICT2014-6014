const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ActionSchema = new Schema({
    name: {
        type: String
    },
    see: {
        type: Boolean,
        required: true
    },   
    open: {
        type: Boolean,
        required: true
    },  
    edit: {
        type: Boolean,
        required: true
    },  
    delete: {
        type: Boolean,
        required: true
    },  
    enable: {
        type: Boolean,
        required: true
    },  
    disable: {
        type: Boolean,
        required: true
    }
});

module.exports = Action = mongoose.model("actions", ActionSchema);