const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerGroupSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    code: { // Mã nhóm khách hàng
        type: String,
        required: true
    },
    name: { // Tên nhóm khashc hàng (Bán lẻ, Bán buôn)
        type: String,
        required: true
    },
    description: { // Mô tả nhóm khashc hàng
        type: String
    },
    customerTotal: {
        type: Number,
        default: 0
    },
    promotions: [{ // Ưu đãi theo nhóm khách hàng
        code: { // Mã ưu đãi, cái này mới thêm khi làm chức năng thêm mã khuyến mãi cho nhóm KH, vì liên quan đến nhiều phần khác chưa sửa nên tạm thời để require = false
            type: String,
            require: false 
        },
        value: { type: Number },
        description: { type: String },
        minimumOrderValue: { type: Number },
        promotionalValueMax: { type: Number },
        expirationDate:{type:Date},
        exceptCustomer: [{
            type: Schema.Types.ObjectId,
            ref: "Customer"
        }]
    }],
    createdAt: { // ngày tạo nhóm
        type: Date,
    },
  
    updatedAt: { // ngày cập nhật
        type: Date,
    },
    updatedBy: {// người cập nhật
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    customerCareUnit: {// đơn vị CSKH
        type: Schema.Types.ObjectId,
        ref: "CustomerCareUnit",
    },

}, {
    timestamps: true,
});

CustomerGroupSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.CustomerGroup)
        return db.model('CustomerGroup', CustomerGroupSchema);
    return db.models.CustomerGroup;
}
