const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const PolicySchema = new Schema({
    policyName: {
        type: String,
        required: true
    },
    category: {
        // Loại chính sách: Phân quyền or ủy quyền
        type: String,
        enum: ['Authorization', 'Delegation'],
    },
    delegateType: {
        type: String,
        enum: ['Role', 'Task'],
    },
    description: { // Mô tả Ví dụ
        type: String
    },
    // For authorization policy
    subject: {
        user: {
            userAttributes: [
                {
                    attributeId: {
                        type: Schema.Types.ObjectId,
                        ref: 'Attribute'
                    },
                    // name: String, // tên thuộc tính
                    value: String, //giá trị
                }
            ],
            userRule: {
                type: String
            }
        },
        role: {
            roleAttributes: [
                {
                    attributeId: {
                        type: Schema.Types.ObjectId,
                        ref: 'Attribute'
                    },
                    // name: String, // tên thuộc tính
                    value: String, //giá trị
                }
            ],
            roleRule: {
                type: String
            }
        }
    },
    // dùng chung cho cả authorization policy và delegation policy
    // trong trường hợp chính sánh ủy quyền vai trò một phần resource(link) trong vai trò
    resource: {
        resourceAttributes: [
            {
                attributeId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Attribute'
                },
                // name: String, // tên thuộc tính
                value: String, //giá trị
            }
        ],
        resourceRule: {
            type: String
        }
    },
    // For delegation policies
    delegator: {
        delegatorAttributes: [
            {
                attributeId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Attribute'
                },
                // name: String, // tên thuộc tính
                value: String, //giá trị
            }
        ],
        delegatorRule: {
            type: String
        }
    },
    delegatee: {
        delegateeAttributes: [
            {
                attributeId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Attribute'
                },
                // name: String, // tên thuộc tính
                value: String, //giá trị
            }
        ],
        delegateeRule: {
            type: String
        }
    },
    // attribute của role (role delegation) hoặc task (task delegation)
    delegatedObject: {
        delegatedObjectAttributes: [
            {
                attributeId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Attribute'
                },
                // name: String, // tên thuộc tính
                value: String, //giá trị
            }
        ],
        delegatedObjectRule: {
            type: String
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

PolicySchema.plugin(mongoosePaginate);

module.exports = model('PolicySchema', PolicySchema);
