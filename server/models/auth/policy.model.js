const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const PolicySchema = new Schema({
    policyName: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    description: { // Mô tả Ví dụ
        type: String
    },
    rules: {
            subject: [
                {
                    userAttributes: [
                        {
                            attributeId: {
                                type: Schema.Types.ObjectId,
                                ref: "Attribute"
                            },
                            name: String, // tên thuộc tính
                            value: String, //giá trị
                        }
                    ],
                    roleAttributes: [
                        {
                            attributeId: {
                                type: Schema.Types.ObjectId,
                                ref: "Attribute"
                            },
                            name: String, // tên thuộc tính
                            value: String, //giá trị
                        }
                    ]
                }
            ],
            resource: [
                {
                    resourceAttributes: [
                        {
                            attributeId: {
                                type: Schema.Types.ObjectId,
                                ref: "Attribute"
                            },
                            name: String, // tên thuộc tính
                            value: String, //giá trị
                        }
                    ]
                }
            ]
        },
    
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

PolicySchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.Policy)
        return db.model('Policy', PolicySchema);
    return db.models.Policy;
}