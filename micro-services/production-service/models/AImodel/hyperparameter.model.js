const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HyperParameterSchema = new Schema({
    code: {
        type: String
      },
    modelName: { 
        type: String,
        required: true
    },
    learning_rate: { 
        type: Number
    },
    n_estimators: {
        type: Number
    },
    max_depth: {
        type: Number
    },
    min_child_weight: {
        type: Number
    },
    reg_alpha: {
        type: Number
    },
    reg_lambda: {
        type: Number
    },
    accuracy: {
        type: Number
    }
},
    {
    timestamps: true,
    }
);

module.exports = (db) => {
    if (!db.models.HyperParameter)
        return db.model('HyperParameter', HyperParameterSchema);
    return db.models.HyperParameter;
} 