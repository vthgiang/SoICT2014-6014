export const configurationTimesheets = {
    configurationImport,
    templateImport,
};

function configurationImport(translate) {
    let config = {
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
    };
    return config;
};

function templateImport(translate) {
    let data = [{
            employee: {
                fullName: "Nguyễn Văn An",
                employeeNumber: "MS2015123"
            },
            month: "2020-07-01",
            workSession1: [true, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            workSession2: [false, true, true, true, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        },
        {
            employee: {
                fullName: "Nguyễn Văn Danh",
                employeeNumber: "MS2015124"
            },
            month: "2020-07-01",
            workSession1: [true, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            workSession2: [false, true, true, true, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        }
    ]
    let dataExport = [];
    data.map((x, index) => {
        let shifts1 = x.workSession1;
        let shifts2 = x.workSession2;
        let colShifts1 = {},
            colShifts2 = {};
        shifts1.forEach((y, key) => {
            if (y === true) {
                colShifts1 = {
                    ...colShifts1,
                    [`date${key + 1}`]: 'X'
                };
            } else {
                colShifts1 = {
                    ...colShifts1,
                    [`date${key + 1}`]: ''
                }
            }
        })
        shifts2.forEach((y, key) => {
            if (y === true) {
                colShifts2 = {
                    ...colShifts2,
                    [`date${key + 1}`]: 'X'
                };
            } else {
                colShifts2 = {
                    ...colShifts2,
                    [`date${key + 1}`]: ''
                }
            }
        })

        let row = [{
            merges: {
                STT: 2,
                employeeNumber: 2,
                fullName: 2,
            },
            STT: index + 1,
            fullName: x.employee ? x.employee.fullName : "",
            employeeNumber: x.employee ? x.employee.employeeNumber : "",
            space: translate('human_resource.timesheets.shifts1'),
            ...colShifts1,
        }, {
            STT: "",
            fullName: "",
            employeeNumber: "",
            space: translate('human_resource.timesheets.shifts2'),
            ...colShifts2,
        }, ]
        dataExport = dataExport.concat(row);
    });

    let addColumns = [];
    for (let n = 1; n <= 31; n++) {
        addColumns = [...addColumns, {
            key: `date${n}`,
            value: n,
            width: 4
        }]
    }

    let templateImport = {
        fileName: translate('human_resource.timesheets.file_name_export'),
        dataSheets: [{
            sheetName: "Sheet1",
            sheetTitle: translate('human_resource.timesheets.file_name_export'),
            tables: [{
                merges: [{
                    key: "other",
                    columnName: translate('human_resource.timesheets.date_of_month'),
                    keyMerge: 'date1',
                    colspan: 31
                }],
                rowHeader: 2,
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
                        key: "space",
                        value: "",
                        width: '10'
                    },
                    ...addColumns,
                ],
                data: dataExport
            }]
        }]
    };
    return templateImport;
}