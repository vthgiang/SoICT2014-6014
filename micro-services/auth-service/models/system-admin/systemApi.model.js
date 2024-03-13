const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SystemApiSchema = new Schema({
    path: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true,
        enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    },
    description: {
        type: String
    },
    category: {
        type: String
    }
},{
    timestamps: true,
});

module.exports = (db) => {
    if(!db.models || !db.models.SystemApi)
        return db.model('SystemApi', SystemApiSchema);
    return db.models.SystemApi;
}
