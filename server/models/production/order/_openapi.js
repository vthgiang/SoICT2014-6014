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
    properties: {
        code: {
            type: 'string'
        },
        type: { //1. Thu tiền bán hàng, 2: Chi tiền mua nguyên vật liệu
            type: 'number',
            enum: [1, 2],
        },
        paymentType: {// 1: Tiền mặt, 2: Chuyển khoản
            type: 'number',
            enum: [1, 2],
            // required: true
        },
        customer: {
            type: 'string'
        },
        supplier: {//Tạm thời chưa có quản lý nhà cung cấp nên ref đến Customer
            type: 'string',
        },
        curator: { //Người phụ trách
            type: 'string'
            // required: true
        },
        bankAccountReceived: {// Tài khoản của công ty
            type: 'string'
        },
        bankAccountPartner: {// Tài khoản của đối tác (nhà cung cấp)
            type: 'string',
        },
        salesOrders: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    salesOrder: {//Thanh toán cho đơn bán hàng nào
                        type: 'string'
                    },
                    money: {//Số tiền thu, chi cho từng đơn
                        type: 'string',
                        // required: true
                    },
                }
            }
        },
        purchaseOrders: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    purchaseOrder: {//Than toán cho những đơn mua hàng nào
                        type: 'string'
                    },
                    money: {//Số tiền thu, chi cho từng đơn
                        type: 'number',
                        // required: true
                    },
                }
            }
        },
        paymentAt: {
            type: 'string',
            format: 'date'
        },
    }
}

const PurchaseOrder = {
    type: 'object',
    properties: {
        code: {
            type: 'string',
            required: true
        },
        status: {//1. Chờ phê duyệt, 2. Đã phê duyệt, 3.Yêu cầu nhập kho, 4. Đã nhập kho, 5. Đã hủy
            type: 'number',
            enum: [1, 2, 3, 4, 5],
            default: 1
        },
        creator: { // Người tạo
            type: 'string',
            required: true
        },
        materials: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    material: { // Nguyên vật liệu
                        type: 'string'
                    },
                    quantity: { // Số lượng
                        type: 'number'
                    },
                    price: {
                        type: 'number'
                    }
                }
            }
        },
        intendReceiveTime: { // Thời gian dự kiến nhận
            type: 'string',
            format: 'date'
        },
        stock: {//Nhập về kho
            type: 'string'
        },
        approvers: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    approver: {
                        type: 'string'
                    },
                    approveAt: {
                        type: 'string',
                        require: true
                    },
                    status: {//1. Chưa phê duyệt, 2. Đã phê duyệt, 3. Đã hủy
                        type: 'number',
                        enum: [1, 2, 3],
                        default: 1
                    },
                    note: {
                        type: 'string'
                    }
                }
            }
        },
        supplier: {//Đối tác, tạm thời chưa có quản lý đối tác kinh doanh nên lấy Customer
            type: 'string'
        },
        discount: {
            type: 'number'
        },
        desciption: {
            type: 'number'
        },
        purchasingRequest: {
            type: 'string'
        },
        bill: {//Phiếu đề nghị nhập kho nguyên vật liệu
            type: 'string'
        },
        paymentAmount: {
            type: 'number'
        }
    }
}

const Approvers = {
    type: 'object',
    properties: {
        approver: {
            type: 'string'
        },
        approveAt: {
            type: 'string',
            require: true
        },
        status: {//1. Chưa phê duyệt, 2. Đã phê duyệt, 3. Đã hủy
            type: 'number',
            enum: [1, 2, 3],
            default: 1
        },
        note: {
            type: 'string'
        }
    }
}

