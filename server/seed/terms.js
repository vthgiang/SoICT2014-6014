exports.ROLE_TYPES= {
    ROOT: "Root",
    POSITION: "Position",
    COMPANY_DEFINED: "Company-Defined"
}

const ROOT_ROLES = {
    SYSTEM_ADMIN: {NAME: "System Admin", DESCRIPTION: "Quản lý các doanh nghiệp/công ty sử dụng dịch vụ"},
    SUPER_ADMIN: {NAME: "Super Admin", DESCRIPTION: "Super Admin của một doanh nghiệp/công ty. Chỉ có một Super Admin duy nhất, không thể xóa"},
    ADMIN: {NAME: "Admin", DESCRIPTION: "Admin của một doanh nghiệp/công ty. Có thể có nhiều Admin"},
    DEAN: {NAME: "Dean", DESCRIPTION: "Trưởng đơn vị trong một doanh nghiệp/công ty"},
    VICE_DEAN: {NAME: "Vice Dean", DESCRIPTION: "Phó đơn vị trong một doanh nghiệp/công ty"},
    EMPLOYEE: {NAME: "Employee", DESCRIPTION: "Nhân viên đơn vị trong một doanh nghiệp/công ty"},
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
};
exports.LINK_CATEGORY = LINK_CATEGORY;

