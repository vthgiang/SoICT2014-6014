const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const OrganizationalUnitSchema = new Schema({
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
    deans: [{
        type: Schema.Types.ObjectId,
        ref: 'roles'  
    }],
    viceDeans: [{
        type: Schema.Types.ObjectId,
        ref: 'roles'
    }],
    employees: [{
        type: Schema.Types.ObjectId,
        ref: 'roles'
    }],
    parent: {
        type: Schema.Types.ObjectId,
        replies: this
    }
},{
    timestamps: true
});

module.exports = OrganizationalUnit = (db) => db.model("organizational_units", OrganizationalUnitSchema);