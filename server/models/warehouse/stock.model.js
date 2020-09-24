const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const StockSchema = new Schema ({

    company: {
        type: Schema.Types.ObjectId,
        ref: "companies"
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
        ref: "users"
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

module.exports = Stock = mongoose.model("stocks", StockSchema);