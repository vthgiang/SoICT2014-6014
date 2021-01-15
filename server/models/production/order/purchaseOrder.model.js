const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const PurchaseOrderShema = new Schema({
    code: {
        type: String,
        required: true
    },
    status: {//1. Chờ phê duyệt, 2. Đã phê duyệt, 3. Đã nhập kho, 4. Đã hủy
        type: Number,
        enum: [1, 2, 3, 4],
        default: 1
    },
    creator: { // Người tạo
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    materials: [{ // Danh sách nguyên vật liệu
        material: { // Nguyên vật liệu
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
        },
        status: {
            type: Boolean,
            default: false
        }
    }],
    supplier: {//Đối tác, tạm thời chưa có quản lý đối tác kinh doanh nên lấy Customer
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
    },
    bill: {//Phiếu đề nghị nhập kho nguyên vật liệu
        type: Schema.Types.ObjectId,
        ref: 'Bill',
    },
    paymentAmount: {
        type: Number
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