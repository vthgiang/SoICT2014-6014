const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseOrderShema = new Schema({
    status: {
        type: String,
        enum: ["Chờ phê duyệt", "Đã hủy yêu cầu", "Đang mua hàng", "Hoàn thành", "Đã nhập hàng"],
        require: true
    },
    stock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },
    desciption: {
        type: String
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reponsible: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    goods: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Good',
            required: true
        },
        returnRule: {
            type: String
        },
        serviceLevelAgreement: {
            type: String
        },
        name: {
            type: String,
            required: true
        },
        baseUnit: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    returnRule: {
        type: String
    },
    serviceLevelAgreement: {
        type: String
    },
    approvers: [{
        _id: {
            type: Schema.Types.ObjectId,
            required: true
        }, 
        timeApprove: {
            type: Date
        }
    }],
    partner: [{
        type: Schema.Types.ObjectId,
        required: true
    }],
    payments: [{
        accounting: {
            type: Schema.Types.ObjectId,
            required: true
        },
        money: {
            type: Number,
            required: true
        },
        paymentAt: {
            type: Date,
            required: true
        }
    }],
    createAt: {
        type: Date
    },
    updateAt: {
        type: Date
    }
})