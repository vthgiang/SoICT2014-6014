const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerGroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    customerTotal: {
        type: Number,
        default: 0
    },
    promotion: {
        type: String
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

CustomerGroupSchema.plugin(mongoosePaginate);

module.exports = CustomerGroup = mongoose.model("customer_groups", CustomerGroupSchema);