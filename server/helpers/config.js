const ROLE_TYPES = {
    ROOT: "Root",
    POSITION: "Position",
    COMPANY_DEFINED: "Company-Defined"
}

const ROOT_ROLES = {
    SYSTEM_ADMIN: {
        code: '@sys_ad',
        name: 'System Admin',
        description: 'Quản trị viên của toàn hệ thống'
    },

    SUPER_ADMIN: {
        code: '@super_ad',
        name: 'Super Admin',
        description: 'Quản trị cấp cao nhất của một công ty'
    },

    ADMIN: {
        code: '@ad',
        name: 'Admin',
        description: 'Quản trị viên của một công ty'
    },

    MANAGER: {
        code: '@manager',
        name: 'Manager',
        description: 'Trưởng đơn vị'
    },

    DEPUTY_MANAGER: {
        code: '@deputy_manager',
        name: 'Deputy Manager',
        description: 'Phó đơn vị'
    },

    EMPLOYEE: {
        code: '@employee',
        name: 'Employee',
        description: 'Nhân viên đơn vị'
    },
}

const LINK_CATEGORY = {
    COMMON: {
        name: 'common',
        description: 'Các trang web dùng chung'
    },
    RBAC: {
        name: 'rbac-management',
        description: 'Quản lý phân quyền rbac'
    },
    KPI: {
        name: 'kpi-management',
        description: 'Quản lý kpi'
    },
    TASK: {
        name: 'task-management',
        description: 'Quản lý công việc'
    },
    HUMAN_RESOURCE: {
        name: 'employee-management',
        description: 'Quản lý nhân sự'
    },
    EDUCATION: {
        name: 'education-management',
        description: 'Quản lý đào tạo'
    },
    DOCUMENT: {
        name: 'document-management',
        description: 'Quản lý tài liệu, biểu mẫu'
    },
    PROCESS: {
        name: 'process-management',
        description: 'Quản lý quy trình'
    },
    ASSET: {
        name: 'asset-management',
        description: 'Quản lý tài sản'
    },
    SUPPIES: {
        name: 'supplies-management',
        description: 'Quản lý vật tư tiêu hao'
    },
    REPORT: {
        name: 'report-management',
        description: 'Quản lý báo cáo'
    },
    WAREHOUSE: {
        name: 'stock-management',
        description: 'Quản lý kho'
    },
    ORDER: {
        name: "orders-management",
        description: "Quản lý đơn hàng"
    },
    CRM: {
        name: 'customer-management',
        description: 'Quản lý khách hàng'
    },
    PLAN: {
        name: "plans-management",
        description: "Quản lý kế hoạch sản xuất"
    },
    EXAMPLE: {
        name: "examples-management",
        description: "Quản lý ví dụ"
    },
    MANUFACTURING: {
        name: "manufacturing-management",
        description: "Quản lý sản xuất"
    },
    TRANSPORT: {
        name: "transport-management",
        description: "Quản lý vận chuyển"
    },
    PROJECT: {
        name: "projects-manager",
        description: "Quản lý dự án",
    },
    USERGUIDE: {
        name: "user_guide",
        description: "Hướng dẫn sử dụng",
    }
};

