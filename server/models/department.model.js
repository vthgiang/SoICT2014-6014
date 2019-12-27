const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Role = require('./role.model');
const Company = require('./company.model');

// Create Schema
const DepartmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company
    },
    description: {
        type: String
    },
    dean: {
        type: Schema.Types.ObjectId,
        ref: Role   
    },
    vice_dean: {
        type: Schema.Types.ObjectId,
        ref: Role 
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: Role 
    },
    parent: {
        type: Schema.Types.ObjectId,
        replies: this
    }
},{
    timestamps: true
});

module.exports = Department = mongoose.model("departments", DepartmentSchema);