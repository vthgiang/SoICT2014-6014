const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BillSchema = new Schema ({

    company: {
        type: Schema.Types.ObjectId,
        ref: "companies"
    },

    stock: {
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

    moveStock: {
        type: Schema.Types.ObjectId,
        ref: "stocks"
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

    consignmentReceipts: [{

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

    consignmentIssues: [{

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

    consignmentReturns: [{

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

    consignmentStockTakes: [{

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
module.exports = Bill = mongoose.model("bills", BillSchema);