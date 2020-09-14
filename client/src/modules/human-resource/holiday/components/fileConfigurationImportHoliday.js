export const configurationHoliday = {
    configurationImport,
    templateImport,
};

function configurationImport() {
    let config = {
        rowHeader: {
            description: "Số dòng tiêu đề của bảng",
            value: 1
        },
        sheets: {
            description: "Tên các sheet",
            value: ["Sheet1"]
        },
        type: {
            columnName: "Thể loại",
            description: "Tên tiêu đề ứng với thể loại",
            value: "Thể loại"
        },
        startDate: {
            columnName: "Ngày bắt đầu",
            description: "Tên tiêu đề ứng với ngày bắt đầu",
            value: "Ngày bắt đầu"
        },
        endDate: {
            columnName: "Ngày kết thúc",
            description: "Tên tiêu để ứng với ngày kết thúc",
            value: "Ngày kết thúc"
        },
        description: {
            columnName: "Mô tả lịch nghỉ",
            description: "Tên tiêu để ứng với mô tả lịch nghỉ",
            value: "Mô tả "
        },
        file: {
            fileName: 'templateImportHoliday',
            fileUrl: '/upload/human-resource/templateImport/templateImportHoliday.xlsx'
        }
    };

    return config;

}

function templateImport(translate) {
    let templateImport = {
        fileName: translate('human_resource.holiday.file_name_export'),
        dataSheets: [{
            sheetName: "sheet1",
            sheetTitle: translate('human_resource.holiday.file_name_export'),
            tables: [{
                columns: [{
                        key: "STT",
                        value: translate('human_resource.stt'),
                        width: 7
                    },
                    {
                        key: 'type',
                        value: translate('human_resource.holiday.table.type'),
                        width: 35
                    },
                    {
                        key: "startDate",
                        value: translate('human_resource.holiday.table.start_date')
                    },
                    {
                        key: "endDate",
                        value: translate('human_resource.holiday.table.end_date')
                    },
                    {
                        key: "description",
                        value: translate('human_resource.holiday.table.describe_timeline'),
                        width: 35
                    },
                ],
                data: [{
                        STT: 1,
                        description: "Nghỉ quốc khánh 2/9",
                        endDate: new Date('2020-09-02'),
                        startDate: new Date('2020-09-02'),
                        type: translate('human_resource.holiday.holiday'),
                    },
                    {
                        STT: 2,
                        description: "Không cần nhiều nhân sự",
                        endDate: new Date('2020-09-23'),
                        startDate: new Date('2020-09-26'),
                        type: translate('human_resource.holiday.auto_leave'),
                    },
                ]
            }]
        }, ]
    };
    return templateImport;
};