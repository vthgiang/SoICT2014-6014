export const configurationEmployeeInfo = {
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 1
    },
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    employeeNumber: {
        columnName: "Mã số nhân viên",
        description: "Tên tiêu đề ứng với mã số nhân viên",
        value: "Mã số nhân viên"
    },
    employeeName: {
        columnName: "Họ và tên",
        description: "Tên tiêu để ứng với họ và tên",
        value: "Họ và tên"
    },
    mainSalary: {
        columnName: "Tiền lương chính",
        description: "Tên tiêu để ứng với tiền lương chính",
        value: "Tiền lương chính"
    },
    bonus: {
        columnName: "Lương thưởng khác",
        description: "Tên tiêu để ứng với lương thưởng khác",
        value: ["Thưởng đầu hộp SanFoVet", "Thưởng đầu hộp ViaVet", "Thưởng quý", "Lương CTV"],
    },
    file: {
        fileName: 'templateImportSalary',
        fileUrl: '/upload/human-resource/templateImport/templateImportSalary.xlsx'
    }
}