export default {
    locale: 'vn',
    messages: {
        auth: {
            login: 'Đăng nhập',
            logout: 'Đăng xuất',
            logout_all_account: 'Đăng xuất khỏi tất cả các thiết bị',
            profile: 'Thông tin tài khoản',
        },

        confirm: {
            yes: 'CÓ',
            no: 'KHÔNG',
            no_data: 'Không có dữ liệu',
        },

        form: {
            required: 'Các trường thông tin bắt buộc',
            save: 'Lưu',
            close: 'Đóng',
            email: 'Email',
            password: 'Mật khẩu',
            new_password: 'Mật khẩu mới',
            confirm: 'Xác thực mật khẩu',
            description: 'Mô tả',
            reset_assword: 'Thiết lập lại mật khẩu',
            forgot_password: 'Quên mật khẩu ?',
            signin: 'Đăng nhập',
            otp: 'Mã xác thực',
            next: 'Tiếp tục',
            search: 'Tìm kiếm',
        },

        table: {
            name: 'Tên',
            description: 'Mô tả',
            email: 'Email',
            action: 'Hành động',
            line_per_page: 'Số dòng/Trang',
            update: 'Cập nhật',
            edit: 'Sửa',
            delete: 'Xóa',
            info: 'Thông tin chi tiết',
            status: 'Trạng thái',
            url: 'URL',
            short_name: 'Tên viết tắt',
        },

        menu: {
            home: 'Trang chủ',
            manage_system: 'Quản lý hệ thống',
            manage_company: 'Quản lý doanh nghiệp/công ty',
            manage_department: 'Quản lý cơ cấu tổ chức',
            manage_user: 'Quản lý người dùng',
            manage_role: 'Quản lý phân quyền',
            manage_page: 'Quản lý trang',
            manage_component: 'Quản lý các componentUI',
            manage_document: 'Quản lý tài liệu',

            tasktemplate: 'Mẫu Công Việc',
            cocautochuc: 'Cơ Cấu Tổ Chức',
            taskmanagement: 'Quản Lý Công Việc',
            manageDocument: 'Quản lý văn bản',
            manageDocumentType: 'Quản lý loại văn bản',
            addemployee: 'Thêm nhân viên',
            listemployee: 'Quản lý thông tin nhân viên',
            detailemployee: 'Thông tin cá nhân',
            updateemployee: 'Cập nhật thông tin cá nhân',
            dashboardemployee: 'DashBoard quản lý nhân sự',
            discipline: 'Quản lý khen thưởng - kỷ luật',
            sabbatical: 'Quản lý nghỉ phép',
            salaryemployee: 'Lương nhân viên',
            timekeeping: 'Chấm công nhân viên',
            listCourse: 'Chương trình đào tạo bắt buộc',
            trainingplan: 'Quản lý khoá đào tạo',
        },

        manage_system: {
            turn_on: 'Bật',
            turn_off: 'Tắt',
            log: 'Trạng thái ghi lịch sử hoạt động'
        },

        manage_company: {
            add: 'Thêm',
            add_title: 'Thêm doanh nghiệp/công ty mới',
            name: 'Tên doanh nghiệp/công ty',
            short_name: 'Tên ngắn của công ty',
            description: 'Mô tả thông tin về công ty',
            on_service: 'Bật dịch vụ',
            off_service: 'Tắt dịch vụ',
            turning_on: 'Đang bật dịch vụ',
            turning_off: 'Đang tắt dịch vụ',
            info: 'Thông tin về doanh nghiệp/công ty',
            edit: 'Chỉnh sửa thông tin doanh nghiệp/công ty',
            super_admin: 'Email tài khoản super admin của công ty',
        },

        manage_department: {
            zoom_out: 'Thu nhỏ',
            zoom_in: 'Phóng to',
            add: 'Thêm',
            add_title: 'Thêm đơn vị mới',
            info: 'Thông tin về đơn vị',
            name: 'Tên đơn vị',
            description: 'Mô tả về đơn vị',
            parent: 'Đơn vị cha',
            select_parent: 'Chọn đơn vị cha',
            roles_of_department: 'Các chức danh của đơn vị',
            dean_name: 'Tên chức danh cho trưởng đơn vị',
            dean_example: 'VD: Trưởng phòng tài chính',
            vice_dean_name: 'Tên chức danh cho phó đơn vị',
            vice_dean_example: 'VD: Phó phòng tài chính',
            employee_name: 'Tên chức danh cho nhân viên đơn vị',
            employee_example: 'Nhân viên phòng tài chính',
            add_with_parent: 'Tạo đơn vị mới với đơn vị cha là',
            delete: 'Xóa đơn vị ?',
            add_success: 'Đã thêm thành công đơn vị mới',
        },
        
        manage_role: {
            add: 'Thêm',
            add_title: 'Thêm phân quyền mới',
            info: 'Thông tin về phân quyền',
            name: 'Tên phân quyền',
            extends: 'Kế thừa phân quyền',
            users: 'Những người dùng có phân quyền',
            edit: 'Chỉnh sửa thông tin phân quyền',
            delete: 'Xóa phân quyền ?',
            add_success: 'Đã tạo thành công phân quyền',
            add_faile: 'Tạo phân quyền mới thất bại',
            edit_success: 'Đã chỉnh sửa lại thông tin phân quyền',
            edit_faile: 'Chỉnh sửa thất bại',
        },

        manage_user: {
            add: 'Thêm',
            add_title: 'Thêm tài khoản người dùng mới',
            info: 'Thông tin về tài khoản người dùng',
            edit: 'Chỉnh sửa thông tin tài khoản người dùng',
            disable: 'Ngưng hoạt động',
            enable: 'Hoạt động',
            delete: 'Xóa tài khoản ?',
            add_success: "Thêm tài khoản thành công",
            edit_success: "Chỉnh sửa thông tin thành công"
        },

        manage_page: {
            add: 'Thêm',
            add_title: 'Thêm link mới cho trang web',
            url: 'Đường link của trang web',
            description: 'Mô tả về trang web',
            roles: 'Những role được truy cập vào trang này',
            info: 'Thông tin về trang web',
            edit: 'Chỉnh sửa thông tin',
            delete: 'Xóa link ?'
        },

        manage_component: {
            add: 'Thêm',
            add_title: 'Thêm component mới',
            info: 'Thông tin về component',
            edit: 'Chỉnh sửa thông tin về component',
            delete: 'Xóa component ?',
            roles: 'Những role có component này',
        },

        footer: {
            copyright: 'Bản quyền thuộc về ',
            vnist: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
            version: 'Phiên bản '
        }
    }
}
// canSave = () => {
//     const {name, description, dean, vice_dean, employee } = this.state;
//     if(name !== '' && description !== '' && dean !== '' && vice_dean !== '' && employee !== '')
//         return true;
//     else return false;
// }