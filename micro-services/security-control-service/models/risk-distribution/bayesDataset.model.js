const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BayesDatasetSchema = mongoose.Schema({
    type: {
        type: Schema.Types.Number
    },
    taskDistribution:{
        type: Schema.Types.ObjectId,
        ref: 'TaskDistribution'
    },
    states:[{
        type:Schema.Types.Number
    }]
})
module.exports = (db) => {
    if (!db.models.BayesDatasetSchema) {
        return db.model('BayesDataset', BayesDatasetSchema);
    }

    return db.models.BayesDatasetSchema;
}