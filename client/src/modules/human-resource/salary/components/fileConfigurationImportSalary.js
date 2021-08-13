import cloneDeep from "lodash/cloneDeep";

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
        orgUnit: {
            columnName: translate('human_resource.unit'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.unit').toLowerCase()}`,
            value: translate('human_resource.unit')
        },
        mainSalary: { // Tiền lương chính
            columnName: translate('human_resource.salary.table.main_salary'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.salary.table.main_salary').toLowerCase()}`,
            value: translate('human_resource.salary.table.main_salary')
        },
        bonus: { // Lương thưởng khác
            columnName: translate('human_resource.salary.other_salary'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.salary.other_salary').toLowerCase()}`,
            value: [
                "Trực",
                "Công tác phí",
                "hỗ trợ khác (các cột tiền ăn, xăng xe, điện thoại, đồng phục, phí gửi xe)",
                "Quà ốm đau",
                "Quà tai nạn",
                "Quà thai sản",
                "Phúng viếng lễ tang",
                "Quà cưới hỏi",
                "Quà tết dương lịch",
                "Quà tết nguyên đán",
                "Quà 1/5",
                "Quà 2/9",
                "Quà 20/10",
                "Quà 8/3",
                "Quà sinh nhật",
                "Quà 1/6",
                "Hỗ trợ nghỉ dưỡng sức",
                "Hỗ trợ hoạt động tập thể",
                "Phụ cấp chức vụ",
                "Phụ cấp trách nhiệm công việc",
                "Phụ cấp lưu động",
                "Thưởng doanh số vượt kế hoạch",
                "Thưởng đột xuất",
                "Thưởng định kỳ tháng",
                "Thưởng định kỳ quý",
                "Thưởng định kỳ năm"
            ],
        },
    };

    return config;
}

function templateImport(translate, deparmentList) {
    let departments = cloneDeep(deparmentList);

    const list = departments?.length ? departments.map((x, index) => ({
        STT: index + 1,
        unit: x?.name
    })) : [];
        console.log('list',list)
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
                    colspan: 26
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
                        key: "orgUnit",
                        value: translate('human_resource.unit'),
                        width: 20
                    },
                    {
                        key: "mainSalary",
                        value: translate('human_resource.salary.table.main_salary'),
                    },
                    {
                        key: 'bonus0',
                        value: 'Trực'
                    },
                    {
                        key: 'bonus1',
                        value: 'Công tác phí'
                    },
                    {
                        key: 'bonus2',
                        value: 'hỗ trợ khác (các cột tiền ăn, xăng xe, điện thoại, đồng phục, phí gửi xe)'
                    },
                    {
                        key: 'bonus3',
                        value: 'Quà ốm đau'
                    },
                    {
                        key: 'bonus4',
                        value: 'Quà tai nạn'
                    },
                    {
                        key: 'bonus5',
                        value: 'Quà thai sản'
                    },
                    {
                        key: 'bonus6',
                        value: 'Phúng viếng lễ tang'
                    },
                    {
                        key: 'bonus7',
                        value: 'Quà cưới hỏi'
                    },
                    {
                        key: 'bonus8',
                        value: 'Quà tết dương lịch'
                    },
                    {
                        key: 'bonus9',
                        value: 'Quà tết nguyên đán'
                    },
                    {
                        key: 'bonus10',
                        value: 'Quà 1/5'
                    },
                    {
                        key: 'bonus11',
                        value: 'Quà 2/9'
                    },
                    {
                        key: 'bonus12',
                        value: 'Quà 20/10'
                    },
                    {
                        key: 'bonus13',
                        value: 'Quà 8/3'
                    },
                    {
                        key: 'bonus14',
                        value: 'Quà sinh nhật'
                    },
                    {
                        key: 'bonus15',
                        value: 'Quà 1/6'
                    },
                    {
                        key: 'bonus16',
                        value: 'Hỗ trợ nghỉ dưỡng sức'
                    },
                    {
                        key: 'bonus17',
                        value: 'Hỗ trợ hoạt động tập thể'
                    },
                    {
                        key: 'bonus18',
                        value: 'Phụ cấp chức vụ'
                    },
                    {
                        key: 'bonus19',
                        value: 'Phụ cấp trách nhiệm công việc'
                    },
                    {
                        key: 'bonus20',
                        value: 'Phụ cấp lưu động'
                    },
                    {
                        key: 'bonus21',
                        value: 'Thưởng doanh số vượt kế hoạch'
                    },
                    {
                        key: 'bonus22',
                        value: 'Thưởng đột xuất'
                    },
                    {
                        key: 'bonus23',
                        value: 'Thưởng định kỳ tháng'
                    },
                    {
                        key: 'bonus24',
                        value: 'Thưởng định kỳ quý'
                    },
                    {
                        key: 'bonus25',
                        value: 'Thưởng định kỳ năm'
                    },
                ],
                data: [{
                    STT: 1,
                    employeeNumber: 'MS1256398',
                    fullName: "Nguyễn Văn A",
                    mainSalary: 15000000,
                    month: 5,
                    bonus0: 10000000,
                    bonus1: 5000000,
                    bonus2: 5000000,
                    bonus3: 5000000,
                    bonus4: 34000000,
                    bonus5: 5000000,
                    bonus6: 5000000,
                    bonus7: 5000000,
                    bonus8: 2000000,
                    bonus9: 5000000,
                    bonus10: 5000000,
                    bonus11: 5000000,
                    bonus12: 5000000,
                    bonus13: 9000000,
                    bonus14: 7000000,
                    bonus15: 6000000,
                    bonus16: 5000000,
                    bonus17: 5000000,
                    bonus18: 5000000,
                    bonus19: 5000000,
                    bonus20: 5000000,
                    bonus21: 5000000,
                    bonus22: 5000000,
                    bonus23: 9000000,
                    bonus24: 5000000,
                    bonus25: 5000000,
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
        }, {
            sheetName: "Đơn vị",
            sheetTitle: "Danh sách đơn vị hợp lệ",
            tables: [
                {
                    columns: [{
                        key: "STT",
                        value: translate('human_resource.stt'),
                        width: 7
                    }, {
                        key: "unit",
                        value: translate('human_resource.unit'),
                        width: 30
                    }],
                    data: list
                }
            ],
        }]
    }

    return templateImport;
}