export const configProcessTemplate = {
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    rowHeader: {
        description: "Số tiêu đề của bảng",
        value: 3,
    },
    processName: {
        columnName: "Tên mẫu",
        description: "Tên tiêu đề ứng với tên mẫu",
        value: "Tên mẫu"
    },
    processDescription: {
        columnName: "Mô tả",
        description: "Tên tiêu đề ứng với mô tả",
        value: "Mô tả"
    },
    viewer: {
        columnName: "Người được xem",
        description: "Tên tiêu đề ứng với người được xem",
        value: "Người được xem"
    },
    manager: {
        columnName: "Người quản lý",
        description: "Tên tiêu đề ứng với người quản lý",
        value: "Người quản lý"
    },
    xmlDiagram: {
        columnName: "Biểu đồ quy trình",
        description: "Tên tiêu đề ứng với biểu đồ quy trình dạng xml",
        value: "Biểu đồ quy trình"
    },
    tasks: {
        columnName: "Danh sách công việc trong quy trình",
        description: "Tên tiêu đề ứng với danh sách công việc trong quy trình",
        value: [
            "Mã công việc trong quy trình", "Tên mẫu", "Mô tả", "Đơn vị", "Độ ưu tiên",
            "Người thực hiện", "Người phê duyệt", "Người hỗ trợ", "Người quan sát",
            "Công thức tính điểm", "Danh sách hoạt động", "Danh sách thông tin"
        ]
    },
    file: {
        fileName: 'templateImportProcessTemplate',
        fileUrl: '/upload/task/processTemplateImportForm/templateImportProcessTemplate.xlsx'
    }
}

export const templateImportProcessTemplate = {
    fileName: "Mẫu import quy trình",
    dataSheets: [{
        sheetName: "Sheet1",
        sheetTitle: 'Danh sách mẫu quy trình',
        tables: [{
            rowHeader: 3,
            merges: [{
                key: "tasks",
                columnName: "Danh sách công việc",
                keyMerge: 'taskName',
                colspan: 17,
            }, {
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
                { key: "processName", value: "Tên mẫu" },
                { key: "processDescription", value: "Mô tả" },
                { key: "manager", value: "Người quản lý" },
                { key: "viewer", value: "Người quan sát" },
                { key: "xmlDiagram", value: "Biểu đồ quy trình" },

                { key: "taskName", value: "Tên công việc" },
                { key: "code", value: "Mã công việc trong quy trình" },
                { key: "taskDescription", value: "Mô tả công việc" },
                { key: "organizationalUnits", value: "Đơn vị" },
                { key: "priority", value: "Độ ưu tiên" },
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
                    processName: "Triển khai sản phẩm mới qquy trình",
                    processDescription: "Triển khai sản phẩm mới",
                    manager: "Giám đốc",
                    viewer: "Thành viên ban giám đốc",
                    xmlDiagram: "abc xyz",

                    tasks: [
                        {
                            taskName: "cv1",
                            taskDescription: "moota cv1",
                            code: "activity-1",
                            organizationalUnit: "Phòng kinh doanh",
                            priority: 1,
                            responsibleEmployees: ["pdp.vnist@gmail.com"],
                            accountableEmployees: ["nvd.vnist@gmail.com"],
                            consultedEmployees: ["nvd.vnist@gmail.com"],
                            informedEmployees: ["nvd.vnist@gmail.com"],
                            formula: 80,
                            taskActions: [
                                {
                                    name: "Xây dựng định mức kỹ thuật",
                                    description: "Phòng R&D xây dựng kế hoạch và thực hiện nghiên cứu sản phẩm, xây dựng Định mức kỹ thuật",
                                    mandatory: "true",
                                }, {
                                    name: "Khảo sát nguyên liệu",
                                    description: "Phòng Kế hoạch kho GSP khảo sát nguyên liệu, tài liệu nguyên liệu (CA)",
                                    mandatory: "true",
                                }, {
                                    name: "Thiết kế Maquette",
                                    description: "Phòng Marketing xây dựng kế hoạch và thực hiện thiết kế maquette",
                                    mandatory: "true",
                                }, {
                                    name: "Duyệt maquette",
                                    description: "Phòng Kinh doanh duyệt thiết kế maquette ",
                                    mandatory: "true",
                                }, {
                                    name: "Kiểm soát nội dung maquette",
                                    description: "Phòng Đảm bảo chất lượng kiểm soát nội dung trên maquette",
                                    mandatory: "true",
                                }, {
                                    name: "Chuyển TGĐ ký duyệt maquette",
                                    description: "Phòng Marketing chuyển maquette đã được Phòng Đảm bảo chất lượng kiểm soát nội dung cho TGĐ phê duyệt",
                                    mandatory: "true",
                                }, {
                                    name: "Gửi phòng Kế hoạch và nhà in bản maquette đã được TGĐ ký duyệt",
                                    description: "Phòng Marketing có trách nhiệm chuyển bản maquette đã được TGĐ ký duyệt cho nhà in và Phòng Kế hoạch",
                                    mandatory: "true",
                                }
                            ],
                            taskInformations: [
                                {
                                    name: "Số lượng nguyên liệu",
                                    description: "Số lượng nguyên liệu dùng để khảo sát",
                                    type: "Number",
                                    filledByAccountableEmployeesOnly: "true",
                                },
                            ],


                        }

                    ]
                },
            ]
        }]
    }]
}

