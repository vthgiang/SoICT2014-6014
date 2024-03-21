const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const DiscountSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    effectiveDate: {
        type: Date
    },
    expirationDate: {
        type: Date
    },
    type: {//0. giảm giá toàn đơn hàng, 1. giảm giá từng sản phẩm
        type: Number,
        enum: [ 0, 1 ],
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    formality: {// Hình thức giảm giá
        type: Number,
        enum: [0, 1, 2, 3, 4, 5], //0. discounted cash, 1. discounted percentage, 2. loyalty coin,
        // 3. maximum free shipping cost, 4. bonus goods, 5. clear inventory
        required: true
    },
    discounts: [{
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
        maximumDiscountedCash: {
            type: Number
        },
        minimumThresholdToBeApplied: {
            type: Number
        },
        maximumThresholdToBeApplied: {
            type: Number
        },
        customerType: { //0. Khách thường, 1. Khách VIP, 2. Cả 2
            type: Number,
            enum: [ 0, 1, 2]
        },
        bonusGoods: [{
            good: {
                type: Schema.Types.ObjectId,
                ref: 'Good'
            },
            expirationDateOfGoodBonus: {
                type: Date
            },
            baseUnit: {
                type: String
            },
            quantityOfBonusGood: {
                type: Number
            }
        }],
        discountOnGoods: [{
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
        }]
    }],
    status: {
        type: Boolean,
        required: true
    },
    version: {
        type: Number,
        required: true
    },
    lastVersion: {
        type: Boolean,
        required: true
    },
}, {
    timestamps: true,
})

DiscountSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models || !db.models.Discount)
        return db.model('Discount', DiscountSchema)
    return db.models.Discount
}
