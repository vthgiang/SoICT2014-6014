const apiTagNames = require("../../../../api-docs/apiTagName");
const openapi_taskPerformRoute = {
    "/performtask/tasks/{taskId}/": {
        "get": { // Lấy chi tiết công việc bằng id
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Get TaskPerform by id",
            "operationId": "getTaskPerformById",
            "parameters": [
                {
                    "name": "taskId",
                    "in": "path",
                    "description": "Nhập id công việc",
                    "required": true,
                    "schema": {"type": "string"}
                },
            ],
            "responses": {
                "200": {
                    "description": "get_task_by_id_success",
                    "content": {
                        "application/json": {
                            "schema": { "type": "object" }
                        }
                    }
                },
                "400": {
                    "description": "get_task_by_id_fail",
                    "content": {}
                }
            }
        }
    },
    "performtask/task-timesheet-logs": {
        "get": {
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy trạng thái bấm giờ hiện tại",
            "operationId": "getTask-timesheet-logs",
            "parameters": [
            ],
            "responses": {
                "200": {
                    "description": "get_timer_status_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_timer_status_fail",
                    "content": {}
                }
            }
        }
    },
    "/performtask/tasks/{taskId}/timesheet-logs": {
        "get": {
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy lịch sử bấm giờ",
            "operationId": "get-timesheet-logs",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "get_log_timer_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_log_timer_fail",
                    "content": {}
                }
            }
        }
    },
    "/performtask/tasks/{taskId}/timesheet-logs/start-timer": {
        "post": {
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Bắt đầu bấm giờ",
            "operationId": "start-timer",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin bấm giờ",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object"
                        }
                    },
                    "application/xml": {}
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "start_timer_success"
                },
                "400": {
                    "description": "start_timer_fail",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/performtask/tasks/{taskId}/timesheet-logs/stop-timer": {
        "post": {
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Kết thúc bấm giờ",
            "operationId": "stop-timer",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin kết thúc bấm giờ",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object"
                        }
                    },
                    "application/xml": {}
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "stop_timer_success"
                },
                "400": {
                    "description": "stop_timer_fail",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/performtask/tasks/{taskId}/task-actions/{actionId}": {
        "patch": {
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Update TaskPerform",
            "description": "update taskPerform",
            "operationId": "TaskPerform",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id công việc cần cập nhật",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id hành động cập nhật",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin hoạt động",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object"
                        }
                    },
                    "application/xml": {
                        "schema": {
                            "type": "object"
                        }
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "edit_task_action_success"
                },
                "400": {
                    "description": "edit_task_action_fail",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
        "delete": {
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Delete TaskPerform ",
            "description": "delete taskperform",
            "operationId": "deletetaskperform",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id công việc cần cập nhật",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id hành động cập nhật",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "delete_task_action_success"
                },
                "400": {
                    "description": "delete_task_action_fail",
                    "content": {}
                }
            }
        }
    },
    "/performtask/tasks/{taskId}/task-actions/{actionId}/comments": {
        "post": {
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Thêm mới bình luận cho hành động",
            "operationId": "CreateCommentOfTaskAction",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id hoạt động cần thêm comment",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin bình luận cho hoạt động",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object"
                        }
                    },
                    "application/xml": {
                        "schema": {
                            "type": "object"
                        }
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "create_action_comment_success"
                },
                "400": {
                    "description": "create_action_comment_fail",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/performtask/tasks/{taskId}/timesheet-logs/{timesheetlogId}": {
        "patch": { // Sửa lịch sửa bấm giờ
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Sửa lịch sửa bấm giờ",
            "operationId": "EditTimesheetLog",
            "parameters": [
                {
                    "name": "taskId",
                    "in": "path",
                    "description": "Nhập id công việc cần cập nhật",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "timesheetlogId",
                    "in": "path",
                    "description": "Nhập id bấm giờ",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin bấm giờ (acceptLog)",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "acceptLog": {
                                    "type": "number"
                                }
                            }
                        }
                    },
                    "application/xml": {
                        "schema": {
                            "type": "object"
                        }
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "edit_task_timesheetlog_success"
                },
                "400": {
                    "description": "edit_task_timesheetlog_fail",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        },
    },
    "/performtask/tasks/{taskId}/logs": {
        "get": {
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Lấy lịch sử log task",
            "operationId": "getTaskLog",
            "parameters": [
                {
                    "name": "taskId",
                    "in": "path",
                    "description": "Nhập id công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "responses": {
                "200": {
                    "description": "get_log_task_success",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object"
                            }
                        }
                    }
                },
                "400": {
                    "description": "get_log_task_fail",
                    "content": {}
                }
            }
        },
        "post": {
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Thêm mới lịch sử chỉnh sửa task",
            "operationId": "addTaskLog",
            "parameters": [
                {
                    "name": "taskId",
                    "in": "path",
                    "description": "Nhập id công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin lịch sử hoạt động (creator, title, description, createdAt)",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object"
                        }
                    },
                    "application/xml": {
                        "schema": {
                            "type": "object"
                        }
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "create_task_log_success"
                },
                "400": {
                    "description": "create_task_log_fail",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/performtask/tasks/{taskId}/files": {
        "post": {
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Upload tài liệu công việc",
            "operationId": "uploadFile",
            "parameters": [
                {
                    "name": "taskId",
                    "in": "path",
                    "description": "Nhập id công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin file (creator, description)",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object"
                        }
                    },
                    "multipart/form-data": {
                        "schema": {
                            "name": "files",
                            "type": "array",
                            "items": {
                                "type": "string",
                                "format": "binary"
                            }
                            
                        }
                    }
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "upload_files_success"
                },
                "400": {
                    "description": "upload_files_fail",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/performtask/tasks/{taskId}/task-actions/{actionId}": {
        "post": {
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Xác nhận hoạt động công việc",
            "operationId": "confirmAction",
            "parameters": [
                {
                    "name": "taskId",
                    "in": "path",
                    "description": "Nhập id công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "actionId",
                    "in": "path",
                    "description": "Nhập id hoạt động công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin user",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "userId": {"type" : "string"},
                            }
                        }
                    },
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "confirm_task_action_success"
                },
                "400": {
                    "description": "confirm_task_action_fail",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/performtask/tasks/{taskId}/task-actions": {
        "post": {
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Tạo hoạt động của công việc",
            "operationId": "createTaskAction",
            "parameters": [
                {
                    "name": "taskId",
                    "in": "path",
                    "description": "Nhập id công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin hoạt động (creator, description, index)",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "creator": {"type" : "string"},
                                "description": {"type" : "string"},
                                "index": {"type" : "string"},
                            }
                        }
                    },
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "create_task_action_success"
                },
                "400": {
                    "description": "create_task_action_fail",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/performtask/tasks/{taskId}/task-actions/{actionId}": {
        "patch": {
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Chỉnh sửa hoạt động công việc",
            "operationId": "editTaskAction",
            "parameters": [
                {
                    "name": "taskId",
                    "in": "path",
                    "description": "Nhập id công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "actionId",
                    "in": "path",
                    "description": "Nhập id hoạt động công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin ",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "dateCreatedAt": {"type" : "string"},
                                "type": {"type": "string"},
                                "description": {"type": "string"},
                            }
                        }
                    },
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "edit_task_action_success"
                },
                "400": {
                    "description": "edit_task_action_fail",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/performtask/tasks/{taskId}/task-actions/{actionId}": {
        "patch": {
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Chỉnh sửa hoạt động công việc",
            "operationId": "editTaskAction",
            "parameters": [
                {
                    "name": "taskId",
                    "in": "path",
                    "description": "Nhập id công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "actionId",
                    "in": "path",
                    "description": "Nhập id hoạt động công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin ",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "dateCreatedAt": {"type" : "string"},
                                "type": {"type": "string"},
                                "description": {"type": "string"},
                            }
                        }
                    },
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "edit_task_action_success"
                },
                "400": {
                    "description": "edit_task_action_fail",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
    "/performtask/tasks/{taskId}/task-actions/evaluation/all": {
        "patch": {
           "tags": [apiTagNames.TASK_PERFORM],
            "security": [{ ApiKeyAuth: [] }],
            "description": "Đánh giá tất cả hoạt động",
            "operationId": "evaluationAllAction",
            "parameters": [
                {
                    "name": "taskId",
                    "in": "path",
                    "description": "Nhập id công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
                {
                    "name": "actionId",
                    "in": "path",
                    "description": "Nhập id hoạt động công việc",
                    "required": true,
                    "schema": {
                        "type": "string"
                    }
                },
            ],
            "requestBody": {
                "description": "Nhập thông tin ",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "dateCreatedAt": {"type" : "string"},
                                "type": {"type": "string"},
                                "description": {"type": "string"},
                            }
                        }
                    },
                },
                "required": true
            },
            "responses": {
                "200": {
                    "description": "edit_task_action_success"
                },
                "400": {
                    "description": "edit_task_action_fail",
                    "content": {}
                }
            },
            "x-codegen-request-body-name": "body"
        }
    },
}

module.exports = openapi_taskPerformRoute;