const LINKS = [
    { // 0
        url: '/',
        description: `Trang chủ công ty`,
        category: LINK_CATEGORY.COMMON.name,
        roles: [
            ROOT_ROLES.SUPER_ADMIN.NAME,
            ROOT_ROLES.ADMIN.NAME,
            ROOT_ROLES.DEAN.NAME,
            ROOT_ROLES.VICE_DEAN.NAME,
            ROOT_ROLES.EMPLOYEE.NAME
        ]
    },
    { // 1
        url: '/departments-management',
        description: 'Quản lý cơ cấu tổ chức',
        category: LINK_CATEGORY.RBAC.name,
        roles: [
            ROOT_ROLES.SUPER_ADMIN.NAME,
            ROOT_ROLES.ADMIN.NAME
        ]
    },
    { // 2
        url: '/users-management',
        description: 'Quản lý người dùng',
        category: LINK_CATEGORY.RBAC.name,
        roles: [
            ROOT_ROLES.SUPER_ADMIN.NAME,
            ROOT_ROLES.ADMIN.NAME
        ]
    },
    { // 3
        url: '/roles-management',
        description: 'Quản lý phân quyền',
        category: LINK_CATEGORY.RBAC.name,
        roles: [
            ROOT_ROLES.SUPER_ADMIN.NAME,
            ROOT_ROLES.ADMIN.NAME
        ]
    },
    { // 4
        url: '/links-management',
        description: 'Quản lý trang web của công ty',
        category: LINK_CATEGORY.RBAC.name,
        roles: [
            ROOT_ROLES.SUPER_ADMIN.NAME,
            ROOT_ROLES.ADMIN.NAME
        ]
    },
    { // 5
        url: '/components-management',
        description: 'Quản lý các thành phần UI trên trang web của công ty',
        category: LINK_CATEGORY.RBAC.name,
        roles: [
            ROOT_ROLES.SUPER_ADMIN.NAME,
            ROOT_ROLES.ADMIN.NAME
        ]
    },
    { // 6
        url: '/documents-management',
        description: 'Quản lý tài liệu biểu mẫu',
        category: LINK_CATEGORY.DOCUMENT.name,
        roles: [
            ROOT_ROLES.SUPER_ADMIN.NAME,
            ROOT_ROLES.ADMIN.NAME
        ]
    },
    { // 7
        url: '/hr-manage-holiday',
        description: 'Kế hoạch làm việc',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { // 8
        url: '/hr-add-employee',
        description: 'Thêm mới nhân viên',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { // 9
        url: '/hr-list-employee',
        description: 'Danh sách nhân viên',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { // 10
        url: '/hr-update-employee',
        description: 'Cập nhật thông tin cá nhân của nhân viên',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { // 11
        url: '/hr-detail-employee',
        description: 'Thông tin cá nhân của nhân viên',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { // 12
        url: '/hr-salary-employee',
        description: 'Quản lý lương nhân viên',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { // 13
        url: '/hr-annual-leave',
        description: 'Quản lý nghỉ phép của nhân viên',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { // 14
        url: '/hr-discipline',
        description: 'Quản lý khen thưởng, kỷ luật',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { // 15
        url: '/hr-dashboard-employee',
        description: 'Dashboard nhân sự',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { // 16
        url: '/hr-time-keeping',
        description: 'Quản lý chấm công',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { // 17
        url: '/hr-trainning-course',
        description: 'Quản lý đào tạo',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { // 18
        url: '/hr-account',
        description: 'Thông tin tài khoản ',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { // 19
        url: '/hr-training-plan',
        description: 'Kế hoạch đào tạo',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { // 20
        url: '/hr-list-education',
        description: 'Chương trình đào tạo bắt buộc',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },

    //thêm link của quản lý KPI
    { // 21
        url: '/kpi-units/create',
        description: 'Khởi tạo KPI đơn vị',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.DEAN.NAME,
        ]
    },
    { // 22
        url: '/kpi-units/dashboard',
        description: 'Dashboard KPI đơn vị',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.DEAN.NAME,
            ROOT_ROLES.VICE_DEAN.NAME,
            ROOT_ROLES.EMPLOYEE.NAME,
        ]
    },
    { // 23
        url: '/kpi-personals/create',
        description: 'Khởi tạo KPI cá nhân',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.VICE_DEAN.NAME,
            ROOT_ROLES.EMPLOYEE.NAME,
        ]
    },
    { //24  /kpi-personal-manager
        url: '/kpi-personals/manager',
        description: 'Quản lí KPI cá nhân',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.VICE_DEAN.NAME,
            ROOT_ROLES.EMPLOYEE.NAME,
        ]
    },
    { // 25
        url: '/notifications',
        description: 'Thông báo',
        category: LINK_CATEGORY.COMMON.name,
        components: [
            {
                name: 'create-notification',
                description: 'Tạo thông báo mới',
                roles: [
                    ROOT_ROLES.ADMIN.NAME,
                    ROOT_ROLES.SUPER_ADMIN.NAME,
                ]
            }
        ],
        roles: [
            ROOT_ROLES.SUPER_ADMIN.NAME,
            ROOT_ROLES.ADMIN.NAME,
            ROOT_ROLES.DEAN.NAME,
            ROOT_ROLES.VICE_DEAN.NAME,
            ROOT_ROLES.EMPLOYEE.NAME,
        ]
    },
    { // 26
        url: '/hr-manage-department',
        description: 'Quản lý nhân sự các đơn vị',
        category: LINK_CATEGORY.HUMAN_RESOURCE.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { // 27
        url: '/task-template',
        description: 'Mẫu công việc',
        category: LINK_CATEGORY.TASK.name,
        components: [
            {
                name: 'create-task-template-button',
                description: 'Button thêm mới mẫu công việc',
                roles: [
                    ROOT_ROLES.DEAN.NAME,
                ]
            }
        ],
        roles: [
            ROOT_ROLES.DEAN.NAME,
            ROOT_ROLES.VICE_DEAN.NAME,
            ROOT_ROLES.EMPLOYEE.NAME,
        ]
    },
    { // 28
        url: '/kpi-member/manager',
        description: 'Quản lí kpi nhân viên',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.DEAN.NAME,
        ]
    },
    { // 29
        url: '/task-management',
        description: 'Xem danh sách công việc',
        category: LINK_CATEGORY.TASK.name,
        roles: [
            ROOT_ROLES.DEAN.NAME,
            ROOT_ROLES.VICE_DEAN.NAME,
            ROOT_ROLES.EMPLOYEE.NAME,
        ]
    },
    { // 30 
        url: '/task-management-dashboard',
        description: 'Dashboard công việc',
        category: LINK_CATEGORY.TASK.name,
        roles: [
            ROOT_ROLES.DEAN.NAME,
            ROOT_ROLES.VICE_DEAN.NAME,
            ROOT_ROLES.EMPLOYEE.NAME,
        ]
    },
    { //47
        url: '/task',
        description: 'Chi tiết công việc',
        category: 'task-management',
        roles: [
            ROOT_ROLES.DEAN.NAME,
            ROOT_ROLES.VICE_DEAN.NAME,
            ROOT_ROLES.EMPLOYEE.NAME,
        ]
    },
    { // 31 /kpi-member-dashboard
        url: '/kpi-member/dashboard',
        description: 'Dashboard KPI nhân viên',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.DEAN.NAME,
        ]
    },
    { // 32
        url: '/kpi-units/manager',
        description: 'Quản lý KPI đơn vị',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.DEAN.NAME,
        ]
    },

    // { // 33
    //     url: '/kpi-units/dashboard',
    //     description: 'Tổng quan KPI đơn vị',
    //     category: PAGE_CATEGORY.KPI.name
    // },

    { // 34  kpi-personal-dashboard
        url: '/kpi-personals/dashboard',
        description: 'DashBoard Kpi cá nhân',
        category: LINK_CATEGORY.KPI.name,
        roles: [
            ROOT_ROLES.VICE_DEAN.NAME,
            ROOT_ROLES.EMPLOYEE.NAME,
        ]
    },


    // thêm link quản lý tài sản
    // QUẢN LÝ
    { //35. quản lý loại tài sản
        url: '/dashboard-asset',
        description: 'DashBoard quản lý tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { //36. quản lý loại tài sản
        url: '/manage-type-asset',
        description: 'Quản lý loại tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },

    { //37. quản lý thông tin tài sản
        url: '/manage-info-asset',
        description: 'Quản lý thông tin tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },

    { //38. quản lý sửa chữa - thay thế - nâng cấp tài sản
        url: '/manage-repair-asset',
        description: 'Quản lý sửa chữa - thay thế - nâng cấp tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },

    { //39. Quản lý cấp phát - điều chuyển - thu hồi tài sản
        url: '/manage-distribute-asset',
        description: 'Quản lý cấp phát - điều chuyển - thu hồi tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },

    { //40. Quản lý khấu hao tài sản
        url: '/manage-depreciation-asset',
        description: 'Quản lý khấu hao tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },

    { //41. Quản lý đề nghị mua sắm tài sản
        url: '/manage-recommend-procure',
        description: 'Quản lý đề nghị mua sắm tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },
    { //42. Quản lý đề nghị cấp phát tài sản
        url: '/manage-recommend-distribute-asset',
        description: 'Quản lý đề nghị cấp phát tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },

    { //43. Quản lý sự cố tài sản
        url: '/manage-crash-asset',
        description: 'Quản lý sự cố tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.ADMIN.NAME,
        ]
    },

    // NHÂN VIÊN
    { //44
        url: '/recommend-equipment-procurement',
        description: 'Đăng ký mua sắm tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.DEAN.NAME,
            ROOT_ROLES.VICE_DEAN.NAME,
            ROOT_ROLES.EMPLOYEE.NAME,
        ]
    },
    { //45
        url: '/recommmend-distribute-asset',
        description: 'Đăng ký cấp phát tài sản',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.DEAN.NAME,
            ROOT_ROLES.VICE_DEAN.NAME,
            ROOT_ROLES.EMPLOYEE.NAME,
        ]
    },
    { //46
        url: '/manage-assigned-asset',
        description: 'Quản lý tài sản được bàn giao',
        category: LINK_CATEGORY.ASSET.name,
        roles: [
            ROOT_ROLES.DEAN.NAME,
            ROOT_ROLES.VICE_DEAN.NAME,
            ROOT_ROLES.EMPLOYEE.NAME,
        ]
    },


    
    { // 48 tài liệu văn bản
        url: '/documents',
        description: 'Tài liệu',
        category: LINK_CATEGORY.DOCUMENT.name,
        roles: [
            ROOT_ROLES.DEAN.NAME,
            ROOT_ROLES.VICE_DEAN.NAME,
            ROOT_ROLES.EMPLOYEE.NAME,
        ]
    }
];
exports.LINKS = LINKS;