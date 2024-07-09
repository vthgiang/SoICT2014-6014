const Bill = {
    type: "object",
    properties: {
        // LSX
        fromStock: {
            type: 'String',
        },
        // LSX 1. Nhập kho 2. Xuất kho  3. trả hàng 4. Kiểm kê 5. Luân chuyển
        group: {
            type: 'String',
            enum: ["1", "2", "3", "4", "5"]
        },

        toStock: {
            type: 'String',
        },

        bill: {
            type: 'String',
        },

        // LSX 
        code: {
            type: 'String',
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
            type: 'String',
            enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"]
        },

        // LSX 1
        // Phiếu nhập kho
        //1: Chờ phê duyệt, 2: Chờ thực hiện, 3: Chờ kiểm định chất lượng, 4: Chờ đánh lô hàng hóa, 5: Chờ xếp hàng vào kho, 6: Đã xếp hàng vào kho, 7: Đã hủy phiếu
        // Phiếu xuất kho
        //1: Chờ phê duyệt, 2: Chờ thực hiện, 3: Đang thực hiện, 5: Đã hoàn thành, 7: Đã hủy phiếu
        status: {
            type: 'String',
            enum: ["1", "2", "3", "4", "5", "6", "7"]
        },

        users: [{
            type: 'String',
        }],

        // LSX
        creator: {
            type: 'String',
        },

        // LSX
        approvers: [{
            type: 'array',
            items: {
                type: 'Object',
                properties: {
                    approver: {
                        type: 'String',
                    },

                    approvedTime: {
                        type: 'string',
                        format: 'date',
                    }
                }
            }
        }],

        // LSX
        qualityControlStaffs: [{ // Danh sách người kiểm định chất lượng 
            type: 'Array',
            items: {
                type: 'Object',
                properties: {
                    staff: { // Người kiểm định
                        type: 'String',
                    },

                    status: { // Trạng thái kiểm định 1. Chưa kiểm định xong, 2. Đã kiểm định xong
                        type: 'Number'
                    },

                    content: { // Nội dung kiểm định
                        type: 'String'
                    },

                    time: { // Thời gian kiểm định
                        type: 'string',
                        format: 'date',
                    }
                }
            }
        }],

        // LSX
        responsibles: [{ // Danh sách người thực hiện
            type: 'String',
        }],

        // LSX
        accountables: [{ // Người giám sát
            type: 'String',
        }],

        customer: {
            type: 'String',
        },

        supplier: {
            type: 'String',
        },

        // LSX
        receiver: {
            type: 'Array',
            items: {
                type: 'Object',
                properties: {
                    name: {
                        type: 'String'
                    },

                    phone: {
                        type: 'Number'
                    },

                    email: {
                        type: 'String'
                    },

                    address: {
                        type: 'String'
                    }
                }
            }
        },

        // LSX
        description: {
            type: 'String'
        },

        sourceType: {
            type: 'String'
            // required: true
        },

        // LSX
        goods: [{
            type: 'Object',
            item: {
                type: 'Object',
                properties: {
                    //LSX
                    good: {
                        type: 'String',
                    },
                    //LSX
                    quantity: {
                        type: 'Number',
                        default: 0
                    },

                    returnQuantity: {
                        type: 'Number',
                        default: 0
                    },

                    damagedQuantity: {
                        type: 'Number',
                        default: 0
                    },

                    realQuantity: {
                        type: 'Number'
                    },

                    lots: [{
                        type: 'Array',
                        item: {
                            type: 'Object',
                            properties: {
                                // LSX
                                lot: {
                                    type: 'String',
                                },
                                // LSX
                                quantity: {
                                    type: 'Number',
                                    default: 0
                                },

                                returnQuantity: {
                                    type: 'Number',
                                    default: 0
                                },

                                damagedQuantity: {
                                    type: 'Number',
                                    default: 0
                                },

                                realQuantity: {
                                    type: 'Number'
                                },

                                note: {
                                    type: 'String'
                                }
                            }
                        }
                    }],
                    unpassed_quality_control_lots: [{
                        type: 'Array',
                        item: {
                            type: 'Object',
                            properties: {
                                // LSX
                                lot: {
                                    type: 'String',
                                },
                                // LSX
                                quantity: {
                                    type: 'Number',
                                    default: 0
                                },

                                returnQuantity: {
                                    type: 'Number',
                                    default: 0
                                },

                                damagedQuantity: {
                                    type: 'Number',
                                    default: 0
                                },

                                realQuantity: {
                                    type: 'Number'
                                },

                                note: {
                                    type: 'String'
                                }
                            }
                        }
                    }],

                    description: {
                        type: 'String'
                    }
                }
            }
        }],

        // LSX
        manufacturingMill: {
            type: 'String',
        },
        // LSX
        manufacturingCommand: {
            type: 'String',
        },

        // Tạo log khi create
        logs: [{
            type: 'Array',
            item: {
                type: 'Object',
                createAt: {
                    type: 'String',
                    format: 'date'
                },

                creator: {
                    type: 'String',
                },

                title: {
                    type: 'String'
                },

                versions: {
                    type: 'String'
                }
            }
        }]
    }
}

