export default {
    vn: {
        locale: 'vn',
        messages: {
            hello: 'Xin chào {name}',
            loading: 'Đang xử lý dữ liệu...Xin vui lòng đợi',
            question: {
                yes: 'Có',
                no: 'Không'
            },
            profile: 'Thông tin tài khoản người dùng',
            logout: 'Đăng xuất',
            manageCompany: {
                name: 'Quản lý thông tin các công ty',
                create: 'Thêm công ty mới'
            },
            manageUser: {
                name: 'Quản lý tài khoản người dùng',
                info: 'Thông tin tài khoản',
                create: 'Thêm tài khoản người dùng',
                delete: 'Xóa tài khoản người dùng ?'
            },
            manageDepartment: {
                name: 'Quản lý phòng ban',
                nameDepartment: 'Tên đơn vị',
                create: 'Tạo đơn vị mới',
                dean: 'Tên chức danh cho trưởng đơn vị',
                vicedean: 'Tên chức danh cho phó đơn vị',
                employee: 'Tên chức danh cho nhân viên đơn vị',
                sub_dean: 'VD: Trưởng phòng tài chính, ...',
                sub_vicedean: 'VD: Phó phòng tài chính, ...',
                sub_employee: 'VD: Nhân viên phòng tài chính, ...',
                delete: 'Bạn muốn xóa phòng',
                description: 'Mô tả về đơn vị',
                departmentParent: 'Đơn vị cha',
                selectDepartment: '--Chọn một đơn vị cha --',
                relationDepartment: 'Xem mối quan hệ giữa các đơn vị',
                tableDepartment: 'Bảng danh sách các đơn vị',
                info: 'Thông tin về đơn vị',
                rolesOfDepartment: "Các chức danh của đơn vị"

            },
            manageRole: {
                name: 'Quản lý admin',
                admins: 'Quản lý danh sách dmin',
                roles: 'Quản lý các phân quyền khác',
                add: 'Thêm phân quyền mới',
                delete: 'Xóa phân quyền ?',
                create: 'Tạo thêm phân quyền mới',
                roleName: 'Tên phân quyền',
                abstract: 'Kế thừa các phân quyền',
                select: 'Chọn role muốn kế thừa quyền',
                roleInfo: 'Thông tin về phân quyền',
                users: 'Những người dùng có phân quyền :',
            },
            manageResource: {
                name: 'Quản lý tài nguyên',
                url: 'Đường link',
                urlDescription: 'Mô tả về URL',
                roleTo: 'Cấp quyền cho',
                selectRole: '--- chọn role ---',
                createLink: 'Thêm link',
                infoLink: 'Thông tin về đường link',
                createComponent: 'Tạo thêm thành phần',
                link: 'Đường link',
                component: 'Thành phần UI'
            },
            manageLink: {
                linkInfo: 'Thông tin LINK',
                add: 'Thêm link mới',
                delete: 'Xóa link ?',
            },
            manageComponent: {
                componentInfo: 'Thông tin Component',
                add: 'Thêm component mới',
                delete: 'Xóa component ?',
            },
            input: 'Nhập thông tin ... ',
            table: {
                id: 'ID',
                name: 'Tên',
                email: 'Email',
                action: 'Hành động',
                password: 'Mật khẩu',
                confirm: 'Xác nhận mật khẩu',
                back: 'Quay lại',
                close: 'Đóng',
                save: 'Lưu',
                url: 'Đường link',
                label: 'Nhãn',
                description: 'Mô tả',
                status: 'Trạng thái',
                shortName: 'Tên viết tắt',
                department: 'Phòng ban'
            },
            mainSideBar: {
                search: 'Tìm kiếm ...',
                home: 'Trang chủ',
                dashboard: 'Bảng điều khiển',
                adminManage: 'Quản lý trang admin',
                taskManage: 'Quản lý công việc',
                manageUser: 'Quản lý người dùng',
                manageCompany: 'Quản lý các doanh nghiệp',
                manageDepartment: 'Quản lý cơ cấu tổ chức',
                manageRole: 'Quản lý phân quyền',
                manageResource: 'Quản lý tài nguyên',
                manageLink: 'Quản lý links',
                manageComponent: 'Quản lý ComponentUI',
                manageFormDocument: 'Quản lý tài liệu biểu mẫu',
                tasktemplate: 'Mẫu Công Việc',
                cocautochuc: 'Cơ Cấu Tổ Chức',
                taskmanagement: 'Quản Lý Công Việc',
                manageDocument: 'Quản lý văn bản',
                manageDocumentType: 'Quản lý loại văn bản',
            },
            footer: {
                copyRight: 'Bản quyền thuộc về',
                version: 'Phiên bản'
            }
        }
    },
    
    en: {
        locale: 'en-US',
        messages: {
            hello: 'how are you {name}',
            loading: 'Loading...Please wait',
            question: {
                yes: 'Yes',
                no: 'No'
            },
            profile: 'Profile',
            logout: 'Log out',
            manageCompany: {
                name: 'Manage Company',
                create: 'Add new company'
            },
            manageUser: {
                name: 'Manage User',
                info: 'Information of user',
                create: 'Create user',
                delete: 'Delete account ?'
            },
            manageDepartment: {
                name: 'Manage Department',
                nameDepartment: 'Name of department',
                create: 'Create',
                dean: 'Dean of',
                vicedean: 'ViceDean of',
                employee: 'Employee of',
                sub_dean: 'Example: Dean of financial department, ...',
                sub_vicedean: 'Example: Vice Dean of financial department, ...',
                sub_employee: 'Example: Employee of financial department, ...',
                delete: 'Delete department',
                description: 'Description of department',
                departmentParent: 'Department Parent',
                selectDepartment: '--Select parent department --',
                relationDepartment: 'Relations between departments',
                tableDepartment: 'Department Table',
                info: 'Information of department',
                rolesOfDepartment: "Roles of department"
            },
            manageRole: {
                name: 'Manage Admin',
                admins: 'Manage Super Admin',
                roles: 'Manage Different Role Accounts',
                add: 'Add new role',
                delete: 'Delete role ?',
                create: 'Create new role',
                roleName: 'Name of role',
                abstract: 'Select roles',
                select: 'Select abstract role',
                roleInfo: 'Infomation of role',
                users: 'Users has role :',
            },
            manageResource: {
                name: 'Manage Resource',
                url: 'URL',
                urlDescription: 'Description of URL',
                roleTo: 'Permisstion to',
                selectRole: '--- select role ---',
                createLink: 'Create',
                infoLink: 'Link information',
                createComponent: 'Create component',
                link: 'Links',
                component: 'Components UI'
            },
            manageLink: {
                linkInfo: 'Link information',
                add: 'Add new link',
                delete: 'Delete link ?',
            },
            manageComponent: {
                componentInfo: 'Component Information',
                add: 'Add new component',
                delete: 'Delete component ?',
            },
            input: 'Input here ...',
            table: {
                id: 'ID',
                name: 'Name',
                email: 'Email',
                action: 'Action',
                password: 'Password',
                confirm: 'Confirm password',
                back: 'Back',
                close: 'Close',
                save: 'Save',
                url: 'URL',
                label: 'Label',
                description: 'Description',
                status: 'Status',
                shortName: 'Short name',
                department: 'Department'
            },
            mainSideBar: {
                search: 'Search ...',
                home: 'Home',
                dashboard: 'Dashboard',
                adminManage: 'Admin manager',
                taskManage: 'Task manager',
                manageUser: 'Manage Users',
                manageCompany: 'Manage Companies',
                manageDepartment: 'Manage Departments',
                manageRole: 'Manage Roles',
                manageResource: 'Manage Resources',
                manageLink: 'Manage Links',
                manageComponent: 'Manage ComponentUI',
                manageFormDocument: 'Manage Form-Document',
                tasktemplate: 'Task Template',
                cocautochuc: 'Organizational Structure',
                taskmanagement: 'Task Management',
                manageDocument: 'Manage Document',
            },
            footer: {
                copyRight: 'Copyright',
                version: 'Version'
            }
        }
    },
}
