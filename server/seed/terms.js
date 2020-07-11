exports.ROLE_TYPES= {
    ROOT: "Root",
    POSITION: "Position",
    COMPANY_DEFINED: "Company-Defined"
}

const ROOT_ROLES = {
    SYSTEM_ADMIN: {name: "System Admin", description: "Quản lý các doanh nghiệp/công ty sử dụng dịch vụ"},
    SUPER_ADMIN: {name: "Super Admin", description: "Super Admin của một doanh nghiệp/công ty. Chỉ có một Super Admin duy nhất, không thể xóa"},
    ADMIN: {name: "Admin", description: "Admin của một doanh nghiệp/công ty. Có thể có nhiều Admin"},
    DEAN: {name: "Dean", description: "Trưởng đơn vị trong một doanh nghiệp/công ty"},
    VICE_DEAN: {name: "Vice Dean", description: "Phó đơn vị trong một doanh nghiệp/công ty"},
    EMPLOYEE: {name: "Employee", description: "Nhân viên đơn vị trong một doanh nghiệp/công ty"},
}
exports.ROOT_ROLES = ROOT_ROLES;

const LINK_CATEGORY = {
    COMMON: { name: 'common', description: 'Các trang web dùng chung'},
    RBAC: { name: 'rbac-management', description: 'Quản lý phân quyền rbac'},
    KPI: { name: 'kpi-management', description: 'Quản lý kpi'},
    TASK: { name: 'task-management', description: 'Quản lý công việc'},
    HUMAN_RESOURCE: { name: 'employee-management', description: 'Quản lý nhân sự'},
    EDUCATION: { name: 'education-management', description: 'Quản lý đào tạo'},
    DOCUMENT: { name: 'document-management', description: 'Quản lý tài liệu, biểu mẫu'},
    PROCESS: { name: 'process-management', description: 'Quản lý quy trình'},
    ASSET: { name: 'asset-management', description: 'Quản lý tài sản'},
    REPORT: { name: 'report-management', description: 'Quản lý báo cáo'},
};
exports.LINK_CATEGORY = LINK_CATEGORY;