const BinLocation = {
    type: "object",
    properties: {
        parent: {
            type: 'String',
        },

        child: [{
            type: 'String',
        }],

        path: {
            type: 'String'
        },

        code: {
            type: 'String',
            required: true
        },

        name: {
            type: 'String',
            required: true
        },

        description: {
            type: 'String'
        },

        stock: {
            type: 'String',
        },

        status: {
            type: 'String',
            enum: ["1", "2", "3", "4", "5"]
        },

        users: [{
            type: 'String',
        }],

        // goods: [{
        //     type: Schema.Types.ObjectId,
        //     ref: 'Good'
        // }],

        department: {
            type: 'String',
        },

        enableGoods: [{
            type: 'Array',
            item: {
                type: 'Object',
                properties: {
                    good: {
                        type: 'String',
                    },

                    contained: {
                        type: 'Number',
                        default: 0
                    },

                    capacity: {
                        type: 'Number',
                        default: 0
                    }
                }
            }
        }],

        capacity: {
            type: 'Number',
            default: 0
        },

        contained: {
            type: 'Number',
            default: 0
        },

        unit: {
            type: 'String'
        }
    }
}

const Lot = {
    type: 'object',
    properties: {
        name: {
            type: 'String',
            required: true
        },

        good: {
            type: 'String',
        },

        type: {
            type: 'String',
            enum: ["product", "material", "equipment", "waste"],
        },

        stocks: [{
            type: 'Array',
            item: {
                type: 'Object',
                properties: {
                    stock: {
                        type: 'String',
                    },

                    quantity: {
                        type: 'Number'
                    },

                    binLocations: [{
                        binLocation: {
                            type: 'String',
                        },

                        quantity: {
                            type: 'Number'
                        }
                    }]
                }
            }
        }],

        originalQuantity: {
            type: 'Number',
            default: 0
        },

        quantity: {
            type: 'Number',
            default: 0
        },

        expirationDate: {
            type: 'String',
            format: 'date'
        },

        description: {
            type: 'String'
        },

        lotLogs: [{
            type: 'Array',
            item: {
                type: 'Object',
                properties: {
                    bill: {
                        type: 'String',
                    },

                    quantity: {
                        type: 'Number'
                    },

                    description: {
                        type: 'String'
                    },

                    type: {
                        type: 'String',
                    },

                    createdAt: {
                        type: 'String',
                        default: new Date()
                    },

                    stock: {
                        type: 'String',
                    },

                    toStock: {
                        type: 'String',
                    },

                    binLocations: [{
                        type: 'Array',
                        item: {
                            type: 'Object',
                            properties: {
                                binLocation: {
                                    type: 'String',
                                },

                                quantity: {
                                    type: 'Number'
                                }
                            }
                        }
                    }]
                }
            }
        }],

        logs: [{
            type: 'Array',
            item: {
                type: 'Object',
                properties: {
                    createAt: {
                        type: 'String',
                        default: new Date()
                    },

                    creator: {
                        type: 'String',
                    },

                    title: {
                        type: 'String'
                    },

                    description: {
                        type: 'String'
                    }
                }
            }
        }]
    }
}

