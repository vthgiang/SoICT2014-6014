export const configBinLocation = {
  sheets: {
    description: 'Tên các sheet',
    value: ['Sheet1']
  },
  rowHeader: {
    description: 'Số tiêu đề của bảng',
    value: 1
  },
  code: {
    columnName: 'Mã vị trí lưu trữ',
    description: 'Tên tiêu đề ứng với mã vị trí lưu trữ',
    value: 'Mã vị trí lưu trữ'
  },
  name: {
    columnName: 'Tên vị trí lưu trữ',
    description: 'Tên tiêu đề ứng với tên vị trí lưu trữ',
    value: 'Tên vị trí lưu trữ'
  },
  department: {
    columnName: 'Phòng ban',
    description: 'Tên tiêu đề ứng với phòng ban',
    value: 'Phòng ban'
  },
  status: {
    columnName: 'Trạng thái',
    description: 'Tên tiêu đề ứng với trạng thái',
    value: 'Trạng thái'
  },
  capacity: {
    columnName: 'Sức chứa',
    description: 'Tên tiêu đề ứng với sức chứa',
    value: 'Sức chứa'
  },
  stock: {
    columnName: 'Kho',
    description: 'Tên tiêu đề ứng với kho',
    value: 'Kho'
  },
  parent: {
    columnName: 'Vị trí lưu trữ cha',
    description: 'Tên tiêu đề ứng với vị trí lưu trữ cha',
    value: 'Vị trí lưu trữ cha'
  },
  unit: {
    columnName: 'Đơn vị tính',
    description: 'Tên tiêu đề ứng với đơn vị tính',
    value: 'Đơn vị tính'
  },
  description: {
    columnName: 'Mô tả',
    description: 'Tên tiêu đề ứng với mô tả',
    value: 'Mô tả'
  },
  users: {
    columnName: 'Người đang quản lý',
    description: 'Tên tiêu đề ứng với người đang quản lý',
    value: 'Người đang quản lý'
  }
}

export const importBinLocationTemplate = {
  fileName: 'Mẫu import vị trí lưu trữ',
  dataSheets: [
    {
      sheetName: 'Sheet1',
      sheetTitle: 'Danh sách vị trí lưu trữ',
      tables: [
        {
          rowHeader: 1,
          columns: [
            { key: 'code', value: 'Mã vị trí lưu trữ' },
            { key: 'name', value: 'Tên vị trí lưu trữ' },
            { key: 'department', value: 'Phòng ban' },
            { key: 'status', value: 'Trạng thái' },
            { key: 'capacity', value: 'Sức chứa' },
            { key: 'stock', value: 'Kho' },
            { key: 'parent', value: 'Vị trí lưu trữ cha' },
            { key: 'unit', value: 'Đơn vị tính' },
            { key: 'description', value: 'Mô tả' },
            { key: 'users', value: 'Người đang quản lý' }
          ],
          data: [
            {
              code: 'Bin000001',
              name: 'Tầng 1',
              department: '62a8092b5387be19102a8e9b',
              status: '1',
              capacity: '100000',
              stock: '62a809315387be19102a9274',
              parent: '',
              unit: 'Khối',
              description: '',
              users: '62a8092a5387be19102a8e00'
            }
          ]
        }
      ]
    }
  ]
}
