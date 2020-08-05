const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerCareSchema = new Schema({
    name: { //tên công việc chăm sóc khách hàng
        type: String,
        required: true
    },
    customer: { // khách hàng được chăm sóc
        type: Schema.Types.ObjectId,
        ref: 'customers'
    },
    caregiver: { //nhân viên chăm sóc khách hàng
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    status: { //trạng thái công việc
        type: Boolean,
        default: false
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

CustomerCareSchema.plugin(mongoosePaginate);

module.exports = CustomerCare = mongoose.model("customer_cares", CustomerCareSchema);