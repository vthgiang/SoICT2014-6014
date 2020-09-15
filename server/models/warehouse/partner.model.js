const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PartnerSchema = new Schema ({

    code: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ["organization", "persaonal"],
        require: true
    },

    group: {
        type: String,
        enum: ["supplier", "customer"],
        required: true
    },

    description: {
        type: String
    },

    organization: {

        name: {
            type: String
        },

        address: {
            type: String
        },

        phone: {
            type: Number
        },

        email: {
            type: String
        },

        tax: {
            type: String
        },

        fax: {
            type: Number
        }
    },

    personal: {

        name: {
            type: String,
            required: true
        },

        office: {
            type: String,
            required: true
        },

        address: {
            type: String,
            required: true
        },

        phone: {
            type: Number,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        tax: {
            type: String
        }
    }
});
module.exports = Partner = mongoose.model("partners", PartnerSchema);