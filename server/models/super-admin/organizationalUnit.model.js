const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company= require('../system-admin/company.model');
const Role= require('../auth/role.model');

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
    deans: [{
        type: Schema.Types.ObjectId,
        ref: Role  
    }],
    viceDeans: [{
        type: Schema.Types.ObjectId,
        ref: Role
    }],
    employees: [{
        type: Schema.Types.ObjectId,
        ref: Role
    }],
    parent: {
        type: Schema.Types.ObjectId,
        replies: this
    }
},{
    timestamps: true
});

module.exports = OrganizationalUnit = mongoose.model("organizational_units", OrganizationalUnitSchema);