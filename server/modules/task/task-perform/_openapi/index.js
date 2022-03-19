const openapi_taskPerformRoute = {
    "/performtask/tasks/{taskId}": {
        "get": { // Lấy chi tiết công việc bằng id
            "tags": [
                "TaskPerform"
            ],
            "description": "Get TaskPerform by id",
            "operationId": "getTaskPerformById",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "Nhập id công việc",
                    "required": true,
                    "schema": {"type": "string"}
                },
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
                }
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
            "tags": [
                "TaskPerform"
            ],
            "description": "Lấy trạng thái bấm giờ hiện tại",
            "operationId": "getTask-timesheet-logs",
            "parameters": [
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                }
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
            "tags": [
                "TaskPerform"
            ],
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
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                }
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
            "tags": [
                "TaskPerform"
            ],
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
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                }
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
            "tags": [
                "TaskPerform"
            ],
            "description": "Kết thúc bấm giờ",
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
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                }
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
            "tags": [
                "TaskPerform"
            ],
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
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                }
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
            "tags": [
                "TaskPerform"
            ],
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
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                }
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
            "tags": [
                "TaskPerform"
            ],
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
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                }
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
    "/performtask/tasks/:taskId/timesheet-logs/:timesheetlogId": {
        "patch": { // Sửa lịch sửa bấm giờ
            "tags": [
                "TaskPerform"
            ],
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
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                }
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
    "/performtask/tasks/:taskId/logs": {
        "get": {
            "tags": [
                "TaskPerform"
            ],
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
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                }
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
            "tags": [
                "TaskPerform"
            ],
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
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                }
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
    "/performtask/tasks/:taskId/files": {
        "post": {
            "tags": [
                "TaskPerform"
            ],
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
                {
                    "in": "header",
                    "name": "auth-token",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "fingerprint",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-role",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                },
                {
                    "in": "header",
                    "name": "current-page",
                    "schema": {
                        "type": "string"
                    },
                    "require": true
                }
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
}

module.exports = openapi_taskPerformRoute;