const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const BinLocationSchema = new Schema ({

    parent: {
        type: Schema.Types.ObjectId,
        replies: this
    },

    child: {
        type: Schema.Types.ObjectId,
        replies: this
    },

    path: {
        type: String
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
        ref: 'Stock'
    },

    status: {
        type: String,
        enum: ["1", "2", "3", "4"]
    },

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    goods: [{
        type: Schema.Types.ObjectId,
        ref: 'Good'
    }],

    enableGoods: [{
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },

        contained: {
            type: Number
        },

        capacity: {
            type: Number
        }
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

module.exports = (db) =>{
    if(!db.models.BinLocation)
        return db.model('BinLocation', BinLocationSchema);
    return db.models.BinLocation;
}