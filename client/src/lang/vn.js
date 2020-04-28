export default {
    locale: 'vn',
    messages: {
        error: {
            email_does_not_exist: 'Email này đã được sử dụng',
            field_invalid: 'Trường nhập vào không hợp lệ',

            /** 
             * Start 
             * Chức năng quản lý nhân sự
             */
            employee_number_required: 'Mã nhân viên không được để trống',
            staff_code_not_special: 'Mã nhân viên không được chứ ký tự đặc biệt',
            staff_code_not_find: 'Mã nhân viên không tồn tại',
            number_decisions_required: 'Số ra quyết định không được để trống',
            number_decisions_have_exist: 'Số ra quyết định đã tồn tại',
            unit_decisions_required: 'Cấp ra quyết định không được để trống',
            // Quản lý nghỉ phép
            start_date_annual_leave_required: 'Ngày bắt đầu không được để trống',
            end_date_annual_leave_required: 'Ngày kết thúc không được để trống',
            reason_annual_leave_required: 'Lý do không được để trống',
            status_annual_leave_required: 'Trạng thái không được để trống',
            get_annual_leave_success: 'Lấy thông tin nghỉ phép thành công',
            get_annual_leave_faile: 'Lấy thông tin nghỉ phép thất bại',
            create_annual_leave_success: 'Thêm đơn xin nghỉ phép thành công',
            create_annual_leave_faile: 'Thêm đơn xin nghỉ phép thất bại',
            delete_annual_leave_success: 'Xoá đơn xin nghỉ phép thành công',
            delete_annual_leave_faile: 'Xoá đơn xin nghỉ phép thất bại',
            edit_annual_leave_success: 'Chỉnh sửa đơn xin nghỉ phép thành công',
            edit_annual_leave_faile: 'Chỉnh sửa đơn xin nghỉ phép thất bại',
            // Quản lý lương nhân viên
            name_other_salary_required: 'Tên lương thưởng khác không được để trống',
            money_other_salary_required: 'Tiền lương thưởng khác không được để trống',
            month_salary_required: 'Tháng lương không được để trống',
            money_salary_required: 'Tiền lương chính không được để trống',
            month_salary_have_exist: 'Tháng lương đã tồn tại',
            get_salary_success: 'Lấy thông tin lương nhân viên thành công',
            get_salary_faile: 'Lấy thông tin lương nhân viên thất bại',
            create_salary_success: 'Thêm bảng lương thành công',
            create_salary_faile: 'Thêm bảng lương thất bại',
            delete_salary_success: 'Xoá bẳng lương thành công',
            delete_salary_faile: 'Xoá bảng lương thất bại',
            edit_salary_success: 'Chỉnh sửa bảng lương thành công',
            edit_salary_faile: 'Chỉnh sửa bảng lương thất bại',
            // Quản lý khen thưởng
            type_commendations_required: 'Hình thức khen thưởng không được để trống',
            reason_commendations_required: 'Thành tích (lý do) khen thưởng không được để trống',
            decisions_date_required: 'Ngày ra quyết định không được để trống',
            get_commendations_success: 'Lấy danh sách khen thưởng thành công',
            get_commendations_faile: 'Lấy danh sách khen thưởng thất bại',
            create_commendations_success: 'Thêm mới khen thưởng thành công',
            create_commendations_faile: 'Thêm mới khen thưởng thất bại',
            delete_commendations_success: 'Xoá khen thưởng thành công',
            delete_commendations_faile: 'Xoá khen thưởng thất bại',
            edit_commendations_success: 'Chỉnh sửa khen thưởng thành công',
            edit_commendations_faile: 'Chỉnh sửa khen thưởng thất bại',
            // Quản lý kỷ luật
            type_discipline_required: 'Hình thức kỷ luật không được để trống',
            reason_discipline_required: 'Lý do kỷ luật không được để trống',
            start_date_discipline_required: 'Ngày có hiệu lực không được để trống',
            end_date_discipline_required: 'Ngày hết hiệu lực không được để trống',
            get_discipline_success: 'Lấy danh sách kỷ luật thành công',
            get_discipline_faile: 'Lấy danh sách kỷ luật thất bại',
            create_discipline_success: 'Thêm mới kỷ luật thành công',
            create_discipline_faile: 'Thêm mới kỷ luật thất bại',
            delete_discipline_success: 'Xoá kỷ luật thành công',
            delete_discipline_faile: 'Xoá kỷ luật thất bại',
            edit_discipline_success: 'Chỉnh sửa kỷ luật thành công',
            edit_discipline_faile: 'Chỉnh sửa kỷ luật thất bại',
            // Quản lý thông tin cá nhân
            get_infor_personal_success: 'Lấy thông tin cá nhân thành công',
            get_infor_personal_false: 'Lấy thông tin cá nhân thất bại',
            edit_infor_personal_success: 'Cập nhật thông tin cá nhân thành công',
            edit_infor_personal_false: 'Cập nhật thông tin cá nhân thất bại',
            guaranteed_infor_to_update: 'Bạn chưa cam đoan thông tin cần cập nhật',
            no_change_data: 'Không có thông tin nào được thay đổi',


            /** 
             * End
             * Chức năng quản lý nhân sự
             */
        },
        
        /*******************************************************
         * CHUẨN HÓA FILE NGÔN NGỮ PHÂN CHIA THEO TỪNG MODULE
         * @general những phần ngôn ngữ dùng chung cho mọi module
         * @module_name phần tự định nghĩa ngôn ngữ riêng của từng module khác nhau
         *******************************************************/
        general: {
            table: 'Bảng',
            name: 'Tên',
            description: 'Mô tả',
            search: 'Tìm kiếm',
            add: 'Thêm', edit: 'Sửa', save: 'Lưu', close: 'Đóng',
            yes: 'Có',  no: 'Không',
            loading: 'Đang tải dữ liệu',
            no_data: 'Không có dữ liệu',
            success: 'Thành công',
            error: 'Lỗi',
            auth_alert: {
                title: 'Hệ thống xác nhận có lỗi xảy ra trong phiên làm việc hiện tại của bạn. Vui lòng đăng nhập lại.',
                reason: 'Nguyên nhân có thể là do:',
                content: [
                    'Phiên làm việc đã hết hạn',
                    'Truy cập không hợp lệ',
                    'Phân quyền của bạn không hợp lệ',
                    'Phân quyền của bạn đã được quản lý thay đổi',
                    'Token của bạn không hợp lệ',
                    'Dịch vụ cho công ty không còn hoạt động',
                ]
            }
        },

        system_admin: {
            company: {
                table: {
                    name: 'Tên doanh nghiệp/công ty',
                    short_name: 'Tên ngắn',
                    description: 'Mô tả về doanh nghiệp/công ty',
                    log: 'Ghi log',
                    service: 'Dịch vụ',
                    super_admin: 'Tài khoản super admin',
                },
                on: 'Bật', off: 'Tắt',
                add: 'Thêm doanh nghiệp/công ty',
                edit: 'Chỉnh sửa thông tin doanh nghiệp/công ty',
                service: 'Dịch vụ cho doanh nghiệp/công ty',
                validator: {
                    name: {
                        no_blank: 'Tên không được để trống',
                        no_less4: 'Tên không được ít hơn 4 kí tự',
                        no_more255: 'Tên không quá 255 kí tự',
                        no_special: 'Tên không được chứa kí tự đặc biệt'
                    },
                    short_name: {
                        no_blank: 'Tên không được để trống',
                        no_less3: 'Tên không được ít hơn 3 kí tự',
                        no_more255: 'Tên không quá 255 kí tự',
                        no_space: 'Tên ngắn của công ty không hợp lê. Các chữ không được cách nhau'
                    },
                    description: {
                        no_blank: 'Mô tả không được để trống',
                        no_less4: 'Mô tả không được ít hơn 4 kí tự',
                        no_more255: 'Mô tả không quá 255 kí tự',
                        no_special: 'Mô tả không được chứa kí tự đặc biệt'
                    },
                    super_admin: {
                        no_blank: 'Email không được để trống',
                        email_invalid: 'Email không hợp lệ',
                    }
                },

                // Thông điệp trả về từ server
                create_company_success: 'Khởi tạo dữ liệu công ty thành công',
                show_company_success: 'Lấy dữ liệu công ty thành công',
                edit_company_success: 'Chỉnh sửa thông tin công ty thành công',
                delete_company_success: 'Xóa dữ liệu công ty thành công',
                add_new_link_for_company_success: 'Thêm mới link cho công ty thành công',
                delete_link_for_company_success: 'Xóa link thành công',
                add_new_component_for_company_success: 'Thêm mới component cho công ty thành công',
                delete_component_for_company_success: 'Xóa component thành công',

                email_exist: 'Email này đã được sử dụng',
                company_not_found: 'Không tìm thấy thông tin về công ty',
                link_exist: 'Url cho link đã tồn tại',
                component_exist: 'Component này đã tồn tại',
            },

            log: {

            },

            root_role: {
                table: {
                    name: 'Tên phân quyền',
                    description: 'Mô tả về phân quyền'
                },

                //Thông điệp trả về từ server
                get_root_roles_success: 'Lấy thông tin về các root role thành công'
            },

            system_link: {
                table: {
                    url: 'Đường dẫn',
                    category: 'Danh mục',
                    description: 'Mô tả về trang',
                    roles: 'Những role có quyền',
                },
                add: 'Thêm system link mới',
                edit: 'Chỉnh sửa thông tin system link',
                delete: 'Xóa system link',
                validator: {
                    url: {
                        no_blank: 'Url không được để trống',
                        start_with_slash: 'Url không hợp lệ. Url phải bắt đầu bằng dấu /',
                    },
                    description: {
                        no_blank: 'Mô tả không được để trống',
                        no_special: 'Mô tả không được chứa ký tự đặc biệt',
                    }
                },

                // Thông điệp từ server
                create_system_link_success: 'Tạo system link thành công',
                edit_system_link_success: 'Chỉnh sửa thông tin system link thành công',

                system_link_url_exist: 'Url này đã được sử dụng',
            },

            system_component: {
                table: {
                    name: 'Tên component',
                    description: 'Mô tả về component',
                    link: 'Thuộc về trang',
                    roles: 'Những role có quyền'
                },
                add: 'Thêm system component mới',
                edit: 'Chỉnh sửa thông tin system component',
                delete: 'Xóa system component',
                validator: {
                    name: {
                        no_space: 'Tên component không được để trống',
                        no_special: 'Tên không được chứa ký tự đặc biệt',
                    },
                    description: {
                        no_space: 'Mô tả component không được để trống',
                        no_special: 'Mô tả không được chứa ký tự đặc biệt',
                    },
                },

                //Thông điệp trả về từ server
                create_system_component_success: 'Tạo system component thành công',
                show_system_component_success: 'Lấy dữ liệu system component thành công',
                edit_system_component_success: 'Chỉnh sửa system admin thành công',
                delete_system_component_success: 'Xóa system component thành công',

                system_component_name_invalid: 'Tên không hợp lệ',
                system_component_name_exist: 'Tên này đã được sử dụng cho 1 system component khác',
            }
        },
        super_admin: {
            organization_unit: {
                //Thông điệp trả về từ server
                create_department_success: 'Tạo đơn vị thành công',
                edit_department_success: 'Chỉnh sửa đơn vị thành công',
                delete_department_success: 'Xóa đơn vị thành công',

                department_name_exist: 'Tên đơn vị này đã được sử dụng',
                department_not_found: 'Không tìm thấy thông tin về đơn vị',
                department_has_user: 'Không thể xóa đơn vị này. Đơn vị đã có thành viên',
            },
            user: {
                // Thông điệp trả về từ server
                create_user_success: 'Tạo tài khoản người dùng thành công',
                edit_user_success: 'Chỉnh sửa thông tin tài khoản người dùng thành công',
                delete_user_success: 'Xóa tài khoản người dùng thành công',
                
                email_exist: 'Email đã được sử dụng cho một tài khoản khác',
                user_not_found: 'Không tìm thấy thông tin về tài khoản',
                department_not_found: 'Không tìm thấy thông tin về phòng ban của user',
            },
            role: {
                // Thông điệp trả về từ server
                create_role_success: 'Tạo role mới thành công',
                edit_role_success: 'Chỉnh sửa role thành công',
                delete_role_success: 'Xóa role thành công',
                
                role_name_exist: 'Tên cho phân quyền đã được sử dụng cho một phân quyền khác',
                role_dean_exist: 'Tên cho phân quyền của trưởng đơn vị này đã được sử dụng',
                role_vice_dean_exist: 'Tên cho phân quyền của phó đơn vị này đã được sử dụng',
                role_employee_exist: 'Tên cho phân quyền của nhân viên đơn vị này đã được sử dụng',
            },
            link: {
                // Thông điệp trả về từ server
                create_link_success: 'Tạo link thành công',
                edit_link_success: 'Chỉnh sửa link thành công',
                delete_link_success: 'Xóa link thành công',
    
                cannot_create_this_url: 'Không thể tạo link này',
                this_url_cannot_be_use: 'Url này không được phép sử dụng',
                url_exist: 'Url này đã đươc sử dụng',
            },
            component: {
                // Thông điệp trả về từ server
                edit_component_success: 'Chỉnh sửa component thành công',
            
                component_name_exist: 'Tên của component đã được sử dụng',
            },
        },

        
        not_found: {
            title: 'Không tìm thấy địa chỉ này!',
            content: 'Chúng tôi không thể tìm thấy địa chỉ mà bạn đang tìm kiếm',
            back_to_home: 'Quay lại trang chủ'
        },
        language: 'Thiết lập ngôn ngữ',
        alert: {
            title: 'Thông báo từ hệ thống',
            log_again: 'Đã xảy ra lỗi. Vui lòng đăng nhập lại!',
            access_denied: 'ACCESS DENIED! Truy cập trái phép! Vui lòng đăng nhập!',
            role_invalid: 'ROLE INVALID! Quyền truy cập không hợp lệ! Vui lòng thử lại sau!',
            page_access_denied: 'Phân quyền hiện tại của bạn không được phép truy cập vào trang này!',
            user_role_invalid: 'USER-ROLE INVALID! Quyền hiện tại của bạn đã bị thay đổi! Vui lòng đăng nhập lại!',
            acc_logged_out: 'JWT - phiên làm việc không chính xác. Vui lòng đăng nhập lại!',
            service_off: 'SERVICE OFF! Dịch vụ của công ty bạn đã tạm ngưng! Phiên làm việc của bạn sẽ bị tạm ngưng!',
            fingerprint_invalid: 'Phiên đăng nhập của bạn không đúng! Vui lòng đăng nhập lại!',
            service_permisson_denied: 'Bạn không có quyền gọi đến service',
            email_invalid: 'Email không chính xác',
            password_invalid: 'Mật khẩu không chính xác',
            wrong5_block: 'Bạn đã nhập sai mật khẩu quá 5 lần. Tài khoản này đã bị khóa!',
            acc_blocked: 'Tài khoản đã bị khóa',
            acc_have_not_role: 'Tài khoản chưa được phân quyền',
            reset_password_success: 'Reset mật khẩu thành công!',
            reset_password_faile: 'Reset mật khẩu thất bại!'
        },
        auth: {
            security: {
                label: 'Bảo mật',
                title: 'Thay đổi mật khẩu người dùng',
                old_password: 'Mật khẩu cũ',
                new_password: 'Mật khẩu mới',
                confirm_password: 'Xác thực mật khẩu'
            },
            login: 'Đăng nhập',
            logout: 'Đăng xuất',
            logout_all_account: 'Đăng xuất khỏi tất cả các thiết bị',
            profile: {
                label: 'Thông tin',
                title: 'Thông tin tài khoản người dùng',
                name: 'Tên người dùng',
                email: 'Địa chỉ email',
                password: 'Mật khẩu mới',
                confirm: 'Xác thực mật khẩu',
                edit_success: 'Chỉnh sửa thông tin người dùng thành công',
                edit_faile: 'Chỉnh sửa thông tin người dùng thất bại'
            },
        },

        confirm: {
            yes: 'CÓ',
            no: 'KHÔNG',
            no_data: 'Không có dữ liệu',
            field_invalid: "Giá trị trường nhập vào không hợp lệ. Vui lòng kiểm tra lại!",
            loading: 'Đang tải dữ liệu ...'
        },

        form: {
            property: 'Thuộc tính',
            value: 'Giá trị',
            required: 'Các trường thông tin bắt buộc',
            save: 'Lưu',
            close: 'Đóng',
            email: 'Email',
            password: 'Mật khẩu',
            new_password: 'Mật khẩu mới',
            confirm: 'Xác thực mật khẩu',
            description: 'Mô tả',
            reset_password: 'Thiết lập lại mật khẩu',
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
            employee_name: 'Tên nhân viên',
            employee_number: 'Mã nhân viên',
            total_salary: 'Tổng lương',
            month: 'Tháng',
            unit: 'Đơn vị',
            position: 'Chức vụ',
            no_data: 'Không có dữ liệu',
            start_date: 'Từ ngày',
            end_date: 'Đến ngày',
            hidden_column: 'Ẩn cột',
            choose_hidden_columns: 'Chọn cột muốn ẩn',
            hide_all_columns: 'Ẩn tất cả các cột',
        },

        modal: {
            update: 'Lưu thay đổi',
            close: 'Đóng',
            create: 'Thêm mới',
            note: 'là các trường bắt buộc phải nhập',
            add_success: 'Thêm mới thành công',
            add_faile: 'Thêm mới thất bại',
        },
        page: {
            unit: 'Đơn vị',
            position: 'Chức vụ',
            month: 'Tháng',
            status: 'Trạng thái',
            staff_number: 'Mã nhân viên',
            add_search: 'Tìm kiếm',
            number_decisions: 'Số quyết định',
            all_unit: 'Chọn tất cả các đơn vị',
            non_unit: 'Chọn đơn vị',
            all_position: 'Chọn tất cả các chức vụ',
            non_position: 'Chọn chức vụ',
            all_status: 'Chọn tất cả các trạng thái',
            non_status: 'Chọn trạng thái'
        },

        menu: {
            home: 'Trang chủ',
            manage_system: 'Quản lý hệ thống',
            manage_company: 'Quản lý doanh nghiệp/công ty',
            manage_department: 'Quản lý cơ cấu tổ chức',
            manage_user: 'Quản lý người dùng',
            manage_role: 'Quản lý phân quyền',
            manage_link: 'Quản lý trang',
            manage_component: 'Quản lý các componentUI',
            manage_document: 'Quản lý tài liệu',

            task_template: 'Mẫu Công Việc',
            cocautochuc: 'Cơ Cấu Tổ Chức',
            taskmanagement: 'Quản Lý Công Việc',
            manageDocument: 'Quản lý văn bản',
            manageDocumentType: 'Quản lý loại văn bản',

            manage_employee: 'Quản lý nhân sự',
            manage_holiday: 'Kế hoạch làm việc',
            manage_training: 'Quản lý đào tạo',
            account: 'Tài khoản',
            manage_unit: 'Quản lý nhân sự các đơn vị',
            add_employee: 'Thêm nhân viên',
            list_employee: 'Quản lý thông tin nhân viên',
            detail_employee: 'Thông tin cá nhân',
            update_employee: 'Cập nhật thông tin cá nhân',
            dashboard_employee: 'DashBoard quản lý nhân sự',
            discipline: 'Quản lý khen thưởng - kỷ luật',
            annual_leave: 'Quản lý nghỉ phép',
            salary_employee: 'Quản lý lương nhân viên',
            time_keeping: 'Chấm công nhân viên',
            list_education: 'Chương trình đào tạo bắt buộc',
            training_plan: 'Quản lý khoá đào tạo',

            manage_kpi: 'Quản lý KPI',
            kpi_unit_create: 'Khởi tạo KPI đơn vị',
            kpi_unit_evaluate: 'Dữ liệu KPI đơn vị',
            kpi_unit_overview: 'Tổng quan KPI đơn vị',
            kpi_unit_dashboard: 'Dashboard KPI đơn vị',
            kpi_unit_manager: 'Quản lý KPI đơn vị',
            kpi_member_manager: 'Quản lý KPI nhân viên',
            kpi_member_dashboard:'DashBoard KPI nhân viên',
            kpi_personal_create: 'Khởi tạo KPI cá nhân',
            kpi_personal_evaluate: 'Dữ liệu KPI cá nhân',
            kpi_personal_overview: 'Tổng quan KPI cá nhân',
            kpi_personal_dashboard: 'Dashboard KPI cá nhân',
            kpi_personal_manager: 'Quản lí KPI cá nhân',

            notifications: 'Thông báo',

            tasks: 'Quản lý công việc',
            task_management: 'Xem danh sách công việc',
            task_management_dashboard: 'Dashboard công việc',
        },

        manage_system: {
            turn_on: 'Bật',
            turn_off: 'Tắt',
            log: 'Trạng thái ghi lịch sử hoạt động'
        },

        manage_company: {
            add: 'Thêm',
            add_title: 'Thêm doanh nghiệp mới',
            name: 'Tên doanh nghiệp',
            short_name: 'Tên ngắn doanh nghiệp',
            description: 'Mô tả về doanh nghiệp',
            on_service: 'Bật dịch vụ',
            off_service: 'Tắt dịch vụ',
            turning_on: 'Đang bật dịch vụ',
            turning_off: 'Đang tắt dịch vụ',
            info: 'Thông tin về doanh nghiệp',
            edit: 'Chỉnh sửa thông tin doanh nghiệp',
            super_admin: 'Email tài khoản super admin của doanh nghiệp',
            add_success: 'Tạo doanh nghiệp thành công',
            add_faile: 'Tạo doanh nghiệp thất bại',
            edit_success: 'Chỉnh sửa thông tin thành công',
            edit_faile: 'Chỉnh sửa thông tin thất bại',
            log: 'Ghi log',
            on: 'Bật',
            off: 'Tắt',
            service: 'Dịch vụ'
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
            no_parent: 'Không có đơn vị cha',
            roles_of_department: 'Các chức danh của đơn vị',
            dean_name: 'Tên chức danh cho trưởng đơn vị',
            dean_example: 'VD: Trưởng phòng tài chính',
            vice_dean_name: 'Tên chức danh cho phó đơn vị',
            vice_dean_example: 'VD: Phó phòng tài chính',
            employee_name: 'Tên chức danh cho nhân viên đơn vị',
            employee_example: 'Nhân viên phòng tài chính',
            add_with_parent: 'Tạo đơn vị mới với đơn vị cha là',
            delete: 'Xóa đơn vị',
            add_success: 'Tạo đơn vị thành công',
            add_faile: 'Tạo đơn vị thất bại',
            edit_success: 'Chỉnh sửa thông tin thành công',
            edit_faile: 'Chỉnh sửa thông tin thất bại',
        },

        manage_role: {
            add: 'Thêm',
            add_title: 'Thêm phân quyền mới',
            description: 'Mô tả về phân quyền',
            info: 'Thông tin về phân quyền',
            name: 'Tên phân quyền',
            extends: 'Kế thừa phân quyền',
            users: 'Những người dùng có phân quyền',
            edit: 'Chỉnh sửa thông tin phân quyền',
            delete: 'Xóa phân quyền',
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
            delete: 'Xóa tài khoản',
            add_success: 'Tạo tài khoản thành công',
            add_faile: 'Tạo tài khoản thất bại',
            edit_success: 'Chỉnh sửa thành công',
            edit_faile: 'Chỉnh sửa thất bại',
            roles: 'Phân quyền được cấp',
            name: 'Tên người dùng',
            email: 'Địa chỉ email',
            status: 'Trạng thái tài khoản'
        },

        manage_link: {
            add: 'Thêm',
            add_title: 'Thêm link mới cho trang web',
            url: 'Đường link của trang web',
            description: 'Mô tả về trang web',
            components: 'Chứa các component',
            roles: 'Những role được truy cập',
            info: 'Thông tin về trang web',
            edit: 'Chỉnh sửa thông tin',
            delete: 'Xóa link',
            add_success: 'Thêm mới thành công',
            add_faile: 'Thêm mới thất bại',
            edit_success: 'Chỉnh sửa thành công',
            edit_faile: 'Chỉnh sửa thất bại',
            category: 'Danh mục'
        },

        manage_component: {
            add: 'Thêm',
            add_title: 'Thêm component mới',
            info: 'Thông tin về component',
            name: 'Tên của component',
            description: 'Mô tả về component',
            link: 'Thuộc về trang nào',
            edit: 'Chỉnh sửa thông tin về component',
            delete: 'Xóa component',
            roles: 'Những role có component này',
            add_success: 'Thêm mới thành công',
            add_faile: 'Thêm mới thất bại',
            edit_success: 'Chỉnh sửa thành công',
            edit_faile: 'Chỉnh sửa thất bại',
        },
        // Quản lý lương nhân viên
        salary_employee: {
            list_salary: 'Danh sách bảng lương nhân viên',
            add_salary: 'Thêm bảng lương',
            add_salary_title: 'Thêm bảng lương nhân viên',
            edit_salary: 'Chỉnh sửa bảng lương nhân viên',
            delete_salary: 'Xoá bảng lương',
            add_by_hand: 'Thêm bằng tay',
            add_import: 'Import file excel',
            add_by_hand_title: 'Thêm một bảng lương',
            add_import_title: 'Thêm nhiều bảng lương',
            main_salary: 'Tiền lương chính',
            other_salary: 'Các loại lương thưởng khác',
            name_salary: 'Tên lương thưởng',
            money_salary: 'Số tiền',
            add_more_salary: 'Thêm lương thưởng khác',
            add_new_salary: 'Thêm mới bảng lương',
        },
        // Quản lý nghỉ phép
        sabbatical: {
            list_sabbatical: 'Danh sách đơn xin nghỉ',
            add_sabbatical: 'Thêm đơn xin nghỉ',
            add_sabbatical_title: 'Thêm mới đơn xin nghỉ phép',
            edit_sabbatical: 'Chỉnh sửa thông tin nghỉ phép',
            delete_sabbatical: 'Xoá thông tin nghỉ phép',
            start_date: 'Ngày bắt đầu',
            end_date: 'Ngày kết thúc',
            reason: 'Lý do',
            check_null_msnv: 'Mã nhân viên không được để trống',
            check_msnv: 'Mã nhân viên không tồn tại',
            check_start_day: 'Ngày bắt đầu không được để trống',
            check_end_day: 'Ngày kết thúc không được để trống',
            check_reason: 'Lý do không được để trống',
            pass: 'Đã chấp nhận',
            faile: 'Không chấp nhận',
            process: 'Chờ phê duyệt',
            all: '--Tất cả--',
            edit_succes: 'Chỉnh sửa thành công',
            edit_faile: 'Chỉnh sửa thất bại',
        },
        // Quản lý khen thưởng, kỷ luật
        discipline: {
            list_discipline: 'Danh sách kỷ luật',
            list_discipline_title: 'Danh sách nhân viên bị kỷ luật',
            add_discipline: 'Thêm kỷ luật',
            add_discipline_title: 'Thêm mới kỷ luật',
            edit_discipline: 'Chỉnh sửa thông tin kỷ luật',
            delete_discipline: 'Xoá thông tin kỷ luật',
            start_date: 'Ngày có hiệu lực',
            end_date: 'Ngày hết hiệu lực',
            discipline_forms: 'Hình thức kỷ luật',
            reason_discipline: 'Lý do kỷ luật',
            check_null_msnv: 'Bạn chưa nhập mã nhân viên',
            check_msnv: 'Mã số nhân viên không tồn tại',
            check_number: 'Bạn chưa nhập số quyết định',
            check_unit: 'Bạn chưa nhập cấp ra quyết định',
            check_start_day: 'Bạn chưa nhập ngày có hiệu lực',
            check_end_day: 'Bạn chưa nhập ngày hết hiệu lực',
            check_reason_discipline: 'Bạn chưa nhập lý do kỷ luật',
            check_type_discipline: 'Bạn chưa nhập hình thức kỷ luật',
            list_praise: 'Danh sách khen thưởng',
            list_praise_title: 'Danh sách nhân viên được khen thưởng',
            add_praise: 'Thêm khen thưởng',
            add_praise_title: 'Thêm mới khen thưởng',
            edit_praise: 'Chỉnh sửa thông tin khen thưởng',
            delete_praise: 'Xoá thông tin khen thưởng',
            decision_day: 'Ngày ra quyết định',
            decision_unit: 'Cấp ra quyết định',
            reward_forms: 'Hình thức khen thưởng',
            reason_praise: 'Thành tích (Lý do)',
        },
        // Quản lý nhân sự các đơn vị
        manage_unit: {
            list_unit: 'Danh sách các đơn vị',
            list_employee_unit: 'Danh sách nhân viên đơn vị',
            edit_unit: 'Chỉnh sửa nhân sự đơn vị',
            edit_sucsess: 'Chỉnh sửa nhân sự đơn vị thành công',
            edit_faile: 'Chỉnh sửa nhân sự đơn vị thất bại',
            dean_unit:'Trưởng đơn vị',
            vice_dean_unit:'Phó đơn vị',
            employee_unit: 'Nhân viên đơn vị',
            email_employee: 'Email nhân viên',
            add_employee_unit:'Thêm nhân viên vào đơn vị',
        },
        // Quản lý thông tin nhân viên
        manage_employee: {
            note_page_personal: 'Tôi xin cam đoan những lời khai trên đây là đúng sự thật và chịu trách nhiệm cho những lời khai này.',
            contact_other: '(Những thông tin khác vui lòng liên hệ các bên liên quan để được xử lý)',
            update_infor_personal: 'Cập nhật thông tin nhân viên',
            no_data_personal: 'Chưa có thông tin cá nhân',

            menu_basic_infor: 'Thông tin cơ bản',
            menu_general_infor: 'Thông tin chung',
            menu_contact_infor: 'Thông tin liên hệ',
            menu_education_experience: 'Học vấn - Kinh nghiệm',
            menu_diploma_certificate: 'Bằng cấp - Chứng chỉ',
            menu_account_tax: 'Tài khoản - Thuế',
            menu_insurrance_infor: 'Thông tin bảo hiểm',
            menu_contract_training: 'Hợp đồng - Đào tạo',
            menu_reward_discipline: 'Khen thưởng - Kỷ luật',
            menu_salary_sabbatical: 'Lịch sử lương - Nghỉ phép',
            menu_attachments: 'Tài liệu đính kèm',
            menu_general_infor_title: 'Thông tin chung của nhân viên',
            menu_contact_infor_title: 'Thông tin liên hệ của nhân viên',
            menu_education_experience_title: 'Trình độ học vấn - kinh nghiệm làm việc',
            menu_diploma_certificate_title: 'Bằng cấp - Chứng chỉ',
            menu_account_tax_title: 'Tài khoản ngân hàng - Thuế thu nhập cá nhân',
            menu_insurrance_infor_title: 'Thông tin bảo hiểm',
            menu_contract_training_title: 'Hợp đồng lao động - Quá trình đào tạo',
            menu_reward_discipline_title: 'Khen thưởng - Kỷ luật',
            menu_salary_sabbatical_title: 'Lịch sử tăng giảm lương - Thông tin nghỉ phép',
            menu_attachments_title: 'Tài liệu đính kèm',
            add_staff: 'Thêm nhân viên',
            staff_number: 'Mã số nhân viên',
            full_name: 'Họ và tên',
            attendance_code: 'Mã số chấm công',
            gender: 'Giới tính',
            male: 'Nam',
            female: 'Nữ',
            date_birth: 'Ngày sinh',
            place_birth: 'Nơi sinh',
            email: 'Email',
            email_company: 'Email công ty',
            relationship: 'Tình trạng hôn nhân',
            single: 'Độc thân',
            married: 'Đã kết hôn',
            upload: 'Chọn ảnh',
            id_card: 'Số CMND/Hộ chiếu',
            date_issued: 'Ngày cấp',
            issued_by: 'Nơi cấp',
            ethnic: 'Dân tộc',
            nationality: 'Quốc tịch',
            religion: 'Tôn giáo',
            mobile_phone: 'Điện thoại di động',
            mobile_phone_1: 'Điện thoại di động 1',
            mobile_phone_2: 'Điện thoại di động 2',
            personal_email_1: 'Email cá nhân 1',
            personal_email_2: 'Email cá nhân 2',
            home_phone: 'Điện thoại nhà riêng',
            emergency_contact: 'Liên hệ khẩn cấp với ai',
            nexus: 'Quan hệ',
            address: 'Địa chỉ',
            permanent_address: 'Hộ khẩu thường trú',
            current_residence: 'Chỗ ở hiện tại',
            wards: 'Xã/Phường',
            district: 'Quận/Huyện',
            province: 'Tỉnh/Thành phố',
            nation: 'Quốc gia',

            academic_level: 'Trình độ học vấn',
            educational_level: 'Trình độ văn hoá',
            language_level: 'Trình độ ngoại ngữ',
            qualification: 'Trình độ chuyên môn',
            intermediate_degree: 'Trung cấp',
            colleges: 'Cao đẳng',
            university: 'Đại học',
            master_degree: 'Thạc sỹ',
            phd: 'Tiến sỹ',
            unavailable: 'Không có',
            work_experience: 'Kinh nghiệm làm việc',
            unit: 'Đơn vị công tác',
            from_month_year: 'Từ tháng/năm',
            to_month_year: 'Đến tháng/năm',
            edit_experience: 'Chỉnh sửa kinh nghiệm làm việc',
            add_experience: 'Thêm mới kinh nghiệm làm việc',

            diploma: 'Bằng cấp',
            certificate: 'Chứng chỉ',
            name_diploma: 'Tên bằng cấp',
            name_certificate: 'Tên chứng chỉ',
            diploma_issued_by: 'Nơi đào tạo',
            graduation_year: 'Năm tốt nghiệp',
            ranking_learning: 'Xếp loại',
            attached_files: 'File đính kèm',
            end_date_certificate: 'Ngày hết hạn',
            edit_certificate: 'Chỉnh sửa chứng chỉ',
            edit_diploma: 'Chỉnh sửa bằng cấp',
            add_certificate: 'Thêm mới chứng chỉ',
            add_diploma: 'Thêm mới bằng cấp',
            excellent: 'Xuất sắc',
            very_good: 'Giỏi',
            good: 'Khá',
            average_good: 'Trung bình khá',
            ordinary: 'Trung bình',


            bank_account: 'Tài khoản ngân hàng',
            personal_income_tax: 'Thuế thu nhập cá nhân',
            account_number: 'Số tài khoản',
            bank_name: 'Tên ngân hàng',
            bank_branch: 'Chi nhánh',
            tax_number: 'Mã số thuế',
            representative: 'Người đại diện',
            day_active: 'Ngày hoạt động',
            managed_by: 'Quản lý bởi',

            bhyt: 'Bảo hiểm y tế',
            number_BHYT: 'Mã số BHYT',
            bhxh: 'Bảo hiểm xã hội',
            number_BHXH: 'Mã số BHXH',
            bhxh_process: 'Quá trình đóng bảo hiểm xã hội',
            edit_bhxh: 'Chỉnh sửa bảo hiểm xã hội',
            add_bhxh: 'Thêm mới bảo hiểm xã hội',

            labor_contract: 'Hợp đồng lao động',
            training_process: 'Quá trình đào tạo',
            name_contract: 'Tên hợp đồng',
            type_contract: 'Loại hợp đồng',
            start_date: 'Ngày có hiệu lực',
            course_name: 'Tên khoá học',
            start_day: 'Ngày bắt đầu',
            end_date: 'Ngày kết thúc',
            type_education: 'Loại đào tạo',
            cost: 'Chi phí',
            edit_contract: 'Chỉnh sửa hợp đồng lao động',
            add_contract: 'Thêm mới hợp đồng lao động',

            list_attachments: 'Danh sách tài liệu đính kèm',
            attachments_code: 'Nơi lưu trữ bản cứng',
            file_name: 'Tên tài liệu',
            number: 'Số lượng',
            add_default: 'Mặc định',
            add_default_title: 'Thêm các tài liệu mặc định',
            edit_file: 'Chỉnh sửa tài liệu đính kèm',
            add_file: 'Thêm tài liệu đính kèm',
            no_submitted: 'Chưa nộp',
            submitted: 'Đã nộp',
            returned: 'Đã trả lại',
            no_files: 'Chưa có file',
            disc_diploma: 'Bằng tốt nghiệp trình độ học vấn cao nhất',
            curriculum_vitae: 'Sơ yếu lý lịch',
            disc_curriculum_vitae: 'Sơ yếu lý lịch có công chứng',
            img: 'Ảnh',
            disc_img: 'Ảnh 4x6 ',
            copy_id_card: 'Bản sao CMND/Hộ chiếu',
            disc_copy_id_card: 'Bản sao chứng minh thư nhân dân hoặc hộ chiếu có công chứng',
            health_certificate: 'Giấy khám sức khoẻ',
            disc_health_certificate: 'Giấy khám sức khoẻ có dấu đỏ',
            birth_certificate: 'Giấy khai sinh',
            disc_birth_certificate: 'Giấy khái sinh có công chứng',
            job_application: 'Đơn xin việc',
            disc_job_application: 'Đơn xin việc viết tay',
            commitment: 'Cam kết',
            disc_commitment: 'Giấy cam kết làm việc',
            temporary_residence_card: 'Tạm trú tạm vắng',
            disc_temporary_residence_card: 'Giấy xác nhận tạm trú tạm vắng',

            Reward: 'Khen thưởng',
            discipline: 'Kỷ luật',
            historySalary: 'Lịch sử tăng giảm lương',
            sabbatical: 'Thông tin nghỉ phép',
        },
        notification: {
            add: 'Thêm mới',
            add_title: 'Thêm thông báo mới',
            added: 'Thông báo đã tạo',
            receivered: 'Thông báo đã nhận',
            add_success: 'Tạo thông báo mới thành công',
            add_faile: 'Tạo thông báo thất bại',
            edit_success: 'Chỉnh sửa thông báo thành công',
            edit_faile: 'Chỉnh sửa thông báo thất bại',
            departments: 'Thông báo tới đơn vị/phòng ban',
            users: 'Thông báo đến người dùng cụ thể',
            news: 'Thông báo mới',
            see_all: 'Xem tất cả',
            delete: 'Xóa thông báo'
        },
        // Quản lý kê hoạch làm việc
        holiday: {
            start_date: 'Ngày bắt đầu',
            end_Date: 'Ngày kết thúc',
            description: 'Mô tả lịch nghỉ',
            check_start_Date: 'Bạn chưa nhập ngày bắt đầu',
            check_end_Date: 'Bạn chưa nhập ngày kết thúc',
            check_description: 'Bạn chưa nhập mô tả lịch nghỉ'
        },


        // Task template
        task_template: {
            search: 'Tìm kiếm',
            add: 'Thêm mới',
            confirm: 'Xác nhận',
            confirm_title: 'Bạn chắc chắn muốn xóa mẫu công việc này?',
            error_title: 'Không thể xóa mẫu công việc này do đã được sử dụng.',
            name: 'Tên mẫu',
            unit: 'Đơn vị',
            tasktemplate_name: 'Tên mẫu công việc',
            description: 'Mô tả',
            count: 'Số lần sử dụng',
            creator: 'Người tạo mẫu',
            unit: 'Đơn vị',
            action: 'Hành động'
        },

        // Module KPI đơn vị
        organizational_unit_kpi_set: {
            create_organizational_unit_kpi_set: { // Module chính
                // Nhóm dành cho các thông tin chung
                general_information: {
                    general_information: 'KPI đơn vị',
                    save: 'Lưu chỉnh sửa',
                    confirm: 'Xác nhận',
                    edit: 'Chỉnh sửa',
                    delete: 'Xóa KPI này',
                    cancel: 'Hủy',
                    approve: 'Kích hoạt',
                    cancel_approve: 'Bỏ kích hoạt',
                    add_target: 'Thêm mục tiêu',
                    target: 'mục tiêu',
                    edit_success: 'Chỉnh sửa thành công',
                    edit_failure: 'Chỉnh sửa không thành công',
                    confirm_delete_success: 'Bạn chắc chắn muốn xóa toàn bộ KPI này?',
                    delete_success: 'Xóa KPI thành công'
                },
                time: 'Thời gian',
                initialize_kpi_newmonth: 'Khởi tạo KPI tháng mới',
                approve: 'Kích hoạt',
                cancel_approve: 'Bỏ kích hoạt',

                weight_status: {
                    weight_total: 'Tổng trọng số',
                    not_satisfied: 'Chưa thỏa mãn',
                    satisfied: 'Thỏa mãn'
                },

                // Nhóm dành cho các trạng thái tập KPI
                kpi_status: {
                    not_approved: 'Chưa kích hoạt',
                    approved: 'Đã kich hoạt'
                },

                // Nhóm dành cho các trạng thái mục tiêu KPI
                check_status_target: {
                    not_approved: 'Chưa phê duyệt',
                    edit_request: 'Yêu cầu chỉnh sửa',
                    activated: 'Đã kích hoạt',
                    finished: 'Đã kết thúc'
                },
                
                // Nhóm dành cho table
                target_list: 'Danh sách mục tiêu',
                add_target: 'Thêm mục tiêu',
                no_: 'Stt',
                target_name: 'Tên mục tiêu',
                parents_target: 'Mục tiêu cha',
                evaluation_criteria: 'Tiêu chí đánh giá',
                weight: 'Trọng số',
                action: 'Hành động',
                not_initialize: 'Chưa khởi tạo KPI tháng ',

                // Nhóm dành cho các handle
                request_approval_kpi: {
                    approve_already: 'KPI đã kích hoạt!',
                    approve: 'Bạn chắc chắn muốn kích hoạt KPI này?',
                    not_enough_weight: 'Tổng trọng số phải bằng 100',
                    approve_success: 'Kích hoạt KPI thành công',
                    success: 'Chỉnh sửa trạng thái Kpi thành công'
                },
                cancel_approve: {
                    cancel: 'Bạn chắc chắn muốn hủy kích hoạt KPI này?',
                    success: 'Hủy kích hoạt KPI thành công'
                },
                action_title: {
                    edit: 'Chỉnh sửa',
                    content: 'Đây là mục tiêu mặc định (nếu cần thiết có thể sửa trọng số)',
                    delete: 'Xóa'
                },
                edit_target: {
                    approving: 'KPI đang được phê duyệt, Bạn không thể chỉnh sửa!',
                    activated: 'KPI đã được kích hoạt, Bạn không thể chỉnh sửa!'
                },
                delete_kpi: {
                    kpi: 'Bạn chắc chắn muốn xóa mục tiêu KPI này?',
                    approving: 'KPI đã kích hoạt, bạn không thể xóa!',
                    delete_success: 'Xóa mục tiêu KPI thành công'
                },
            },

            create_organizational_unit_kpi_modal: { // Module con
                // Nhóm dành cho modal
                create_organizational_unit_kpi: 'Thêm mục tiêu KPI đơn vị',
                name: 'Tên mục tiêu',
                parents: 'Mục tiêu cha',
                evaluation_criteria: 'Tiêu chí đánh giá',
                weight: 'Trọng số',
                success: 'Thêm mục tiêu KPI thành công',
                failure: 'Bạn chưa nhập đủ thông tin',

                // Nhóm dành cho validate
                validate_name: {
                    empty: 'Tên mục tiêu không được bỏ trống',
                    less_than_4: 'Tên mục tiêu không được ít hơn 4 ký tự',
                    more_than_50: 'Tên mục tiêu không được nhiều hơn 50 ký tự',
                    special_character: 'Tên mục tiêu không được chưa ký tự đặc biệt'

                },
                validate_criteria: 'Tiêu chí không được để trống',
                validate_weight: {
                    empty: 'Trọng số không được để trống',
                    less_than_0: 'Trọng số không được nhỏ hơn 0',
                    greater_than_100: 'Trọng số không được lớn hơn 100'
                }
            },

            kpi_organizational_unit_manager:{
                index:'STT',
                time:'Thời gian',
                employee_name:'Tên nhân viên',
                target_number:'Số lượng mục tiêu',
                kpi_status:'Trạng thái KPI',
                result:'Kết quả',
                approve:'Phê duyệt',
                evaluate:'Đánh giá'
            },

            create_organizational_unit_kpi_set_modal: {// Module con
                // Nhóm dành cho modal
                initialize_kpi_set: 'Khởi tạo KPI đơn vị',
                organizational_unit: 'Đơn vị',
                month: 'Tháng',
                default_target: 'Mục tiêu mặc định',
                success: 'Khởi tạo KPI thành công',
                failure: 'Bạn chưa nhập đủ thông tin'
            },

            edit_target_kpi_modal: { // Mudule con
                // Nhóm dành cho modal
                edit_organizational_unit_kpi: 'Chỉnh sửa mục tiêu KPI đơn vị',
                name: 'Tên mục tiêu',
                parents: 'Mục tiêu cha',
                evaluation_criteria: 'Mô tả tiêu chí đánh giá',
                weight: 'Trọng số',
                success: 'Chỉnh sửa mục tiêu KPI thành công',
                failure: 'Bạn chưa nhập đủ thông tin'
            },

            //Thông điệp khác trả về từ server
            get_by_role_success: 'Lấy KPI đơn vị hiện tại qua vai trò thành công',
            get_parent_by_unit_success: 'Lấy KPI đơn vị của đơn vị cha thành công',
        },

        employee_kpi_set: {
            create_employee_kpi_set: { // Module chính
                // Nhóm dành cho các thông tin chung
                general_information: {
                    general_information: 'KPI cá nhân tháng',
                    save: 'Lưu chỉnh sửa',
                    edit: 'Chỉnh sửa',
                    delete: 'Xóa KPI này',
                    cancel: 'Hủy',
                    edit_success: 'Chỉnh sửa thành công',
                    edit_failure: 'Chỉnh sửa không thành công',
                    delete_success: 'Xóa KPI thành công'
                },
                time: 'Thời gian',
                approver: 'Người phê duyệt',
                weight: {
                    weight_total: 'Tổng trọng số',
                    not_satisfied: 'Chưa thỏa mãn',
                    satisfied: 'Thỏa mãn'
                },
                initialize_kpi_newmonth: 'Khởi tạo KPI tháng mới',
                request_approval: 'Yêu cầu phê duyệt',
                cancel_request_approval: 'Hủy yêu cầu phê duyệt',

                // Nhóm dành cho các trạng thái tập KPI
                kpi_status: {
                    status: 'Trạng thái KPI',
                    setting_up: 'Đang thiết lập',
                    awaiting_approval: 'Chờ phê duyệt',
                    activated: 'Đã kích hoạt',
                    finished: 'Đã kết thúc'
                },

                // Nhóm dành cho các trạng thái mục tiêu KPI
                check_status_target: {
                    not_approved: 'Chưa phê duyệt',
                    edit_request: 'Yêu cầu chỉnh sửa',
                    activated: 'Đã kích hoạt',
                    finished: 'Đã kết thúc'
                },
                
                // Nhóm dành cho table
                target_list: 'Danh sách mục tiêu',
                add_target: 'Thêm mục tiêu',
                no_: 'Stt',
                target_name: 'Tên mục tiêu',
                parents_target: 'Mục tiêu cha',
                evaluation_criteria: 'Tiêu chí đánh giá',
                max_score: 'Điểm tối đa',
                status: 'Trạng thái',
                action: 'Hành động',
                not_initialize: 'Chưa khởi tạo KPI tháng ',

                // Nhóm dành cho phản hồi
                submit: {
                    feedback: 'Phản hồi',
                    send_feedback: 'Gửi phản hồi',
                    cancel_feedback: 'Hủy',
                },

                // Nhóm dành cho các handle
                handle_edit_kpi: {
                    approving: 'KPI đang được phê duyệt, bạn không thể chỉnh sửa. Nếu muốn sửa đổi hãy liên hệ với quản lý của bạn!',
                    activated: 'KPI đã được kích hoạt, bạn không thể chỉnh sửa. Nếu muốn sửa đổi hãy liên hệ với quản lý của bạn!'
                },
                request_approval_kpi: {
                    approve: 'Bạn chắc chắn muốn quản lý phê quyệt KPI này?',
                    not_enough_weight: 'Tổng trọng số phải bằng 100'
                },
                cancel_approve: {
                    cancel: 'Bạn chắc chắn muốn hủy yêu cầu phê duyệt KPI này?',
                    activated: 'KPI đã được kích hoạt bạn không thể hủy bỏ yêu cầu phê duyệt, nếu muốn sửa đổi hãy liên hệ với quản lý của bạn!'
                },
                action_title: {
                    edit: 'Chỉnh sửa',
                    content: 'Đây là mục tiêu mặc định (nếu cần thiết có thể sửa trọng số)',
                    delete: 'Xóa'
                },
                edit_target: {
                    approving: 'KPI đang được phê duyệt, Bạn không thể chỉnh sửa!',
                    activated: 'KPI đã được kích hoạt, Bạn không thể chỉnh sửa!'
                },
                delete_kpi: {
                    kpi: 'Bạn chắc chắn muốn xóa KPI này?',
                    kpi_target: 'Bạn chắc chắn muốn xóa mục tiêu KPI này?',
                    approving: 'KPI đang được phê duyệt, bạn không thể xóa!',
                    activated: 'KPI đã được kích hoạt, bạn không thể xóa!',
                    delete_success: 'Xóa mục tiêu KPI thành công'
                },
            },

            create_employee_kpi_modal: { // Module con
                // Nhóm dành cho modal
                create_employee_kpi: 'Thêm mục tiêu KPI cá nhân',
                name: 'Tên mục tiêu',
                parents: 'Mục tiêu cha',
                evaluation_criteria: 'Tiêu chí đánh giá',
                weight: 'Trọng số',
                success: 'Thêm mục tiêu KPI thành công',
                failure: 'Bạn chưa nhập đủ thông tin',

                // Nhóm dành cho validate
                validate_name: {
                    empty: 'Tên mục tiêu không được bỏ trống',
                    less_than_4: 'Tên mục tiêu không được ít hơn 4 ký tự',
                    more_than_50: 'Tên mục tiêu không được nhiều hơn 50 ký tự',
                    special_character: 'Tên mục tiêu không được chưa ký tự đặc biệt'

                },
                validate_criteria: 'Tiêu chí không được để trống',
                validate_weight: {
                    empty: 'Trọng số không được để trống',
                    less_than_0: 'Trọng số không được nhỏ hơn 0',
                    greater_than_100: 'Trọng số không được lớn hơn 100'
                }
            },

            kpi_member_manager:{
                index:'STT',
                time:'Thời gian',
                employee_name:'Tên nhân viên',
                target_number:'Số lượng mục tiêu',
                kpi_status:'Trạng thái KPI',
                result:'Kết quả',
                approve:'Phê duyệt',
                evaluate:'Đánh giá'
            },

            create_employee_kpi_set_modal: {// Module con
                // Nhóm dành cho modal
                initialize_kpi_set: 'Khởi tạo KPI cá nhân',
                organizational_unit: 'Đơn vị',
                month: 'Tháng',
                approver: 'Người phê duyệt',
                default_target: 'Mục tiêu mặc định',
                success: 'Khởi tạo KPI thành công',
                failure: 'Bạn chưa nhập đủ thông tin'
            },

            edit_employee_kpi_modal: { // Mudule con
                // Nhóm dành cho modal
                edit_employee_kpi: 'Chỉnh sửa mục tiêu KPI cá nhân',
                name: 'Tên mục tiêu',
                parents: 'Mục tiêu cha',
                evaluation_criteria: 'Mô tả tiêu chí đánh giá',
                weight: 'Trọng số',
                success: 'Chỉnh sửa mục tiêu KPI thành công',
                failure: 'Bạn chưa nhập đủ thông tin'
            }
        },

        task: {
            task_management: {
                create_task_success: 'Tạo công việc mới thành công',
                delete_success: 'Xóa công việc thành công',
                edit_status_of_task_success: 'Chỉnh sửa trạng thái công việc thành công',

                create_task_fail: 'không thể tạo công việc mới',
                delete_fail: 'Không thể xóa công việc này',
                edit_status_of_task_fail: 'Không thể thay đổi trạng thái công việc',
            },
            task_perform: {
                // TODO: code_mesage_task_perform
                create_result_task_success: 'Đánh giá xong kết quả thực hiện công việc',
                edit_redult_task_success: 'Chỉnh sửa thành công kết quả đánh giá',

                create_result_task_fail: 'Không đánh giá được kết quả thực hiện công việc',
                edit_redult_task_fail: 'Chỉnh sửa thất bại kết quả đánh giá',
                
            },
            task_template: {
                // TODO: code_mesage_task_template
            }
        },

        kpi:{
            employee:{
                get_kpi_by_member_success:'Lấy KPI thành viên theo người thiết lập thành công',
                get_kpi_by_member_fail:'Lấy KPI thành theo người thiết lập viên lỗi',
                get_kpi_responsible_success:'Lấy tất cả KPI cá nhân của người thực hiện trong công việc thành công',
                get_kpi_responsible_fail:'Lấy tất cả KPI cá nhân của người thực hiện trong công việc lỗi',
            },
            evaluation:{
                get_all_kpi_member_success: 'Lấy tất cả KPI member thành công',
                get_all_kpi_member_fail: 'Lấy tất cả KPI nhân viên lỗi',
                get_kpi_targets_success: 'Lấy mục tiêu KPI nhân viên thành công',
                get_kpi_targets_fail: 'Lấy mục tiêu KPI nhân viên lỗi',
                get_all_kpi_member_by_id_success: 'Lấy tất cả KPI nhân viên theo Id thành công',
                get_all_kpi_member_by_id_fail: 'Lấy tất cả KPI nhân viên theo Id lỗi',
                get_all_kpi_member_by_month_success:'Lấy tất cả KPI nhân viên theo tháng thành công',
                get_all_kpi_member_by_month_fail:'Lấy tất cả KPI nhân viên theo tháng lỗi',                
                approve_all_kpi_target_success: 'Phê duyệt KPI nhân viên thành công',
                approve_all_kpi_target_fail: 'Phê duyệt KPI nhân viên lỗi',
                edit_kpi_target_member_success: 'Chỉnh sửa mục tiêu KPI nhân viên thành công',
                edit_kpi_target_member_fail: 'Chỉnh sửa mục tiêu KPI nhân viên lỗi',
                edit_status_target_success:'Chỉnh sửa trạng thái mục tiêu thành công',
                edit_status_target_fail:'Chỉnh sửa trạng thái mục tiêu lỗi',
                get_task_by_id_success:'Lấy danh sách công việc theo Id thành công',
                get_task_by_id_fail:'Lấy danh sách công việc theo Id lỗi',
                get_system_point_success:'Lấy điểm hệ thống cho KPI thành công',
                get_system_point_fail:'Lấy điểm hệ thống cho KPI lỗi',
                set_point_kpi_success:'Chấm điểm KPI nhân viên thành công',
                set_point_kpi_fail:'Chấm điểm KPI nhân viên lỗi',
            
            },
            organizational_unit:{
                get_kpi_unit_success:'Lấy danh sách KPI đơn vị thành công',
                get_kpi_unit_fail:'Lấy danh sách KPI đơn vị lỗi',
                get_kpiunit_by_role_success:'Lấy danh sách KPI đơn vị theo vai trò thành công',
                get_kpiunit_by_role_fail:'Lấy danh sách KPI đơn vị theo vai trò lỗi',
                get_child_target_by_parent_id_success:'Lấy mục tiêu con theo Id của mục tiêu cha thành công',
                get_child_target_by_parent_id_fail:'Lấy mục tiêu con theo Id của mục tiêu cha lỗi',
                create_kpi_unit_success:'Khởi tạo KPI đơn vị thành công',
                create_kpi_unit_fail:'Khởi tạo KPI đơn vị lỗi',
                update_evaluate_kpi_unit_success:'Cập nhật điểm đánh giá KPI đơn vị thành công',
                update_evaluate_kpi_unit_fail:'Cập nhật điểm đánh giá KPI đơn vị lỗi',
            }
        },
        footer: {
            copyright: 'Bản quyền thuộc về ',
            vnist: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
            version: 'Phiên bản '
        }
    }
}