const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const DelegationPolicySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    delegatorRequirements: {
        attributes: [
            {
                attributeId: {
                    type: Schema.Types.ObjectId,
                    ref: "Attribute"
                },
                value: String,
            }
        ],
        rule: {
            type: String
        }
    },
    delegateeRequirements: {
        attributes: [
            {
                attributeId: {
                    type: Schema.Types.ObjectId,
                    ref: "Attribute"
                },
                value: String,
            }
        ],
        rule: {
            type: String
        }
    },
    delegateObjectRequirements: {
        attributes: [
            {
                attributeId: {
                    type: Schema.Types.ObjectId,
                    ref: "Attribute"
                },
                value: String,
            }
        ],
        rule: {
            type: String
        }
    },
    environmentRequirements: {
        attributes: [
            {
                attributeId: {
                    type: Schema.Types.ObjectId,
                    ref: "Attribute"
                },
                value: String,
            }
        ],
        rule: {
            type: String
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

DelegationPolicySchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.DelegationPolicy)
        return db.model('DelegationPolicy', DelegationPolicySchema);
    return db.models.DelegationPolicy;
}