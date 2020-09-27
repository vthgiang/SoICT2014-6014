export const configurationTimesheets = {
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
        dateOfMonth: { // Các ngày trong tháng
            columnName: translate('human_resource.timesheets.date_of_month'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.timesheets.date_of_month').toLowerCase()}`,
            value: translate('human_resource.timesheets.date_of_month'),
            colspan: 31
        },
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
            shift1: [true, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            shift2: [false, true, true, true, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            shift3: [true, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],

        },
        {
            employee: {
                fullName: "Nguyễn Văn Danh",
                employeeNumber: "MS2015124"
            },
            month: "2020-07-01",
            shift1: [true, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            shift2: [false, true, true, true, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            shift3: [true, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        }
    ]
    let dataExport = [];
    data.map((x, index) => {
        let shifts1 = x.shift1;
        let shifts2 = x.shift2;
        let shifts3 = x.shift3;
        let colShifts1 = {},
            colShifts2 = {},
            colShifts3 = {};
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
        });
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
        });
        shifts3.forEach((y, key) => {
            if (y === true) {
                colShifts3 = {
                    ...colShifts3,
                    [`date${key + 1}`]: 'X'
                };
            } else {
                colShifts3 = {
                    ...colShifts3,
                    [`date${key + 1}`]: ''
                }
            }
        })

        let row = [{
                merges: {
                    STT: 3,
                    employeeNumber: 3,
                    fullName: 3,
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
            },
            {
                STT: "",
                fullName: "",
                employeeNumber: "",
                space: translate('human_resource.timesheets.shifts3'),
                ...colShifts3,
            },
        ]
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
            sheetTitleWidth: 35,
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