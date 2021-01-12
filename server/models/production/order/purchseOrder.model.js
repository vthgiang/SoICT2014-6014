const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const PurchaseOrderShema = new Schema({
    code: {
        type: String,
        required: true
    },
    status: {//1. Chờ phê duyệt, 2. Đã phê duyệt, 3. Đã nhập kho
        type: Number,
        enum: [1, 2, 3],
        default: 1
    },
    creator: { // Người tạo
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    materials: [{ // Danh sách nguyên vật liệu
        good: { // Nguyên vật liệu
            type: Schema.Types.ObjectId,
            ref: "Good"
        },
        quantity: { // Số lượng
            type: Number
        },
        price: {
            type: Number
        }
    }],
    intendReceiveTime: { // Thời gian dự kiến nhận
        type: Date
    },
    stock: {//Nhập về kho
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },
    approvers: [{
        approver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }, 
        approveAt: {
            type: Date,
            default: new Date()
        },
        status: {
            type: Boolean,
            default: false
        }
    }],
    customer: {//Đối tác
        type: Schema.Types.ObjectId,
        ref: 'Customer',
    },
    discount: {
        type: Number
    },
    desciption: {
        type: String
    },
    purchasingRequest: {
        type: Schema.Types.ObjectId,
        ref: 'PurchasingRequest',
    }
}, {
    timestamps: true,
})

PurchaseOrderShema.plugin(mongoosePaginate);

module.exports = (db) =>{
    if (!db.models.PurchaseOrder) 
        return db.model('PurchaseOrder', PurchaseOrderShema)
    return db.models.PurchaseOrder
}