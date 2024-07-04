const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImpactSchema = new Schema({
    type: {
        type: Schema.Types.Number
    },
    health: {
        type: Schema.Types.Number
    },
    security: {
        type: Schema.Types.Number
    },
    enviroment: {
        type: Schema.Types.Number
    },
    description:{
        type: Schema.Types.String
    }
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.Impact) {
        return db.model('Impact', ImpactSchema);
    }

    return db.models.Impact;
}