const COMPONENTS = [{
    name: 'create-notification',
    description: 'Tạo thông báo mới',
    roles: [
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.SUPER_ADMIN.name,
    ],
    links: [
        '/notifications'
    ]
},
{
    name: 'create-task-template-button',
    description: 'Button thêm mới mẫu công việc',
    roles: [
        ROOT_ROLES.MANAGER.name,
    ],
    links: [
        '/task-template'
    ]
},
{
    name: 'refresh-kpi-unit-in-dashboard',
    description: 'Button làm mới biểu đồ thống kê KPI giữa các đơn vị',
    roles: [
        ROOT_ROLES.MANAGER.name,
    ],
    links: [
        '/kpi-units/dashboard',
        '/dashboard-all-unit'
    ]
},
{
    name: 'create-task-process-button',
    description: 'Button thêm mới mẫu quy trình công việc',
    roles: [
        ROOT_ROLES.MANAGER.name,
    ],
    links: [
        '/task-process-template'
    ]
}, {
    name: 'create-asset',
    description: 'Button thêm mới tài sản',
    roles: [
        ROOT_ROLES.MANAGER.name,
    ],
    links: [
        '/employee-manage-info-asset',
        '/manage-info-asset'
    ],
}, {
    name: 'select-manufacturing-works',
    description: 'Select Box chọn nhà máy sản xuất',
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    links: [
        '/manage-work-schedule',
    ],
}, {
    name: 'create-manufacturing-plan',
    description: 'Button tạo kế hoạch sản xuất',
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
    ],
    links: [
        '/manage-manufacturing-plan',
    ],
},
{
    name: 'create-stock-button',
    description: 'Button thêm mới kho',
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    links: [
        '/stock-management'
    ]
},
{
    name: 'create-quote',
    description: 'Button thêm mới kho',
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    links: [
        '/manage-quote'
    ]
},
{
    name: 'create-sales-order',
    description: 'Button thêm mới kho',
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    links: [
        '/manage-sales-order'
    ]
},
{
    name: 'view-sales-order-dashboard',
    description: 'Button thêm mới kho',
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    links: [
        '/manage-sales-order-dashboard'
    ]
}, {
    name: 'view-pie-chart-purchasing',
    description: 'Xem biều đồ phiếu mua hàng theo trạng thái',
    roles: [
    ],
    links: [
        '/manufacturing-dashboard'
    ]
}, {
    name: 'create-transport-plan',
    description: 'Tạo kế hoạch vận chuyển',
    roles: [],
    links: [
        '/manage-transport-plan'
    ]
}, {
    name: 'button-import-task',
    description: 'Button import công việc',
    roles: [ROOT_ROLES.ADMIN.name],
    links: [
        '/task-management'
    ]
}];

const getComponentsInLink = (link) => {
    return COMPONENTS
        .filter(component => component.links.indexOf(link) !== -1)
        .map(component => component.name);
}

const LINKS = [{
    url: '/home',
    description: `Trang chủ công ty`,
    category: LINK_CATEGORY.COMMON.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name
    ],
    components: getComponentsInLink('/home')
},
{
    url: '/notifications',
    description: 'Thông báo',
    category: LINK_CATEGORY.COMMON.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/notifications')
},
{
    url: '/manage-configuration',
    description: 'Cấu hình hệ thống',
    category: LINK_CATEGORY.COMMON.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manage-configuration')
},

{
    url: '/system-management',
    description: 'Quản lý sao lưu - phục hồi dữ liệu',
    category: LINK_CATEGORY.RBAC.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/system-management')
},

{
    url: '/departments-management',
    description: 'Quản lý cơ cấu tổ chức',
    category: LINK_CATEGORY.RBAC.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/departments-management')
},
{
    url: '/users-management',
    description: 'Quản lý người dùng',
    category: LINK_CATEGORY.RBAC.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/users-management')
},
{
    url: '/roles-management',
    description: 'Quản lý phân quyền',
    category: LINK_CATEGORY.RBAC.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/roles-management')
},
{
    url: '/links-management',
    description: 'Quản lý trang web của công ty',
    category: LINK_CATEGORY.RBAC.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/links-management')
},
{
    url: '/apis-management',
    description: 'Quản lý API web của công ty',
    category: LINK_CATEGORY.RBAC.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/apis-management')
},
{
    url: '/apis-registration',
    description: 'Quản lý đăng ký sử dụng API của công ty',
    category: LINK_CATEGORY.RBAC.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/apis-registration')
},
{
    url: '/apis-registration-employee',
    description: 'Quản lý đăng ký sử dụng API của nhân viên',
    category: LINK_CATEGORY.RBAC.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER,
        ROOT_ROLES.DEPUTY_MANAGER,
        ROOT_ROLES.EMPLOYEE,
    ],
    components: getComponentsInLink('/apis-registration-employee')
},
{
    url: '/components-management',
    description: 'Quản lý các thành phần UI trên trang web của công ty',
    category: LINK_CATEGORY.RBAC.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/components-management')
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
    url: '/documents/organizational-unit',
    description: 'Quản lý tài liệu biểu mẫu của đơn vị',
    category: LINK_CATEGORY.DOCUMENT.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
    ]
},
{
    url: '/documents',
    description: 'Tài liệu',
    category: LINK_CATEGORY.DOCUMENT.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ]
},

