const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const BillSchema = new Schema ({

    company: {
        type: Schema.Types.ObjectId,
        ref: "companies"
    },

    fromStock: {
        type: Schema.Types.ObjectId,
        ref: "stocks"
    },

    toStock: {
        type: Schema.Types.ObjectId,
        ref: "stocks"
    },

    code: {
        type: String,
        required: true
    },

    users: [{
        type: Schema.Types.ObjectId,
        ref: "users"
    }],

    partner: {
        type: Schema.Types.ObjectId,
        ref: "psrtners"
    },

    proposal: {
        type: Schema.Types.ObjectId,
        ref: "proposals"
    },

    timestamp: {
        type: Date,
        default: Date.now
    },

    description: {
        type: String
    },

    goodReceipts: [{

        good: {
            type: Schema.Types.ObjectId,
            ref: "goods"
        },

        consignment: {
            type: Schema.Types.ObjectId,
            ref: "consignments"
        },

        type: {
            type: String,
            enum: [""]
        },

        quantity: {
            type: Number
        }
    }],

    goodIssues: [{

        good: {
            type: Schema.Types.ObjectId,
            ref: "goods"
        },

        consignment: {
            type: Schema.Types.ObjectId,
            ref: "consignments"
        },

        type: {
            type: String,
            enum: [""]
        },

        quantity: {
            type: Number
        }
    }],

    goodReturns: [{

        good: {
            type: Schema.Types.ObjectId,
            ref: "goods"
        },

        consignment: {
            type: Schema.Types.ObjectId,
            ref: "consignments"
        },

        type: {
            type: String,
            enum: [""]
        },

        bill: {
            type: Schema.Types.ObjectId,
            replies: this
        },

        returnQuantity: {
            type: Number
        },

        note: {
            type: String,
            enum: [""]
        }
    }],

    StockTakes: [{

        good: {
            type: Schema.Types.ObjectId,
            ref: "goods"
        },

        consignment: {
            type: Schema.Types.ObjectId,
            ref: "consignments"
        },

        type: {
            type: String,
            enum: [""]
        },

        realQuantity: {
            type: Number
        },

        damagedQuantity: {
            type: Number,
            default: 0
        },

        note: {
            type: String
        }
    }]
});

BillSchema.plugin(mongoosePaginate);

module.exports = Bill = mongoose.model("bills", BillSchema);