const LINKS = [
    {
        url: '/',
        description: `Trang chủ công ty`,
        category: LINK_CATEGORY.COMMON.name,
        roles: [
            ROOT_ROLES.SUPER_ADMIN.name,
            ROOT_ROLES.ADMIN.name,
            ROOT_ROLES.DEAN.name,
            ROOT_ROLES.VICE_DEAN.name,
            ROOT_ROLES.EMPLOYEE.name
        ]
    },
    {
        url: '/notifications',
        description: 'Thông báo',
        category: LINK_CATEGORY.COMMON.name,
        components: [
            {
                name: 'create-notification',
                description: 'Tạo thông báo mới',
                roles: [
                    ROOT_ROLES.ADMIN.name,
                    ROOT_ROLES.SUPER_ADMIN.name,
                ]
            }
        ],
        roles: [
            ROOT_ROLES.SUPER_ADMIN.name,
            ROOT_ROLES.ADMIN.name,
            ROOT_ROLES.DEAN.name,
            ROOT_ROLES.VICE_DEAN.name,
            ROOT_ROLES.EMPLOYEE.name,
        ]
    },




    {
        url: '/departments-management',
        description: 'Quản lý cơ cấu tổ chức',
        category: LINK_CATEGORY.RBAC.name,
        roles: [
            ROOT_ROLES.SUPER_ADMIN.name,
            ROOT_ROLES.ADMIN.name
        ]
    },
    {
        url: '/users-management',
        description: 'Quản lý người dùng',
        category: LINK_CATEGORY.RBAC.name,
        roles: [
            ROOT_ROLES.SUPER_ADMIN.name,
            ROOT_ROLES.ADMIN.name
        ]
    },
    {
        url: '/roles-management',
        description: 'Quản lý phân quyền',
        category: LINK_CATEGORY.RBAC.name,
        roles: [
            ROOT_ROLES.SUPER_ADMIN.name,
            ROOT_ROLES.ADMIN.name
        ]
    },
    {
        url: '/links-management',
        description: 'Quản lý trang web của công ty',
        category: LINK_CATEGORY.RBAC.name,
        roles: [
            ROOT_ROLES.SUPER_ADMIN.name,
            ROOT_ROLES.ADMIN.name
        ]
    },
    {
        url: '/components-management',
        description: 'Quản lý các thành phần UI trên trang web của công ty',
        category: LINK_CATEGORY.RBAC.name,
        roles: [
            ROOT_ROLES.SUPER_ADMIN.name,
            ROOT_ROLES.ADMIN.name
        ]
    },



    {
        url: '/documents-management',
        description: 'Quản lý tài liệu biểu mẫu',
        category: LINK_CATEGORY.DOCUMENT.name,
        roles: [
            ROOT_ROLES.SUPER_ADMIN.name,
            ROOT_ROLES.ADMIN.name
        ]
    },
    {
        url: '/documents',
        description: 'Tài liệu',
        category: LINK_CATEGORY.DOCUMENT.name,
        roles: [
            ROOT_ROLES.DEAN.name,
            ROOT_ROLES.VICE_DEAN.name,
            ROOT_ROLES.EMPLOYEE.name,
        ]
    },



    {
        url: '/hr-manage-holiday',
        description: 'Kế hoạch làm việc',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/hr-add-employee',
        description: 'Thêm mới nhân viên',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/hr-list-employee',
        description: 'Danh sách nhân viên',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/hr-manage-department',
        description: 'Quản lý nhân sự các đơn vị',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/hr-update-employee',
        description: 'Cập nhật thông tin cá nhân của nhân viên',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/hr-detail-employee',
        description: 'Thông tin cá nhân của nhân viên',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/hr-salary-employee',
        description: 'Quản lý lương nhân viên',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/hr-annual-leave',
        description: 'Quản lý nghỉ phép của nhân viên',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/hr-discipline',
        description: 'Quản lý khen thưởng, kỷ luật',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/hr-dashboard-employee',
        description: 'Dashboard nhân sự',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/hr-time-keeping',
        description: 'Quản lý chấm công',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },



    {
        url: '/hr-trainning-course',
        description: 'Quản lý đào tạo',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/hr-account',
        description: 'Thông tin tài khoản ',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/hr-training-plan',
        description: 'Kế hoạch đào tạo',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/hr-list-education',
        description: 'Chương trình đào tạo bắt buộc',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },




    // KPI
    {
        url: '/kpi-units/create',
        description: 'Khởi tạo KPI đơn vị',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.DEAN.name,
        ]
    },
    {
        url: '/kpi-units/dashboard',
        description: 'Dashboard KPI đơn vị',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.DEAN.name,
            ROOT_ROLES.VICE_DEAN.name,
            ROOT_ROLES.EMPLOYEE.name,
        ]
    },
    {
        url: '/kpi-units/manager',
        description: 'Quản lý KPI đơn vị',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.DEAN.name,
        ]
    },
    {
        url: '/kpi-member/manager',
        description: 'Quản lí kpi nhân viên',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.DEAN.name,
        ]
    },
    {
        url: '/kpi-member/dashboard',
        description: 'Dashboard KPI nhân viên',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.DEAN.name,
        ]
    },
    {
        url: '/kpi-personals/dashboard',
        description: 'DashBoard Kpi cá nhân',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.VICE_DEAN.name,
            ROOT_ROLES.EMPLOYEE.name,
        ]
    },
    {
        url: '/kpi-personals/create',
        description: 'Khởi tạo KPI cá nhân',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.VICE_DEAN.name,
            ROOT_ROLES.EMPLOYEE.name,
        ]
    },
    {
        url: '/kpi-personals/manager',
        description: 'Quản lí KPI cá nhân',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.VICE_DEAN.name,
            ROOT_ROLES.EMPLOYEE.name,
        ]
    },
    


    
    
    {
        url: '/task-template',
        description: 'Mẫu công việc',
        category: LINK_CATEGORY.TASK.name,
        components: [
            {
                name: 'create-task-template-button',
                description: 'Button thêm mới mẫu công việc',
                roles: [
                    ROOT_ROLES.DEAN.name,
                ]
            }
        ],
        roles: [
            ROOT_ROLES.DEAN.name,
            ROOT_ROLES.VICE_DEAN.name,
            ROOT_ROLES.EMPLOYEE.name,
        ]
    },
    {
        url: '/task-management',
        description: 'Xem danh sách công việc',
        category: LINK_CATEGORY.TASK.name,
        roles: [
            ROOT_ROLES.DEAN.name,
            ROOT_ROLES.VICE_DEAN.name,
            ROOT_ROLES.EMPLOYEE.name,
        ]
    },
    {
        url: '/task-management-dashboard',
        description: 'Dashboard công việc',
        category: LINK_CATEGORY.TASK.name,
        roles: [
            ROOT_ROLES.DEAN.name,
            ROOT_ROLES.VICE_DEAN.name,
            ROOT_ROLES.EMPLOYEE.name,
        ]
    },
    {
        url: '/task',
        description: 'Chi tiết công việc',
        category: LINK_CATEGORY.TASK.name,
        roles: [
            ROOT_ROLES.DEAN.name,
            ROOT_ROLES.VICE_DEAN.name,
            ROOT_ROLES.EMPLOYEE.name,
        ]
    },


    

    
    {
        url: '/dashboard-asset',
        description: 'DashBoard quản lý tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/manage-type-asset',
        description: 'Quản lý loại tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/manage-info-asset',
        description: 'Quản lý thông tin tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/manage-repair-asset',
        description: 'Quản lý sửa chữa - thay thế - nâng cấp tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/manage-distribute-asset',
        description: 'Quản lý cấp phát - điều chuyển - thu hồi tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/manage-depreciation-asset',
        description: 'Quản lý khấu hao tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/manage-recommend-procure',
        description: 'Quản lý đề nghị mua sắm tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/manage-recommend-distribute-asset',
        description: 'Quản lý đề nghị cấp phát tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },
    {
        url: '/manage-crash-asset',
        description: 'Quản lý sự cố tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.name,
        ]
    },

    {
        url: '/recommend-equipment-procurement',
        description: 'Đăng ký mua sắm tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.DEAN.name,
            ROOT_ROLES.VICE_DEAN.name,
            ROOT_ROLES.EMPLOYEE.name,
        ]
    },
    {
        url: '/recommmend-distribute-asset',
        description: 'Đăng ký cấp phát tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.DEAN.name,
            ROOT_ROLES.VICE_DEAN.name,
            ROOT_ROLES.EMPLOYEE.name,
        ]
    },
    {
        url: '/manage-assigned-asset',
        description: 'Quản lý tài sản được bàn giao',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.DEAN.name,
            ROOT_ROLES.VICE_DEAN.name,
            ROOT_ROLES.EMPLOYEE.name,
        ]
    },
];
exports.LINKS = LINKS;