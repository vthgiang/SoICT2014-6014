const sampleData = {
  works: [
    {
      _id: '1',
      code: 'NM001',
      name: 'Nhà máy CRSX',
      worksManager: 'Nguyễn Anh Phương',
      foreman: 'Phạm Đại Tài',
      manufacturingMills: [
        {
          _id: '1',
          name: 'Xưởng thuốc cốm'
        },
        {
          _id: '2',
          name: 'Xưởng thuốc viên'
        }
      ],
      phoneNumber: '0337479966',
      status: 1,
      address: 'Nhân Chính, Thanh Xuân, Hà Nội',
      description: 'Nhà máy sản xuất thực phẩm chức năng',
      createdAt: '03-06-2020 12:00:00',
      updatedAt: '02-10-2020 13:00:00'
    },
    {
      _id: '2',
      code: 'NM002',
      name: 'Nhà máy OSAKA',
      worksManager: 'Nguyễn Văn Thắng',
      foreman: 'Trịnh Công Sơn',
      manufacturingMills: [
        {
          _id: '3',
          name: 'Xưởng thuốc tiêm'
        },
        {
          _id: '4',
          name: 'Xưởng thuốc bột'
        }
      ],
      phoneNumber: '0372109881',
      status: 1,
      address: 'Trung Hòa, Cầu Giấy, Hà Nội',
      description: 'Nhà máy sản xuất thuốc thú y',
      createdAt: '03-06-2020 12:00:00',
      updatedAt: '02-10-2020 13:00:00'
    }
  ],

  mills: [
    {
      _id: '1',
      code: 'XSX 001',
      name: 'Xưởng thuốc cốm',
      manufacturingWorks: {
        id: '1',
        name: 'Nhà máy CRSX'
      },
      description: 'Xưởng sản xuất thuốc cốm dạng hạt'
    },
    {
      _id: '2',
      code: 'XSX 002',
      name: 'Xưởng thuốc viên',
      manufacturingWorks: {
        id: '1',
        name: 'Nhà máy CRSX'
      },
      description: 'Xưởng sản xuất thuốc viên con nhộng'
    },
    {
      _id: '3',
      code: 'XSX 003',
      name: 'Xưởng thuốc tiêm',
      manufacturingWorks: {
        id: '2',
        name: 'Nhà máy OSAKA'
      },
      description: 'Xưởng sản xuất thuốc tiêm cho động vật'
    },
    {
      _id: '4',
      code: 'XSX 004',
      name: 'Xưởng thuốc bột',
      manufacturingWorks: {
        id: '2',
        name: 'Nhà máy OSAKA'
      },
      description: 'Xưởng sản xuất thuốc bột cho động vật'
    }
  ],

  purchasingRequests: [
    {
      _id: '1',
      code: 'PDN 001',
      creator: {
        _id: '1',
        name: 'Nguyen Anh Phương'
      },
      purpose: 'Lập kế hoạch KH001',
      intendReceiveTime: '12-03-2020',
      status: 0,
      materials: [
        {
          name: 'Dược liệu',
          code: 'DL12220',
          baseUnit: 'kg',
          quantity: 120
        },
        {
          name: 'Tá liệu',
          code: 'TL22211',
          baseUnit: 'kg',
          quantity: 150
        },
        {
          name: 'Vỏ cây thuốc',
          code: 'VCT12230',
          baseUnit: 'kg',
          quantity: 100
        }
      ],
      description: 'Phiếu tạo nguyên vật liệu mua hàng',
      createdAt: '10-3-2020',
      updatedAt: '10-3-2020 12:30:00'
    },
    {
      _id: '2',
      code: 'PDN 002',
      creator: {
        _id: '1',
        name: 'Nguyen Anh Phương'
      },
      purpose: 'Lập kế hoạch KH002',
      intendReceiveTime: '14-03-2020',
      status: 0,
      materials: [
        {
          name: 'penicillin',
          code: 'P110CF',
          baseUnit: 'kg',
          quantity: 120
        },
        {
          name: 'bột trắng',
          code: 'BT210AC',
          baseUnit: 'kg',
          quantity: 150
        },
        {
          name: 'bột đỏ',
          code: 'BD11200',
          baseUnit: 'kg',
          quantity: 200
        }
      ],
      description: 'Phiếu tạo nguyên vật liệu mua hàng',
      createdAt: '11-3-2020',
      updatedAt: '11-3-2020 12:30:00'
    },
    {
      _id: '3',
      code: 'PDN 003',
      creator: {
        _id: '1',
        name: 'Nguyen Anh Phương'
      },
      purpose: 'Lập kế hoạch KH003',
      intendReceiveTime: '17-03-2020',
      status: 1,
      materials: [
        {
          name: 'Nước cất',
          code: 'NC11219',
          baseUnit: 'lít',
          quantity: 200
        },
        {
          name: 'Tinh dầu thô',
          code: 'TDT1102',
          baseUnit: 'lít',
          quantity: 250
        },
        {
          name: 'Hộp đựng paracetamol',
          code: 'PKP11100',
          baseUnit: 'hộp',
          quantity: 150
        }
      ],
      description: 'Phiếu tạo nguyên vật liệu mua hàng',
      createdAt: '15-3-2020',
      updatedAt: '15-3-2020 12:30:00'
    }
  ],
  manufacturingOrders: [
    {
      _id: '1',
      code: 'DSX001',
      creator: {
        _id: '1',
        name: 'Phạm Đại Tài'
      },
      deadline: '12-06-2020',
      type: '1',
      priority: 'Rất cao',
      goods: [
        {
          good: {
            _id: 1,
            code: 'T001',
            name: 'Thuốc uống paracetamol',
            baseUnit: 'Gói',
            packingRule: '1Thùngx5Hộpx10góix100g',
            materials: [
              {
                name: 'Nước cất',
                code: 'NC11219',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Tinh dầu thô',
                code: 'TDT1102',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Hộp đựng paracetamol',
                code: 'PKP11100',
                baseUnit: 'hộp',
                quantity: 1
              }
            ]
          },
          quantity: 100,
          planedQuantity: 0
        },
        {
          good: {
            _id: 2,
            code: 'T003',
            name: 'Cốm dinh dưỡng W3Q',
            baseUnit: 'kg',
            packingRule: '1Thùngx10hộpx1kg',
            materials: [
              {
                name: 'Dầu dừa',
                code: 'NC11219',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Bột lọc',
                code: 'TDT1102',
                baseUnit: 'lít',
                quantity: 2
              }
            ]
          },
          quantity: 200,
          planedQuantity: 0
        },
        {
          good: {
            _id: 3,
            code: 'T003',
            name: 'Thuốc uống bột nap',
            baseUnit: 'Gói',
            packingRule: '1Thùngx20Hộpx10góix100g',
            materials: [
              {
                name: 'Nước cất loại 1',
                code: 'NC11219',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Hoa thảo nguyên',
                code: 'TDT1102',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Hộp đựng cấp 1',
                code: 'PKP11100',
                baseUnit: 'hộp',
                quantity: 2
              }
            ]
          },
          quantity: 300,
          planedQuantity: 0
        }
      ],
      description: 'Đơn hàng sản xuất quan trọng phải lập ngay',
      status: 'Đã lập kế hoạch',
      createdAt: '01-06-2020',
      updatedAt: ''
    },
    {
      _id: '2',
      code: 'DSX002',
      creator: {
        _id: '1',
        name: 'Nguyễn Anh Phương'
      },
      deadline: '17-06-2020',
      type: '1',
      priority: 'Cao',
      goods: [
        {
          good: {
            _id: 2,
            code: 'T003',
            name: 'Cốm dinh dưỡng W3Q',
            baseUnit: 'kg',
            packingRule: '1Thùngx10hộpx1kg',
            materials: [
              {
                name: 'Nước cất',
                code: 'NC11219',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Tinh dầu thô',
                code: 'TDT1102',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Hộp đựng paracetamol',
                code: 'PKP11100',
                baseUnit: 'hộp',
                quantity: 1
              }
            ]
          },
          quantity: 200,
          planedQuantity: 0
        },
        {
          good: {
            _id: 3,
            code: 'T003',
            name: 'Thuốc uống bột nap',
            baseUnit: 'Gói',
            packingRule: '1Thùngx20Hộpx10góix100g',
            materials: [
              {
                name: 'Nước cất',
                code: 'NC11219',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Tinh dầu thô',
                code: 'TDT1102',
                baseUnit: 'lít',
                quantity: 2
              }
            ]
          },
          quantity: 300,
          planedQuantity: 0
        },
        {
          good: {
            _id: 4,
            code: 'T004',
            name: 'Thuốc tiêm lợn M3P',
            baseUnit: 'gam',
            packingRule: '1Thùngx5Hộpx100g',
            materials: [
              {
                name: 'Nước cất',
                code: 'NC11219',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Tinh dầu thô',
                code: 'TDT1102',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Hộp đựng paracetamol',
                code: 'PKP11100',
                baseUnit: 'hộp',
                quantity: 1
              }
            ]
          },
          quantity: 400,
          planedQuantity: 0
        }
      ],
      description: 'Đơn hàng sản xuất cho khác hàng vip',
      status: 'Chưa lập kế hoạch',
      createdAt: '03-06-2020',
      updatedAt: ''
    },
    {
      _id: '3',
      code: 'DSX003',
      creator: {
        _id: '1',
        name: 'Nguyễn Văn Thắng'
      },
      deadline: '18-06-2020',
      type: '1',
      priority: 'Cao',
      goods: [
        {
          good: {
            _id: '1',
            code: 'T001',
            name: 'Thuốc uống paracetamol',
            baseUnit: 'Gói',
            packingRule: '1Thùngx5Hộpx10góix100g',
            materials: [
              {
                name: 'Bột thuốc trắng',
                code: 'NC1120',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Tinh dầu thô',
                code: 'TDT1102',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Hộp đựng paracetamol',
                code: 'PKP11100',
                baseUnit: 'hộp',
                quantity: 1
              }
            ]
          },
          quantity: 100,
          planedQuantity: 0
        },
        {
          good: {
            _id: '2',
            code: 'T003',
            name: 'Cốm dinh dưỡng W3Q',
            baseUnit: 'kg',
            packingRule: '1Thùngx10hộpx1kg',
            materials: [
              {
                name: 'Nước cất',
                code: 'NC11219',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Tinh dầu thô',
                code: 'TDT1102',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Hộp đựng paracetamol',
                code: 'PKP11100',
                baseUnit: 'hộp',
                quantity: 1
              }
            ]
          },
          quantity: 200,
          planedQuantity: 0
        },
        {
          good: {
            _id: '3',
            code: 'T003',
            name: 'Thuốc uống bột nap',
            baseUnit: 'Gói',
            packingRule: '1Thùngx20Hộpx10góix100g',
            materials: [
              {
                name: 'Nước cất',
                code: 'NC11219',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Tinh dầu thô',
                code: 'TDT1102',
                baseUnit: 'lít',
                quantity: 2
              },
              {
                name: 'Hộp đựng paracetamol',
                code: 'PKP11100',
                baseUnit: 'hộp',
                quantity: 1
              }
            ]
          },
          quantity: 300,
          planedQuantity: 100
        }
      ],
      description: 'Đơn hàng sản xuất trực tiếp cho bên công ty VNIST',
      status: 'Đang lập kế hoạch',
      createdAt: '02-06-2020',
      updatedAt: ''
    }
  ],

  manufacturingPlans: [
    {
      _id: '1',
      code: 'KH 001',
      manufacturingOrder: {
        _id: '1',
        code: 'DSX001'
      },
      goods: [
        {
          good: {
            _id: '1',
            code: 'T001',
            name: 'Thuốc uống paracetamol',
            baseUnit: 'Gói',
            packingRule: '1Thùngx5Hộpx10góix100g'
          },
          quantity: 1000,
          orderedQuantity: 8000
        },
        {
          good: {
            _id: '2',
            code: 'T003',
            name: 'Cốm dinh dưỡng W3Q',
            baseUnit: 'kg',
            packingRule: '1Thùngx10hộpx1kg'
          },
          quantity: 200,
          orderedQuantity: 200
        },
        {
          good: {
            _id: '3',
            code: 'T003',
            name: 'Thuốc uống bột nap',
            baseUnit: 'Gói',
            packingRule: '1Thùngx20Hộpx10góix100g'
          },
          quantity: 500,
          orderedQuantity: 400
        }
      ],
      creator: {
        _id: '1',
        name: 'Nguyễn Anh Phương'
      },
      startDate: '07-10-2020',
      endDate: '27-10-2020',
      description: 'Kế hoạch sản xuất tuần 3 và tuần 4 tháng 10',
      logs: [
        {
          creator: {
            id: '1',
            name: 'Nguyễn Anh Phương'
          },
          createdAt: '06-10-2020',
          title: 'Sửa thuộc tính mặt hàng',
          description: 'Sửa số lượng thực tế sản xuất từ 400 thành 500 của mặt hàng T003'
        },
        {
          creator: {
            id: '1',
            name: 'Nguyễn Anh Phương'
          },
          createdAt: '06-10-2020',
          title: 'Sửa thuộc tính mặt hàng',
          description: 'Sửa số lượng thực tế sản xuất từ 400 thành 500'
        }
      ],
      createdAt: '04-10-2020',
      updatedAt: '06-10-2020',
      status: 'Đang thực hiện'
    },
    {
      _id: '2',
      code: 'KH 002',
      manufacturingOrder: {
        _id: '1',
        code: 'DSX001'
      },
      goods: [
        {
          good: {
            _id: '1',
            code: 'T001',
            name: 'Thuốc uống paracetamol',
            baseUnit: 'Gói',
            packingRule: '1Thùngx5Hộpx10góix100g'
          },
          quantity: 1000,
          orderedQuantity: 8000
        },
        {
          good: {
            _id: '2',
            code: 'T003',
            name: 'Cốm dinh dưỡng W3Q',
            baseUnit: 'kg',
            packingRule: '1Thùngx10hộpx1kg'
          },
          quantity: 200,
          orderedQuantity: 200
        },
        {
          good: {
            _id: '3',
            code: 'T003',
            name: 'Thuốc uống bột nap',
            baseUnit: 'Gói',
            packingRule: '1Thùngx20Hộpx10góix100g'
          },
          quantity: 500,
          orderedQuantity: 400
        }
      ],
      creator: {
        _id: '1',
        name: 'Nguyễn Anh Phương'
      },
      startDate: '07-10-2020',
      endDate: '27-10-2020',
      description: 'Kế hoạch sản xuất tuần 3 và tuần 4 tháng 10',
      logs: [
        {
          creator: {
            id: '1',
            name: 'Nguyễn Anh Phương'
          },
          createdAt: '06-10-2020',
          title: 'Sửa thuộc tính mặt hàng',
          description: 'Sửa số lượng thực tế sản xuất từ 400 thành 500 của mặt hàng T003'
        },
        {
          creator: {
            id: '1',
            name: 'Nguyễn Anh Phương'
          },
          createdAt: '06-10-2020',
          title: 'Sửa thuộc tính mặt hàng',
          description: 'Sửa số lượng thực tế sản xuất từ 400 thành 500'
        }
      ],
      createdAt: '04-10-2020',
      updatedAt: '06-10-2020',
      status: 'Chưa được duyệt'
    },
    {
      _id: '3',
      code: 'KH 003',
      manufacturingOrder: {
        _id: '2',
        code: 'DSX002'
      },
      goods: [
        {
          good: {
            _id: '1',
            code: 'T001',
            name: 'Thuốc uống paracetamol',
            baseUnit: 'Gói',
            packingRule: '1Thùngx5Hộpx10góix100g'
          },
          quantity: 1000,
          orderedQuantity: 8000
        },
        {
          good: {
            _id: '2',
            code: 'T003',
            name: 'Cốm dinh dưỡng W3Q',
            baseUnit: 'kg',
            packingRule: '1Thùngx10hộpx1kg'
          },
          quantity: 200,
          orderedQuantity: 200
        },
        {
          good: {
            _id: '3',
            code: 'T003',
            name: 'Thuốc uống bột nap',
            baseUnit: 'Gói',
            packingRule: '1Thùngx20Hộpx10góix100g'
          },
          quantity: 500,
          orderedQuantity: 400
        }
      ],
      creator: {
        _id: '1',
        name: 'Phạm Đạt Tài'
      },
      startDate: '07-10-2020',
      endDate: '27-10-2020',
      description: 'Kế hoạch sản xuất tuần 3 và tuần 4 tháng 10',
      logs: [
        {
          creator: {
            id: '1',
            name: 'Phạm Đạt Tài'
          },
          createdAt: '06-10-2020',
          title: 'Sửa thuộc tính mặt hàng',
          description: 'Sửa số lượng thực tế sản xuất từ 400 thành 500 của mặt hàng T003'
        },
        {
          creator: {
            id: '1',
            name: 'Phạm Đạt Tài'
          },
          createdAt: '06-10-2020',
          title: 'Sửa thuộc tính mặt hàng',
          description: 'Sửa số lượng thực tế sản xuất từ 400 thành 500'
        }
      ],
      createdAt: '04-10-2020',
      updatedAt: '06-10-2020',
      status: 'Đã hoàn thành'
    },
    {
      _id: '4',
      code: 'KH 004',
      goods: [
        {
          good: {
            _id: '1',
            code: 'T001',
            name: 'Thuốc uống paracetamol',
            baseUnit: 'Gói',
            packingRule: '1Thùngx5Hộpx10góix100g'
          },
          quantity: 1000,
          orderedQuantity: 8000
        },
        {
          good: {
            _id: '2',
            code: 'T003',
            name: 'Cốm dinh dưỡng W3Q',
            baseUnit: 'kg',
            packingRule: '1Thùngx10hộpx1kg'
          },
          quantity: 200,
          orderedQuantity: 200
        },
        {
          good: {
            _id: '3',
            code: 'T003',
            name: 'Thuốc uống bột nap',
            baseUnit: 'Gói',
            packingRule: '1Thùngx20Hộpx10góix100g'
          },
          quantity: 500,
          orderedQuantity: 400
        }
      ],
      creator: {
        _id: '1',
        name: 'Nguyễn Anh Phương'
      },
      startDate: '01-11-2020',
      endDate: '08-11-2020',
      description: 'Kế hoạch sản xuất tuần 1 tháng 11 năm 2020',
      logs: [
        {
          creator: {
            id: '1',
            name: 'Nguyễn Anh Phương'
          },
          createdAt: '06-10-2020',
          title: 'Sửa thuộc tính mặt hàng',
          description: 'Sửa số lượng thực tế sản xuất từ 400 thành 500 của mặt hàng T003'
        },
        {
          creator: {
            id: '1',
            name: 'Nguyễn Anh Phương'
          },
          createdAt: '06-10-2020',
          title: 'Sửa thuộc tính mặt hàng',
          description: 'Sửa số lượng thực tế sản xuất từ 500 thành 400 của mặt hàng T003'
        }
      ],
      createdAt: '04-10-2020',
      updatedAt: '06-10-2020',
      status: 'Đã hủy'
    }
  ],

  manufacturingCommands: [
    {
      _id: '1',
      code: 'LSX001',
      manufacturingPlan: {
        _id: '1',
        code: 'KH001'
      },
      startDate: '10/10/2020',
      endDate: '20/10/2020',
      startTurn: '1',
      endTurn: '3',
      good: {
        _id: '1',
        name: 'penicillin'
      },
      quantity: 100,
      manufacturingMill: {
        _id: '1',
        code: 'XSX001',
        name: 'Nhà máy thuốc thú y'
      },
      creator: {
        _id: 1,
        name: 'Nguyễn Anh Phương'
      },
      responsible: [
        {
          _id: 2,
          name: 'Phạm Đại Tài'
        },
        {
          _id: 3,
          name: 'Nguyễn Văn Thắng'
        }
      ],
      accountable: [
        {
          _id: 4,
          name: 'TS.Trịnh Tuấn Đạt'
        },
        {
          _id: 5,
          name: 'TS. Vũ Thị Hương Giang'
        }
      ],
      status: 'Đúng tiến độ',
      description: 'Lệnh sản xuất tuần thứ 41',
      createdAt: '10/10/2020',
      updatedAt: '20/10/2020'
    },
    {
      _id: '2',
      code: 'LSX002',
      manufacturingPlan: {
        _id: '1',
        code: 'KH001'
      },
      startDate: '11/10/2020',
      endDate: '19/10/2020',
      startTurn: '2',
      endTurn: '3',
      good: {
        _id: '1',
        name: 'tiffy'
      },
      quantity: 90,
      manufacturingMill: {
        _id: '1',
        code: 'XSX001',
        name: 'Nhà máy thuốc thú y'
      },
      creator: {
        _id: 1,
        name: 'Nguyễn Anh Phương'
      },
      responsible: [
        {
          _id: 2,
          name: 'Nguyễn Văn Tùng'
        },
        {
          _id: 3,
          name: 'Nguyễn Văn Thắng'
        }
      ],
      accountable: [
        {
          _id: 4,
          name: 'TS.Trịnh Tuấn Đạt'
        }
      ],
      status: 'Đã hoàn thành',
      description: 'Lệnh sản xuất tuần thứ 41',
      createdAt: '10/10/2020',
      updatedAt: '20/10/2020'
    },
    {
      _id: '3',
      code: 'LSX003',
      manufacturingPlan: {
        _id: '1',
        code: 'KH001'
      },
      startDate: '11/10/2020',
      endDate: '19/10/2020',
      startTurn: '2',
      endTurn: '3',
      good: {
        _id: '1',
        name: 'tiffy'
      },
      quantity: 90,
      manufacturingMill: {
        _id: '1',
        code: 'XSX001',
        name: 'Nhà máy thuốc thú y'
      },
      creator: {
        _id: 1,
        name: 'Nguyễn Anh Phương'
      },
      responsible: [
        {
          _id: 2,
          name: 'Nguyễn Văn Tùng'
        },
        {
          _id: 3,
          name: 'Nguyễn Văn Thắng'
        }
      ],
      accountable: [
        {
          _id: 4,
          name: 'TS.Trịnh Tuấn Đạt'
        }
      ],
      status: 'Trễ tiến độ',
      description: 'Lệnh sản xuất tuần thứ 41',
      createdAt: '10/10/2020',
      updatedAt: '20/10/2020'
    }
  ],  
  manufacturingRoutings: [{
    _id: "1",
    code: "DT19032024",
    name: "Quy trình sản xuất thuốc viên",
    products: [{
      _id: 1,
      name: "Thuốc viên NSAIDs"
    }, {
      _id: 2,
      name: "Thuốc viên Tylenol"
    }],
    manufacturingWorks: {
      _id: 1,
      name: "Nhà máy CRSX"
    },
    creator: {
      _id: 5,
      name: "Nguyễn Tiến Đạt - datnt.vnist@gmail.com"
    },
    description: "Quy trình sản xuất thuốc viên nhóm NSAIDs",
    operations: [{
      id: 1,
      name: "Nhập nguyên liệu",
      implementation_mill: "Xuởng đầu vào",
      setupTime: "0.5h",
      hourProduction: 100,
      operating_cost: "100$",
      workers: [{
        id: 1,
        type: "worker",
        name: "Nhân viên phụ trách nguyên vật liệu",
        number: 2
      }],
      nextOperation: 2
    }, {
      id: 2,
      name: "Trộn nguyên liệu",
      implementation_mill: "Xuởng trộn",
      setupTime: "0.5h",
      hourProduction: 100,
      operating_cost: "100$",
      workers: [{
        id: 1,
        type: "worker",
        name: "Nhân viên trộn nguyên liệu",
        number: 1
      }],
      machines: [{
        id: 2,
        type: "machine",
        name: "Máy trộn MT20",
        number: 2
      }],
      nextOperation: 3
    }, {
      id: 3,
      name: "Tạo hạt",
      implementation_mill: "Xưởng tạo hạt",
      setupTime: "0.5h",
      hourProduction: 100,
      operating_cost: "100$",
      workers: [{
        _id: 1,
        type: "worker",
        name: "Nhân viên ép hạt",
        number: 1
      }],
      workers: [{
        id: 2,
        type: "machine",
        name: "Máy tạo hạt MTH50",
        number: 2
      }],
      nextOperation: 4
    }, {
      id: 4,
      name: "Đóng gói",
      implementation_mill: "Xưởng đóng gói",
      setupTime: "0.5h",
      hourProduction: 100,
      operating_cost: "100$",
      workers: [{
        id: 1,
        type: "worker",
        name: "Nhân viên đóng gói sản phẩm",
        number: 1
      }],
      nextOperation: null
    }],
    createdAt: "27/03/2024",
    status: 1
  }, {
    id: "1",
    code: "DT19032024",
    name: "Quy trình sản xuất thuốc bột",
    products: [{
      _id: 1,
      name: "Thuốc viên NSAIDs"
    }, {
      _id: 2,
      name: "Thuốc viên Tylenol"
    }],
    manufacturingWorks: {
      _id: 1,
      name: "Nhà máy CRSX"
    },
    creator: {
      _id: 5,
      name: "Nguyễn Tiến Đạt - datnt.vnist@gmail.com"
    },
    description: "Quy trình sản xuất thuốc viên nhóm NSAIDs",
    operations: [{
      name: "Nhập nguyên liệu",
      implementation_mill: "Xuởng đầu vào",
      setupTime: "0.5h",
      hourProduction: 100,
      operating_cost: "100$",
      resources: [{
        _id: 1,
        type: "worker",
        name: "Nhân viên phụ trách nguyên vật liệu",
        number: 2
      }]
    }, {
      name: "Trộn nguyên liệu",
      implementation_mill: "Xuởng trộn",
      setupTime: "0.5h",
      hourProduction: 100,
      operating_cost: "100$",
      resources: [{
        _id: 1,
        type: "worker",
        name: "Nhân viên trộn nguyên liệu",
        number: 1
      }, {
        _id: 2,
        type: "machine",
        name: "Máy trộn MT20",
        number: 2
      },]
    }, {
      name: "Tạo hạt",
      implementation_mill: "Xưởng tạo hạt",
      setupTime: "0.5h",
      hourProduction: 100,
      operating_cost: "100$",
      resources: [{
        _id: 1,
        type: "worker",
        name: "Nhân viên ép hạt",
        number: 1
      }, {
        _id: 2,
        type: "machine",
        name: "Máy tạo hạt MTH50",
        number: 2
      },]
    }, {
      name: "Đóng gói",
      implementation_mill: "Xưởng đóng gói",
      setupTime: "0.5h",
      hourProduction: 100,
      operating_cost: "100$",
      resources: [{
        _id: 1,
        type: "worker",
        name: "Nhân viên đóng gói sản phẩm",
        number: 1
      }]
    }],
    createdAt: "25/03/2024",
    status: 1
  }],
  manufacturingQuality: {
    errors: [
      {
        code: "LSP25032024",
        group: "Nhân lực",
        name: "Sai lệch hàm lượng hoạt chất",
        description: "Hàm lượng hoạt chất trong sản phẩm không nằm trong phạm vi cho phép",
        recognize: [
          "Kết quả kiểm nghiệm không đạt yêu cầu",
          "Khả năng ảnh hưởng đến hiệu quả và độ an toàn của thuốc"
        ],
        resolution: [
          "Đào tạo lại nhân viên về quy trình cân nguyên liệu và trộn nguyên liệu",
          "Nâng cao kỹ năng thao tác và tập trung của nhân viên"
        ],
        cause: "Nhân viên thao tác sai quy trình",
        reporter: {
          _id: 5,
          name: "Nguyến Tiến Đạt"
        },
        aql: "0.15%",
        created_at: "16/03/2024"
      }, {
        code: "LSP26032024",
        group: "Nhân lực",
        name: "Nhầm lẫn nguyên liệu",
        description: "Các nguyên liệu bị nhầm trong cùng một nhóm",
        recognize: [
          "Sản phẩm có màu sắc, mùi vị khác thường"
        ],
        resolution: [
          "Đào tạo lại nhân viên về cách nhận biết nguyên liệu",
          "Làm rõ nhãn mác nguyên liệu"
        ],
        cause: "Nhãn mác nguyên liệu không rõ ràng",
        reporter: {
          _id: 5,
          name: "Nguyến Tiến Đạt"
        },
        aql: "0.05%",
        created_at: "16/03/2024"
      }, {
        code: "LSP27032024",
        group: "Máy móc",
        name: "Vi sinh vật vượt quá giới hạn cho phép",
        description: "Số lượng vi sinh vật trong sản phẩm cao hơn mức cho phép",
        recognize: [
          "Kết quả kiểm nghiệm vi sinh vật không đạt yêu cầu"
        ],
        resolution: [
          "Bảo trì, bảo dưỡng thiết bị sản xuất định kỳ.",
          "Khử trùng thiết bị sản xuất bằng phương pháp hiệu quả"
        ],
        cause: "Thiết bị sản xuất không được khử trùng hoặc bảo trì đúng cách",
        reporter: {
          _id: 5,
          name: "Nguyến Tiến Đạt"
        },
        aql: "0.05%",
        created_at: "16/03/2024"
      }, {
        code: "LSP28032024",
        group: "Nguyên vật liệu",
        name: "Bao bì bị rách, nứt",
        description: "Bao bì sản phẩm không đảm bảo chất lượng",
        recognize: [
          "Bao bì sản phẩm bị rách, nứt"
        ],
        resolution: [
          "Kiểm tra chất lượng bao bì đầu vào",
        ],
        cause: "Nguyên liệu bao bì không đạt chất lượng",
        reporter: {
          _id: 5,
          name: "Nguyến Tiến Đạt"
        },
        aql: "0.05%",
        created_at: "16/03/2024"
      }, {
        code: "LSP30032024",
        group: "Nguyên vật liệu",
        name: "Sản phẩm bị biến màu",
        description: "Màu sắc của thuốc khác so với tiêu chuẩn",
        recognize: [
          "Không đạt kiểm tra thành phẩn sản phẩm"
        ],
        resolution: [
          "Kiểm tra chất lượng nguyên liệu đầu vào",
          "Bảo quản nguyên liệu và thành phẩm ở điều kiện phù hợp"
        ],
        cause: "Bảo quản nguyên liệu hoặc thành phẩm không đúng cách",
        reporter: {
          _id: 5,
          name: "Nguyến Tiến Đạt"
        },
        aql: "0.05%",
        created_at: "16/03/2024"
      }, {
        code: "LSP31032024",
        group: "Máy móc",
        name: "Viên thuốc bị nứt, vỡ",
        description: "Viên thuốc không nguyên vẹn",
        recognize: [
          "Sản phẩm bị nứt, vỡ"
        ],
        resolution: [
          "Bảo trì, bảo dưỡng máy móc sản xuất định kỳ",
          "Kiểm tra và điều chỉnh lực nén viên thuốc"
        ],
        cause: "Lực nén viên thuốc quá cao",
        reporter: {
          _id: 5,
          name: "Nguyến Tiến Đạt"
        },
        aql: "0.05%",
        created_at: "16/03/2024"
      }
    ],
    criterias: [{
      code: "TC25032024",
      name: "Tiêu chí kiểm định nén thuốc viên",
      operation: "Nén viên",
      products: [{
        _id: 1,
        name: "Thuốc viên TB200"
      }, {
        _id: 2,
        name: "Thuốc viên TB350"
      }
      ],
      checklist: [{
        name: "Lực nén",
        method: "Máy đo lực nén",
        acceptedValue: "100N"
      }, {
        name: "Độ dày",
        method: "Thước đo độ dày",
        acceptedValue: "3mm",
      }, {
        name: "Trọng lượng",
        method: "Cân",
        acceptedValue: "350mg"
      }, {
        name: "Độ tan rã",
        method: "Máy kiểm tra độ tan rã",
        acceptedValue: "15p"
      }
      ],
      creator: {
        _id: 5,
        name: "Nguyễn Tiến Đat"
      },
      created_at: "16/03/2024",
      status: 1,
    }, {
      code: "TC26032024",
      name: "Tiêu chí kiểm định chia nguyên liệu",
      operation: "Nén viên thuốc",
      products: [{
        _id: 1,
        name: "Thuốc viên TB200"
      }, {
        _id: 2,
        name: "Thuốc viên TB350"
      }
      ],
      checklist: [{
        name: "Kích thước hạt",
        method: "Máy sàng hạt",
        acceptedValue: "Phù hợp với tiêu chuẩn"
      }, {
        name: "Tỷ lệ phần trăm rây",
        method: "Máy sàng hạt",
        acceptedValue: "Phù hợp với tiêu chuẩn",
      },
      ],
      creator: {
        _id: 5,
        name: "Nguyễn Tiến Đat"
      },
      created_at: "16/03/2024",
      status: 1,
    }, {
      code: "TC27032024",
      name: "Tiêu chí kiểm định trộn nguyên liệu",
      operation: "Nén viên thuốc",
      products: [{
        _id: 1,
        name: "Thuốc viên TB200"
      }, {
        _id: 2,
        name: "Thuốc viên TB350"
      }
      ],
      checklist: [{
        name: "Đồng nhất",
        method: "Kiểm tra bằng mắt",
        acceptedValue: "Phân bố đều"
      }, {
        name: "Độ ẩm",
        method: "Máy đo độ ẩm",
        acceptedValue: "<= 5%",
      },
      ],
      creator: {
        _id: 5,
        name: "Nguyễn Tiến Đat"
      },
      created_at: "16/03/2024",
      status: 1,
    }, {
      code: "TC28032024",
      name: "Tiêu chí kiểm định bao phim thuốc",
      operation: "Bao phim",
      products: [{
        _id: 1,
        name: "Thuốc viên TB200"
      }, {
        _id: 2,
        name: "Thuốc viên TB350"
      }
      ],
      checklist: [{
        name: "Độ dày",
        method: "Máy đo độ dày",
        acceptedValue: "3mm - 5mm"
      }, {
        name: "Độ hòa tan",
        method: "Máy kiểm tra độ hòa tan",
        acceptedValue: "100S - 150S"
      },
      ],
      creator: {
        _id: 5,
        name: "Nguyễn Tiến Đat"
      },
      created_at: "16/03/2024",
      status: 1,
    }, {
      code: "TC29032024",
      name: "Tiêu chí kiểm định đóng gói sản phẩm",
      operation: "Đóng gói",
      products: [{
        _id: 1,
        name: "Thuốc viên TB200"
      }, {
        _id: 2,
        name: "Thuốc viên TB350"
      }
      ],
      checklist: [{
        name: "Chất lượng bao bì",
        method: "Kiểm tra bằng mắt",
        acceptedValue: "100% không nứt, vỡ"
      }, {
        name: "In ấn",
        method: "Kiểm tra bằng mắt",
        acceptedValue: "Rõ ràng, sắc nét"
      },
      ],
      creator: {
        _id: 5,
        name: "Nguyễn Tiến Đat"
      },
      created_at: "16/03/2024",
      status: 1,
    }, {
      code: "TC230032024",
      name: "Tiêu chí kiểm định thành phẩm",
      operation: "Kiểm tra thành phẩm",
      products: [{
        _id: 1,
        name: "Thuốc viên TB200"
      }, {
        _id: 2,
        name: "Thuốc viên TB350"
      }],
      checklist: [{
        name: "Hàm lượng hoạt chất",
        method: "HPLC, UV-Vis",
        acceptedValue: "Phù hợp với tiêu chuẩn"
      }, {
        name: "Độ pH",
        method: "Máy đo pH",
        acceptedValue: "Phù hợp với tiêu chuẩn"
      },
      ],
      creator: {
        _id: 5,
        name: "Nguyễn Tiến Đat"
      },
      created_at: "16/03/2024",
      status: 1,
    }],

    inspections: [{
      code: "PQC19030204",
      type: "QC công đoạn",
      manufacturing_command: {
        _id: "1",
        code: "LSX14032024",
        operation: "Nén viên",
      },
      products: [{
        _id: 1,
        name: "Thuốc viên TB200"
      }, {
        _id: 2,
        name: "Thuốc viên TB350"
      }],
      created_at: "17/03/2024",
      responsible: {
        _id: 5,
        name: "Nguyễn Tiến Đạt"
      },
      inspection_num: "120",
      passed_num: "115",
      error_num: "5",
      result: 1,
    }, {
      code: "PQC19030204",
      type: "QC công đoạn",
      manufacturing_command: {
        _id: "1",
        code: "LSX14032024",
        operation: "Đóng gói sản phẩm",
      },
      products: [{
        _id: 1,
        name: "Thuốc viên TB200"
      }, {
        _id: 2,
        name: "Thuốc viên TB350"
      }],
      created_at: "17/03/2024",
      responsible: {
        _id: 5,
        name: "Nguyễn Tiến Đạt"
      },
      inspection_num: "120",
      passed_num: "110",
      error_num: "10",
      result: 1,
    }, {
      code: "OQC19030204",
      type: "QC thành phẩm",
      manufacturing_command: {
        _id: "1",
        code: "LSX14032024",
        operation: "Kiểm tra thành phẩm",
      },
      products: [{
        _id: 1,
        name: "Thuốc viên TB200"
      }, {
        _id: 2,
        name: "Thuốc viên TB350"
      }],
      created_at: "17/03/2024",
      responsible: {
        _id: 5,
        name: "Nguyễn Tiến Đạt"
      },
      inspection_num: "120",
      passed_num: "120",
      error_num: "5",
      result: 1,
    }]
  }
}

export default sampleData
