export const configGood = {
  sheets: {
    description: 'Danh sách hàng hóa',
    value: ['Sheet1']
  },
  rowHeader: {
    description: 'Số tiêu đề của bảng',
    value: 1
  },
  code: {
    columnName: 'Mã hàng hóa',
    description: 'Mã hàng hóa',
    value: 'Mã hàng hóa'
  },
  name: {
    columnName: 'Tên hàng hóa',
    description: 'Tên hàng hóa',
    value: 'Tên hàng hóa'
  },
  category: {
    columnName: 'Danh mục',
    description: 'Danh mục',
    value: 'Danh mục'
  },
  baseUnit: {
    columnName: 'Đơn vị tính',
    description: 'Đơn vị tính',
    value: 'Đơn vị tính'
  },
  description: {
    columnName: 'Mô tả',
    description: 'Mô tả',
    value: 'Mô tả'
  },
  numberExpirationDate: {
    columnName: 'Số ngày hết hạn',
    description: 'Số ngày hết hạn',
    value: 'Số ngày hết hạn'
  },
  pricePerBaseUnit: {
    columnName: 'Giá bán theo đơn vị tính',
    description: 'Giá bán theo đơn vị tính',
    value: 'Giá bán theo đơn vị tính'
  },
  salesPriceVariance: {
    columnName: 'Giá bán khác',
    description: 'Giá bán khác',
    value: 'Giá bán khác'
  },
  sourceType: {
    columnName: 'Nguồn hàng hóa',
    description: 'Nguồn hàng hóa',
    value: 'Nguồn hàng hóa'
  },
  type: {
    columnName: 'Loại hàng hóa',
    description: 'Loại hàng hóa',
    value: 'Loại hàng hóa'
  }
}

export const importGoodTemplate = {
  fileName: 'Mẫu import hàng hóa',
  dataSheets: [
    {
      sheetName: 'Sheet1',
      sheetTitle: 'Mẫu import hàng hóa',
      tables: [
        {
          rowHeader: 1,
          columns: [
            { key: 'code', value: 'Mã hàng hóa' },
            { key: 'name', value: 'Tên hàng hóa' },
            { key: 'category', value: 'Danh mục' },
            { key: 'baseUnit', value: 'Đơn vị tính' },
            { key: 'description', value: 'Mô tả' },
            { key: 'numberExpirationDate', value: 'Số ngày hết hạn' },
            { key: 'pricePerBaseUnit', value: 'Giá bán theo đơn vị tính' },
            { key: 'salesPriceVariance', value: 'Giá bán khác' },
            { key: 'sourceType', value: 'Nguồn hàng hóa' },
            { key: 'type', value: 'Loại hàng hóa' }
          ],
          data: [
            {
              code: 'G00000001',
              name: 'Đường thốt nốt',
              category: '62a809315387be19102a9255',
              baseUnit: 'kg',
              description: 'Đường thốt nốt',
              numberExpirationDate: '1000',
              pricePerBaseUnit: '50000',
              salesPriceVariance: '40000',
              sourceType: '1',
              type: 'product'
            }
          ]
        }
      ]
    }
  ]
}
