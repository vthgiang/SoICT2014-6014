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