const Quote = {
    type: 'object',
    properties: {
        code: {
            type: 'string',
            required: true
        },
        status: {
            type: 'number',
            enum: [ 1, 2, 3, 4], //1. Gửi yêu cầu, 2: Đã duyệt, 3: Đã chốt đơn, 4: Đã hủy
            required: true,
            default: 1
        },
        creator: {
            type: 'string',
            required: true
        },
        effectiveDate: {
            type: 'string',
            format: 'date',
            required: true
        },
        expirationDate: {
            type: 'string',
            format: 'date',
            required: true
        },
        //Khách hàng
        customer: {
            type: 'string',
            required: true
        },
        customerPhone: {
            type: 'string',
            required: true
        },
        customerAddress: {
            type: 'string',
            required: true
        },
        customerRepresent: { //người đại diện
            type: 'string'
        },
        customerEmail: {
            type: 'string'
        },
        approvers: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    approver: {
                        type: 'string'
                        // required: true
                    },
                    approveAt: {
                        type: 'string',
                        format: 'date'
                    },
                    status: {//1. Chưa phê duyệt, 2. Đã phê duyệt, 3. Đã hủy
                        type: 'number',
                        enum: [1, 2, 3],
                        default: 1
                    },
                    note: {
                        type: 'string'
                    }
                }
            }
        },
        organizationalUnit: {//Đơn vị quản lý đơn
            type: 'string'
        },
        goods: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    good: {
                        type: 'string'
                    },
                    pricePerBaseUnit: {
                        type: 'number'
                    },
                    pricePerBaseUnitOrigin: {
                        type: 'number',
                    },
                    salesPriceVariance: {
                        type: 'number'
                    },
                    quantity: {
                        type: 'number',
                        required: true
                    },
                    //service level agreement
                    serviceLevelAgreements: {
                        type: 'array',
                        items: {
                            type: 'object',
                            _id: {
                                type: 'string'
                            },
                            title: {
                                type: 'string'
                            },
                            descriptions: {
                                type: 'array',
                                items: {
                                    type: 'string'
                                }
                            }
                        }
                    },
                    taxs: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                _id: {
                                    type: 'string'
                                },
                                code: {
                                    type: 'string'
                                },
                                name: {
                                    type: 'string'
                                },
                                description: {
                                    type: 'string'
                                },
                                percent: {
                                    type: 'string'
                                }
                            }
                        }
                    },
                    discounts: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                _id: {
                                    type: 'string'
                                },
                                code: {
                                    type: 'string'
                                },
                                type: {
                                    type: 'string'
                                },
                                formality: {
                                    type: 'string'
                                },
                                name: {
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
                                discountedCash: {
                                    type: 'number'
                                },
                                discountedPercentage: {
                                    type: 'number'
                                },
                                loyaltyCoin: {
                                    type: 'number'
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
                                            quantityOfBonusGood: {
                                                type: 'number'
                                            }
                                        }
                                    }
                                },
                                discountOnGoods: {
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
                    },
                    note: {
                        type: 'string',
                    },
                    amount: { //Tổng tiền hàng nguyên bản
                        type: 'number'
                    },
                    amountAfterDiscount: {// Tổng tiền hàng sau khi áp dụng khuyến mãi
                        type: 'number'
                    },
                    amountAfterTax: {// Tổng tiền hàng sau khi áp dụng thuế
                        type: 'number'
                    }
                }
            }
        },
        discounts: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string'
                    },
                    code: {
                        type: 'string'
                    },
                    type: {
                        type: 'string'
                    },
                    formality: {
                        type: 'string'
                    },
                    name: {
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
                                quantityOfBonusGood: {
                                    type: 'number'
                                }
                            }
                        }
                    },
                }
            }
        },
        //Phí giao hàng
        shippingFee: {
            type: 'number'
        },
        //Thời gian giao hàng dự kiến
        deliveryTime: {
            type: 'string',
            format: 'date'
        },
        //Số coin trừ vào đơn hàng, lúc thanh toán sẽ check, nếu đủ thì trừ, không thì thôi
        coin: {
            type: 'number'
        },
        allCoin: {
            type: 'number'
        },
        //Tổng thuế cho toàn đơn
        totalTax: {
            type: 'number',
        },
        paymentAmount: { //Tổng tiền thanh toán cho toàn đơn
            type: 'number',
        },
        note: {
            type: 'string'
        },
        salesOrder: { //Đơn bán hàng được lập từ báo giá
            type: 'string',
        }
    }
}