const Partner = {
    type: "object",
    properties: {
        code: {
            type: 'String',
            required: true
        },

        type: {
            type: 'String',
            enum: ["organization", "personal"],
            require: true
        },

        group: {
            type: 'String',
            enum: ["supplier", "customer"],
            required: true
        },

        description: {
            type: 'String'
        },

        organization: {
            type: 'Object',
            item: {
                type: 'Object',
                properties: {
                    name: {
                        type: 'String',
                    },
        
                    address: {
                        type: 'String',
                    },
        
                    phone: {
                        type: 'String',
                    },
        
                    email: {
                        type: 'String',
                    },
        
                    tax: {
                        type: 'String',
                    },
        
                    fax: {
                        type: 'String',
                    }
                }
            }
        },

        personal: {
            type: 'Object',
            item: {
                type: 'Object',
                properties: {
                    name: {
                        type: 'String',
                        required: true
                    },
        
                    office: {
                        type: 'String',
                        required: true
                    },
        
                    address: {
                        type: 'String',
                        required: true
                    },
        
                    phone: {
                        type: 'Number',
                        required: true
                    },
        
                    email: {
                        type: 'String',
                        required: true
                    },
        
                    tax: {
                        type: 'String'
                    }
                }
            }
        }
    }
}

const Proposal = {
    type: "object",
    properties: {
        company: {
            type: 'String',
        },

        code: {
            type: 'String',
            required: true
        },

        type: {
            type: 'String',
            enum: [""]
        },

        stock: {
            type: 'String',
        },

        description: {
            type: 'String'
        },

        goods: [{
            type: 'Array',
            item: {
                type: 'Object',
                properties: {
                    good: {
                        type: 'String',
                    },
        
                    quantity: {
                        type: 'Number',
                        default: 1,
                        required: true
                    },
        
                    price: {
                        type: 'Number',
                        default: 1000
                    }
                }
            }
        }],

        partner: {
            type: 'String',
        },

        moveStock: {
            type: 'String',
        },

        users: [{
            type: 'String',
        }],

        timestamp: {
            type: 'String',
            default: new Date()
        },

        expectedDate: {
            type: 'String',
            format: 'date'
        }
    }
}

const Stock = {
    type: 'object',
    properties: {
        company: {
            type: 'String',
        },

        code: {
            type: 'String',
            required: true
        },

        name: {
            type: 'String',
            required: true
        },

        description: {
            type: 'String'
        },

        address: {
            type: 'String',
            required: true
        },

        status: {
            type: 'String',
            enum: ["1", "2", "3", "4"]
        },

        managementLocation: [{
            type: 'Array',
            item: {
                type: 'Object',
                properties: {
                    role: {
                        type: 'String',
                    },
        
                    managementGood: [{
                        type: 'String',
                        enum: ["product", "material", "equipment", "waste"],
                    }]
                }
            }
        }],

        goods: [{
            type: 'Array',
            item: {
                type: 'Object',
                properties: {
                    good: {
                        type: 'String',
                    },
        
                    maxQuantity: {
                        type: 'Number',
                    },
        
                    minQuantity: {
                        type: 'Number'
                    }
                }
            }
        }],
        manageDepartment: {
            type: 'String',
        }
    }
}

module.exports = {
    Bill,
    BinLocation,
    Lot,
    Partner,
    Proposal,
    Stock
}
