export const configurationTimesheets = {
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 2
    },
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    employeeNumber: {
        columnName: "Mã nhân viên",
        description: "Tên tiêu đề ứng với mã số nhân viên",
        value: "Mã nhân viên"
    },
    employeeName: {
        columnName: "Họ và tên",
        description: "Tên tiêu để ứng với họ và tên",
        value: "Họ và tên"
    },
    dateOfMonth: {
        columnName: "Các ngày trong tháng",
        description: "Tên tiêu để ứng với các ngày trong tháng",
        value: "Các ngày trong tháng",
        colspan: 31
    },
    file: {
        fileName: 'templateImportTimesheets',
        fileUrl: '/upload/human-resource/templateImport/templateImportTimesheets.xlsx'
    }
}