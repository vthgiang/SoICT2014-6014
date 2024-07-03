const apiTagNames = require("../../../../api-docs/apiTagName");
const openapi_taskManagementRoute = {
    "/task/tasks": {
        "get": { // Lấy công việc theo tùy chọn
            "tags": [apiTagNames.TASK_MANAGEMENT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "1. Lấy các công việc sắp hết hạn và quá hạn của nhân viên {type = 'all_by_user'}\n" +
                            "2. Lấy công việc theo vai trò người thực hiện chính {type = 'responsible'} ('perPage','number','user', 'unit','status', 'priority','special', 'name', 'startDate', 'endDate','aPeriodOfTime', 'startDateAfter', 'endDateBefore')\n" +
                            "3. Lấy công việc theo vai trò người tư vấn {type = 'consulted'} ('perPage','number','user', 'unit','status', 'priority','special', 'name', 'startDate', 'endDate','aPeriodOfTime', 'startDateAfter', 'endDateBefore')\n" +
                            "4. Lấy công việc theo vai trò người quan sát {type = 'informed'} ('perPage','number','user', 'unit','status', 'priority','special', 'name', 'startDate', 'endDate','aPeriodOfTime', 'startDateAfter', 'endDateBefore')\n" +
                            "5. Lấy công việc theo vai trò người tạo {type = 'creator'} ('perPage','number','user', 'unit','status', 'priority','special', 'name', 'startDate', 'endDate','aPeriodOfTime', 'startDateAfter', 'endDateBefore')\n" +
                            "6. Lấy công việc theo vai trò người phê duyệt {type = 'accountable'} ('perPage','number','user', 'unit','status', 'priority','special', 'name', 'startDate', 'endDate','aPeriodOfTime', 'startDateAfter', 'endDateBefore')\n" +
                           "7. Lấy công việc chọn theo user {type = 'all_role'}\n" +
                           "8. Lấy công việc chọn nhiều role  {type = 'choose_multi_role'} ('perPage','number','user','role', 'organizationalUnit','status', 'priority','special', 'name', 'startDate', 'endDate','aPeriodOfTime', 'responsibleEmployees', 'accountableEmployees', 'creatorEmployees','creatorTime', 'projectSearch','tags')\n" +
                           "9. Tìm kiếm đơn vị theo 1 roleId  {type = 'paginated_task_by_unit'} ('perPage','number','user', 'unit','status', 'priority','special', 'name', 'startDate', 'endDate','aPeriodOfTime', 'responsibleEmployees', 'accountableEmployees', 'creatorEmployees','isAssigned','organizationalUnitRole')\n" +
                           "10. Lấy tất cả task của organizationalUnit theo tháng hiện tại  {type = 'get_all_task_of_organizational_unit'} (roleId,organizationalUnitId, month )\n" +
                           "11. Lấy tất cả task của organizationalUnit trong một khoảng thời gian  {type = 'task_in_unit'} (organizationUnitId, startDateAfter, endDateBefore )\n" +
                           "12. Lấy tất cả task của các đơn vị con của đơn vị hiện tại  {type = 'get_all_task_of_children_organizational_unit'} (roleId, month,organizationalUnitId )\n" +
                           "13. Lấy tất cả task khẩn cấp + task cần làm  {type = 'priority'} (organizationUnitId, date)\n" +
                           "14. Lấy các công việc theo project  {type = 'project'}\n",
            "operationId": "getTasks",
            "parameters": [   
                {
                    "in": "query",
                    "name": "type",
                    "description": "Kiểu gọi api",
                    "required": true,
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "perPage",
                    "description": "Số hàng trong 1 trang",
                    "schema": {"type": "number"}
                },
                {
                    "in": "query",
                    "name": "number",
                    "description": "Số trang",
                    "schema": {"type": "number"}
                },
                {
                    "in": "query",
                    "name": "user",
                    "description": "User ID",
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "role",
                    "description": "Tên role (responsible, accoutable, consulted, informed, creator)",
                    "schema": {
                        "type": "array",
                        "items": {
                            "type" : "string"
                        }
                    }
                },
                {
                    "in": "query",
                    "name": "organizationalUnit",
                    "description": "Id các đơn vị",
                    "schema": {
                        "type": "array",
                        "items": {
                            "type" : "string"
                        }
                    }
                },
                {
                    "in": "query",
                    "name": "status",
                    "description": "Trạng thái công việc (inprocess, wait_for_approval,finished,delayed,canceled )",
                    "schema": {
                        "type": "array",
                        "items": {
                            "type" : "string"
                        }
                    }
                },
                {
                    "in": "query",
                    "name": "priority",
                    "description": "Độ ưu tiên (1,2,3,4,5)",
                    "schema": {
                        "type": "array",
                        "items": {
                            "type" : "string"
                        }
                    }
                },
                {
                    "in": "query",
                    "name": "special",
                    "description": "Đặc tính (stored, currentMonth, request_to_close)",
                    "schema": {
                        "type": "array",
                        "items": {
                            "type" : "string"
                        }
                    }
                },
                {
                    "in": "query",
                    "name": "name",
                    "description": "tên công việc",
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "startDate",
                    "description": "Ngày bắt đầu(YYYY-MM)",
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "endDate",
                    "description": "Ngày kết thúc(YYYY-MM)",
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "aPeriodOfTime",
                    "description": "aPeriodOfTime",
                    "schema": {"type": "string"},
                    "default": "false"
                },
                {
                    "in": "query",
                    "name": "responsibleEmployees",
                    "description": "Tên người phụ trách",
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "accountableEmployees",
                    "description": "Tên người phê duyệt",
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "creatorEmployees",
                    "description": "Tên người tạo công việc",
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "creatorTime",
                    "description": "Thời gian tạo (currentMonth, currentWeek)",
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "tags",
                    "description": "Tên tag",
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "projectSearch",
                    "description": "Tên project",
                    "schema": {"type": "string"}
                },
                {
                    "in": "query",
                    "name": "isAssigned",
                    "description": "isAssigned",
                    "schema": {"type": "string"},
                },
                {
                    "in": "query",
                    "name": "organizationalUnitRole",
                    "description": "organizationalUnitRole ('management', 'collabration')",
                    "schema": {"type": "string"},
                },
                {
                    "in": "query",
                    "name": "unit",
                    "description": "Id các đơn vị",
                    "schema": {
                        "type": "array",
                        "items": {
                            "type" : "string"
                        }
                    }
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
            "security": [{ ApiKeyAuth: [] }],
            "description": "Tạo công việc mới",
            "operationId": "createTask",
            "parameters": [ ],
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
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy ra công việc con",
            "operationId": "getSubTasks",
            "parameters": [
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
            "security": [{ ApiKeyAuth: [] }],
            "description": "Xóa một hoặc nhiều công việc đã thiết lập",
            "operationId": "deleteTask",
            "parameters": [
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
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy tất cả đánh giá công việc ",
            "operationId": "getTaskEvaluations",
            "parameters": [
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
    
    "/task/analyse/user/{userId}": {
        "get": { // Lấy thông tin thống kê công việc của người dùng theo vai trò
            "tags": [apiTagNames.TASK_MANAGEMENT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy thông tin thống kê công việc của người dùng theo vai trò",
            "operationId": "getTaskAnalyseOfUser",
            "parameters": [
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
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy ra dữ liệu của các chart trong dashboard công việc đơn vị",
            "operationId": "getOrganizationTaskDashboardChartData",
            "parameters": [
                {
                    "in": "query",
                    "name": "query",
                    "description": "Các tham số của chart",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "general-task-chart": {
                                        "type": "object",
                                    },
                                    "gantt-chart": {
                                        "type": "object", 
                                        "properties": {
                                            "status": {
                                                "type": "array",
                                                "items": {
                                                    "type": "string"
                                                }
                                            },
                                        }
                                    },
                                    "employee-distribution-chart": {
                                        "type": "object", 
                                        "properties": {
                                            "status": {
                                                "type": "array",
                                                "items": {
                                                    "type": "string"
                                                }
                                            },
                                        }
                                    },
                                    "in-process-unit-chart": {
                                        "type": "object",
                                    },
                                    "task-results-domain-chart": {
                                        "type": "object", 
                                        "properties": {
                                            "typePoint": {
                                                "type": "number",
                                                "default": 0
                                            },
                                        }
                                    },
                                    "task-status-chart": {
                                        "type": "object"
                                    },
                                    "average-results-chart": {
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
                                    },
                                    "load-task-organization-chart": {
                                        "type": "object"
                                    },
                                    "all-time-sheet-log-by-unit": {
                                        "type": "object"
                                    },
                                    "common-params": {
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
                                }
                            }
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
        "get": { // Lấy lịch sử bấm giờ làm việc
            "tags": [apiTagNames.TASK_MANAGEMENT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy lịch sử bấm giờ làm việc của người dùng theo từng tháng trong năm",
            "operationId": "getUserTimeSheet",
            "parameters": [
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
        "get": { // Lấy thống kê bấm giờ của tất cả các tài khoản trong hệ thống
            "tags": [apiTagNames.TASK_MANAGEMENT],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy thống kê bấm giờ của tất cả các tài khoản trong hệ thống (lấy thóng kê tổng số bấm giờ hợp lệ)",
            "operationId": "getAllUserTimeSheet",
            "parameters": [
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