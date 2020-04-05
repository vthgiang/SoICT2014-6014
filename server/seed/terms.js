exports.ROLE_TYPES= {
    ABSTRACT: "Abstract",
    POSITION: "Position",
    COMPANY_DEFINED: "Company-Defined"
}

exports.PREDEFINED_ROLES = {
    SYSTEM_ADMIN: {NAME: "System Admin", DESCRIPTION: "Quản lý các doanh nghiệp/công ty sử dụng dịch vụ"},
    SUPER_ADMIN: {NAME: "Super Admin", DESCRIPTION: "Super Admin của một doanh nghiệp/công ty. Chỉ có một Super Admin duy nhất, không thể xóa"},
    ADMIN: {NAME: "Admin", DESCRIPTION: "Admin của một doanh nghiệp/công ty. Có thể có nhiều Admin"},
    DEAN: {NAME: "Dean", DESCRIPTION: "Trưởng đơn vị trong một doanh nghiệp/công ty"},
    VICE_DEAN: {NAME: "Vice Dean", DESCRIPTION: "Phó đơn vị trong một doanh nghiệp/công ty"},
    EMPLOYEE: {NAME: "Employee", DESCRIPTION: "Nhân viên đơn vị trong một doanh nghiệp/công ty"},
}

exports.CATEGORY_LINKS = {
    COMMON: {NAME: "common", DESCRIPTION: "Các trang web dùng chung cho mọi người dùng"},
    RBAC_MANAGEMENT: {NAME: "rbac-management", DESCRIPTION: "Quản lý phân quyền, người dùng, cơ cấu tổ chức, phân trang, component"},
    KPI_MANAGEMENT: {NAME: "kpi-management", DESCRIPTION: "Quản lý KPI"},
    TASK_MANAGEMENT: {NAME: "task-management", DESCRIPTION: "Quản lý công việc"},
    EMPLOYEE_MANAGEMENT: {NAME: "employee-management", DESCRIPTION: "Quản lý nhân sự"},
    DOCUMENT_MANAGEMENT: {NAME: "document-management", DESCRIPTION: "Quản lý tài liệu biểu mẫu"},
    PROCESS_MANAGEMENT: {NAME: "process-management", DESCRIPTION: "Quản lý quy trình"},
}