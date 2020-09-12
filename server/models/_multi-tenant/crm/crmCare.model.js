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
        ref: 'CrmCustomer'
    },
    caregiver: { //nhân viên chăm sóc khách hàng
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: { //trạng thái công việc
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
    toJSON: { virtuals: true }
});

CrmCareSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.CrmCare)
        return db.model('CrmCare', CrmCareSchema);
    return db.models.CrmCare;
}