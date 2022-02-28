import cloneDeep from 'lodash/cloneDeep';
export const configurationAnnualLeave = {
    configurationImport,
    templateImport,
};


function configurationImport(translate) {
    let config = {
        rowHeader: { // Số dòng tiêu đề của bảng
            description: translate('human_resource.rowHeader'),
            value: 1
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
        startDate: { // Họ và tên
            columnName: translate('human_resource.profile.start_day'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.start_day').toLowerCase()}`,
            value: translate('human_resource.profile.start_day')
        },
        startTime: { // Họ và tên
            columnName: translate('human_resource.annual_leave.table.start_date'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.annual_leave.table.start_date').toLowerCase()}`,
            value: translate('human_resource.annual_leave.table.start_date')
        },
        endDate: { // Họ và tên
            columnName: translate('human_resource.profile.end_date'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.profile.end_date').toLowerCase()}`,
            value:translate('human_resource.profile.end_date')
        },
        endTime: { // Họ và tên
            columnName: translate('human_resource.annual_leave.table.end_date'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.annual_leave.table.end_date').toLowerCase()}`,
            value: translate('human_resource.annual_leave.table.end_date')
        },
        totalHours: { // Họ và tên
            columnName: translate('human_resource.annual_leave.totalHours'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.annual_leave.totalHours').toLowerCase()}`,
            value: translate('human_resource.annual_leave.totalHours')
        },
        reason: { // Họ và tên
            columnName: translate('human_resource.annual_leave.table.reason'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.annual_leave.table.reason').toLowerCase()}`,
            value: translate('human_resource.annual_leave.table.reason')
        },
        status: { // Họ và tên
            columnName: translate('human_resource.status'),
            description: `${translate('human_resource.title_correspond')} ${translate('human_resource.status').toLowerCase()}`,
            value: translate('human_resource.status')
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

    let templateImport = {
        fileName: translate('human_resource.annual_leave.file_export_name'),
        dataSheets: [{
            sheetName: "Sheet1",
            sheetTitle: translate('human_resource.annual_leave.file_export_name'),
            tables: [{
                rowHeader: 1,
                columns: [
                { key: "STT", value: translate('human_resource.stt'), width: 7 },
                { key: "employeeNumber", value: translate('human_resource.staff_number') },
                { key: "fullName", value: translate('human_resource.staff_name'), width: 20 },
                { key: "organizationalUnit", value: translate('human_resource.unit'), width: 25 },
                { key: "startDate", value: translate('human_resource.profile.start_day') },
                { key: "startTime", value: translate('human_resource.annual_leave.table.start_date') },
                { key: "endDate", value: translate('human_resource.profile.end_date') },
                { key: "endTime", value: translate('human_resource.annual_leave.table.end_date') },
                { key: "totalHours", value: translate('human_resource.annual_leave.totalHours') },
                { key: "reason", value: translate('human_resource.annual_leave.table.reason') },
                { key: "status", value: translate('human_resource.status'), width: 25 },
                ],
                data: [{
                    STT: 1,
                    employeeNumber: 'MS20201002',
                    fullName: 'Nguyễn Văn An',
                    organizationalUnit: 'Phòng Kinh doanh',
                    startDate: new Date('2020-12-01'),
                    endDate: new Date('2020-12-02'),
                    totalHours: "",
                    startTime: "",
                    endTime: "",
                    reason: "Nghỉ ốm",
                    status: translate('human_resource.annual_leave.status.approved')
                }, {
                    STT: 2,
                    employeeNumber: 'MS20201003',
                    fullName: 'Nguyễn Văn Danh',
                    organizationalUnit: 'Phòng kinh doanh',
                    startDate: new Date('2020-11-20'),
                    endDate: new Date('2020-11-22'),
                    totalHours: 12,
                    startTime: '8:00 AM',
                    endTime: '12:00 AM',
                    reason: "Đi du lịch",
                    status: translate('human_resource.annual_leave.status.waiting_for_approval')
                },{
                    STT: 3,
                    employeeNumber: 'MS20201004',
                    fullName: 'Vũ Thị Cúc',
                    organizationalUnit: 'Phòng kinh doanh',
                    startDate: new Date('2020-12-02'),
                    endDate: new Date('2020-12-03'),
                    totalHours: "",
                    startTime: "",
                    endTime: "",
                    reason: "Về quê",
                    status: translate('human_resource.annual_leave.status.disapproved')
                }
            ]
            }, ]
        },
            {
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
        }
        ]
    }

    return templateImport;
}