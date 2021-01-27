const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const QuoteSchema = Schema({
    code: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [ 1, 2, 3, 4], //1. Gửi yêu cầu, 2: Đã duyệt, 3: Đã chốt đơn, 4: Đã hủy
        required: true,
        default: 1
    }, 
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    effectiveDate: {
        type: Date,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    //Khách hàng
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    customerAddress: {
        type: String,
        required: true
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
        approveAt: {
            type: Date,
        },
        status: {//1. Chưa phê duyệt, 2. Đã phê duyệt, 3. Đã hủy
            type: Number,
            enum: [1, 2, 3],
            default: 1
        },
        note: {
            type: String
        }
    }],
    organizationalUnit: {//Đơn vị quản lý đơn
        type: Schema.Types.ObjectId,
        ref: "OrganizationalUnit"
    },
    goods: [{
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good',
            required: true
        },
        pricePerBaseUnit: {
            type: Number,
            required: true
        },
        pricePerBaseUnitOrigin: {
            type: Number,
        },
        salesPriceVariance: {
            type: Number
        },
        quantity: {
            type: Number,
            required: true
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
     //Số coin trừ vào đơn hàng, lúc thanh toán sẽ check, nếu đủ thì trừ, không thì thôi
    coin: {
        type: Number
    },
    allCoin: {
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
    salesOrder: { //Đơn bán hàng được lập từ báo giá
        type: Schema.Types.ObjectId,
        ref: 'SalesOrder',
    }
}, {
    timestamps: true,
})

QuoteSchema.plugin(mongoosePaginate);

module.exports = (db) =>{
    if(!db.models.Quote)
        return db.model('Quote', QuoteSchema)
    return db.models.Quote
}