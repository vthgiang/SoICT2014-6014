export const configTaskTempalte = {
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    rowHeader: {
        description: "Số tiêu đề của bảng",
        value: 2
    },
    name: {
        columnName: "Tên mẫu",
        description: "Tên tiêu đề ứng với tên mẫu",
        value: "Tên mẫu"
    },
    description: {
        columnName: "Mô tả",
        description: "Tên tiêu đề ứng với mô tả",
        value: "Mô tả"
    },
    organizationalUnit: {
        columnName: "Đơn vị",
        description: "Tên tiêu đề ứng với đơn vị",
        value: "Đơn vị"
    },
    readByEmployees: {
        columnName: "Người được xem",
        description: "Tên tiêu đề ứng với người được xem",
        value: "Người được xem"
    },
    priority: {
        columnName: "Độ ưu tiên",
        description: "Tên tiêu đề ứng với độ ưu tiên",
        value: "Độ ưu tiên"
    },
    responsibleEmployees: {
        columnName: "Người thực hiện",
        description: "Tên tiêu đề ứng với người thực hiện",
        value: "Người thực hiện"
    },
    accountableEmployees: {
        columnName: "Người phê duyệt",
        description: "Tên tiêu đề ứng với người phê duyệt",
        value: "Người phê duyệt"
    },
    consultedEmployees: {
        columnName: "Người hỗ trợ",
        description: "Tên tiêu đề ứng với người hỗ trợ",
        value: "Người hỗ trợ"
    },
    informedEmployees: {
        columnName: "Người quan sát",
        description: "Tên tiêu đề ứng với người quan sát",
        value: "Người quan sát"
    },
    formula: {
        columnName: "Công thức tính điểm",
        description: "Tên tiêu đề ứng với công thức tính điểm",
        value: "Công thức tính điểm"
    },
    taskActions: {
        columnName: "Danh sách hoạt động",
        description: "Tên tiêu đề ứng với tên hoạt động",
        value: ["Tên hoạt động", "Mô tả hoạt động", "Bắt buộc"]
    },
    taskInformations: {
        columnName: "Danh sách thông tin",
        description: "Tên tiêu đề ứng với tên thông tin",
        value: ["Tên thông tin", "Mô tả thông tin", "Kiểu dữ liệu", "Chỉ quản lý được điền"]
    },
    file: {
        fileName: 'templateImportTaskTemplate',
        fileUrl: '/upload/task/taskTemplateImportForm/templateImportTaskTemplate.xlsx'
    }
}

export const templateImportTaskTemplate = {
    fileName: "Mẫu import mẫu công việc",
    dataSheets: [{
        sheetName: "Sheet1",
        sheetTitle: 'Danh sách mẫu công việc',
        tables: [{
            rowHeader: 2,
            merges: [{
                key: "taskActions",
                columnName: "Danh sách hoạt động",
                keyMerge: 'actionName',
                colspan: 3
            }, {
                key: "taskInfomations",
                columnName: "Danh sách thông tin",
                keyMerge: 'infomationName',
                colspan: 4
            }],
            columns: [
                { key: "name", value: "Tên mẫu" },
                { key: "description", value: "Mô tả" },
                { key: "organizationalUnits", value: "Đơn vị" },
                { key: "priority", value: "Độ ưu tiên" },
                { key: "readByEmployees", value: "Người được xem" },
                { key: "responsibleEmployees", value: "Người thực hiện" },
                { key: "accountableEmployees", value: "Người phê duyệt" },
                { key: "consultedEmployees", value: "Người hỗ trợ" },
                { key: "informedEmployees", value: "Người quan sát" },
                { key: "formula", value: "Công thức tính điểm" },
                { key: "actionName", value: "Tên hoạt động" },
                { key: "actionDescription", value: "Mô tả hoạt động" },
                { key: "mandatory", value: "Bắt buộc" },
                { key: "infomationName", value: "Tên thông tin" },
                { key: "infomationDescription", value: "Mô tả thông tin" },
                { key: "type", value: "Kiểu dữ liệu" },
                { key: "filledByAccountableEmployeesOnly", value: "Chỉ quản lý được điền" }
            ],
            // Do ở file export, dữ liệu được đọc theo dòng nên đối với dữ liệu mảng (taskAction, taskInfomation), mỗi phần tử của mảng là 1 dòng
            data: [
                {
                    name: "Mẫu 1",
                    description: "Mẫu công việc 1",
                    organizationalUnit: "Phòng kinh doanh",
                    readByEmployees: ["Trưởng phòng kinh doanh", "Nhân viên phòng kinh doanh"],
                    priority: 1,
                    responsibleEmployees: ["pdp.vnist@gmail.com"],
                    accountableEmployees: ["nvd.vnist@gmail.com"],
                    consultedEmployees: ["nvd.vnist@gmail.com"],
                    informedEmployees: ["nvd.vnist@gmail.com"],
                    formula: 80,
                    taskActions: [
                        {
                            name:"Hoạt động 1",
                            description: "Đây là hoạt động 1",
                            mandatory: "true",
                        }, {
                            name:"Hoạt động 2",
                            description: "Đây là hoạt động 2",
                            mandatory: "false",
                        }
                    ],
                    taskInformations: [
                        {
                            name: "Thông tin 1",
                            description: "Thông tin dữ liệu",
                            type: "Text",
                            filledByAccountableEmployeesOnly: "true",
                        }, {
                            name: "Thông tin 2",
                            description: "Thông tin số",
                            type: "Number",
                            filledByAccountableEmployeesOnly: "false",
                        }, {
                            name: "Thông tin 3",
                            description: "Thông tin ngày tháng",
                            type: "Date",
                            filledByAccountableEmployeesOnly: "true",
                        }
                    ],
                    
                },
                {
                    name: "Mẫu 2",
                    description: "Mẫu công việc 2",
                    organizationalUnit: "Phòng kinh doanh",
                    readByEmployees: ["Trưởng phòng kinh doanh", "Nhân viên phòng kinh doanh"],
                    priority: 1,
                    responsibleEmployees: ["pdp.vnist@gmail.com"],
                    accountableEmployees: ["nvd.vnist@gmail.com"],
                    consultedEmployees: ["nvd.vnist@gmail.com"],
                    informedEmployees: ["nvd.vnist@gmail.com"],
                    formula: 80,
                    taskActions: [
                        {
                            name:"Hoạt động 1",
                            description: "Đây là hoạt động 1",
                            mandatory: "true",
                        }, {
                            name:"Hoạt động 2",
                            description: "Đây là hoạt động 2",
                            mandatory: "false",
                        }
                    ],
                    taskInformations: [
                        {
                            name: "Thông tin 1",
                            description: "Thông tin dữ liệu",
                            type: "Text",
                            filledByAccountableEmployeesOnly: "true",
                        }, {
                            name: "Thông tin 2",
                            description: "Thông tin số",
                            type: "Number",
                            filledByAccountableEmployeesOnly: "false",
                        }, {
                            name: "Thông tin 3",
                            description: "Thông tin ngày tháng",
                            type: "Date",
                            filledByAccountableEmployeesOnly: "true",
                        }
                    ],
                    
                },
            ]
        }]
    }]
}
