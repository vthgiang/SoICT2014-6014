const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ConsignmentSchema = new Schema ({

    name: {
        type: String,
        required: true
    },

    good: {
        type: Schema.Types.ObjectId,
        ref: "goods"
    },

    stocks: [{
        stock: {
            type: Schema.Types.ObjectId,
            ref: "stocks"
        },

        quantity: {
            type: Number
        },

        binLocations: [{
            type: Schema.Types.ObjectId,
            ref: "binLocations"
        }]
    }],

    originalQuantity: {
        type: Number,
        default: 0
    },

    quantity: {
        type: Number,
        default: 0
    },

    expirationDate: {
        type: Date,
    },

    price: {
        type: Number,
        required: true
    },

    description: {
        type: String
    },

    consignmentLogs: [{

        bill: {
            type: Schema.Types.ObjectId,
            ref: "bills"
        },

        quantity: {
            type: Number
        },

        description: {
            type: String
        },

        type: {
            type: String
        },

        timestamp: {
            type: Date,
            default: Date.now
        }
    }],

    logs: [{

        createAt: {
            type: Date,
            default: Date.now
        },

        creator: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },

        title: {
            type: String
        },

        description: {
            type: String
        }
    }]
});

ConsignmentSchema.plugin(mongoosePaginate);

module.exports = Consignment = mongoose.model("consignments", ConsignmentSchema);