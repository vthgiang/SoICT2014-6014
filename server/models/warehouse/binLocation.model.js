const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const BinLocationSchema = new Schema ({

    company: {
        type: Schema.Types.ObjectId,
        ref: "companies"
    },

    parent: {
        type: Schema.Types.ObjectId,
        replies: this
    },

    child: {
        type: Schema.Types.ObjectId,
        replies: this
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

    stock: {
        type: Schema.Types.ObjectId,
        ref: "stocks"
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
        type: Schema.Types.ObjectId,
        ref: "goods"
    }],

    enableGoods: [{
        type: Schema.Types.ObjectId,
        ref: "goods"
    }],

    capacity: {
        type: Number
    },

    contained: {
        type: Number
    },

    unit: {
        type: String
    }
});

BinLocationSchema.plugin(mongoosePaginate);

module.exports = BinLocation = mongoose.model("binLocations", BinLocationSchema);