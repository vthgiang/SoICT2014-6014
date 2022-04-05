const apiTagNames = require("../../../../api-docs/apiTagName");
const openapi_taskManagementRoute = {
    "/task/tasks": {
        "get": { // Lấy công việc theo tùy chọn
            "tags": [apiTagNames.TASK_MANAGEMENT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "1. Lấy các công việc sắp hết hạn và quá hạn của nhân viên {type = 'all_by_user'}\n" +
                           "2. Lấy công việc theo vai trò người thực hiện chính {type = 'responsible'}\n" +
                           "3. Lấy công việc theo vai trò người tư vấn {type = 'consulted'}\n" +
                           "4. Lấy công việc theo vai trò người quan sát {type = 'informed'}\n" +
                           "5. Lấy công việc theo vai trò người tạo {type = 'creator'}\n" +
                           "6. Lấy công việc theo vai trò người phê duyệt {type = 'accountable'}\n" +
                           "7. Lấy công việc chọn theo user {type = 'all_role'}\n" +
                           "8. Lấy công việc chọn nhiều role  {type = 'choose_multi_role'}\n" +
                           "9. Tìm kiếm đơn vị theo 1 roleId  {type = 'paginated_task_by_unit'}\n" +
                           "10. Lấy tất cả task của organizationalUnit theo tháng hiện tại  {type = 'get_all_task_of_organizational_unit'}\n" +
                           "11. Lấy tất cả task của organizationalUnit trong một khoảng thời gian  {type = 'task_in_unit'}\n" +
                           "12. Lấy tất cả task của các đơn vị con của đơn vị hiện tại  {type = 'get_all_task_of_children_organizational_unit'}\n" +
                           "13. Lấy tất cả task khẩn cấp + task cần làm  {type = 'priority'}\n" +
                           "14. Lấy các công việc theo project  {type = 'project'}\n",
            "operationId": "getTasks",
            "parameters": [
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "query",
                    "name": "type",
                    "description": "Kiểu gọi api",
                    "required": true,
                    "schema": {"type": "string"}
                },
            ],
            "responses": {
                "200": {
                    "description": "get_task_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object","$ref": "#/components/schemas/Task" }
                        }
                    }
                },
                "400": {
                    "description": "get_task_failed",
                    "content": {}
                }
            }
        },
        "post": { // Tạo công việc mới
            "tags": [apiTagNames.TASK_MANAGEMENT],
            "description": "Tạo công việc mới",
            "operationId": "createTask",
            "parameters": [
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {"type": "string"},
                    "require": true
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin công việc",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/Task"}
                    },
                    "application/xml": {
                        "schema": {"$ref": "#/components/schemas/Task"}
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "create_task_success",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/Task"}
                        }
                    }
                },
                "400": {
                    "description": "create_task_failed",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/task/tasks/{taskId}/sub-tasks": {
        "get": { // Lấy ra công việc con
            "tags": [apiTagNames.TASK_MANAGEMENT],
            "description": "Lấy ra công việc con",
            "operationId": "getSubTasks",
            "parameters": [
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "path",
                    "name": "taskId",
                    "description": "Id của task cha",
                    "required": true,
                    "schema": {"type": "string"}
                },
            ],
            "responses": {
                "200": {
                    "description": "get_sub_task_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object","$ref": "#/components/schemas/Task" }
                        }
                    }
                },
                "400": {
                    "description": "get_sub_task_failed",
                    "content": {}
                }
            }
        }
    },
    "/task/tasks/{taskId}": {
        "delete": { // Xóa một hoặc nhiều công việc đã thiết lập
            "tags": [apiTagNames.TASK_MANAGEMENT],
            "description": "Xóa một hoặc nhiều công việc đã thiết lập",
            "operationId": "deleteTask",
            "parameters": [
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "path",
                    "name": "taskId",
                    "description": "Id của task",
                    "required": true,
                    "schema": {"type": "string"}
                },
            ],
            "responses": {
                "200": {
                    "description": "delete_task_success"
                },
                "400": {
                    "description": "delete_task_failed",
                    "content": {}
                }
            }
        }
    },
    "/task/task-evaluations": {
        "get": { // Lấy tất cả đánh giá công việc 
            "tags": [apiTagNames.TASK_MANAGEMENT],
            "description": "Lấy tất cả đánh giá công việc ",
            "operationId": "getTaskEvaluations",
            "parameters": [
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "query",
                    "name": "organizationalUnit",
                    "description": "Id đơn vị",
                    "required": true,
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "taskTemplate",
                    "description": "Id mẫu công việc",
                    "required": true,
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "status",
                    "description": "Trạng thái công việc",
                    "required": true,
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "startDate",
                    "description": "Ngày bắt đầu",
                    "required": true,
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "startDate",
                    "description": "Ngày kết thúc",
                    "required": true,
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "responsibleEmployees",
                    "description": "Danh sách người thực hiện",
                    "required": true,
                    "schema": {"type": "object"}
                },
                {
                    "in": "query",
                    "name": "accountableEmployees",
                    "description": "Danh sách người phê duyệt",
                    "required": true,
                    "schema": {"type": "object"}
                },
            ],
            "responses": {
                "200": {
                    "description": "get_task_evaluation_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object","$ref": "#/components/schemas/Task" }
                        }
                    }
                },
                "400": {
                    "description": "get_task_evaluation_failed",
                    "content": {}
                }
            }
        }
    },
    "/task/import": {
        "post": { // Lấy tất cả đánh giá công việc 
            "tags": [apiTagNames.TASK_MANAGEMENT],
            "description": "Lấy tất cả đánh giá công việc ",
            "operationId": "importTasks",
            "parameters": [
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "query",
                    "name": "organizationalUnit",
                    "description": "Id đơn vị",
                    "required": true,
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "taskTemplate",
                    "description": "Id mẫu công việc",
                    "required": true,
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "status",
                    "description": "Trạng thái công việc",
                    "required": true,
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "startDate",
                    "description": "Ngày bắt đầu",
                    "required": true,
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "startDate",
                    "description": "Ngày kết thúc",
                    "required": true,
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "responsibleEmployees",
                    "description": "Danh sách người thực hiện",
                    "required": true,
                    "schema": {"type": "array","items": {"type": "string"}}
                },
                {
                    "in": "query",
                    "name": "accountableEmployees",
                    "description": "Danh sách người phê duyệt",
                    "required": true,
                    "schema": {"type": "array","items": {"type": "string"}}
                },
            ],
            "responses": {
                "200": {
                    "description": "get_task_evaluation_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object","$ref": "#/components/schemas/Task" }
                        }
                    }
                },
                "400": {
                    "description": "get_task_evaluation_failed",
                    "content": {}
                }
            }
        }
    },
    "/task/analyse/user/{userId}": {
        "get": { // Lấy thông tin thống kê công việc của người dùng theo vai trò
            "tags": [apiTagNames.TASK_MANAGEMENT],
            "description": "Lấy thông tin thống kê công việc của người dùng theo vai trò",
            "operationId": "getTaskAnalyseOfUser",
            "parameters": [
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "query",
                    "name": "userId",
                    "description": "User Id",
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "type",
                    "description": "Kiểu ('piority' hoặc 'status')",
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "date",
                    "description": "Ngày",
                    "schema": {"type": "string"}
                },
            ],
            "responses": {
                "200": {
                    "description": "get_task_analyzed_of_user_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object","$ref": "#/components/schemas/Task" }
                        }
                    }
                },
                "400": {
                    "description": "get_task_analyzed_of_user_failed",
                    "content": {}
                }
            }
        }
    },
    "/task/organization-task-dashboard-chart-data": {
        "get": { // Lấy ra dữ liệu của các chart trong dashboard công việc đơn vị
            "tags": [apiTagNames.TASK_MANAGEMENT],
            "description": "Lấy ra dữ liệu của các chart trong dashboard công việc đơn vị",
            "operationId": "getOrganizationTaskDashboardChartData",
            "parameters": [
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "query",
                    "name": "general-task-chart",
                    "description": "Tổng quan công việc",
                    "schema": {"type": "object"}
                },
                {
                    "in": "query",
                    "name": "gantt-chart",
                    "description": "Gantt chart",
                    "schema": {
                        "type": "object", 
                        "properties": {
                            "status": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                        }
                    }
                },
                {
                    "in": "query",
                    "name": "employee-distribution-chart",
                    "description": "Đóng góp công việc",
                    "schema":  {
                        "type": "object", 
                        "properties": {
                            "status": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                        }
                    }
                },
                {
                    "in": "query",
                    "name": "in-process-unit-chart",
                    "description": "Tiến độ công việc",
                    "schema": {"type": "object"}
                },
                {
                    "in": "query",
                    "name": "task-results-domain-chart",
                    "description": "Miền kết quả công việc",
                    "schema":  {
                        "type": "object", 
                        "properties": {
                            "typePoint": {
                                "type": "number",
                                "default": 0
                            },
                        }
                    }
                },
                {
                    "in": "query",
                    "name": "task-status-chart",
                    "description": "Trạng thái công việc",
                    "schema": {"type": "object"}
                },
                {
                    "in": "query",
                    "name": "average-results-chart",
                    "description": "Kết quả trung bình công việc",
                    "schema": {
                        "type": "object", 
                        "properties": {
                            "typePoint": {
                                "type": "number",
                                "default": 0
                            },
                            "criteria": {
                                "type": "number",
                                "default": 0
                            },
                        }
                    }
                },
                {
                    "in": "query",
                    "name": "load-task-organization-chart",
                    "description": "Tải công việc đơn vị",
                    "schema": {"type": "object"}
                },
                {
                    "in": "query",
                    "name": "all-time-sheet-log-by-unit",
                    "description": "Thống kê bấm giờ",
                    "schema": {"type": "object"}
                },
                {
                    "in": "query",
                    "name": "common-params",
                    "description": "Các params chung",
                    "required": true,
                    "schema": {
                        "type": "object", 
                        "properties": {
                            "organizationalUnitId": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "startMonth": {"type": "string"},
                            "endMonth": {"type": "string"}
                        }
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "get_task_dashboard_data_success",
                    "content": {
                        "application/json": {
                            "schema": { 
                                "type": "array",
                                "items": {
                                    "type": "object"
                                } 
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_task_dashboard_data_failed",
                    "content": {}
                }
            }
        }
    },
    "/task/time-sheet": {
        "get": { // Lấy ra dữ liệu của các chart trong dashboard công việc đơn vị
            "tags": [apiTagNames.TASK_MANAGEMENT],
            "description": "Lấy lịch sử bấm giờ làm việc của người dùng theo từng tháng trong năm hoặc\n" +
                           "Lấy thống kê bấm giờ của tất cả các tài khoản trong hệ thống (lấy thóng kê tổng số bấm giờ hợp lệ)",
            "operationId": "getUserTimeSheet",
            "parameters": [
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "query",
                    "name": "month",
                    "description": "Tháng",
                    "schema": {"type": "number"}
                },
                {
                    "in": "query",
                    "name": "year",
                    "description": "Năm",
                    "schema": {"type": "number"}
                },
                {
                    "in": "query",
                    "name": "requireActions",
                    "description": "requireActions",
                    "schema": {"type": "string"}
                },
                
            ],
            "responses": {
                "200": {
                    "description": "get_user_time_sheet_success",
                    "content": {
                        "application/json": {
                            "schema": { 
                                "name": "timesheetLogs",
                                "type": "array",
                                "items": {
                                    "type": "object",
                                } 
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_user_time_sheet_failed",
                    "content": {}
                }
            }
        }
    },
    "/task/time-sheet/all": {
        "get": { // Lấy ra dữ liệu của các chart trong dashboard công việc đơn vị
            "tags": [apiTagNames.TASK_MANAGEMENT],
            "description": "Lấy lịch sử bấm giờ làm việc của người dùng theo từng tháng trong năm hoặc\n" +
                           "Lấy thống kê bấm giờ của tất cả các tài khoản trong hệ thống (lấy thóng kê tổng số bấm giờ hợp lệ)",
            "operationId": "getUserTimeSheet",
            "parameters": [
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {"type": "string"},
                    "require": true
                },
                {
                    "in": "query",
                    "name": "month",
                    "description": "Tháng",
                    "schema": {"type": "number"}
                },
                {
                    "in": "query",
                    "name": "year",
                    "description": "Năm",
                    "schema": {"type": "number"}
                },
                {
                    "in": "query",
                    "name": "rowLimit",
                    "description": "Số dòng tối thiểu",
                    "schema": {"type": "number"}
                },
                {
                    "in": "query",
                    "name": "timeLimit",
                    "description": "Thời gian tối thiểu",
                    "schema": {"type": "number"}
                },
                {
                    "in": "query",
                    "name": "page",
                    "description": "Trang",
                    "schema": {"type": "number"}
                },
                
            ],
            "responses": {
                "200": {
                    "description": "get_all_user_time_sheet_success",
                    "content": {
                        "application/json": {
                            "schema": { 
                                "name": "docs",
                                "type": "array",
                                "items": {
                                    "type": "object",
                                } 
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_all_user_time_sheet_failed",
                    "content": {}
                }
            }
        }
    },

}

module.exports = openapi_taskManagementRoute;