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
        ref: 'CrmCustomer'
    },
    creator: { // Người tạo
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: { // Mô tả
        type: String
    },
    total: {
        type: Number
    },
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

CrmLiabilitySchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.CrmLiability)
        return db.model('CrmLiability', CrmLiabilitySchema);
    return db.models.CrmLiability;
}
