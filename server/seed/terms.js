exports.ROLE_TYPES= {
    ROOT: "Root",
    POSITION: "Position",
    COMPANY_DEFINED: "Company-Defined"
}

exports.ROOT_ROLES = {
    SYSTEM_ADMIN: {NAME: "System Admin", DESCRIPTION: "Quản lý các doanh nghiệp/công ty sử dụng dịch vụ"},
    SUPER_ADMIN: {NAME: "Super Admin", DESCRIPTION: "Super Admin của một doanh nghiệp/công ty. Chỉ có một Super Admin duy nhất, không thể xóa"},
    ADMIN: {NAME: "Admin", DESCRIPTION: "Admin của một doanh nghiệp/công ty. Có thể có nhiều Admin"},
    DEAN: {NAME: "Dean", DESCRIPTION: "Trưởng đơn vị trong một doanh nghiệp/công ty"},
    VICE_DEAN: {NAME: "Vice Dean", DESCRIPTION: "Phó đơn vị trong một doanh nghiệp/công ty"},
    EMPLOYEE: {NAME: "Employee", DESCRIPTION: "Nhân viên đơn vị trong một doanh nghiệp/công ty"},
}

exports.CATEGORY_LINKS = [
    { name: 'common', description: 'Các trang web dùng chung'},
    { name: 'rbac-management', description: 'Quản lý phân quyền rbac'},
    { name: 'kpi-management', description: 'Quản lý kpi'},
    { name: 'task-management', description: 'Quản lý công việc'},
    { name: 'employee-management', description: 'Quản lý nhân sự'},
    { name: 'education-management', description: 'Quản lý đào tạo'},
    { name: 'document-management', description: 'Quản lý tài liệu, biểu mẫu'},
    { name: 'process-management', description: 'Quản lý quy trình'},
    { name: 'asset-management', description: 'Quản lý tài sản'},
];