{
    url: '/hr-manage-work-plan',
    description: 'Quản lý kế hoạch làm việc',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-manage-work-plan')
},
{
    url: '/hr-manage-field',
    description: 'Quản lý ngành nghề/ lĩnh vực',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-manage-field')
},
{
    url: '/hr-add-employee',
    description: 'Thêm mới nhân viên',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-add-employee')
},
{
    url: '/hr-list-employee',
    description: 'Quản lý thông tin nhân viên',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-list-employee')
},
{
    url: '/hr-manage-department',
    description: 'Quản lý nhân sự các đơn vị',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-manage-department')
},
{
    url: '/hr-update-employee',
    description: 'Cập nhật thông tin cá nhân của nhân viên',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/hr-update-employee')
},
{
    url: '/hr-detail-employee',
    description: 'Thông tin cá nhân của nhân viên',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/hr-detail-employee')
},
{
    url: '/hr-annual-leave-personal',
    description: 'Nghỉ phép',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/hr-annual-leave-personal')
},
{
    url: '/dashboard-personal',
    description: 'Bảng tin cá nhân',
    category: LINK_CATEGORY.COMMON.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/dashboard-personal')
},
{
    url: '/dashboard-unit',
    description: 'Bảng tin đơn vị',
    category: LINK_CATEGORY.COMMON.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
    ],
    components: getComponentsInLink('/dashboard-unit')
},
{
    url: '/dashboard-all-unit',
    description: 'Bảng tin đơn vị toàn công ty',
    category: LINK_CATEGORY.COMMON.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/dashboard-all-unit')
},
{
    url: '/hr-manage-leave-application',
    description: 'Quản lý đơn xin nghỉ đơn vị',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
    ],
    components: getComponentsInLink('/hr-manage-leave-application')
},
{
    url: '/hr-salary-employee',
    description: 'Quản lý lương nhân viên',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-salary-employee')
},
{
    url: '/hr-annual-leave',
    description: 'Quản lý nghỉ phép của nhân viên',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-annual-leave')
},
{
    url: '/hr-discipline',
    description: 'Quản lý khen thưởng, kỷ luật',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-discipline')
},
{
    url: '/hr-dashboard-employee',
    description: 'Dashboard nhân sự',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-dashboard-employee')
},
{
    url: '/hr-time-keeping',
    description: 'Quản lý chấm công',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-time-keeping')
},
{
    url: '/employees-infomation',
    description: 'Thông tin nhân viên',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
    ],
    components: getComponentsInLink('/employees-infomation')
},



{
    url: '/hr-trainning-course',
    description: 'Quản lý đào tạo',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-trainning-course')
},
{
    url: '/hr-account',
    description: 'Thông tin tài khoản ',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-account')
},
{
    url: '/hr-training-plan',
    description: 'Kế hoạch đào tạo',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-training-plan')
},
{
    url: '/hr-training-plan-employee',
    description: 'Kế hoạch đào tạo',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
        ROOT_ROLES.DEPUTY_MANAGER.name
    ],
    components: getComponentsInLink('/hr-training-plan-employee')
},
{
    url: '/hr-list-education',
    description: 'Chương trình đào tạo bắt buộc',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/hr-list-education')
},
{
    url: '/get-employee-dashboard-data',
    description: 'Lấy thông tin bảng tin nhân sự',
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.ADMIN.name
    ],
    component: getComponentsInLink('/hr-list-education')
}, 
{
    url: "/time-sheet-log/all",
    description: "Thống kê thời gian số lượng công việc và thời gian bấm giờ của toàn bộ nhân viên",
    category: LINK_CATEGORY.HUMAN_RESOURCE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/time-sheet-log/all')
},