const SaleOrder = {
    type: 'object',
    properties: {
        code: {
            type: 'string',
            // required: true
        },
        status: { //1: Chờ phê duyệt (bộ phận Sales Admin và bộ phận kế toán xác nhận)
            //2: Đã phê duyệt
            //3: Yêu cầu sản xuất,
            //4: Đã lập kế hoạch sản xuất
            //5: Đã yêu cầu sản xuất
            //6: Đang giao hàng , 7: Đã giao hàng,
            //8: Đã hủy
            type: 'number',
            enum: [1, 2, 3, 4, 5, 6, 7, 8],
            // required: true,
            default: 1
        },
        creator: {
            type: 'string'
            // required: true
        },
        //Khách hàng
        customer: {
            type: 'string'
            // required: true
        },
        customerPhone: {
            type: 'string',
            // required: true
        },
        customerAddress: {
            type: 'string',
            // required: true
        },
        customerRepresent: { //người đại diện
            type: 'string'
        },
        customerEmail: {
            type: 'string'
        },
        approvers: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    approver: {
                        type: 'string',
                        // required: true
                    },
                    approveAt: {
                        type: 'string',
                        format: 'date'
                    },
                    status: {//1. Chưa phê duyệt, 2. Đã phê duyệt, 3. Đã hủy
                        type: 'number',
                        default: 1,
                        enum: [1, 2, 3],
                    },
                    note: {
                        type: 'string'
                    }
                }
            }
        },
        organizationalUnit: {//Đơn vị quản lý đơn
            type: 'string'
        },
        priority: { // 1: Thấp, 2: Trung bình, 3: Cao, 4: Đặc biệt
            type: 'number',
            enum: [1, 2, 3, 4],
            // required: true
        },
        goods: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    good: {
                        type: 'string',
                        // required: true
                    },
                    pricePerBaseUnit: {
                        type: 'number',
                        // required: true
                    },
                    pricePerBaseUnitOrigin: {
                        type: 'number',
                    },
                    salesPriceVariance: {
                        type: 'number'
                    },
                    quantity: {
                        type: 'number',
                        // required: true
                    },
                    manufacturingWorks: {
                        type: 'string'
                    },
                    manufacturingPlan: {//Lấy trạng thái từ kế hoạch SX
                        type: 'string'
                    },
                    //service level agreement
                    serviceLevelAgreements: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                _id: {
                                    type: 'string'
                                },
                                title: {
                                    type: 'string'
                                },
                                descriptions: {
                                    type: 'array',
                                    items: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    },
                    taxs: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                _id: {
                                    type: 'string'
                                },
                                code: {
                                    type: 'string'
                                },
                                name: {
                                    type: 'string'
                                },
                                description: {
                                    type: 'string'
                                },
                                percent: {
                                    type: 'number'
                                }
                            }
                        }
                    },
                    discounts: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                _id: {
                                    type: 'string'
                                },
                                code: {
                                    type: 'string'
                                },
                                type: {
                                    type: 'string'
                                },
                                formality: {
                                    type: 'string'
                                },
                                name: {
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
                                discountedCash: {
                                    type: 'number'
                                },
                                discountedPercentage: {
                                    type: 'number'
                                },
                                loyaltyCoin: {
                                    type: 'number'
                                },
                                bonusGoods: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            good: {
                                                type: 'sting'
                                            },
                                            expirationDateOfGoodBonus: {
                                                type: 'string',
                                                format: 'date'
                                            },
                                            quantityOfBonusGood: {
                                                type: 'number'
                                            }
                                        }
                                    }
                                },
                                discountOnGoods: {
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
                    },
                    note: {
                        type: 'string',
                    },
                    amount: { //Tổng tiền hàng nguyên bản
                        type: 'number'
                    },
                    amountAfterDiscount: {// Tổng tiền hàng sau khi áp dụng khuyến mãi
                        type: 'number'
                    },
                    amountAfterTax: {// Tổng tiền hàng sau khi áp dụng thuế
                        type: 'number'
                    }
                }
            }
        },
        discounts: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string'
                    },
                    code: {
                        type: 'string'
                    },
                    type: {
                        type: 'string'
                    },
                    formality: {
                        type: 'string'
                    },
                    name: {
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
                                quantityOfBonusGood: {
                                    type: 'number'
                                }
                            }
                        }
                    },
                }
            }
        },
        //Phí giao hàng
        shippingFee: {
            type: 'number'
        },
        //Thời gian giao hàng dự kiến
        deliveryTime: {
            type: 'string',
            format: 'date'
        },
        //Giao hàng lúc
        deliveryAt: {
            type: 'string',
            format: 'date'
        },
        //Số coin trừ vào đơn hàng, lúc thanh toán sẽ check, nếu đủ thì trừ, không thì thôi
        coin: {
            type: 'number'
        },
        //Số xu được cộng vào sau khi hoàn thành đơn
        allCoin: {
            type: 'number'
        },
        //Tổng thuế cho toàn đơn
        totalTax: {
            type: 'number',
        },
        paymentAmount: { //Tổng tiền thanh toán cho toàn đơn
            type: 'number',
        },
        note: {
            type: 'string'
        },
        bill: {//Phiếu đề nghị xuất kho
            type: 'string',
        },
        invoice: {// Xuất hóa đơn
            type: 'object',
            properties: {
                creator: {
                    type: 'string'
                },
                status: {// Xem đã xuất hóa đơn hay chưa
                    type: 'boolean',
                    default: false,
                    require: true
                }
            }
        },
        quote: { //Được lập từ báo giá nếu có
            type: 'string',
        }
    }
}

const ServiceLevelAgreement = {
    type: 'object',
    properties: {
        code: {
            type: 'string',
            required: true
        },
        goods: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    type: 'string',
                    required: true
                }
            }
        },
        title: {
            type: 'string',
            required: true
        },
        descriptions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    type: 'string'
                }
            }
        },
        creator: {
            type: 'string',
            required: true
        },
        version: {
            type: 'number',
            required: true
        },
        status: {
            type: 'boolean',
            required: true
        },
        lastVersion: {
            type: 'boolean',
            required: true
        },
    }
}

const Tax = {
    type: 'object',
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
        creator: {
            type: 'string',
            required: true
        },
        goods: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    good: {
                        type: 'string'
                    },
                    percent: {
                        type: 'number'
                    }
                }
            }
        },
        version: {
            type: 'number',
            required: true
        },
        lastVersion: {
            type: 'boolean',
            required: true
        },
        status: {
            type: 'boolean',
            required: true
        }
    }
}


module.exports = {
    BankAccount,
    BusinessDepartment,
    CoinRule,
    Discount,
    Payment,
    PurchaseOrder,
    Approvers,
    Quote,
    SaleOrder,
    ServiceLevelAgreement,
    Tax
}