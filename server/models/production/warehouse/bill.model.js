const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const BillSchema = new Schema({
    // LSX
    fromStock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },
    // LSX 1. Nhập kho 2. Xuất kho  3. trả hàng 4. Kiểm kê 5. Luân chuyển
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
    // 1: Nhập nguyên vật liệu, 2: Nhập thành phẩm, 3: Nhập công cụ, dụng cụ, 4: Nhập phế phẩm 
    // 5: Xuất nguyên vật liệu, 6: Xuất sản phẩm, 7: Xuất công cụ, dụng cụ, 8: Xuất phế phẩm
    // 9: Kiểm kê định kỳ, 10: Kiểm kê thường xuyên, 
    // 11: "Trả hàng hóa tự sản xuất không đạt",
    // 12: "Trả hàng hóa nhập từ nhà cung cấp không đạt",
    // 13: "Trả hàng hóa đã xuất kho", 
    // 14: Luân chuyển
    type: {
        type: String,
        enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"]
    },

    // LSX 1
    // Phiếu nhập kho
    //1: Chờ phê duyệt, 2: Chờ thực hiện, 3: Chờ kiểm định chất lượng, 4: Chờ đánh lô hàng hóa, 5: Chờ xếp hàng vào kho, 6: Đã xếp hàng vào kho, 7: Đã hủy phiếu
    // Phiếu xuất kho
    //1: Chờ phê duyệt, 2: Chờ thực hiện, 3: Đang thực hiện, 5: Đã hoàn thành, 7: Đã hủy phiếu
    status: {
        type: String,
        enum: ["1", "2", "3", "4", "5", "6", "7"]
    },

    statusArray: [{
        type: Number,
    }],

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // LSX
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    manufacturingWork: { // Nhà máy sản xuất
        type: Schema.Types.ObjectId,
        ref: "ManufacturingWorks"
    },

    stockWorkAssignment: [{
        nameField: {
            type: String,
        },
        workAssignmentStaffs: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }],
        startDate: {
            type: Date,
        },
        startTime: {
            type: String,
        },
        endDate: {
            type: Date,
        },
        endTime: {
            type: String,
        },
    }],

    request: {
        type: Schema.Types.ObjectId,
        ref: "ProductRequestManagement"
    },

    // LSX
    approvers: [{
        approver: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        approvedTime: {
            type: Date
        }
    }],

    // LSX
    qualityControlStaffs: [{ // Danh sách người kiểm định chất lượng 
        staff: { // Người kiểm định
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        status: { // Trạng thái kiểm định 1. Chưa kiểm định xong, 2. Đã kiểm định xong
            type: Number
        },

        content: { // Nội dung kiểm định
            type: String
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

    sourceType: {
        type: String
        // required: true
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

            realQuantity: {
                type: Number
            },

            note: {
                type: String
            },
            code: {
                type: String
            },
            expirationDate: {
                type: Date,
            },
            rfid: {
                rfidCode: [{
                    type: String,
                }],
                quantity: {
                    type: Number,
                    default: 0
                }
            },
            binLocations: [{
                binLocation: {
                    type: Schema.Types.ObjectId,
                    ref: 'BinLocation'
                },

                quantity: {
                    type: Number
                },
                name: {
                    type: String
                }
            }]
        }],
        unpassed_quality_control_lots: [{
            lot: {
                type: Schema.Types.ObjectId,
                ref: 'Lot'
            },
            quantity: {
                type: Number,
                default: 0
            },

            realQuantity: {
                type: Number
            },

            note: {
                type: String
            },
            code: {
                type: String
            },
            expirationDate: {
                type: Date,
            },
            rfid: {
                rfidCode: [{
                    type: String,
                }],
                quantity: {
                    type: Number,
                    default: 0
                }
            },
            binLocations: [{
                binLocation: {
                    type: Schema.Types.ObjectId,
                    ref: 'BinLocation'
                },

                quantity: {
                    type: Number
                },
                name: {
                    type: String
                }
            }]
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
