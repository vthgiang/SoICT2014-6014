export const configurationSalary = {
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 2
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
        value: ["Thưởng đầu hộp SanFoVet", "Thưởng đầu hộp ViaVet"],
    },
    file: {
        fileName: 'templateImportSalary',
        fileUrl: '/upload/human-resource/templateImport/templateImportSalary.xlsx'
    }
}

export const templateImportSalary = {
    fileName: "Mẫu import bảng lương",
    dataSheets: [{
        sheetName: "Sheet1",
        sheetTitle: 'Bảng theo dõi lương thưởng',
        tables: [{
            rowHeader: 2,
            merges: [{
                key: "other",
                columnName: "Lương thưởng khác",
                keyMerge: 'bonus0',
                colspan: 2
            }],
            columns: [ 
                { key: "STT", value: "STT" },
                { key: "month", value: "Tháng" },
                { key: "year", value: "Năm" },
                { key: "employeeNumber", value: "Mã số nhân viên" },
                { key: "fullName", value: "Họ và tên" },
                { key: "organizationalUnits", value: "Phòng ban" },
                { key: "position", value: "Chức vụ" },
                { key: "gender", value: "Giới tính" },
                { key: "birthdate", value: "Ngày sinh" },
                { key: "status", value: "Tình trạng lao động" },
                { key: "mainSalary", value: "Tiền lương chính", },
                { key: 'bonus0', value: 'Thưởng đầu hộp SanFoVet'},
                { key: 'bonus1', value: 'Thưởng đầu hộp ViaVet'},
                { key: "total", value: "Tổng lương",},
            ],
            data: [{
                STT: 1,
                employeeNumber: 'MS1256398',
                fullName: "Nguyễn Văn A",
                mainSalary: 15000000,
                birthdate: new Date("1995-12-10"),
                status: "Đang làm việc",
                gender: "Nam",
                organizationalUnits: 'Ban giám đốc',
                position: 'Giám đốc',
                total: 30000000,
                month: 5,
                year: 2020,
                bonus0: 10000000,
                bonus1: 5000000
            }, {
                STT: 2,
                employeeNumber: 'MS1256596',
                fullName: "Nguyễn Thị C",
                mainSalary: 15000000,
                birthdate: new Date("1989-5-25"),
                status: "Đang làm việc",
                gender: "Nam",
                organizationalUnits: 'Ban giám đốc',
                position: 'Phó giám đốc',
                total: 30000000,
                month: 5,
                year: 2020,
                bonus0: 10000000,
                bonus1: 5000000
            }]
        }, ]
    }, ]
}