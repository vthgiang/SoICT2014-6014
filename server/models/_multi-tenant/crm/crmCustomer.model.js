const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CrmCustomerSchema = new Schema({
    name: { // tên khách hàng
        type: String,
        required: true
    },
    code: { // mã khách hàng
        type: String,
        required: true
    },
    phone: { // số điện thoại
        type: String,
        required: true
    },
    address: { // địa chỉ liên lạc
        type: String
    },
    location: { // khu vực
        type: String
    },
    email: { // địa chỉ email
        type: String
    },
    group: { // nhóm khách hàng
        type: Schema.Types.ObjectId,
        ref: 'CrmGroup'
    },
    birth: { // ngày sinh
        type: Date
    },
    gender: { // giới tính
        type: String
    },
    avatar: { // avatar khách hàng
        type: String,
    },
    documents: [{ // các tài liệu liên quan đến khách hàng
        type: Schema.Types.ObjectId,
        ref: 'Document'
    }],
    liabilities: [{ // công nợ khách hàng
        type: Schema.Types.ObjectId,
        ref: 'CrmLiability'
    }],
    loyal: { // khách hàng thân thiết
        type: Boolean,
        default: false
    },
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

CrmCustomerSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.CrmCustomer)
        return db.model('CrmCustomer', CrmCustomerSchema);
    return db.models.CrmCustomer;
}
