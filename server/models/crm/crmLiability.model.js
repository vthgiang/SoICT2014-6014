const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CrmLiabilitySchema = new Schema({
    code: { // Mã phiếu
        type: String,
        required: true
    },
    customer: { // Khách hàng
        type: Schema.Types.ObjectId,
        ref: 'crm_customers'
    },
    creator: { // Người tạo
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    description: { // Mô tả
        type: String
    },
    total: {
        type: Number
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

CrmLiabilitySchema.plugin(mongoosePaginate);

module.exports = CrmLiability = mongoose.model("crm_liabilities", CrmLiabilitySchema);