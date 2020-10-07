const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CareSchema = new Schema({
    name: { //tên công việc chăm sóc khách hàng
        type: String,
        required: true
    },
    customer: { // khách hàng được chăm sóc
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    caregiver: [{ //nhân viên chăm sóc khách hàng
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    careType: [{
        type: Schema.Types.ObjectId,
        ref: 'CareType',
        required: true,
    }],
    status: { //trạng thái công việc 0: chưa thực hiện, 1: đang thực hiện, 2: Hoàn thành, 3: Không hoàn thành
        type: Number,
        default: 0,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    notes: { // Ghi chu
        type: String,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    }
}, {
    timestamps: true,
});

CareSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Care)
        return db.model('Care', CareSchema);
    return db.models.Care;
}