const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const GoodSchema = new Schema ({

    conpany: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },

    code: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["product", "material", "equipment", "asset"],
        required: true
    },

    baseUnit: {
        type: String,
        required: true
    },

    units: [{

        name: {
            type: String
        },

        conversionRate: {
            type: Number
        },

        description: {
            type: String
        }
    }],

    quantity: {
        type: Number
    },

    description: {
        type: String
    },

    goods: [{
        
        good: {
            type: Schema.Types.ObjectId,
            replies: this
        },

        quantity: {
            type: Number
        }
    }]
});

GoodSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.Good)
        return db.model('Good', GoodSchema);
    return db.models.Good;
}