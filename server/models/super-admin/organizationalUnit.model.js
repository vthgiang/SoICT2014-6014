const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { Company, Role } = require('../').schema;

// Create Schema
const OrganizationalUnitSchema = new Schema({
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
    viceDean: {
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

module.exports = OrganizationalUnit = mongoose.model("organizational_units", OrganizationalUnitSchema);