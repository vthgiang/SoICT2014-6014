export default {
    locale: "en",
    messages: {
        /*******************************************************
         * CHUẨN HÓA FILE NGÔN NGỮ PHÂN CHIA THEO TỪNG MODULE
         * @general những phần ngôn ngữ dùng chung cho mọi module
         * @module_name phần tự định nghĩa ngôn ngữ riêng của từng module khác nhau
         *******************************************************/
        general: {
            show: "Show ",
            table: "Table",
            scroll: "Scroll bar",
            upload: "Upload",
            pick_image: "Pick Image",
            crop: "Crop",
            action: "Action",
            name: "Name",
            description: "Description",
            search: "Search",
            add: "Add",
            edit: "Edit",
            delete: "Delete",
            delete_option: "Delete options",
            save: "Save",
            close: "Close",
            accept: "Accept",
            cancel: "Cancel",
            status: "Status",
            yes: "Yes",
            no: "No",
            month: "Month",
            year: "Year",
            loading: "Loading",
            no_data: "No data",
            success: "Successfully",
            error: "Error",
            index: "No.",
            new_notification: "You have a new notification!",
            month: "in",
            value: "Value",
            export: 'Export',
            add_tag: "Add a tag",
            auth_alert: {
                title: "Current Session is invalid. Please log in again",
                reason: "Reasons may be:",
                content: [
                    "Session is invalid or expired",
                    "Access denied",
                    "Page access denied",
                    "Role is invalid",
                    "Your permission has changed",
                    "Token is invalid",
                    "Company service has stopped",
                ],
            },
            server_disconnect: "Connection to server failed",
            check_connect_again: "Check the server connection again",
            validate: {
                invalid_character_error: "Error: invalid character",
                length_error: "Error: Value should have length between {min} to {max}",
                minimum_length_error:
                    "Error: Value should have minimum length of {min}",
                maximum_length_error:
                    "Error: Value should have maximum length of {max}",
                invalid_error: "Error: Value is invalid",
                empty_error: "Error: Value cannot be empty",
                not_existing_error: "Error: Value does not exist",
                existing_error: "Value already exists",
                number_input_error: "Value must be between {min} to {max}",
                number_input_error_min: "Value must be greater than {min}",
                number_input_error_max: "Value must be less than {max}"
            },
            not_org_unit: "Not have organizational unit",
            not_select_unit: "Select units",
            list_unit: "Organizational unit list",
            list_employee: "Employee list",
            detail: "Detail",
            select_all: "Select all",
            add_import: "Add data from file",
        },

        dashboard_unit: {
            urgent_chart: "The chart shows the number of urgent tasks",
            need_to_do_chart: "The chart shows the number of to-do tasks",
            urgent_task_amount: "The number of urgent tasks",
            need_to_do_task_amount: "The number of tasks to do",
            list_employe_timing: "List of employees who are timing",
            statistics_task_unit: "Statistics Of Task In Units Chart",
            get_all_unit_dashboard_data_success: "Get business dashboard data success",
            get_all_unit_dashboard_data_fail: "Get business dashboard data fail",
        },

        menu: {
            home: "Home Page",
            system_administration: "System Administration",
            manage_configuration: "Configuration",
            manage_system: "Backup and Restore",
            manage_company: "Manage Company",
            manage_role: "Manage Roles",
            manage_link: "Manage Pages",
            manage_component: "Manage permissions on page",
            manage_api: "Manage API",
            registration_api: "Manage API registration",
            registration_api_employee: "Manage API employee registration",
            privilege_api: "Manage permissions API",

            manage_department: "Manage Departments",
            manage_user: "Manage Users",

            manage_document: "Manage Documents",
            documents_og: "Manage document organizational unit",
            documents: "Documents",
            crm: "CRM",
            crm_list: {
                dashboard: "Customer management message board",
                dashboardUnit: "Customer management unit message board",
                customer: "Customer information management",
                lead: "Loyal customer",
                care: "Customer care activities",
                group: "Customer group",
                statistics: "Statistics",
                generalConfiguration: "Configuring customer care operations",
                evaluation: "Evaluating customer service activities",
                crmUnitConfiguration: "Customer care unit configuration"
            },

            task_template: "Task Template",
            cocautochuc: "Organizational Structure",
            taskmanagement: "Task Management",
            manageDocument: "Manage Document",
            manageDocumentType: "Manage Document Type",

            leave_application: "Manage leave application",
            manage_employee: "Manage Staffs",
            manage_training: "Manage Training",
            account: "Account",
            annual_leave_personal: "Annual Leave",
            manage_unit: "Manage Units",
            manage_work_plan: "Manage Work Plan",
            add_employee: "Add New Staffs",
            list_employee: "Manage Staffs Information",
            detail_employee: "Personal Information",
            update_employee: "Update Personal Information",
            dashboard_employee: "DashBoard Manage Staffs ",
            dashboard_personal: "DashBoard personal",
            dashboard_unit: "DashBoard unit",
            dashboard_all_unit: "DashBoard all unit in company",
            employee_capacity: "Employee capacity",
            discipline: "Manage Commendation And Discipline",
            annual_leave: "Manage Annual Leave",
            salary_employee: "Manage Salary",
            manage_field: "Manage career/fields",
            time_keeping: "Attendance Staff",
            list_education: "Training Programs",
            training_plan: "Manage Training Courses",
            training_plan_employee: "Training Courses",
            list_major: "Manage majors",
            list_career_position: "Manage career position",
            list_search_for_package: "Search employee for package",

            manage_warehouse: "Manage warehouses",
            dashboard_material: "Dashboad manage materials",

            manage_kpi_unit: "Organizational unit KPI",
            manage_kpi_personal: "Personal KPI",
            kpi_unit_create: "Create unit KPI",
            kpi_unit_create_for_admin: "Create unit KPI in company",
            kpi_unit_evaluate: "Evaluate unit KPI",
            kpi_unit_overview: "Overview unit KPI",
            kpi_unit_dashboard: "Dashboard unit KPI",
            kpi_unit_statistic: "Ananyze the rationality of unit KPI",
            kpi_unit_manager: "Manage organizational unit KPI",
            kpi_member_manager: "Evaluate Employee KPI",
            kpi_member_dashboard: "DashBoard KPI Member",
            kpi_personal_create: "Create personal KPI",
            kpi_personal_evaluate: "Evaluate personal KPI",
            kpi_personal_overview: "Overview personal KPI",
            kpi_personal_dashboard: "DashBoard personal KPI",
            kpi_personal_manager: "Manager personal KPI",
            kpi_member_detail: "Details of personal KPI",

            notifications: "Notifications",

            tasks: "Task management",
            task: "Detailed Task",
            process_template: "Detailed Process Template",
            task_management: "Personal task list",
            task_management_of_unit: "Unit task list",
            task_management_dashboard: "Personal task dashboard",
            task_organization_management_dashboard: "Unit task dashboard",
            task_management_process: "Process list",
            task_process_template: "Process template",
            all_time_sheet_log: 'All Timesheetlogs',
            //*******START */
            // Quản lý tài sản
            // QUẢN LÝ

            add_update_asset: "Add - Update asset",
            add_asset_title: "Add new asset - Update asset",
            add_asset: "Add new asset",
            update_asset: "Update asset",
            manage_repair_asset: "Manage repair asset",
            manage_usage_asset: "Manage usage asset",
            manage_distribute_asset: "Manage distribute asset",
            manage_room_asset: "Manage room asset",
            manage_crash_asset: "Manage crash asset",

            manage_asset: "Manage assets",
            dashboard_asset: "DashBoard manage assets",
            manage_type_asset: "Manage type assets",
            manage_info_asset: "Manage infomation assets",
            manage_maintainance_asset: "Manage maintainance assets",
            manage_depreciation_asset: "Manage depreciation assets",
            manage_incident_asset: "Manage incident assets",
            manage_recommend_procure: "Manage purchase request",
            manage_recommend_distribute_asset: "Manage use request",
            employee_manage_asset_info: "Manage managed assets",

            view_building_list: "View building list",
            // NHÂN VIÊN
            recommend_equipment_procurement: "Recommend equipment procurement",
            recommend_distribute_asset: "Recommend distribute asset",
            manage_assigned_asset: "Manage assigned assets",
            //******END */

            // QUẢN LÝ BÁO CÁO
            report_management: "Report management",
            task_report: "Manage task reports",

            //QUẢN LÝ ĐƠN HÀNG
            manage_orders: "Manage Order",
            manage_sales_order: "Sales Order",
            manage_purchase_order: "Purchase Order",
            manage_quote: "Quote",
            manage_sales_order_dashboard: "Sales Order Statistics",
            manage_discount: "Discount",
            manage_tax: "Tax",
            manage_sla: "Service Level Agreement",
            manage_business_department: "Business Department",
            manage_payment: "Receipts And Payments",
            manage_bank_account: "Bank Account",

            //QUẢN LÝ KẾ HOẠCH SẢN XUẤT
            manage_plans: "Manage Plans",

            //VÍ DỤ EXAMPLE
            manage_examples: "CRUD example",
            manage_examples_1: "CRUD by model 1",
            manage_examples_2: "CRUD by model 2",
            manage_examples_hooks_1: "CRUD Hooks by model 1",
            manage_examples_hooks_2: "CRUD Hooks by model 2",

            // Quản lý sản xuất
            manage_manufacturing: "Manage manufacturing",
            manage_manufacturing_plan: "Manage manufacturing plan",
            manage_manufacturing_command: "Manage manufacturing command",
            manage_manufacturing_process: "Manage manufacturing process",
            manage_manufacturing_schedule: "Manage manufacturing schedule",
            manage_purchasing_request: "Manage purchasing request",
            manufacturing_dashboard: "Manufacturing Dashboard",
            analysis_manufacturing_performance:
                "Analysis manufacturing performance",
            manage_manufacturing_works: "Manage manufacturing works",
            manage_manufacturing_mill: "Manage manufacturing mill",

            // Quản lý dự án
            manage_project: "Manage Project",
            projects_list: 'Projects list',
            project_details: 'Projects details',
            tasks_list: 'Tasks list',
            phases_list: 'Phases list',
            issues_list: 'Issues list',
            project_report: 'Project report',
            project_evaluation: 'Evaluation',

            // Quản lý vận chuyển
            manage_transport: "Manage transport",
            manage_transport_requirements: "Manage transport requirements",
            manage_transport_plan: "Manage transport plan",
            manage_transport_schedule: "Manage transport command",
            manage_transport_vehicle: "Manage transport vehical",
            manage_transport_route: "Manage transport route",
            manage_transport_department: "Manage transport department",
            carrier_today_transport_mission: "Transporting missions today",
            carrier_all_times_transport_mission: "List of transporting missions all times",

            user_guide: "User guide",
            user_guide_detail: "User guide detail",
        },

        news_feed: {
            news_feed: 'News feed'
        },

        intro: {
            title: "Digital workspace solutions for businesses",
            contents: [
                "A friendly and convenient digital working environment for all employees",
                "Support for leadership and management at all levels to monitor and operate work through the dashboard system",
                "Exactly flexible KPI evaluation",
                "Convenient and optimal job assignment mechanism helps reduce time, comprehensively digitize business processes of enterprises in a digital work environment",
                "Save investment costs",
                "Safe and secure system data    ",
                "24/7 customer support",
            ],
            auth: {
                signin: "Sign in",
                signout: "Sign out",
                start: "Get started",
            },
            service: {
                title: "Management solutions in enterprises",
                content:
                    "We serve small and midsize companies in all technology-related industries with the high quality services outlined below.",
                kpi: {
                    title: "KPI management",
                    content: "Automatic, scientific and transparent",
                    detail:
                        "Automatic, scientific and transparent KPI management: The system provides automatic KPI calculation methods, users can customize the KPI calculation formula depending on the field of each department / unit.",
                },
                task: {
                    title: "Task management",
                    content:
                        "The mechanism of job assignment and receipt is convenient, saves time and supports users to focus on their work",
                    detail:
                        "Manage non-process work with a convenient job assignment and receipt mechanism, save working time, and support users to focus on their work. Processed work management: Helping users to grasp the current status of jobs, from which the manager has suitable, efficient and timely work organization plans. Mechanism of job assignment and receipt is done easily, saving time. Help users focus more at work.",
                },
                document: {
                    title: "Document management",
                    content:
                        "Support for centralized management of documents, convenient for searching",
                    detail:
                        "Document management is the job of storing and classifying internal data of organizations and enterprises in order to serve the business and production. Effective document management will help businesses, organize and organize documents more reasonably, save storage costs and potential time.",
                },
                employee: {
                    title: "Human resource management",
                    content:
                        "Manage information lists of personnel in the business",
                    detail:
                        "Human resource management in the enterprise Senior staff can easily track the personnel situation through statistical charts",
                },
                asset: {
                    title: "Asset management",
                    content: "Asset management in the business",
                    detail:
                        "Managing property information is easy. Retrieve information quickly. Statistics track in the form of flexible charts, easy to capture information.",
                },
            },
            service_signup: {
                title: "Register to use the service",
                content: [
                    "Free 15-day trial",
                    "Maximum 10 users access",
                    "Experience free features",
                ],
                form: {
                    customer: "Customer",
                    email: "Email",
                    phone: "Phone",
                    type: {
                        choose: "Choose service",
                        standard: "Standard",
                        full: "Full",
                    },
                    send: "Send",
                },
            },
            address: {
                title: "Address",
                content: {
                    location: "P901, 8C Ta Quang Buu, Hai Ba Trung, Hanoi.",
                    phone: "+84 986 986 247",
                    email: "office@vnist.vn",
                },
            },
            contact: {
                title: "Contact us",
                company:
                    "Vietnam Information and Communication Security Technology JSC",
                form: {
                    name: "Customer",
                    email: "Email",
                    content: "Content",
                    send: "Send",
                },
            },
            footer: {
                about_us: {
                    title: "About us",
                    content:
                        "DX digital workspace solution of Vietnam Information and Communication Security Technology JSC",
                },
                care: {
                    title: "Care",
                    content: {
                        company: "Service development company",
                        research: "Learn more about",
                    },
                },
                media: {
                    title: "Multi media",
                },
                copyright: "Copyright © 2020 VNIST - All rights reserved",
            },
        },

        auth: {
            validator: {
                confirm_password_invalid:
                    "Confirm password is invalid! Please input again",
                password_length_error:
                    "Password length is not less than 6 or more than 30 digit",
                confirm_password_error: "Confirm password is invalid",
            },
            security: {
                label: "Security",
                title: "Change user password",
                old_password: "Old password",
                new_password: "New passowrd",
                confirm_password: "Confirm password",
            },
            login: "Login",
            logout: "Log out",
            logout_all_account: "Log out all account",
            profile: {
                label: "Profile",
                title: "User information",
                name: "Username",
                input_name: "Type username",
                email: "Email",
                password: "New password",
                confirm: "Confirm password",
                otp: "OTP",
            },

            // Thông điệp nhận từ server
            change_user_information_success: "Change user information success",
            change_user_information_faile: "Change user information faile",
            change_user_password_success: "Change password success",
            change_user_password_faile: "Change password faile",
            user_not_found: "User not found",
            username_empty: "Username not empty",
            username_invalid_length: "Invalid length of username",
            email_empty: "Email should not be empty",
            email_invalid: "Email is invalid",
            email_not_found: "Email is not found",
            password_invalid: "Password is invalid",
            password2_empty: "Password2 should not be empty",
            password2_invalid: "Password2 invalid",
            email_password_invalid: "Email or Password invalid",
            acc_blocked: "Account blocked",
            acc_have_not_role: "Account have not role",
            wrong5_block: "Wrong password 5 time. Account blocked",
            request_forgot_password_success:
                "Request change password success. System sent email for you. Please check email",
            reset_password_success: "Reset password successfully",
            otp_invalid: "OTP invalid",
            portal_invalid: "Portal invalid",
        },

        system_admin: {
            company: {
                table: {
                    name: "Company name",
                    short_name: "Short name",
                    description: "Description",
                    log: "Log",
                    service: "Services",
                    super_admin: "SuperAdmin Account",
                },
                on: "On",
                off: "Off",
                add: "Add new company",
                edit: "Edit company",
                service: "Company services",
                validator: {
                    name: {
                        no_blank: "Name not null",
                        no_less4: "Name less than 4",
                        no_more255: "Name not more 255",
                        no_special: "Name cannnot have special digit",
                    },
                    short_name: {
                        no_blank: "Name not null",
                        no_less4: "Name less than 4",
                        no_more255: "Name not more 255",
                        no_space:
                            "Short name cannot have space and special digit",
                    },
                    short_name: {
                        no_blank: "Description not null",
                        no_less4: "Description less than 4",
                        no_more255: "Description more than 255",
                        no_special: "Description have special digit",
                    },
                    super_admin: {
                        no_blank: "Email not null",
                        email_invalid: "Email invalid",
                    },
                },

                // Thông điệp trả về từ server
                create_company_success: "Create company success",
                show_company_success: "Get data company success",
                edit_company_success: "Edit company success",
                delete_company_success: "Delete company success",
                add_new_link_for_company_success: "Add link success",
                delete_link_for_company_success: "Delete link successs",
                add_new_component_for_company_success: "Add component success",
                delete_component_for_company_success:
                    "Delete component success",

                create_import_configuration_success:
                    "Create import file configuration success",
                create_import_configuration_faile:
                    "Create import file configuration faile",
                edit_import_configuration_success:
                    "Edit import file configuration success",
                edit_import_configuration_faile:
                    "Edit import file configuration faile",

                email_exist: "Email already exists",
                company_not_found: "Company not found",
                link_exist: "Link already exists",
                component_exist: "Component already exists",

                update_company_links_success:
                    "Update company link successfully",
                update_company_links_faile: "Update company link faile",
                update_company_components_success:
                    "Update company component successfully",
                update_company_components_faile:
                    "Update company component faile",
            },

            system_setting: {
                backup: {
                    config: "Backup data configuration",
                    backup_button: "Backup data",
                    automatic: "Automactic",
                    on: "Backup on",
                    off: "Backup off",
                    week_day: {
                        mon: "Monday",
                        tue: "Tuesday",
                        wed: "Wednesday",
                        thur: "Thurday",
                        fri: "Friday",
                        sat: "Saturday",
                        sun: "Sunday",
                    },
                    month_list: {
                        jan: "January",
                        feb: "February",
                        mar: "March",
                        apr: "April",
                        may: "May",
                        june: "June",
                        july: "July",
                        aug: "August",
                        sep: "September",
                        oct: "October",
                        nov: "November",
                        dec: "December",
                    },
                    limit: "Limit",
                    period: "Period",
                    weekly: "Weekly",
                    monthly: "Monthly",
                    yearly: "Yearly",
                    date: "Date",
                    hour: "Hour",
                    minute: "Minute",
                    second: "Second",
                    day: "Day",
                    week: "Week",
                    month: "Month",
                    save: "Save configuration",

                    version: "Version",
                    description: "Backup description",
                    backup_time: "Backup time",
                    action: "Action",
                },
            },

            root_role: {
                table: {
                    name: "Role name",
                    description: "Description",
                },

                //Thông điệp trả về từ server
                get_root_roles_success: "Get data root role success",
            },

            system_link: {
                table: {
                    url: "Url",
                    category: "Category",
                    description: "Description",
                    roles: "Roles",
                },
                add: "Add new system link",
                edit: "Edit system link",
                delete: "Delete system link",
                validator: {
                    url: {
                        no_blank: "Url not null",
                        start_with_slash: "Url invalid. Must begin with /",
                    },
                    description: {
                        no_blank: "Description not null",
                        no_special: "Description canot have special digit",
                    },
                },

                // Thông điệp từ server
                create_system_link_success: "Add system link success",
                edit_system_link_success: "Edit system link success",
                delete_system_link_success: "Delete system link success",

                system_link_url_exist: "Url already exists",
            },

            system_component: {
                table: {
                    name: "Component name",
                    description: "Description",
                    link: "Link",
                    roles: "Roles",
                },
                add: "Add new system component",
                edit: "Edit system component",
                delete: "Delete system component",
                validator: {
                    name: {
                        no_space: "Name not null",
                        no_special: "Name cannot have special digit",
                    },
                    description: {
                        no_space: "Description not null",
                        no_special: "Description cannot special digit",
                    },
                },
                select_link: "Select link",

                //Thông điệp trả về từ server
                create_system_component_success: "Add system component success",
                get_system_component_success: "Get data success",
                edit_system_component_success: "Edit system component success",
                delete_system_component_success:
                    "Delete system component success",

                system_component_name_invalid: "Component name invalid",
                system_component_name_exist: "Component name already exists",
            },

            system_api: {
                update: "Update",

                table: {
                    path: "Path",
                    method: "Method",
                    description: "Description",
                    category: "Category"
                },
                select_all_method: "Select all method",
                non_select_method: "Select method",

                modal: {
                    create_title: 'Create a API',
                    edit_title: 'Edit a API',
                    update_title: 'Update a API',
                    delete_title: 'Delete a API'
                },

                placeholder: {
                    input_path: "Type path",
                    input_description: "Type description"
                },

                //Thông điệp trả về từ server
                create_system_api_success: 'Create system API successfully',
                create_system_api_failure: 'Can not create system API',
                system_api_exist: 'System API already exists'
            },

            system_page: {
                //Thông điệp trả về từ server
                get_system_page_apis_success: 'Get system page APIs successfully',
                get_system_page_api_failure: 'Can not get system page APIs',
            },

            privilege_system_api: {
                cancel: "Cancel privilege system apis",
                delete: "Delete privilege system apis",
                table: {
                    email: "Email",
                    description: "Description",
                    startDate: "Start date",
                    endDate: "Expiry date"
                },
                placeholder: {
                    input_email: "Type email"
                },
            }
        },

        super_admin: {
            system: {
                edit_backup_info: "Edit backup version information",
                download_backup_version: "Download backup version",
                backup_description: "Backup version information",
                restore_backup: "Restore backup",
                delete_backup: "Delete backup",

                get_backup_list_success: "Get backup list successfully",
                get_backup_list_faile: "Get backup list faile",
                create_backup_success: "Create backup successfully",
                create_backup_faile: "Create backup faile",
                delete_backup_success: "Delete backup successfully",
                delete_backup_faile: "Delete backup faile",
                restore_data_success: "Restore data successfully",
                restore_data_faile: "Restore data faile",
                edit_backup_info_success: "Edit backup information success",
                edit_backup_info_faile: "Edit backup information faile",
                backup_version_deleted: "Backup version has been deleted, cannot edit backup version information."
            },

            organization_unit: {
                //Thông điệp trả về từ server
                create_department_success: "Create organizational unit success",
                edit_department_success: "Edit organizational unit success",
                delete_department_success: "Delete organizational unit success",

                department_name_exist: "Organizational unit name already exists",
                department_not_found: "Organizational unit not found",
                department_has_user:
                    "Cannot delete. Organizational unit had employee",
                role_manager_exist: "Manager role name already exists",
                role_deputy_manager_exist: "Deputy manager role name already exists",
                role_employee_exist: "Employee role name already exists",
                role_name_exist: "This role name already exists",
                role_name_duplicate: "Input role names are duplicated"
            },
            user: {
                // Thông điệp trả về từ server
                create_user_success: "Create user successfully",
                edit_user_success: "Edit user information successfully",
                delete_user_success: "Delete user successfully",

                email_exist: "Email already exists",
                user_not_found: "User not found",
                department_not_found: "Organizational unit of user not found",
            },
            role: {
                // Thông điệp trả về từ server
                create_role_success: "Create role successfully",
                edit_role_success: "Edit role successfully",
                delete_role_success: "Delete role successfully",

                role_name_exist: "Role name already exists",
                role_manager_exist: "Manager role name already exists",
                role_deputy_manager_exist: "Deputy manager role name already exists",
                role_employee_exist: "Employee role name already exists",
            },
            link: {
                // Thông điệp trả về từ server
                create_link_success: "Create link successfully",
                edit_link_success: "Edit link successfully",
                delete_link_success: "Delete link successfully",

                cannot_create_this_url: "Cannot create this url",
                this_url_cannot_be_use: "This url cannot be use",
                url_exist: "Url already exists",
            },
            component: {
                // Thông điệp trả về từ server
                edit_component_success: "Edit component successfully",

                component_name_exist: "Component name already exists",
            },
        },

        notification: {
            title: "Notification",
            news: "News",
            see_all: "See all",
            mark_all_readed: "Mark all readed",
            total: "Total",
            level: "Level",
            type: {
                title: "Type",
                info: "Information",
                general: "General",
                important: "Important",
                emergency: "Emergency",
            },
            content: "Content",
            sender: "Sender",
            departments: "Notify to organizational units",
            users: "Notify to users",
            from: "from",
            at: "at",

            add: "Add new nofitication",
            receivered: "Receivered",
            sent: "Sent",
            unread: "Unread",
            note: "Not",
            info: "Information",
            delete: "Delete",
            new: "new",

            // Thông điệp trả về từ server
            create_notification_success: "Create notification successfully",
            create_notification_faile: "Create notification faile",
            delete_notification_success: "Delete notification successfully",
            delete_notification_faile: "Delete notification faile",
            delete_manual_notification_success:
                "Delete notification successfully",
            delete_manual_notification_faile: "Delete notification faile",
        },

        document: {
            title: "Document management",
            version: "Version",
            information: "Information",
            different_versions: "Different version",
            amount: "Amount",
            name: "Document name",
            description: "Description",

            category: "Category",
            domain: "Domain",
            data: "Document list data",
            downloaded: "Downloaded documents",
            popular: "Popular documents",
            new: "Newest documents",
            statistics_report: "Statistics report",
            history_report: "History report",
            archive: "Archive",

            roles: "Roles has privilege to see",
            issuing_date: "Issuing date",
            effective_date: "Effective date",
            expired_date: "Expired date",
            views: "Views",
            viewer: "Viewer",
            downloader: "Downloader",
            downloads: "Downloads",
            add: "Add new",
            export: "Export data",
            import: "Add data from file",
            edit: "Edit",
            view: "View",
            time: "Time",
            delete: "Delete",
            add_version: "Add new version",
            upload_file: "Upload file",
            upload_file_scan: "Upload file scan",
            choose_file: "Choose file",
            download: "Download",
            preview: "Preview",
            no_version: "Not have different version",
            no_blank_description: "Description should not empty",
            no_blank_name: "Name should not empty",
            infomation_docs: "Document Infomation",
            relationship_role_store: "Relationship, role and store",
            statistical_document: "Statistical type of document",
            statistical_view_down:
                "Statistical of view and download type of document",
            statistical_document_by_domain: "Statistical of document by domain",
            statistical_document_by_archive:
                "Statistical of document by archive",
            doc_version: {
                title: "Version",
                name: "Version name",
                description: "Description",
                issuing_body: "Issuing body",
                official_number: "Official number",
                issuing_date: "Issuing date",
                effective_date: "Effective date",
                expired_date: "Expired date",
                signer: "Signer",
                number_view: "Number of view",
                number_download: "Number of download",
                file: "File upload",
                scanned_file_of_signed_document: "File scan",
                exp_issuing_body: "Example: Administrative agencies",
                exp_official_number: "Example: 05062020VN",
                exp_signer: "Example: Peter Parker",
                exp_version: "Version 1",
                no_blank_issuingbody: "Issuing body should not empty",
                no_blank_version_name: "Version name should not empty",
                no_blank_official_number: "Official number should not empty",
                error_office_number:
                    "Offical must have at least one number character",
                no_blank_issuingdate: "Issuing date should not empty",
                no_blank_effectivedate: "Effective date should not empty",
                no_blank_expired_date: "Expired date should not empty",
                no_blank_signer: "Signer should not empty",
                no_blank_file: "Not have file",
                no_blank_file_scan: "Note have file scan",
                no_blank_category: "Categoty should not empty",
            },
            relationship: {
                title: "Document relationship",
                description: "Relationship description",
                list: "Document relationship list",
            },
            store: {
                title: "Store",
                information: "Archive Place",
                organizational_unit_manage: "Organizational Unit Management",
                select_organizational: "Select organizational unit",
                all: "Select all organizational units",
                user_manage: "User management",
                select_user: "Select user",
            },

            administration: {
                categories: {
                    add: "Add document category",
                    edit: "Edit document category",
                    delete: "Delete document category",
                    name: "Category name",
                    description: "Description",
                    select: "Select document category",
                    not_select: "Not select category",
                },
                domains: {
                    add: "Add document domain",
                    edit: "Edit document domain",
                    delete: "Delete document doamin",
                    name: "Domain name",
                    description: "Domain description",
                    parent: "Domain parent",
                    select_parent: "Select domain parent",
                    select: "Select domain",
                    not_select: "Not select domain",
                },
                archives: {
                    add: "Add document archive",
                    edit: "Edit document archive",
                    delete: "Delete document archive",
                    name: "Archive name",
                    description: "Archive description",
                    parent: "Parent directory",
                    select_parent: "Select archive parent",
                    select: "Select archive",
                    not_select: "Not select archive",
                    path: "Path",
                    path_detail: "Detail path",
                },
            },
            user: {
                title: "Documents",
            },

            //Response message from server
            get_documents_success: "Get documents successfully",
            get_documents_faile: "Get documents faile",
            create_document_success: "Create new document successfully",
            create_document_faile: "Create new document faile",
            import_document_success: "Import document form file successfully",
            import_document_faile: "Import document form file faile",
            show_document_success: "Get document information successfully",
            show_document_faile: "Get document information faile",
            edit_document_success: "Edit document information successfully",
            edit_document_faile: "Edit document information faile",
            add_document_logs_success: "Add document logs successfully",
            add_document_logs_faile: "Add document logs faile",
            delete_document_success: "Delete document successfully",
            delete_document_faile: "Delete document faile",
            download_document_file_faile: "Download file faile",
            download_document_file_scan_faile: "Download file scan faile",
            get_document_categories_success: "Get categories successfully",
            get_document_categories_faile: "Get categories faile",
            create_document_category_success:
                "Create new category successfully",
            create_document_category_faile: "Create new category faile",
            edit_document_category_success: "Edit category successfully",
            edit_document_category_faile: "Edit category faile",
            delete_document_category_success: "Delete category successfully",
            delete_document_category_faile: "Delete category faile",
            import_document_category_success: "Import data successfully",
            import_document_category_faile: "Import data faile",
            get_document_domains_success: "Get domains successfully",
            get_document_domains_faile: "Get domains faile",
            create_document_domain_success: "Create new domain successfully",
            create_document_domain_faile: "Create new domain faile",
            edit_document_domain_success: "Edit domain successfully",
            edit_document_domain_faile: "Edit domain faile",
            delete_document_domain_success: "Delete domain successfully",
            delete_document_domain_faile: "Delete domain faile",
            import_document_domain_success: "Import file successfully",
            import_document_domain_faile: "Import file faile",
            get_document_that_role_can_view_success:
                "Get document that role can view successfully",
            get_document_that_role_can_view_faile:
                "Get document that role can view faile",
            get_document_user_statistical_success:
                "Get document statistical successfully",
            get_document_user_statistical_faile:
                "Get document statistical faile",
            get_document_archives_success: "Get archives successfully",
            get_document_archives_faile: "Get archives faile",
            create_document_archive_success: "Create new archive successfully",
            create_document_archive_faile: "Create new archive faile",
            edit_document_archive_success: "Edit archive successfully",
            edit_document_archive_faile: "Edit archive faile",
            delete_document_archive_success: "Delete archive successfully",
            delete_document_archive_faile: "Delete archive faile",
            import_document_archive_success: "Import data successfully",
            import_document_archive_faile: "Import data faile",
            cannot_download_doc_file: "Cannot download file",
            version_not_found: "Not found version",
            cannot_download_doc_file_scan: "Cannot download file scan",
            version_scan_not_found: "Not found version",
            category_used_to_document: "Category used to document",
            cannot_delete_category: "Cannot delete this category",
            document_domain_not_found: "Domain not found",
            document_archive_not_found: "Archive not found",
            domain_name_exist: "Domain name already exists",
            category_name_exist: "Category name already exists",
            name_exist: "Name already exists",
            document_exist: "Document name already exists",
            document_number_exist: "Document officical number already exists",
        },

        crm: {
            customer: {
                owner: "Manager",
                source: "Customer Source",
                company: "Company",
                companyEstablishmentDate: "Company establishment date",
                name: "Customer name",
                code: "Customer Code",
                customerType: "Customer Type",
                mobilephoneNumber: "Mobile phone number",
                telephoneNumber: "Landline number",
                group: "Customer group",
                status: "Customer Status",
                address: "Address",
                address2: "Address 2",
                represent: "Representative",
                email: "Email",
                secondaryEmail: "Secondary email",
                location: "Area",
                birth: "Date of birth",
                gender: "Gender",
                male: "Male",
                female: "Female",
                liability: "Debt",
                taxNumber: "Tax number",
                website: "Website",
                linkedIn: "linkedIn",
                document: "Documents",
                note: "Note",
                carier: "Care worker in charge",
                discount: "Discount applies",
                by_group: "By customer group",
                by_customer: "By customer",
                payment: "Form of payment",
                creator: "Creator",
                personal: "Personal",
                organization: "Organization",
                northern: "North",
                central: "Central region",
                southern: "South",

                purchaseHistories: {
                    all: "All",
                    waitingForApproval: "Waiting for approval",
                    approved: "Approved",
                    waitingForTheGoods: "Waiting for pick up",
                    deliver: "Delivering",
                    finished: "Done",
                    cancel: "Cancelled",
                },

                info: "General Information",
                contact: "Contact Information",
                advance: "More Information",
                list_attachments: "List of documents",
                file: {
                    name: "Document name",
                    description: "Description",
                    url: "Path",
                    fileName: "Filename",
                    add_file: "Add new file",
                    edit_file: "Edit file",
                    attachment: "Attachment file",
                },

                add: "Add new customer",
                add_import: "Add data from file",
                see: "View customer information",
                edit: "Edit customer information",
                delete: "Delete customer information",
                cannot_be_empty: "cannot be empty",
                value_duplicate: "duplicate",
            },

            group: {
                name: "Customer group name",
                code: "Customer group code",
                description: "Describe the customer group",
                promotion: "Additional offer",

                add: "Add new customer group",
                edit: "Edit customer group information",
                delete: "Delete customer group information",
            },

            lead: {},
            care: {
                name: "Activity name",
                caregiver: "Staff in charge",
                customer: "Customer name",
                description: "Description",
                careType: "Type of care",
                status: "Status",
                startDate: "Start Date",
                endDate: "End Date",
                notes: "Notes",
                action: "Action",
                add: "Add new customer care activities",
                info: "View details of customer care activities",
                edit: "Customer care editing",
                priority: 'Priority',
            },
            status: {
                add: "Add new status",
                edit: "Edit Status",
                delete: "Delete state",
                name: "Customer status name",
                description: "State Description",
            },
            statistics: {},
        },

        not_found: {
            title: "Not found this page",
            content: "System cannot search this page for you",
            back_to_home: "Back to homepage",
        },

        language: "Setting language",

        alert: {
            title: "Notification from system",
            log_again: "Error! Log in again!",
            access_denied: "Access denied! Log in again!",
            role_invalid: "Role invalid! Log in again!",
            page_access_denied: "Page access denied! Log in again!",
            user_role_invalid: "User and role invalid! Log in again!",
            acc_logged_out: "Timework invalid! Log in again!",
            service_off: "Your company service turning off! Try again!",
            fingerprint_invalid: "Your token invalid! Log in again!",
            service_permisson_denied:
                "You do not have permission call to Service",
            email_invalid: "Email invalid",
            password_invalid: "Password invalid",
            wrong5_block:
                "Input password wrong 5 times. Accont have been blocked!",
            acc_blocked: "Accont have been blocked!",
            acc_have_not_role: "Accout have not role",
            reset_password_success: "Reset password successfully!",
            reset_password_faile: "Reset password faile!",
        },

        confirm: {
            yes: "YES",
            no: "NO",
            no_data: "No data",
            field_invalid: "Input field invalid. Please check again!",
            loading: "Loading data ...",
        },

        form: {
            property: "Property",
            value: "Value",
            required: "Information fields required",
            save: "Save",
            close: "Close",
            email: "Email",
            password: "Password",
            password2: "Password level 2",
            portal: "Portal",
            new_password: "New password",
            confirm: "Confirm password",
            description: "Description",
            reset_password: "Reset password user account",
            forgot_password: "I forgot my password ?",
            signin: "Sign In",
            otp: "OTP",
            next: "Next",
            search: "Search",
        },

        table: {
            name: "Name",
            description: "Description",
            email: "Email",
            action: "Action",
            line_per_page: "Record/Page",
            update: "Update",
            edit: "Edit",
            delete: "Delete",
            info: "Information",
            status: "Status",
            url: "URL",
            short_name: "Short Name",
            employee_name: "Staff name",
            employee_number: "Staff code",
            total_salary: "Total income",
            month: "Month",
            unit: "Unit",
            position: "Position",
            no_data: "No data",
            start_date: "Start day",
            end_date: "End day",
            hidden_column: "Hidden columns",
            choose_hidden_columns: "Select columns to hide",
            hide_all_columns: "Hide all columns",
        },

        modal: {
            update: "Save",
            close: "Close",
            create: "Add new",
            note: "Required fields",
            add_success: "Add new success",
            add_faile: "Add new faile",
        },

        page: {
            unit: "Unit",
            position: "Position",
            month: "Month",
            status: "Status",
            staff_number: "Staff code",
            add_search: "Search",
            number_decisions: "Decis number",
            all_unit: "Select all unit",
            non_unit: "Select unit",
            all_position: "Select all position",
            non_position: "Select position",
            all_status: "Select all status",
            non_status: "Select status",
        },

        common_component: {
            import_excel: {
                config: "Import file configuration",
                user_config: "User configuration",
                file: "File import read data sheet",
                properties: "Properties",
                title: "Title",
            },

            showmore_showless: {
                showmore: "Show more",
                showless: "Show less",
                title_showmore: "Click to show more",
                title_showless: "Click to show less"
            },
            google_driver: {
                button: "Add files from Google Drive"
            }
        },

        manage_system: {
            turn_on: "Turn on",
            turn_off: "Turn off",
            log: "Log state of user request",
        },

        manage_company: {
            add: "Add",
            add_title: "Add new company",
            name: "Company name",
            short_name: "Company short name",
            description: "Company description",
            on_service: "Turn on service",
            off_service: "Turn off service",
            turning_on: "Turning on the service",
            turning_off: "Turning off the service",
            info: "Company information",
            edit: "Edit company information",
            super_admin: "SuperAdmin email of company",
            add_success: "Add new company successfully",
            add_faile: "Add new company faile",
            edit_success: "Edit company successfully",
            edit_faile: "Edit company faile",
            log: "Log",
            on: "on",
            off: "off",
            service: "Services",
        },

        manage_department: {
            zoom_out: "Zoom Out",
            zoom_in: "Zoom In",
            add: "Add",
            import: "Add data from file",
            edit_title: "Edit organizational unit",
            add_title: "Add new department",
            info: "Department Information",
            name: "Department name",
            description: "Department description",
            parent: "Parent of Department",
            no_parent: "No parent department",
            select_parent: "Select parent of department",
            roles_of_department: "Roles in Department",
            manager_name: "Positions for Manager",
            manager_example: "Ex: Manager of Financial Officer",
            deputy_manager_name: "Positions for Deputy Manager",
            deputy_manager_example: "Ex: Deputy Manager of Financial Officer",
            employee_name: "Positions for Employee",
            employee_example: "Ex: Employee of Financial Officer",
            add_with_parent: "Add new department with parent is",
            delete: "Delete department",
            add_success: "Create organizational unit successfully",
            add_faile: "Create organizational unit faile",
            edit_success: "Edit organizational unit successfully",
            edit_faile: "Edit organizational unit faile",
        },

        manage_role: {
            add: "Add",
            add_title: "Add new role",
            description: "Description",
            info: "Role information",
            name: "Role name",
            extends: "Extends of",
            users: "Users has role",
            edit: "Edit role information",
            delete: "Delete role",
            add_success: "Add new role successfully",
            add_faile: "Add new role failed",
            edit_success: "Edit role successfully",
            edit_faile: "Edit role failed",
        },

        manage_user: {
            add: "Add",
            add_title: "Add new user/account",
            add_common: 'Add common',
            import: 'Import from file',
            import_title: 'Import users data from file',
            info: "User/Account information",
            edit: "Edit User/Account information",
            disable: "Disable",
            enable: "Enable",
            delete: "Delete user",
            add_success: "Add new user successfully",
            add_faile: "Add new user failed",
            edit_success: "Edit user successfully",
            edit_faile: "Edit user failed",
            roles: "Roles assigned",
            name: "User name",
            email: "Email",
            status: "Status",
        },

        manage_link: {
            add: "Add",
            add_title: "Add new link for page",
            url: "Link of page",
            description: "Description of page",
            components: "Have components",
            roles: "Roles can access this page",
            info: "Page information",
            edit: "Edit page information",
            delete: "Delele link",
            add_success: "Add successfully",
            add_faile: "Add falied!",
            edit_success: "Edit successfully!",
            edit_faile: "Edit failed!",
            category: "Category",
        },

        manage_api: {
            description: "Description of api",
        },

        manage_component: {
            add: "Add",
            add_title: "Add new component",
            info: "Component information",
            name: "Component name",
            description: "Description",
            link: "Link",
            edit: "Edit component information",
            delete: "Delete component",
            roles: "Roles have privilege to component",
            add_success: "Add successfully",
            add_faile: "Add falied!",
            edit_success: "Edit successfully!",
            edit_faile: "Edit failed!",
        },

        // Modules cấu hình các chức năng
        module_configuration: {
            timekeeping: "Timekeeping",
            timekeeping_type: "Timekeeping type",
            contract_notice_time: "Notice of contract expiration (date)",
            contract_notice_time_title: "Notice advance of contract expiration",
            shift1_time: "Number hours of shift 1 (hour)",
            shift2_time: "Number hours of shift 2 (hour)",
            shift3_time: "Number hours of overtime (hour)",

            shift: "Timekeeping by shift",
            hours: "Timekeeping by the hour",
            shift_and_hour: "Timekeeping by shift and hour",

            // Thông điệp trả về từ server
            get_configuration_success: "Get configuration success",
            get_configuration_faile: "Get configuration faile",
            edit_configuration_success: "Edit configuration success",
            edit_configuration_faile: "Edit configuration faile",
        },

        // Module Quản lý nhân sự
        human_resource: {
            // Nhóm dùng chung cho module quản lý nhân sự
            stt: "Count",
            unit: "Unit",
            position: "Position",
            references: "References",
            month: "Month",
            status: "Status",
            staff_number: "Staff code",
            staff_name: "Staff Name",
            add_success: "Add new success",
            all_unit: "Select all unit",
            non_unit: "Select unit",
            unit_selected: "unit selected",
            non_staff: "Select staff",
            all_position: "Select all position",
            non_position: "Select position",
            position_selected: "position selected",
            all_status: "Select all status",
            non_status: "Select status",
            not_unit: "Not selected unit",
            add_data_by_excel: "Add - Update data by importing excel file",
            download_file: "Download the sample import file",
            choose_file: "Choose file",
            name_button_export: "Export report",
            choose_decision_unit: "Choose a decision-making unit",

            note_file_import: "Import file is not in the correct format",
            error_row: "An error occurred in the lines",

            rowHeader: "Number of table header rows",
            sheets_name: "Sheet names",
            title_correspond: "Title corresponds to",

            // Validator dung chung cho module quản lý nhân sự
            employee_number_required: "Staff code required",
            staff_code_not_special:
                "Staff code does not contain special characters",
            staff_code_not_find: "Staff code does not exist",
            start_date_before_end_date:
                "The start date must be before the end date",
            end_date_after_start_date:
                "The end date must be after the start date",
            cannot_be_empty: "cannot be empty",
            value_duplicate: "be duplicated",
            // Lấy thông tin bảng tin quản lý nhân sự
            get_human_resources_dashboard_data: {
                get_human_resources_dashboard_success: "Get information on successful human resource management message board",
                get_human_resources_dashboard_failed: "Retrieving information on human resource management message board failed"
            },

            // Quản lý lương nhân viên
            salary: {
                // list_salary: 'List of staff salary',
                file_name_export: "Salary tracking table",
                other_salary: "Other salary",

                // Nhóm dành cho table
                table: {
                    main_salary: "Main salary",
                    other_salary: "Other salary",
                    name_salary: "Name salary",
                    money_salary: "Money",
                    total_salary: "Total income",
                    action: "action",
                },
                // Nhóm dành cho action
                edit_salary: "Edit Salary",
                delete_salary: "Delete salary",
                add_salary: "Add salary",
                add_salary_title: "Add salary",
                add_by_hand: "Add by hand",
                add_by_hand_title: "Add by hand",
                add_import: "Add data from file",
                add_import_title: "Add data from file",
                add_more_salary: "Add other salary",
                add_new_salary: "Add new salary",

                // Thông điệp trả về từ server
                employee_code_duplicated: "Staff code is duplicated",
                employee_name_required: "Staff name required",
                employee_number_required: "Staff code required",
                staff_non_unit: "Staff non unit",
                organizationalUnit_not_found: "OrganizationalUnit was not found",
                organizationalUnit_not_empty: "OrganizationalUnit should not be empty",
                staff_code_not_special:
                    "Staff code does not contain special characters",
                staff_code_not_find: "Staff code does not exist",
                name_other_salary_required: "Name other salary required",
                money_other_salary_required: "Money other salary required",
                month_salary_required: "Month salary required",
                money_salary_required: "Money_salary required",
                month_salary_have_exist: "Month salary already exists",
                get_salary_success: "Get salary success",
                get_salary_faile: "Get salary faile",
                create_salary_success: "Create salary success",
                create_salary_faile: "Create salary faile",
                delete_salary_success: "Delete salary success",
                delete_salary_faile: "Delete salary faile",
                edit_salary_success: "Edit salary success",
                edit_salary_faile: "Edit salary faile",

                import_salary_success: "Import salary success",
                import_salary_faile: "Import salary faile",
                get_chart_salary_success: "Get chart salary success",
                get_chart_salary_faile: "Get chart salary faile",
                employee_invalid: 'The account has not registered employee information. Please check again.',
            },

            // Quản lý nghỉ phép
            annual_leave: {
                file_export_name: "Annual leave statistics table",
                type: "Annual leave by hours",
                totalHours: "Total hours",
                leaveOfAbsenceLetter: "Leave of absence letter",
                waiting_for_approval_letter: "Waiting for appoval letter",
                approved_letter: "Approved letter",
                not_approved_letter: "Disapproved letter",
                have: "Have",
                this_month: "this month",

                // Nhóm dành cho table
                table: {
                    start_date: "Start time",
                    end_date: "End time",
                    reason: "Reason",
                    action: "action",
                },

                // Nhóm dành cho trạng thái nghỉ phép
                status: {
                    approved: "Approved",
                    disapproved: "Disapproved",
                    waiting_for_approval: "Waiting for approval",
                },

                // Nhóm dành cho action
                edit_annual_leave: "Edit annual leave",
                delete_annual_leave: "Delete annual leave",
                add_annual_leave: "Add annual leave",
                add_annual_leave_title: "Add new annual leave",

                // Thông điệp trả về từ server
                employee_code_duplicated: "Staff code is duplicated",
                employee_name_required: "Staff name required",
                employee_number_required: "Staff code required",
                staff_non_unit: "Nhân viên không thuộc đơn vị",
                staff_code_not_special:
                    "Staff code does not contain special characters",
                staff_code_not_find: "Staff code does not exist",
                start_date_annual_leave_required:
                    "Start date annual leave required",
                end_date_annual_leave_required:
                    "End date annual leave required",
                reason_annual_leave_required: "Reason annual leave required",
                status_annual_leave_required: "Status annual leave required",
                get_annual_leave_success: "Get annual leave success",
                get_annual_leave_faile: "Get annual leave faile",
                create_annual_leave_success: "Create annual leave success",
                create_annual_leave_faile: "Create annual leave faile",
                delete_annual_leave_success: "Delete annual leave success",
                delete_annual_leave_faile: "Delete annual leave faile",
                edit_annual_leave_success: "Edit annual leave success",
                edit_annual_leave_faile: "Edit annual leave faile",
                aplication_annual_leave_success:
                    "Send application annual leave success",
                import_annual_leave_success: "Add data from file success",
                import_annual_leave_faile: "Add data from file faile",

                request_to_change_annualeave_success: "Yêu cầu chỉnh sửa đơn nghỉ phép thành công",
                request_to_change_annualeave_faile: "Yêu cầu chỉnh sửa đơn nghỉ phép thất bại",
            },

            // Quản lý khen thưởng kỷ luật
            commendation_discipline: {
                // Quản lý khen thưởng
                commendation: {
                    list_commendation: "List of staff commendation",
                    list_commendation_title: "List of staff commendation",
                    file_name_export: "Commendation statistics table",

                    // Nhóm dành cho table
                    table: {
                        decision_date: "Decision date",
                        decision_number: "Decision number",
                        decision_unit: "Decision unit",
                        reward_forms: "Commendation forms",
                        reason_praise: "Reason",
                        reward_forms_short: "Comm forms",
                    },

                    // Nhóm dành cho action
                    add_commendation: "Add commendation",
                    add_commendation_title: "Add new commendation",
                    edit_commendation: "Edit commendation",
                    delete_commendation: "Delete commendation",

                    // Thông điệp trả về từ server
                    employee_number_required: "Staff code required",
                    staff_code_not_special:
                        "Staff code does not contain special characters",
                    staff_code_not_find: "Staff code does not exist",
                    number_decisions_required: "Decision number required",
                    number_decisions_have_exist: "Decision number already exists",
                    unit_decisions_required: "Decision unit required",
                    type_commendations_required: "Commendation forms required",
                    reason_commendations_required: "Reason required",
                    decisions_date_required: "Decision date required",
                    get_commendations_success: "Get commendation success",
                    get_commendations_faile: "Get commendation faile",
                    create_commendations_success: "Create commendation success",
                    create_commendations_faile: "Create commendation faile",
                    delete_commendations_success: "Delete commendation success",
                    delete_commendations_faile: "Delete commendation faile",
                    edit_commendations_success: "Edit commendation success",
                    edit_commendations_faile: "Edit commendation faile",
                },

                // Quản lý ky luật
                discipline: {
                    list_discipline: "List of staff discipline",
                    list_discipline_title: "List of staff discipline",
                    file_name_export: "Discipline statistics table",
                    start_date_before_end_date:
                        "The effective date must be before the expiration date",
                    end_date_after_start_date:
                        "The expiration date must be after the effective date",

                    // Nhóm dành cho table
                    table: {
                        start_date: "Effective date",
                        end_date: "Expiration date",
                        discipline_forms: "Discipline forms",
                        reason_discipline: "Reason",
                        discipline_forms_short: "Discipline forms",
                    },

                    // Nhóm dành cho action
                    add_discipline: "Add discipline",
                    add_discipline_title: "Add new discipline",
                    edit_discipline: "Edit Discipline",
                    delete_discipline: "Delete discipline",

                    // Thông điệp trả về từ server
                    employee_number_required: "Staff code required",
                    staff_code_not_special:
                        "Staff code does not contain special characters",
                    staff_code_not_find: "Staff code does not exist",
                    number_decisions_required: "Decision number required",
                    number_decisions_have_exist: "Decision number already exists",
                    unit_decisions_required: "Decision unit required",
                    type_discipline_required: "Discipline forms required",
                    reason_discipline_required: "Reason required",
                    start_date_discipline_required: "Effective date required",
                    end_date_discipline_required: "Expiration date required",
                    get_discipline_success: "Get discipline success",
                    get_discipline_faile: "Get discipline faile",
                    create_discipline_success: "Create discipline success",
                    create_discipline_faile: "Create discipline faile",
                    delete_discipline_success: "Delete discipline success",
                    delete_discipline_faile: "Delete discipline faile",
                    edit_discipline_success: "Edit discipline success",
                    edit_discipline_faile: "Edit discipline faile",

                    update_major_success: "Edit major successfully",
                    update_major_failure: "Can not edit major",

                    delete_major_success: "Delete major successfully",
                    delete_major_failure: "Can not delete major"
                },
            },

            // Quản lý thông tin nhân viên
            profile: {
                // Nhóm dùng chung cho chưc năng quản lý tông tin nhân viên
                tab_name: {
                    menu_basic_infor: "Basic information",
                    menu_general_infor: "General information",
                    menu_contact_infor: "Contact information",
                    menu_education_experience: "Education - Experience",
                    menu_diploma_certificate: "Degrees - Certificate",
                    menu_account_tax: "Account - Tax",
                    menu_insurrance_infor: "Insurrance information",
                    menu_contract_training: "Contract - Training",
                    menu_reward_discipline: "Commendation - Discipline",
                    menu_salary_sabbatical: "Salary - Annual leave",
                    menu_attachments: "Attachments",

                    menu_general_infor_title: "General information",
                    menu_contact_infor_title: "Contact information",
                    menu_education_experience_title: "Education - Experience",
                    menu_diploma_certificate_title: "Degrees - Certificate",
                    menu_account_tax_title: "Account - Tax",
                    menu_insurrance_infor_title: "Insurrance information",
                    menu_contract_training_title: "Contract - Training",
                    menu_reward_discipline_title: "Commendation - Discipline",
                    menu_salary_sabbatical_title: "Salary - Annual leave",
                    menu_attachments_title: "Attachments",
                },

                house_hold: {
                    appendix: {
                        title: 'Phụ lục - Thành viên hộ gia đình người lao động',
                        head_house_hold_name: 'Họ và tên chủ hộ',
                        document_type: 'Loại giấy tờ',
                        house_hold_number: 'Số sổ hộ khẩu',
                        city: 'Tỉnh/Thành phố',
                        district: 'Quận/Huyện',
                        ward: 'Phường/Xã',
                        house_hold_address: 'Địa chỉ hộ khẩu',
                        phone: 'Số điện thoại',
                        phone_appendix: 'Điện thoại hộ gia đình',
                        house_hold_code: 'Mã số hộ gia đình'
                    },
                    members: {
                        title: 'Kê khai đầy đủ thông tin thành viên hộ gia đình trong sổ hộ khẩu',
                        stt: 'STT',
                        name: 'Họ và tên',
                        name_member: 'Họ và tên thành viên',
                        code_social_insurance: 'Mã sổ BHXH',
                        book_nci: 'Số sổ BHXH',
                        gender: 'Giới tính',
                        is_hh: 'Là chủ hộ',
                        ccns: 'Chỉ có năm sinh',
                        rwhh: 'Quan hệ với chủ hộ',
                        birth: 'Ngày sinh',
                        pob: 'Nơi cấp giấy khai sinh',
                        nationality: 'Quốc tịch',
                        nation: 'Dân tộc',
                        npp: 'Số CMND, Hộ chiếu',
                        note: 'Ghi chú',
                        male: "Nam",
                        female: 'Nữ',
                        yes: 'Có',
                        no: 'Không',
                    },
                    add: 'Thêm thành viên hộ gia đình',
                    edit: 'Chỉnh sửa thành viên hộ gia đình',
                    delete: 'Xóa thành viên hộ gia đình',
                },

                money: 'Wage',
                staff_number: "Staff code",
                full_name: "Full name",
                attendance_code: "Attendance code",
                gender: "Gender",
                male: "Male",
                female: "Female",
                date_birth: "Date of birth",
                place_birth: "Place of birth",
                email: "Email",
                email_company: "Email company",
                starting_date: "Starting Date",
                leaving_date: "Leave Date",
                relationship: "Relationship",
                single: "Single",
                married: "Married",
                upload: "Upload",
                id_card: "ID card/Passport",
                date_issued: "Date issued",
                issued_by: "Issued by",
                ethnic: "Ethnic group",
                nationality: "Nationality",
                religion: "Religion",
                active: "Official working",
                leave: "Quit job",
                career_fields: "Career/fields",
                maternity_leave: "Maternity leave",
                unpaid_leave: "Unpaid leave",
                probationary: "Probationary",
                sick_leave: "Sick leave",

                status_work: "Labor status",
                hours_off_remaining: "Total hours annual leave remaining",

                mobile_phone: "Mobile phone",
                mobile_phone_1: "Mobile phone 1",
                mobile_phone_2: "Mobile phone 2",
                personal_email_1: "Personal email 1",
                personal_email_2: "Personal email 2",
                home_phone: "Home phone",
                emergency_contact: "Emergency contact",
                nexus: "Nexus",
                address: "Address",
                permanent_address: "Permanent address",
                current_residence: "Current residence",
                wards: "Wards/Commune",
                district: "County/District",
                province: "Province/City",
                nation: "Nation",
                roles: "Role",
                academic_level: "Academic level",
                educational_level: "Educational level",
                language_level: "Language level",
                qualification: "Qualification",
                intermediate_degree: "Intermediate degree",
                colleges: "Colleges",
                university: "University",
                engineer: "Engineer",
                bachelor: "Bachelor",
                master_degree: "Maste degree",
                engineer: 'Engineer',
                bachelor: 'Bachelor',
                phd: "Ph.D",
                unavailable: "Other",
                work_experience: "Work experience",
                working_process: "Working process",
                job_description: 'Job description',
                reference_information: "Reference information",
                unit: "Unit",
                from_month_year: "From month/year",
                to_month_year: "To month/year",
                edit_experience: "Edit work experience",
                add_experience: "Add work experience",
                edit_working_process: "Edit working process",
                add_working_process: "Add working process",
                position_in_task: "position",
                customer: 'Customer',
                project: 'Project',

                diploma: "Degrees",
                certificate: "Certificate",
                name_diploma: "Name of degree",
                name_certificate: "Name of certificate",
                diploma_issued_by: "Issued by",
                graduation_year: "Graduation year",
                ranking_learning: "Ranking of learning",
                attached_files: "Attached files",
                end_date_certificate: "Expiration date",
                edit_certificate: "Edit certificate",
                edit_diploma: "Edit degree",
                add_certificate: "Add certificate",
                add_diploma: "Add degree",
                excellent: "Excellent",
                very_good: "Very good",
                good: "Good",
                average_good: "Average good",
                ordinary: "Ordinary",
                unknown: "Unknown",
                no_rating: "Not rating",

                bank_account: "Bank account",
                personal_income_tax: "Personal income tax",
                account_number: "Account number",
                bank_name: "Bank name",
                bank_branch: "Bank branch",
                tax_number: "Tax number",
                representative: "Representative",
                day_active: "Day active",
                managed_by: "Managed by",

                bhyt: "Health Insurance",
                number_BHYT: "Health insurance code",
                bhxh: "Social insurance",
                number_BHXH: "Social insurance code",
                bhxh_process: "Process of social insurance payment",
                edit_bhxh: "Edit social insurance",
                add_bhxh: "Add social insurance",

                labor_contract: "Labor contract",
                training_process: "Training process",
                number_contract: "Contract number",
                name_contract: "Contract name",
                type_contract: "Type of contract",
                start_date: "Effective date",
                course_name: "Course name",
                start_day: "Start day",
                end_date: "End day",
                contract_end_date: "Contract expiration date",
                type_education: "Type of education",
                cost: "Cost",
                edit_contract: "Edit labor contract",
                add_contract: "Add labor contract",

                list_attachments: "List of attached documents",
                attachments_code: "Attachments code",
                file_name: "File name",
                number: "Number",
                add_default: "Add default",
                add_default_title: "Add the default document",
                edit_file: "Edit attached documents",
                add_file: "Add attached documents",
                not_submitted_yet: "Not submitted",
                submitted: "Submitted",
                returned: "Returned",
                no_files: "No files yet",
                disc_diploma: "Highest degree",
                curriculum_vitae: "Curriculum vitae",
                disc_curriculum_vitae: "Notarized resume",
                img: "Image",
                disc_img: "Image 4x6 ",
                copy_id_card: "Copy of ID card / Passport",
                disc_copy_id_card:
                    "Certified copy of identity card or passport",
                health_certificate: "Health certificate",
                disc_health_certificate: "Notarized health certificate",
                birth_certificate: "Birth certificate",
                disc_birth_certificate: "Notarized birth certificate",
                job_application: "Job application",
                disc_job_application: "Handwritten application letter",
                commitment: "Commitment",
                disc_commitment: "Commitment to work",
                temporary_residence_card: "Temporary residence card",
                disc_temporary_residence_card:
                    "Certificate of temporary absence",
                registration_book: 'Registration book',
                add_staff: "Add new staffs",

                reward: "Commendation",
                discipline: "Discipline",
                historySalary: "History of salary",
                sabbatical: "Annual leave information",

                // Validator dữ liệu nhập bên client
                start_date_before_end_date:
                    "The issue date must be before the expiration date",
                end_date_after_start_date:
                    "The expiration date must be after the issue date",
                time_contract_duplicate:
                    "The labor contract period is being duplicated",
                time_experience_duplicate: "Work experience is duplicated",
                time_BHXH_duplicate:
                    "The process of paying social insurance is duplicated",
                start_month_before_end_month:
                    "From month/year must be before to month/year",
                end_month_after_start_month:
                    "To month/year must be after from month/year",
                start_date_insurance_required: "Effective date required",
                starting_date_before_leaving_date:
                    "The starting time of work must be before the time off work",
                leaving_date_after_starting_date:
                    "The time off work must be after the time of starting work",
                starting_date_required:
                    "The work start date has not been entered",

                // Quản lý thông tin cá nhân
                employee_info: {
                    export_bhxh: "The process of paying social insurance",
                    // Nhóm dành cho UI
                    note_page_personal:
                        "I hereby certify that all of the above statements are true and I am responsible for them.",
                    contact_other:
                        "(Other information please contact the relevant parties to be processed)",
                    update_infor_personal: "Update staff information",
                    no_data_personal: "You do not have personal information",
                    no_data_personal_to_update:
                        "You do not have personal information to update",

                    guaranteed_infor_to_update:
                        "You have not guaranteed information to update",
                    no_change_data: "No information changed",

                    // Thông điệp trả về từ server
                    get_infor_personal_success:
                        "Get information personal success",
                    get_infor_personal_faile: "Get information personal faile",
                    edit_infor_personal_success:
                        "Update information personal success",
                    edit_infor_personal_faile: "Update infor personal faile",
                },

                employee_management: {
                    // Nhóm dánh cho export excel
                    file_export_name: "Staffs imformation",
                    export: {
                        sheet1: "1.Staffs",
                        sheet2: "2.Staffs - Work process",
                        sheet3: "3.Staffs - Experiences",
                        sheet4: "4.Staffs - Degrees",
                        sheet5: "5.Staffs - Certificates",
                        sheet6: "6.Staffs - Labor contracts",
                        sheet7: "7.Staffs - Social insurances",
                        sheet8: "8.Staffs - Attachments",
                        sheet9: "9.Staffs - Family Members",
                        sheet10: "10.Staffs - Commendations",
                        sheet11: "11.Staffs - Disciplines",
                        sheet12: "12.Staffs - Salaries",
                        sheet13: "13.Staffs - Annual Leave",


                        emergency_contact_person: "Emergency contact person",
                        relation_with_emergency_contact_person:
                            "Relation with emergency contact person",
                        emergency_contact_person_address:
                            "Emergency contact person address",
                        emergency_contact_person_phone_number:
                            "Emergency contact_person phone number",
                        emergency_contact_person_home_phone:
                            "Emergency contact person home phone",
                        emergency_contact_person_email:
                            "Emergency contact person email",
                        atmNumber: "Bank account number",
                        bank_address: "Bank branch",
                        health_insurance_start_date:
                            "Health insurance effect date",
                        health_insurance_end_date:
                            " Health insurance expiration date",
                    },

                    import: {
                        import_general_infor: "Staff basic information",
                        import_experience: "Work experiences",
                        import_work_process: "Work process",
                        import_degree: "Degree",
                        import_certificate: "Certificate",
                        import_contract: "Labor contracts",
                        import_socialInsurance_details: "Social insurances",
                        import_file: "Attachments",
                        import_family: "Family member",

                        import_general_infor_title:
                            "Import staff basic information",
                        import_experience_title: "Import work experience",
                        import_work_process_title: "Import work process",
                        import_degree_title: "Import Degree",
                        import_certificate_title: "Import certificate",
                        import_contract_title: "Import labor contract",
                        import_socialInsurance_details_title:
                            "Import social insurance",
                        import_file_title: "Import attachments",
                        import_file_family: "Import family member"
                    },

                    // Nhón dành cho UI
                    have: "Have",
                    staff: "staff",
                    contract_expiration: "contract expiration",
                    and: "and",
                    have_birthday: "have birthdays ",
                    this_month: "this month",

                    file_name_export: "Employee imformation",
                    staff_no_unit_title:
                        "Because the employee is not in any unit",
                    no_gender: "Select gender",
                    all_gender: "Select all gender",
                    brithday_lable: "Month of Birth",
                    brithday_lable_title: "Month of Birth",
                    contract_lable: "Contract expiration",
                    contract_lable_title: "Contract expiration",
                    contract_type_title: "Type of contract",
                    employee_infor: "Employee information",

                    // Nhóm dành cho action
                    view_employee: "View employee",
                    edit_employee: "Edit employee",
                    delete_employee: "Delete staff",
                    add_employee: "Add staff",
                    add_employee_title: "Add new staff",
                    add_by_hand: "Add a staff",
                    add_import: "Add - Update data from file",
                    update_import: "Update data from file",

                    // Thông điệp trả về từ server
                    get_list_employee_success: "Get list employee success",
                    get_list_employee_faile: "Get list employee faile",
                    create_employee_success: "Create employee success",
                    create_employee_faile: "Create employee faile",
                    delete_employee_success: "Delete employee success",
                    delete_employee_faile: "Delete employee faile",
                    edit_employee_success: "Edit employee success",
                    edit_employee_faile: "Edit employee faile",
                    import_employee_success: "Import employee success",
                    importing_employee: "Processing data",
                    import_employee_faile: "Import employee faile",
                    employee_number_required: "Staff code required",
                    email_in_company_required: "Email in company required",
                    employee_number_have_exist: "Employee number already exists",
                    staff_code_not_find: 'Employee number does not exist',
                    email_in_company_have_exist: "Email in company already exists",
                    email_in_company_not_have_exist: "Email in company does not exist",
                    employee_timesheet_id_required: "Employee timesheet id required",
                    employee_timesheet_id_have_exist: "Employee timesheet already exists",
                    employee_timesheet_id_not_have_exist: "Employee timesheet does not exist",
                    full_name_required: "Full name required",
                    birthdate_required: "Birthdate required",
                    starting_date_required: "Starting date required",
                    identity_card_number_required:
                        "Identity card number required",
                    identity_card_date_required: "Identity card date required",
                    identity_card_address_required:
                        "Identity card address required",
                    phone_number_required: "Phone number required",
                    tax_date_of_issue_required: "Tax date of issue required",
                    tax_number_required: "Tax number required",
                    tax_representative_required: "Tax representative required",
                    tax_authority_required: "Tax authority required",
                },
            },

            // Quản lý kế hoạch làm việc (lịch nghỉ lễ tết)
            work_plan: {
                file_name_export: "Work plan",
                number_date_leave_of_year: "Maximum number of leave days",
                date_year: "date/year",
                year: "year",
                save_as: "Save",
                number_date: "Number date",
                list_holiday: "Time off holidays, Tet holidays",
                list_no_leave: "Time is not allowed to take leave",
                list_auto_leave: "Time is allowed to take leave",

                // Nhóm dành cho table
                table: {
                    type: "Type",
                    timeline: "Timelines",
                    start_date: "Start date",
                    end_date: "End date",
                    describe_timeline: "Description",
                },

                // Nhóm thể loại kế hoạch làm Việc
                time_for_holiday: "Time off holidays, Tet holidays",
                time_allow_to_leave: "Time is allowed to take leave",
                time_not_allow_to_leave: "Time is not allowed to take leave",

                // Nhóm dành cho action
                edit_work_plan: "Edit work schedule",
                delete_work_plan: "Delete work schedule",
                add_work_plan: "Add work schedule",
                add_work_plan_title: "Add new work schedule",
                add_by_hand: "Add one work schedule",
                add_import: "Add data from file",
                accept_application: "Accept leave application",
                refuse_application: "Refuse leave application",

                // Thông điệp trả về từ server
                type_required: "Type required",
                start_date_required: "Start date required",
                end_date_required: "End date required",
                reason_required: "Description required",
                work_plan_duplicate_required: "Time is overlapping",
                edit_number_date_leave_of_year_success:
                    "Change the number of days off in the year success",

                get_work_plan_success: "Get work schedule success",
                get_work_plan_faile: "Get work schedule faile",
                create_work_plan_success: "Create work schedule success",
                create_work_plan_faile: "Create work schedule faile",
                delete_work_plan_success: "Delete work schedule success",
                delete_work_plan_faile: "Delete work schedule faile",
                edit_work_plan_success: "Edit work schedule success",
                edit_work_plan_faile: "Edit work schedule faile",
                import_work_plan_success: "Import work schedule success",
                import_work_plan_faile: "Import work schedule faile",
            },

            dashboard_personal: {
                remind_work: "Remind work",
                number_annual_leave_in_year: "Number annual leave in year",
                day: "day",
                task: "task",
                accountable: "accountable",
                responsible: "responsible",
                consulted: "consulted",
                informed: "informed",
                task_total: "Total tasks",
                kpi_results: "KPI result",
                point: "point",
                overtime_total: "Total overtime",
                hours: "hours",
                total_time_annual_leave: "Total time annual leave",
                fullname: "Fullname",
                task_total: "Total tasks",
                general_task: "General tasks",
                see_all: "See all",
                general_commendation: "General commendation",
                reason_praise: "Reason praise",
                general_discipline: "General discription",
                reason_discipline: "Reason discipline",

                general_annual_leave: "General annual leave",
                total_hours: "Total hours",
                total_hours_works: "Total hours work",
                general_overtime: "General overtime",
                not_org_unit: "Not have organizational unit",

                trend_of_work: "Trend of work",
            },

            // Quản lý ngành nghề lĩnh vực
            field: {
                // Nhóm dành cho table
                table: {
                    name: "Name career/fields",
                    description: "Description",
                },

                // Nhóm dành cho action
                edit_fields: "Edit career/fields",
                delete_fields: "Delete career/fields",
                add_fields: "Add new",
                add_fields_title: "Add career/fields",

                // Thông điệp trả về từ server
                get_fields_success: "Get career/fields success",
                get_fields_fail: "Get career/fields fail",
                create_fields_success: "Add career/fields success",
                create_fields_fail: "Add career/fields fail",
                delete_fields_success: "Delete career/fields success",
                delete_fields_fail: "Delete career/fields fail",
                edit_fields_success: "Edit career/fields success",
                edit_fields_fail: "Edit career/fields fail",
            },

            // Quản lý chấm công nhân viên
            timesheets: {
                file_name_export: "Timesheets",
                symbol: " Symbol",
                not_work: "Not work",
                do_work: "Do work",
                total_timesheets: "Total hours",
                total_hours_off: "Total hours off",
                total_over_time: "Total hours overtime",
                work_date_in_month: "Work date in month",
                shift_work: "Shift work",
                shifts1: "Shifts 1",
                shifts2: "Shifts 2",
                shifts3: "Overtime",
                date_of_month: "The days of the month",

                // Nhóm dành cho action
                edit_timesheets: "Edit timesheets",
                delete_timesheets: "Delete timesheets",
                add_timesheets: "Add timesheets",
                add_timesheets_title: "Add new timesheets",
                add_by_hand: "Add one timesheets",
                add_import: "Add data from file",

                // Thông điệp trả về từ server
                employee_code_duplicated: "Staff code is duplicated",
                employee_name_required: "Staff name required",
                employee_number_required: "Staff code required",
                month_timesheets_required: "Month timesheets required",
                staff_code_not_find: "Staff code does not exist",
                month_timesheets_have_exist: "Month timesheets already exists",
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

            // Quản lý nhân sự các đơn vị
            manage_department: {
                edit_unit: "Edit units staff",
                manager_unit: "Head of unit",
                deputy_manager_unit: "Deputy unit",
                employee_unit: "Unit staff",
                email_employee: "Email",
                add_employee_unit: "Add staff",
            },

            // Nghỉ phép
            annual_leave_personal: {
                list_annual_leave: "Regulations on corporate leave",
                inform_annual_leave: "Information on personal leave",
                day: "days",
                total_number_leave_of_year: "Total number of days off",
                leaved: "You have rested",
                receiver: "Receiver",

                // Nhóm action
                create_annual_leave: "Apply leave",
            },
        },

        // Modules quản lý đào tạo
        training: {
            course: {
                // Nhóm dành cho UI
                study_at: "Study at",
                from: "from",
                to: "to",
                with_lecturer: "with lecturer",
                offered_by: "Training by",
                belong_type: "Type of training",
                with_cost: "with a cost of",
                commitment_time: "and commitment time",
                month: "months",
                year: "year",
                staff: "staff",
                attend: "involved",

                no_course_type: "Select training type",
                all_course_type: "Select all training type",
                start_date: "Start time",
                end_date: "End time",
                start_date_before_end_date:
                    "The start time must be before the end time",
                end_date_after_start_date:
                    "The end time must be after the start time",
                employee_attend: "Staff involved",
                select_education_program: "Select training program",

                table: {
                    course_code: "Course code",
                    course_name: "Course name",
                    start_date: "Starting time",
                    end_date: "End time",
                    course_place: "Course place",
                    offered_by: "Offered by",
                    course_type: "Training type",
                    lecturer: "Lecturers",
                    education_program: "Under the training program",
                    cost: "Training costs",
                    employee_commitment_time: "Commitment time (unit: Month)",
                    result: "Result",
                },

                // Loại đào tao
                type: {
                    internal: "Internal",
                    external: "External",
                },

                // Kết quả đào tạo
                result: {
                    pass: "Pass",
                    failed: "Failed",
                },

                // Nhóm action
                add_course: "Add training course",
                edit_course: "edit training course",
                delete_course: "delete training course",
                view_course: "Training course information",
                register: "register",

                // Thông điệp trả về từ server
                name_required: "Name of the training course required",
                course_id_required: "Course id required",
                offered_by_required: "Offered by required",
                course_place_required: "Course place required",
                start_date_required: "Start date required",
                end_date_required: "End date required",
                type_required: "Type of training required",
                education_program_required:
                    "Under the training program required",
                employee_commitment_time_required: "Time commitment required",
                cost_required: "Cost required",
                course_id_have_exist: "Course id already exists",

                get_list_course_success: "Get list course success",
                get_list_course_success: "Get list course success",
                create_course_success: "Create course success",
                create_course_faile: "Create course faile",
                delete_course_success: "Delete course success",
                delete_course_faile: "Delete course faile",
                edit_course_success: "Edit course success",
                edit_course_faile: "Edit course faile",
            },

            // Quản lý chương trình đào tạo
            education_program: {
                education_program_code: "Training program code",
                education_program_name: "Training program name",

                table: {
                    program_code: "Program code",
                    program_name: "Program name",
                    apply_for_organizational_units: "Apply for units",
                    apply_for_positions: "Apply for positions",
                    total_courses: "Total course",
                },

                // Nhóm dành cho action
                add_education_program: "Add training program",
                edit_education_program: "Edit training program",
                delete_education_program: "Delete training program",
                view_education_program: "Training program information",

                // Thông điệp trả về từ server
                apply_for_organizational_units_required:
                    "Apply for units required",
                apply_for_positions_required: "Apply for positions required",
                program_id_required: "Program id required",
                name_required: "Program name required",
                program_id_have_exist: "Program id already exists",

                get_education_program_success: "Get education program success",
                get_education_program_faile: "Get education program faile",
                create_education_program_success:
                    "Create education program success",
                create_education_program_faile:
                    "Create education program faile",
                delete_education_program_success:
                    "Delete education program success",
                delete_education_program_faile:
                    "Delete education program faile",
                edit_education_program_success:
                    "Edit education program success",
                edit_education_program_faile: "Edit education program faile",
            },
        },

        // Modules Quản lý tài sản
        asset: {
            general_information: {
                asset: "Asset",
                choose_asset: "Choose asset",
                asset_list: "Assets list",
                search: "Search",
                add: "Add",
                basic_information: "Basic infomation",
                detail_information: "Detail information",
                asset_properties: "Properties of asset",
                asset_default_properties: "Default properties of asset",
                view: "View asset information",
                edit_info: "Edit asset information",
                delete_info: "Delete asset information",
                save: "Save",
                edit: "Edit",
                delete: "Delete",
                cancel: "Cancel",

                select_asset_type: "Select asset type",
                select_all_asset_type: "Select all asset type",
                select_all_status: "Select all status",
                select_all_group: "Select all asset group",
                ready_use: "Ready to use",
                using: "Using",
                damaged: "Damaged",
                lost: "Lost",
                disposal: "Disposal",
                waiting: "Waiting for progressing",
                processed: "Processed",
                select_register: "Select the right to register",
                select_all_register: "Select all the right to register",
                can_register: "Can register to use",
                cant_register: "Can't register to use",

                asset_code: "Asset code",
                asset_name: "Asset name",
                asset_type: "Asset type",
                asset_group: "Asset group",
                purchase_date: "Date of purchase",
                purchase_date_start: "Date of purchase from",
                purchase_date_end: "Date of purchare to",
                manager: "Manager",
                user: "User",
                organization_unit: "Organizaitonal Unit",
                select_organization_unit: "Select organization unit",
                select_all_organization_unit: "Select all",
                handover_from_date: "Handover from date",
                handover_to_date: "Handover to date",
                status: "Status",
                choose_status: "Choose status",
                action: "Action",
                asset_value: "Asset value",
                disposal_date: "Disposal date",
                not_disposal: "Not disposal yet",

                general_information: "General information",
                usage_information: "Usage information",
                maintainance_information: "Maintenance information",
                depreciation_information: "Depreciation information",
                incident_information: "Incident information",
                disposal_information: "Disposal information",
                attach_infomation: "Attached files",

                serial_number: "Serial number",
                warranty_expiration_date: "Warranty expiration date",
                asset_location: "Asset location",
                description: "Description",
                can_register: "Can register",
                can_register_for_use: "Can register to use",
                select_image: "Select image",
                content: "Content",
                form_code: "Form code",
                create_date: "Create date",
                create_month: "Create month",
                type: "Classify",
                choose_type: "Choose classify",
                start_date: "Start date of repair",
                end_date: "End date of repair",
                expense: "Cost",
                original_price: "Original price ",
                residual_price: "Estimated recovery price",
                start_depreciation: "Start date of depreciation",
                end_depreciation: "End date of depreciation",
                depreciation_type: "Depreciation type",

                incident_code: "Incident code",
                reported_by: "Announcer",
                incident_type: "Incident type",
                date_incident: "Date of incident",
                select_incident_type: "Select incident type",
                select_all_incident_type: "Select all incident types",

                disposal_date: "Disposal date",
                disposal_type: "Disposal type",
                disposal_price: "Disposal price",
                disposal_content: "Disposal content",

                store_location: "Hard copy storage location",
                file_name: "File name",
                number: "Amount",
                attached_file: "Attached files",

                select_role_to_use: "Select type to use",
                select_all_roles_to_use: "Select all types",
                not_for_registering: "Not for registering",
                register_by_hour: "Register by hour",
                register_for_long_term: "Register for long term",

                create_reception_date: "Reception date",
                select_reception_type: "Select reception type",
                select_all_reception_type: "Select all reception types",

                no_data: "No data",
            },

            // Dashboard
            dashboard: {
                status_chart: "Asset statistics chart by status",
                group_chart: "Asset statistics chart by group",
                cost_chart: "Asset statistics chart by cost",
                amount_of_asset: "Asset statistics chart by amount",
                value_of_asset: "Asset statistics chart by value",
                depreciation_of_asset: "Asset statistics chart by depreciation",
                bar_chart: "Bar chart",
                tree: "Tree",
                amount: "Amount",
                time: "Times",
                value: "Value",
                maintainance_cost: "Maintainance Cost",
                lost_value: "Lost value (Million)",
                sum_value: "Total value (Million)",
                building: "Building",
                machine: "Machine",
                other: "Other",
                asset_by_group: " Asset by group",
                asset_by_type: " Asset by type",
                asset_purchase_and_dispose: " Purchase and dispose",
                purchase_asset: "Statistics purchase asset chart",
                disposal_asset: "Statistics disposal asset chart",
                asset_incident_and_maintenance: "Incident and maintenance",
                incident_asset: "Statistics incident asset chart",
                maintenance_asset: "Statistics maintenance asset chart",
                statistic_by: "Statistic by",
                expired: "Exprired",
                remaining_time: "Remaining time",
                day: "days",
            },

            //  Quản lý loại tài sản
            asset_type: {
                asset_type_code: "Asset type code",
                asset_type_name: "Asset type name",
                parent_asset_type: "Parent asset type",

                //Thông điệp trả về từ server
                get_asset_type_success: "Get asset type successfully",
                get_asset_type_faile: "Get asset type fail",
                create_asset_type_success: "Create asset type successfully",
                create_asset_type_failure: "Create asset type fail",
                delete_asset_type_success: "Delete asset type successfully",
                delete_asset_type_failure: "Delete asset type fail",
                edit_asset_type_success: "Edit asset type successfully",
                edit_asset_type_faile: "Edit asset type fail",
                asset_type_name_exist: "Asset type name already exists",
                asset_type_number_exist: "Asset type number already exists",
                import_asset_type_success: "Import asset type successfully from file",
                import_asset_type_failure: "Failed to import asset type from file",
            },

            // Quản lý thông tin tài sản
            asset_info: {
                asset_info: "Asset infomation",
                field_name: "Name of properties",
                value: "Value",

                usage_logs: "Usage log",
                maintainance_logs: "Maintainance logs",
                incident_list: "Asset incident list",
                file_list: "List of documents attached",
                edit_document: "Edit documents attached",
                add_usage_info: "Add new asset usage infomation",
                edit_usage_info: "Edit asset use request form",
                delete_usage_info: "Delete asset usage infomation",
                add_maintenance_card: "Add new maintenance card",
                edit_maintenance_card: "Edit new maintenance card",
                delete_maintenance_card: "Delete maintenance card",
                add_incident_info: "Add new incident infomation",
                edit_incident_info: "Edit incident infomation",
                delete_incident_info: "Delete incident infomation",
                delete_asset_confirm: "Are you sure to delete this asset ?",

                usage_time: "Usage time",
                annual_depreciation: "Annual average rate of depreciation",
                monthly_depreciation: "Monthly average rate of depreciation",
                repair: "Repair",
                replace: "Replace",
                upgrade: "Upgrade",
                made: "Made",
                processing: "Processing",
                unfulfilled: "Unfulfilled",
                destruction: "Destruction",
                sale: "Sale",
                give: "Give",

                select_group: "Select asset group",
                building: "Building",
                vehicle: "Vehicle",
                machine: "Machine",
                other: "Other",

                //Thông điệp trả về từ server
                get_asset_group_success: "Get asset group successfully",
                get_asset_group_fail: "Get asset group fail",
                get_asset_statistic_success: "Get asset statistic successfully",
                get_asset_statistic_fail: "Get asset statistic fail",
                get_list_asset_success: "Get list asset successfully",
                get_asset_purchase_success: "Get asset purchase successfully",
                get_asset_purchase_fail: "Get asset purchase fail",
                get_asset_disposal_success: "Get asset disposal successfully",
                get_asset_disposal_fail: "Get asset disposal fail",
                get_asset_incident_success: "Get asset incident successfully",
                get_asset_incident_fail: "Get asset incident fail",
                get_asset_maintenance_success: "Get asset maintenance successfully",
                get_asset_maintenance_fail: "Get asset maintenance fail",
                get_list_asset_faile: "Get list asset faile",
                create_asset_success: "Create asset successfully",
                create_asset_faile: "Create asset faile",
                delete_asset_success: "Delete asset successfully",
                delete_asset_faile: "Delete asset faile",
                edit_asset_success: "Edit asset successfully",
                edit_asset_faile: "Edit asset faile",
                asset_code_exist: "Asset code already exists",
            },

            // Quản lý bảo trì
            maintainance: {
                total_cost: "Total cost",

                //Thông điệp trả về từ server
                get_maintainance_success: "Get maintainance successfully",
                get_maintainance_faile: "Get maintainance faile",
                create_maintainance_success: "Thêm phiếu bảo trì successfully",
                create_maintainance_faile: "Thêm phiếu bảo trì faile",
                delete_maintainance_success: "Xoá phiếu bảo trì successfully",
                delete_maintainance_faile: "Xoá phiếu bảo trì faile",
                edit_maintainance_success: "Edit maintainance successfully",
                edit_maintainance_faile: "Edit maintainance faile",
            },

            // Quản lý sử dụng
            usage: {
                approved: "Approved",
                waiting_approval: "Waiting for approval",
                not_approved: "Not approved",
                proponent: "Proponent",
                accountable: "Accountable",
                note: "Note",

                //Thông điệp trả về từ server
                get_usage_success: "Get usage successfully",
                get_usage_faile: "Get usage failed",
                create_usage_success: "Create usage successfully",
                create_usage_faile: "Create usage failed",
                delete_usage_success: "Delete usage successfully",
                delete_usage_faile: "Delete usage failed",
                edit_usage_success: "Edit usage successfully",
                edit_usage_faile: "Edit usage failed",
            },

            // Quản lý khấu hao
            depreciation: {
                depreciation_time: "Depreciation time",
                accumulated_value: "Accumulated depreciation value",
                remaining_value: "Remaining value",
                edit_depreciation: "Edit asset depreciation information",

                estimated_production: "Estimated total production (for 1 year)",
                months_production: "Product production in months",
                production: "Production",
                select_depreciation_type: "Select depreciation type",
                select_all_depreciation_type: "Select all",
                line: "Straight - line depreciation method",
                declining_balance: "Declining Balance depreciation method",
                units_production: "Unit of production method",

                //Thông điệp trả về từ server
                get_depreciation_success: "Get depreciation successfully",
                get_depreciation_failure: "Get depreciation faile",
                create_depreciation_success: "Create depreciation successfully",
                create_depreciation_failure: "Create depreciation faile",
                delete_depreciation_success: "Delete depreciation successfully",
                delete_depreciation_failure: "Delete depreciation faile",
                edit_depreciation_success: "Edit depreciation successfully",
                edit_depreciation_faile: "Edit depreciation faile",
            },

            // Quản lý sự cố
            incident: {
                incident: "Asset incident",
                report_incident: "Report asset incident",

                //Thông điệp trả về từ server
                get_incident_success: "Get incident successfully",
                get_incident_faile: "Get incident faile",
                create_incident_success: "Create incident successfully",
                create_incident_faile: "Create incident faile",
                delete_incident_success: "Delete incident successfully",
                delete_incident_faile: "Delete incident faile",
                edit_incident_success: "Edit incident successfully",
                edit_incident_faile: "Edit incident faile",
            },

            // Quản lý đề nghị mua sắm thiết bị
            manage_recommend_procure: {
                asset_recommend: "Asset recommend procure",
                equipment_description: "Equipment description",
                add_recommend_card: "Add new form recommend procure asset",
                view_recommend_card: "View form recommend procure asset",
                edit_recommend_card: "Edit form recommend procure asset",
                delete_recommend_card: "Delete form recommend procure asset",
                supplier: "Supplier",
                unit: "Unit",
                expected_value: "Expected value",
            },

            // Quản lý đề nghị cấp phát
            manage_use_request: {
                //Thông điệp trả về từ server
                get_use_request_success: "Get use request successfully",
                get_use_request_failure: "Get use request faile",
                create_use_request_success: "Edit use request successfully",
                create_use_request_failure: "Edit use request faile",
                delete_use_request_success: "Delete use request successfully",
                delete_use_request_failure: "Delete use request faile",
                edit_use_request_success: "Edit use request successfully",
                edit_use_request_failure: "Edit use request faile",
            },

            // Đăng ký mua sắm thiết bị
            purchase_request: {
                //Thông điệp trả về từ server
                get_purchase_request_success:
                    "Get purchase request successfully",
                get_purchase_request_failure: "Get purchase request faile",
                create_purchase_request_success:
                    "Create purchase request successfully",
                create_purchase_request_failure: "Create purchase request faile",
                delete_purchase_request_success:
                    "Delete purchase request successfully",
                delete_purchase_request_failure: "Delete purchase request faile",
                edit_purchase_request_success:
                    "Edit purchase request successfully",
                edit_purchase_request_failure: "Edit purchase request faile",
                recommend_number_exist: "Recommend number already exists",
            },

            // Đăng ký sử dụng thiết bị
            use_request: {
                //Thông điệp trả về từ server
                get_use_request_success: "Get use request successfully",
                get_use_request_failure: "Get use request failed",
                create_use_request_success: "Create use request successfully",
                create_use_request_failure: "Create use request failed",
                delete_use_request_success: "Delete use request successfully",
                delete_use_request_failure: "Delete use request failed",
                edit_use_request_success: "Edit use request successfully",
                edit_use_request_failure: "Edit use request failed",
            },
        },

        // Task template
        task_template: {
            search: "Search",
            search_by_name: "Search by name",
            select_all_units: "Select all units",
            permission_view: "Permission to view",
            performer: "Performer",
            approver: "Approver",
            observer: "Observer",
            consultant: "Supporter",
            formula: "Formula",
            activity_list: "Activity list",
            information_list: "Information list",
            no_data: "No data",
            edit: "Edit",
            save: "Save",
            close: "Close",
            add: "Add new",
            import: "Add data from file",
            confirm: "Confirm",
            confirm_title:
                "Are you sure you want to delete this task template?",
            error_title:
                "This work template cannot be deleted because itedirt is already in use.",
            name: "Template name",
            unit: "Unit",
            tasktemplate_name: "Task template name",
            description: "Description",
            count: "Number of uses",
            creator: "Creator",
            action: "Action",
            general_information: "General information",
            parameters: "Parameters",
            roles: "Roles",
            edit_tasktemplate: "Edit tasktemplate",
            action_name: "Action name",
            mandatory: "mandatory",
            delete: "Delete",
            cancel_editing: "Cancel editing",
            add_tasktemplate: "Add tasktemplate",
            infor_name: "Information name",
            datatypes: "Datatypes",
            manager_fill: "Only manager fill",
            text: "Text",
            number: "Number",
            date: "Date",
            value_set: "Value set",
            code: "Code",
            view_detail_of_this_task_template: "View detail of this task",
            edit_this_task_template: "Edit this task template",
            delete_this_task_template: "Delete this task template",
            create_task_by_process: "Create tasks by process",
            numberOfDaysTaken: "The number of days taken",
        },

        task: {
            task_management: {
                get_subtask_success: "Get sub task success",
                get_task_of_informed_employee_success:
                    "Get task of informed employee success",
                get_task_of_creator_success: "Get task of creator success",
                get_task_of_consulted_employee_success:
                    "Get task of consulted employee success",
                get_task_of_accountable_employee_success:
                    "Get task of accountable employee success",
                get_task_of_responsible_employee_success:
                    "Get task of responsible employee success",
                get_tasks_by_role_success: "Get task by role success",
                get_task_by_id_success: "Get task by id success",
                get_task_evaluation_success: "Get task evaluation success",
                get_all_task_success: "Get all task success",
                create_task_success: "Create new task succesfully",
                delete_success: "Delete task successfully",
                edit_status_of_task_success: "Edit status of task successfully",
                edit_status_archived_of_task: "Change archived status",
                edit_status_archived_of_task_success:
                    "Edit archived status of task successfully",
                get_task_dashboard_data_success: "Get task dashboard data success",

                get_subtask_fail: "Get sub task fail",
                get_task_of_informed_employee_fail:
                    "Get task of informed employee fail",
                get_task_of_creator_success: "Get task of creator fail",
                get_task_of_consulted_employee_fail:
                    "Get task of consulted employee fail",
                get_task_of_accountable_employee_fail:
                    "Get task of accountable employee fail",
                get_task_of_responsible_employee_fail:
                    "Get task of responsible employee fail",
                get_tasks_by_role_fail: "Get task by role fail",
                get_task_by_id_fail: "Get task by id fail",
                get_task_evaluation_fail: "Get task evaluation fail",
                get_all_task_fail: "Get all task fail",
                create_task_fail: "Can't create new task",
                delete_fail: "Can't delete task successfully",
                edit_status_of_task_fail: "Can't edit status of task",
                edit_status_archived_of_task_fail:
                    "Can't edit archived status of task",
                get_task_dashboard_data_fail: "Get task dashboard data fail",
                task_status_error: "Status of task doesn't allow archive",
                confirm_delete:
                    "This task cannot be deleted because it is in progress!",

                responsible: "Responsible",
                accountable: "Acountable",
                consulted: "Consulted",
                creator: "Creator",
                informed: "Informed",
                all_role: "All of roles",

                responsible_role: "Responsible",
                accountable_role: "Acountable",
                consulted_role: "Consulted",
                informed_role: "Informed",
                distribution_Of_Employee: "Distribution of Employees",
                employees_each_chart: "Max employee in a chart",
                task_is_not_linked_up_with_monthly_kpi:
                    "Tasks are not linked up with monthly KPI",
                no_task_is_not_linked:
                    "There is no task is not linked up with monthly KPI",
                loading_data: "Loading data",
                task_has_action_not_evaluated:
                    "Tasks have action not evaluated",
                no_task_has_action_not_evaluated:
                    "There is no task has action not evaluated",
                performer: "Performer",
                approver: "Approver",

                add_task: "Add task",
                add_title: "Add a new task",
                add_subtask: "Add sub task",

                department: "Department",
                select_department: "Select department",
                select_all_department: "Selected all",
                role: "Role",

                role_unit: "Role of unit",
                select_role_organizational: "Select unit role",
                organizational_unit_management: "Management unit",
                organizational_unit_collaborate: "Collaborative unit",

                status: "Status",
                select_status: "Select status",
                select_all_status: "Selected all",
                inprocess: "In process",
                wait_for_approval: "Wait for approval",
                finished: "Finished",
                delayed: "Delayed",
                canceled: "Canceled",
                requested_to_close: "Requested to close",
                task_status: "Task status",
                filter: "Filter",

                priority: "Priority",
                select_priority: "Select priority",
                select_all_priority: "Selected all",
                urgent: "Urgent",
                high: "High",
                standard: "Standard",
                average: "Normal",
                low: "Low",
                coefficient: "Coefficient",

                special: "Special",
                creator_time: "Creator time",
                select_all_special: "Selected all",
                select_special: "Select special",
                select_all_role: "Selected all",
                select_role: "Select role",
                stored: "Stored",
                current_month: "Current month",
                current_week: "Current week",

                assigned_collaborate: "Task assignment status",
                not_assigned: "Unassigned task",
                assigned: "Assigned task",
                none_select_assigned: "None select",
                role_in_collaborated_unit: "The role of the employee in",
                confirm_assigned: "Confirm the assignment",
                confirm_assigned_success: "You have confirmed the assignment",
                confirm_assigned_failure:
                    "You have not confirmed the assignment",
                unit_not_confirm_assigned_task:
                    "Organizational unit has not confirmed the assignment",

                name: "Name of task",
                search_by_name: "Search by name",
                search_by_employees: "Enter name or email",

                start_date: "Start date",
                end_date: "End date",
                task_additional_info: "Additional Information",

                search: "Search",

                from: "From",
                to: "To",
                lower_from: "from",
                lower_to: "to",
                month: "Month",
                prev: "Prev",
                next: "Next",
                tasks_calendar: "Tasks calendar",
                model_detail_task_title: "Detail task",
                collaborative_tasks: "Multiple employees",
                in_time: "In time ",
                delayed_time: "Delayed ",
                not_achieved: "Overdue ",

                col_name: "Name of task",
                col_organization: "Department",
                col_priority: "Priority",
                col_start_date: "Start date",
                col_end_date: "End date",
                col_status: "Status",
                col_progress: "Progress",
                col_logged_time: "Total logged time",
                col_timesheet_log: "Total timesheet",

                action_edit: "Start working",
                action_delete: "Delete task",
                action_store: "Store task",
                action_restore: "Restore task",
                action_add: "Add new subtask",
                action_start_timer: "Start timer",

                err_organizational_unit: "Organizational Unit deleted",
                err_name_task: "Name deleted",
                err_priority: "Priority deleted",
                err_status: "Status deleted",
                err_start_date: "Start date deleted",
                err_end_date: "End date deleted",
                err_progress: "Progress deleted",
                err_total_log_time: "Total logged time deleted",

                detail_refresh: "Refresh",
                detail_edit: "Update task",
                detail_end: "Finish",
                detail_evaluate: "Evaluate",
                detail_start_timer: "Start timer",
                detail_hide_info: "Hide information",
                detail_show_info: "Show information",
                detail_choose_role: "Change role",
                detail_copy_task: "Copy task",
                detail_save_as_template: "Save as template",
                detail_route: "Navigate",
                detail_route_task: "Navigate tasks",

                detail_link: "Task link",
                detail_priority: "Priority",
                detail_status: "Status",
                detail_status_task: "Task status",
                average_task_result: "Average task results",
                detail_time: "Working duration",
                detail_average_results: "Average results of task",

                detail_general_info: "General infomation",
                detail_description: "Description",
                detail_info: "Task infomation",
                detail_progress: "Progress task",
                detail_value: "Value",
                detail_not_hasinfo: "Not has infomation",
                detail_eval: "Evaluation",
                detail_point: "Member Point",
                detail_auto_point: "Automatic point",
                detail_emp_point: "Employee point",
                detail_acc_point: "Approve point",
                detail_not_auto: "Unset automatic point",
                detail_not_emp: "Unset employee point",
                detail_not_acc: "Unset accountable point",
                detail_not_coefficient: "Not by coeficient",
                detail_coefficient: "By coeficient",

                detail_not_eval_on_month: "Not evaluate this month",
                detail_not_eval: "Nobody evaluate this month",
                detail_kpi: "Linked KPI",
                detail_not_kpi: "Task has not linked to KPI",
                detail_all_not_kpi: "Nobody linked KPI",
                detailt_none_eval: "Task has not evaluated any time",

                detail_resp_edit: "Edit task by responsible employee",
                detail_acc_edit: "Edit task by accountable employee",
                detail_resp_eval: "Evaluate task by responsible employee",
                detail_acc_eval: "Evaluate task by accountable employee",
                detail_cons_eval: "Evaluate task by consulted employee",
                detail_resp_stop: "Finish task by responsible employee",
                detail_acc_stop: "Finish task by accountable employee",
                detail_cons_stop: "Finish task by consulted employee",
                detail_task_permission:
                    "Task is invalid or you do not have permission",

                evaluate_date: "Evaluate date",
                evaluate_member: "Evaluate members of task",
                detail_not_calc_auto_point: "Not calculate",
                detail_auto_on_system: "Automatic point on system",
                detail_not_auto_on_system: "Not has automatic point on system",
                action_not_rating: "List of action has not been rate",
                no_action: "Empty",
                contribution: "Contribution",
                not_eval: "Not evaluate",
                acc_evaluate: "Accountable evaluation",
                name_employee: "Name",
                role_employee: "Role",
                detail_emp_point_of: "Employee point of",

                enter_emp_point: "Enter employee point",
                responsible_not_eval: "Responsible employee has not evaluated",
                not_eval_on_month:
                    "Not has evaluation information of this month",

                edit_basic_info: "Basic information",
                edit_detail_info: "Detail information",
                edit_member_info: "Member information",
                edit_inactive_emp: "Inactive employees",
                edit_enter_progress: "Enter progress",
                edit_enter_value: "Enter value",

                add_template: "Task template",
                add_template_notice: "Selected task template",
                add_parent_task: "Parent of task",
                add_parent_task_notice: "Select parent of task",
                add_raci: "Assignment of responsibility",
                add_resp: "Select responsible employee",
                add_acc: "Select accountable employee",
                add_cons: "Select consulted employee",
                add_inform: "Select informed employee",

                calc_form: "Automatic point informtion",
                calc_formula: "Formula",
                calc_overdue_date: "Overdue date of task",
                calc_day_used: "Time from start date to today",
                calc_average_action_rating: "Average action of task rating",
                calc_failed_action_rating: "Sum of failed activities (rating < 5)",
                calc_passed_action_rating: "Sum of passed activities (rating >= 5)",
                calc_all_action_rating: "Sum of activity scores and performance importance of all activities",
                calc_progress: "Progress of task",
                calc_new_formula: "Current formula",
                calc_total_day: "Time from start date to end date",
                calc_days: "days",
                calc_where: "Where",
                calc_no_value: "No value",
                calc_nan: "NAN",
                explain: " (Negative values ​​will be considered as 0)",
                eval_list: "List of evaluations",
                title_eval: "Evaluate task",

                btn_save_eval: "Save evaluation",
                btn_get_info: "Get infomation task",
                note_not_eval:
                    "You can no longer edit reviews because it is more than 7 days after the last review.",
                note_eval: "Number of days left to edit review",

                add_eval_of_this_month: "Add evaluation",
                eval_of: "Evaluation of",
                eval_from: "Evaluation from",
                eval_to: "Evaluation to",
                store_info: "Save the input data into task infomation",
                bool_yes: "Yes",
                bool_no: "No",

                detail_evaluation: "Evaluation infomation",
                err_eval_start:
                    "Evaluate date should be greater than equal start date",
                err_eval_end:
                    "Evaluate date should be less than equal end date",
                err_eval_on_month: "Evaluate date should be day of month",
                explain_avg_rating:
                    "Since no activity has been evaluated, the activity rating default is 10",
                explain_not_has_failed_and_passed_action:
                    " - (Since no actions or no failed or passed activity, so the number of passed action will be considered equal to 1)",
                // " - (Since no failed or passed activity, so the number of passed action and failed action will be considered equal and equal to 1)",

                info_eval_month: "Task infomation in evaluation",

                auto_point_field: "Automatic point of task in this month",
                get_outside_info:
                    "Auto fill evaluation infomation from task infomation",

                dashboard_created: "Number of tasks you created",
                dashboard_need_perform: "Number of tasks you perform",
                dashboard_need_approve: "Number of tasks you approve",
                dashboard_need_consult: "Number of tasks you consult",
                dashboard_area_result: "Result area dashboard",
                dashboard_overdue: "Overdue task",
                dashboard_about_to_overdue: "Task is about to overdue",
                dashboard_max: "Max",
                dashboard_min: "Min",

                err_require: "Field is required",
                err_date_required: "Date is required",
                err_nan: "The value must be number",

                // mes_notice
                edit_task_success: "Edit task success",
                evaluate_task_success: "Evaluate task success",
                edit_task_fail: "Edit task fail",
                evaluate_task_fail: "Evaluate task fail",
                edit_hours_spent_in_evaluate_success:
                    "Calculate hours spent on task success",
                edit_hours_spent_in_evaluate_fail:
                    "Calculate hours spent on task fail",
                edit_employee_collaborated_success:
                    "Edit employees to join task successfully",
                edit_employee_collaborated_failure:
                    "Can not edit employees to join task",

                add_new_task: "Add new task",
                // add_err:
                add_err_empty_unit: "Unit should not be empty",
                add_err_empty_name: "Name should not be empty",
                add_err_empty_description: "Description should not be empty",
                add_err_empty_start_date: "Start date should not be empty",
                add_err_empty_end_date: "End date should not be empty",
                add_err_empty_responsible: "Responsible should not be empty",
                add_err_empty_accountable: "Accountable should not be empty",
                add_err_special_character:
                    "This field should not be have special character",
                add_err_end_date: "End date should be after start date",
                date_not_empty: "Month should not be empty",

                unit_evaluate: "Unit receiving work evaluation results",
                unit_manage_task: "Unit managing task",
                collaborated_with_organizational_units:
                    "Units that have collaborated",
                not_collaborated_with_organizational_units:
                    "No units that have collaborated",
                task_empty_employee: "No participants",
                delete_eval: "Delete evaluation",
                delete_eval_title: "Are you sure to delete this evaluation?",

                // confirm task
                confirm_task_success: "Confirm task successfully",
                confirm_task_failure: "Can not onfirm task",

                // yêu cầu kết thúc công việc
                request_close_task_success: "Send request to close task successfully",
                cancel_request_close_task_success: "Cancel request to close task successfully",
                approval_close_task_success: "Approve request to close task successfully",
                decline_close_task_success: "Decline request to close task successfully",
                request_close_task_failure: "Can not send request to close task",
                cancel_request_close_task_failure: "Can not cancel request to close task",
                approval_close_task_failure: "Can not approve request to close task",
                decline_close_task_failure: "Can not decline request to close task",

                // Mở lại công việc
                open_task_again_success: 'Open task again successfully',
                open_task_again_failure: 'Can not open task again',
                confirm_open_task: 'Are you sure you want to open this task again?',

                // warning
                warning: "Warning",
                not_have_evaluation: "No one evaluate task this month",
                warning_evaluate: "Evaluation is coming soon. You need to evaluate the work this month",
                you_need: "You need",
                confirm_task: "confirm take part in this task",
                not_confirm: "Not confirm this task",

                left_task_expired: "left is task expired",
                action_not_rating: "Actions not rating this month",

                left_can_edit_task:
                    "Remaining time to edit task evaluation of previous month",

                // check deadline
                warning_days: "days",
                warning_hours: "hours",
                warning_minutes: "minutes",

                project: 'Project name (if you have)',

                //dashboard cv đơn vị
                type_of_point: "Type of point",
                criteria: "Criteria",
                load_task: "Load task",
                time: "Time",
                load_task_chart: "Dashboard load task",
                load_task_chart_unit: "Dashboard load task of unit",
                timesheet_statistics: "Timesheets Statistics of",
                explain: "Explain",
                select_responsible: "Select responsible",
                timer: "Timer",
                additional_timer: "Additional Timer",
                interval_timer: "Interval Timer",
                start_time: "Start Time",
                end_time: "End Time",
                timer_type: "Type of Timer",
            },
            task_perform: {
                actions: "Actions",
                communication: "Communications",
                documents: "Documents",
                timesheetlogs: "Timesheet Logs",
                subtasks: "Subtasks",
                change_history: "Change logs",
                change_process: "Process",
                change_incoming: "Incoming data",
                change_outgoing: "Outgoing data",
                edit_action: "Edit action",
                delete_action: "Delete action",
                mandatory_action: "Mandatory action",
                confirm_action: "Confirm action",
                evaluation: "Evaluation",
                attach_file: "Attach file",
                comment: "Comment",
                result: "Result",
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
                enter_result_action: "Result of action",
                create_comment_action: "Create comment",
                stop_timer: "Stop timer",
                edit: "Edit",
                delete: "Delete",
                actions_not_perform: "Actions not perform",

                notice_end_task: "Are you sure to finish this task",
                notice_change_activate_task:
                    "Are you sure to change activated of this task",
                activated_task_list: "Activated tasks",
                activated_all: "Activated all following tasks",
                choose_following_task: "Choose the next task to be executed",
                task_link_of_process: "Link",
                not_have_following: "Not have following task",

                is_task_process: "This is a task of process",
                activated_task: "Activate",
                following_task: "Click here to activate the following tasks",

                // TODO: code_mesage_task_perform
                create_result_task_success: "Evaluate task successfully",
                edit_result_task_success: "Edit result task successfully",
                get_task_actions_success: "Get all task actions successfully",
                create_task_action_success: "Create task action successfully",
                edit_task_action_success: "Edit task action successfully",
                delete_task_action_success: "Delete task action successfully",
                get_action_comments_success:
                    "Get all action comments successfully",
                create_action_comment_success:
                    "Create action comments successfully",
                edit_action_comment_success:
                    "Edit action comments successfully",
                delete_action_comment_success:
                    "Delete action comments successfully",
                get_log_timer_success: "Get log timer successfully",
                get_timer_status_success: "get timer status successfully",
                start_timer_success: "Start timer successfully",
                pause_timer_success: "Pause timer successfully",
                continue_timer_success: "Continue timer successfully",
                stop_timer_success: "Stop timer successfully",
                create_result_info_task_success:
                    "Create result infomation task successfully",
                create_result_infomation_task_success:
                    "Create result infomation task successfully",
                edit_result_infomation_task_success:
                    "Edit result infomation task successfully",
                create_task_comment_success: "Create task comment success",
                get_task_comments_success: " Get all task comments success",
                edit_task_comment_success: " Edit task comment success",
                delete_task_comment_success: "Delete task comment success",
                create_comment_of_task_comment_success:
                    "Create comment of task comment success",
                edit_comment_of_task_comment_success:
                    "Edit comment of task comment success",
                delete_comment_of_task_comment_success:
                    " Delete comment of task comment success",
                evaluation_action_success: "Evaluation action success",
                confirm_action_success: "Confirm action success",
                delete_file_child_task_comment_success:
                    "Delete file of child task comment success",
                upload_file_success: "Upload file success",
                delete_file_success: "Delete file of action success",
                delete_file_comment_of_action_success:
                    "Delete file of comment of action success",
                delete_file_task_comment_success: "Delete file of task comment",
                create_task_log_success: " Create task log success",
                get_task_log_success: "get_task_log_success",
                edit_task_information_success: "Edit information successfully",
                edit_document_task_comment_success:
                    "Edit document successfully",

                create_result_task_fail: "Can't evaluate task",
                edit_result_task_fail: "Can't edit result task",
                get_task_actions_fail: "Get all task actions fail",
                create_task_action_fail: "Create task action fail",
                edit_task_action_fail: "Edit task action fail",
                delete_task_action_fail: "Delete task action fail",
                get_action_comments_fail: "Get all action comments fail",
                create_action_comment_fail: "Create action comments fail",
                edit_action_comment_fail: "Edit action comments fail",
                delete_action_comment_fail: "Delete action comments fail",
                get_log_timer_fail: "Get log timer fail",
                get_timer_status_fail: "get timer status fail",
                start_timer_fail: "Start timer fail",
                pause_timer_fail: "Pause timer fail",
                continue_timer_fail: "Continue timer fail",
                stop_timer_fail: "Stop timer fail",
                create_result_info_task_fail:
                    "Create result infomation task fail",
                create_result_infomation_task_fail:
                    "Create result infomation task fail",
                edit_result_infomation_task_success:
                    "Edit result infomation task fail",
                create_task_comment_fail: "Create task comment fail",
                get_task_comments_fail: "Get all task comments fail",
                edit_task_comment_fail: "Edit task comment fail",
                delete_task_comment_fail: "Delete task comment fail",
                create_comment_of_task_comment_fail:
                    "Create comment of task comment fail",
                edit_comment_of_task_comment_fail:
                    "Edit comment of task comment fail",
                delete_comment_of_task_comment_fail:
                    "Delete comment of task comment fail",
                evaluation_action_fail: "Evaluation action fail",
                confirm_action_fail: "Confirm action fail",
                delete_file_child_task_comment_fail:
                    "Delete file of child task comment fail",
                upload_file_fail: "Upload file fail",
                delete_file_fail: "Delete file of action fail",
                delete_file_comment_of_action_fail:
                    "Delete file of comment of action success",
                delete_file_task_comment_fail:
                    "Delete file of task comment fail",
                create_task_log_fail: "Create task log fail",
                get_task_log_fail: "get_task_log_fail",
                edit_task_information_failure:
                    "Can not edit information",
                edit_document_task_comment_failure:
                    "Can not edit document",
                time_overlapping: 'Start time invalid. Overlapping time with different time sheet log',


                // error label
                err_require: "Field is required",
                err_date_required: "Date is required",
                err_nan: "The value must be number",
                err_has_accountable:
                    "Must be have accountable employee at least one",
                err_has_consulted:
                    "Must be have consulted employee at least one",
                err_has_responsible:
                    "Must be have responsible employee at least one",

                // swal
                confirm: "Confirm",

                // modal approve task
                modal_approve_task: {
                    title: "Request to finish task",
                    msg_success: "Approved success",
                    msg_failure: "Approved failure",

                    task_info: "Information of task",
                    percent: "Progress of task",

                    auto_point: "Automatic point",
                    employee_point: "Employee point",
                    approved_point: "Accountable point",

                    responsible: "Responsible role",
                    consulted: "Consulted role",
                    accountable: "Accountable role",

                    err_range: "Value must be between 0 and 100",
                    err_contribute: "Sum of contributions should be 100",
                    err_not_enough_contribute:
                        "Sum of all contributions should be 100",
                    err_empty: "Value must be required",
                },

                request_close_task: 'Request to close task',
                approval_close_task: 'Approve request to close task',
                open_task_again: 'Open task again',
                send_request_close_task: 'Send request',
                cancel_request_close_task: 'Cancel request',
                approval_request_close_task: 'Approve',
                decline_request_close_task: 'Decline',
                status_task_close: 'Task status after closing'
            },
            task_process: {
                process_name: "Process name",
                process_description: "Process description",
                num_task: "Number of tasks in process",
                process_status: "Process status",
                creator: "Creator",
                manager: "Manager",
                viewer: "Viewer",
                no_data: "Not have data",
                time_of_process: "Time of process",
                process_information: "Process Information",
                start_date: "Start date",
                end_date: "End date",
                create: "Create",
                inprocess: "Inprocess",
                wait_for_approval: "Wait for approval",
                finished: "Finished",
                delayed: "Delayed",
                canceled: "Canceled",
                general_infomation: "General Infomation",
                notice: "Notice",
                information: "Information",
                document: "Document",
                roles: "Roles",
                list_of_data_and_info:
                    "Choose output information and documents for the following tasks in the process",
                not_have_doc: "The task does not have documents",
                not_have_info: "The task does not have information",
                task_process: "Task process",

                export_doc: "Export document",
                export_info: "Export information",

                create_task_with_template: "Create task with template",

                add_modal: "Create new process template",
                view_process_template_modal: "View process template",
                view_task_process_modal: "View task process",
                edit_modal: "Edit process template",
                add_task_process_modal: "Create tasks by process",

                save: "Save",

                // message from server
                get_all_success: "Get all process template successfully",
                get_all_err: "Get all process template fail",
                get_by_id_success: "Get process template by id successfully",
                get_by_id_err: "Get process template by id fail",
                create_success: "Create process template successfully",
                create_error: "Create process template fail",
                edit_success: "Edit process template successfully",
                edit_fail: "Edit process template fail",
                delete_success: "Delete process template successfully",
                delete_fail: "Delete process template fail",
                create_task_by_process_success:
                    "Create tasks by process successfully",
                create_task_by_process_fail: "Create tasks by process fail",
                get_all_task_process_success:
                    "Get all task process successfully",
                get_all_task_process_fail: "Get all task process fail",
                update_task_process_success: "Update task process successfully",
                update_task_process_fail: "Update task process fail",
                edit_info_process_success:
                    "Edit process infomation successfully",
                edit_info_process_fail: "Edit process infomation fail",
                import_process_success: "Import process template successfully",
                import_process_fail: "Import process template fail",

                error: {
                    empty_name: "Process name should not be empty",
                    special_character:
                        "Process name should not be has special character",

                    empty_description:
                        "Process description should not be empty",

                    empty_viewer: "It is necessary to indicate the viewer",
                    empty_manager: "It is necessary to indicate the manager",
                },
            },
            task_template: {
                create_task_template_success: "Create task template success !",
                create_task_template_fail: "Create task template fail !",
                edit_task_template_success: "Edit task template success !",
                edit_task_template_fail: "Edit task template fail !",
                delete_task_template_success: "Delete task template success !",
                delete_task_template_fail: "Delete task template fail !",
                error_task_template_creator_null:
                    "Creator of this task template does not exist or has been deleted",
                view_task_process_template: "View task process template",
                import_task_template_success: "Import task template success",
                import_task_template_failure: "Import task template failure",
                select_task_process_template:"Select taskprocess template",
                process_template_name:"Process template name",
            },
            task_dashboard: {
                general_unit_task: "General unit task dashboard",
                unit: "Organizational unit",
                unit_lowercase: "organizational unit",
                all_tasks: "All tasks",
                of: "of",
                all_tasks_inprocess: "All tasks inprocess",
                all_tasks_finished: "All tasks finished",
                confirmed_task: "Confirmed tasks",
                none_update_recently: "None updated recently tasks",
                intime_task: "Intime tasks",
                delay_task: "Delayed tasks",
                overdue_task: "Overdue tasks",
                no_task: "No data",
                unconfirmed_task: "Unconfirmed tasks",
                urgent_task: "Urgent tasks",
                to_do_task: "Todo tasks",
                day_ago: "days ago",
                rest: "Rest",
                updated: "Updated",
                day: "days",
                overdue: "Over",
                task_name: "Task",
                start_date: "Start date",
                end_date: "End date",
                statistical_timesheet_logs: "Statistical timesheet logs",
                statistical_timesheet_logs_unit: "Statistical timesheet logs of unit",
                from: "from",
                to: "to",
                index: "Serial",
                name: "Full name",
                totalhours: "Total hours",
                autotimer: "Auto timer",
                logtimer: "Log timer",
                manualtimer: "Manual timer"
            }
        },

        kpi: {
            general: {
                show: "Show"
            },
            employee: {
                get_kpi_by_member_success: "Get KPI by member successfully",
                get_kpi_by_member_fail: "Get KPI by member fail",
                get_kpi_responsible_success:
                    "Get all KPI responsible successfully",
                get_kpi_responsible_fail: "Get all KPI responsible fail",

                //Nhóm dành cho module creation
                employee_kpi_set: {
                    create_employee_kpi_set: {
                        // Module chính
                        // Nhóm dành cho các thông tin chung
                        general_information: {
                            general_information: "Personal KPI in",
                            save: "Save the edit",
                            edit: "Edit",
                            delete: "Delete this KPI",
                            cancel: "Cancel",
                        },
                        overview: "Overview",
                        evaluation: "Evaluation",
                        time: "Time",
                        approver: "Approver",
                        weight: {
                            weight_total: "Weight total",
                            not_satisfied: "Not satisfied",
                            satisfied: "Satisfied",
                        },
                        satisfied: "Satisfied",
                        not_satisfied: "Not Satisfied",
                        initialize_kpi_newmonth: "Initialize KPI",
                        request_approval: "Request for approval",
                        cancel_request_approval: "Cancel request for approval",
                        not_initialize_organiztional_unit_kpi:
                            "Your unit has not initialized KPI on this month yet, please contact the manager of your unit",
                        not_activate_organiztional_unit_kpi:
                            "Your unit has not activated KPI on this month yet, please contact the manager of your unit",

                        // Nhóm dành cho các trạng thái tập KPI
                        kpi_status: {
                            status: "KPI status",
                            setting_up: "Setting-up",
                            awaiting_approval: "Awaiting approval",
                            activated: "Activated",
                            finished: "Finished",
                        },

                        // Nhóm dành cho các trạng thái mục tiêu KPI
                        check_status_target: {
                            not_approved: "Not approved",
                            edit_request: "Edit request",
                            activated: "Activated",
                            finished: "Finished",
                        },

                        // Nhóm dành cho table
                        target_list: "Target list",
                        add_target: "Add target",
                        no_: "No.",
                        target_name: "Target name",
                        parents_target: "Parents target",
                        evaluation_criteria: "Evalution criteria",
                        weight: "Weight",
                        status: "Status",
                        action: "Action",
                        not_initialize: "No KPI have been initialized in ",

                        // Nhóm dành cho phản hồi
                        submit: {
                            feedback: "Feedback",
                            send_feedback: "Send feedback",
                            cancel_feedback: "Cancel",
                        },

                        // Nhóm dành cho các handle
                        handle_edit_kpi: {
                            approving:
                                "KPI is being approved, you can not edit it. If you want to modify, please contact your manager!",
                            activated:
                                "KPI has been activated, you can not edit. If you want to modify, please contact your manager!",
                            finished:
                                "KPI has been finished, you can not edit!",
                        },
                        delete_kpi: {
                            kpi: "Are you sure you want to delete this KPI?",
                            kpi_target:
                                "Are you sure you want to delete this KPI target?",
                            approving:
                                "KPI is being approved, you can not delete!",
                            activated:
                                "KPI has been activated, you can not delete!",
                        },
                        edit_target: {
                            approving:
                                "KPI is being approved, you can not edit!",
                            activated:
                                "KPI is being activated, you can not edit!",
                            evaluated:
                                "KPI is being evaluated, you can not edit!"
                        },
                        request_approval_kpi: {
                            approve:
                                "Are you sure you want to be approved this KPI?",
                            not_enough_weight: "The total weight must be 100",
                        },
                        cancel_approve: {
                            cancel: "Are you sure you want to cancel this KPI?",
                            activated:
                                "KPI has been activated, you can not cancel the request for approval. If you want to modify, please contact your manager!",
                        },
                        action_title: {
                            edit: "Edit",
                            content:
                                "This is the default target (if necessary, weights can be corrected)",
                            delete: "Delete",
                        },
                        add_new_target: {
                            approving:
                                "KPI is being approved, you can not create new target!",
                            activated:
                                "KPI is being activated, you can not create new target!",
                        },
                        handle_populate_info_null: {
                            error_kpi_approver_null:
                                "Error! The approver of this KPI set does not exist or was deleted",
                            error_kpi_organizational_unit_null:
                                "Error! The organizational unit of this KPI set does not exist or was deleted",
                            error_kpi_parent_target_null:
                                "Error! The parent target of this KPI set does not exist or was deleted",
                            error_kpi_targets_list_null:
                                "Error! The list targets of this KPI set does not exist or was deleted",
                        },
                    },

                    create_employee_kpi_modal: {
                        // Module con
                        // Nhóm dành cho modal
                        create_employee_kpi: "Add personal KPI target",
                        name: "Target name",
                        parents: "Parents target",
                        evaluation_criteria: "Evaluation criteria",
                        weight: "Weight",

                        // Nhóm dành cho validate
                        validate_weight: {
                            empty: "Weight cannot be empty",
                            less_than_0: "Weight cannot be less than 0",
                            greater_than_100:
                                "Weight cannot be greater than 100",
                        },
                    },

                    kpi_member_manager: {
                        // Module con
                        index: "Index",
                        time: "Date",
                        employee_name: "Employee Name",
                        target_number: "Target Number",
                        kpi_status: "KPI Status",
                        result: "Result",
                        approve: "Approve",
                        evaluate: "Evaluate",
                    },

                    create_employee_kpi_set_modal: {
                        // Module con
                        // Nhóm dành cho modal
                        initialize_kpi_set: "Initialize personal KPI",
                        organizational_unit: "Organizational Unit",
                        month: "Month",
                        approver: "Approver",
                        default_target: "Default target",
                    },

                    edit_employee_kpi_modal: {
                        // Module con
                        // Nhóm dành cho modal
                        edit_employee_kpi: "Edit personal KPI targets",
                        name: "Target name",
                        parents: "Parents target",
                        evaluation_criteria: "Evaluation criteria",
                        weight: "Weight",
                    },

                    //Thông điệp trả về từ server
                    messages_from_server: {
                        initialize_employee_kpi_set_success:
                            "Initialize employee KPI set successfully",
                        initialize_employee_kpi_set_failure:
                            "Can not initialize employee KPI set",

                        create_employee_kpi_success:
                            "Add KPI target successfully",
                        create_employee_kpi_failure:
                            "Can not add KPI target",

                        edit_employee_kpi_set_success:
                            "Edit employee KPI set successfully",
                        edit_employee_kpi_set_failure:
                            "Can not edit employee KPI set",
                        delete_employee_kpi_set_success:
                            "Delete employee KPI set successfully",
                        delete_employee_kpi_set_failure:
                            "Can not delete employee KPI set",

                        approve_success:
                            "Confirm request approval successfully",
                        approve_failure:
                            "Can not confirm request approval",

                        delete_employee_kpi_success:
                            "KPI target has been deleted",
                        delete_employee_kpi_failure:
                            "Can not delete KPI target",

                        edit_employee_kpi_success:
                            "KPI target has been edited",
                        edit_employee_kpi_failure:
                            "Can not edit KPI target",
                    },
                },
            },
            evaluation: {
                dashboard: {
                    organizational_unit: "Unit",
                    select_units: "Select organizational unit",
                    all_unit: "All organizational unit",
                    search: "Search",
                    setting_up: "Setting up",
                    awaiting_approval: "Awaiting approval",
                    activated: "Activated",
                    number_of_employee: "Number of employees",
                    excellent_employee: "Excellent Employees",
                    best_employee: "Best employee",
                    month: "Month",
                    auto_point: "Automatic Point",
                    employee_point: "Employee Point",
                    approve_point: "Approve Point",
                    option: "Options",
                    analyze: "Analyze",
                    statistics_chart_title: "Statistics KPI of employees",
                    result_kpi_titile: "Result KPI of all employees",
                    auto_eva: "Evaluated automatically",
                    employee_eva: "Evaluated by Employee",
                    approver_eva: "Evaluated by Approver",
                    result_kpi_personal: "Personal KPI result",
                    distribution_kpi_personal: "Distribution of KPI personal",
                },

                employee_evaluation: {
                    /**
                     * Approve
                     */
                    approve_KPI_employee: "Approve KPI",
                    show_logs: "Employee KPI set logs",
                    month: "",
                    end_compare: "End comparing",
                    compare: "Compare",
                    approve_all: "Approve all",
                    choose_month_cmp: "Choose month",
                    kpi_this_month: "KPI month",
                    search: "Search",
                    number_of_targets: "Number of targets",
                    system_evaluate: "System evaluate",
                    result_self_evaluate: "Result self evaluate",
                    evaluation_management: "Evaluation management",
                    not_evaluated_yet: "Not evaluated yet",
                    view_detail: "View detail",
                    clone_to_new_kpi:
                        "Create new KPI based on KPI in this month",
                    index: "ID",
                    name: "Name",
                    target: "KPI unit",
                    criteria: "Criteria",
                    weight: "Weight",
                    result: "Result",
                    target: "targets",
                    data_not_found: "There is no satisfied result",
                    unsuitable_weight: "Unsuitable weight",
                    unsuitable_approval: "Editing is not approved",
                    status: "Status",
                    action: "Action",
                    save_result: "Save result",
                    edit_target: "Edit kpi",
                    pass: "Pass",
                    fail: "Fail",

                    /**
                     * Comment
                     */
                    edit_cmt: "Edit comment",
                    delete_cmt: "Delete comment",
                    add_cmt: "Add comment",
                    attached_file: "Attach file",
                    send_edition: "Submit edition",
                    cancel: "Cancel",
                    comment: "Comment",

                    /**
                     * Evaluate
                     */
                    KPI_list: "KPI list",
                    calc_kpi_point: "Caculate KPI point",
                    export_file: "Export file",
                    KPI_info: "Infomation of ",
                    point_field: "Point (Automatic - Employee - Approver)",
                    weekly_point_field:
                        "Weekly point (Automatic - Employee - Approver)",
                    weekly_point: "Weekly point",
                    week1: "Week 1",
                    week2: "Week 2",
                    week3: "Week 3",
                    week4: "Week 4",
                    not_avaiable: "Not evaluated",
                    no_point: "No Point",
                    lastest_evaluation: "Lastest evaluation",
                    lastest_edit: "Lastest edit",
                    task_list: "Task list",
                    work_duration_time: "Working duration time",
                    evaluate_time: "Evaluate time",
                    contribution: "Contribution",
                    importance_level: "Importance level",
                    point: "Point",
                    evaluated_value: "Evaluate value",
                    new_value: "New value",
                    old_value: "Old value",
                    auto_value: "Auto value",
                    refresh: "Refresh",
                    /**
                     * Management
                     */
                    wrong_time: "Start time should be earlier than end time",
                    confirm: "Confirm",
                    choose_employee: "Choose employee",
                    employee: "Employee",
                    choose_status: "Choose status",
                    establishing: "Establishing",
                    expecting: "Waiting for approving",
                    activated: "Activated",
                    time: "Time",
                    num_of_kpi: "Number of KPI",
                    kpi_status: "KPI status",
                    approve: "Approve",
                    evaluate: "Evaluate",
                    approve_this_kpi: "Approve this KPI",
                    evaluate_this_kpi: "Evaluate this KPI",
                    from: "From",
                    to: "To",

                    /**
                     * Importance Dialog
                     */
                    num_of_working_day: "Number of working day",
                    priority: "Priority",
                    formula: "Formula",
                    explain_automatic_point: "Explain automatic value",
                    cal_all_kpis: 'Calculator all kpi',
                    refresh_all_kpis: 'Calculator all organizational unit KPI',
                    update_task_importance: `(*)Update task importance level and Calculator KPI point`,
                    cal_all_kpis_title: `(*)Update task importance level and Calculator all KPI point`,

                },

                /**
                 * Thông báo từ service
                 */
                get_all_kpi_member_success: "Get all KPI member successfully",
                get_all_kpi_member_fail: "Get all KPI member fail",
                get_kpi_targets_success: "Get KPI targets successfully",
                get_kpi_targets_fail: "Get KPI targets fail",
                get_all_kpi_member_by_id_success:
                    "Get all KPI member by Id successfully",
                get_all_kpi_member_by_id_fail: "Get all KPI member by Id fail",
                get_all_kpi_member_by_month_success:
                    "Get all KPI member by month successfully",
                get_all_kpi_member_by_month_fail:
                    "Get all KPI member by month fail",
                approve_all_kpi_target_success:
                    "Approve all KPI target successfully",
                approve_all_kpi_target_fail: "Approve all KPI target fail",
                edit_kpi_target_member_success:
                    "Edit KPI member target successfully",
                edit_kpi_target_member_fail: "Can not edit KPI member target",
                edit_status_target_success: "Edit status target successfully",
                edit_status_target_fail: "Can not edit status target",
                get_task_by_id_success: "Get all tasks by Id successfully",
                get_task_by_id_fail: "Can not get all tasks by Id",
                get_system_point_success: "Get system point successfully",
                get_system_point_fail: "Can not get system point",
                set_task_importance_level_success:
                    "Set task importance level and evalutate KPI successfully",
                set_task_importance_level_fail:
                    "Can not set task importance level and evalutate KPI",
                set_point_kpi_success:
                    "Evalutate all KPIs successfully",
                set_point_kpi_fail:
                    "Can not evalutate all KPIs",
            },
            organizational_unit: {
                // Module chính
                create_organizational_unit_kpi_set: {
                    // Nhóm dành cho các thông tin chung
                    general_information: "Organizational unit KPI",
                    save: "Save the edit",
                    confirm: "Confirm",
                    delete: "Delete this KPI",
                    cancel: "Cancel",
                    approve: "Approve",
                    cancel_approve: "Unapprove",
                    target: "target",
                    confirm_delete_success:
                        "Are you sure you want to delete this entire KPI?",
                    time: "Time",
                    initialize_kpi_newmonth: "Initialize KPI",
                    edit_kpi_success: "KPI has been successfully edited",
                    edit_kpi_failure: "Can not edit KPI",
                    delete_kpi_success: "KPI has been successfully deleted",
                    delete_kpi_failure: "Can not delete KPI",
                    copy_kpi_unit: "Copy KPI Unit",
                    employee_importance: "Employee importances",
                    organizational_unit_importance: "Children organizational unit importances",

                    // Nhóm dành cho trọng số
                    weight_total: "Weight total",
                    not_satisfied: "Not satisfied",
                    satisfied: "Satisfied",

                    // Nhóm dành cho các trạng thái tập KPI
                    not_approved: "Not approved",
                    approved: "Approved",

                    // Nhóm dành cho table
                    target_list: "Target list",
                    add_target: "Add target",
                    no_: "No.",
                    target_name: "Target name",
                    parents_target: "Parents target",
                    evaluation_criteria: "Evalution criteria",
                    weight: "Weight",
                    action: "Action",
                    not_initialize: "No KPI has been initialized in ",

                    // Nhóm dành cho các handle
                    confirm_approve_already: "KPI is approved!",
                    confirm_approve:
                        "Are you sure you want to approve this KPI?",
                    confirm_not_enough_weight: "The total weight must be 100",
                    confirm_cancel_approve:
                        "Are you sure you want to cancel this KPI?",
                    confirm_edit_status_success: "KPI status has been successfully edited",
                    confirm_edit_status_failure:
                        "Can not edit KPI status",

                    confirm_kpi:
                        "Are you sure you want to delete this KPI target?",
                    confirm_approving:
                        "KPI has been activated, you can not delete!",
                    confirm_delete_target_success:
                        "KPI target has been successful deleted",
                    confirm_delete_target_failure:
                        "Can not delete KPI target",

                    // Nhóm các title
                    edit: "Edit",
                    content:
                        "This is the default target (if necessary, weights can be corrected)",
                    delete_title: "Delete",
                    employee_importance_activated: "KPI has been activated, you can not edit employee importances!",
                    organizational_unit_importance_activated: "KPI has been activated, you can not edit children organizational unit importances!"
                },

                create_organizational_unit_kpi_modal: {
                    // Module con
                    // Nhóm dành cho modal
                    create_organizational_unit_kpi: "Add personal KPI target",
                    name: "Target name",
                    parents: "Parents target",
                    evaluation_criteria: "Evaluation criteria",
                    weight: "Weight",
                    create_target_success: "KPI target has been successfully added",
                    create_target_failure:
                        "You have not entered enough information",
                    organizational_unit_kpi_exist: "Organizational Unit KPI already exists",


                    // Nhóm dành cho validate
                    validate_name: {
                        empty: "Target name cannot be empty",
                        less_than_4:
                            "Target name cannot be less than 4 characters",
                        more_than_50:
                            "Target name cannot be more than 50 characters",
                        special_character:
                            "Target name cannot contain special characters",
                    },
                    validate_criteria: "Criteria cannot be empty",
                    validate_weight: {
                        empty: "Weight cannot be empty",
                        less_than_0: "Weight cannot be less than 0",
                        greater_than_100: "Weight cannot be greater than 100",
                    },
                },

                kpi_member_manager: {
                    // Module con
                    index: "Index",
                    time: "Date",
                    employee_name: "Employee Name",
                    target_number: "Target Number",
                    kpi_status: "KPI Status",
                    result: "Result",
                    approve: "Approve",
                    evaluate: "Evaluate",
                },

                kpi_organizational_unit_manager: {
                    index: "Index",
                    time: "Date",
                    employee_name: "Employee Name",
                    target_number: "Target Number",
                    kpi_status: "KPI Status",
                    result: "Result",
                    approve: "Approve",
                    evaluate: "Evaluate",
                    target_name: "Target Name",
                    creator: "Creator",
                    organization_unit: "Organization Unit",
                    criteria: "Criteria",
                    no_data: "No data",
                },

                create_organizational_unit_kpi_set_modal: {
                    // Module con
                    // Nhóm dành cho modal
                    initialize_kpi_set: "Initialize organizational unit KPI",
                    organizational_unit: "Organizational Unit",
                    month: "Month",
                    default_target: "Default target",
                    create_organizational_unit_kpi_set_success:
                        "KPI has been successfully initialized",
                    create_organizational_unit_kpi_set_failure:
                        "You have not entered enough information",
                },

                edit_target_kpi_modal: {
                    // Module con
                    // Nhóm dành cho modal
                    edit_organizational_unit_kpi: "Edit personal KPI targets",
                    name: "Target name",
                    parents: "Parents target",
                    evaluation_criteria: "Evaluation criteria",
                    weight: "Weight",
                    edit_target_success: "KPI target has been successfully edited",
                    edit_target_failure:
                        "You have not entered enough information",
                    organizational_unit_kpi_exist: "Organizational Unit KPI Target already exists"
                },
                // Dashboard KPI Unit
                dashboard: {
                    organizational_unit: "Organizational unit",
                    organizational_unit_low_case: "organizational unit",
                    month: "Month",
                    trend: "Implement target trend of employee",
                    distributive: "Distributive KPI unit of",
                    statiscial: "Statistical result of KPI unit of",
                    result_kpi_unit: "Result of KPI of",
                    start_date: "Start date",
                    end_date: "End date",
                    search: "Search",
                    point: "Point",
                    no_data: "No data",
                    line_chart: "Line chart",
                    pie_chart: "Pie chart",
                    trend_chart: {
                        execution_time: "Execution time (Days)",
                        participants: "Amount of participants",
                        amount_tasks: "Amount of tasks",
                        amount_employee_kpi: "Amount of employee KPI",
                        weight: "Weight",
                    },
                    result_kpi_unit_chart: {
                        automatic_point: "Automatic point",
                        employee_point: "Employee point",
                        approved_point: "Approved point",
                    },
                    alert_search: {
                        search:
                            "The start time must be before or equal to the end time!",
                        confirm: "Confirm",
                    },
                    statistic_kpi_unit: {
                        count_employee_same_point:
                            "Count Employee With The Same Point",
                        automatic_point: "Automatic point",
                        employee_point: "Employee point",
                        approved_point: "Approved point",
                    },
                },

                management: {
                    copy_modal: {
                        alert: {
                            check_new_date: "No initialization month selected",
                            confirm: "Confirm",
                            coincide_month: "KPI already exists on ",
                            unable_kpi: "Unable to create new KPI in the past",
                            change_link:
                                "Remember to change the link to the parent target to get the new KPI!",
                        },
                        create: "Employee KPI set information on",
                        organizational_unit: "Copy from department",
                        month: "Month",
                        list_target: "List target",
                        setting: "Constitute",
                        cancel: "Cancel",
                    },
                    detail_modal: {
                        list_kpi_unit: "List KPI unit",
                        title: "Organizational unit KPI details on ",
                        title_parent: "Parent organizational unit KPI details on  ",
                        information_kpi: "Information KPI ",
                        criteria: "Criteria:",
                        weight: "Weight:",
                        export_file: "Export file",
                        point_field: "Point (Automatic - Employee - Approver)",
                        list_child_kpi: "List child KPI",
                        not_eval: "Not evaluate",
                        index: "Index",
                        target_name: "Target Name",
                        creator: "Creator",
                        organization_unit: "Department",
                        criteria: "Criteria",
                        result: "Result",
                        no_data: "No data",
                    },
                    over_view: {
                        start_date: "Start date",
                        end_date: "End date",
                        search: "Search",
                        status: "Status",
                        all_status: "All status",
                        setting_up: "Setting-up",
                        activated: "Activated",
                        time: "Time",
                        creator: "Creator",
                        number_target: "Number target",
                        result: "Result",
                        no_data: "No data",
                        action: "Action",
                        not_eval: "Not evaluate",
                        alert_search: {
                            search:
                                "The start time must be before or equal to the end time!",
                            confirm: "Confirm",
                        },
                    },
                },

                statistics: {
                    unit_not_initial_kpi: "Organizational unit list has not been initialized",
                    detail_participant: "Participant detail",
                    detail_employee_kpi: "Employee KPI detail",
                    email: "Email",
                    weight_established: "Established weight",
                    weight_analysis_employee: "The KPI weight is based on the established weight analysis of the employee KPI",
                    weight_analysis_children_unit: "The KPI weight is based on the established weight analysis of the children unit KPI",
                    weight_analysis_tree_unit: "The KPI weight is based on the established weight analysis of the tree unit KPI",
                },

                //Thông điệp khác trả về từ server
                get_parent_by_unit_success:
                    "Get KPI by parent unit successfully",
                get_parent_by_unit_failure:
                    "Can not get KPI by parent unit",
                get_kpi_unit_success: "Get all KPI unit successfully",
                get_kpi_unit_fail: "Can not get all KPI unit",
                get_kpiunit_by_role_success:
                    "Get KPI unit by role successfully",
                get_kpiunit_by_role_fail: "Get KPI unit by role fail",
                create_kpi_unit_success: "Create KPI unit successfully",
                create_kpi_unit_fail: "Can not create KPI unit",
                update_evaluate_kpi_unit_success:
                    "Update KPI unit evaluation successfully",
                update_evaluate_kpi_unit_fail:
                    "Can not update KPI unit evaluation",
                copy_kpi_unit_success: "Copy organizational unit KPI set successfully",
                copy_kpi_unit_failure: "Can not copy organizational unit KPI set",
                copy_employee_kpi_success: "Copy employee KPI set successfully",
                copy_employee_kpi_failure: "Can not copy employee KPI set",
                organizatinal_unit_kpi_set_exist: "Organizational unit KPI set already exists",
                employee_kpi_set_exist: "Employee KPI set already exists",
                calculate_kpi_unit_success: "Calculate organizational unit KPI successfully",
                calculate_kpi_unit_failure: "Can not calculate organizational unit KPI"
            },
        },

        manage_warehouse: {
            dashboard_bill: {},
            dashboard_inventory: {},
            category_management: {
                index: "STT",
                add: "Add a new",
                add_title: "Add new category",
                info: "Information about the list of commodity",
                edit: "Edit category information",
                delete: "Delete category",
                add_success: "Add successfully",
                delete_success: "Delete successfully",
                delete_faile: "Delete failed",
                add_faile: "Add failed",
                edit_success: "Edit successfully",
                edit_faile: "Edit failed",
                name: "Category name",
                code: "Category code",
                type: "Category type",
                good: "commodity",
                address: "Address",
                description: "Description",
                choose_type: "Select commodity type",
                all_type: "Select all commodity",
                product: "Product",
                material: "Material",
                equipment: "Equipment",
                waste: "Waste",
                search: "Search",
                validate_code: "Category code cannot be empty",
                validate_name: "Category name cannot be empty",
                validate_type: "Must select category type",
                delete_info: "Do you want to delete the category?",
            },
            good_management: {
                product: "Product",
                material: "Material",
                equipment: "Equipment",
                waste: "Asset",
                index: "Index",
                add: "Add",
                add_title: {
                    product: "Add new product",
                    material: "Add new material",
                    equipment: "Add new equipment",
                    waste: "Add new waste",
                },
                info: {
                    product: "Product information",
                    material: "Material information",
                    equipment: "Equipment information",
                    waste: "Waste information",
                },
                edit: {
                    product: "Edit new product",
                    material: "Edit new material",
                    equipment: "Edit new equipment",
                    waste: "Edit new waste",
                },
                delete: "Delete commodity",
                add_success: "Add new commodity success",
                delete_success: "Delete commodity success",
                delete_faile: "Delete commodity failed",
                add_faile: "Add new commodity failed",
                edit_success: "Edit success",
                edit_faile: "Edit failed",
                name: "Commodity name",
                good_source: "Good source",
                validate_source_product: 'Product source cannot be empty',
                code: "Commodity code",
                type: "Commodity type",
                good: "Commodity",
                address: "Address",
                description: "Description",
                choose_type: "Choose type of commodity",
                all_type: "Choose all type of commodity",
                product: "Products",
                material: "Material",
                importedFromSuppliers: "Imported from suppliers",
                selfProduced: "Self-produced",
                equipment: "Equipment",
                waste: "Waste",
                search: "Search",
                validate_code: "Commodity code cannot be left blank",
                validate_name: "Commodity name cannot be left blank",
                validate_type: "Need to choose a category type",
                delete_info: "Do you want to delete the commodity?",
                category: "Category",
                unit: "Unit",
                baseUnit: "Basic unit",
                materials: "Main ingredient",
                unit_name: "Unit name",
                conversion_rate: "Conversion rate",
                quantity: "Quantity",
                choose_category: "Choose category",
                choose_source: "Choose source good",
                choose_base_unit:
                    "Please select the unit to create the packing rule",
                packing_rule: "Packing rule",
                non_choose_base_unit: "Not select",
                choose_base_unit_all: "Select all",
                error_packing_rule:
                    "The selected unit cannot form a packing rule. Please choose again!",
                info_mill: "Information about the factory",
                productivity: "Product unit / shift",
                person_number: "Number of people/shift",
                mill: "factory",
                choose_mill: "select factory",
                error_choose_mill: "Please select factory",
                error_productivity: "Enter value must be > 0",
                error_person_number: "Enter value must be > 0",
                mill_code: "Factory code",
                mill_name: "Factory name",
                numberExpirationDate: "Expiry date (calculate by day)",
                day: "Date",
                expirationDate: "Expiry date",
                validate_number_expiration_date:
                    "Expiration date cannot be left blank",
                validate_number_expiration_date_input:
                    "Expiry date must be greater than 0",
            },

            stock_management: {
                // 1: "Sẵn sàng sử dụng",
                // 2: "Đang sử dụng",
                // 3: "Đang sửa chữa",
                // 4: "Không sử dụng",
                1: {
                    status: "Ready to use",
                    color: "green",
                },
                2: {
                    status: "Using",
                    color: "blue",
                },
                3: {
                    status: "Is corrected",
                    color: "violet",
                },
                4: {
                    status: "Do not use",
                    color: "red",
                },
                index: "Index",
                add: "Add",
                add_title: "Add new warehouse",
                info: "Information about the warehouse",
                edit: "Edit warehouse information",
                delete: "delete warehouse",
                add_success: "Add successfully",
                delete_success: "Delete Successfully",
                delete_faile: "Delete failed",
                add_faile: "Add failed",
                edit_success: "Edit successfully",
                edit_faile: "Edit failed",
                name: "Warehouse name",
                code: "Warehouse code",
                goods: "Commodity in warehouse",
                good: "Commodity",
                status: "status",
                address: "Address",
                description: "Description",
                choose_status: "Select status",
                choose_department: "--Select department--",
                department: "Management department",
                management_location: "Management location",
                all_type: "Select all status",
                search: "Search",
                validate_code: "Warehouse code cannot be empty",
                validate_name: "Warehouse name cannot be empty",
                validate_status: "Must select warehouse type",
                delete_info: "Do you want to delete the archive?",
                max_quantity: "Max quantity",
                min_quantity: "Min quantity",
                choose_good: "Select commodity",
                choose_role: "Select role",
                validate_good: "Commodity cannot be empty",
                detail_stock: "Warehouse detail",
                validate_address: "Address cannot be empty",
                validate_department: "Department cannot be empty",
                validate_management: "Management location cannot be empty",
                product: "Product",
                material: "Material",
                equipment: "Equipment",
                waste: "waste",
                role: "Role",
                management_good: "Managed Commodities",
            },
            bin_location_management: {
                product: "Product",
                material: "Material",
                equipment: "Equipment",
                asset: "Asset",
                bin_location: "Storage location",
                category_tree: "Tree directory",
                category_table:"Table list",
                archive: "Storage category",
                1: {
                    status: "Ready to use",
                    color: "green",
                },
                2: {
                    status: "Using",
                    color: "blue",
                },
                3: {
                    status: "Is corrected",
                    color: "violet",
                },
                4: {
                    status: "Do not use",
                    color: "red",
                },
                5: {
                    status: "Full",
                    color: "red",
                },
                index: "Index",
                add: "Add",
                add_title: "Add new storage location",
                info: "Storage location information",
                edit: "Edit storage location information",
                delete: "Delete storage location",
                add_success: "Add successfully",
                delete_success: "Delete successfully",
                delete_faile: "Delete failed",
                add_faile: "Add failed",
                edit_success: "Edit successfully",
                edit_faile: "Edit failed",
                name: "Storage location name",
                unit: "Unit",
                parent: "Parent storage location",
                code: "code",
                goods: "Commodity in storage",
                enable_good: "commodity can be storage",
                good: "Commodity",
                type: "Commodity type",
                status: "Status",
                capacity: "capacity",
                contained: "Contained",
                address: "Address",
                description: "Desctiption",
                choose_status: "Select status",
                choose_department: "--Select unit--",
                department: "Management department",
                management_location: "Management",
                all_type: "Select all status",
                search: "Search",
                validate_code: "Warehouse code cannot be empty",
                validate_name: "Warehouse name cannot be empty",
                validate_status: "Must select warehouse type",
                delete_info: "Do you want to delete the warehouse?",
                max_quantity: "Max quantity",
                min_quantity: "Min quantity",
                stock: "Warehouse",
                validate_capacity: "Capacity cannot be empty",
                validate_good: "Commodity cannnot be empty",
                validate_department: "Management department cannot be empty",
                validate_stock: "warehouse cannot be empty",
                choose_stock: "Select warehouse",
                choose_good: "Select commodity",
                detail_title: "Detail storage location",
            },
            bill_management: {
                text: "Consignment have not been writen",
                billType: {
                    1: "Import materials",
                    2: "Import finished product",
                    3: "Import equipment",
                    4: "Import waste",
                    5: "Export materials",
                    6: "Export finished product",
                    7: "Export equipment",
                    8: "Export waste",
                    9: "Periodic inventory",
                    10: "Regular inventory",
                    11: "Return of self-produced goods that do not pass quality inspection",
                    12: "Return goods imported from suppliers that do not pass quality inspection",
                    13: "return goods that have been shipped",
                    14: "commodity rotation",
                },
                1: {
                    status: "Waiting for approval",
                    color: "green",
                },
                2: {
                    status: "Accomplished",
                    color: "blue",
                },
                3: {
                    status: "Approved",
                    color: "violet",
                },
                4: {
                    status: "Cancelled",
                    color: "red",
                },
                bill_color: {
                    1: "green",
                    2: "blue",
                    3: "violet",
                    4: "red",
                    5: "blue",
                },
                bill_status: {
                    1: "Waiting for approval",
                    2: "Accomplished",
                    3: "Approved",
                    4: "Cancelled",
                    5: "Processing",
                },
                stock_book: "Warehouse book",
                good_receipt: "Commodity receipt",
                good_issue: "Commodity",
                good_return: "Commodity return",
                stock_take: "Commodity inventory",
                stock_rotate: "Commodity rotation",
                code: "Bill code",
                type: "Bill type",
                creator: "Creator",
                date: "created date",
                description: "Description",
                stock: "Warehouse",
                rotate_stock: "rotation warehouse",
                from_date: "From",
                to_date: "To",
                search: "Search",
                index: "Index",
                proposal: "Proposal bill",
                status: "Status",
                issue_stock: "Issue warehouse",
                receipt_stock: "Receipt warehouse",
                customer: "Customer",
                supplier: "Supplier",
                mill: "Mill",
                issued: "issued bil",
                partner: "partner",
                bill_detail: "Bill detail",
                approved: "Approve person",
                updateror: "Repairer",
                createAt: "Repair time",
                title: "Title",
                view_version: "Log bill",
                accountables: "Accountables",
                qualityControlStaffs: "Quality Control Staffs",
                list_saffs: "List of participants",
                approved_time: "Approve time",
                time: "Inspection time",
                goods: "List of commodity",
                good_name: "Commodity name",
                approved_true: "Approve bill",
                staff_true: "Checking the quality of commodity",
                good_code: "Commodity code",
                number: "number",
                unit: "Unit",
                note: "Note",
                issued_quantity: "Issued quantity",
                return_quantity: "Return quantity",
                real_quantity: "Real quantity",
                lot: "Consignment",
                lot_number: "Consignment number",
                difference: "Difference",
                receiver: "Deliver",
                choose_good: "Select commodity",
                choose_type: "Select bill",
                choose_approver: "Select approver",
                choose_customer: "Select customer",
                choose_manufacturing_mills: "Select mill",
                choose_lot: "Select consignment",
                choose_stock: "Select warehouse",
                add_title: {
                    1: "Add new receipt bill",
                    2: "Add new issue bill",
                    3: "Add new return bill",
                    4: "Add new inventory bill",
                    5: "Add new rotate bill",
                },
                edit_title: {
                    1: "Edit new receipt bill",
                    2: "Edit new issue bill",
                    3: "Edit new return bill",
                    4: "Edit new inventory bill",
                    5: "Edit new rotate bill",
                },
                detail_title: {
                    1: "Detail of receipt bill",
                    2: "Detail of issue bill",
                    3: "Detail of return bill",
                    4: "Detail of receinventorypt bill",
                    5: "Detail of rotate bill",
                },
                detail_version: {
                    1: "Detail change of receipt bill",
                    2: "Detail change of issue bill",
                    3: "Detail change of return bill",
                    4: "Detail change of receinventorypt bill",
                    5: "Detail change of rotate bill",
                },
                qc_status: {
                    1: {
                        color: "orange",
                        content: "Untested",
                    },
                    2: {
                        color: "green",
                        content: "Pass the test",
                    },
                    3: {
                        color: "red",
                        content: "Did not pass the test",
                    },
                },
                qc_name: "Quality person 's name",
                qc_email: "email",
                qc_status_bill: "status",
                quality_control_content: "Content",
                infor: "Information",
                name: "Name",
                phone: "Phone number",
                email: "Email",
                address: "Address",
                validate_type: "Bill type cannot be left blank",
                validate_bill: "Bill cannot be left blank",
                validate_stock: "Must select warehouse",
                validate_approver: "Must select approver",
                validate_customer: "Must select customer",
                validate_manufacturing_mills: "Must select mill",
                validate_lot: "Must select consignment",
                validate_quantity: "Must enter number of consignment",
                validate_quantity_rfid: "Must enter number of rfid",
                validate_norm: "Out of quantity of inventory",
                add_lot: "Add new consignment",
                expiration_date: "Expiration date",
                validate_norm: "Out of quantity of inventory",
                quantity_return: "quantity of return commodity",
                quantity_issue: "Quantity of issue commodity",
                bill_issued: "issued bill",
                choose_bill: "Select bill",
                users: "Users",
                add_success: "Add successfully",
                add_faile: "Add failed",
                edit_success: "Edit successfully",
                edit_faile: "Edit failed",

                // Phần liên quan lô sản xuất
                add_issue_product: "Thêm phiếu nhập sản phẩm",
                lot_information: "Consignment information",
                base_unit: "base unit",
                bill_info: "Product receipt bill information",
                quantity_billed: "Number of commodity that have not been created bill",
                bill_information: "Receipt bill",
                quantity_error: "Please enter quantity",
                quantity_error_input: "Quantity must be greater than 0",
                quantity_error_input_1:
                    "The quantity entered must not be greater than the quantity remaining in the lot",
                name_receiver: "Receiver name",
                email_receiver: "Receiver email",
                phone_receiver: "Receiver phone",
                address_receiver: "Receiver address",
                choose_stock_error: "Please select warehouse",
                choose_user: "Select user",
                error_name_receiver: "Receiver name cannot be empty",
                error_phone_receiver:
                    "Receiver phone number cannot be ",
                error_phone_receiver_input: "Phone number form invalid",
                choose_approvers: "Please select approvers",
                choose_accountables: "Please select accountables",
                chooos_reponsibles: "Please select responsibles",
                choose_all_lot:
                    "Please enter the total number of products in the consignment to create a receipt",
                create_product_bill_successfully:
                    "Add successfully",
                create_product_bill_failed: "Add failed",
                add_product_bill: "add product receipt bill",

                // Phần xuất kho nguyên vật liệu

                material_name: "Material name",
                material_code: "Material code",
                command_info: "Material information in work order",
                quantity_needed_bill: "The quantity has not been issued the vouchers yet",
                add_material_bill: "Add material receipt bill",
                create_material_bill_successfully: "Add successfully",
                create_material_bill_failed: "Add failed",
                bill_material_info: "Information of issue material bill",
                materials_in_bill: "List of material in bill",
                number_inventory: "Inventory",
                quality_control_staffs: "quantity control staffs",
                quality_control_staffs_error: "Please enter quantity control staff",
                quantity: "quantity",
                choose_material: "Select material",
                command_code: "Command code",
                mill_request: "Factory required",
                quantity_needed_true: "To approve the work order, please fill the issue bill full required quantity of materials!",
                lot_with_unit: "Lot (Lot code/ Quantity)",
                rfid_code: "RFID code",
                rfid_quantity: "Number products / 1 RFID",
                create_rfid_code: "Create RFID code",
                goods_returned_to_the_factory: "Goods returned to the factory",
                goods_returned_to_the_supplier: "Goods returned to the supplier",

            },
            inventory_management: {
                product: "Product",
                material: "Material",
                equipment: "Equipment",
                waste: "Waste",
                name: "Commodity name",
                stock: "Warehouse",
                index: "index",
                unit: "Unit",
                quantity: "Quantity of inventory",
                lot: "number of consignment ",
                lots: "Consignment",
                date: "Expiration date",
                search: "Search",
                good_code: "Commodity code",
                lot_code: "Index of consigment",
                description: "Description",
                history: "History",
                date_month: "Date, month",
                receipt: "Receipt",
                issue: "Issue",
                inventory: "Inventory",
                stock_card: "warehouse cart",
                lot_detail: "Detail of consigment",
                original_quantity: "Original quantity",
                type: "Type",
                number: "Number",
                bin: "Storage location",
                partner: "Partner",
                from_to: "From",
                status: "Status",
                note: "Note",
                bill: "Bill code",
                archive: "Storage location",
                bin_location: "Storage location",
                choose_bin: "Select storage location",
                choose_stock: "Select warehouse",
                choose_good: "Select commodity",
                total_stock: "Total of warehouse",
                number_over: "Quantity has exceeded inventory",
                validate_number: "Quantity cannot be empty",
                validate_total: "Quantity has exceeded inventory",
                number_over_norm: "The quantity has exceeded the storage quota",
                bin_contained: "The storage can only contain:",
                edit_title: "Edit consigment",
                edit_success: "Edit successfully",
                edit_faile: "Edit failed",
                get_lot_failed: "Get consigment failed",
                push_lot: "The consigment has not been placed in warehouse",
                text: "Commodity have not been placed in warehouse",
                add_lot: "Add consigment",
                select_lot: "Select consigment",
            },
        },

        // manage order
        manage_order: {
            tax: {
                index: "Index",
                code: "Code",
                name: "Name",
                creator: "Creator",
                status: "Status",
                tax_code: "Tax code",
                tax_name: "Tax name",
                choose_at_least_one_item: "Choose at least one item",
                percent_is_not_null: "Percent is not null",
                percent_greater_than_or_equal_zero:
                    "Percent greater than or equal to zero",
                add_new_tax: "Add new tax",
                add_successfully: "Add tax successfully",
                add_failed: "Add tax failed",
                description: "Description",
                goods: "Goods",
                select_goods: "Choose goods",
                tax_percent: "Percent",
                add: "Add new",
                reset: "Reset",
                action: "Action",
                version: "Version",
                effective: "Effective",
                expire: "Expire",
                tax_detail: "Tax detail",
                selected_all: "Sellected All",
                view_deatail: "View detail",
                delete_list_goods: "Delete list goods",
                delete_good: "Delete good",
                detail_goods: "Detail goods",
                search: "Search",
            },
        },

        report_manager: {
            search: "Search",
            add_report: "Add report",
            search_by_name: "Search by name",
            select_all_units: "Select all units",
            performer: "Performer",
            description: "Description",
            name: "Report Name",
            unit: "Unit",
            delete: "Are you sure you want to delete report:",
            confirm: "Confirm",
            cancel: "Cancel",
            edit: "Edit this report",
            title_delete: "Delete this report",
            creator: "Creator",
            no_data: "No data",
            search_by_name: "Search by name report",

            //message trả về từ server

            create_report_manager_success: "Create report success !",
            create_report_manager_faile: "Create report fail ! ",
            edit_report_manager_success: "Edit report success !",
            edit_report_manager_faile: "Edit report fail !",
            delete_report_manager_success: "Delete report success !",
            delete_report_manager_faile: "Delete report fail !",
        },

        // manage_plan
        manage_plan: {
            code: "Plan Code",
            planName: "Plan Name",
            search: "Search",
            add_plan: "Add Plan",
            index: "Index",
            description: "Description",
            edit: "Edit this plan",
            delete: "Delete this plan",
            delete_success: "Delete plan successfully!",
            delete_fail: "Delete plan fail!",
            add: "Add plan",
            add_title: "Add a new plan",
            add_success: "Add plan successfully!",
            add_fail: "Add plan fail!",
            plan_description: "Plan Description",
            edit_title: "Update a plan",
            edit_plan_success: "Update plan successfully!",
            edit_plan_fail: "Update plan fail!",
            detail_info_plan: "Detail infomation of plan",
        },

        // manage example
        manage_example: {
            exampleName: "Example Name",
            search: "Search",
            add_example: "Add Example",
            index: "Index",
            description: "Description",
            edit: "Edit this example",
            delete: "Delete this example",
            delete_success: "Delete example successfully!",
            delete_fail: "Delete example fail!",
            add: "Add example",
            add_title: "Add a new example",
            add_multi_example: "Add many new examples",
            add_one_example: "Add 1 new example",
            add_success: "Add example successfully!",
            add_fail: "Add example fail!",
            example_description: "Example Description",
            edit_title: "Update a example",
            edit_example_success: "Update example successfully!",
            edit_example_fail: "Update example fail!",
            detail_info_example: "Detail infomation of example",
        },

        footer: {
            copyright: "Copyright ",
            vnist:
                "Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
            version: "Version ",
        },

        manage_asset: {
            add_default: "Add default",
            add_default_title: "Add the default document",
            edit_file: "Edit attached documents",
            add_file: "Add attached documents",
            upload: "Upload",
        },

        // Quản lý sản xuất phần KHSX và LSX
        manufacturing: {
            manufacturing_works: {
                name: "Factory name",
                code: "Factory code",
                search: "Search",
                create_works: "Create new factory",
                index: "Index",
                worksManager: "Manager",
                foreman: "Foreman",
                mills: "Workshops",
                phone: "Phone number",
                address: "Address",
                status: "Status",
                description: "Description",
                view_detail: "Detail",
                edit: "Edit works",
                1: "Active",
                0: "Inactive",
                choose_worksManager: "---Choose manager---",
                worksManager_error: "Manager is required",
                choose_foreman: "---Choose foreman---",
                foreman_error: "Foreman is required",
                choose_status: "---Choose status---",
                status_error: "Status is required",
                create_successfully: "Create factory successfully",
                create_failed: "Create factory failed",
                detail_works: "Factory details",
                created_at: "Created at",
                list_mills: "List workshops",
                works_edit: "Edit workshop",
                works_detail: "Workshop details",
                edit_successfully: "Edit factory's information successfully",
                edit_failure: "Edit factory's information failed",
                mill_code: "Workshop code",
                mill_name: "Workshop name",
                organizational_unit: "Linked organization",
                choose_organizational_unit: "---Choose organization---",
                error_organizational_unit: "Linked organization is required",
                list_roles: "Unit manager ",
                manage_roles: "Add manager",
                role_manages_another: "Another manager",
                no_roles: "No role ",
            },
            manufacturing_mill: {
                name: "Workshop name",
                code: "Workshop code",
                search: "Search",
                index: "Index",
                worksName: "Factory",
                description: "Description",
                status: "Status",
                create_mill: "Create new workshop",
                create_manufacturing_mill: "Create new workshop",
                create_mill_successfully: "Create new workshop successfully",
                create_mill_failed: "Create new workshop failed",
                works: "Factory",
                choose_works: "---Choose factory---",
                worksValue_error: "Factory is required",
                delete_mill: "Delete workshop",
                1: "Active",
                0: "Inactive",
                mill_detail: "Workshop details",
                mill_edit: "Edit workshop",
                choose_status: "---Choose status---",
                status_error: "Status is required",
                edit_mill_successfully: "Edit information successfully",
                edit_mill_failed: "Edit information failed",
                works_name: "Factory name",
                created_at: "Create at",
                team_leader: "Leader",
                choose_team_leader: "---Choose leader---",
                team_leader_error: "Leader is required",
            },
            purchasing_request: {
                code: "Purchase requestion code",
                createdAt: "Created at",
                planCode: "Plan code",
                command_code: "Command code",
                receiveTime: "Receive time",
                status: "Status",
                creator: "Creator",
                index: "Index",
                select_all: "Select all",
                1: { content: "Pending", color: "orange" },
                2: { content: "Proccessed", color: "green" },
                3: { content: "Canceled", color: "red" },
                search: "Search",
                select_status: "Select status",
                add_purchasing_request_button: "Add purchase requestion",
                add_purchasing_request: "Add purchase requestion",
                create_successfully: "Add purchase requestion successfully",
                create_failed: "Add purchase requestion failed",
                description: "Description",
                good_code: "Good code",
                good_name: "Good nane",
                good_base_unit: "Good base unit",
                quantity: "Quantity",
                delete_good: "Delete",
                material_info: "Material's information",
                choose_material: "---Choose material---",
                material_code: "Material code",
                error_good: "Material is required",
                error_description: "Description is required",
                error_quantity: "Quantity is required",
                cancel_editing_good: "Cancel",
                save_good: "Save",
                add_good: "Add",
                delete_good: "Delete all",
                error_quantity_input: "Quantity is not available",
                purchasing_request_detail: "Purchase requestion details",
                material_detail: "Material details",
                purchasing_request_edit: "Edit purchase requestion",
                edit_successfully: "Edit purchase requestion successfully",
                edit_failed: "Edit purchase requestion failed",
                cancel_purchasing_request: "Cancel purchase requestion",
                number_purchasing_status: "Number of purchasing requestion by status"
            },

        },

        manage_transport: {
            transportRequirement: {
                add_requirements: "Add a new transport requirement",
                add_success: "Created new transport requirement",
                add_fail: "Create new transport requirement fail",
                edit_success: "Edited transport requirement",
                edit_fail: "Edit transport requirement fail",
                delete_success: "Deleted transport requirement",
                delete_fail: "Delete transport requirement fail",
            },
            transportPlan: {
                add_success: "Created new transport plan",
                add_fail: "Create new transport plan fail",
                edit_success: "Edited transport plan",
                edit_fail: "Edit transport plan fail",
                delete_success: "Deleted transport plan",
                delete_fail: "Delete transport plan fail",
            },
            transportCommand: {
                edit_success: "Edited transport command",
                edit_fail: "Edit transport command fail",
            },
            transportVehicle: {
                add_success: "Added vehicle success",
                add_fail: "Add vehicle fail",
                edit_success: "Edited vehicle status",
                edit_fail: "Edit vehicle status fail",
            },
            transportDepartment: {
                add_success: "Added transport department success",
                add_fail: "Add transport department fail",
                delete_success: "Deleted transport department",
                delete_fail: "Delete transport department fail",
            }
        },

        // Quản lý dự án
        project: {
            code: "Project code",
            name: "Project name",
            startDate: "Start date",
            endDate: "End date",
            parent: "Parent project",
            manager: "Manager",
            member: 'Members',
            detail_link: 'Link of project',
            estimatedTime: 'Estimated time to finish',
            estimatedCost: 'Estimated cost for project',
            unitTime: 'Unit of time',
            unitCost: 'Unit of cost',
            description: "Description",
            add_title: "Add new project",
            detail_title: "Project details",
            edit_title: "Project edit",
            add_btn_from_excel: "Choose from excel file",
            add_btn_new: "Add new project",
            add_btn_normal: "Add by hand",
            add_btn_scheduling: "Add by scheduling",
            add_btn_task: 'Add new task',
            delete: 'Delete this project',
            list_tasks: 'List of tasks',
            role: 'Project role',
            creator: 'Project creator',

            // Thông báo trả về từ server
            get_task_project_success: 'Get project success',
            get_task_project_fail: 'Get project fail',
            show_task_project_success: 'Show project success',
            show_task_project_fail: 'Show project fail',
            create_task_project_success: 'Create project success',
            create_task_project_fail: 'Create project fail',
            edit_task_project_success: 'Edit project success',
            edit_task_project_fail: 'Edit project fail',
            delete_task_project_success: 'Delete project success',
            delete_task_project_fail: 'Delete project fail',
            get_members_with_score_success: 'Get members with score success',
            get_members_with_score_fail: 'Get members with score fail',
            get_list_tasks_eval_success: 'Get evaluations of tasks success',
            get_list_tasks_eval_fail: 'Get evaluations of tasks fail',
            get_salary_members_success: 'Get salary of members success',
            get_salary_members_fail: 'Get salary of members fail',
            create_project_change_request_success: 'Create change request for project success',
            create_project_change_request_fail: 'Create change request for project fail',
            get_list_project_change_requests_success: 'Get list of change requests success',
            get_list_project_change_requests_fail: 'Get list of change requests fail',
            update_status_project_change_request_success: 'Update status of change request success',
            update_status_project_change_request_fail: 'Update status of change request fail',
            update_list_project_change_requests_success: 'Update list of change requests success',
            update_list_project_change_requests_fail: 'Update list of change requests fail',

            task_management: {
                estimate: "Estimating",
                add_err_time_cost: "Time & Cost must be numeric and greater or equal than 0",
                end_date: "Estimated end date",

                // unit time and cost
                timeAndCost: "Time & Cost for Project scheduling",
                estimatedTime: "Estimated time",
                estimatedTimeNormal: "Normal",
                estimatedTimePessimistic: "Worst",
                estimatedTimeOptimistic: "Best",
                estimatedCost: "Estimated cost",
                estimatedCostNormal: "Normal",
                estimatedCostMaximum: "Maximum",

                preceedingTask: "Preceeding task",
            },

            unit: {
                days: 'Ngày',
                hours: 'Giờ',
            },

            schedule: {
                taskCode: 'Task code',
                taskName: 'Task name',
                preceedingTasks: "Preceeding tasks",
                estimatedTime: "Estimated time",
                estimatedTimePessimistic: "Worst estimated time",
                estimatedTimeOptimistic: "Best estimated time",
                estimatedCostNormal: "Estimated cost",
                estimatedCostMaximum: "Maximum estimated cost",
                slack: 'Slack time',
                criticalPath: 'Critical path',
                calculateCPM: 'Calculate CPM',
                showTableCPM: 'Show table CPM',
                hideTableCPM: 'Hide table CPM',
                insertListTasksToDB: 'Insert tasks list to database',
                calculateRecommend: 'Calculate recommendation',
                percentFinishTask: 'Percentage of finishing project in',
            },
            eval: {
                undefined: 'Nếu costPerformanceIndex không tính được (mẫu số actualCost = 0 HOẶC costPerformanceIndex = Infinity): Điểm = Chưa tính được',
                level1: 'Nếu realDuration = 0 HOẶC costPerformanceIndex < 0.5: Điểm = 0',
                level2: 'Nếu 0.5 <= costPerformanceIndex < 0.75: Điểm = 40',
                level3: 'Nếu 0.75 <= costPerformanceIndex < 1: Điểm = 60',
                level4: 'Nếu 1 <= costPerformanceIndex < 1.25: Điểm = 80',
                level5: 'Nếu 1.25 <= costPerformanceIndex < 1.5: Điểm = 90',
                level6: 'Nếu 1.5 <= costPerformanceIndex: Điểm = 100',
            },

            report: {
                title: 'Detailed project report'
            }
        },
        phase: {
            projectCodeName: 'Project codename',
            fullName: 'Phase name',
            progress: 'Progress',
            listTasks: 'List of tasks',
            duration: 'Duration',
            add_btn_new: "Add new phase",
        },
    },
};
