const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const BillSchema = new Schema({
    // LSX
    fromStock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },
    // LSX 1. Nhập kho 2. Xuất kho 
    group: {
        type: String,
        enum: ["1", "2", "3", "4", "5"]
    },

    toStock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },

    bill: {
        type: Schema.Types.ObjectId,
        replies: this
    },

    // LSX 
    code: {
        type: String,
        required: true
    },

    // LSX 2, 4
    type: { //1: Nhập nguyên vật liệu, 2: Nhập thành phẩm, 3:Xuất sản phẩm, 4: Xuất nguyên vật liệu, 5: Kiểm kê định kỳ, 6: Kiểm kê thường xuyên, 7: Trả hàng, 8: Luân chuyển
        type: String,
        enum: ["1", "2", "3", "4", "5", "6", "7", "8"]
    },

    // LSX 1
    status: { //1: Chờ phê duyệt, 2: Đã hoàn thành, 3: Đã phê duyệt, 4: Đã hủy, 5: Đang thực hiện
        type: String,
        enum: ["1", "2", "3", "4", "5"]
    },

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // LSX
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    // LSX
    approvers: [{
        approver: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: "Role"
        },
        approvedTime: {
            type: Date
        }
    }],

    qualityControlStaffs: [{ // Danh sách người kiểm định chất lượng 
        staff: { // Người kiểm định
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        time: { // Thời gian kiểm định
            type: Date
        }
    }],

    // LSX
    responsibles: [{ // Danh sách người thực hiện
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    // LSX
    accountables: [{ // Người giám sát
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },

    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },

    // LSX
    receiver: {
        name: {
            type: String
        },

        phone: {
            type: Number
        },

        email: {
            type: String
        },

        address: {
            type: String
        }
    },

    // LSX
    description: {
        type: String
    },

    // LSX
    goods: [{
        //LSX
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },
        //LSX
        quantity: {
            type: Number,
            default: 0
        },

        returnQuantity: {
            type: Number,
            default: 0
        },

        damagedQuantity: {
            type: Number,
            default: 0
        },

        realQuantity: {
            type: Number
        },

        lots: [{
            // LSX
            lot: {
                type: Schema.Types.ObjectId,
                ref: 'Lot'
            },
            // LSX
            quantity: {
                type: Number,
                default: 0
            },

            returnQuantity: {
                type: Number,
                default: 0
            },

            damagedQuantity: {
                type: Number,
                default: 0
            },

            realQuantity: {
                type: Number
            },

            note: {
                type: String
            }
        }],

        description: {
            type: String
        }
    }],

    // LSX
    manufacturingMill: {
        type: Schema.Types.ObjectId,
        ref: "ManufacturingMill"
    },
    // LSX
    manufacturingCommand: {
        type: Schema.Types.ObjectId,
        ref: "ManufacturingCommand"
    },

    // Tạo log khi create
    logs: [{
        createAt: {
            type: Date
        },

        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        title: {
            type: String
        },

        versions: {
            type: String
        }
    }]
}, {
    timestamps: true
});

BillSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Bill)
        return db.model('Bill', BillSchema);
    return db.models.Bill;
}