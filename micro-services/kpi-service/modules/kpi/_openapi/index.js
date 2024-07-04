const apiTagNames = require("../../../api-docs/apiTagName");

const openapi_kpiRoute = {
    "/kpi/employee/creation/employee-kpi-sets" : {
        "get": { // Các phương thức GET của module KPI. Xem dòng description ở dưới để biết rõ hơn
            "tags": [apiTagNames.KPI],
            "description": "1. Lấy tập KPI cá nhân hiện tại. Tham số: {roleID, month}\n" +
                            "2. Lấy tất cả các tập KPI của 1 nhân viên theo thời gian cho trước\n" +
                            "3. Lấy tất cả tập KPI của tất cả nhân viên trong 1 mảng đơn vị\n" +
                            "4. Lấy tất cả tập KPI của tất cả nhân viên trong 1 mảng đơn vị theo tháng\n" +
                            "5. Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng\n" +
                            "6. Lấy tất cả EmployeeKpis thuộc các đơn vị con của đơn vị hiện tại\n" +
                            "7. Lấy các mục tiêu con của KPI hiện tại.",
            "security": [{ "ApiKeyAuth": [] }],
            "parameters": [
                { "$ref": '#/components/parameters/authTokenParam' },
                { "$ref": '#/components/parameters/fingerprintParam' },
                { "$ref": '#/components/parameters/currentRoleParam' },
                { "$ref": '#/components/parameters/currentPageParam' },
                {
                    "in": "query",
                    "name": "roleId",
                    "schema": { "type": "string" },
                    "description": "roleID của nhân viên", // Tham số trong query 1, 5, 6"
                }, {
                    "in": "query",
                    "name": "month",
                    "schema": { "type": "string" },
                    "example": "2022-01",
                    "description": "Tham số trong query 1, 5, 6"
                }, {
                    "in": "query",
                    "name": "organizationalUnitIds",
                    "schema": { "type": "string" },
                    "description": "Tham số trong query 2, 3"
                }, {
                    "in": "query",
                    "name": "userId",
                    "schema": { "type": "string" },
                    "description": "Tham số trong query 2"
                }, {
                    "in": "query",
                    "name": "startDate",
                    "schema": { "type": "string" },
                    "description": "Tham số trong query 2, 3",
                    "example": "2022-01"
                }, {
                    "in": "query",
                    "name": "endDate",
                    "schema": { "type": "string" },
                    "description": "Tham số trong query 2, 3",
                    "example": "2022-02"
                }, {
                    "in": "query",
                    "name": "unitKpiSetByEmployeeKpiSetDate",
                    "schema": { "type": "boolean" },
                    "description": "Nếu gọi query 4 hoặc 7, chọn true"
                }, {
                    "in": "query",
                    "name": "user",
                    "schema": { "type": "string" },
                    "description": "ID của user, dùng trong query 4"
                }, {
                    "in": "query",
                    "name": "department",
                    "schema": { "type": "string" },
                    "description": "ID của phòng ban, dùng trong query 4"
                }, {
                    "in": "query",
                    "name": "date",
                    "schema": { "type": "string" },
                    "description": "Ngày lấy KPI, dùng trong query 4",
                    "format": "date"
                }, {
                    "in": "query",
                    "name": "organizationalUnitId",
                    "schema": { "type": "string" },
                    "description": "Tham số trong query 5",
                }, {
                    "in": "query",
                    "name": "unitKpiSetByMonth",
                    "schema": { "type": "boolean" },
                    "description": "Nếu gọi query 5, chọn true"
                }, {
                    "in": "query",
                    "name": "employeeKpiInChildUnit",
                    "schema": { "type": "boolean" },
                    "description": "Nếu gọi query 6, chọn true"
                }, {
                    "in": "query",
                    "name": "organizationalUnitKpiSetId",
                    "schema": { "type": "string" },
                }, {
                    "in": "query",
                    "name": "type",
                    "schema": { "type": "string" },
                }
            ],
            "responses": {
                "200": {
                    "description": "Get employee kpi set successfully",
                    "content": {
                        "application/json": { "schema": {"type": "object"}}
                    }
                },
                "400": {
                    "description": "Get employee kpi set unsuccessfully",
                    "content": {}
                }
            }
        },



        "post": { // API khởi tạo KPI cá nhân
            "tags": [apiTagNames.KPI],
            "description": "Khởi tạo KPI cá nhân",
            "security": [{ "ApiKeyAuth": [] }],
            "parameters": [
                { "$ref": '#/components/parameters/authTokenParam' },
                { "$ref": '#/components/parameters/fingerprintParam' },
                { "$ref": '#/components/parameters/currentRoleParam' },
                { "$ref": '#/components/parameters/currentPageParam' },
                {
                    "in": "query",
                    "name": "organizationalUnit",
                    "schema": { "type": "string" },
                }, {
                    "in": "query",
                    "name": "approver",
                    "schema": { "type": "string" }
                }, {
                    "in": "query",
                    "name": "month",
                    "schema": { "type": "string" },
                    "example": "2022-01"
                },
            ],
            "responses": {
                "200": {
                    "description": "Get employee kpi set successfully",
                    "content": {
                        "application/json": { "schema": {"type": "object"}}
                    }
                },
                "400": {
                    "description": "Get employee kpi set unsuccessfully",
                    "content": {}
                }
            }
        },
    },
    










    "/kpi/employee/creation/employee-kpi-sets/${id}/edit" : {
        "post": { // Các API chỉnh sửa KPI
            "tags": [apiTagNames.KPI],
            "description": "1. Chỉnh sửa thông tin chung của KPI cá nhân\n" +
                            "2. Chỉnh sửa trạng thái của KPI cá nhân\n",
            "security": [{ "ApiKeyAuth": [] }],
            "parameters": [
                { "$ref": '#/components/parameters/authTokenParam' },
                { "$ref": '#/components/parameters/fingerprintParam' },
                { "$ref": '#/components/parameters/currentRoleParam' },
                { "$ref": '#/components/parameters/currentPageParam' },
                {
                    "in": "path",
                    "name": "id",
                    "schema": { "type": "string" },
                    "require": true,
                    "description": "nhập id user",
                }, {
                    "in": "query",
                    "name": "approver",
                    "schema": { "type": "string" }
                }, {
                    "in": "query",
                    "name": "creator",
                    "schema": { "type": "string" }
                }, {
                    "in": "query",
                    "name": "organizationUnit",
                    "schema": { "type": "string" }
                }, {
                    "in": "query",
                    "name": "status",
                    "schema": { "type": "integer" },
                    "enum": [0, 1],
                }
            ]
        }
    }
}

module.exports = openapi_kpiRoute;