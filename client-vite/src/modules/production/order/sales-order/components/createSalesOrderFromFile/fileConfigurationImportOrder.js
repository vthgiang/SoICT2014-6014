export const configSales = {
  sheets: {
    description: 'Danh sách đơn hàng',
    value: ['Sheet1']
  },
  rowHeader: {
    description: 'Số tiêu đề của bảng',
    value: 1
  },
  code: {
    columnName: 'Mã đơn hàng',
    description: 'Mã đơn hàng',
    value: 'Mã đơn hàng'
  },
  customerID: {
    columnName: 'Mã khách hàng',
    description: 'Mã khách hàng',
    value: 'Mã khách hàng'
  },
  customerName: {
    columnName: 'Tên khách hàng',
    description: 'Tên khách hàng',
    value: 'Tên khách hàng'
  },
  customerAddress: {
    columnName: 'Địa chỉ khách hàng',
    description: 'Địa chỉ khách hàng',
    value: 'Địa chỉ khách hàng'
  },
  customerPhone: {
    columnName: 'SĐT khách hàng',
    description: 'SĐT khách hàng',
    value: 'SĐT khách hàng'
  },
  productID: {
    columnName: 'Mã sản phẩm',
    description: 'Mã sản phẩm',
    value: 'Mã sản phẩm'
  },
  createdAt: {
    columnName: 'Ngày tạo đơn',
    description: 'Ngày tạo đơn',
    value: 'Ngày tạo đơn'
  },
  marketingID: {
    columnName: 'Mã chiến dịch',
    description: 'Mã chiến dịch',
    value: 'Mã chiến dịch'
  },
  productionCost: {
    columnName: 'Chi phí sản xuất',
    description: 'Chi phí sản xuất',
    value: 'Chi phí sản xuất'
  },
  pricePerBaseUnit: {
    columnName: 'Giá bán theo đơn vị tính',
    description: 'Giá bán theo đơn vị tính',
    value: 'Giá bán theo đơn vị tính'
  },
  quantity: {
    columnName: 'Số lượng',
    description: 'Số lượng',
    value: 'Số lượng'
  },
  priority: {
    columnName: 'Độ ưu tiên',
    description: 'Độ ưu tiên',
    value: 'Độ ưu tiên'
  },
  status: {
    columnName: 'Trạng thái',
    description: 'Trạng thái',
    value: 'Trạng thái'
  }
}

export const importSalesTemplate = {
  fileName: 'Mẫu import đơn hàng',
  dataSheets: [
    {
      sheetName: 'Sheet1',
      sheetTitle: 'Mẫu import đơn hàng',
      tables: [
        {
          rowHeader: 1,
          columns: [
            { key: 'code', value: 'Mã đơn hàng' },
            { key: 'productName', value: 'Tên sản phẩm' },
            { key: 'customerID', value: 'Mã khách hàng' },
            { key: 'customerName', value: 'Tên khách hàng' },
            { key: 'customerPhone', value: 'SĐT khách hàng' },
            { key: 'customerAddress', value: 'Địa chỉ khách hàng' },
            { key: 'productID', value: 'Mã sản phẩm' },
            { key: 'marketingID', value: 'Mã chiến dịch' },
            { key: 'productionCost', value: 'Chi phí sản xuất' },
            { key: 'pricePerBaseUnit', value: 'Giá bán theo đơn vị tính' },
            { key: 'quantity', value: 'Số lượng' },
            { key: 'priority', value: 'Độ ưu tiên' },
            { key: 'status', value: 'Trạng thái' },
            {KEY: 'createAt', value: 'Ngày tạo đơn'}
          ],
          data: [
            {
              code: 'DG0R4',
              productName: 'Đường thốt nốt',
              customerID: 'KH87',
              customerName: 'Tú phạm',
              customerPhone: '02758950485',
              customerAddress: 'Hai Bà Trưng, Hà Nội',
              productID: '05644',
              marketingID: '3',
              productionCost: '150605',
              pricePerBaseUnit: '267805',
              quantity: '3',
              priority: '1',
              status: '4',
              createdAt: '2023-06-20'
            }
          ]
        }
      ]
    }
  ]
}
