const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const StockSchema = new Schema ({

    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },

    code: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    address: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: [""]
    },

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    goods: [{

        good: {
            type: Schema.Types.ObjectId,
            ref: "goods"
        },

        maxQuantity: {
            type: Number
        },

        minQuantity: {
            type: Number
        }
    }]

});

StockSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.Stock){
        return db.model('Stock', StockSchema);
    }
    return db.models.Stock;
}