// KPI
{
    url: '/kpi-units/create-for-admin',
    description: 'Khởi tạo KPI đơn vị',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/kpi-units/create-for-admin')
},
{
    url: '/kpi-units/create',
    description: 'Khởi tạo KPI đơn vị',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
    ],
    components: getComponentsInLink('/kpi-units/create')
},
{
    url: '/kpi-units/dashboard',
    description: 'Dashboard KPI đơn vị',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/kpi-units/dashboard')
},
{
    url: '/kpi-units/manager',
    description: 'Quản lý KPI đơn vị',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
    ],
    components: getComponentsInLink('/kpi-units/manager')
},
{
    url: '/kpi-units/statistic',
    description: 'Thống kê KPI đơn vị',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
    ],
    components: getComponentsInLink('/kpi-units/statistic')
},
{
    url: '/kpi-member/manager',
    description: 'Quản lí kpi nhân viên',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
    ],
    components: getComponentsInLink('/kpi-member/manager')
},
{
    url: '/kpi-member/dashboard',
    description: 'Dashboard KPI nhân viên',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
    ],
    components: getComponentsInLink('/kpi-member/dashboard')
},
{
    url: '/kpi-personals/dashboard',
    description: 'DashBoard Kpi cá nhân',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/kpi-personals/dashboard')
},
{
    url: '/kpi-personals/create',
    description: 'Khởi tạo KPI cá nhân',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/kpi-personals/create')
},
{
    url: '/kpi-personals/manager',
    description: 'Quản lí KPI cá nhân',
    category: LINK_CATEGORY.KPI.name,
    roles: [
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/kpi-personals/manager')
},





{
    url: '/task-template',
    description: 'Mẫu công việc',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/task-template')
},
{
    url: '/task-management',
    description: 'Xem danh sách công việc',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/task-management')
},
{
    url: '/task-management-unit',
    description: 'Xem danh sách công việc đơn vị',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.MANAGER.name
    ],
    components: getComponentsInLink('/task-management-unit')
},
{
    url: '/task-process-management',
    description: 'Danh sách quy trình công việc',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ]
},
{
    url: '/task-process-template',
    description: 'Mẫu quy trình công việc',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/task-process-template')

},
{
    url: '/process-template',
    description: 'Chi tiết mẫu quy trình công việc',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/process-template')

},
{
    url: '/process',
    description: 'Chi tiết quy trình công việc',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/process')

},
{
    url: '/task-management-dashboard',
    description: 'Dashboard công việc',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/task-management-dashboard')
},
{
    url: '/task-organization-management-dashboard',
    description: 'Dashboard công việc của đơn vị',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
    ],
    components: getComponentsInLink('/task-organization-management-dashboard')
},
{
    url: '/task',
    description: 'Chi tiết công việc',
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/task')
},





{
    url: '/dashboard-asset',
    description: 'DashBoard quản lý tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/dashboard-asset')
},
{
    url: '/manage-type-asset',
    description: 'Quản lý loại tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-type-asset')
},
{
    url: '/manage-info-asset',
    description: 'Quản lý thông tin tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-info-asset')
},
{
    url: '/manage-info-asset-lot',
    description: 'Quản lý thông tin lô tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-info-asset-lot')
},
{
    url: '/manage-maintainance-asset',
    description: 'Quản lý bảo trì tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-maintainance-asset')
},
{
    url: '/manage-usage-asset',
    description: 'Quản lý sử dụng tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        // ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-usage-asset')
},
{
    url: '/manage-depreciation-asset',
    description: 'Quản lý khấu hao tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-depreciation-asset')
},
{
    url: '/manage-incident-asset',
    description: 'Quản lý sự cố tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-incident-asset')
},
{
    url: '/manage-asset-purchase-request',
    description: 'Quản lý đề nghị mua sắm tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-asset-purchase-request')
},
{
    url: '/manage-asset-use-request',
    description: 'Quản lý đăng ký sử dụng tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-asset-use-request')
},

{
    url: '/employee-manage-info-asset',
    description: 'Quản lý thông tin tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/employee-manage-info-asset')
},
{
    url: '/employee-manage-asset-use-request',
    description: 'Quản lý đăng kí sử dụng tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/employee-manage-asset-use-request')
},


{
    url: '/asset-purchase-request',
    description: 'Đăng ký mua sắm tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/asset-purchase-request')
},
{
    url: '/asset-use-request',
    description: 'Đăng ký sử dụng tài sản',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/asset-use-request')
},
{
    url: '/manage-assigned-asset',
    description: 'Quản lý tài sản được bàn giao',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-assigned-asset')
},
{
    url: '/view-building-list',
    description: 'Xem danh sách mặt bằng',
    category: LINK_CATEGORY.ASSET.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/view-building-list')
},

