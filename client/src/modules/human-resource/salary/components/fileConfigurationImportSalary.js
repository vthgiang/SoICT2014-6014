export const configurationSalary = {
    configurationImport,
    templateImport,
};

function configurationImport(translate) {
    let config = {
        rowHeader: { // Số dòng tiêu đề của bảng
            description: translate('human_resource.rowHeader'),
            value: 2
        },
        sheets: { // Tên các sheet
            description: translate('human_resource.sheets_name'),
            value: ["Sheet1"]
        },
        employeeNumber: { // Mã nhân viên
            columnName: translate('human_resource.staff_number'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.staff_number').toLowerCase()}`,
            value: translate('human_resource.staff_number')
        },
        employeeName: { // Họ và tên
            columnName: translate('human_resource.staff_name'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.staff_name').toLowerCase()}`,
            value: translate('human_resource.staff_name')
        },
        mainSalary: { // Tiền lương chính
            columnName: translate('human_resource.salary.table.main_salary'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.salary.table.main_salary').toLowerCase()}`,
            value: translate('human_resource.salary.table.main_salary')
        },
        bonus: { // Lương thưởng khác
            columnName: translate('human_resource.salary.other_salary'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.salary.other_salary').toLowerCase()}`,
            value: ["Thưởng đầu hộp SanFoVet", "Thưởng đầu hộp ViaVet"],
        },
    };

    return config;
}

function templateImport(translate) {
    let templateImport = {
        fileName: translate('human_resource.salary.file_name_export'),
        dataSheets: [{
            sheetName: "Sheet1",
            sheetTitle: translate('human_resource.salary.file_name_export'),
            tables: [{
                rowHeader: 2,
                merges: [{
                    key: "other",
                    columnName: translate('human_resource.salary.other_salary'),
                    keyMerge: 'bonus0',
                    colspan: 2
                }],
                columns: [{
                        key: "STT",
                        value: translate('human_resource.stt'),
                        width: 7
                    },
                    {
                        key: "employeeNumber",
                        value: translate('human_resource.staff_number')
                    },
                    {
                        key: "fullName",
                        value: translate('human_resource.staff_name'),
                        width: 20
                    },
                    {
                        key: "mainSalary",
                        value: translate('human_resource.salary.table.main_salary'),
                    },
                    {
                        key: 'bonus0',
                        value: 'Thưởng đầu hộp SanFoVet'
                    },
                    {
                        key: 'bonus1',
                        value: 'Thưởng đầu hộp ViaVet'
                    },
                ],
                data: [{
                    STT: 1,
                    employeeNumber: 'MS1256398',
                    fullName: "Nguyễn Văn A",
                    mainSalary: 15000000,
                    month: 5,
                    bonus0: 10000000,
                    bonus1: 5000000
                }, {
                    STT: 2,
                    employeeNumber: 'MS1256596',
                    fullName: "Nguyễn Thị C",
                    mainSalary: 15000000,
                    month: 5,
                    bonus0: 10000000,
                    bonus1: 5000000
                }]
            }, ]
        }, ]
    }

    return templateImport;
}