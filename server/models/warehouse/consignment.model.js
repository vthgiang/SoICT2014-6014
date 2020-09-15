const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
        }
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
        },

        binLocations: [{
            type: Schema.Types.ObjectId,
            ref: "binLocations"
        }]
    }]
});
module.exports = Consignment = mongoose.model("consignments", ConsignmentSchema);