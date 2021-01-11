const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const PaymentSchema = new Schema({
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
    curator: { //Người phụ trách
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    bankAccountIn: {// Tài khoản nhận tiền
        type: Schema.Types.ObjectId,
        ref: 'BankAccount'
    },
    bankAccountOut: {// Tài khoản chi tiền 
        type: Schema.Types.ObjectId,
        ref: 'BankAccount'
    },
    salesOrders: [{ //Thanh toán theo từng đơn
        salesOrder: {//Thanh toán cho đơn bán hàng nào
            type: Schema.Types.ObjectId,
            ref: "SalesOrder"
        },
        money: {//Số tiền thu, chi cho từng đơn
            type: Number,
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