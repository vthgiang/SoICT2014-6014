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
        columnName: "Tên mẫu quy trình",
        description: "Tên tiêu đề ứng với tên mẫu quy trình",
        value: "Tên mẫu quy trình"
    },
    processDescription: {
        columnName: "Mô tả mẫu quy trình",
        description: "Tên tiêu đề ứng với mô tả mẫu quy trình",
        value: "Mô tả mẫu quy trình"
    },
    manager: {
        columnName: "Người quản lý quy trình",
        description: "Tên tiêu đề ứng với người quản lý",
        value: "Người quản lý quy trình"
    },
    viewer: {
        columnName: "Người được xem quy trình",
        description: "Tên tiêu đề ứng với người được xem",
        value: "Người được xem quy trình"
    },
    xmlDiagram: {
        columnName: "Biểu đồ quy trình",
        description: "Tên tiêu đề ứng với biểu đồ quy trình dạng xml",
        value: "Biểu đồ quy trình"
    },
    taskName: {
        columnName: "Tên công việc",
        description: "Tên tiêu đề ứng với tên mẫu",
        value: "Tên công việc"
    },
    code: {
        columnName: "Mã công việc trong quy trình",
        description: "Tên tiêu đề ứng với mã công việc trong quy trình",
        value: "Mã công việc trong quy trình"
    },
    taskDescription: {
        columnName: "Mô tả công việc",
        description: "Tên tiêu đề ứng với mô tả công việc",
        value: "Mô tả công việc"
    },
    organizationalUnit: {
        columnName: "Đơn vị",
        description: "Tên tiêu đề ứng với đơn vị",
        value: "Đơn vị"
    },
    collaboratedWithOrganizationalUnits: {
        columnName: "Đơn vị phối hợp thực hiện công việc",
        description: "Tên tiêu đề ứng với đơn vị phối hợp thực hiện công việc",
        value: "Đơn vị phối hợp thực hiện công việc"
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
        columnName: "Người tư vấn",
        description: "Tên tiêu đề ứng với người tư vấn",
        value: "Người tư vấn"
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
}

