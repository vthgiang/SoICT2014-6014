const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const AuthorizationPolicySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    effect: {
        type: String,
        enum: ['Allow', 'Deny'],
        required: true
    },
    description: {
        type: String
    },
    
    effectiveStartTime: Date,

    effectiveEndTime: Date,

    requesterRequirements: {
        attributes: [
            {
                attributeId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Attribute'
                },
                value: String,
            }
        ],
        rule: {
            type: String
        }
    },
    resourceRequirements: {
        attributes: [
            {
                attributeId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Attribute'
                },
                value: String,
            }
        ],
        rule: {
            type: String
        }
    },
    roleRequirements: {
        attributes: [
            {
                attributeId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Attribute'
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
                    ref: 'Attribute'
                },
                value: String,
            }
        ],
        rule: {
            type: String
        }
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

AuthorizationPolicySchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.AuthorizationPolicy)
        return db.model('AuthorizationPolicy', AuthorizationPolicySchema);
    return db.models.AuthorizationPolicy;
}