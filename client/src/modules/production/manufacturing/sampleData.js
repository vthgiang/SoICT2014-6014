const sampleData = {
    works: [{
        _id: "1",
        code: "NM001",
        name: "Nhà máy CRSX",
        worksManager: "Nguyễn Anh Phương",
        foreman: "Phạm Đại Tài",
        manufacturingMills: [{
            _id: "1",
            name: "Xưởng thuốc cốm"
        }, {
            _id: "2",
            name: "Xưởng thuốc viên"
        }],
        phoneNumber: "0337479966",
        status: 1,
        address: "Nhân Chính, Thanh Xuân, Hà Nội",
        description: "Nhà máy sản xuất thực phẩm chức năng",
        createdAt: "03-06-2020 12:00:00",
        updatedAt: "02-10-2020 13:00:00"
    }, {
        _id: "2",
        code: "NM002",
        name: "Nhà máy OSAKA",
        worksManager: "Nguyễn Văn Thắng",
        foreman: "Trịnh Công Sơn",
        manufacturingMills: [{
            _id: "3",
            name: "Xưởng thuốc tiêm"
        }, {
            _id: "4",
            name: "Xưởng thuốc bột"
        }],
        phoneNumber: "0372109881",
        status: 1,
        address: "Trung Hòa, Cầu Giấy, Hà Nội",
        description: "Nhà máy sản xuất thuốc thú y",
        createdAt: "03-06-2020 12:00:00",
        updatedAt: "02-10-2020 13:00:00"
    }],

    mills: [{
        _id: "1",
        code: "XSX 001",
        name: "Xưởng thuốc cốm",
        manufacturingWorks: {
            id: "1",
            name: "Nhà máy CRSX"
        },
        description: "Xưởng sản xuất thuốc cốm dạng hạt"

    }, {
        _id: "2",
        code: "XSX 002",
        name: "Xưởng thuốc viên",
        manufacturingWorks: {
            id: "1",
            name: "Nhà máy CRSX"
        },
        description: "Xưởng sản xuất thuốc viên con nhộng"
    }, {
        _id: "3",
        code: "XSX 003",
        name: "Xưởng thuốc tiêm",
        manufacturingWorks: {
            id: "2",
            name: "Nhà máy OSAKA",
        },
        description: "Xưởng sản xuất thuốc tiêm cho động vật"
    }, {
        _id: "4",
        code: "XSX 004",
        name: "Xưởng thuốc bột",
        manufacturingWorks: {
            id: "2",
            name: "Nhà máy OSAKA",
        },
        description: "Xưởng sản xuất thuốc bột cho động vật"
    }],

    purchasingRequests: [{
        _id: "1",
        code: "PDN 001",
        creator: {
            _id: "1",
            name: "Nguyen Anh Phương"
        },
        purpose: "Lập kế hoạch KH001",
        intendReceiveTime: "12-03-2020",
        status: 0,
        materials: [{
            name: "Dược liệu",
            code: "DL12220",
            baseUnit: "kg",
            quantity: 120,
        }, {
            name: "Tá liệu",
            code: "TL22211",
            baseUnit: "kg",
            quantity: 150,
        }, {
            name: "Vỏ cây thuốc",
            code: "VCT12230",
            baseUnit: "kg",
            quantity: 100,
        }
        ],
        description: "Phiếu tạo nguyên vật liệu mua hàng",
        createdAt: "10-3-2020",
        updatedAt: "10-3-2020 12:30:00"
    }, {
        _id: "2",
        code: "PDN 002",
        creator: {
            _id: "1",
            name: "Nguyen Anh Phương"
        },
        purpose: "Lập kế hoạch KH002",
        intendReceiveTime: "14-03-2020",
        status: 0,
        materials: [{
            name: "penicillin",
            code: "P110CF",
            baseUnit: "kg",
            quantity: 120,
        }, {
            name: "bột trắng",
            code: "BT210AC",
            baseUnit: "kg",
            quantity: 150,
        }, {
            name: "bột đỏ",
            code: "BD11200",
            baseUnit: "kg",
            quantity: 200,
        }
        ],
        description: "Phiếu tạo nguyên vật liệu mua hàng",
        createdAt: "11-3-2020",
        updatedAt: "11-3-2020 12:30:00"
    }, {
        _id: "3",
        code: "PDN 003",
        creator: {
            _id: "1",
            name: "Nguyen Anh Phương"
        },
        purpose: "Lập kế hoạch KH003",
        intendReceiveTime: "17-03-2020",
        status: 1,
        materials: [{
            name: "Thước cất",
            code: "NC11219",
            baseUnit: "lít",
            quantity: 200,
        }, {
            name: "Tinh dầu thô",
            code: "TDT1102",
            baseUnit: "lít",
            quantity: 250,
        }, {
            name: "Hộp đựng paracetamol",
            code: "PKP11100",
            baseUnit: "hộp",
            quantity: 150,
        }
        ],
        description: "Phiếu tạo nguyên vật liệu mua hàng",
        createdAt: "15-3-2020",
        updatedAt: "15-3-2020 12:30:00"
    }],
    manufacturingOrders: [{
        _id: "1",
        code: "DSX001",
        creator: {
            _id: "1",
            name: "Phạm Đại Tài",
        },
        deadline: "12-06-2020",
        type: "1",
        priority: "Rất cao",
        goods: [{
            good: {
                _id: 1,
                code: "T001",
                name: "Thuốc uống paracetamol",
                baseUnit: "Gói",
                packingRule: "1Thùngx5Hộpx10góix100g"
            },
            quantity: 100
        }, {
            good: {
                _id: 2,
                code: "T003",
                name: "Cốm dinh dưỡng W3Q",
                baseUnit: "kg",
                packingRule: "1Thùngx10hộpx1kg"
            },
            quantity: 200
        }, {
            good: {
                _id: 3,
                code: "T003",
                name: "Thuốc uống bột nap",
                baseUnit: "Gói",
                packingRule: "1Thùngx20Hộpx10góix100g"
            },
            quantity: 300
        }],
        description: "Đơn hàng sản xuất quan trọng phải lập ngay",
        status: "Đã lập kế hoạch",
        createdAt: "01-06-2020",
        updatedAt: ""
    }, {
        _id: "2",
        code: "DSX002",
        creator: {
            _id: "1",
            name: "Nguyễn Anh Phương",
        },
        deadline: "17-06-2020",
        type: "1",
        priority: "Cao",
        goods: [{
            good: {
                _id: 2,
                code: "T003",
                name: "Cốm dinh dưỡng W3Q",
                baseUnit: "kg",
                packingRule: "1Thùngx10hộpx1kg"
            },
            quantity: 200
        }, {
            good: {
                _id: 3,
                code: "T003",
                name: "Thuốc uống bột nap",
                baseUnit: "Gói",
                packingRule: "1Thùngx20Hộpx10góix100g"
            },
            quantity: 300
        }, {
            good: {
                _id: 4,
                code: "T004",
                name: "Thuốc uống tiêm lợn M3P",
                baseUnit: "gam",
                packingRule: "1Thùngx5Hộpx100g"
            },
            quantity: 400
        }],
        description: "Đơn hàng sản xuất cho khác hàng vip",
        status: "Đang lập kế hoạch",
        createdAt: "03-06-2020",
        updatedAt: ""
    }, {
        _id: "3",
        code: "DSX003",
        creator: {
            _id: "1",
            name: "Phạm Đại Tài",
        },
        deadline: "18-06-2020",
        type: "1",
        priority: "Cao",
        goods: [{
            good: {
                _id: 1,
                code: "T001",
                name: "Thuốc uống paracetamol",
                baseUnit: "Gói",
                packingRule: "1Thùngx5Hộpx10góix100g"
            },
            quantity: 100
        }, {
            good: {
                _id: 2,
                code: "T003",
                name: "Cốm dinh dưỡng W3Q",
                baseUnit: "kg",
                packingRule: "1Thùngx10hộpx1kg"
            },
            quantity: 200
        }, {
            good: {
                _id: 3,
                code: "T003",
                name: "Thuốc uống bột nap",
                baseUnit: "Gói",
                packingRule: "1Thùngx20Hộpx10góix100g"
            },
            quantity: 300
        }],
        description: "Đơn hàng sản xuất trực tiếp cho bên công ty VNIST",
        status: "Chưa lập kế hoạch",
        createdAt: "02-06-2020",
        updatedAt: ""
    }],
}

export default sampleData;