export const templateImportProcessTemplate = {
    fileName: "Mẫu import quy trình",
    dataSheets: [{
        sheetName: "Sheet1",
        sheetTitle: 'Danh sách mẫu quy trình',
        tables: [{
            rowHeader: 3,
            merges: [{
                key: "generalInfoTask",
                columnName: "Thông tin chung",
                keyMerge: 'taskName',
                colspan: 11,
            }, {
                key: "taskActions",
                columnName: "Danh sách hoạt động",
                keyMerge: 'actionName',
                colspan: 3,
            }, {
                key: "taskInfomations",
                columnName: "Danh sách thông tin",
                keyMerge: 'infomationName',
                colspan: 4,
            }, {
                key: "tasks",
                columnName: "Danh sách công việc",
                keyMerge: 'generalInfoTask',
                colspan: 18,
            }],
            columns: [
                { key: "STT", value: "STT" },
                { key: "processName", value: "Tên mẫu quy trình" },
                { key: "processDescription", value: "Mô tả mẫu quy trình" },
                { key: "manager", value: "Người quản lý quy trình" },
                { key: "viewer", value: "Người được xem quy trình" },
                { key: "xmlDiagram", value: "Biểu đồ quy trình" },

                { key: "taskName", value: "Tên công việc" },
                { key: "code", value: "Mã công việc trong quy trình" },
                { key: "taskDescription", value: "Mô tả công việc" },
                { key: "organizationalUnit", value: "Đơn vị" },
                { key: "collaboratedWithOrganizationalUnits", value: "Đơn vị phối hợp thực hiện công việc" },
                { key: "priority", value: "Độ ưu tiên" },
                { key: "responsibleEmployees", value: "Người thực hiện" },
                { key: "accountableEmployees", value: "Người phê duyệt" },
                { key: "consultedEmployees", value: "Người tư vấn" },
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
                    processName: "Mẫu Quy trình Import mẫu",
                    processDescription: "Mẫu quy trình import mẫu",
                    manager: "Thành viên ban giám đốc",
                    viewer: "Thành viên ban giám đốc, Nhân viên phòng kinh doanh",
                    xmlDiagram: `<?xml version="1.0" encoding="UTF-8"?>
                    <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
                      <bpmn:process id="Process_1" isExecutable="false">
                        <bpmn:startEvent id="Event_1uie98m">
                          <bpmn:outgoing>Flow_0tpqfuv</bpmn:outgoing>
                        </bpmn:startEvent>
                        <bpmn:task id="Activity_0y1k81z" shapeName="Start" responsibleName="Nguyễn Văn Danh" accountableName="Vũ Thị Cúc">
                          <bpmn:incoming>Flow_0tpqfuv</bpmn:incoming>
                          <bpmn:outgoing>Flow_19ytczt</bpmn:outgoing>
                        </bpmn:task>
                        <bpmn:sequenceFlow id="Flow_0tpqfuv" sourceRef="Event_1uie98m" targetRef="Activity_0y1k81z" />
                        <bpmn:exclusiveGateway id="Gateway_0fivnpb" shapeName="Kiểm tra" responsibleName="Nguyễn Văn Danh">
                          <bpmn:incoming>Flow_19ytczt</bpmn:incoming>
                          <bpmn:outgoing>Flow_06w7nds</bpmn:outgoing>
                          <bpmn:outgoing>Flow_0m6ks29</bpmn:outgoing>
                        </bpmn:exclusiveGateway>
                        <bpmn:sequenceFlow id="Flow_19ytczt" name="link 1" sourceRef="Activity_0y1k81z" targetRef="Gateway_0fivnpb" />
                        <bpmn:task id="Activity_1jsvw26" shapeName="Sản xuất thuốc bột" responsibleName="Nguyễn Văn Danh" accountableName="Trần Văn Bình">
                          <bpmn:incoming>Flow_06w7nds</bpmn:incoming>
                          <bpmn:outgoing>Flow_0fnmbiw</bpmn:outgoing>
                        </bpmn:task>
                        <bpmn:sequenceFlow id="Flow_06w7nds" name="high-quality" sourceRef="Gateway_0fivnpb" targetRef="Activity_1jsvw26" />
                        <bpmn:endEvent id="Event_1q8gks8">
                          <bpmn:incoming>Flow_0fnmbiw</bpmn:incoming>
                          <bpmn:incoming>Flow_1oc92kq</bpmn:incoming>
                        </bpmn:endEvent>
                        <bpmn:sequenceFlow id="Flow_0fnmbiw" sourceRef="Activity_1jsvw26" targetRef="Event_1q8gks8" />
                        <bpmn:task id="Activity_0gy49ud" shapeName="Liên kết sản xuất thuốc bột" responsibleName="Nguyễn Việt Anh,Nguyễn Gia Huy" accountableName="Vũ Thị Cúc">
                          <bpmn:incoming>Flow_0m6ks29</bpmn:incoming>
                          <bpmn:outgoing>Flow_1oc92kq</bpmn:outgoing>
                        </bpmn:task>
                        <bpmn:sequenceFlow id="Flow_0m6ks29" name="low-quality" sourceRef="Gateway_0fivnpb" targetRef="Activity_0gy49ud" />`,

                    tasks: [
                        {
                            taskName: "Start",
                            taskDescription: "CV khởi tạo",
                            code: "Activity_0y1k81z",
                            organizationalUnit: "Phòng kinh doanh",
                            collaboratedWithOrganizationalUnits: "Phòng kinh doanh, Nhà máy sản xuất thuốc bột",
                            priority: 2,
                            responsibleEmployees: ["nvd.vnist@gmail.com"],
                            accountableEmployees: ["vtc.vnist@gmail.com"],
                            consultedEmployees: ["tvb.vnist@gmail.com"],
                            informedEmployees: [],
                            formula: "progress / (dayUsed / totalDay) - (numberOfFailedAction / (numberOfFailedAction + numberOfPassedAction)) * 100",
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
                        },
                        {
                            taskName: "Kiểm tra",
                            taskDescription: "Kiểm tra",
                            code: "Gateway_0fivnpb",
                            organizationalUnit: "Phòng kinh doanh",
                            collaboratedWithOrganizationalUnits: "Ban giám đốc",
                            priority: 1,
                            responsibleEmployees: ["nvd.vnist@gmail.com"],
                            accountableEmployees: [],
                            consultedEmployees: [],
                            informedEmployees: [],
                            formula: "progress / (dayUsed / totalDay)",
                            taskActions: [
                                {
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
                                }
                            ],
                            taskInformations: [
                                {
                                    name: "Số nợ cần thu",
                                    description: "Số lượng nguyên liệu dùng để khảo sát",
                                    type: "Number",
                                    filledByAccountableEmployeesOnly: "true",
                                },
                                {
                                    name: "Số nợ đã thu",
                                    description: "Số lượng nguyên liệu dùng để khảo sát",
                                    type: "Number",
                                    filledByAccountableEmployeesOnly: "true",
                                },
                            ],
                        },
                        {
                            taskName: "Sản xuất thuốc bột",
                            taskDescription: "Sản xuất thuốc bột",
                            code: "Activity_1jsvw26",
                            organizationalUnit: "Phòng kinh doanh",
                            collaboratedWithOrganizationalUnits: "Nhà máy sản xuất thuốc bột",
                            priority: 1,
                            responsibleEmployees: ["nvd.vnist@gmail.com"],
                            accountableEmployees: ["tvb.vnist@gmail.com"],
                            consultedEmployees: [],
                            informedEmployees: [],
                            formula: "progress / (dayUsed / totalDay) - (numberOfFailedAction / (numberOfFailedAction + numberOfPassedAction)) * 100",
                            taskActions: [
                                {
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
                                }
                            ],
                            taskInformations: [
                                {
                                    name: "Số nợ cần thu",
                                    description: "Số lượng nguyên liệu dùng để khảo sát",
                                    type: "Number",
                                    filledByAccountableEmployeesOnly: "true",
                                },
                                {
                                    name: "Số nợ đã thu",
                                    description: "Số lượng nguyên liệu dùng để khảo sát",
                                    type: "Number",
                                    filledByAccountableEmployeesOnly: "true",
                                },
                            ],
                        },
                        {
                            taskName: "Liên kết sản xuất thuốc bột",
                            taskDescription: "LIÊN KẾT SX",
                            code: "Gateway_0fivnpb",
                            organizationalUnit: "Nhà máy sản xuất thuốc bột",
                            collaboratedWithOrganizationalUnits: "Nhà máy sản xuất thuốc nước, Nhà máy sản xuất thực phẩm chức năng",
                            priority: 1,
                            responsibleEmployees: ["nguyenvietanh.vnist@gmail.com, nguyengiahuy.vnist@gmail.com"],
                            accountableEmployees: ["vtc.vnist@gmail.com"],
                            consultedEmployees: ["nhungnt.vnist@gmail.com"],
                            informedEmployees: [],
                            formula: "progress / (dayUsed / totalDay) - (numberOfFailedAction / (numberOfFailedAction + numberOfPassedAction)) * 100",
                            taskActions: [
                                {
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
                                }
                            ],
                            taskInformations: [
                                {
                                    name: "Số nợ cần thu",
                                    description: "Số lượng nguyên liệu dùng để khảo sát",
                                    type: "Number",
                                    filledByAccountableEmployeesOnly: "true",
                                },
                                {
                                    name: "Số nợ đã thu",
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