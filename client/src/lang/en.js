export default {
    locale: 'en',
    messages: {
        error: {
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
            scroll: 'Scroll bar',
            upload: 'Upload',
            pick_image: 'Pick Image',
            crop: 'Crop',
            action: 'Action',
            name: 'name',
            description: 'Description',
            search: 'Search',
            add: 'Add',
            edit: 'Edit',
            delete: 'Delete',
            save: 'Save',
            close: 'Close',
            accept: 'Accept',
            cancel: 'Cancel',
            status: 'Status',
            yes: 'Yes',
            no: 'No',
            month: 'Month',
            loading: 'Loading',
            no_data: 'No data',
            success: 'Successfully',
            error: 'Error',
            auth_alert: {
                title: 'Current Session invalid. Please log in again',
                reason: 'Reasons maybe:',
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

        auth: {
            validator: {
                confirm_password_invalid: 'Confirm password invalid! Please input again',
                password_length_error: 'Password length not less 6 or more than 30 digit',
                confirm_password_error: 'Confirm password invalid'
            },
            security: {
                label: 'Security',
                title: 'Change user password',
                old_password: 'Old password',
                new_password: 'New passowrd',
                confirm_password: 'Confirm password'
            },
            login: 'Login',
            logout: 'Log out',
            logout_all_account: 'Log out all account',
            profile: {
                label: 'Profile',
                title: 'User information',
                name: 'Username',
                email: 'Email',
                password: 'New password',
                confirm: 'Confirm password',
                otp: 'OTP'
            },

            // Thông điệp nhận từ server
            change_user_information_success: 'Change user information success',
            change_user_information_faile: 'Change user information faile',
            change_user_password_success: 'Change password success',
            change_user_password_faile: 'Change password faile',
            user_not_found: 'User not found',
            email_invalid: 'Email invalid',
            email_not_found: 'Email not found',
            password_invalid: 'Password invalid',
            email_password_invalid: 'Email or Password invalid',
            acc_blocked: 'Account blocked',
            acc_have_not_role: 'Account have not role',
            wrong5_block: 'Wrong password 5 time. Account blocked',
            request_forgot_password_success: 'Request change password success. System sent email for you. Please check email',
            reset_password_success: 'Reset password thành công',
            otp_invalid: 'OTP invalid'
        },

        system_admin: {
            company: {
                table: {
                    name: 'Company name',
                    short_name: 'Short name',
                    description: 'Description',
                    log: 'Log',
                    service: 'Services',
                    super_admin: 'SuperAdmin Account',
                },
                on: 'On',
                off: 'Off',
                add: 'Add new company',
                edit: 'Edit company',
                service: 'Company services',
                validator: {
                    name: {
                        no_blank: 'Name not null',
                        no_less4: 'Name less than 4',
                        no_more255: 'Name not more 255',
                        no_special: 'Name cannnot have special digit'
                    },
                    short_name: {
                        no_blank: 'Name not null',
                        no_less4: 'Name less than 4',
                        no_more255: 'Name not more 255',
                        no_space: 'Short name cannot have space and special digit'
                    },
                    short_name: {
                        no_blank: 'Description not null',
                        no_less4: 'Description less than 4',
                        no_more255: 'Description more than 255',
                        no_special: 'Description have special digit'
                    },
                    super_admin: {
                        no_blank: 'Email not null',
                        email_invalid: 'Email invalid',
                    }
                },

                // Thông điệp trả về từ server
                create_company_success: 'Create company success',
                show_company_success: 'Get data company success',
                edit_company_success: 'Edit company success',
                delete_company_success: 'Delete company success',
                add_new_link_for_company_success: 'Add link success',
                delete_link_for_company_success: 'Delete link successs',
                add_new_component_for_company_success: 'Add component success',
                delete_component_for_company_success: 'Delete component success',

                create_import_configuration_success: "Create import file configuration success",
                create_import_configuration_faile: "Create import file configuration faile",
                edit_import_configuration_success: "Edit import file configuration success",
                edit_import_configuration_faile: "Edit import file configuration faile",

                email_exist: 'Email exist',
                company_not_found: 'Company not found',
                link_exist: 'Link exist',
                component_exist: 'Component exist',
            },

            log: {

            },

            root_role: {
                table: {
                    name: 'Role name',
                    description: 'Description'
                },

                //Thông điệp trả về từ server
                get_root_roles_success: 'Get data root role success'
            },

            system_link: {
                table: {
                    url: 'Url',
                    category: 'Category',
                    description: 'Description',
                    roles: 'Roles',
                },
                add: 'Add new system link',
                edit: 'Edit system link',
                delete: 'Delete system link',
                validator: {
                    url: {
                        no_blank: 'Url not null',
                        start_with_slash: 'Url invalid. Must begin with /',
                    },
                    description: {
                        no_blank: 'Description not null',
                        no_special: 'Description canot have special digit',
                    }
                },

                // Thông điệp từ server
                create_system_link_success: 'Add system link success',
                edit_system_link_success: 'Edit system link success',
                delete_system_link_success: 'Delete system link success',

                system_link_url_exist: 'Url exist',
            },

            system_component: {
                table: {
                    name: 'Component name',
                    description: 'Description',
                    link: 'Link',
                    roles: 'Roles'
                },
                add: 'Add new system component',
                edit: 'Edit system component',
                delete: 'Delete system component',
                validator: {
                    name: {
                        no_space: 'Name not null',
                        no_special: 'Name cannot have special digit',
                    },
                    description: {
                        no_space: 'Description not null',
                        no_special: 'Description cannot special digit',
                    },
                },
                select_link: 'Select link',

                //Thông điệp trả về từ server
                create_system_component_success: 'Add system component success',
                get_system_component_success: 'Get data success',
                edit_system_component_success: 'Edit system component success',
                delete_system_component_success: 'Delete system component success',

                system_component_name_invalid: 'Component name invalid',
                system_component_name_exist: 'Component name exist',
            }
        },
        super_admin: {
            organization_unit: {
                //Thông điệp trả về từ server
                create_department_success: 'Create organizational unit success',
                edit_department_success: 'Edit organizational unit success',
                delete_department_success: 'Delete organizational unit success',

                department_name_exist: 'Tên đơn vị này đã được sử dụng',
                department_not_found: 'Không tìm thấy thông tin về đơn vị',
                department_has_user: 'Không thể xóa đơn vị này. Đơn vị đã có thành viên',
                role_dean_exist: 'Tên chức danh cho trưởng đơn vị đã tồn tại',
                role_vice_dean_exist: 'Tên chức danh cho phó đơn vị đã tồn tại',
                role_employee_exist: 'Tên chức danh cho nhân viên đơn vị đã tồn tại',
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

        notification: {
            title: 'Notification',
            news: 'News',
            see_all: 'See all',
            total: 'Total',
            level: 'Level',
            type: {
                title: 'Type',
                info: 'Information',
                general: 'General',
                important: 'Important',
                emergency: 'Emergency',
            },
            content: 'Content',
            sender: 'Sender',
            departments: 'Notify to organizational units',
            users: 'Notify to users',
            from: 'from',
            at: 'at',

            add: 'Add new nofitication',
            receivered: 'Receivered',
            sent: 'Sent',
            note: 'Not',
            info: 'Information',
            delete: 'Delete',
            new: 'new',

            // Thông điệp trả về từ server
            create_notification_success: 'Create notification successfully',
            create_notification_faile: 'Create notification faile',
            delete_notification_success: 'Delete notification successfully',
            delete_notification_faile: 'Delete notification faile',
            delete_manual_notification_success: 'Delete notification successfully',
            delete_manual_notification_faile: 'Delete notification faile',
        },

        document: {
            title: 'Document management',
            version: 'Version',
            information: 'Information',
            different_versions: 'Different version',
            amount: 'Amount',
            name: 'Document name',
            description: 'Description',
            category: 'Category',
            domain: 'Domain',
            roles: 'Roles has privilege to see',
            issuing_date: 'Issuing date',
            effective_date: 'Effective date',
            expired_date: 'Expired date',
            views: 'Views',
            viewer: 'Viewer',
            downloader: "Downloader",
            downloads: 'Downloads',
            add: 'Add document',
            edit: 'Edit document',
            view: 'View document',
            time: "Time",
            delete: 'Delete document',
            add_version: 'Add document version',
            upload_file: 'Upload file',
            upload_file_scan: 'Upload file scan',
            download: 'Download',
            no_version: 'Not have different version',
            no_blank_description: "Description should'n empty",
            no_blank_name: "Name shouldn't empty",
            infomation_docs: "Document Infomation",
            relationship_role_store: "Relationship, role and store",
            statistical_document: "Statistical type of document",
            statistical_view_down: "Statistical of view and download type of document",
            doc_version: {
                title: 'Version',
                name: 'Version name',
                description: 'Description',
                issuing_body: 'Issuing body',
                official_number: 'Official number',
                issuing_date: 'Issuing date',
                effective_date: 'Effective date',
                expired_date: 'Expired date',
                signer: 'Signer',
                number_view: 'Number of view',
                number_download: 'Number of download',
                file: 'File upload',
                scanned_file_of_signed_document: 'File scan',
                exp_issuing_body: 'Example: Administrative agencies',
                exp_official_number: 'Example: 05062020VN',
                exp_signer: "Example: Nguyễn Việt Anh",
                exp_version: "Version 1",
                no_blank_issuingbody: "Issuing body should'n empty",
                no_blank_version_name: "Version name should'n empty",
                no_blank_official_number: "Official number should'n empty",
                error_office_number: "Offical must have at least one number character",
                no_blank_issuingdate: "Issuing date shouldn't empty",
                no_blank_effectivedate: "Effective date shouldn't empty",
                no_blank_expired_date: "Expired date shouldn't empty",
                no_blank_signer: "Signer shouldn't empty",
                no_blank_file: "Not have file",
                no_blank_file_scan: "Note have file scan",
                no_blank_category: "Categoty shouldn't empty",
            },
            relationship: {
                title: 'Document relationship',
                description: 'Relationship description',
                list: 'Document relationship list'
            },
            store: {
                title: 'Store',
                information: 'Information',
                organizational_unit_manage: 'Organizational Unit Management',
                select_organizational: 'Select organizational unit',
                user_manage: 'User management',
                select_user: 'Select user',
            },

            category: 'Document category',
            domain: 'Document domain',
            data: 'Document list data',
            statistics_report: 'Statistics report',
            history_report: 'History report',

            administration: {
                categories: {
                    add: 'Add document category',
                    edit: 'Edit document category',
                    delete: 'Delete document category',
                    name: 'Category name',
                    description: 'Description',
                    select: 'Select document category',
                    not_select: 'Not select category',
                },
                domains: {
                    add: 'Add document domain',
                    edit: 'Edit document domain',
                    delete: 'Delete document doamin',
                    name: 'Domain name',
                    description: 'Domain description',
                    parent: 'Domain parent',
                    select_parent: 'Select domain parent',
                    select: 'Select domain',
                    not_select: 'Not select domain',
                }
            },
            user: {

            },
        },

        not_found: {
            title: 'Not found this page',
            content: 'System cannot search this page for you',
            back_to_home: 'Back to homepage'
        },
        language: 'Setting language',
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
            acc_have_not_role: 'Accout have not role',
            reset_password_success: 'Reset password successfully!',
            reset_password_faile: 'Reset password faile!'
        },

        confirm: {
            yes: 'YES',
            no: 'NO',
            no_data: 'No data',
            field_invalid: "Input field invalid. Please check again!",
            loading: 'Loading data ...'
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
            documents: 'Documents',

            customer: 'Customer',

            task_template: 'Task Template',
            cocautochuc: 'Organizational Structure',
            taskmanagement: 'Task Management',
            manageDocument: 'Manage Document',
            manageDocumentType: 'Manage Document Type',

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

            manage_warehouse: 'Manage warehouses',
            material_manager: 'Manage materials information',
            dashboard_material: "Dashboad manage materials",

            manage_kpi: 'Manage KPI',
            kpi_unit_create: 'Create unit KPI',
            kpi_unit_evaluate: 'Evaluate unit KPI',
            kpi_unit_overview: 'Overview unit KPI',
            kpi_unit_dashboard: 'Dashboard unit KPI',
            kpi_unit_statistic: 'Statistic unit KPI',
            kpi_unit_manager: 'Manage unit KPI',
            kpi_member_manager: 'Evaluate Employee KPI',
            kpi_member_dashboard: 'DashBoard KPI Member',
            kpi_personal_create: 'Create personal KPI',
            kpi_personal_evaluate: 'Evaluate personal KPI',
            kpi_personal_overview: 'Overview personal KPI',
            kpi_personal_dashboard: 'DashBoard personal KPI',
            kpi_personal_manager: 'Manager personal KPI',

            notifications: 'Notifications',

            tasks: 'Task management',
            task: "Detailed Task",
            task_management: 'Task list',
            task_management_dashboard: 'Task dashboard',
            task_organization_management_dashboard: 'Unit task dashboard',
            task_management_process: "Process list",
            //*******START */
            // Quản lý tài sản
            // QUẢN LÝ
            dashboard_asset: 'DashBoard quản lý tài sản',
            manage_asset: 'Quản lý tài sản',
            manage_type_asset: 'Quản lý loại tài sản',
            add_asset: 'Thêm tài sản',
            manage_info_asset: 'Quản lý thông tin tài sản',
            manage_history_asset: 'Quản lý lịch sử hoạt động',
            manage_repair_asset: 'Quản lý sửa chữa, thay thế',
            manage_maintain_asset: 'Quản lý bảo trì, bảo dưỡng',
            manage_distribute_asset: 'Quản lý cấp phát, điều chuyển',
            manage_depreciation_asset: 'Quản lý khấu hao tài sản',
            manage_room_asset: 'Quản lý phòng & trang thiết bị',
            manage_recommend_procure: 'Quản lý đề nghị mua sắm',
            manage_recommend_distribute_asset: 'Quản lý đề nghị cấp phát',
            manage_crash_asset: 'Quản lý sự cố tài sản',

            // NHÂN VIÊN
            recommend_equipment_procurement: 'Đăng ký mua sắm thiết bị',
            recommend_distribute_asset: 'Đăng ký cấp phát thiết bị',
            manage_assigned_asset: 'Quản lý thiết bị bàn giao',
            //******END */

            // QUẢN LÝ BÁO CÁO
            report_management: 'Report management',
            task_report: 'Manage task reports',

            //QUẢN LÝ ĐƠN HÀNG
            manage_orders: "Manage Orders",
            manage_list_orders: "Manage List Orders",
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
            zoom_out: 'Zoom Out',
            zoom_in: 'Zoom In',
            add: 'Add',
            edit_title: 'Edit organizational unit',
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
            delete: 'Delete department',
            add_success: 'Tạo đơn vị thành công',
            add_faile: 'Tạo đơn vị thất bại',
            edit_success: 'Chỉnh sửa thông tin thành công',
            edit_faile: 'Chỉnh sửa thông tin thất bại',
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
            roles: 'Roles assigned',
            name: 'User name',
            email: 'Email',
            status: 'Status'
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
            name: 'Component name',
            description: 'Description',
            link: 'Link',
            edit: 'Edit component information',
            delete: 'Delete component',
            roles: 'Roles have privilege to component',
            add_success: 'Add successfully',
            add_faile: 'Add falied!',
            edit_success: 'Edit successfully!',
            edit_faile: 'Edit failed!',
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
            not_unit: 'Not selected unit',
            add_data_by_excel: 'Add data by importing excel file',
            download_file: 'Download the sample import file',
            choose_file: 'Choose file',
            name_button_export: 'Export report',

            // Thông điệp trả về từ server dung chung cho module quản lý nhân sự
            employee_number_required: 'Staff code required',
            staff_code_not_special: 'Staff code does not contain special characters',
            staff_code_not_find: 'Staff code does not exist',
            number_decisions_required: 'Decis number required',
            number_decisions_have_exist: 'Decis number have exist',
            unit_decisions_required: 'Decis unit required',
            start_date_before_end_date: 'The start date must be before the end date',
            end_date_after_start_date: 'The end date must be after the start date',


            // Quản lý lương nhân viên
            salary: {
                list_salary: 'List of staff salary',
                file_name_export: 'Salary tracking table',

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
                employee_code_duplicated: 'Staff code is duplicated',
                employee_name_required: 'Staff name required',
                employee_number_required: 'Staff code required',
                staff_code_not_special: 'Staff code does not contain special characters',
                staff_code_not_find: 'Staff code does not exist',
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
                import_salary_success: 'Import salary success',
                import_salary_faile: 'Import salary faile',
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
                employee_code_duplicated: 'Staff code is duplicated',
                employee_name_required: 'Staff name required',
                employee_number_required: 'Staff code required',
                staff_code_not_special: 'Staff code does not contain special characters',
                staff_code_not_find: 'Staff code does not exist',
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

                },

                employee_management: {
                    // Thông điệp trả về từ server
                    get_list_employee_success: 'Get list employee success',
                    get_list_employee_false: 'Get list employee false',
                    create_employee_success: 'Create employee success',
                    create_employee_false: 'Create employee false',
                    delete_employee_success: 'Delete employee success',
                    delete_employee_false: 'Delete employee false',
                    edit_employee_success: 'Edit employee success',
                    edit_employee_false: 'Edit employee false',
                    employee_number_required: 'Staff code required',
                    email_in_company_required: 'Email in company required',
                    employee_number_have_exist: 'Employee number have exist',
                    email_in_company_have_exist: 'Email in company have exist',
                    employee_timesheet_id_required: 'Employee timesheet id required',
                    full_name_required: 'Full name required',
                    birthdate_required: 'Birthdate required',
                    starting_date_required: 'Starting date required',
                    identity_card_number_required: 'Identity card number required',
                    identity_card_date_required: 'Identity card date required',
                    identity_card_address_required: 'Identity card address required',
                    phone_number_required: 'Phone number required',
                    tax_date_of_issue_required: 'Tax date of issue required',
                    tax_number_required: 'Tax number required',
                    tax_representative_required: 'Tax representative required',
                    tax_authority_required: 'Tax authority required',


                }
            },

            // Quản lý kế hoạch làm việc (lịch nghỉ lễ tết)
            holiday: {

                // Thông điệp trả về từ server
                start_date_required: 'Start date required',
                end_date_required: 'End date required',
                reason_required: 'Reason required',
                holiday_duplicate_required: 'Time is overlapping',

                get_holiday_success: 'Get holiday success',
                get_holiday_faile: 'Get holiday faile',
                create_holiday_success: 'Create holiday success',
                create_holiday_faile: 'Create holiday faile',
                delete_holiday_success: 'Delete holiday success',
                delete_holiday_faile: 'Delete holiday faile',
                edit_holiday_success: 'Edit holiday success',
                edit_holiday_faile: 'Edit holiday faile',
                import_holiday_success: 'Import holiday success',
                import_holiday_faile: 'Import holiday faile',

            },

            // Quản lý chấm công nhân viên
            timesheets: {
                // Thông điệp trả về từ server
                employee_number_required: "Staff code required",
                month_timesheets_required: "Month timesheets required",
                staff_code_not_find: "Staff code does not exist",
                month_timesheets_have_exist: "Month timesheets have exist",
                get_timesheets_success: "Get timesheets success",
                get_timesheets_faile: "Get timesheets faile",
                create_timesheets_success: "Create timesheets success",
                create_timesheets_faile: "Create timesheets faile",
                edit_timesheets_success: "Edit timesheets success",
                edit_timesheets_faile: "Edit timesheets faile",
                delete_timesheets_success: "Delete timesheets success",
                delete_timesheets_faile: "Delete timesheets faile",
                import_timesheets_success: "Import timesheets success",
                import_timesheets_faile: "Import timesheets faile",

            },
        },

        // Modules quản lý đào tạo
        training: {
            course: {

                // Thông điệp trả về từ server
                name_required: 'Name of the training course required',
                course_id_required: 'Course id required',
                offered_by_required: 'Offered by required',
                course_place_required: 'Course place required',
                start_date_required: 'Start date required',
                end_date_required: 'End date required',
                type_required: 'Type of training required',
                education_program_required: 'Under the training program required',
                employee_commitment_time_required: 'Time commitment required',
                cost_required: 'Cost required',
                course_id_have_exist: 'Course id already exists',

                get_list_course_success: 'Get list course success',
                get_list_course_success: 'Get list course success',
                create_course_success: 'Create course success',
                create_course_faile: 'Create course faile',
                delete_course_success: 'Delete course success',
                delete_course_faile: 'Delete course faile',
                edit_course_success: 'Edit course success',
                edit_course_faile: 'Edit course faile',
            },

            // Quản lý chương trình đào tạo
            education_program: {

                // Thông điệp trả về từ server
                apply_for_organizational_units_required: 'Apply for organizational units required',
                apply_for_positions_required: 'Apply for positions required',
                program_id_required: 'Program id required',
                name_required: 'Program name required',
                program_id_have_exist: 'Program id already exist',

                get_education_program_success: 'Get education program success',
                get_education_program_faile: 'Get education program faile',
                create_education_program_success: 'Create education program success',
                create_education_program_faile: 'Create education program faile',
                delete_education_program_success: 'Delete education program success',
                delete_education_program_faile: 'Delete education program faile',
                edit_education_program_success: 'Edit ducation program success',
                edit_education_program_faile: 'Edit education program faile',
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
            error_title: 'This work template cannot be deleted because itedirt is already in use.',
            name: 'Template name',
            unit: 'Unit',
            tasktemplate_name: 'Task template name',
            description: 'Description',
            count: 'Number of uses',
            creator: 'Creator',
            unit: 'Unit',
            action: 'Action',
            priority: 'Priority',
            general_information: 'General information',
            parameters: 'Parameters',
            roles: 'Roles',
            edit_tasktemplate: 'Edit tasktemplate',
            action_name: 'Action name',
            mandatory: 'mandatory',
            delete: 'Delete',
            cancel_editing: 'Cancel editing',
            add_tasktemplate: 'Add tasktemplate',
            infor_name: 'Information name',
            datatypes: 'Datatypes',
            manager_fill: 'Only manager fill',
            high: 'High',
            low: 'Low',
            medium: 'Medium',
            text: 'Text',
            number: 'Number',
            date: 'Date',
            value_set: 'Value set',
            code: 'Code',
            view_detail_of_this_task_template: 'View detail of this task',
            edit_this_task_template: 'Edit this task template',
            delete_this_task_template: 'Delete this task template',
        },

        task: {
            task_management: {
                get_subtask_success: 'Get sub task success',
                get_task_of_informed_employee_success: 'Get task of informed employee success',
                get_task_of_creator_success: 'Get task of creator success',
                get_task_of_consulted_employee_success: 'Get task of consulted employee success',
                get_task_of_accountable_employee_success: 'Get task of accountable employee success',
                get_task_of_responsible_employee_success: 'Get task of responsible employee success',
                get_tasks_by_role_success: 'Get task by role success',
                get_task_by_id_success: 'Get task by id success',
                get_task_evaluation_success: 'Get task evaluation success',
                get_all_task_success: 'Get all task success',
                create_task_success: 'Create new task succesfully',
                delete_success: 'Delete task successfully',
                edit_status_of_task_success: 'Edit status of task successfully',
                edit_status_archived_of_task_success: 'Edit archived status of task successfully',

                get_subtask_fail: 'Get sub task fail',
                get_task_of_informed_employee_fail: 'Get task of informed employee fail',
                get_task_of_creator_success: 'Get task of creator fail',
                get_task_of_consulted_employee_fail: 'Get task of consulted employee fail',
                get_task_of_accountable_employee_fail: 'Get task of accountable employee fail',
                get_task_of_responsible_employee_fail: 'Get task of responsible employee fail',
                get_tasks_by_role_fail: 'Get task by role fail',
                get_task_by_id_fail: 'Get task by id fail',
                get_task_evaluation_fail: 'Get task evaluation fail',
                get_all_task_fail: 'Get all task fail',
                create_task_fail: "Can't create new task",
                delete_fail: "Can't delete task successfully",
                edit_status_of_task_fail: "Can't edit status of task",
                edit_status_archived_of_task_fail: "Can't edit archived status of task",
                confirm_delete: 'This task cannot be deleted because it is in progress!',

                responsible: 'Responsible',
                accountable: 'Acountable',
                consulted: 'Consulted',
                creator: 'Creator',
                informed: 'Informed',

                add_task: 'Add task',
                add_title: 'Add a new task',
                add_subtask: 'Add sub task',

                department: 'Department',
                select_department: 'Select department',
                select_all_department: 'Selected all',
                role: 'Role',

                status: 'Status',
                select_status: 'Select status',
                select_all_status: 'Selected all',
                inprocess: 'In process',
                wait_for_approval: 'Wait for approval',
                finished: 'Finished',
                delayed: 'Delayed',
                canceled: 'Canceled',

                priority: 'Priority',
                select_priority: 'Select priority',
                select_all_priority: 'Selected all',
                high: 'High',
                normal: 'Normal',
                low: 'Low',

                special: 'Special',
                select_all_special: 'Selected all',
                select_special: 'Select special',
                stored: 'Stored',
                current_month: 'Current month',

                name: "Name of task",
                search_by_name: 'Search by name',

                start_date: 'Start date',
                end_date: 'End date',

                search: "Search",


                from: 'From',
                to: 'To',
                month: 'Month',
                prev: 'Prev',
                next: 'Next',
                tasks_calendar: 'Tasks Calendar',
                model_detail_task_title: 'Detail task',
                collaborative_tasks: 'Collaborative tasks',
                in_time: 'In time',
                delayed_time: 'Delayed',
                not_achieved: 'Overdue',

                col_name: 'Name of task',
                col_organization: 'Department',
                col_priority: 'Priority',
                col_start_date: 'Start date',
                col_end_date: 'End date',
                col_status: 'Status',
                col_progress: 'Progress',
                col_logged_time: 'Tatal logged time',

                action_edit: 'Start working',
                action_delete: 'Delete task',
                action_store: 'Store task',
                action_restore: 'Restore task',
                action_add: 'Add new subtask',
                action_start_timer: 'Start timer',

                err_organizational_unit: 'Organizational Unit deleted',
                err_name_task: 'Name deleted',
                err_priority: 'Priority deleted',
                err_status: 'Status deleted',
                err_start_date: 'Start date deleted',
                err_end_date: 'End date deleted',
                err_progress: 'Progress deleted',
                err_total_log_time: 'Total logged time deleted',

                detail_refresh: 'Refresh',
                detail_edit: 'Edit',
                detail_end: 'Finish',
                detail_evaluate: 'Evaluate',
                detail_start_timer: 'Start timer',
                detail_hide_info: 'Hide information',
                detail_show_info: 'Show information',
                detail_choose_role: 'Change role',

                detail_link: 'Task link',
                detail_priority: 'Priority',
                detail_status: 'Status',
                detail_time: 'Working duration',

                detail_general_info: 'General infomation',
                detail_description: 'Description',
                detail_info: 'Task infomation',
                detail_progress: 'Progress task',
                detail_value: 'Value',
                detail_not_hasinfo: 'Not has infomation',
                detail_eval: 'Evaluation',
                detail_point: 'Member Point',
                detail_auto_point: 'Automatic point',
                detail_emp_point: 'Employee point',
                detail_acc_point: 'Approve point',
                detail_not_auto: 'Unset automatic point',
                detail_not_emp: 'Unset employee point',
                detail_not_acc: 'Unset accountable point',

                detail_not_eval_on_month: 'Not evaluate this month',
                detail_not_eval: 'Nobody evaluate this month',
                detail_kpi: 'Linked KPI',
                detail_not_kpi: 'Task has not linked to KPI',
                detail_all_not_kpi: 'Nobody linked KPI',
                detailt_none_eval: 'Task has not evaluated any time',

                detail_resp_edit: 'Edit task by responsible employee',
                detail_acc_edit: 'Edit task by accountable employee',
                detail_resp_eval: 'Evaluate task by responsible employee',
                detail_acc_eval: 'Evaluate task by accountable employee',
                detail_cons_eval: 'Evaluate task by consulted employee',
                detail_resp_stop: 'Finish task by responsible employee',
                detail_acc_stop: 'Finish task by accountable employee',
                detail_cons_stop: 'Finish task by consulted employee',
                detail_task_permission: 'Task is invalid or you do not have permission',

                evaluate_date: 'Evaluate date',
                evaluate_member: 'Evaluate members of task',
                detail_not_calc_auto_point: 'Not calculate',
                detail_auto_on_system: 'Automatic point on system',
                detail_not_auto_on_system: 'Not has automatic point on system',
                action_not_rating: 'List of action has not been rate',
                no_action: 'Empty',
                contribution: 'Contribution',
                not_eval: 'Not evaluate',
                acc_evaluate: 'Accountable evaluation',
                name_employee: 'Name',
                role_employee: 'Role',
                detail_emp_point_of: 'Employee point of',

                enter_emp_point: 'Enter employee point',
                responsible_not_eval: 'Responsible employee has not evaluated',
                not_eval_on_month: 'Not has evaluation information of this month',

                edit_basic_info: 'Basic information',
                edit_detail_info: 'Detail information',
                edit_member_info: 'Member information',
                edit_inactive_emp: 'Inactive employees',
                edit_enter_progress: 'Enter progress',
                edit_enter_value: 'Enter value',

                add_template: 'Task template',
                add_template_notice: 'Selected task template',
                add_parent_task: 'Parent of task',
                add_parent_task_notice: 'Select parent of task',
                add_raci: 'Assignment of responsibility',
                add_resp: 'Select responsible employee',
                add_acc: 'Select accountable employee',
                add_cons: 'Select consulted employee',
                add_inform: 'Select informed employee',

                calc_form: 'Automatic point informtion',
                calc_formula: 'Formula',
                calc_overdue_date: 'Overdue date of task',
                calc_day_used: 'Time from start date to today',
                calc_average_action_rating: 'Average action of task rating',
                calc_progress: 'Progress of task',
                calc_new_formula: 'Current formula',
                calc_total_day: 'Time from start date to end date',
                calc_days: 'days',
                calc_where: 'Where',
                calc_no_value: 'No value',
                calc_nan: 'NAN',
                explain: ' (Negative values ​​will be considered as 0)',
                eval_list: 'List of evaluations',
                title_eval: 'Evaluate task',

                btn_save_eval: 'Save evaluation',
                btn_get_info: 'Get infomation task',
                note_not_eval: 'You can no longer edit reviews because it is more than 7 days after the last review.',
                note_eval: 'Number of days left to edit review: ',

                add_eval_of_this_month: 'Add evaluation of this month',
                eval_of: 'Evaluation of',
                eval_from: 'Evaluation from',
                eval_to: 'Evaluation to',
                store_info: 'Save the input data into task infomation',
                bool_yes: 'Yes',
                bool_no: 'No',

                detail_evaluation: 'Evaluation infomation',
                err_eval_start: 'Evaluate date should be greater than equal start date',
                err_eval_end: 'Evaluate date should be less than equal end date',
                err_eval_on_month: 'Evaluate date should be day of month',
                explain_avg_rating: 'Since no activity has been evaluated, the activity rating default is 10',

                info_eval_month: 'Task infomation in evaluation',

                auto_point_field: 'Automatic point of task in this month',
                get_outside_info: 'Auto fill evaluation infomation from task infomation',

                dashboard_created: 'Created',
                dashboard_need_perform: 'Need to perform',
                dashboard_need_approve: 'Need to approve',
                dashboard_need_consult: 'Need to consult',
                dashboard_area_result: 'Result area dashboard',
                dashboard_overdue: 'Overdue task',
                dashboard_about_to_overdue: 'Task is about to overdue',
                dashboard_max: 'Max',
                dashboard_min: 'Min',

                err_require: 'Field is required',
                err_date_required: 'Date is required',
                err_nan: 'The value must be number',

                // mes_notice
                edit_task_success: 'Edit task success',
                evaluate_task_success: 'Evaluate task success',
                edit_task_fail: 'Edit task fail',
                evaluate_task_fail: 'Evaluate task fail',

                add_new_task: 'Add new task',
                // add_err: 
                add_err_empty_unit: 'Unit should not be empty',
                add_err_empty_name: 'Name should not be empty',
                add_err_empty_description: 'Description should not be empty',
                add_err_empty_start_date: 'Start date should not be empty',
                add_err_empty_end_date: 'End date should not be empty',
                add_err_empty_responsible: 'Responsible should not be empty',
                add_err_empty_accountable: 'Accountable should not be empty',
                add_err_special_character: 'This field should not be have special character',
                add_err_end_date: 'End date should be after start date',

                unit_evaluate: "Unit receiving work evaluation results",
                unit_manage_task: "Unit managing task",
                delete_eval: "Delete evaluation",
                delete_eval_title: 'Are you sure to delete this evaluation?'

            },
            task_perform: {
                actions: "Actions",
                communication: "Communications",
                documents: "Documents",
                timesheetlogs: "Timesheet Logs",
                subtasks: "Subtasks",
                change_history: "Change logs",
                edit_action: "Edit action",
                delete_action: "Delete action",
                mandatory_action: "Mandatory action",
                confirm_action: "Confirm action",
                evaluation: "Evaluation",
                attach_file: "Attach file",
                comment: "Comment",
                re_evaluation: "Re-evaluation",
                question_delete_file: "Are you sure to delete",
                edit_comment: "Edit comment",
                delete_comment: "Delete comment",
                file_attach: "Attach file",
                save_edit: "Save edit",
                cancel: "Cancel",
                enter_comment: "Comment",
                create_comment: "Create comment",
                enter_description: "Description",
                create_description: "Create description",
                create_document: "Create documents",
                none_description: "No description",
                enter_action: "Action",
                create_action: "Create action",
                total_time: "Total time",
                time: "Time",
                none_subtask: "No subtask",
                enter_comment_action: "Comment of action",
                create_comment_action: "Create comment",
                stop_timer: "Stop timer",
                edit: "Edit",
                delete: "Delete",







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
                create_task_comment_success: 'Create task comment success',
                get_task_comments_success: ' Get all task comments success',
                edit_task_comment_success: ' Edit task comment success',
                delete_task_comment_success: 'Delete task comment success',
                create_comment_of_task_comment_success: 'Create comment of task comment success',
                edit_comment_of_task_comment_success: 'Edit comment of task comment success',
                delete_comment_of_task_comment_success: ' Delete comment of task comment success',
                evaluation_action_success: 'Evaluation action success',
                confirm_action_success: 'Confirm action success',
                delete_file_child_task_comment_success: "Delete file of child task comment success",
                upload_file_success: "Upload file success",
                delete_file_success: "Delete file of action success",
                delete_file_comment_of_action_success: "Delete file of comment of action success",
                delete_file_task_comment_success: "Delete file of task comment",
                create_task_log_success: " Create task log success",
                get_task_log_success: "get_task_log_success",

                create_result_task_fail: "Can't evaluate task",
                edit_result_task_fail: "Can't edit result task",
                get_task_actions_fail: 'Get all task actions fail',
                create_task_action_fail: 'Create task action fail',
                edit_task_action_fail: 'Edit task action fail',
                delete_task_action_fail: 'Delete task action fail',
                get_action_comments_fail: 'Get all action comments fail',
                create_action_comment_fail: 'Create action comments fail',
                edit_action_comment_fail: 'Edit action comments fail',
                delete_action_comment_fail: 'Delete action comments fail',
                get_log_timer_fail: 'Get log timer fail',
                get_timer_status_fail: 'get timer status fail',
                start_timer_fail: 'Start timer fail',
                pause_timer_fail: 'Pause timer fail',
                continue_timer_fail: 'Continue timer fail',
                stop_timer_fail: 'Stop timer fail',
                create_result_info_task_fail: 'Create result infomation task fail',
                create_result_infomation_task_fail: 'Create result infomation task fail',
                edit_result_infomation_task_success: 'Edit result infomation task fail',
                create_task_comment_fail: 'Create task comment fail',
                get_task_comments_fail: 'Get all task comments fail',
                edit_task_comment_fail: 'Edit task comment fail',
                delete_task_comment_fail: 'Delete task comment fail',
                create_comment_of_task_comment_fail: 'Create comment of task comment fail',
                edit_comment_of_task_comment_fail: 'Edit comment of task comment fail',
                delete_comment_of_task_comment_fail: 'Delete comment of task comment fail',
                evaluation_action_fail: 'Evaluation action fail',
                confirm_action_fail: 'Confirm action fail',
                delete_file_child_task_comment_fail: "Delete file of child task comment fail",
                upload_file_fail: "Upload file fail",
                delete_file_fail: "Delete file of action fail",
                delete_file_comment_of_action_fail: "Delete file of comment of action success",
                delete_file_task_comment_fail: "Delete file of task comment fail",
                create_task_log_fail: "Create task log fail",
                get_task_log_fail: "get_task_log_fail",

                // error label
                err_require: 'Field is required',
                err_date_required: 'Date is required',
                err_nan: 'The value must be number',
                err_has_accountable: 'Must be have accountable employee at least one',
                err_has_consulted: 'Must be have consulted employee at least one',
                err_has_responsible: 'Must be have responsible employee at least one',

                // swal
                confirm: 'Confirm',

                // modal approve task
                modal_approve_task: {
                    title: 'Request to finish task',
                    msg_success: 'Approved success',
                    msg_faile: 'Approved failure',

                    task_info: 'Information of task',
                    percent: 'Progress of task',

                    auto_point: 'Automatic point',
                    employee_point: 'Employee point',
                    approved_point: 'Accountable point',

                    responsible: 'Responsible role',
                    consulted: 'Consulted role',
                    accountable: 'Accountable role',

                    err_range: 'Value must be between 0 and 100',
                    err_contribute: 'Sum of contribution should be 100',
                    err_empty: "Value must be required"
                }
            },
            task_template: {
                create_task_template_success: 'Create task template success !',
                create_task_template_fail: 'Create task template fail !',
                edit_task_template_success: 'Edit task template success !',
                edit_task_template_fail: 'Edit task template fail !',
                delete_task_template_success: 'Delete task template success !',
                delete_task_template_fail: 'Delete task template fail !',
                error_task_template_creator_null: 'Creator of this task template does not exist or has deleted',

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
                        satisfied: 'Satisfied',
                        not_satisfied: 'Not Satisfied',
                        initialize_kpi_newmonth: 'Initialize KPI new month',
                        request_approval: 'Request for approval',
                        cancel_request_approval: 'Cancel request for approval',
                        not_initialize_organiztional_unit_kpi: 'Cannot initialize kpi on this month bacause your unit has not initialized kpi on this month yet, please contact the manager of your unit',
                        not_activate_organiztional_unit_kpi: 'Your unit has not activated kpi on this month yet, please contact the manager of your unit',

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
                        weight: 'Weight',
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
                        handle_populate_info_null: {
                            error_kpi_approver_null: 'Error! The approver of this KPI set is not exist or was deleted',
                            error_kpi_organizational_unit_null: 'Error! The organizational unit of this KPI set is not exist or was deleted',
                            error_kpi_parent_target_null: 'Error! The parent target of this KPI set is not exist or was deleted',
                            error_kpi_targets_list_null: 'Error! The list targets of this KPI set is not exist or was deleted',
                        }
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

                dashboard: {
                    organizational_unit: 'Unit',
                    select_units: 'Select organizational unit',
                    all_unit: 'All organizational unit',
                    search: 'Search',
                    setting_up: 'Setting up',
                    awaiting_approval: 'Awaiting approval',
                    activated: 'Activated',
                    number_of_employee: 'Number of employees',
                    excellent_employee: 'Excellent Employees',
                    best_employee: 'Best employee',
                    month: 'Month',
                    auto_point: 'Automatic Point',
                    employee_point: 'Employee Point',
                    approve_point: 'Approve Point',
                    option: 'Options',
                    analyze: 'Analyze',
                    statistics_chart_title: 'Statistics KPI of employees',
                    result_kpi_titile: 'Result KPI of all employees',
                    auto_eva: 'Evaluated automatically',
                    employee_eva: 'Evaluated by Employee',
                    approver_eva: 'Evaluated by Approver',
                    result_kpi_personal: 'Personal KPI result',
                    distribution_kpi_personal: 'Distribution of KPI personal'
                },

                employee_evaluation: {

                    /**
                     * Approve
                     */
                    approve_KPI_employee: 'Approve KPI employee',
                    month: '',
                    end_compare: 'End comparing',
                    compare: 'Compare',
                    approve_all: 'Approve all',
                    choose_month_cmp: 'Choose month',
                    kpi_this_month: 'KPI month',
                    search: 'Search',
                    number_of_targets: 'Number of targets',
                    system_evaluate: 'System evaluate',
                    result_self_evaluate: 'Result self evaluate',
                    evaluation_management: 'Evaluation management',
                    not_evaluated_yet: 'Not evaluated yet',
                    view_detail: 'View detail',
                    clone_to_new_kpi: 'Create new kpi based on kpi in this month',
                    index: 'ID',
                    name: 'Name',
                    target: 'Kpi unit',
                    criteria: 'Criteria',
                    weight: 'Weight',
                    result: 'Result',
                    target: 'targets',
                    data_not_found: 'There is no satisfied result',
                    unsuitable_weight: 'Unsuitable weight',
                    status: 'Status',
                    action: 'Action',
                    save_result: 'Save result',
                    edit_target: 'Edit kpi',
                    pass: 'Pass',
                    fail: 'Fail',

                    /**
                     * Comment
                     */
                    edit_cmt: 'Edit comment',
                    delete_cmt: 'Delete comment',
                    add_cmt: 'Add comment',
                    attached_file: 'Attach file',
                    send_edition: 'Submit edition',
                    cancel: 'Cancel',
                    comment: 'Comment',

                    /**
                     * Evaluate
                     */
                    KPI_list: 'KPI list',
                    calc_kpi_point: 'Caculate KPI point',
                    export_file: 'Export file',
                    KPI_info: 'Infomation of ',
                    point_field: 'Point (Automatic - Employee - Approver)',
                    not_avaiable: 'Not evaluated',
                    no_point: 'No Point',
                    lastest_evaluation: 'Lastest evaluation',
                    task_list: 'Task list',
                    work_duration_time: 'Working duration time',
                    evaluate_time: 'Evaluate time',
                    contribution: 'Contribution',
                    importance_level: 'Importance level',
                    point: 'Point',
                    evaluated_value: 'Evaluate value',
                    new_value: 'New value',
                    old_value: 'Old value',
                    auto_value: 'Auto value',
                    /**
                     * Management
                     */
                    wrong_time: 'Start time should be earlier than end time',
                    confirm: 'Confirm',
                    choose_employee: 'Choose employee',
                    employee: 'Employee',
                    choose_status: 'Choose status',
                    establishing: 'Establishing',
                    expecting: 'Waiting for approving',
                    activated: 'Activated',
                    time: 'Time',
                    num_of_kpi: 'Number of KPI',
                    kpi_status: 'KPI status',
                    approve: 'Approve',
                    evaluate: 'Evaluate',
                    approve_this_kpi: 'Approve this KPI',
                    evaluate_this_kpi: 'Evaluate this KPI',
                    from: 'From',
                    to: 'To',

                    /**
                     * Importance Dialog
                     */
                    num_of_working_day: 'Number of working day',
                    priority: 'Priority',
                    formula: 'Formula',
                    explain_automatic_point: 'Explain automatic value'
                },

                /**
                 * Thông báo từ service
                 */
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
                set_task_importance_level_success: 'Set task importance level successfully',
                set_task_importance_level_fail: 'Set task importance level fail'
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
                // Dashboard KPI Unit
                dashboard: {
                    organizational_unit: 'Department',
                    month: 'Month',
                    trend: 'Implement target trend of employee',
                    distributive: 'Distributive KPI unit in ',
                    statiscial: 'Statistical result of KPI unit in',
                    result_kpi_unit: 'Result of KPI unit',
                    result_kpi_units: 'Result of KPI units',
                    start_date: 'Start date',
                    end_date: 'End date',
                    search: 'Search',
                    point: 'Point',
                    no_data: 'No data',
                    trend_chart: {
                        execution_time: 'Execution time (Days)',
                        participants: 'Participants',
                        amount_tasks: 'Amount of tasks',
                        amount_child_kpi: 'Amount of child KPI',
                        weight: 'Weight'
                    },
                    result_kpi_unit_chart: {
                        automatic_point: 'Automatic point',
                        employee_point: 'Employee point',
                        approved_point: 'Approved point',
                    },
                    alert_search: {
                        search: 'The start time must be before or equal to the end time!',
                        confirm: 'Confirm'
                    },
                    statistic_kpi_unit: {
                        count_employee_same_point: 'Count Employee With The Same Point',
                        automatic_point: 'Automatic point',
                        employee_point: 'Employee point',
                        approved_point: 'Approved point',

                    }
                },

                management: {
                    copy_modal: {
                        alert: {
                            check_new_date: 'No initialization month selected',
                            confirm: 'Confirm',
                            coincide_month: 'KPI already exists on ',
                            unable_kpi: 'Unable to create new KPI in the past',
                            change_link: 'Remember to change the link to the parent target to get the new KPI!'
                        },
                        create: 'Copy a new KPI from the KPI on ',
                        organizational_unit: 'Department',
                        month: 'Month',
                        list_target: 'List target',
                        setting: 'Constitute',
                        cancel: 'Cancel'
                    },
                    detail_modal: {
                        list_kpi_unit: 'List KPI unit',
                        title: 'Detailed information KPI unit on ',
                        information_kpi: 'Information KPI ',
                        criteria: 'Criteria:',
                        weight: 'Weight:',
                        export_file: 'Export file',
                        point_field: 'Point (Automatic - Employee - Approver)',
                        list_child_kpi: 'List child KPI',
                        not_eval: 'Not evaluate',
                        index: 'Index',
                        target_name: 'Target Name',
                        creator: 'Creator',
                        organization_unit: 'Department',
                        criteria: 'Criteria',
                        result: 'Result',
                        no_data: 'No data'
                    },
                    over_view: {
                        start_date: 'Start date',
                        end_date: 'End date',
                        search: 'Search',
                        status: 'Status',
                        all_status: 'All status',
                        setting_up: 'Setting-up',
                        activated: 'Activated',
                        time: 'Time',
                        creator: 'Creator',
                        number_target: 'Number target',
                        result: 'Result',
                        no_data: 'No data',
                        action: 'Action',
                        not_eval: 'Not evaluate',
                        alert_search: {
                            search: 'The start time must be before or equal to the end time!',
                            confirm: 'Confirm'
                        },
                    }
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

        manage_warehouse: {
            material_manager: {
                index: 'Index',
                add: 'Add material',
                add_title: 'Add new material',
                info: 'Material information',
                edit: 'Edit material information',
                delete: 'Delete material',
                add_success: 'Add new material successfully',
                add_faile: 'Add new material failed',
                delete_success: 'Delete material successfully',
                delete_faile: 'Delete material failed',
                edit_success: 'Edit material successfully',
                edit_faile: 'Edit material failed',
                date: 'Date',
                name: 'User name',
                code: 'Code',
                cost: 'Cost',
                description: 'Description',
                serial: 'Serial',
                purchaseDate: 'Purchase date',
                location: 'Location'
            },
            dashboard_material: {

            }
        },

        // manage order
        manage_order: {
            index: "Index",
            add_order: "Add order",
            add_title: "Add new order",
            edit_title: "Edit order",
            add_success: "Add new order successfully",
            add_failure: "Add new order failed",
            edit_success: "Order updated",
            edit_failure: "Update failed",
            delete_success: "Order deleted",
            delete_failure: "Delete failed",
            get_success: "Get data success",
            get_failure: "Can not get data",
            code: "Order code",
            quantity: "Quantity",
            amount: "Amount",
            code_placeholder: "input order code",
            edit_order: "Edit order",
            delete_order: "Delete Order",
        },

        report_manager: {
            search: 'Search',
            add_report: 'Add report',
            search_by_name: 'Search by name',
            select_all_units: 'Select all units',
            performer: 'Performer',
            description: 'Description',
            name: 'Report Name',
            unit: 'Unit',
            delete: 'Are you sure you want to delete report:',
            confirm: 'Confirm',
            cancel: 'Cancel',
            edit: 'Edit this report',
            title_delete: 'Delete this report',
            creator: 'Creator',
            no_data: 'No data',
            search_by_name: 'Search by name report',

            //message trả về từ server

            create_report_manager_success: 'Create report success !',
            create_report_manager_faile: 'Create report fail ! ',
            edit_report_manager_success: 'Edit report success !',
            edit_report_manager_faile: 'Edit report fail !',
            delete_report_manager_success: 'Delete report success !',
            delete_report_manager_faile: 'Delete report fail !',
        },

        footer: {
            copyright: 'Copyright ',
            vnist: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
            version: 'Version '
        }
    }
}