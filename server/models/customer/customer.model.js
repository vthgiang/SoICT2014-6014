const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerSchema = new Schema({
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
        type: String,
        required: true
    },
    location: { // khu vực
        type: Schema.Types.ObjectId,
        ref: 'customer_locations'
    },
    email: { // địa chỉ email
        type: String
    },
    group: { // nhóm khách hàng
        type: Schema.Types.ObjectId,
        ref: 'customer_groups'
    },
    birth: { // ngày sinh
        type: String
    },
    gender: { // giới tính
        type: String
    },
    avatar: { // avatar khách hàng
        type: String,
    },
    documents: [{ // các tài liệu liên quan đến khách hàng
        type: 'String',
    }],
    liabilities: [{ // công nợ khách hàng
        type: Schema.Types.ObjectId,
        ref: 'customer_liabilities'
    }],
    loyal: { // khách hàng thân thiết
        type: Boolean,
        default: false
    },
    company: { // khách hàng của công ty nào
        type: Schema.Types.ObjectId,
        ref: 'companies'
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

CustomerSchema.plugin(mongoosePaginate);

module.exports = Customer = mongoose.model("customers", CustomerSchema);