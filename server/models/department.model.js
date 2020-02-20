const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DepartmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    description: {
        type: String
    },
    dean: {
        type: Schema.Types.ObjectId,
        ref: 'roles'   
    },
    vice_dean: {
        type: Schema.Types.ObjectId,
        ref: 'roles' 
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'roles' 
    },
    parent: {
        type: Schema.Types.ObjectId,
        replies: this
    }
},{
    timestamps: true
});

module.exports = Department = mongoose.model("departments", DepartmentSchema);