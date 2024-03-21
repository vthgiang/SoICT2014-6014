export const configDomain = {
  sheets: {
    description: 'Tên các sheet',
    value: ['Sheet1']
  },
  rowHeader: {
    description: 'Số tiêu đề của bảng',
    value: 1
  },
  name: {
    columnName: 'Tên lĩnh vực',
    description: 'Tên tiêu đề ứng với tên lĩnh vực',
    value: 'Tên lĩnh vực'
  },
  description: {
    columnName: 'Mô tả lĩnh vực',
    description: 'Tên tiêu đề ứng với mô tả lĩnh vực',
    value: 'Mô tả lĩnh vực'
  },
  parent: {
    columnName: 'Tên lĩnh vực cha',
    description: 'Tên tiêu đề ứng với tên lĩnh vực cha',
    value: 'Tên lĩnh vực cha'
  }
}
export const exportDomain = {
  fileName: 'Mẫu import lĩnh vực',
  dataSheets: [
    {
      sheetName: 'Sheet1',
      sheetTitle: 'Danh sách lĩnh vực',
      tables: [
        {
          rowHeader: 1,
          columns: [
            { key: 'name', value: 'Tên lĩnh vực', width: 40, vertical: 'middle', horizontal: 'center' },
            { key: 'description', value: 'Mô tả lĩnh vực', width: 60, vertical: 'middle', horizontal: 'center' },
            { key: 'parent', value: 'Tên lĩnh vực cha', width: 40, vertical: 'middle', horizontal: 'center' }
          ],
          styleColumn: {
            STT: {
              // Khoá tương ứng của tiêu đề bảng (key)
              vertical: 'middle',
              horizontal: 'center'
            },
            name: {
              // Khoá tương ứng của tiêu đề bảng (key)
              vertical: 'middle'
            },
            description: {
              // Khoá tương ứng của tiêu đề bảng (key)
              vertical: 'middle'
            }
          },
          data: [
            {
              name: 'Tài liệu thông tin công ty',
              description: 'Tài liệu thông tin công ty'
            },
            {
              name: 'Hồ sơ nhân sự',
              parent: 'Tài liệu thông tin công ty'
            }
          ]
        }
      ]
    }
  ]
}
