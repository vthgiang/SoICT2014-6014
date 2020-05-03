export default {
    locale: 'en',
    messages: {
        error: {
            email_does_not_exist: 'Email does not exist',
            field_invalid: 'Field input invaid',

            /** 
             * Start 
             * Chức năng quản lý nhân sự
             */
            employee_number_required: 'Staff code required',
            staff_code_not_special: 'Staff code does not contain special characters',
            staff_code_not_find: 'Staff code does not exist',
            number_decisions_required: 'Decis number required',
            number_decisions_have_exist: 'Decis number have exist',
            unit_decisions_required: 'Decis unit required',
            // Quản lý lương nhân viên 
            // TODO: Xoá sau
            name_other_salary_required: 'Name other salary required',
            money_other_salary_required: 'Money other salary required',
            month_salary_required: 'Month salary required',
            money_salary_required: 'Money_salary required',
            month_salary_have_exist: 'Month salary have exist',
            get_salary_success: 'Get salary success',
            get_salary_faile: 'Get salary faile',
            create_salary_success: 'Create salary success',
            create_salary_faile: 'Create salary faile',
            delete_salary_success: 'Delete salary success',
            delete_salary_faile: 'Delete salary faile',
            edit_salary_success: 'Edit salary success',
            edit_salary_faile: 'Edit salary faile',
            // Quản lý nghỉ phép
            // TODO: Xoá sau
            start_date_annual_leave_required: 'Start date annual leave required',
            end_date_annual_leave_required: 'End date annual leave required',
            reason_annual_leave_required: 'Reason annual leave required',
            status_annual_leave_required: 'Status annual leave required',
            get_annual_leave_success: 'Get annual leave success',
            get_annual_leave_faile: 'Get annual leave faile',
            create_annual_leave_success: 'Create annual leave success',
            create_annual_leave_faile: 'Create annual leave faile',
            delete_annual_leave_success: 'Delete annual leave success',
            delete_annual_leave_faile: 'Delete annual leave faile',
            edit_annual_leave_success: 'Edit annual leave success',
            edit_annual_leave_faile: 'Edit annual leave faile',
            // Quản lý khen thưởng
            // TODO: Xoá sau
            type_commendations_required: 'Reward forms required',
            reason_commendations_required: 'Reason required',
            decisions_date_required: 'Decis day required',
            get_commendations_success: 'Get Reward success',
            get_commendations_faile: 'Get Reward faile',
            create_commendations_success: 'Create Reward success',
            create_commendations_faile: 'Create Reward faile',
            delete_commendations_success: 'Delete Reward success',
            delete_commendations_faile: 'Delete Reward faile',
            edit_commendations_success: 'Edit Reward success',
            edit_commendations_faile: 'Edit Reward faile',
            // Quản lý kỷ luật
            // TODO: Xoá sau
            type_discipline_required: 'Discipline forms required',
            reason_discipline_required: 'Reason required',
            start_date_discipline_required: 'Effective date required',
            end_date_discipline_required: 'Expiration date required',
            get_discipline_success: 'Get discipline success',
            get_discipline_faile: 'Get discipline faile',
            create_discipline_success: 'Create discipline success',
            create_discipline_faile: 'Create discipline faile',
            delete_discipline_success: 'Delete discipline success',
            delete_discipline_faile: 'Delete discipline faile',
            edit_discipline_success: 'Edit discipline success',
            edit_discipline_faile: 'Edit discipline faile',
            // Quản lý thông tin cá nhân
            // TODO: Xoá sau
            get_infor_personal_success: 'Get information personal success',
            get_infor_personal_false: 'Get information personal false',
            edit_infor_personal_success: 'Update information personal success',
            edit_infor_personal_false: 'Update infor personal false',
            guaranteed_infor_to_update: 'You have not guaranteed information to update',
            no_change_data: 'No information changed'

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
            table: 'Table',
            name: 'name',
            description: 'Description',
            search: 'Search',
            add: 'Add',
            edit: 'Edit',
            save: 'Save',
            close: 'Close',
            accept: 'Accept',
            yes: 'Yes',
            no: 'No',
            loading: 'Loading',
            no_data: 'No data',
            success: 'Successfully',
            error: 'Error',
            auth_alert: {
                title: 'Current Session invalid. Please log in again',
                reason: 'Reasons:',
                content: [
                    'Session to work invalid',
                    'Access denied',
                    'Page access denied',
                    'Role invalid',
                    'Your permission changed',
                    'Token invalid',
                    'Company service stoped',
                ],
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
                on: 'Bật',
                off: 'Tắt',
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
                        no_less4: 'Tên không được ít hơn 4 kí tự',
                        no_more255: 'Tên không quá 255 kí tự',
                        no_space: 'Tên ngắn của công ty không hợp lê. Các chữ không được cách nhau'
                    },
                    short_name: {
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

            },

            system_link: {
                table: {
                    url: 'Đường dẫn',
                    description: 'Mô tả về trang',
                },

                // Thông điệp từ server
                create_system_link_success: 'Tạo system link thành công',
                edit_system_link_success: 'Chỉnh sửa thông tin system link thành công',

                system_link_url_exist: 'Url này đã được sử dụng',
            },

            system_component: {
                table: {

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
            title: 'Qpps! Page not found',
            content: 'We could not find the page you were looking for',
            back_to_home: 'Return to HomePage'
        },
        language: 'Language setting',
        alert: {
            title: 'Notification from system',
            log_again: 'Error! Log in again!',
            access_denied: 'Access denied! Log in again!',
            role_invalid: 'Role invalid! Log in again!',
            page_access_denied: 'Page access denied! Log in again!',
            user_role_invalid: 'User and role invalid! Log in again!',
            acc_logged_out: 'Timework invalid! Log in again!',
            service_off: 'Your company service turning off! Try again!',
            fingerprint_invalid: 'Your token invalid! Log in again!',
            service_permisson_denied: 'You do not have permission call to Service',
            email_invalid: 'Email invalid',
            password_invalid: 'Password invalid',
            wrong5_block: 'Input password wrong 5 times. Accont have been blocked!',
            acc_blocked: 'Accont have been blocked!',
            acc_have_not_role: 'Accout have not role'
        },
        auth: {
            security: 'security',
            login: 'Login',
            logout: 'Logout',
            logout_all_account: 'Log out all account',
            profile: {
                title: 'Profile',
                name: 'Username',
                email: 'Email',
                password: 'New password',
                confirm: 'Confirm password',
                edit_success: 'Edit user profile success',
                edit_faile: 'Edit user profile faile'
            }
        },

        confirm: {
            yes: 'YES',
            no: 'NO',
            no_data: 'No data',
            field_invalid: "Input field invalid. Please check again!",
        },

        form: {
            property: 'Property',
            value: 'Value',
            required: 'Information fields required',
            save: 'Save',
            close: 'Close',
            email: 'Email',
            password: 'Password',
            new_password: 'New password',
            confirm: 'Confirm password',
            description: 'Description',
            reset_password: 'Reset password user account',
            forgot_password: 'I forgot my password ?',
            signin: 'Sign In',
            otp: 'OTP',
            next: 'Next',
            search: 'Search'
        },

        table: {
            name: 'Name',
            description: 'Description',
            email: 'Email',
            action: 'Action',
            line_per_page: 'Record/Page',
            update: 'Update',
            edit: 'Edit',
            delete: 'Delete',
            info: 'Information',
            status: 'Status',
            url: 'URL',
            short_name: 'Short Name',
            employee_name: 'Staff name',
            employee_number: 'Staff code',
            total_salary: 'Total salary',
            month: 'Month',
            unit: 'Unit',
            position: 'Position',
            no_data: 'No data',
            start_date: 'Start day',
            end_date: 'End day',
            hidden_column: 'Hidden columns',
            choose_hidden_columns: 'Select columns to hide',
            hide_all_columns: 'Hide all columns',
        },
        modal: {
            update: 'Save',
            close: 'Close',
            create: 'Add new',
            note: 'Required fields',
            add_success: 'Add new success',
            add_faile: 'Add new faile',
        },
        page: {
            unit: 'Unit',
            position: 'Position',
            month: 'Month',
            status: 'Status',
            staff_number: 'Staff code',
            add_search: 'Search',
            number_decisions: 'Decis number',
            add_success: 'Add new success',
            all_unit: 'Select all unit',
            non_unit: 'Select unit',
            all_position: 'Select all position',
            non_position: 'Select position',
            all_status: 'Select all status',
            non_status: 'Select status'
        },

        menu: {
            home: 'Home page',
            manage_system: 'Manage System',
            manage_company: 'Manage Company',
            manage_department: 'Manage Departments',
            manage_user: 'Manage Users',
            manage_role: 'Manage Roles',
            manage_link: 'Manage Pages',
            manage_component: 'Manage ComponentUI',
            manage_document: 'Manage Documents',

            task_template: 'Task Template',
            cocautochuc: 'Organizational Structure',
            taskmanagement: 'Task Management',
            manageDocument: 'Manage Document',
            manage_employee: 'Manage Staffs',
            manage_training: 'Manage Training',
            account: 'Account',
            manage_unit: 'Manage units',
            manage_holiday: 'Work plan',
            add_employee: 'Add New Staffs',
            list_employee: 'Manage Staffs Information',
            detail_employee: 'Personal Information',
            update_employee: 'Update Personal Information',
            dashboard_employee: 'DashBoard Manage Staffs ',
            discipline: 'Manage Reward And Discipline',
            annual_leave: 'Manage Annual Leave',
            salary_employee: 'Manage Salary',
            time_keeping: 'Attendance Staff',
            list_education: 'Training Programs',
            training_plan: 'Manage Training Courses',

            manage_kpi: 'Manage KPI',
            kpi_unit_create: 'Create unit KPI',
            kpi_unit_evaluate: 'Evaluate unit KPI',
            kpi_unit_overview: 'Overview unit KPI',
            kpi_unit_dashboard: 'Dashboard unit KPI',
            kpi_unit_manager: 'Manage unit KPI',
            kpi_member_manager: 'Manage Employees KPI',
            kpi_member_dashboard: 'DashBoard KPI Member',
            kpi_personal_create: 'Create personal KPI',
            kpi_personal_evaluate: 'Evaluate personal KPI',
            kpi_personal_overview: 'Overview personal KPI',
            kpi_personal_dashboard: 'DashBoard personal KPI',
            kpi_personal_manager: 'Manager personal KPI',

            notifications: 'Notifications',

            tasks: 'Task management',
            task_management: 'View task list',
            task_management_dashboard: 'Task dashboard',
        },

        manage_system: {
            turn_on: 'Turn on',
            turn_off: 'Turn off',
            log: 'Log state of user request'
        },

        manage_company: {
            add: 'Add',
            add_title: 'Add new company',
            name: 'Company name',
            short_name: 'Company short name',
            description: 'Company description',
            on_service: 'Turn on service',
            off_service: 'Turn off service',
            turning_on: 'Turning on the service',
            turning_off: 'Turning off the service',
            info: 'Company information',
            edit: 'Edit company information',
            super_admin: "SuperAdmin email of company",
        },

        manage_department: {
            zoom_out: 'Zoom Out',
            zoom_in: 'Zoom In',
            add: 'Add',
            add_title: 'Add new department',
            info: 'Department Information',
            name: 'Department name',
            description: 'Department description',
            parent: 'Parent of Department',
            no_parent: 'No parent department',
            select_parent: 'Select parent of department',
            roles_of_department: 'Roles in Department',
            dean_name: 'Dean',
            dean_example: 'Ex: Dean of Financial Officer',
            vice_dean_name: 'Vice Dean',
            vice_dean_example: 'Ex: Vice Dean of Financial Officer',
            employee_name: 'Employee',
            employee_example: 'Ex: Employee of Financial Officer',
            add_with_parent: 'Add new department with parent is',
            delete: 'Delete department'
        },

        manage_role: {
            add: 'Add',
            add_title: 'Add new role',
            description: 'Description',
            info: 'Role information',
            name: 'Role name',
            extends: 'Extends of',
            users: 'Users has role',
            edit: 'Edit role information',
            delete: 'Delete role',
            add_success: 'Add new role successfully',
            add_faile: 'Add new role failed',
            edit_success: 'Edit role successfully',
            edit_faile: 'Edit role failed'
        },

        manage_user: {
            add: 'Add',
            add_title: 'Add new user/account',
            info: 'User/Account information',
            edit: 'Edit User/Account information',
            disable: 'Disable',
            enable: 'Enable',
            delete: 'Delete user',
            add_success: 'Add new user successfully',
            add_faile: 'Add new user failed',
            edit_success: 'Edit user successfully',
            edit_faile: 'Edit user failed',
            roles: 'Roles assigned'
        },

        manage_link: {
            add: 'Add',
            add_title: 'Add new link for page',
            url: 'Link of page',
            description: 'Description of page',
            components: 'Have components',
            roles: 'Roles can access this page',
            info: 'Page information',
            edit: 'Edit page information',
            delete: 'Delele link',
            add_success: 'Add successfully',
            add_faile: 'Add falied!',
            edit_success: 'Edit successfully!',
            edit_faile: 'Edit failed!',
            category: 'Category'
        },

        manage_component: {
            add: 'Add',
            add_title: 'Add new component',
            info: 'Component information',
            edit: 'Edit component information',
            delete: 'Delete component',
            roles: 'Roles have privilege to component',
            add_success: 'Add successfully',
            add_faile: 'Add falied!',
            edit_success: 'Edit successfully!',
            edit_faile: 'Edit failed!',
        },
        // Quản lý lương nhân viên
        salary_employee: { // TODO: Xoá sau
            list_salary: 'List of staff salary',
            add_salary: 'Add salary',
            add_salary_title: 'Add salary',
            edit_salary: 'Edit Salary',
            delete_salary: 'Delete salary',
            add_by_hand: 'Add by hand',
            add_import: 'Import file excel',
            add_by_hand_title: 'Add by hand',
            add_import_title: 'Import file excel',
            main_salary: 'Main salary',
            other_salary: 'Other salary',
            name_salary: 'Name salary',
            money_salary: 'Money',
            add_more_salary: 'Add other salary',
            add_new_salary: 'Add new salary',
            check_null_msnv: 'Staff code required',
            check_msnv: 'Not find staff code',
            check_main_salary: 'Main salary required',
            check_month: 'Month required',
        },
        // Quản lý nghỉ phép
        sabbatical: {
            list_sabbatical: 'List of staff sabbatical',
            add_sabbatical: 'Add sabbatical',
            add_sabbatical_title: 'Add new sabbatical',
            edit_sabbatical: 'Edit Sabbatical',
            delete_sabbatical: 'Delete sabbatical',
            start_date: 'Start date',
            end_date: 'End date',
            reason: 'Reason',
            check_null_msnv: 'Staff code required',
            check_msnv: 'Not find staff code',
            check_start_day: 'Start day required',
            check_end_day: 'End day required',
            check_reason: 'Reason required',
            check_status: 'Status required',
            pass: 'Accepted',
            faile: 'Refused',
            process: 'Awaiting approval',
            all: '--All--',
            edit_succes: 'Edit sabbatical success',
            edit_faile: 'Edit sabbatical faile',
        },
        // Quản lý khen thưởng, kỷ luật
        discipline: {
            list_discipline: 'List of staff discipline',
            list_discipline_title: 'List of staff discipline',
            add_discipline: 'Add discipline',
            add_discipline_title: 'Add new discipline',
            edit_discipline: 'Edit Discipline',
            delete_discipline: 'Delete discipline',
            start_date: 'Effective date',
            end_date: 'Expiration date',
            discipline_forms: 'Discipline forms',
            reason_discipline: 'Reason',
            check_null_msnv: 'Staff code required',
            check_msnv: 'Not find staff code',
            check_number: 'Decis number required',
            check_unit: 'Decis unit required',
            check_start_day: 'Effective date required',
            check_end_day: 'Expiration date required',
            check_reason_discipline: 'Reason required',
            check_type_discipline: 'Discipline forms required',
            list_praise: 'List of staff reward',
            list_praise_title: 'List of staff reward',
            add_praise: 'Add reward',
            add_praise_title: 'Add new reward',
            edit_praise: 'Edit Reward',
            delete_praise: 'Delete reward',
            decision_day: 'Decis day',
            decision_unit: 'Decis unit',
            reward_forms: 'Reward forms',
            reason_praise: 'Reason',
        },
        // Quản lý nhân sự các đơn vị
        manage_unit: {
            list_unit: 'List of units',
            list_employee_unit: 'List of units staff',
            edit_unit: 'Edit units staff',
            edit_sucsess: 'Edit units staff sucsess',
            edit_faile: 'Edit units staff faile',
            dean_unit: 'Head of unit',
            vice_dean_unit: 'Deputy unit',
            employee_unit: 'Unit staff',
            email_employee: 'Email',
            add_employee_unit: 'Add staff to the unit',
        },
        // Quản lý thông tin nhân viên
        manage_employee: {
            note_page_personal: 'I hereby certify that all of the above statements are true and I am responsible for them.',
            contact_other: '(Other information please contact the relevant parties to be processed)',
            update_infor_personal: 'Update staff information',
            no_data_personal: 'No personal information yet',

            menu_basic_infor: 'Basic information',
            menu_general_infor: 'General information',
            menu_contact_infor: 'Contact information',
            menu_education_experience: 'Education - Experience',
            menu_diploma_certificate: 'Diploma - Certificate',
            menu_account_tax: 'Account - Tax',
            menu_insurrance_infor: 'Insurrance information',
            menu_contract_training: 'Contract - Training',
            menu_reward_discipline: 'Reward - Discipline',
            menu_salary_sabbatical: 'Salary - Sabbatical',
            menu_attachments: 'Attachments',
            menu_general_infor_title: 'General information',
            menu_contact_infor_title: 'Contact information',
            menu_education_experience_title: 'Education - Experience',
            menu_diploma_certificate_title: 'Diploma - Certificate',
            menu_account_tax_title: 'Account - Tax',
            menu_insurrance_infor_title: 'Insurrance information',
            menu_contract_training_title: 'Contract - Training',
            menu_reward_discipline_title: 'Reward - Discipline',
            menu_salary_sabbatical_title: 'Salary - Sabbatical',
            menu_attachments_title: 'Attachments',
            add_staff: 'Add new staffs',
            staff_number: 'Staff code',
            full_name: 'Full name',
            attendance_code: 'Attendance code',
            gender: 'Gender',
            male: 'Male',
            female: 'Female',
            date_birth: 'Date of birth',
            place_birth: 'Place of birth',
            email: 'Email',
            email_company: 'Email company',
            relationship: 'Relationship',
            single: 'Single',
            married: 'Married',
            upload: 'Upload',
            id_card: 'ID card/Passport',
            date_issued: 'Date issued',
            issued_by: 'Issued by',
            ethnic: 'Ethnic group',
            nationality: 'Nationality',
            religion: 'Religion',
            mobile_phone: 'Mobile phone',
            mobile_phone_1: 'Mobile phone 1',
            mobile_phone_2: 'Mobile phone 2',
            personal_email_1: 'Personal email 1',
            personal_email_2: 'Personal email 2',
            home_phone: 'Home phone',
            emergency_contact: 'Emergency contact',
            nexus: 'Nexus',
            address: 'Address',
            permanent_address: 'Permanent address',
            current_residence: 'Current residence',
            wards: 'Wards/Commune',
            district: 'District/County',
            province: 'Province/City',
            nation: 'Nation',
            academic_level: 'Academic level',
            educational_level: 'Educational level',
            language_level: 'Language level',
            qualification: 'Qualification',
            intermediate_degree: 'Intermediate degree',
            colleges: 'Colleges',
            university: 'University',
            master_degree: "Maste degree",
            phd: 'Ph.D',
            unavailable: 'Unavailable',
            work_experience: 'Work experience',
            unit: 'Unit',
            from_month_year: 'From month/year',
            to_month_year: 'To month/year',
            edit_experience: 'Edit work experience',
            add_experience: 'Add work experience',

            diploma: 'Diploma',
            certificate: 'Certificate',
            name_diploma: 'Name of diploma',
            name_certificate: 'Name of certificate',
            diploma_issued_by: 'Issued_by',
            graduation_year: 'Graduation year',
            ranking_learning: 'Ranking of learning',
            attached_files: 'Attached files',
            end_date_certificate: 'Expiration date',
            edit_certificate: 'Edit certificate',
            edit_diploma: 'Edit diploma',
            add_certificate: 'Add certificate',
            add_diploma: 'Add diploma',
            excellent: 'Excellent',
            very_good: 'Very good',
            good: 'Good',
            average_good: 'Average good',
            ordinary: 'Ordinary',

            bank_account: 'Bank account',
            personal_income_tax: 'Personal income tax',
            account_number: 'Account number',
            bank_name: 'Bank name',
            bank_branch: 'Bank branch',
            tax_number: 'Tax number',
            representative: 'Representative',
            day_active: 'Day active',
            managed_by: 'Managed by',

            bhyt: 'Health Insurance',
            number_BHYT: 'Health insurance code',
            bhxh: 'Social insurance',
            number_BHXH: 'Social insurance code',
            bhxh_process: 'Process of social insurance payment',
            edit_bhxh: 'Edit social insurance',
            add_bhxh: 'Add social insurance',

            labor_contract: 'Labor contract',
            training_process: 'Training process',
            name_contract: 'Contract name',
            type_contract: 'Type of contract',
            start_date: 'Effective date',
            course_name: 'Course name',
            start_day: 'Start day',
            end_date: 'End day',
            type_education: 'Type of education',
            cost: 'Cost',
            edit_contract: 'Edit labor contract',
            add_contract: 'Add labor contract',

            list_attachments: 'List of attached documents',
            attachments_code: 'Attachments code',
            file_name: 'File name',
            number: 'Number',
            add_default: 'Add default',
            add_default_title: 'Add the default document',
            edit_file: 'Edit attached documents',
            add_file: 'Add attached documents',
            no_submitted: 'Not submitted',
            submitted: 'Submitted',
            returned: 'Returned',
            no_files: 'No files yet',
            disc_diploma: 'Highest degree diploma',
            curriculum_vitae: 'Curriculum vitae',
            disc_curriculum_vitae: 'Notarized resume',
            img: 'Image',
            disc_img: 'Image 4x6 ',
            copy_id_card: 'Copy of ID card / Passport',
            disc_copy_id_card: 'Certified copy of identity card or passport',
            health_certificate: 'Health certificate',
            disc_health_certificate: 'Notarized health certificate',
            birth_certificate: 'Birth certificate',
            disc_birth_certificate: 'Notarized birth certificate',
            job_application: 'Job application',
            disc_job_application: 'Handwritten application letter',
            commitment: 'Commitment',
            disc_commitment: 'Commitment to work',
            temporary_residence_card: 'Temporary residence card',
            disc_temporary_residence_card: 'Certificate of temporary absence',



            Reward: 'Reward',
            discipline: 'Discipline',
            historySalary: 'History of salary',
            sabbatical: 'Sabbatical information'
        },
        // Quản lý kê hoạch làm việc
        holiday: {
            start_date: 'Start day',
            end_Date: 'End day',
            description: 'Description',
            check_start_Date: 'Start day required',
            check_end_Date: 'End day required',
            check_description: 'Description required'
        },
        // Module Quản lý nhân sự
        human_resource: {
            // Nhóm dùng chung cho module quản lý nhân sự
            unit: 'Unit',
            position: 'Position',
            month: 'Month',
            status: 'Status',
            staff_number: 'Staff code',
            staff_name: 'Staff Name',
            add_success: 'Add new success',
            all_unit: 'Select all unit',
            non_unit: 'Select unit',
            all_position: 'Select all position',
            non_position: 'Select position',
            all_status: 'Select all status',
            non_status: 'Select status',

            // Thông điệp trả về từ server dung chung cho module quản lý nhân sự
            employee_number_required: 'Staff code required',
            staff_code_not_special: 'Staff code does not contain special characters',
            staff_code_not_find: 'Staff code does not exist',
            number_decisions_required: 'Decis number required',
            number_decisions_have_exist: 'Decis number have exist',
            unit_decisions_required: 'Decis unit required',


            // Quản lý lương nhân viên
            salary: {
                list_salary: 'List of staff salary',

                // Nhóm dành cho table
                table: {
                    main_salary: 'Main salary',
                    other_salary: 'Other salary',
                    name_salary: 'Name salary',
                    money_salary: 'Money',
                    total_salary: 'Total Salary',
                    action: 'action'

                },
                // Nhóm dành cho action
                edit_salary: 'Edit Salary',
                delete_salary: 'Delete salary',
                add_salary: 'Add salary',
                add_salary_title: 'Add salary',
                add_by_hand: 'Add by hand',
                add_by_hand_title: 'Add by hand',
                add_import: 'Import file excel',
                add_import_title: 'Import file excel',
                add_more_salary: 'Add other salary',
                add_new_salary: 'Add new salary',

                // Thông điệp trả về từ server
                name_other_salary_required: 'Name other salary required',
                money_other_salary_required: 'Money other salary required',
                month_salary_required: 'Month salary required',
                money_salary_required: 'Money_salary required',
                month_salary_have_exist: 'Month salary have exist',
                get_salary_success: 'Get salary success',
                get_salary_faile: 'Get salary faile',
                create_salary_success: 'Create salary success',
                create_salary_faile: 'Create salary faile',
                delete_salary_success: 'Delete salary success',
                delete_salary_faile: 'Delete salary faile',
                edit_salary_success: 'Edit salary success',
                edit_salary_faile: 'Edit salary faile',
            },

            // Quản lý nghỉ phép
            annual_leave: {
                list_annual_leave: 'List of staff annual leave',

                // Nhóm dành cho table
                table: {
                    start_date: 'Start date',
                    end_date: 'End date',
                    reason: 'Reason',
                    action: 'action',
                },

                // Nhóm dành cho trạng thái nghỉ phép 
                status: {
                    pass: 'Accepted',
                    faile: 'Refused',
                    process: 'Awaiting approval',
                },

                // Nhóm dành cho action
                edit_annual_leave: 'Edit annual leave',
                delete_annual_leave: 'Delete annual leave',
                add_annual_leave: 'Add annual leave',
                add_annual_leave_title: 'Add new annual leave',

                // Thông điệp trả về từ server
                start_date_annual_leave_required: 'Start date annual leave required',
                end_date_annual_leave_required: 'End date annual leave required',
                reason_annual_leave_required: 'Reason annual leave required',
                status_annual_leave_required: 'Status annual leave required',
                get_annual_leave_success: 'Get annual leave success',
                get_annual_leave_faile: 'Get annual leave faile',
                create_annual_leave_success: 'Create annual leave success',
                create_annual_leave_faile: 'Create annual leave faile',
                delete_annual_leave_success: 'Delete annual leave success',
                delete_annual_leave_faile: 'Delete annual leave faile',
                edit_annual_leave_success: 'Edit annual leave success',
                edit_annual_leave_faile: 'Edit annual leave faile',

            },
            // Quản lý khen thưởng kỷ luật
            commendation_discipline: {
                // Quản lý khen thưởng
                commendation: {
                    list_praise: 'List of staff reward',
                    list_praise_title: 'List of staff reward',

                    // Nhóm dành cho table
                    table: {
                        decision_date: 'Decis date',
                        decision_unit: 'Decis unit',
                        reward_forms: 'Reward forms',
                        reason_praise: 'Reason',

                    },

                    // Nhóm dành cho action
                    add_praise: 'Add reward',
                    add_praise_title: 'Add new reward',
                    edit_praise: 'Edit Reward',
                    delete_praise: 'Delete reward',

                    // Thông điệp trả về từ server
                    employee_number_required: 'Staff code required',
                    staff_code_not_special: 'Staff code does not contain special characters',
                    staff_code_not_find: 'Staff code does not exist',
                    number_decisions_required: 'Decis number required',
                    number_decisions_have_exist: 'Decis number have exist',
                    unit_decisions_required: 'Decis unit required',
                    type_commendations_required: 'Reward forms required',
                    reason_commendations_required: 'Reason required',
                    decisions_date_required: 'Decis day required',
                    get_commendations_success: 'Get Reward success',
                    get_commendations_faile: 'Get Reward faile',
                    create_commendations_success: 'Create Reward success',
                    create_commendations_faile: 'Create Reward faile',
                    delete_commendations_success: 'Delete Reward success',
                    delete_commendations_faile: 'Delete Reward faile',
                    edit_commendations_success: 'Edit Reward success',
                    edit_commendations_faile: 'Edit Reward faile',
                },

                // Quản lý ky luật
                discipline: {
                    list_discipline: 'List of staff discipline',
                    list_discipline_title: 'List of staff discipline',

                    // Nhóm dành cho table
                    table: {
                        start_date: 'Effective date',
                        end_date: 'Expiration date',
                        discipline_forms: 'Discipline forms',
                        reason_discipline: 'Reason',
                    },

                    // Nhóm dành cho action
                    add_discipline: 'Add discipline',
                    add_discipline_title: 'Add new discipline',
                    edit_discipline: 'Edit Discipline',
                    delete_discipline: 'Delete discipline',

                    // Thông điệp trả về từ server
                    employee_number_required: 'Staff code required',
                    staff_code_not_special: 'Staff code does not contain special characters',
                    staff_code_not_find: 'Staff code does not exist',
                    number_decisions_required: 'Decis number required',
                    number_decisions_have_exist: 'Decis number have exist',
                    unit_decisions_required: 'Decis unit required',
                    type_discipline_required: 'Discipline forms required',
                    reason_discipline_required: 'Reason required',
                    start_date_discipline_required: 'Effective date required',
                    end_date_discipline_required: 'Expiration date required',
                    get_discipline_success: 'Get discipline success',
                    get_discipline_faile: 'Get discipline faile',
                    create_discipline_success: 'Create discipline success',
                    create_discipline_faile: 'Create discipline faile',
                    delete_discipline_success: 'Delete discipline success',
                    delete_discipline_faile: 'Delete discipline faile',
                    edit_discipline_success: 'Edit discipline success',
                    edit_discipline_faile: 'Edit discipline faile',
                }
            },

            // Quản lý thông tin nhân viên
            profile: {
                // Nhóm dùng chung cho chưc năng quản lý tông tin nhân viên

                // Quản lý thông tin cá nhân
                employee_info: {
                    // Nhóm dành cho UI
                    guaranteed_infor_to_update: 'You have not guaranteed information to update',
                    no_change_data: 'No information changed',

                    // Thông điệp trả về từ server
                    get_infor_personal_success: 'Get information personal success',
                    get_infor_personal_false: 'Get information personal false',
                    edit_infor_personal_success: 'Update information personal success',
                    edit_infor_personal_false: 'Update infor personal false',
                    
                }
            }
        },

        // Task template
        task_template: {
            search: 'Search',
            search_by_name: 'Search by name',
            select_all_units: 'Select all units',
            permission_view: 'Permission to view',
            performer: 'Performer',
            approver: 'Approver',
            observer: 'Observer',
            supporter: 'Supporter',
            formula: 'Formula',
            activity_list: 'Activity list',
            information_list: 'Information list',
            no_data: 'No data',
            edit: 'Edit',
            save: 'Save',
            close: 'Close',
            add: 'Add new',
            confirm: 'Confirm',
            confirm_title: 'Are you sure you want to delete this task template?',
            error_title: 'This work template cannot be deleted because it is already in use.',
            name: 'Template name',
            unit: 'Unit',
            tasktemplate_name: 'Task template name',
            description: 'Description',
            count: 'Number of uses',
            creator: 'Creator',
            unit: 'Unit',
            action: 'Action'
        },

        notification: {
            add: 'Thêm mới',
            add_title: 'Thêm thông báo mới',
            add_success: 'Tạo thông báo mới thành công',
            add_faile: 'Tạo thông báo thất bại',
            edit_success: 'Chỉnh sửa thông báo thành công',
            edit_faile: 'Chỉnh sửa thông báo thất bại'
        },

        task: {
            task_management: {
                create_task_success: 'Create new task succesfully',
                delete_success: 'Delete task successfully',
                edit_status_of_task_success: 'Edit status of task successfully ',

                create_task_fail: "Can't create new task",
                delete_fail: "Can't delete task successfully",
                edit_status_of_task_fail: "Can't edit status of task",
            },
            task_perform: {
                // TODO: code_mesage_task_perform
                create_result_task_success: 'Evaluate task successfully',
                edit_result_task_success: 'Edit result task successfully',
                get_task_actions_success: 'Get all task actions successfully',
                create_task_action_success: 'Create task action successfully',
                edit_task_action_success: 'Edit task action successfully',
                delete_task_action_success: 'Delete task action successfully',
                get_action_comments_success: 'Get all action comments successfully',
                create_action_comment_success: 'Create action comments successfully',
                edit_action_comment_success: 'Edit action comments successfully',
                delete_action_comment_success: 'Delete action comments successfully',
                get_log_timer_success: 'Get log timer successfully',
                get_timer_status_success: 'get timer status successfully',
                start_timer_success: 'Start timer successfully',
                pause_timer_success: 'Pause timer successfully',
                continue_timer_success: 'Continue timer successfully',
                stop_timer_success: 'Stop timer successfully',
                create_result_info_task_success: 'Create result infomation task successfully',
                create_result_infomation_task_success: 'Create result infomation task successfully',
                edit_result_infomation_task_success: 'Edit result infomation task successfully',

                create_result_task_fail: "Can't evaluate task",
                edit_result_task_fail: "Can't edit result task",
                get_task_actions_success: 'Get all task actions fail',
                create_task_action_success: 'Create task action fail',
                edit_task_action_success: 'Edit task action fail',
                delete_task_action_success: 'Delete task action fail',
                get_action_comments_success: 'Get all action comments fail',
                create_action_comment_success: 'Create action comments fail',
                edit_action_comment_success: 'Edit action comments fail',
                delete_action_comment_success: 'Delete action comments fail',
                get_log_timer_success: 'Get log timer fail',
                get_timer_status_success: 'get timer status fail',
                start_timer_success: 'Start timer fail',
                pause_timer_success: 'Pause timer fail',
                continue_timer_success: 'Continue timer fail',
                stop_timer_success: 'Stop timer fail',
                create_result_info_task_success: 'Create result infomation task fail',
                create_result_infomation_task_success: 'Create result infomation task fail',
                edit_result_infomation_task_success: 'Edit result infomation task fail',


            },
            task_template: {
                // TODO: code_mesage_task_template
            }
        },

        kpi: {
            employee: {
                get_kpi_by_member_success: 'Get KPI by member successfully',
                get_kpi_by_member_fail: 'Get KPI by member fail',
                get_kpi_responsible_success: 'Get all KPI responsible successfully',
                get_kpi_responsible_fail: 'Get all KPI responsible fail',

                //Nhóm dành cho module creation
                employee_kpi_set: {
                    create_employee_kpi_set: { // Module chính
                        // Nhóm dành cho các thông tin chung
                        general_information: {
                            general_information: 'Personal KPI in',
                            save: 'Save the edit',
                            edit: 'Edit',
                            delete: 'Delete this KPI',
                            cancel: 'Cancel'
                        },
                        time: 'Time',
                        approver: 'Approver',
                        weight: {
                            weight_total: 'Weight total',
                            not_satisfied: 'Not satisfied',
                            satisfied: 'Satisfied'
                        },
                        initialize_kpi_newmonth: 'Initialize KPI new month',
                        request_approval: 'Request for approval',
                        cancel_request_approval: 'Cancel request for approval',

                        // Nhóm dành cho các trạng thái tập KPI
                        kpi_status: {
                            status: 'KPI status',
                            setting_up: 'Setting-up',
                            awaiting_approval: 'Awaiting approval',
                            activated: 'Activated',
                            finished: 'Finished'
                        },

                        // Nhóm dành cho các trạng thái mục tiêu KPI
                        check_status_target: {
                            not_approved: 'Not approved',
                            edit_request: 'Edit request',
                            activated: 'Activated',
                            finished: 'Finished'
                        },

                        // Nhóm dành cho table
                        target_list: 'Target list',
                        add_target: 'Add target',
                        no_: 'No.',
                        target_name: 'Target name',
                        parents_target: 'Parents target',
                        evaluation_criteria: 'Evalution criteria',
                        max_score: 'Max score',
                        status: 'Status',
                        action: 'Action',
                        not_initialize: 'No KPI have been initialized in ',

                        // Nhóm dành cho phản hồi
                        submit: {
                            feedback: 'Feedback',
                            send_feedback: 'Send feedback',
                            cancel_feedback: 'Cancel',
                        },

                        // Nhóm dành cho các handle
                        handle_edit_kpi: {
                            approving: 'KPI is being approved, you can not edit it. If you want to modify, please contact your manager!',
                            activated: 'KPI has been activated, you can not edit. If you want to modify, please contact your manager!'
                        },
                        delete_kpi: {
                            kpi: 'Are you sure you want to delete this KPI?',
                            kpi_target: 'Are you sure you want to delete this KPI target?',
                            approving: 'KPI is being approved, you can not delete!',
                            activated: 'KPI has been activated, you can not delete!'
                        },
                        edit_target: {
                            approving: 'KPI is being approved, you can not edit!',
                            activated: 'KPI is being activated, you can not edit!'
                        },
                        request_approval_kpi: {
                            approve: 'Are you sure you want to be approved this KPI?',
                            not_enough_weight: 'The total weight must be 100'
                        },
                        cancel_approve: {
                            cancel: 'Are you sure you want to cancel this KPI?',
                            activated: 'KPI has been activated, you can not cancel the request for approval. If you want to modify, please contact your manager!'
                        },
                        action_title: {
                            edit: 'Edit',
                            content: 'This is the default target (if necessary, weights can be corrected)',
                            delete: 'Delete'
                        },
                    },

                    create_employee_kpi_modal: { // Module con
                        // Nhóm dành cho modal
                        create_employee_kpi: 'Add personal KPI target',
                        name: 'Target name',
                        parents: 'Parents target',
                        evaluation_criteria: 'Evaluation criteria',
                        weight: 'Weight',

                        // Nhóm dành cho validate
                        validate_name: {
                            empty: 'Target name cannot be empty',
                            less_than_4: 'Target name cannot be less than 4 characters',
                            more_than_50: 'Target name cannot be more than 50 characters',
                            special_character: 'Target name cannot contain special characters'
                        },
                        validate_criteria: 'Criteria cannot be empty',
                        validate_weight: {
                            empty: 'Weight cannot be empty',
                            less_than_0: 'Weight cannot be less than 0',
                            greater_than_100: 'Weight cannot be greater than 100'
                        }
                    },

                    kpi_member_manager: { // Module con
                        index: 'Index',
                        time: 'Date',
                        employee_name: 'Employee Name',
                        target_number: 'Target Number',
                        kpi_status: 'KPI Status',
                        result: 'Result',
                        approve: 'Approve',
                        evaluate: 'Evaluate'
                    },

                    create_employee_kpi_set_modal: { // Module con
                        // Nhóm dành cho modal
                        initialize_kpi_set: 'Initialize personal KPI',
                        organizational_unit: 'Organizational Unit',
                        month: 'Month',
                        approver: 'Approver',
                        default_target: 'Default target'
                    },

                    edit_employee_kpi_modal: { // Module con
                        // Nhóm dành cho modal
                        edit_employee_kpi: 'Edit personal KPI targets',
                        name: 'Target name',
                        parents: 'Parents target',
                        evaluation_criteria: 'Evaluation criteria',
                        weight: 'Weight'
                    },

                    //Thông điệp trả về từ server
                    messages_from_server: {
                        initialize_employee_kpi_set_success: 'Initialize employee KPI set successfully',
                        initialize_employee_kpi_set_failure: 'Initialize employee KPI set unsuccessfully',

                        create_employee_kpi_success: 'Add KPI target successfully',
                        create_employee_kpi_failure: 'Add KPI target unsuccessfully',

                        edit_employee_kpi_set_success: 'Edit employee KPI set successfully',
                        edit_employee_kpi_set_failure: 'Edit employee KPI set unsuccessfully',
                        delete_employee_kpi_set_success: 'Delete employee KPI set successfully',
                        delete_employee_kpi_set_failure: 'Delete employee KPI set unsuccessfully',

                        approve_success: 'Confirm request approval successfully',
                        approve_failure: 'Confirm request approval unsuccessfully',

                        delete_employee_kpi_success: 'Delete KPI target successfully',
                        delete_employee_kpi_failure: 'Delete KPI target unsuccessfully',

                        edit_employee_kpi_success: 'Edit KPI target successfully',
                        edit_employee_kpi_failure: 'Edit KPI target unsuccessfully'
                    }
                },
            },
            evaluation: {
                get_all_kpi_member_success: 'Get all KPI member successfully',
                get_all_kpi_member_fail: 'Get all KPI member fail',
                get_kpi_targets_success: 'Get KPI targets successfully',
                get_kpi_targets_fail: 'Get KPI targets fail',
                get_all_kpi_member_by_id_success: 'Get all KPI member by Id successfully',
                get_all_kpi_member_by_id_fail: 'Get all KPI member by Id fail',
                get_all_kpi_member_by_month_success: 'Get all KPI member by month successfully',
                get_all_kpi_member_by_month_fail: 'Get all KPI member by month fail',
                approve_all_kpi_target_success: 'Approve all KPI target successfully',
                approve_all_kpi_target_fail: 'Approve all KPI target fail',
                edit_kpi_target_member_success: 'Edit KPI member target successfully',
                edit_kpi_target_member_fail: 'Edit KPI member target fail',
                edit_status_target_success: 'Edit status target successfully',
                edit_status_target_fail: 'Edit status target fail',
                get_task_by_id_success: 'Get all tasks by Id successfully',
                get_task_by_id_fail: 'Get all tasks by Id fail',
                get_system_point_success: 'Get system point successfully',
                get_system_point_fail: 'Get system point fail',
                set_point_kpi_success: 'Get point KPI successfully',
                set_point_kpi_fail: 'Get point KPI fail',

            },
            organizational_unit: {
                // Module chính
                create_organizational_unit_kpi_set: {
                    // Nhóm dành cho các thông tin chung
                    general_information: 'Organizational unit KPI',
                    save: 'Save the edit',
                    confirm: 'Confirm',
                    delete: 'Delete this KPI',
                    cancel: 'Cancel',
                    approve: 'Approve',
                    cancel_approve: 'Unapprove',
                    target: 'target',
                    confirm_delete_success: 'Are you sure you want to delete this entire KPI?',
                    time: 'Time',
                    initialize_kpi_newmonth: 'Initialize KPI new month',
                    edit_kpi_success: 'Editing KPI successful',
                    edit_kpi_failure: 'Editing KPI falied',
                    delete_kpi_success: 'Delete KPI successfully',
                    delete_kpi_failure: 'Delete KPI unsuccessfully',

                    // Nhóm dành cho trọng số
                    weight_total: 'Weight total',
                    not_satisfied: 'Not satisfied',
                    satisfied: 'Satisfied',

                    // Nhóm dành cho các trạng thái tập KPI
                    not_approved: 'Not approved',
                    approved: 'Approved',

                    // Nhóm dành cho table
                    target_list: 'Target list',
                    add_target: 'Add target',
                    no_: 'No.',
                    target_name: 'Target name',
                    parents_target: 'Parents target',
                    evaluation_criteria: 'Evalution criteria',
                    weight: 'Weight',
                    action: 'Action',
                    not_initialize: 'No KPI have been initialized in ',

                    // Nhóm dành cho các handle
                    confirm_approve_already: 'KPI is approved!',
                    confirm_approve: 'Are you sure you want to be approved this KPI?',
                    confirm_not_enough_weight: 'The total weight must be 100',
                    confirm_cancel_approve: 'Are you sure you want to cancel this KPI?',
                    confirm_edit_status_success: 'Edit status kpi successfully',
                    confirm_edit_status_failure: 'Edit status kpi unsuccessfully',

                    confirm_kpi: 'Are you sure you want to delete this KPI target?',
                    confirm_approving: 'KPI has been activated, you can not delete!',
                    confirm_delete_target_success: 'Delete KPI target successful',
                    confirm_delete_target_failure: 'Delete KPI target unsuccessfully',

                    // Nhóm các title
                    edit: 'Edit',
                    content: 'This is the default target (if necessary, weights can be corrected)',
                    delete_title: 'Delete',
                },

                create_organizational_unit_kpi_modal: { // Module con
                    // Nhóm dành cho modal
                    create_organizational_unit_kpi: 'Add personal KPI target',
                    name: 'Target name',
                    parents: 'Parents target',
                    evaluation_criteria: 'Evaluation criteria',
                    weight: 'Weight',
                    create_target_success: 'Add KPI target successful',
                    create_target_failure: 'You have not entered enough information',

                    // Nhóm dành cho validate
                    validate_name: {
                        empty: 'Target name cannot be empty',
                        less_than_4: 'Target name cannot be less than 4 characters',
                        more_than_50: 'Target name cannot be more than 50 characters',
                        special_character: 'Target name cannot contain special characters'
                    },
                    validate_criteria: 'Criteria cannot be empty',
                    validate_weight: {
                        empty: 'Weight cannot be empty',
                        less_than_0: 'Weight cannot be less than 0',
                        greater_than_100: 'Weight cannot be greater than 100'
                    }
                },

                kpi_member_manager: { // Module con
                    index: 'Index',
                    time: 'Date',
                    employee_name: 'Employee Name',
                    target_number: 'Target Number',
                    kpi_status: 'KPI Status',
                    result: 'Result',
                    approve: 'Approve',
                    evaluate: 'Evaluate'
                },

                create_organizational_unit_kpi_set_modal: { // Module con
                    // Nhóm dành cho modal
                    initialize_kpi_set: 'Initialize organizational unit KPI',
                    organizational_unit: 'Organizational Unit',
                    month: 'Month',
                    default_target: 'Default target',
                    create_organizational_unit_kpi_set_success: 'Initialize KPI successful',
                    create_organizational_unit_kpi_set_failure: 'You have not entered enough information'
                },

                edit_target_kpi_modal: { // Module con
                    // Nhóm dành cho modal
                    edit_organizational_unit_kpi: 'Edit personal KPI targets',
                    name: 'Target name',
                    parents: 'Parents target',
                    evaluation_criteria: 'Evaluation criteria',
                    weight: 'Weight',
                    edit_target_success: 'Edit KPI target successful',
                    edit_target_failure: 'You have not entered enough information'
                },

                //Thông điệp khác trả về từ server
                get_parent_by_unit_success: 'Get KPI by parent unit successfully',
                get_parent_by_unit_failure: 'Get KPI by parent unit unsuccessfully',
                get_kpi_unit_success: 'Get all KPI unit successfully',
                get_kpi_unit_fail: 'Get all KPI unit fail',
                get_kpiunit_by_role_success: 'Get KPI unit by role successfully',
                get_kpiunit_by_role_fail: 'Get KPI unit by role fail',
                create_kpi_unit_success: 'Create KPI unit successfully',
                create_kpi_unit_fail: 'Create KPI unit fail',
                update_evaluate_kpi_unit_success: 'Update kpi unit evaluation successfully',
                update_evaluate_kpi_unit_fail: 'Update kpi unit evaluation fail',
            }
        },
        footer: {
            copyright: 'Copyright ',
            vnist: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
            version: 'Version '
        }
    }
}