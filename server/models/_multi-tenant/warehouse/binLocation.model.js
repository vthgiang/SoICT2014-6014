const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const BinLocationSchema = new Schema ({

    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
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
        ref: 'Stock'
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
        type: Schema.Types.ObjectId,
        ref: 'Good'
    }],

    enableGoods: [{
        type: Schema.Types.ObjectId,
        ref: 'Good'
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