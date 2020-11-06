const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const BillSchema = new Schema ({

    fromStock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },

    group: {
        type: String,
        enum: ["1", "2", "3", "4", "5"]
    },

    toStock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },

    code: {
        type: String,
        required: true
    },

    type: { //1: Nhập nguyên vật liệu, 2: Nhập thành phẩm, 3:Xuất sản phẩm, 4: Xuất nguyên vật liệu, 5: Kiểm kê định kỳ, 6: Kiểm kê thường xuyên, 7: Trả hàng
        type: String,
        enum: ["1", "2", "3", "4", "5", "6", "7"]
    },

    status: { //1: Chờ phê duyệt, 2:Đã hủy, 3: Đã hoàn thành, 4: chờ kiểm tra
        type: String,
        enum: ["1", "2", "3", "4"]
    },

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    partner: {
        type: Schema.Types.ObjectId,
        ref: 'Partner'
    },

    proposal: {
        type: Schema.Types.ObjectId,
        ref: 'Proposal'
    },

    timestamp: {
        type: Date,
        default: Date.now
    },

    description: {
        type: String
    },

    goodReceipts: [{

        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },

        quantity: {
            type: Number
        },

        lots: [{

            lot: {
                type: Schema.Types.ObjectId,
                ref: 'Lot'
            },

            quantity: {
                type: Number
            }
        }],

        description: {
            type: String
        }
    }],

    goodIssues: [{

        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },

        quantity: {
            type: Number
        },

        lots: [{

            lot: {
                type: Schema.Types.ObjectId,
                ref: 'Lot'
            },

            quantity: {
                type: Number
            }
        }],

        description: {
            type: String
        }
    }],

    goodReturns: [{

        bill: {
            type: Schema.Types.ObjectId,
            replies: this
        },

        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },

        returnQuantity: {
            type: String
        },

        lots: [{

            lot: {
                type: Schema.Types.ObjectId,
                ref: 'Lot'
            },

            quantity: {
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

    stockTakes: [{

        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },

        quantity: {
            type: Number
        },

        lots: [{

            lot: {
                type: Schema.Types.ObjectId,
                ref: 'Lot'
            },

            realQuantity: {
                type: Number
            },

            damagedQuantity: {
                type: Number
            },

            note: {
                type: Number
            }
        }],

        description: {
            type: String
        }
    }]
});

BillSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.Bill)
        return db.model('Bill', BillSchema);
    return db.models.Bill;
}