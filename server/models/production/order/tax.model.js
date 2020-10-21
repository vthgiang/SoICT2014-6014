const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaxSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    goods: [{
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        }
    }],
    version: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true,
})

module.exports = (db) =>{
    if(!db.models.Tax)
        return db.model('Tax', TaxSchema)
    return db.models.Tax
}