/**
 * Quản lý vật tư tiêu hao
 */
{
    url: '/dashboard-supplies',
    description: 'Dashboard quản lý vật tư',
    category: LINK_CATEGORY.SUPPIES.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/dashboard-supplies')
},
{
    url: '/manage-supplies',
    description: 'Quản lý vật tư tiêu hao',
    category: LINK_CATEGORY.SUPPIES.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-supplies')
},
{
    url: '/manage-purchase-invoice',
    description: 'Quản lý hóa đơn mua vật tư',
    category: LINK_CATEGORY.SUPPIES.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-purchase-invoice')
},
{
    url: '/manage-allocation-history',
    description: 'Quản lý lịch sử cấp phát vật tư',
    category: LINK_CATEGORY.SUPPIES.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-allocation-history')
},
{
    url: '/manage-supplies-request',
    description: 'Quản lý yêu cầu mua sắm vật tư',
    category: LINK_CATEGORY.SUPPIES.name,
    roles: [
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/manage-supplies-request')
},
{
    url: '/supplies-purchase-request',
    description: 'Đăng ký mua vật tư',
    category: LINK_CATEGORY.SUPPIES.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/supplies-purchase-request')
},




{
    url: '/task-report',
    description: 'Quản lý báo cáo công việc',
    category: LINK_CATEGORY.REPORT.name,
    roles: [
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/task-report')
},

{
    url: '/dashboard-inventory',
    description: 'Bảng tin quản lý hàng tồn',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/dashboard-inventory')
},
{
    url: '/dashboard-bill',
    description: 'Bảng tin quản lý các phiếu',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
    ],
    components: getComponentsInLink('/dashboard-bill')
},
{
    url: '/stock-management',
    description: 'Quản lý thông tin kho',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/stock-management')
},
{
    url: '/bin-location-management',
    description: 'Quản lý thông tin lưu kho',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/bin-location-management')
},
{
    url: '/category-management',
    description: 'Quản lý danh mục hàng hóa',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/category-management')
},
{
    url: '/good-management',
    description: 'Quản lý thông tin hàng hóa',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/good-management')
},
{
    url: '/bill-management',
    description: 'Quản lý thông tin phiếu',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/bill-management')
},
{
    url: '/inventory-management',
    description: 'Quản lý hàng tồn kho',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/inventory-management')
},
{
    url: '/product-request-management/stock',
    description: 'Quản lý đề nghị',
    category: LINK_CATEGORY.WAREHOUSE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/product-request-management/stock')
},
{
    url: "/manage-sales-order",
    description: "Đơn hàng kinh doanh",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-sales-order'),
},
{
    url: "/manage-purchase-order",
    description: "Đơn mua hàng",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-purchase-order'),
},
{
    url: "/manage-quote",
    description: "Báo giá",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-quote'),
},
{
    url: "/manage-sales-order-dashboard",
    description: "Dashboard đơn kinh doanh",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-sales-order-dashboard'),
},
{
    url: "/manage-discount",
    description: "Khuyến mãi",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-discount'),
},
{
    url: "/manage-tax",
    description: "Thuế",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],

    components: getComponentsInLink('/manage-tax'),
},
{
    url: "/manage-sla",
    description: "Cam kết chất lượng",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-sla'),
},
{
    url: "/manage-payment",
    description: "Quản lý thu chi",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-payment'),
},
{
    url: '/product-request-management/order',
    description: 'Quản lý đề nghị',
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/product-request-management/order')
},
{
    url: "/manage-business-department",
    description: "Phòng ban liên quan quản lý đơn hàng",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        // ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        // ROOT_ROLES.MANAGER.name,
        // ROOT_ROLES.DEPUTY_MANAGER.name,
        // ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-business-department'),
},
{
    url: "/manage-bank-account",
    description: "Số tài khoản ngân hàng",
    category: LINK_CATEGORY.ORDER.name,
    roles: [
        // ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        // ROOT_ROLES.MANAGER.name,
        // ROOT_ROLES.DEPUTY_MANAGER.name,
        // ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-bank-account'),
},
{
    url: '/crm/dashboard',
    description: `Bảng tin quản lý khách hàng`,
    category: LINK_CATEGORY.CRM.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/crm/dashboard')
},
{
    url: '/crm/dashboardUnit',
    description: `Bảng tin đơn vị quản lý khách hàng`,
    category: LINK_CATEGORY.CRM.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
    ],
    components: getComponentsInLink('/crm/dashboardUnit')
},
{
    url: '/crm/customer',
    description: `Quản lý khách hàng`,
    category: LINK_CATEGORY.CRM.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/crm/customer')
}, {
    url: '/crm/loyal-customer',
    description: `Khách hàng thân thiết`,
    category: LINK_CATEGORY.CRM.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/crm/loyal-customer')
}, {
    url: '/crm/evaluation',
    description: `Đánh giá hoạt động CSKH`,
    category: LINK_CATEGORY.CRM.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,

    ],
    components: getComponentsInLink('/crm/evaluation')
},
{
    url: '/crm/group',
    description: `Quản lý nhóm khách hàng`,
    category: LINK_CATEGORY.CRM.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/crm/group')
},
{
    url: '/crm/care',
    description: `Chăm sóc khách hàng`,
    category: LINK_CATEGORY.CRM.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/crm/care')
},
{
    url: '/crm/generalConfiguration',
    description: `Cấu hình chung`,
    category: LINK_CATEGORY.CRM.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,

    ],
    components: getComponentsInLink('/crm/generalConfiguration')
},
{
    url: '/crm/crmUnitConfiguration',
    description: `Cấu hình đơn vị chăm sóc khách hàng`,
    category: LINK_CATEGORY.CRM.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,

    ],
    components: getComponentsInLink('/crm/crmUnitConfiguration')
},