// export const templateImportProcessTemplate = {
//     fileName: "Mẫu import mẫu công việc",
//     dataSheets: [{
//         sheetName: "Sheet1",
//         sheetTitle: 'Danh sách mẫu công việc',
//         tables: [{
//             rowHeader: 2,
//             merges: [{
//                 key: "taskActions",
//                 columnName: "Danh sách hoạt động",
//                 keyMerge: 'actionName',
//                 colspan: 3
//             }, {
//                 key: "taskInfomations",
//                 columnName: "Danh sách thông tin",
//                 keyMerge: 'infomationName',
//                 colspan: 4
//             }],
//             columns: [
//                 { key: "name", value: "Tên mẫu" },
//                 { key: "description", value: "Mô tả" },
//                 { key: "organizationalUnits", value: "Đơn vị" },
//                 { key: "priority", value: "Độ ưu tiên" },
//                 { key: "readByEmployees", value: "Người được xem" },
//                 { key: "responsibleEmployees", value: "Người thực hiện" },
//                 { key: "accountableEmployees", value: "Người phê duyệt" },
//                 { key: "consultedEmployees", value: "Người hỗ trợ" },
//                 { key: "informedEmployees", value: "Người quan sát" },
//                 { key: "formula", value: "Công thức tính điểm" },
//                 { key: "actionName", value: "Tên hoạt động" },
//                 { key: "actionDescription", value: "Mô tả hoạt động" },
//                 { key: "mandatory", value: "Bắt buộc" },
//                 { key: "infomationName", value: "Tên thông tin" },
//                 { key: "infomationDescription", value: "Mô tả thông tin" },
//                 { key: "type", value: "Kiểu dữ liệu" },
//                 { key: "filledByAccountableEmployeesOnly", value: "Chỉ quản lý được điền" }
//             ],
//             // Do ở file export, dữ liệu được đọc theo dòng nên đối với dữ liệu mảng (taskAction, taskInfomation), mỗi phần tử của mảng là 1 dòng
//             data: [
//                 {
//                     name: "Triển khai sản phẩm mới",
//                     description: "Triển khai sản phẩm mới",
//                     organizationalUnit: "Phòng kinh doanh",
//                     readByEmployees: ["Trưởng phòng kinh doanh", "Nhân viên phòng kinh doanh"],
//                     priority: 1,
//                     responsibleEmployees: ["pdp.vnist@gmail.com"],
//                     accountableEmployees: ["nvd.vnist@gmail.com"],
//                     consultedEmployees: ["nvd.vnist@gmail.com"],
//                     informedEmployees: ["nvd.vnist@gmail.com"],
//                     formula: 80,
//                     taskActions: [
//                         {
//                             name:"Xây dựng định mức kỹ thuật",
//                             description: "Phòng R&D xây dựng kế hoạch và thực hiện nghiên cứu sản phẩm, xây dựng Định mức kỹ thuật",
//                             mandatory: "true",
//                         }, {
//                             name:"Khảo sát nguyên liệu",
//                             description: "Phòng Kế hoạch kho GSP khảo sát nguyên liệu, tài liệu nguyên liệu (CA)",
//                             mandatory: "true",
//                         }, {
//                             name: "Thiết kế Maquette",
//                             description: "Phòng Marketing xây dựng kế hoạch và thực hiện thiết kế maquette",
//                             mandatory: "true",
//                         }, {
//                             name: "Duyệt maquette",
//                             description: "Phòng Kinh doanh duyệt thiết kế maquette ",
//                             mandatory: "true",
//                         }, {
//                             name: "Kiểm soát nội dung maquette",
//                             description: "Phòng Đảm bảo chất lượng kiểm soát nội dung trên maquette",
//                             mandatory: "true",
//                         }, {
//                             name: "Chuyển TGĐ ký duyệt maquette",
//                             description: "Phòng Marketing chuyển maquette đã được Phòng Đảm bảo chất lượng kiểm soát nội dung cho TGĐ phê duyệt",
//                             mandatory: "true",
//                         }, {
//                             name: "Gửi phòng Kế hoạch và nhà in bản maquette đã được TGĐ ký duyệt",
//                             description: "Phòng Marketing có trách nhiệm chuyển bản maquette đã được TGĐ ký duyệt cho nhà in và Phòng Kế hoạch",
//                             mandatory: "true",
//                         }
//                     ],
//                     taskInformations: [
//                         {
//                             name: "Số lượng nguyên liệu",
//                             description: "Số lượng nguyên liệu dùng để khảo sát",
//                             type: "Number",
//                             filledByAccountableEmployeesOnly: "true",
//                         }, 
//                     ],

//                 },
//             ]
//         }]
//     }]
// }
