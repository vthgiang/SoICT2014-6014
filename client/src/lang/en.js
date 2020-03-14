export default {
    locale: 'en',
    messages: {
        not_found: '404! Not found this page',
        language: 'Language setting',
        alert: {
            log_again: 'Error! Log in again!',
            access_denied: 'Access denied! Log in again!',
            role_invalid: 'Log in again!',
            page_access_denied: 'Log in again!',
            user_role_invalid: 'Log in again!',
            acc_logged_out: 'Log in again!'
        },
        auth: {
            login: 'Login',
            logout: 'Logout',
            logout_all_account: 'Log out all account',
            profile: 'Profile',
        },

        confirm: {
            yes: 'YES',
            no: 'NO',
            no_data: 'No data',
            field_invalid: "Input field invalid. Please check again!",
        },

        form: {
            property: 'Property : ',
            required: 'Information fields required',
            save: 'Save',
            close: 'Close',
            email: 'Email',
            password: 'Password',
            newPassword: 'New password',
            confirm: 'Confirm password',
            description: 'Description',
            resetPassword: 'Reset password user account',
            forgotPassword: 'I forgot my password ?',
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
        },
        modal: {
            update: 'Save',
            close: 'Close',
            create: 'Add new',
            note: 'Required fields',
        },
        page: {
            unit: 'Unit',
            position: 'Position',
            month: 'Month',
            status: 'Status',
            staff_number: 'Staff code',
            add_search: 'Search',
            number_decisions: 'Decisions number',
            add_success: 'Add new success'
        },

        menu: {
            home: 'Home page',
            manage_system: 'Manage System',
            manage_company: 'Manage Company',
            manage_department: 'Manage Departments',
            manage_user: 'Manage Users',
            manage_role: 'Manage Roles',
            manage_page: 'Manage Pages',
            manage_component: 'Manage ComponentUI',
            manage_document: 'Manage Documents',

            tasktemplate: 'Task Template',
            cocautochuc: 'Organizational Structure',
            taskmanagement: 'Task Management',
            manageDocument: 'Manage Document',
            manage_employee: 'Manage Staffs',
            manage_training: 'Manage Training',
            account: 'Account',
            manage_unit:'manage units',
            add_employee: 'Add New Staffs',
            list_employee: 'Manage Staffs Information',
            detail_employee: 'Personal Information',
            update_employee: 'Update Personal Information',
            dashboard_employee: 'DashBoard Manage Staffs ',
            discipline: 'Manage Reward And Discipline',
            sabbatical: 'Manage Leave',
            salary_employee: 'Manage Salary',
            time_keeping: 'Attendance Staff',
            list_course: 'Training Programs',
            training_plan: 'Manage Training Courses',

            manage_kpi: 'Manage KPI',
            kpi_unit: 'Unit KPI',
            kpi_unit_create: 'Create unit KPI',
            kpi_unit_evaluate: 'Evaluate unit KPI',
            kpi_unit_overview: 'Overview unit KPI',
            kpi_personal: 'Personal KPI',
            kpi_personal_create: 'Create personal KPI',
            kpi_personal_evaluate: 'Evaluate personal KPI',
            kpi_personal_overview: 'Overview personal KPI',

            notifications: 'Notifications',
        },

        manage_system: {
            turn_on: 'Turn on',
            turn_off: 'Turn off',
            log: 'Log state of user request'
        },

        manage_company: {
            add: 'Add',
            add_title: 'Add new company',
            name: 'Company \'s name',
            short_name: 'Company \'s short name',
            description: 'Company \'s description',
            on_service: 'Turn on service',
            off_service: 'Turn off service',
            turning_on: 'Turning on the service',
            turning_off: 'Turning off the service',
            info: 'Company \'s information',
            edit: 'Edit company \'s information',
            super_admin: "SuperAdmin \'s email of company",
        },

        manage_department: {
            zoom_out: 'Zoom Out',
            zoom_in: 'Zoom In',
            add: 'Add',
            add_title: 'Add new department',
            info: 'Department Information',
            name: 'Department \'s name',
            description: 'Department \'s description',
            parent: 'Parent of Department',
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
            info: 'Role \'s information',
            name: 'Role \'s name',
            extends: 'Extends of',
            users: 'Users has role',
            edit: 'Edit role \'s information',
            delete: 'Delete role',
            add_success: 'Add new role successfully',
            add_faile: 'Add new role failed',
            edit_success: 'Edit role successfully',
            edit_faile: 'Edit role failed'
        },

        manage_user: {
            add: 'Add',
            add_title: 'Add new user/account',
            info: 'User/Account \'s information',
            edit: 'Edit User/Account \'s information',
            disable: 'Disable',
            enable: 'Enable',
            delete: 'Delete user',
            add_success: 'Add new user successfully',
            add_faile: 'Add new user failed',
            edit_success: 'Edit user successfully',
            edit_faile: 'Edit user failed'
        },

        manage_page: {
            add: 'Add',
            add_title: 'Add new link for page',
            url: 'Link of page',
            description: 'Description of page',
            roles: 'Roles can access this page',
            info: 'Page \'s information',
            edit: 'Edit page \'s information',
            delete: 'Delele link',
            add_success: 'Add successfully',
            add_faile: 'Add falied!',
            edit_success: 'Edit successfully!',
            edit_faile: 'Edit failed!',
        },

        manage_component: {
            add: 'Add',
            add_title: 'Add new component',
            info: 'Component \'s information',
            edit: 'Edit component \'s information',
            delete: 'Delete component',
            roles: 'Roles have privilege to component',
            add_success: 'Add successfully',
            add_faile: 'Add falied!',
            edit_success: 'Edit successfully!',
            edit_faile: 'Edit failed!',
        },
        salary_employee: {
            list_salary: 'List of staff salary',
            add_salary: 'Add salary',
            add_salary_title: 'Add salary',
            infor_salary: 'Salary information',
            delete_dalary: 'Delete salary',
            add_by_hand: 'Add by hand',
            add_import: 'Import file excel',
            add_by_hand_title: 'Add by hand',
            add_import_title: 'Import file excel',
            main_salary: 'Main salary',
            other_salary: 'Other salary',
            name_salary: 'Name salary',
            money_salary: 'Money',
            add_new_salary: 'Add new salary',
            check_null_msnv: 'Staff code required',
            check_msnv: 'Not find staff code',
            check_main_salary: 'Main salary required',
            check_month: 'Month required',
        },
        sabbatical: {
            list_sabbatical: 'List of staff sabbatical',
            add_sabbatical: 'Add sabbatical',
            add_sabbatical_title: 'Add new sabbatical',
            infor_sabbatical: 'Sabbatical information',
            delete_sabbatical: 'Delete sabbatical',
            start_date: 'Start day',
            end_date: 'End day',
            reason: 'Reason',
            check_null_msnv: 'Staff code required',
            check_msnv: 'Not find staff code',
            check_start_day: 'Start day required',
            check_end_day: 'End day required',
            check_reason: 'Reason required',
            check_status: 'Status required',
        },
        discipline: {
            list_discipline: 'List of staff discipline',
            list_discipline_title: 'List of staff discipline',
            add_discipline: 'Add discipline',
            add_discipline_title: 'Add new discipline',
            infor_discipline: 'Discipline information',
            delete_discipline: 'Delete discipline',
            start_date: 'Effective date',
            end_date: 'Expiration date',
            discipline_forms: 'Discipline forms',
            reason_discipline: 'Reason',
            check_null_msnv: 'Staff code required',
            check_msnv: 'Not find staff code',
            check_number: 'Decisions number required',
            check_unit: 'Decision unit required',
            check_start_day: 'Effective date required',
            check_end_day: 'Expiration date required',
            check_reason_discipline: 'Reason required',
            check_type_discipline: 'Discipline forms required',
            list_praise: 'List of staff reward',
            list_praise_title: 'List of staff reward',
            add_praise: 'Add reward',
            add_praise_title: 'Add new reward',
            infor_praise: 'Reward information',
            delete_praise: 'Delete reward',
            decision_day: 'Decision day',
            decision_unit: 'Decision unit',
            reward_forms: 'Reward forms',
            reason_praise: 'Reason',
            check_start_date: 'Decision day required',
            check_reason_praise: 'Reason required',
            check_type_praise: 'Reward forms required',
        },
        manage_employee: {
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
            relationship: 'Relationship',
            single: 'Single',
            married: 'Married',
            upload: 'Upload',
            id_card: 'ID card',
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
            master_degree: "Master\'s degree",
            phd: 'Ph.D',
            unavailable: 'Unavailable',
            work_experience: 'Work experience',
            unit: 'Unit',
            from_month_year: 'From month/year',
            to_month_year: 'To month/year',

            diploma: 'Diploma',
            certificate: 'Certificate',
            name_diploma: 'Name of diploma',
            name_certificate: 'Name of certificate',
            diploma_issued_by: 'Issued_by',
            graduation_year:'Graduation year',
            ranking_learning:'Ranking of learning',
            attached_files:'Attached files',
            end_date_certificate: 'Expiration date',

            bank_account: 'Bank account',
            personal_income_tax:'Personal income tax',
            account_number: 'Account number',
            bank_name: 'Bank name',
            bank_branch: 'Bank branch',
            tax_number:'Tax number',
            representative:'Representative',
            day_active:'Day active',
            managed_by:'Managed by',

            labor_contract:'Labor contract',
            training_process:'Training process',
            name_contract: 'Contract name',
            type_contract: 'Type of contract',
            start_date: 'Effective date',
            course_name:'Course name',
            start_day: 'Start day',
            end_date: 'End day',
            type_education:'Type of education',
            cost:'Cost',

            list_attachments:'List of attached documents',
            attachments_code: 'Attachments code',
            file_name:'File name',
            number:'Number',
            add_default:'Add default',
            add_default_title:'Add the default document',

            Reward:'Reward',
            discipline: 'Discipline',
            historySalary:'History of salary',
            sabbatical:'sabbatical information'
        },
        holiday: {
            start_date: 'Start day',
            end_Date: 'End day',
            description: 'Description',
            check_start_Date: 'Start day required',
            check_end_Date: 'End day required',
            check_description: 'Description required'
        },

        notification: {
            add: 'Thêm mới',
            add_title: 'Thêm thông báo mới',
            add_success: 'Tạo thông báo mới thành công',
            add_faile: 'Tạo thông báo thất bại',
            edit_success: 'Chỉnh sửa thông báo thành công',
            edit_faile: 'Chỉnh sửa thông báo thất bại'
        },
        
        footer: {
            copyright: 'Copyright ',
            vnist: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
            version: 'Version '
        }
    }
}