{
    url: "/manage-plans",
    description: "Quản lý đơn hàng",
    category: LINK_CATEGORY.PLAN.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-plans'),
},
{
    url: "/manage-examples-1",
    description: "Quản lý Ví dụ 1",
    category: LINK_CATEGORY.EXAMPLE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-examples-1'),
},
{
    url: "/manage-examples-2",
    description: "Quản lý Ví dụ 2",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-examples-2'),
},
{
    url: "/manage-examples-hooks-1",
    description: "Quản lý Ví dụ Hooks 1",
    category: LINK_CATEGORY.EXAMPLE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-examples-hooks-1'),
},
{
    url: "/manage-examples-hooks-2",
    description: "Quản lý Ví dụ Hooks 2",
    category: LINK_CATEGORY.EXAMPLE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-examples-hooks-2'),
},
{
    url: "/manage-examples-3",
    description: "Quản lý Ví dụ 3",
    category: LINK_CATEGORY.EXAMPLE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-examples-3'),
},

{
    url: "/manage-examples-hooks-3",
    description: "Quản lý Ví dụ Hooks 3",
    category: LINK_CATEGORY.EXAMPLE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/manage-examples-hooks-3'),
},

{
    url: "/manage-manufacturing-plan",
    description: "Quản lý kế hoạch sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manage-manufacturing-plan'),
},
{
    url: "/manage-manufacturing-command",
    description: "Quản lý lệnh sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
    ],
    components: getComponentsInLink('/manage-manufacturing-command'),
},
{
    url: "/manage-work-schedule",
    description: "Quản lý lịch sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manage-work-schedule'),
},
{
    url: "/manage-purchasing-request",
    description: "Quản lý phiếu đề nghị mua hàng",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manage-purchasing-request'),
},
{
    url: "/manufacturing-dashboard",
    description: "Dashboard Quản lý sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manufacturing-dashboard'),
},
{
    url: "/analysis-manufacturing-performance",
    description: "Phân tích hiệu suất sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/analysis-manufacturing-performance'),
},
{
    url: "/manage-manufacturing-works",
    description: "Quản lý nhà máy sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manage-manufacturing-works'),
},
{
    url: "/manage-manufacturing-mill",
    description: "Quản lý xưởng sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manage-manufacturing-mill'),
},
{
    url: "/manage-manufacturing-lot",
    description: "Quản lý lô sản xuất",
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/manage-manufacturing-lot'),
},
{
    url: '/product-request-management/manufacturing',
    description: 'Quản lý đề nghị',
    category: LINK_CATEGORY.MANUFACTURING.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ],
    components: getComponentsInLink('/product-request-management/manufacturing')
},
// Quan li van chuyen transport
{
    url: "/manage-transport-requirement",
    description: "Quản lý yêu cầu vận chuyển",
    category: LINK_CATEGORY.TRANSPORT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.EMPLOYEE.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.MANAGER.name,
    ]
},
{
    url: "/manage-transport-plan",
    description: "Quản lý kế hoạch vận chuyển",
    category: LINK_CATEGORY.TRANSPORT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.EMPLOYEE.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.MANAGER.name,
    ],
    components: getComponentsInLink('/manage-transport-plan')
},
{
    url: "/manage-transport-schedule",
    description: "Quản lý lệnh vận chuyển",
    category: LINK_CATEGORY.TRANSPORT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.EMPLOYEE.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.MANAGER.name,
    ]
},
{
    url: "/manage-transport-vehicle",
    description: "Phương tiện vận chuyển",
    category: LINK_CATEGORY.TRANSPORT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
    ]
},
{
    url: "/manage-transport-route",
    description: "Hành trình vận chuyển",
    category: LINK_CATEGORY.TRANSPORT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.EMPLOYEE.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.MANAGER.name,
    ]
},
{
    url: "/manage-transport-department",
    description: "Phân vai trò đơn vị vận chuyển",
    category: LINK_CATEGORY.TRANSPORT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name
    ]
},
{
    url: "/carrier-today-transport-mission",
    description: "Nhiệm vụ vận chuyển ngày hôm nay",
    category: LINK_CATEGORY.TRANSPORT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.EMPLOYEE.name,
    ]
},
// {
//     url: "/carrier-all-times-transport-mission",
//     description: "Nhiệm vụ vận chuyển mỗi ngày",
//     category: LINK_CATEGORY.TRANSPORT.name,
//     roles: [
//         ROOT_ROLES.SUPER_ADMIN.name,
//         ROOT_ROLES.ADMIN.name
//     ]
// },
// Quan li du an
{
    url: '/project/projects-list',
    description: 'Danh sách dự án',
    category: LINK_CATEGORY.PROJECT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/project/projects-list'),
},
{
    url: '/project/project-details',
    description: 'Chi tiết dự án',
    category: LINK_CATEGORY.PROJECT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/project/project-details'),
},
{
    url: '/project/phases-list',
    description: 'Danh sách giai đoạn dự án',
    category: LINK_CATEGORY.PROJECT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/project/phases-list'),
},
{
    url: '/project/phase-details',
    description: 'Chi tiết giai đoạn dự án',
    category: LINK_CATEGORY.PROJECT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/project/phase-details'),
},
{
    url: '/project/tasks-list',
    description: 'Danh sách công việc dự án',
    category: LINK_CATEGORY.PROJECT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/project/tasks-list'),
},
{
    url: '/project/issues-list',
    description: 'Danh sách vấn đề phát sinh dự án',
    category: LINK_CATEGORY.PROJECT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/project/issues-list'),
},
{
    url: '/project/project-report',
    description: 'Danh sách báo cáo',
    category: LINK_CATEGORY.PROJECT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/project/project-report'),
},
{
    url: '/project/project-evaluation',
    description: 'Danh sách đánh giá dự án',
    category: LINK_CATEGORY.PROJECT.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/project/project-evaluation'),
},


{
    url: "/user-guide",
    description: "Hướng dẫn sử dụng",
    category: LINK_CATEGORY.USERGUIDE.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    components: getComponentsInLink('/user-guide')
}, {
    url: "/personal-time-sheet-log",
    description: "Thống kê bấm giờ cá nhân",
    category: LINK_CATEGORY.TASK.name,
    roles: [
        ROOT_ROLES.SUPER_ADMIN.name,
        ROOT_ROLES.ADMIN.name,
        ROOT_ROLES.MANAGER.name,
        ROOT_ROLES.DEPUTY_MANAGER.name,
        ROOT_ROLES.EMPLOYEE.name,
    ],
    component: getComponentsInLink('/personal-time-sheet-log')
}
];

module.exports = {
    ROLE_TYPES,
    LINKS,
    COMPONENTS,
    ROOT_ROLES,
    LINK_CATEGORY
}
