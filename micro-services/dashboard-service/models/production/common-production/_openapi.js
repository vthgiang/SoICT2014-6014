const Category = {
    type: "object",
    properties: {
        parent: {
            type: 'String',
        },

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

        type: {
            type: 'String',
            enum: ["product", "material", "equipment", "waste"]
        },

        description: {
            type: 'String'
        }
    }
}

const Good = {
    type: "object",
    properties: {
        company: {
            type: 'String',
        },

        category: {
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

        type: {
            type: 'String',
            enum: ["product", "material", "equipment", "waste"],
            required: true
        },

        // sourceType = 1 when the goods are self-produced
        // sourceType = 2 when goods are imported from suppliers
        sourceType: {
            type: 'String',
            required: true
        },

        baseUnit: {
            type: 'String',
            required: true
        },

        units: [{
            type: 'Array',
            items: {
                type: 'Object',
                properties: {
                    name: {
                        type: 'String'
                    },

                    conversionRate: {
                        type: 'Number'
                    },

                    description: {
                        type: 'String'
                    }
                }
            }
        }],

        quantity: {
            type: 'Number',
            default: 0
        },

        description: {
            type: 'String'
        },

        materials: [{
            type: 'Array',
            items: {
                type: 'Object',
                properties: {
                    good: {
                        type: 'String',
                    },

                    quantity: {
                        type: 'Number'
                    }
                }
            }
        }],

        creator: {
            type: 'String',
        },

        // packingRule: {
        //     type: String
        // },

        numberExpirationDate: {
            type: 'Number'
        },

        manufacturingMills: [{
            type: 'Array',
            items: {
                type: 'Object',
                properties: {
                    manufacturingMill: {
                        type: 'String',
                    },
                    productivity: {
                        type: 'Number'
                    },
                    personNumber: {
                        type: 'Number'
                    }
                }
            }
        }],
        // Module chưa hoàn thiện
        returnRules: [{
            type: 'String',
        }],
        serviceLevelAgreements: [{
            type: 'String',
        }],
        discounts: [{
            type: 'String',
        }],
        taxs: [{
            type: 'String',
        }],
        pricePerBaseUnit: {
            type: 'Number',
        },
        salesPriceVariance: {
            type: 'Number',
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
            items: {
                type: 'Object',
                properties: {
                    stock: {
                        type: 'String',
                    },

                    quantity: {
                        type: 'Number'
                    },

                    binLocations: [{
                        type: 'Array',
                        items: {
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
            items: {
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
                        items: {
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
            items: {
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

module.exports = {
    Category,
    Good,
    Lot
}
