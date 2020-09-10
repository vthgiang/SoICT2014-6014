const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('./company.model');

const ImportConfiguraionSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: Company,
        required: true
    },
    configuration: {
        type: Object,
        required: true
    },
    type: {
        type: String,
        enum: ['salary', 'taskTemplate']
    },

}, {
    timestamps: true
});

module.exports = ImportConfiguraion = (db) => db.model("import_configuraions", ImportConfiguraionSchema);