const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const PaymentSchema = new Schema({
    code: {
        type: String
    },
    type: { //1. Thu tiền bán hàng, 2: Chi tiền mua nguyên vật liệu
        type: Number,
        enum: [1, 2],
    },
    paymentType: {// 1: Tiền mặt, 2: Chuyển khoản
        type: Number,
        enum: [1, 2],
        // required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    supplier: {//Tạm thời chưa có quản lý nhà cung cấp nên ref đến Customer
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    curator: { //Người phụ trách
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    bankAccountReceived: {// Tài khoản của công ty
        type: Schema.Types.ObjectId,
        ref: 'BankAccount'
    },
    bankAccountPartner: {// Tài khoản của đối tác (nhà cung cấp) 
        type: String,
    },
    salesOrders: [{ //Thanh toán theo từng đơn
        salesOrder: {//Thanh toán cho đơn bán hàng nào
            type: Schema.Types.ObjectId,
            ref: "SalesOrder"
        },
        money: {//Số tiền thu, chi cho từng đơn
            type: String,
            // required: true
        },
    }],
    purchaseOrders: [{
        purchaseOrder: {//Than toán cho những đơn mua hàng nào
            type: Schema.Types.ObjectId,
            ref: "PurchaseOrder"
        },
        money: {//Số tiền thu, chi cho từng đơn
            type: Number,
            // required: true
        },
    }],
    paymentAt: {
        type: Date
    },
}, {
    timestamps: true,
})


PaymentSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Payment)
        return db.model('Payment', PaymentSchema)
    return db.models.Payment
}