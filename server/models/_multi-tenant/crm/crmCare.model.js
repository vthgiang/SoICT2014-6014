const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CrmCareSchema = new Schema({
    name: { //tên công việc chăm sóc khách hàng
        type: String,
        required: true
    },
    customer: { // khách hàng được chăm sóc
        type: Schema.Types.ObjectId,
        ref: 'crm_customers'
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

CrmCareSchema.plugin(mongoosePaginate);

module.exports = CrmCare = (db) => db.model("crm_cares", CrmCareSchema);