const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SystemApiSchema = new Schema({
    path: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
},{
    timestamps: true,
});

module.exports = (db) => {
    if(!db.models.SystemApi)
        return db.model('SystemApi', SystemApiSchema);
    return db.models.SystemApi;
}