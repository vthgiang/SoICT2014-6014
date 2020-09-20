const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ProposalSchema = new Schema ({

    company: {
        type: Schema.Types.ObjectId,
        ref: "companies"
    },

    code: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: [""]
    },

    stock: {
        type: Schema.Types.ObjectId,
        ref: "stocks"
    },

    description: {
        type: String
    },

    goods: [{
        good: {
            type: Schema.Types.ObjectId,
            ref: "goods"
        },

        quantity: {
            type: Number,
            default: 1,
            required: true
        },

        price: {
            type: Number,
            default: 1000
        }
    }],

    partner: {
        type: Schema.Types.ObjectId,
        ref: "partners"
    },

    moveStock: {
        type: Schema.Types.ObjectId,
        ref: "stocks"
    },

    users: [{
        type: Schema.Types.ObjectId,
        ref: "users"
    }],

    timestamp: {
        type: Date,
        default: Date.now
    },

    expectedDate: {
        type: Date
    }
});

ProposalSchema.plugin(mongoosePaginate);

module.exports = Proposal = mongoose.model("proposals", ProposalSchema)