const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const SalesOrderSchema = new Schema({
    code: {
        type: String,
        // required: true
    },
    status: { //1: Chờ xác nhận (bộ phận Sales Admin và bộ phận kế toán xác nhận)
        //2: Yêu cầu sản xuất, 
        //3: Yêu cầu xuất kho, 
        //4: Đang giao hàng , 5: Đã giao hàng, 6: Đã hủy
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7],
        // required: true,
        default: 1
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    //Khách hàng
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        // required: true
    },
    customerPhone: {
        type: String,
        // required: true
    },
    customerAddress: {
        type: String,
        // required: true
    },
    customerRepresent: { //người đại diện
        type: String
    },
    customerEmail: {
        type: String
    },
    approvers: [{
        approver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            // required: true
        },
        approverRole: {
            type: Number,
            enum: [1, 2] //1. Sales Admin, 2. Kế toán
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
    priority: { // 1: Thấp, 2: Trung bình, 3: Cao, 4: Đặc biệt
        type: Number,
        enum: [1, 2, 3, 4],
        // required: true
    },
    goods: [{
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good',
            // required: true
        },
        pricePerBaseUnit: {
            type: Number,
            // required: true
        },
        pricePerBaseUnitOrigin: {
            type: Number,
        },
        salesPriceVariance: {
            type: Number
        },
        quantity: {
            type: Number,
            // required: true
        },
        manufacturingWorks: {
            type: Schema.Types.ObjectId,
            ref: 'ManufacturingWorks'
        },
        manufacturingPlan: {//Lấy trạng thái từ kế hoạch SX
            type: Schema.Types.ObjectId,
            ref: 'ManufacturingPlan'
        },
        //service level agreement
        serviceLevelAgreements: [{
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'ServiceLevelAgreement'
            },
            title: {
                type: String
            },
            descriptions: [{
                type: String
            }]
        }],
        taxs: [{
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'Tax'
            },
            code: {
                type: String
            },
            name: {
                type: String
            },
            description: {
                type: String
            },
            percent: {
                type: Number
            }
        }],
        discounts: [
            {
                _id: {
                    type: Schema.Types.ObjectId,
                    ref: 'Discount'
                },
                code: {
                    type: String
                },
                type: {
                    type: String
                },
                formality: {
                    type: String
                },
                name: {
                    type: String
                },
                effectiveDate: {
                    type: Date
                },
                expirationDate: {
                    type: Date
                },
                discountedCash: {
                    type: Number
                },
                discountedPercentage: {
                    type: Number
                },
                loyaltyCoin: {
                    type: Number
                },
                bonusGoods: [{
                    good: {
                        type: Schema.Types.ObjectId,
                        ref: 'Good'
                    },
                    expirationDateOfGoodBonus: {
                        type: Date
                    },
                    quantityOfBonusGood: {
                        type: Number
                    }
                }],
                discountOnGoods: {
                    good: {
                        type: Schema.Types.ObjectId,
                        ref: 'Good'
                    },
                    expirationDate: {
                        type: Date
                    },
                    discountedPrice: {
                        type: Number
                    }
                }
            },
        ],
        note: {
            type: String,
        },
        amount: { //Tổng tiền hàng nguyên bản
            type: Number
        },
        amountAfterDiscount: {// Tổng tiền hàng sau khi áp dụng khuyến mãi
            type: Number
        },
        amountAfterTax: {// Tổng tiền hàng sau khi áp dụng thuế
            type: Number
        }
    }],
    discounts: [
        {
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'Discount'
            },
            code: {
                type: String
            },
            type: {
                type: String
            },
            formality: {
                type: String
            },
            name: {
                type: String
            },
            effectiveDate: {
                type: Date
            },
            expirationDate: {
                type: Date
            },
            discountedCash: {
                type: Number
            },
            discountedPercentage: {
                type: Number
            },
            loyaltyCoin: {
                type: Number
            },
            maximumFreeShippingCost: {
                type: Number
            },
            bonusGoods: [{
                good: {
                    type: Schema.Types.ObjectId,
                    ref: 'Good'
                },
                expirationDateOfGoodBonus: {
                    type: Date
                },
                quantityOfBonusGood: {
                    type: Number
                }
            }],
        },
    ],
    //Phí giao hàng
    shippingFee: {
        type: Number
    },
    //Thời gian giao hàng dự kiến
    deliveryTime: {
        type: Date
    },
    //Giao hàng lúc
    deliveryAt: {
        type: Date
    },
    //Số coin trừ vào đơn hàng, lúc thanh toán sẽ check, nếu đủ thì trừ, không thì thôi
    coin: {
        type: Number
    },
    //Tổng thuế cho toàn đơn
    totalTax: {
        type: Number,
    },
    paymentAmount: { //Tổng tiền thanh toán cho toàn đơn
        type: Number,
    },
    note: {
        type: String
    },
    bill: {//Phiếu đề nghị xuất kho
        type: Schema.Types.ObjectId,
        ref: 'Bill',
    },
    invoice: {// Xuất hóa đơn
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {// Xem đã xuất hóa đơn hay chưa
            type: Boolean,
            default: false,
            require: true
        }
    },
    quote: { //Được lập từ báo giá nếu có
        type: Schema.Types.ObjectId,
        ref: 'Quote',
    }
}, {
    timestamps: true,
})

SalesOrderSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.SalesOrder)
        return db.model('SalesOrder', SalesOrderSchema)
    return db.models.SalesOrder
}