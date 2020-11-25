const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const LotSchema = new Schema({
    code: {
        type: String
    },

    name: {
        type: String
    },

    good: {
        type: Schema.Types.ObjectId,
        ref: 'Good'
    },

    type: {
        type: String,
        enum: ["product", "material", "equipment", "asset"],
    },

    stocks: [{
        stock: {
            type: Schema.Types.ObjectId,
            ref: 'Stock'
        },

        quantity: {
            type: Number
        },

        binLocations: [{
            binLocation: {
                type: Schema.Types.ObjectId,
                ref: 'BinLocation'
            },

            quantity: {
                type: Number
            }
        }]
    }],

    originalQuantity: {
        type: Number,
        default: 0
    },

    quantity: {
        type: Number,
        default: 0
    },

    expirationDate: {
        type: Date,
    },

    description: {
        type: String
    },

    lotLogs: [{

        bill: {
            type: Schema.Types.ObjectId,
            ref: 'Bill'
        },

        quantity: {
            type: Number
        },

        description: {
            type: String
        },

        type: {
            type: String
        },

        createdAt: {
            type: Date,
            default: Date.now
        },

        stock: {
            type: Schema.Types.ObjectId,
            ref: 'Stock',
        },

        binLocations: [{
            binLocation: {
                type: Schema.Types.ObjectId,
                ref: 'BinLocation'
            },

            quantity: {
                type: Number
            }
        }]
    }],

    logs: [{

        createAt: {
            type: Date,
            default: Date.now
        },

        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        title: {
            type: String
        },

        description: {
            type: String
        }
    }],

    /* 
        Các thuộc tính thêm để làm phần lô sản xuất
    */
    manufacturingCommand: {
        type: Schema.Types.ObjectId,
        ref: 'ManufacturingCommand'
    },

    lotType: { // Loại lô 1. Lô sản xuất 2. Lô nhập kho
        type: Number
    },

    productType: {// Loại sản phẩm. 1. Phế phẩm 2. Thành phẩm
        type: Number
    },

    status: { // 1. Chưa được xử lý 2. Đã được xử lý 3. Đã nhập kho
        type: Number
    },

    creator: {// Người tạo ra lô sản xuất
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamps: true
});

LotSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Lot)
        return db.model('Lot', LotSchema);
    return db.models.Lot;
}