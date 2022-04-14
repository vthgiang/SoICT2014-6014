const BankAccount = {
    type: "object",
    properties: {
        account: {//Số tài khoản
            type: 'string',
            required: true
        },
        owner: {//Chủ tài khoản
            type: 'string',
            required: true
        },
        bankName: {//Ngân hàng
            type: 'string',
            required: true
        },
        bankAcronym: {//Tên viết tắt ngân hàng
            type: 'string',
        },
        status: {//Trạng thái sử dụng
            type: 'boolean',
            required: true,
            default: false
        },
        creator: {//Người tạo
            type: 'string',
        },
    }
}

const BusinessDepartment = {
    type: "object",
    properties: {
        organizationalUnit: {// Cơ cấu tổ chức
            type: 'string',
        },
        role: {//Vai trò: 1. Bán hàng, 2: Quản lý bán hàng, 3. Kế toán
            type: 'number',
            enum: [1, 2, 3]
        }
    }
}

const CoinRule = {
    type: 'object',
    properties : {
        coinToDiscountMoney: { //1 xu đổi ra được bao nhiêu vnđ (mặc định bằng 1)
            type: 'number',
            required: true
        },
        minCoin: {
            type: 'number',
            required: true
        }
    }
}

const Discount = {
    type: "object",
    properties: {
        code: {
            type: 'string',
            required: true
        },
        name: {
            type: 'string',
            required: true
        },
        description: {
            type: 'string'
        },
        effectiveDate: {
            type: 'string',
            format: 'date'
        },
        expirationDate: {
            type: 'string',
            format: 'date'
        },
        type: {//0. giảm giá toàn đơn hàng, 1. giảm giá từng sản phẩm
            type: 'number',
            enum: [ 0, 1 ],
            required: true
        },
        creator: {
            type: 'string'
        },
        formality: {// Hình thức giảm giá
            type: 'number',
            enum: [0, 1, 2, 3, 4, 5], //0. discounted cash, 1. discounted percentage, 2. loyalty coin,
            // 3. maximum free shipping cost, 4. bonus goods, 5. clear inventory
            required: true
        },
        discounts: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    discountedCash: {
                        type: 'number'
                    },
                    discountedPercentage: {
                        type: 'number'
                    },
                    loyaltyCoin: {
                        type: 'number'
                    },
                    maximumFreeShippingCost: {
                        type: 'number'
                    },
                    maximumDiscountedCash: {
                        type: 'number'
                    },
                    minimumThresholdToBeApplied: {
                        type: 'number'
                    },
                    maximumThresholdToBeApplied: {
                        type: 'number'
                    },
                    customerType: { //0. Khách thường, 1. Khách VIP, 2. Cả 2
                        type: 'number',
                        enum: [ 0, 1, 2]
                    },
                    bonusGoods: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                good: {
                                    type: 'string'
                                },
                                expirationDateOfGoodBonus: {
                                    type: 'string',
                                    format: 'date'
                                },
                                baseUnit: {
                                    type: 'string'
                                },
                                quantityOfBonusGood: {
                                    type: 'number'
                                }
                            }
                        }
                    },
                    discountOnGoods: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                good: {
                                    type: 'string'
                                },
                                expirationDate: {
                                    type: 'string',
                                    format: 'date'
                                },
                                discountedPrice: {
                                    type: 'number'
                                }
                            }
                        }
                    }
                }
            }
        },
        status: {
            type: 'boolean',
            required: true
        },
        version: {
            type: 'number',
            required: true
        },
        lastVersion: {
            type: 'boolean',
            required: true
        },
    }
}

const Payment = {
    type: "object",
    properties: {}
}
module.exports = {
    BankAccount,
    BusinessDepartment,
    CoinRule,
    Discount,
    Payment
}