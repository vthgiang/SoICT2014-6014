// Config import attribute
export const configurationDelegationTemplate = {
  sheets: {
    description: 'Tên các sheet',
    value: ['Thông tin ví dụ']
  },
  rowHeader: {
    description: 'Số dòng tiêu đề của bảng',
    value: 1
  },
  name: {
    columnName: 'Tên ví dụ',
    description: 'Tên tiêu đề ứng với tên ví dụ',
    value: 'Tên ví dụ'
  },
  description: {
    columnName: 'Mô tả',
    description: 'Tên tiêu đề ứng với mô tả',
    value: 'Mô tả'
  }
}

// Dữliệu file export mẫu
export const importDelegationTemplate = {
  fileName: 'Mẫu import ví dụ',
  dataSheets: [
    {
      sheetName: 'Thông tin ví dụ',
      sheetTitle: 'Thông tin ví dụ',
      tables: [
        {
          rowHeader: 1,
          columns: [
            { key: 'name', value: 'Tên ví dụ' },
            { key: 'description', value: 'Mô tả' }
          ],
          data: [
            {
              name: 'VD1',
              description: 'VD1'
            },
            {
              name: 'VD2',
              description: 'VD2'
            }
          ]
        }
      ]
    }
  ]
}
