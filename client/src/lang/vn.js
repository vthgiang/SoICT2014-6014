export default {
    locale: "vn",
    messages: {
        /*******************************************************
         * CHUẨN HÓA FILE NGÔN NGỮ PHÂN CHIA THEO TỪNG MODULE
         * @general những phần ngôn ngữ dùng chung cho mọi module
         * @module_name phần tự định nghĩa ngôn ngữ riêng của từng module khác nhau
         *******************************************************/
        general: {
            show: "Hiển thị ",
            table: "Bảng",
            scroll: "Dùng thanh cuộn bảng",
            upload: "Tải lên",
            pick_image: "Chọn ảnh",
            crop: "Cắt ảnh",
            action: "Hành động",
            name: "Tên",
            description: "Mô tả",
            search: "Tìm kiếm",
            add: "Thêm",
            edit: "Sửa",
            delete: "Xóa",
            delete_option: "Xóa lựa chọn",
            save: "Lưu",
            close: "Đóng",
            accept: "Xác nhận",
            cancel: "Hủy",
            status: "Trạng thái",
            month: "Tháng",
            year: "Năm",
            yes: "Có",
            no: "Không",
            loading: "Đang tải dữ liệu",
            no_data: "Không có dữ liệu",
            success: "Thành công",
            error: "Lỗi",
            stt: 'STT',
            new_notification: "Bạn có thông báo mới!",
            month: "tháng",
            value: "Giá trị",
            export: "Xuất",
            add_tag: "Thêm tag",
            auth_alert: {
                title:
                    "Hệ thống xác nhận có lỗi xảy ra trong phiên làm việc của bạn!",
                reason: "Nguyên nhân:",
                content: [
                    "Phiên làm việc đã hết hạn",
                    "Truy cập không hợp lệ",
                    "Phân quyền hiện tại của bạn không được phép truy cập vào trang này",
                    "Phân quyền của bạn không hợp lệ",
                    "Phân quyền của bạn đã được quản lý thay đổi",
                    "Token của bạn không hợp lệ",
                    "Dịch vụ cho công ty không còn hoạt động",
                ],
            },
            server_disconnect: "Kết nối tới máy chủ thất bại",
            check_connect_again: "kiểm tra lại kết nối tới máy chủ",
            validate: {
                invalid_character_error:
                    "Giá trị không được chứa ký tự đặc biệt",
                length_error: "Giá trị phải có số ký tự từ {min} đến {max}",
                minimum_length_error:
                    "Giá trị phải có độ dài tối thiểu là {min} ký tự",
                maximum_length_error: "Giá trị có độ dài không quá {max} ký tự",
                invalid_error: "Giá trị không hợp lệ",
                empty_error: "Giá trị không được để trống",
                not_existing_error: "Giá trị không tồn tại",
                existing_error: "Giá trị đã tồn tại",
                number_input_error: "Giá trị phải từ {min} đến {max}",
                number_input_error_min: "Giá trị phải lớn hơn {min}",
                number_input_error_max: "Giá trị phải nhỏ hơn {max}"
            },
            not_org_unit: "Bạn chưa có đơn vị",
            not_select_unit: "Chọn đơn vị",
            list_unit: "Danh sách đơn vị",
            list_employee: "Danh sách nhân viên",
            detail: "Chi tiết",
            select_all: "Chọn tất cả",
            add_import: "Thêm dữ liệu từ file",
        },

        dashboard_unit: {
            urgent_chart: "Công việc khẩn cấp",
            need_to_do_chart: "Công việc cần làm",
            urgent_task_amount: "Số công việc khẩn cấp",
            need_to_do_task_amount: "Số công việc cần làm",
            list_employe_timing: "Danh sách nhân viên đang bấm giờ",
            statistics_task_unit: "Biểu đồ thống kê điểm công việc",
            get_all_unit_dashboard_data_success: "Lấy dữ liệu bảng tin doanh nghiệp thành công",
            get_all_unit_dashboard_data_fail: "Lấy dữ liệu bảng tin doanh nghiệp thất bại",
        },

        menu: {
            home: "Trang chủ",
            system_administration: "Quản trị hệ thống",
            manage_configuration: "Cấu hình hệ thống",
            manage_system: "Sao lưu phục hồi",
            manage_company: "Doanh nghiệp",
            manage_role: "Quản lý phân quyền",
            manage_link: "Quản lý trang",
            manage_component: "Quản lý phân quyền trên các trang",
            manage_api: "Quản lý API",
            registration_api: "Quản lý đăng ký API",
            registration_api_employee: "Đăng ký sử dụng API",
            privilege_api: "Quản lý phân quyền API",

            manage_department: "Quản lý cơ cấu tổ chức",
            manage_user: "Quản lý người dùng",

            manage_document: "Quản lý tài liệu văn bản",
            documents_og: "Quản lý tài liệu văn bản đơn vị",
            documents: "Tài liệu văn bản",

            customer_Management: "Quản lý khách hàng",
            crm_list: {
                dashboard: "Bảng tin quản lý khách hàng",
                dashboardUnit: "Bảng tin đơn vị quản lý khách hàng",
                customer: "Quản lý thông tin khách hàng",
                lead: "Khách hàng thân thiết",
                care: "Hoạt động chăm sóc khách hàng",
                group: "Nhóm khách hàng",
                statistic: "Thống kê",
                generalConfiguration: "Cấu hình hoạt động chăm sóc khách hàng",
                evaluation: "Đánh giá hoạt động CSKH",
                crmUnitConfiguration: "Cấu hình đơn vị chăm sóc khách hàng"
            },

            task_template: "Mẫu Công Việc",
            taskmanagement: "Quản Lý Công Việc",
            task_management_unit: "Công việc đơn vị",
            manageDocument: "Quản lý văn bản",
            manageDocumentType: "Quản lý loại văn bản",

            leave_application: "Quản lý đơn xin nghỉ đơn vị",
            manage_employee: "Quản lý nhân sự",
            manage_work_plan: "Quản lý kế hoạch làm việc",
            manage_training: "Quản lý đào tạo",
            account: "Tài khoản",
            annual_leave_personal: "Xin nghỉ phép",
            manage_unit: "Quản lý nhân sự các đơn vị",
            add_employee: "Thêm nhân viên",
            list_employee: "Quản lý thông tin nhân viên",
            detail_employee: "Thông tin cá nhân",
            update_employee: "Cập nhật thông tin cá nhân",
            dashboard_employee: "Bảng tin quản lý nhân sự",
            employee_time_sheet_log: "Thống kê bấm giờ nhân sự",
            dashboard_personal: "Bảng tin cá nhân",
            dashboard_unit: "Bảng tin đơn vị",
            dashboard_all_unit: "Bảng tin doanh nghiệp",
            employee_capacity: "Năng lực nhân viên",
            discipline: "Quản lý khen thưởng - kỷ luật",
            annual_leave: "Quản lý nghỉ phép",
            manage_field: "Quản lý ngành nghề/lĩnh vực",
            salary_employee: "Quản lý lương nhân viên",
            time_keeping: "Chấm công nhân viên",
            list_education: "Chương trình đào tạo bắt buộc",
            training_plan: "Quản lý khoá đào tạo",
            training_plan_employee: "Thông tin đào tạo",
            list_major: "Danh sách chuyên ngành",
            list_career_position: "Danh sách vị trí công việc",
            list_search_for_package: "Tìm kiếm nhân sự gói thầu",

            employee_unit: "Nhân sự đơn vị",
            employee_infomation: "Thông tin nhân viên",

            manage_warehouse: "Quản lý kho",
            dashboard_bill: "Bảng tin quản lý các phiếu",
            dashboard_inventory: "Bảng tin quản lý hàng tồn",
            stock_management: "Quản lý thông tin kho",
            bin_location_management: "Quản lý thông tin lưu kho",
            category_management: "Quản lý danh mục hàng hóa",
            good_management: "Quản lý hàng hóa",
            partner_management: "Quản lý đối tác",
            proposal_management: "Quản lý phiếu đề nghị",
            bill_management: "Quản lý thông tin phiếu",
            inventory_management: "Quản lý lô hàng",

            manage_kpi_unit: "KPI đơn vị",
            manage_kpi_personal: "KPI cá nhân",
            kpi_unit_create: "Khởi tạo KPI đơn vị",
            kpi_unit_create_for_admin: "Khởi tạo KPI toàn công ty",
            kpi_unit_evaluate: "Dữ liệu KPI đơn vị",
            kpi_unit_overview: "Tổng quan KPI đơn vị",
            kpi_unit_dashboard: "Dashboard KPI đơn vị",
            kpi_unit_statistic: "Phân tích tính hợp lý trong thiết lập KPI đơn vị",
            kpi_unit_manager: "Quản lý KPI đơn vị",
            kpi_member_manager: "Đánh giá KPI nhân viên",
            kpi_member_dashboard: "DashBoard KPI nhân viên",
            kpi_personal_create: "Khởi tạo KPI cá nhân",
            kpi_personal_evaluate: "Dữ liệu KPI cá nhân",
            kpi_personal_overview: "Tổng quan KPI cá nhân",
            kpi_personal_dashboard: "Dashboard KPI cá nhân",
            kpi_personal_manager: "Quản lí KPI cá nhân",
            kpi_member_detail: "Chi tiết KPI cá nhân",

            notifications: "Thông báo",

            tasks: "Công việc cá nhân",
            task: "Chi tiết công việc",
            process_template: "Chi tiết quy trình công việc mẫu",
            task_management: "Danh sách công việc cá nhân",
            task_management_of_unit: "Danh sách công việc đơn vị",
            task_management_dashboard: "Dashboard công việc cá nhân",
            task_organization_management_dashboard:
                "Dashboard công việc đơn vị",
            task_management_process: "Danh sách quy trình",
            task_process_template: "Mẫu quy trình",
            all_time_sheet_log: '-------',
            personal_time_sheet_log: 'Thống kê bấm giờ',

            //*******START */
            // Quản lý tài sản
            // QUẢN LÝ

            add_update_asset: "Thêm - Cập nhật tài sản",
            add_asset_title: "Thêm mới tài sản - Cập nhật tài sản",
            add_asset: "Thêm tài sản",
            update_asset: "Cập nhật tài sản",
            manage_repair_asset: "Quản lý sửa chữa, thay thế",
            manage_usage_asset: "Quản lý sử dụng tài sản",
            manage_distribute_asset: "Quản lý cấp phát, điều chuyển",
            manage_room_asset: "Quản lý phòng & trang thiết bị",
            manage_crash_asset: "Quản lý sự cố tài sản",

            manage_asset: "Quản lý tài sản",
            dashboard_asset: "DashBoard quản lý tài sản",
            manage_type_asset: "Quản lý loại tài sản",
            manage_info_asset: "Quản lý thông tin tài sản",
            manage_info_asset_lot: "Quản lý thông tin lô tài sản",
            manage_maintainance_asset: "Quản lý bảo trì-sửa chữa",
            manage_depreciation_asset: "Quản lý khấu hao tài sản",
            manage_incident_asset: "Quản lý sự cố tài sản",
            manage_recommend_procure: "Quản lý đề nghị mua sắm",
            manage_recommend_distribute_asset: "Quản lý đăng ký sử dụng",
            employee_manage_asset_info: "Tài sản quản lý",
            //loo tai san
            add_asset_lot: "Thêm mới lô tài sản",
            add_asset_lot_title: "Thêm mới lô tài sản - Cập nhật lô tài sản",
            add_update_asset_lot: "Thêm - Cập nhật lô tài sản",

            view_building_list: "Xem danh sách mặt bằng",

            // NHÂN VIÊN
            recommend_equipment_procurement: "Đăng ký mua sắm tài sản",
            recommend_distribute_asset: "Đăng ký sử dụng tài sản",
            manage_assigned_asset: "Tài sản sử dụng",
            //******END */

            /**Quản lý vật tư */
            manage_supplies: "Quản lý vật tư",
            dashboard_supplies: "Dashboard quản lý vật tư",
            manage_supplies_infor: "Quản lý thông tin vật tư",
            manage_supplies_purchase_request: "Quản lý yêu cầu mua vật tư",
            manage_allocation_history: "Quản lý lịch sử cấp phát",
            manage_purchase_invoice: "Quản lý hóa đơn mua vật tư",
            recommend_supplies_procurement: "Đăng kí cấp vật tư",

            add_supplies: "Thêm mới vật tư",
            add_purchase_invoice: "Thêm mới hóa đơn",
            add_allocation: "Thêm lịch sử cấp phát",




            // QUẢN LÝ BÁO CÁO
            report_management: "Quản lý báo cáo",
            task_report: "Quản lý báo cáo công việc",

            //QUẢN LÝ ĐƠN HÀNG
            manage_orders: "Quản lý đơn hàng",
            manage_sales_order: "Đơn bán hàng",
            manage_purchase_order: "Đơn mua nguyên vật liệu",
            manage_sales_order_dashboard: "Thống kê bán hàng",
            manage_quote: "Báo giá",
            manage_discount: "Giảm giá",
            manage_tax: "Thuế",
            manage_sla: "Cam kết chất lượng",
            manage_business_department: "Phân vai trò đơn vị kinh doanh",
            manage_payment: "Quản lý thu chi",
            manage_bank_account: "Quản lý thông tin tài khoản ngân hàng",

            // Quản lý kế hoạch sản xuất
            manage_plans: "Quản lý kế hoạch sản xuất",
            //VÍ DỤ EXAMPLE
            manage_examples: "Ví dụ CRUD",
            manage_examples_1: "CRUD theo mô hình số 1",
            manage_examples_2: "CRUD theo mô hình số 2",
            manage_examples_hooks_1: "CRUD Hooks theo mô hình 1",
            manage_examples_hooks_2: "CRUD Hooks theo mô hình 2",
            manage_examples_3: "CRUD theo mô hình số 3",
            manage_examples_hooks_3: "CRUD Hooks theo mô hình 3",

            // Quản lý sản xuất
            manage_manufacturing: "Quản lý sản xuất",
            manage_manufacturing_plan: "Quản lý kế hoạch sản xuất",
            manage_manufacturing_command: "Quản lý lệnh sản xuất",
            manage_work_schedule: "Quản lý lịch sản xuất",
            manage_purchasing_request:
                "Quản lý phiếu đề nghị mua hàng",
            manufacturing_dashboard: "Dashboard Quản lý sản xuất",
            analysis_manufacturing_performance: "Phân tích hiệu suất sản xuất",
            manage_manufacturing_works: "Quản lý nhà máy sản xuất",
            manage_manufacturing_mill: "Quản lý xưởng sản xuất",
            manage_manufacturing_lot: "Quản lý lô sản xuất",
            request_management: "Quản lý đề nghị",

            // Quản lý dự án
            manage_project: "Quản lý dự án",
            projects_list: 'Danh sách dự án',
            project_details: 'Chi tiết dự án',
            tasks_list: 'Danh sách công việc',
            phases_list: 'Danh sách giai đoạn',
            issues_list: 'Danh sách vấn đề',
            project_report: 'Báo cáo dự án',
            project_evaluation: 'Thống kê đánh giá',

            // Quản lý vận chuyển
            manage_transport: "Quản lý vận chuyển",
            manage_transport_requirements: "Yêu cầu vận chuyển",
            manage_transport_plan: "Kế hoạch vận chuyển",
            manage_transport_schedule: "Lệnh vận chuyển",
            manage_transport_vehicle: "Phương tiện vận chuyển",
            manage_transport_route: "Hành trình vận chuyển",
            manage_transport_department: "Phân vai trò đơn vị vận chuyển",
            carrier_today_transport_mission: "Nhiệm vụ vận chuyển",
            carrier_all_times_transport_mission: "Nhiệm vụ vận chuyển mỗi ngày",



            user_guide: "Hướng dẫn sử dụng",
            user_guide_detail: "Chi tiết hướng dẫn sử dụng",
        },

        news_feed: {
            news_feed: 'Tin tức'
        },

        intro: {
            title: "Giải pháp không gian làm việc số cho doanh nghiệp",
            contents: [
                "Môi trường làm việc số thân thiện và thuận tiện cho mọi nhân viên",
                "Hỗ trợ lãnh đạo, quản lý các cấp theo dõi điều hành công việc thông qua hệ thống dashboard",
                "Đánh giá KPI linh hoạt chính xác",
                "Cơ chế giao việc thuận tiện, tối ưu giúp giảm bớt thời gian, số hóa toàn diện các quy trình nghiệp vụ của doanh nghiệp trên môi trường làm việc số",
                "Tiết kiệm chi phí đầu tư",
                "Dữ liệu hệ thống an toàn và bảo mật",
                "Hỗ trợ khách hàng 24/7",
            ],
            auth: {
                signin: "Đăng nhập",
                signout: "Đăng xuất",
                start: "Bắt đầu",
            },
            service: {
                title: "Các giải pháp về quản lý trong doanh nghiệp",
                content:
                    "Chúng tôi phục vụ các công ty vừa và nhỏ trong tất cả các ngành liên quan đến công nghệ với các dịch vụ chất lượng cao được trình bày dưới đây",
                kpi: {
                    title: "Quản lý KPI",
                    content: "Tự động, khoa học và minh bạch",
                    detail:
                        "Quản lý KPI tự động, khoa học, minh bạch: Hệ thống cung cấp các cách tính KPI tự động, người dùng có thể tự customize công thức tính KPI tùy thuộc vào lĩnh vực của từng bộ phận/đơn vị.",
                },
                task: {
                    title: "Quản lý công việc",
                    content:
                        "Cơ chế giao việc và nhận việc tiện lợi, tiết kiệm thời gian, hỗ trợ người dùng tập trung vào công việc",
                    detail:
                        "Quản lý công việc không theo quy trình với cơ chế giao việc và nhận việc tiện lợi, tiết kiệm thời gian làm việc, hỗ trợ người dùng tập trung vào công việc. Quản lý công việc theo quy trình: Hỗ trợ người dùng nắm bắt được hiện trạng các công việc, từ đó người quản lý có những phương án tổ chức công việc phù hợp, hiệu quả, đúng lúc. Cơ chế giao việc và nhận việc được thực hiện dễ dàng, tiết kiệm thời gian. Giúp người dùng tập trung hơn trong công việc.",
                },
                document: {
                    title: "Quản lý tài liệu",
                    content:
                        "Hỗ trợ quản lý tập trung tài liệu, thuận tiện cho việc tra cứu",
                    detail:
                        "Quản lý tài liệu là công việc lưu trữ, phân loại dữ liệu nội bộ của tổ chức, doanh nghiệp, nhằm phục vụ cho việc kinh doanh, sản xuất. Quản lý tài liệu hiệu quả sẽ giúp doanh nghiệp, tổ chức sắp xếp, tổ chức tài liệu hợp lý hơn, tiết kiệm chi phí bảo quản và thời gian tiềm kiếm.",
                },
                employee: {
                    title: "Quản lý nhân sự",
                    content:
                        "Quản lý danh sách thông tin về nhân sự trong doanh nghiệp",
                    detail:
                        "Quản lý thông tin nhân sự trong doanh nghiệp Các cán bộ cấp cao có thể dễ dàng theo dõi tình hình nhân sự qua các biểu đồ thống kê",
                },
                asset: {
                    title: "Quản lý tài sản",
                    content: "Quản lý tài sản trong doanh nghiệp",
                    detail:
                        "Quản lý thông tin tài sản dễ dàng. Truy suất thông tin nhanh chóng. Thống kê theo dõi dưới dạng các biểu đồ linh hoạt, dễ dàng nắm bắt thông tin.",
                },
            },
            service_signup: {
                title: "Đăng ký sử dụng dịch vụ",
                content: [
                    "Miễn phí dùng thử 15 ngày",
                    "Tối đa truy cập 10 user",
                    "Trải nghiệm các tính năng miễn phí",
                ],
                form: {
                    customer: "Khách hàng",
                    email: "Email",
                    phone: "Số điện thoại",
                    type: {
                        choose: "Lựa chọn gói dịch vụ",
                        standard: "Tiêu chuẩn",
                        full: "Full chức năng",
                    },
                    send: "Gửi đăng ký",
                },
            },
            address: {
                title: "Địa chỉ công ty",
                content: {
                    location: "P901, 8C Tạ Quang Bửu, Hai Bà Trưng, Hà Nội.",
                    phone: "+84 986 986 247",
                    email: "office@vnist.vn",
                },
            },
            contact: {
                title: "Liên hệ với chúng tôi",
                company:
                    "CÔNG TY CỔ PHẦN CÔNG NGHỆ AN TOÀN THÔNG TIN VÀ TRUYỀN THÔNG VIỆT NAM",
                form: {
                    name: "Tên khách hàng",
                    emai: "Địa chỉ email",
                    content: "Nội dung trao đổi",
                    send: "Gửi",
                },
            },
            footer: {
                about_us: {
                    title: "Về chúng tôi",
                    content:
                        "Giải pháp không gian làm việc số DX của công ty cổ phần an toàn thông tin VNIST",
                },
                care: {
                    title: "Quan tâm",
                    content: {
                        company: "Công ty phát triển dịch vụ",
                        research: "Tìm hiểu thêm về",
                    },
                },
                media: {
                    title: "Đa phương tiện",
                },
                copyright: "Bản quyền © 2020 VNIST - All rights reserved",
            },
        },

        auth: {
            validator: {
                confirm_password_invalid:
                    "Mật khẩu không trùng khớp. Vui lòng kiểm tra lại",
                confirm_password2_invalid:
                    "Mật khẩu cấp 2 không trùng khớp. Vui lòng kiểm tra lại",
                password_length_error:
                    "Mật khẩu phải có độ dài tối thiểu 6 và không quá 30 ký tự",
                confirm_password_error: "Mật khẩu xác thực không khớp",
            },
            security: {
                label: "Bảo mật",
                title: "Thay đổi mật khẩu người dùng",
                password: "Mật khẩu",
                old_password: "Mật khẩu cũ",
                old_password2: "Mật khẩu cấp 2 cũ",
                new_password: "Mật khẩu mới",
                new_password2: "Mật khẩu cấp 2 mới",
                confirm_password: "Xác thực mật khẩu",
                re_enter_new_password: "Nhập lại mật khẩu mới",
                re_enter_new_password2: "Nhập lại mật khẩu cấp 2 mới"
            },
            login: "Đăng nhập",
            logout: "Đăng xuất",
            logout_all_account: "Đăng xuất khỏi tất cả các thiết bị",
            profile: {
                label: "Thông tin",
                title: "Thông tin tài khoản người dùng",
                name: "Tên người dùng",
                input_name: "Nhập tên người dùng",
                email: "Địa chỉ email",
                password: "Mật khẩu mới",
                confirm: "Xác thực mật khẩu",
                otp: "OTP",
            },

            // Thông điệp nhận từ server
            change_user_information_success:
                "Thay đổi thông tin người dùng thành công",
            change_user_information_faile:
                "Thay đổi thông tin người dùng thất bại",
            change_user_password_success: "Thay đổi mật khẩu thành công",
            change_user_password_faile: "Thay đổi mật khẩu thất bại",
            user_not_found: "Không tìm thấy thông tin người dùng",
            username_invalid_length: "Tên người dùng có độ dài không hợp lê",
            username_empty: "Tên người dùng không được để trống",
            email_empty: "Email không được để trống",
            email_exist: "Email này đã được sử dụng",
            userName_exist: "Tên người dùng đã được sử dụng",
            email_invalid: "Email không hợp lệ",
            email_not_found: "Email này chưa được đăng kí trên hệ thống",
            password_invalid: "Mật khẩu không chính xác",
            password2_empty: "Mật khẩu cấp 2 không được để trống",
            password2_invalid: "Mật khẩu cấp 2 không chính xác",
            email_password_invalid: "Email hoặc mật khẩu không chính xác",
            acc_blocked: "Tài khoản này đã bị tạm khóa",
            acc_have_not_role: "Tài khoản chưa được phân quyền trên hệ thống",
            wrong5_block:
                "Bạn đã nhập sai mật khẩu 5 lần. Tài khoản của bạn đã bị tạm khóa",
            request_forgot_password_success:
                "Yêu cầu thay đổi mật khẩu thành công. Hệ thống đã gửi yêu cầu xác nhận thay đổi mật khẩu vào email của bạn",
            reset_password_success: "Thiết lập mật khẩu thành công",
            otp_invalid: "Mã xác thức không chính xác",
            reset_password_invalid: "Yêu cầu thiết lập lại mật khẩu không hợp lệ",
            portal_invalid: "Portal không hợp lệ",
            create_password2_success: 'Thêm mật khẩu cấp 2 thành công',
            create_password2_faile: 'Thêm mật khẩu cấp 2 thất bại',
            change_user_password2_success: "Chỉnh sửa mật khảu cấp 2 thành công",
            change_user_password2_faile: "Chỉnh sửa mật khảu cấp 2 thất bại",
            old_password_empty: "Mật khẩu cũ không được để trống",
            old_password2_empty: "Mật khẩu cấp 2 cũ không được để trống",
            new_password2_empty: "Mật khẩu cấp 2 mới không được để trống",
            confirm_password2_invalid: "Xác nhận mật khẩu cấp 2 không hợp lệ",
            old_password_invalid: "Mật khẩu cũ không hợp lệ",
            old_password2_invalid: "Mật khẩu cấp 2 cũ không hợp lệ",
            delete_password2_success: "Xóa mật khẩu cấp 2 thành công",
            delete_password2_faile: "Xóa mật khẩu cấp 2 thất bại",
        },

        system_admin: {
            company: {
                table: {
                    name: "Tên doanh nghiệp/công ty",
                    short_name: "Tên ngắn",
                    description: "Mô tả về doanh nghiệp/công ty",
                    log: "Ghi log",
                    service: "Dịch vụ",
                    super_admin: "Tài khoản super admin",
                },
                on: "Bật",
                off: "Tắt",
                add: "Thêm doanh nghiệp/công ty",
                edit: "Chỉnh sửa thông tin doanh nghiệp/công ty",
                service: "Dịch vụ cho doanh nghiệp/công ty",
                validator: {
                    name: {
                        no_blank: "Tên không được để trống",
                        no_less4: "Tên không được ít hơn 4 kí tự",
                        no_more255: "Tên không quá 255 kí tự",
                        no_special: "Tên không được chứa kí tự đặc biệt",
                    },
                    short_name: {
                        no_blank: "Tên không được để trống",
                        no_less3: "Tên không được ít hơn 3 kí tự",
                        no_more255: "Tên không quá 255 kí tự",
                        no_space:
                            "Tên ngắn của công ty không hợp lê. Các chữ không được cách nhau",
                    },
                    description: {
                        no_blank: "Mô tả không được để trống",
                        no_less4: "Mô tả không được ít hơn 4 kí tự",
                        no_more255: "Mô tả không quá 255 kí tự",
                        no_special: "Mô tả không được chứa kí tự đặc biệt",
                    },
                    super_admin: {
                        no_blank: "Email không được để trống",
                        email_invalid: "Email không hợp lệ",
                    },
                },

                // Thông điệp trả về từ server
                create_company_success: "Khởi tạo dữ liệu công ty thành công",
                show_company_success: "Lấy dữ liệu công ty thành công",
                edit_company_success: "Chỉnh sửa thông tin công ty thành công",
                delete_company_success: "Xóa dữ liệu công ty thành công",
                add_new_link_for_company_success:
                    "Thêm mới link cho công ty thành công",
                delete_link_for_company_success: "Xóa link thành công",
                add_new_component_for_company_success:
                    "Thêm mới component cho công ty thành công",
                delete_component_for_company_success:
                    "Xóa component thành công",

                create_import_configuration_success:
                    "Thêm cấu hình file import thành công",
                create_import_configuration_faile:
                    "Thêm cấu hình file import thất bại",
                edit_import_configuration_success:
                    "Chỉnh sửa cấu hình file import thành công",
                edit_import_configuration_faile:
                    "Chỉnh sửa cấu hình file import thất bại",

                email_exist: "Email này đã được sử dụng",
                company_not_found: "Không tìm thấy thông tin về công ty",
                link_exist: "Url cho link đã tồn tại",
                component_exist: "Component này đã tồn tại",

                update_company_link_success: "Cập nhật link thành công",
                update_company_link_faile: "Cập nhật link thất bại",
                update_company_component_success:
                    "Cập nhật component thành công",
                update_company_component_faile: "Cập nhật component thất bại",
                company_already_exist: "Tên công ty đã tồn tại"
            },

            system_setting: {
                backup: {
                    config: "Cấu hình sao lưu dữ liệu",
                    backup_button: "Sao lưu dữ liệu",
                    automatic: "Tự động",
                    on: "Bật sao lưu",
                    off: "Tắt sao lưu",
                    week_day: {
                        mon: "Thứ hai",
                        tue: "Thứ ba",
                        wed: "Thứ tư",
                        thur: "Thứ năm",
                        fri: "Thứ sáu",
                        sat: "Thứ bảy",
                        sun: "Chủ nhật",
                    },
                    month_list: {
                        jan: "Tháng 1",
                        feb: "Tháng 2",
                        mar: "Tháng 3",
                        apr: "Tháng 4",
                        may: "Tháng 5",
                        june: "Tháng 6",
                        july: "Tháng 7",
                        aug: "Tháng 8",
                        sep: "Tháng 9",
                        oct: "Tháng 10",
                        nov: "Tháng 11",
                        dec: "Tháng 12",
                    },
                    limit: "Giới hạn",
                    period: "Định kỳ",
                    weekly: "Hàng tuần",
                    monthly: "Hàng tháng",
                    yearly: "Hằng năm",
                    date: "Ngày",
                    hour: "Giờ",
                    week: "Tuần",
                    minute: "Phút",
                    second: "Giây",
                    day: "Thứ",
                    month: "Tháng",
                    year: "Năm",
                    save: "Lưu cấu hình",

                    version: "Phiên bản",
                    description: "Mô tả về phiên bản",
                    backup_time: "Thời gian đã sao lưu",
                    action: "Hành động",
                },
            },

            root_role: {
                table: {
                    name: "Tên phân quyền",
                    description: "Mô tả về phân quyền",
                },

                //Thông điệp trả về từ server
                get_root_roles_success:
                    "Lấy thông tin về các root role thành công",
            },

            system_link: {
                table: {
                    url: "Đường dẫn",
                    category: "Danh mục",
                    description: "Mô tả về trang",
                    roles: "Những role có quyền",
                },
                add: "Thêm system link mới",
                edit: "Chỉnh sửa thông tin system link",
                delete: "Xóa system link",
                validator: {
                    url: {
                        no_blank: "Url không được để trống",
                        start_with_slash:
                            "Url không hợp lệ. Url phải bắt đầu bằng dấu /",
                    },
                    description: {
                        no_blank: "Mô tả không được để trống",
                        no_special: "Mô tả không được chứa ký tự đặc biệt",
                    },
                },

                // Thông điệp từ server
                create_system_link_success: "Tạo system link thành công",
                edit_system_link_success:
                    "Chỉnh sửa thông tin system link thành công",
                delete_system_link_success: "Xóa system link thành công",

                system_link_url_exist: "Url này đã được sử dụng",
            },

            system_component: {
                table: {
                    name: "Tên component",
                    description: "Mô tả về component",
                    link: "Thuộc về trang",
                    roles: "Những role có quyền",
                },
                add: "Thêm system component mới",
                edit: "Chỉnh sửa thông tin system component",
                delete: "Xóa system component",
                validator: {
                    name: {
                        no_space: "Tên component không được để trống",
                        no_special: "Tên không được chứa ký tự đặc biệt",
                    },
                    description: {
                        no_space: "Mô tả component không được để trống",
                        no_special: "Mô tả không được chứa ký tự đặc biệt",
                    },
                },
                select_link: "Chọn link tương ứng",

                //Thông điệp trả về từ server
                create_system_component_success:
                    "Tạo system component thành công",
                get_system_component_success:
                    "Lấy dữ liệu system component thành công",
                edit_system_component_success:
                    "Chỉnh sửa system admin thành công",
                delete_system_component_success:
                    "Xóa system component thành công",

                system_component_name_invalid: "Tên không hợp lệ",
                system_component_name_exist:
                    "Tên này đã được sử dụng cho 1 system component khác",
            },

            system_api: {
                update: "Cập nhật",

                table: {
                    path: "Đường dẫn",
                    method: "Phương thức",
                    description: "Mô tả",
                    category: "Danh mục",
                    email: "Email"
                },
                delete: "Xóa system api",
                select_all_method: "Chọn tất cả các phương thức",
                non_select_method: "Chọn phương thức",

                placeholder: {
                    input_path: "Nhập đường dẫn",
                    input_description: "Nhập mô tả",
                    input_email: "Nhập email người dùng"
                },

                modal: {
                    create_title: 'Thêm mới API',
                    edit_title: 'Chỉnh sửa API',
                    update_title: 'Cập nhật API',
                    delete_title: 'Xóa API'
                },

                //Thông điệp trả về từ server
                create_system_api_success: 'Thêm system API thành công',
                create_system_api_failure: 'Thêm system API thất bại',
                system_api_exist: 'System API đã tồn tại'
            },

            system_page: {
                //Thông điệp trả về từ server
                get_system_page_apis_success: 'Lấy system page API thành công',
                get_system_page_api_failure: 'Lấy system page API thất bại',
            },

            privilege_system_api: {
                cancel: 'Hủy phân quyền API',
                delete: 'Xóa phân quyền API',
                table: {
                    email: "Email",
                    description: "Mô tả",
                    startDate: "Ngày bắt đầu",
                    endDate: "Ngày hết hạn"
                },
                placeholder: {
                    input_email: "Nhập email"
                },
            }
        },

        super_admin: {
            system: {
                edit_backup_info: "Chỉnh sửa thông tin phiên bản dữ liệu",
                download_backup_version: "Tải xuống phiên bản dữ liệu",
                backup_description: "Mô tả về phiên bản dữ liệu",
                restore_backup: "Khôi phục phiên bản dữ liệu",
                delete_backup: "Xóa phiên bản dữ liệu",

                get_backup_list_success: "Lấy dữ liệu sao lưu thành công",
                get_backup_list_faile: "Lấy dữ liệu sao lưu thất bại",
                create_backup_success: "Tạo sao lưu thành công",
                create_backup_faile: "Tạo sao lưu thất bại",
                delete_backup_success: "Xóa sao lưu thành công",
                delete_backup_faile: "Xóa sao lưu thất bại",
                restore_data_success: "Khôi phục dữ liệu thành công",
                restore_data_faile: "Khôi phục dữ liệu thất bại",
                edit_backup_info_success: "Chỉnh sửa thông tin phiên bản sao lưu thành công",
                edit_backup_info_faile: "Chỉnh sửa thông tin phiên bản sao lưu thất bại",
                backup_version_deleted: 'Phiên bản sao lưu dữ liệu này đã bị xóa, Không thể chính sửa thông tin phiên bản',
            },

            organization_unit: {
                //Thông điệp trả về từ server
                create_department_success: "Tạo đơn vị thành công",
                edit_department_success: "Chỉnh sửa đơn vị thành công",
                delete_department_success: "Xóa đơn vị thành công",

                department_name_exist: "Tên đơn vị này đã được sử dụng",
                department_not_found: "Không tìm thấy thông tin về đơn vị",
                department_has_user:
                    "Không thể xóa đơn vị này. Đơn vị đã có thành viên",
                role_manager_exist: "Tên chức danh cho trưởng đơn vị đã tồn tại",
                role_deputy_manager_exist: "Tên chức danh cho phó đơn vị đã tồn tại",
                role_employee_exist:
                    "Tên chức danh cho nhân viên đơn vị đã tồn tại",
                role_name_exist: "Tên chức danh này đã được sử dụng cho một phân quyền khác",
                role_name_exist: "Tên chức danh này đã được sử dụng cho một phân quyền khác",
                role_name_duplicate: "Tên các chức danh đã nhập bị trùng với nhau"
            },
            user: {
                // Thông điệp trả về từ server
                create_user_success: "Tạo tài khoản người dùng thành công",
                edit_user_success:
                    "Chỉnh sửa thông tin tài khoản người dùng thành công",
                delete_user_success: "Xóa tài khoản người dùng thành công",

                email_exist: "Email đã được sử dụng cho một tài khoản khác",
                user_not_found: "Không tìm thấy thông tin về tài khoản",
                department_not_found:
                    "Không tìm thấy thông tin về phòng ban của user",
            },
            role: {
                // Thông điệp trả về từ server
                create_role_success: "Tạo role mới thành công",
                edit_role_success: "Chỉnh sửa role thành công",
                delete_role_success: "Xóa role thành công",

                role_name_exist:
                    "Tên cho phân quyền đã được sử dụng cho một phân quyền khác",
                role_manager_exist:
                    "Tên cho phân quyền của trưởng đơn vị này đã được sử dụng",
                role_deputy_manager_exist:
                    "Tên cho phân quyền của phó đơn vị này đã được sử dụng",
                role_employee_exist:
                    "Tên cho phân quyền của nhân viên đơn vị này đã được sử dụng",
            },
            link: {
                // Thông điệp trả về từ server
                create_link_success: "Tạo link thành công",
                edit_link_success: "Chỉnh sửa link thành công",
                delete_link_success: "Xóa link thành công",

                cannot_create_this_url: "Không thể tạo link này",
                this_url_cannot_be_use: "Url này không được phép sử dụng",
                url_exist: "Url này đã đươc sử dụng",
            },
            component: {
                // Thông điệp trả về từ server
                edit_component_success: "Chỉnh sửa component thành công",

                component_name_exist: "Tên của component đã được sử dụng",
            },
        },

        notification: {
            title: "Thông báo",
            news: "Thông báo mới",
            see_all: "Xem tất cả",
            mark_all_readed: "Đánh dấu tất cả là đã đọc",
            total: "Tổng số",
            level: "loại thông báo",
            type: {
                title: "Loại thông báo",
                info: "Thông tin",
                general: "Thông báo chung",
                important: "Thông báo quan trọng",
                emergency: "Thông báo khẩn",
            },
            content: "Nội dung thông báo",
            sender: "Gửi từ",
            departments: "Thông báo tới đơn vị/phòng ban",
            users: "Thông báo đến người dùng cụ thể",
            from: "Từ",
            at: "lúc",

            add: "Tạo thông báo",
            receivered: "Thông báo đã nhận",
            sent: "Thông báo đã tạo",
            unread: "Thông báo chưa đọc",
            note: "Chú thích",
            info: "Thông tin thông báo",
            delete: "Xóa thông báo",
            new: "Mới",

            // Thông điệp trả về từ server
            create_notification_success: "Tạo thông báo thành công",
            create_notification_faile: "Tạo thông báo thất bại",
            delete_notification_success: "Xóa thông báo thành công",
            delete_notification_faile: "Xóa thông báo thất bại",
            delete_manual_notification_success: "Xóa thông báo thành công",
            delete_manual_notification_faile: "Xóa thông báo thất bại",
        },

        document: {
            title: "Quản lý tài liệu biểu mẫu",
            version: "Tên phiên bản",
            information: "Thông tin",
            different_versions: "Phiên bản khác",
            amount: "Số lượng",
            name: "Tên tài liệu",
            description: "Mô tả",
            category_example: "VD: Văn bản, Hồ sơ, Biên bản,....",

            category: "Loại tài liệu",
            domain: "Lĩnh vực",
            data: "Danh sách tài liệu",
            downloaded: "Những văn bản đã tải download",
            popular: "Những tài liệu văn bản phổ biến",
            new: "Tài liệu mới nhất",
            statistics_report: "Thống kê báo cáo",
            history_report: "Lịch sử thống kê",
            archive: "Lưu trữ",

            roles: "Những vị trí có quyền xem tài liệu này",
            users: "Những người dùng có quyền xem tài liệu này",
            issuing_date: "Ngày ban hành",
            effective_date: "Ngày áp dụng",
            expired_date: "Ngày hết hạn",
            views: "Số lần xem",
            viewer: "Người xem",
            downloader: "Người tải",
            downloads: "Số lần tải xuống",
            add: "Thêm mới",
            export: "Xuất báo cáo",
            import: "Thêm dữ liệu từ file",
            edit: "Chỉnh sửa",
            watch: "Xem chi tiết",
            delete: "Xóa",
            time: "Thời gian",
            add_version: "Thêm phiên bản mới",
            upload_file: "File tài liệu",
            upload_file_scan: "File scan tài liệu",
            choose_file: "Chọn file",
            download: "Tải xuống",
            preview: "Xem trước",
            no_version: "Không có phiên bản nào khác",
            no_blank_description: "Mô tả không được để trống",
            no_blank_name: "Tên không được để trống",
            no_blank_code: "Mã danh mục không được để trống",
            infomation_docs: "Thông tin tài liệu",
            relationship_role_store: "Liên kết, phân quyền và lưu trữ",
            statistical_document: "Thống kê các loại tài liệu",
            statistical_view_down:
                "Thống kê số lượng xem và download các loại tài liệu",
            statistical_document_by_domain:
                "Thống kê số lượng tài liệu theo lĩnh vực",
            statistical_document_by_archive:
                "Thống kê số lượng tài liệu theo vị trí lưu trữ",
            doc_version: {
                title: "Phiên bản",
                name: "Tên phiên bản",
                description: "Mô tả",
                issuing_body: "Cơ quan ban hành",
                official_number: "Số hiệu",
                issuing_date: "Ngày ban hành",
                effective_date: "Ngày áp dụng",
                expired_date: "Ngày hết hạn",
                signer: "Người ký",
                number_view: "Số lần xem",
                number_download: "Số lần tải",
                file: "File upload",
                scanned_file_of_signed_document: "File scan",
                exp_issuing_body: "Ví dụ: Cơ quan hành chính",
                exp_official_number: "Ví dụ: 05062020VN",
                exp_signer: "Ví dụ: Nguyễn Việt Anh",
                exp_version: "Phiên bản 1",
                no_blank_issuingbody: "Cơ quan không được để trống",
                no_blank_version_name: "Tên phiên bản không được để trống",
                no_blank_official_number: "Số hiệu không được để trống",
                error_office_number: "Số hiệu phải có kí tự số",
                no_blank_issuingdate: "Ngày ban hành không được để trống",
                no_blank_effectivedate: "Ngày áp dụng không được để trống",
                no_blank_expired_date: "Ngày hết hạn không được để trống",
                no_blank_signer: "Tên người đăng kí không được để trống",
                no_blank_file: "File chưa được upload",
                no_blank_file_scan: "File scan không được để trống",
                no_blank_category: "Loại tài liệu không được để trống",
            },
            relationship: {
                title: "Liên kết tài liệu",
                description: "Mô tả các liên kết tới các tài liệu khác",
                list: "Các tài liệu liên kết",
            },
            store: {
                title: "Hồ sơ lưu trữ bản cứng",
                information: "Vị trí lưu trữ",
                organizational_unit_manage: "Đơn vị quản lý",
                select_organizational: "Chọn đơn vị quản lý",
                all: "Chọn tất cả",
                user_manage: "Người quản lý",
                select_user: "Chọn người quản lý",
            },

            administration: {
                categories: {
                    add: "Thêm loại tài liệu",
                    edit: "Sửa thông tin loại tài liệu",
                    delete: "Xóa loại tài liệu",
                    name: "Tên",
                    description: "Mô tả",
                    select: "Chọn loại tài liệu",
                    not_select: "Chưa thuộc loại tài liệu",
                },
                domains: {
                    add: "Thêm lĩnh vực tài liệu",
                    edit: "Sửa thông tin lĩnh vực tài liệu",
                    delete: "Xóa các lĩnh vực đã chọn",
                    name: "Tên",
                    description: "Mô tả",
                    parent: "Lĩnh vực cha",
                    select_parent: "Chọn lĩnh vực cha",
                    select: "Chọn lĩnh vực",
                    not_select: "Không thuộc về lĩnh vực nào",
                },
                archives: {
                    add: "Thêm vị trí lưu trữ tài liệu",
                    edit: "Sửa thông tin vị trí lưu trữ tài liệu",
                    delete: "Xóa các vị trí lưu trữ đã chọn",
                    name: "Tên",
                    description: "Mô tả",
                    parent: "Danh mục cha",
                    select_parent: "Chọn vị trí lưu trữ cha",
                    select: "Chọn ",
                    not_select: "Không thuộc về vị trí nào",
                    path: "Đường dẫn",
                    path_detail: "Đường đẫn chi tiết",
                },
            },
            user: {
                title: "Tài liệu, văn bản",
            },

            //Thông điệp trả về từ server
            get_documents_success: "Lấy danh sách tài liệu thành công",
            get_documents_faile: "Lấy danh sách tài liệu thất bại",
            create_document_success: "Thêm mới tài liệu thành công",
            create_document_faile: "Thêm mới tài liệu thất bại",
            import_document_success: "Nhập dữ liệu tài liệu từ file thành công",
            import_document_faile: "Nhập dữ liệu tài liệu từ file thất bại",
            show_document_success: "Lấy dữ liệu tài liệu thành công",
            show_document_faile: "Lấy dữ liệu tài liệu thất bại",
            edit_document_success: "Cập nhật dữ liệu tài liệu thành công",
            edit_document_faile: "Cập nhật dữ liệu tài liệu thất bại",
            add_document_logs_success:
                "Thêm lịch sử chỉnh sửa tài liệu thành công",
            add_document_logs_faile: "Thêm lịch sử chỉnh sửa tài liệu thất bại",
            delete_document_success: "Xóa tài liệu thành công",
            delete_document_faile: "Xóa tài liệu thất bại",
            download_document_file_faile: "Lấy dữ liệu file tài liệu thất bại",
            download_document_file_scan_faile:
                "Lấy dữ liệu file scan tài liệu thất bại",
            get_document_categories_success:
                "Lấy danh sách loại tài liệu thành công",
            get_document_categories_faile:
                "Lấy danh sách loại tài liệu thất bại",
            create_document_category_success:
                "Thêm mới loại tài liệu thành công",
            create_document_category_faile: "Thêm mới loại tài liệu thất bại",
            edit_document_category_success:
                "Cập nhật thông tin loại tài liệu thành công",
            edit_document_category_faile:
                "Cập nhật thông tin loại tài liệu thất bại",
            delete_document_category_success: "Xóa loại tài liệu thành công",
            delete_document_category_faile: "Xóa loại tài liệu thất bại",
            import_document_category_success: "Tải dữ liệu từ file thành công",
            import_document_category_faile: "Tải dữ liệu từ file thất bại",
            get_document_domains_success:
                "Lấy danh sách lĩnh vực tài liệu thành công",
            get_document_domains_faile:
                "Lấy danh sách lĩnh vực tài liệu thất bại",
            create_document_domain_success:
                "Thêm mới lĩnh vực tài liệu thành công",
            create_document_domain_faile: "Thêm mới lĩnh vực tài liệu thất bại",
            edit_document_domain_success:
                "Cập nhật lĩnh vực tài liệu thành công",
            edit_document_domain_faile: "Cập nhật lĩnh vực tài liệu thất bại",
            delete_document_domain_success: "Xóa lĩnh vực tài liệu thành công",
            delete_document_domain_faile: "Xóa lĩnh vực tài liệu thất bại",
            import_document_domain_success:
                "Nhập dữ liệu lĩnh vực tài liệu từ file thành công",
            import_document_domain_faile:
                "Nhập dữ liệu lĩnh vực tài liệu từ file thất bại",
            get_document_that_role_can_view_success:
                "Lấy danh sách tài liệu vai trò có quyền xem thành công",
            get_document_that_role_can_view_faile:
                "Lấy danh sách tài liệu vai trò có quyền xem thất bại",
            get_document_user_statistical_success:
                "Lấy thống kê dữ liệu tài liệu thành công",
            get_document_user_statistical_faile:
                "Lấy thống kê dữ liệu tài liệu thất bại",
            get_document_archives_success:
                "Lấy danh sách thông tin lưu trữ tài liệu thành công",
            get_document_archives_faile:
                "Lấy danh sách thông tin lưu trữ tài liệu thất bại",
            create_document_archive_success:
                "Tạo mới thông tin lưu trữ tài liệu thành công",
            create_document_archive_faile:
                "Tạo mới thông tin lưu trữ tài liệu thất bại",
            edit_document_archive_success:
                "Cập nhật thông tin lưu trữ tài liệu thành công",
            edit_document_archive_faile:
                "Cập nhật thông tin lưu trữ tài liệu thất bại",
            delete_document_archive_success:
                "Xóa thông tin lưu trữ tài liệu thành công",
            delete_document_archive_faile:
                "Xóa thông tin lưu trữ tài liệu thất bại",
            import_document_archive_success:
                "Nhập dữ liệu thông tin lưu trữ từ file thành công",
            import_document_archive_faile:
                "Nhập dữ liệu thông tin lưu trữ từ file thất bại",
            cannot_download_doc_file: "Không thể tải file tài liệu",
            version_not_found:
                "Không tìm thấy thông tin về phiên bản của tài liệu",
            cannot_download_doc_file_scan: "Không thể tải file scan tài liệu",
            version_scan_not_found:
                "Không tìm thấy thông tin về phiên bản scan tài liệu",
            category_used_to_document:
                "Thông tin về loại tài liệu đang được sử dụng",
            cannot_delete_category: "Không thể xóa loại tài liệu",
            document_domain_not_found:
                "Không tìm thấy dữ liệu về lĩnh vực tài liệu",
            document_archive_not_found:
                "Không tìm thấy dữ liệu về thông tin lưu trữ tài liệu",
            domain_name_exist: "Tên lĩnh vực đã được sử dụng",
            category_name_exist: "Tên loại đã được sử dụng",
            name_exist: "Tên đã được sử dụng",
            document_exist: "Tên tài liệu liệu đã tồn tại",
            document_number_exist: "Số hiệu tài liệu đã tồn tại",
        },

        crm: {
            customer: {
                owner: "Người quản lý",
                source: "Nguồn khách hàng",
                company: "Công ty",
                companyEstablishmentDate: "Ngày thành lập công ty",
                name: "Tên khách hàng",
                code: "Mã khách hàng",
                customerType: "Loại khách hàng",
                mobilephoneNumber: "Số điện thoại di động",
                telephoneNumber: "Số điện thoại cố định",
                group: "Nhóm khách hàng",
                status: "Trạng thái khách hàng",
                address: "Địa chỉ",
                address2: "Địa chỉ 2",
                represent: "Người đại diện",
                email: "Email",
                secondaryEmail: "Email phụ",
                location: "Khu vực",
                birth: "Ngày sinh",
                gender: "Giới tính",
                male: "Nam",
                female: "Nữ",
                liability: "Công nợ",
                taxNumber: "Mã số thuế",
                website: "Website",
                linkedIn: "linkedIn",
                document: "Giấy tờ",
                note: "Ghi chú",
                carier: "Nhân viên chăm sóc phụ trách",
                discount: "Chiết khấu áp dụng",
                by_group: "Theo nhóm khách hàng",
                by_customer: "Theo khách hàng",
                payment: "Hình thức thanh toán",
                creator: "Người tạo",
                personal: "Cá nhân",
                organization: "Tổ chức",
                northern: "Miền Bắc",
                central: "Miền Trung",
                southern: "Miền Nam",

                purchaseHistories: {
                    all: "Tất cả",
                    waitingForApproval: "Chờ phê duyệt",
                    approved: "Đã phê duyệt",
                    waitingForTheGoods: "Chờ lấy hàng",
                    delivering: "Đang giao",
                    finished: "Đã hoàn thành",
                    cancelled: "Đã hủy bỏ",
                },

                info: "Thông tin chung",
                contact: "Thông tin liên hệ",
                advance: "Thông tin khác",
                list_attachments: "Danh sách tài liệu",
                file: {
                    name: "Tên tài liệu",
                    description: "Mô tả",
                    url: "Đường dẫn",
                    fileName: "Tên file",
                    add_file: "Thêm mới file",
                    edit_file: "Chỉnh sửa file",
                    attachment: "Tập tin đính kèm",
                },

                add: "Thêm mới khách hàng",
                add_import: "Thêm dữ liệu từ file",
                see: "Xem thông tin khách hàng",
                edit: "Chỉnh sửa thông tin khách hàng",
                delete: "Xóa thông tin khách hàng",
                cannot_be_empty: "không được để trống",
                value_duplicate: "bị trùng lặp",
            },

            group: {
                name: "Tên nhóm khách hàng",
                code: "Mã nhóm khách hàng",
                description: "Mô tả nhóm khách hàng",
                promotion: "Ưu đãi kèm theo",

                add: "Thêm mới nhóm khách hàng",
                edit: "Chỉnh sửa thông tin nhóm khách hàng",
                delete: "Xóa thông tin nhóm khách hàng",
            },

            lead: {},
            care: {
                name: "Tên hoạt động",
                caregiver: "Nhân viên phụ trách",
                customer: "Tên khách hàng",
                description: "Mô tả ",
                careType: "Loại hình chăm sóc",
                status: "Trạng thái",
                startDate: "Ngày bắt đầu",
                endDate: "Ngày kết thúc",
                notes: "Ghi chú",
                action: "Hành động",
                add: "Thêm mới hoạt động chăm sóc khách hàng",
                info: "Xem chi tiết hoạt động chăm sóc khách hàng",
                edit: "Chỉnh sửa công việc chăm sóc khách hàng",
                priority: 'Độ ưu tiên',
            },
            status: {
                add: "Thêm mới trạng thái",
                edit: "Chỉnh sửa trạng thái",
                delete: "Xóa trạng thái",
                name: "Tên trạng thái khách hàng",
                description: "Mô tả trạng thái",
            },
            statistic: {},
        },

        not_found: {
            title: "Không tìm thấy địa chỉ này!",
            content:
                "Chúng tôi không thể tìm thấy địa chỉ mà bạn đang tìm kiếm",
            back_to_home: "Quay lại trang chủ",
        },

        language: "Thiết lập ngôn ngữ",
        alert: {
            title: "Thông báo từ hệ thống",
            log_again: "Đã xảy ra lỗi. Vui lòng đăng nhập lại!",
            access_denied:
                "ACCESS DENIED! Truy cập trái phép! Vui lòng đăng nhập!",
            role_invalid:
                "ROLE INVALID! Quyền truy cập không hợp lệ! Vui lòng thử lại sau!",
            page_access_denied:
                "Phân quyền hiện tại của bạn không được phép truy cập vào trang này!",
            user_role_invalid:
                "USER-ROLE INVALID! Quyền hiện tại của bạn đã bị thay đổi! Vui lòng đăng nhập lại!",
            acc_logged_out:
                "JWT - phiên làm việc không chính xác. Vui lòng đăng nhập lại!",
            service_off:
                "SERVICE OFF! Dịch vụ của công ty bạn đã tạm ngưng! Phiên làm việc của bạn sẽ bị tạm ngưng!",
            fingerprint_invalid:
                "Phiên đăng nhập của bạn không đúng! Vui lòng đăng nhập lại!",
            service_permisson_denied: "Bạn không có quyền gọi đến service",
            email_invalid: "Email không chính xác",
            password_invalid: "Mật khẩu không chính xác",
            wrong5_block:
                "Bạn đã nhập sai mật khẩu quá 5 lần. Tài khoản này đã bị khóa!",
            acc_blocked: "Tài khoản đã bị khóa",
            acc_have_not_role: "Tài khoản chưa được phân quyền",
            reset_password_success: "Reset mật khẩu thành công!",
            reset_password_faile: "Reset mật khẩu thất bại!",
        },

        confirm: {
            yes: "CÓ",
            no: "KHÔNG",
            no_data: "Không có dữ liệu",
            field_invalid:
                "Giá trị trường nhập vào không hợp lệ. Vui lòng kiểm tra lại!",
            loading: "Đang tải dữ liệu ...",
        },

        form: {
            property: "Thuộc tính",
            value: "Giá trị",
            required: "Các trường thông tin bắt buộc",
            save: "Lưu",
            close: "Đóng",
            email: "Email",
            password: "Mật khẩu",
            password2: "Mật khẩu cấp 2",
            portal: "Portal",
            new_password: "Mật khẩu mới",
            confirm: "Xác thực mật khẩu",
            description: "Mô tả",
            reset_password: "Thiết lập lại mật khẩu",
            forgot_password: "Quên mật khẩu ?",
            signin: "Đăng nhập",
            otp: "Mã xác thực",
            next: "Tiếp tục",
            search: "Tìm kiếm",
        },

        table: {
            name: "Tên",
            description: "Mô tả",
            email: "Email",
            action: "Hành động",
            line_per_page: "Số dòng/Trang",
            update: "Cập nhật",
            edit: "Sửa",
            delete: "Xóa",
            info: "Thông tin chi tiết",
            status: "Trạng thái",
            url: "URL",
            short_name: "Tên viết tắt",
            employee_name: "Tên nhân viên",
            employee_number: "Mã nhân viên",
            total_salary: "Tổng lương",
            month: "Tháng",
            unit: "Đơn vị",
            position: "Chức danh",
            no_data: "Không có dữ liệu",
            start_date: "Từ ngày",
            end_date: "Đến ngày",
            hidden_column: "Ẩn cột",
            choose_hidden_columns: "Chọn cột muốn ẩn",
            hide_all_columns: "Ẩn tất cả các cột",
        },

        modal: {
            update: "Lưu thay đổi",
            close: "Đóng",
            create: "Thêm mới",
            note: "là các trường bắt buộc phải nhập",
            add_success: "Thêm mới thành công",
            add_faile: "Thêm mới thất bại",
        },

        page: {
            unit: "Đơn vị",
            position: "Chức danh",
            month: "Tháng",
            status: "Trạng thái",
            staff_number: "Mã nhân viên",
            add_search: "Tìm kiếm",
            number_decisions: "Số quyết định",
            all_unit: "Chọn tất cả các đơn vị",
            non_unit: "Chọn đơn vị",
            all_position: "Chọn tất cả các chức vụ",
            non_position: "Chọn chức vụ",
            all_status: "Chọn tất cả các trạng thái",
            non_status: "Chọn trạng thái"
        },

        common_component: {
            import_excel: {
                config: "Cấu hình file import",
                user_config: "Cấu hình file import của bạn như sau",
                file: "file import đọc dữ liệu các sheet",
                properties: "Tên các thuộc tính",
                title: "Tiêu đề tương ứng",
            },

            showmore_showless: {
                showmore: "Xem thêm",
                showless: "Ẩn bớt",
                title_showmore: "Bấm để hiển thị thêm",
                title_showless: "Bấm để hiển thị ít hơn"
            },
            google_driver: {
                button: "Thêm files từ Google Drive"
            }
        },

        manage_system: {
            turn_on: "Bật",
            turn_off: "Tắt",
            log: "Trạng thái ghi lịch sử hoạt động",
        },

        manage_company: {
            add: "Thêm",
            add_title: "Thêm doanh nghiệp mới",
            name: "Tên doanh nghiệp",
            short_name: "Tên ngắn doanh nghiệp",
            description: "Mô tả về doanh nghiệp",
            on_service: "Bật dịch vụ",
            off_service: "Tắt dịch vụ",
            turning_on: "Đang bật dịch vụ",
            turning_off: "Đang tắt dịch vụ",
            info: "Thông tin về doanh nghiệp",
            edit: "Chỉnh sửa thông tin doanh nghiệp",
            super_admin: "Email tài khoản super admin của doanh nghiệp",
            add_success: "Tạo doanh nghiệp thành công",
            add_faile: "Tạo doanh nghiệp thất bại",
            edit_success: "Chỉnh sửa thông tin thành công",
            edit_faile: "Chỉnh sửa thông tin thất bại",
            log: "Ghi log",
            on: "Bật",
            off: "Tắt",
            service: "Dịch vụ",
        },

        manage_department: {
            zoom_out: "Thu nhỏ",
            zoom_in: "Phóng to",
            add: "Thêm",
            import: "Thêm dữ liệu từ file",
            edit_title: "Chỉnh sửa đơn vị",
            add_title: "Thêm đơn vị mới",
            info: "Thông tin về đơn vị",
            name: "Tên đơn vị",
            description: "Mô tả về đơn vị",
            total_employee: "Số lượng nhân viên",
            total_roles: "Các vai trò hiện tại",
            parent: "Đơn vị cha",
            select_parent: "Chọn đơn vị cha",
            no_parent: "Không có đơn vị cha",
            roles_of_department: "Các chức danh của đơn vị",
            manager_name: "Tên các chức danh trưởng đơn vị",
            manager_example: "VD: Trưởng phòng tài chính",
            deputy_manager_name: "Tên các chức danh phó đơn vị",
            deputy_manager_example: "VD: Phó phòng tài chính",
            employee_name: "Tên các chức danh nhân viên đơn vị",
            employee_example: "VD: Nhân viên phòng tài chính",
            add_with_parent: "Tạo đơn vị mới với đơn vị cha là",
            delete: "Xóa đơn vị",
            add_success: "Tạo đơn vị thành công",
            add_faile: "Tạo đơn vị thất bại",
            edit_success: "Chỉnh sửa thông tin thành công",
            edit_faile: "Chỉnh sửa thông tin thất bại",
        },

        manage_role: {
            add: "Thêm",
            add_title: "Thêm phân quyền mới",
            description: "Mô tả về phân quyền",
            info: "Thông tin về phân quyền",
            name: "Tên phân quyền",
            extends: "Kế thừa phân quyền",
            users: "Những người dùng có phân quyền",
            edit: "Chỉnh sửa thông tin phân quyền",
            delete: "Xóa phân quyền",
            add_success: "Đã tạo thành công phân quyền",
            add_faile: "Tạo phân quyền mới thất bại",
            edit_success: "Đã chỉnh sửa lại thông tin phân quyền",
            edit_faile: "Chỉnh sửa thất bại",
        },

        manage_user: {
            add: "Thêm",
            add_title: "Thêm tài khoản người dùng mới",
            add_common: 'Nhập tay',
            import: 'Thêm dữ liệu từ file',
            import_title: 'Thêm dữ liệu người dùng từ file',
            info: "Thông tin về tài khoản người dùng",
            edit: "Chỉnh sửa thông tin tài khoản người dùng",
            disable: "Ngưng hoạt động",
            enable: "Hoạt động",
            delete: "Xóa tài khoản",
            add_success: "Tạo tài khoản thành công",
            add_faile: "Tạo tài khoản thất bại",
            edit_success: "Chỉnh sửa thành công",
            edit_faile: "Chỉnh sửa thất bại",
            roles: "Phân quyền được cấp",
            name: "Tên người dùng",
            email: "Địa chỉ email",
            status: "Trạng thái tài khoản",
        },

        manage_link: {
            add: "Thêm",
            add_title: "Thêm link mới cho trang web",
            url: "Đường link của trang web",
            description: "Mô tả về trang web",
            components: "Chứa các component",
            roles: "Những role được truy cập",
            info: "Thông tin về trang web",
            edit: "Chỉnh sửa thông tin",
            delete: "Xóa link",
            add_success: "Thêm mới thành công",
            add_faile: "Thêm mới thất bại",
            edit_success: "Chỉnh sửa thành công",
            edit_faile: "Chỉnh sửa thất bại",
            category: "Danh mục",
        },

        manage_api: {
            description: "Mô tả api",
        },

        manage_component: {
            add: "Thêm",
            add_title: "Thêm component mới",
            info: "Thông tin về component",
            name: "Tên của component",
            description: "Mô tả về component",
            link: "Thuộc về trang nào",
            edit: "Chỉnh sửa thông tin về component",
            delete: "Xóa component",
            roles: "Những role có component này",
            add_success: "Thêm mới thành công",
            add_faile: "Thêm mới thất bại",
            edit_success: "Chỉnh sửa thành công",
            edit_faile: "Chỉnh sửa thất bại",
        },

        // Modules cấu hình các chức năng
        module_configuration: {
            timekeeping: "Chấm công",
            timekeeping_type: "Kiểu chấm công",
            contract_notice_time: "Báo hết hạn hợp đồng (ngày)",
            contract_notice_time_title: "Báo trước hết hạn hợp đồng",
            shift1_time: "Số giờ ca 1 (giờ)",
            shift2_time: "Số giờ ca 2 (giờ)",
            shift3_time: "Số giờ tăng ca (giờ)",

            shift: "Chấm công theo ca",
            hours: "Chấm công theo giờ",
            shift_and_hour: "Chấm công theo ca và giờ",

            // Thông điệp trả về từ server
            get_configuration_success: "Lấy thông tin cấu hình thành công",
            get_configuration_faile: "Lấy thông tin cấu hình thất bại",
            edit_configuration_success:
                "Chỉnh sửa thông tin cấu hình thành công",
            edit_configuration_faile: "Chỉnh sửa thông tin cấu hình thất bại",
        },

        // Modules Quản lý nhân sự
        human_resource: {
            // Nhóm dùng chung cho module quản lý nhân sự
            stt: "STT",
            unit: "Đơn vị",
            position: "Chức danh",
            references: 'Thông tin tham chiếu',
            month: "Tháng",
            status: "Trạng thái",
            staff_number: "Mã nhân viên",
            staff_name: "Họ và tên",
            all_unit: "Chọn tất cả các đơn vị",
            non_unit: "Chọn đơn vị",
            unit_selected: "đơn vị được chọn",
            non_staff: "Chọn nhân viên",
            all_position: "Chọn tất cả các chức vụ",
            non_position: "Chọn chức vụ",
            position_selected: "chức vụ được chọn",
            all_status: "Chọn tất cả các trạng thái",
            non_status: "Chọn trạng thái",
            not_unit: "Chưa chọn đơn vị",
            add_data_by_excel: "Thêm - Cập nhật dữ liệu bằng việc Import file excel",
            download_file: "Download file import mẫu!",
            choose_file: "Chọn file",
            name_button_export: "Xuất báo cáo",
            choose_decision_unit: "Chọn cấp ra quyết định",
            note_file_import: "File import không đúng định dạng",
            error_row: "Có lỗi xảy ra ở các dòng",
            rowHeader: "Số dòng tiêu đề của bảng",
            sheets_name: "Tên các sheet",
            title_correspond: "Tên tiêu đề ứng với",

            // Validator dung chung cho module quản lý nhân sự
            employee_number_required: "Mã nhân viên không được để trống",
            staff_code_not_special:
                "Mã nhân viên không được chứ ký tự đặc biệt",
            staff_code_not_find: "Mã nhân viên không tồn tại",
            start_date_before_end_date: "Ngày bắt đầu phải trước ngày kết thúc",
            end_date_after_start_date: "Ngày kết thúc phải sau ngày bắt đầu",
            cannot_be_empty: "không được để trống",
            value_duplicate: "bị trùng lặp",
            //Lấy dữ liệu bảng tin quản lý nhân sự
            get_human_resources_dashboard_data: {
                get_human_resources_dashboard_success: "Lấy thông tin bảng tin quản lý nhân sự thành công",
                get_human_resources_dashboard_failed: "Lấy thông tin bảng tin quản lý nhân sự thất bại"
            },

            // Quản lý lương nhân viên
            salary: {
                // list_salary: 'Danh sách bảng lương nhân viên',
                file_name_export: "Bảng theo dõi lương thưởng",
                other_salary: "Lương thưởng khác",

                // Nhóm dành cho table
                table: {
                    main_salary: "Tiền lương chính",
                    other_salary: "Các loại lương thưởng khác",
                    name_salary: "Tên lương thưởng",
                    money_salary: "Số tiền",
                    total_salary: "Tổng thu nhập",
                    action: "Hành động",
                },

                // Nhóm dành cho action
                edit_salary: "Chỉnh sửa bảng lương nhân viên",
                delete_salary: "Xoá bảng lương",
                add_salary: "Thêm bảng lương",
                add_salary_title: "Thêm bảng lương nhân viên",
                add_by_hand: "Thêm bằng tay",
                add_by_hand_title: "Thêm một bảng lương",
                add_import: "Thêm dữ liệu từ file",
                add_import_title: "Thêm nhiều bảng lương",
                add_more_salary: "Thêm lương thưởng khác",
                add_new_salary: "Thêm mới bảng lương",

                // Thông điệp trả về từ server
                employee_code_duplicated: "Mã số nhân viên bị trùng lặp",
                employee_name_required: "Tên nhân viên không được để trống",
                employee_number_required: "Mã nhân viên không được để trống",
                staff_non_unit: "Nhân viên không thuộc đơn vị",
                organizationalUnit_not_found: "Đơn vị không tồn tại",
                organizationalUnit_not_empty: "Đơn vị không được để trống",
                staff_code_not_special:
                    "Mã nhân viên không được chứ ký tự đặc biệt",
                staff_code_not_find: "Mã nhân viên không tồn tại",
                name_other_salary_required:
                    "Tên lương thưởng khác không được để trống",
                money_other_salary_required:
                    "Tiền lương thưởng khác không được để trống",
                month_salary_required: "Tháng lương không được để trống",
                money_salary_required: "Tiền lương chính không được để trống",
                month_salary_have_exist: "Tháng lương đã tồn tại",
                get_salary_success: "Lấy thông tin lương nhân viên thành công",
                get_salary_faile: "Lấy thông tin lương nhân viên thất bại",
                create_salary_success: "Thêm bảng lương thành công",
                create_salary_faile: "Thêm bảng lương thất bại",
                delete_salary_success: "Xoá bẳng lương thành công",
                delete_salary_faile: "Xoá bảng lương thất bại",
                edit_salary_success: "Chỉnh sửa bảng lương thành công",
                edit_salary_faile: "Chỉnh sửa bảng lương thất bại",
                get_chart_salary_success: "Lấy dữ liệu biểu đồ bảng lương thành công",
                get_chart_salary_faile: "Lấy dữ liệu biểu đồ bảng lương thất bại",
                import_salary_success: "Import bảng lương thành công",
                import_salary_faile: "Import bảng lương thất bại",
            },

            // Quản lý nghỉ phép
            annual_leave: {
                file_export_name: "Bảng thống kê nghỉ phép",
                type: "Xin nghỉ theo giờ",
                totalHours: "Tổng số giờ nghỉ",
                leaveOfAbsenceLetter: "Đơn xin nghỉ phép",
                waiting_for_approval_letter: "Đơn chờ phê duyệt",
                approved_letter: "Đơn đã chấp nhận",
                not_approved_letter: "Đơn không chấp nhận",
                have: "Có",
                this_month: "trong tháng này",

                // Nhóm dành cho table
                table: {
                    start_date: "Thời gian bắt đầu",
                    end_date: "Thời gian kết thúc",
                    reason: "Lý do",
                    action: "Hành động",
                },

                // Nhóm dành cho trạng thái nghỉ phép
                status: {
                    approved: "Đã chấp nhận",
                    disapproved: "Không chấp nhận",
                    waiting_for_approval: "Chờ phê duyệt",
                },

                // Nhóm dành cho action
                edit_annual_leave: "Chỉnh sửa thông tin nghỉ phép",
                delete_annual_leave: "Xoá thông tin nghỉ phép",
                add_annual_leave: "Thêm đơn xin nghỉ",
                add_annual_leave_title: "Thêm mới đơn xin nghỉ phép",

                staff_non_unit: "Nhân viên không thuộc đơn vị",
                // Thông điệp trả về từ server
                employee_code_duplicated: "Mã số nhân viên bị trùng lặp",
                employee_name_required: "Tên nhân viên không được để trống",
                employee_number_required: "Mã nhân viên không được để trống",
                staff_code_not_special:
                    "Mã nhân viên không được chứ ký tự đặc biệt",
                staff_code_not_find: "Mã nhân viên không tồn tại",
                start_date_annual_leave_required:
                    "Ngày bắt đầu không được để trống",
                end_date_annual_leave_required:
                    "Ngày kết thúc không được để trống",
                reason_annual_leave_required: "Lý do không được để trống",
                status_annual_leave_required: "Trạng thái không được để trống",
                get_annual_leave_success: "Lấy thông tin nghỉ phép thành công",
                get_annual_leave_faile: "Lấy thông tin nghỉ phép thất bại",
                create_annual_leave_success:
                    "Thêm đơn xin nghỉ phép thành công",
                create_annual_leave_faile: "Thêm đơn xin nghỉ phép thất bại",
                delete_annual_leave_success: "Xoá đơn xin nghỉ phép thành công",
                delete_annual_leave_faile: "Xoá đơn xin nghỉ phép thất bại",
                edit_annual_leave_success:
                    "Chỉnh sửa đơn xin nghỉ phép thành công",
                edit_annual_leave_faile: "Chỉnh sửa đơn xin nghỉ phép thất bại",
                aplication_annual_leave_success: "Thêm đơn xin nghỉ thành công",
                import_annual_leave_success: "Thêm dữ liệu từ file thành công",
                import_annual_leave_faile: "Thêm dữ liệu từ file thất bại",

                request_to_change_annualeave_success: "Yêu cầu chỉnh sửa đơn nghỉ phép thành công",
                request_to_change_annualeave_faile: "Yêu cầu chỉnh sửa đơn nghỉ phép thất bại",

                employee_invalid: 'Tài khoản chưa đăng ký thông tin nhân viên. Vui lòng kiểm tra lại',
            },

            // Quản lý khen thưởng kỷ luật
            commendation_discipline: {
                // Quản lý khen thưởng
                commendation: {
                    list_commendation: "Danh sách khen thưởng",
                    list_commendation_title:
                        "Danh sách nhân viên được khen thưởng",
                    file_name_export: "Bảng thống kê khen thưởng",

                    // Nhóm dành cho table
                    table: {
                        decision_date: "Ngày ra quyết định",
                        decision_number: "Số ra quyết định",
                        decision_unit: "Cấp ra quyết định",
                        reward_forms: "Hình thức khen thưởng",
                        reason_praise: "Thành tích (Lý do)",
                        reward_forms_short: "Hình thức",
                    },

                    // Nhóm dành cho action
                    add_commendation: "Thêm khen thưởng",
                    add_commendation_title: "Thêm mới khen thưởng",
                    edit_commendation: "Chỉnh sửa thông tin khen thưởng",
                    delete_commendation: "Xoá thông tin khen thưởng",

                    // Thông điệp trả về từ server
                    employee_number_required:
                        "Mã nhân viên không được để trống",
                    staff_code_not_special:
                        "Mã nhân viên không được chứ ký tự đặc biệt",
                    staff_code_not_find: "Mã nhân viên không tồn tại",
                    number_decisions_required:
                        "Số ra quyết định không được để trống",
                    number_decisions_have_exist: "Số ra quyết định đã tồn tại",
                    unit_decisions_required:
                        "Cấp ra quyết định không được để trống",
                    type_commendations_required:
                        "Hình thức khen thưởng không được để trống",
                    reason_commendations_required:
                        "Thành tích (lý do) khen thưởng không được để trống",
                    decisions_date_required:
                        "Ngày ra quyết định không được để trống",
                    get_commendations_success:
                        "Lấy danh sách khen thưởng thành công",
                    get_commendations_faile:
                        "Lấy danh sách khen thưởng thất bại",
                    create_commendations_success:
                        "Thêm mới khen thưởng thành công",
                    create_commendations_faile: "Thêm mới khen thưởng thất bại",
                    delete_commendations_success: "Xoá khen thưởng thành công",
                    delete_commendations_faile: "Xoá khen thưởng thất bại",
                    edit_commendations_success:
                        "Chỉnh sửa khen thưởng thành công",
                    edit_commendations_faile: "Chỉnh sửa khen thưởng thất bại",
                },

                // Quản lý ky luật
                discipline: {
                    list_discipline: "Danh sách kỷ luật",
                    list_discipline_title: "Danh sách nhân viên bị kỷ luật",
                    file_name_export: "Bảng thống kê kỷ luật",
                    start_date_before_end_date:
                        "Ngày có hiệu lực phải trước ngày hết hiệu lực",
                    end_date_after_start_date:
                        "Ngày hết hiệu lực phải sau ngày có hiệu lực",

                    // Nhóm dành cho table
                    table: {
                        start_date: "Ngày có hiệu lực",
                        end_date: "Ngày hết hiệu lực",
                        discipline_forms: "Hình thức kỷ luật",
                        reason_discipline: "Lý do kỷ luật",
                        discipline_forms_short: "Hình thức",
                    },

                    // Nhóm dành cho action
                    add_discipline: "Thêm kỷ luật",
                    add_discipline_title: "Thêm mới kỷ luật",
                    edit_discipline: "Chỉnh sửa thông tin kỷ luật",
                    delete_discipline: "Xoá thông tin kỷ luật",

                    // Thông điệp trả về từ server
                    employee_number_required:
                        "Mã nhân viên không được để trống",
                    staff_code_not_special:
                        "Mã nhân viên không được chứ ký tự đặc biệt",
                    staff_code_not_find: "Mã nhân viên không tồn tại",
                    number_decisions_required:
                        "Số ra quyết định không được để trống",
                    number_decisions_have_exist: "Số ra quyết định đã tồn tại",
                    unit_decisions_required:
                        "Cấp ra quyết định không được để trống",
                    type_discipline_required:
                        "Hình thức kỷ luật không được để trống",
                    reason_discipline_required:
                        "Lý do kỷ luật không được để trống",
                    start_date_discipline_required:
                        "Ngày có hiệu lực không được để trống",
                    end_date_discipline_required:
                        "Ngày hết hiệu lực không được để trống",
                    get_discipline_success: "Lấy danh sách kỷ luật thành công",
                    get_discipline_faile: "Lấy danh sách kỷ luật thất bại",
                    create_discipline_success: "Thêm mới kỷ luật thành công",
                    create_discipline_faile: "Thêm mới kỷ luật thất bại",
                    delete_discipline_success: "Xoá kỷ luật thành công",
                    delete_discipline_faile: "Xoá kỷ luật thất bại",
                    edit_discipline_success: "Chỉnh sửa kỷ luật thành công",
                    edit_discipline_faile: "Chỉnh sửa kỷ luật thất bại",

                    update_major_success: "Chỉnh sửa chuyên ngành thành công",
                    update_major_failure: "Chỉnh sửa chuyên ngành thất bại",

                    delete_major_success: "Xóa chuyên ngành thành công",
                    delete_major_failure: "Xóa chuyên ngành thất bại"
                },
            },

            // Quản lý thông tin nhân viên
            profile: {
                // Nhóm dùng chung cho chức năng quản lý tông tin nhân viên
                tab_name: {
                    menu_basic_infor: "Thông tin cơ bản",
                    menu_general_infor: "Thông tin chung",
                    menu_contact_infor: "Thông tin liên hệ",
                    menu_education_experience: "Học vấn - Kinh nghiệm",
                    menu_diploma_certificate: "Bằng cấp - Chứng chỉ",
                    menu_account_tax: "Tài khoản - Thuế",
                    menu_insurrance_infor: "Thông tin bảo hiểm",
                    menu_contract_training: "Hợp đồng - Đào tạo",
                    menu_reward_discipline: "Khen thưởng - Kỷ luật",
                    menu_salary_sabbatical: "Lịch sử lương - Nghỉ phép",
                    menu_attachments: "Tài liệu đính kèm",

                    menu_general_infor_title: "Thông tin chung của nhân viên",
                    menu_contact_infor_title: "Thông tin liên hệ của nhân viên",
                    menu_education_experience_title:
                        "Trình độ học vấn - kinh nghiệm làm việc",
                    menu_diploma_certificate_title: "Bằng cấp - Chứng chỉ",
                    menu_account_tax_title:
                        "Tài khoản ngân hàng - Thuế thu nhập cá nhân",
                    menu_insurrance_infor_title: "Thông tin bảo hiểm",
                    menu_contract_training_title:
                        "Hợp đồng lao động - Quá trình đào tạo",
                    menu_reward_discipline_title: "Khen thưởng - Kỷ luật",
                    menu_salary_sabbatical_title:
                        "Lịch sử tăng giảm lương - Thông tin nghỉ phép",
                    menu_attachments_title: "Tài liệu đính kèm",
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

                money: 'Mức lương đóng',
                staff_number: "Mã nhân viên",
                full_name: "Họ và tên",
                attendance_code: "Mã số chấm công",
                gender: "Giới tính",
                male: "Nam",
                female: "Nữ",
                date_birth: "Ngày sinh",
                place_birth: "Nguyên quán",
                email: "Email",
                email_company: "Email công ty",
                starting_date: "Ngày bắt đầu làm việc",
                leaving_date: "Ngày nghỉ việc",
                relationship: "Tình trạng hôn nhân",
                single: "Độc thân",
                married: "Đã kết hôn",
                upload: "Chọn ảnh",
                id_card: "Số CMND/CCCD/Hộ chiếu",
                date_issued: "Ngày cấp",
                issued_by: "Nơi cấp",
                ethnic: "Dân tộc",
                nationality: "Quốc tịch",
                religion: "Tôn giáo",
                active: "Làm việc chính thức",
                leave: "Đã nghỉ làm",
                career_fields: "Ngành nghề/lĩnh vực",
                maternity_leave: "Nghỉ thai sản",
                unpaid_leave: "Nghỉ không lương",
                probationary: "Đang thử việc",
                sick_leave: "Nghỉ ốm đau",
                status_work: "Tình trạng lao động",
                hours_off_remaining: "Số giờ nghỉ phép còn lại",

                mobile_phone: "Điện thoại di động",
                mobile_phone_1: "Điện thoại di động 1",
                mobile_phone_2: "Điện thoại di động 2",
                personal_email_1: "Email cá nhân 1",
                personal_email_2: "Email cá nhân 2",
                home_phone: "Điện thoại nhà riêng",
                emergency_contact: "Liên hệ khẩn cấp với ai",
                nexus: "Quan hệ",
                address: "Địa chỉ",
                permanent_address: "Hộ khẩu thường trú",
                current_residence: "Nơi ở hiện tại",
                wards: "Xã/Phường",
                district: "Huyện/Quận",
                province: "Tỉnh/Thành phố",
                nation: "Quốc gia",
                roles: "Chức danh",
                academic_level: "Trình độ học vấn",
                educational_level: "Trình độ văn hoá",
                language_level: "Trình độ ngoại ngữ",
                qualification: "Trình độ chuyên môn",
                intermediate_degree: "Trung cấp",
                colleges: "Cao đẳng",
                university: "Đại học",
                engineer: "Kỹ sư",
                bachelor: "Cử nhân",
                master_degree: "Thạc sỹ",
                engineer: 'Kỹ sư',
                bachelor: 'Cử nhân',
                phd: "Tiến sỹ",
                unavailable: "Khác",
                work_experience: "Kinh nghiệm làm việc",
                Working_process: "Quá trình công tác",
                job_description: "Công việc đã làm",
                reference_information: "Thông tin tham chiếu",
                unit: "Đơn vị công tác",
                position_in_task: "Chức vụ",
                project: 'Dự án',
                customer: "Khách hàng",
                from_month_year: "Từ tháng/năm",
                to_month_year: "Đến tháng/năm",
                edit_experience: "Chỉnh sửa kinh nghiệm làm việc",
                edit_working_process: "Chỉnh sửa quá trình công tác",
                add_working_process: "Thêm mới quá trình công tác",
                add_experience: "Thêm mới kinh nghiệm làm việc",

                diploma: "Bằng cấp",
                certificate: "Chứng chỉ",
                name_diploma: "Tên bằng cấp",
                name_certificate: "Tên chứng chỉ",
                diploma_issued_by: "Cơ sở đào tạo",
                graduation_year: "Năm tốt nghiệp",
                ranking_learning: "Xếp loại",
                attached_files: "File đính kèm",
                end_date_certificate: "Ngày hết hạn",
                edit_certificate: "Chỉnh sửa chứng chỉ",
                edit_diploma: "Chỉnh sửa bằng cấp",
                add_certificate: "Thêm mới chứng chỉ",
                add_diploma: "Thêm mới bằng cấp",
                excellent: "Xuất sắc",
                very_good: "Giỏi",
                good: "Khá",
                average_good: "Trung bình khá",
                ordinary: "Trung bình",
                unknown: "Chưa xác định",
                no_rating: "Không xếp loại",

                bank_account: "Tài khoản ngân hàng",
                personal_income_tax: "Mã số thuế thu nhập cá nhân",
                account_number: "Số tài khoản",
                bank_name: "Tên ngân hàng",
                bank_branch: "Chi nhánh",
                tax_number: "Mã số thuế",
                representative: "Đại diện của người nộp thuế",
                day_active: "Ngày cấp mã số thuế",
                managed_by: "Cơ quan quản lý thuế",

                bhyt: "Bảo hiểm y tế",
                number_BHYT: "Mã số BHYT",
                bhxh: "Bảo hiểm xã hội",
                number_BHXH: "Mã số BHXH",
                bhxh_process: "Quá trình đóng bảo hiểm xã hội",
                edit_bhxh: "Chỉnh sửa bảo hiểm xã hội",
                add_bhxh: "Thêm mới bảo hiểm xã hội",

                labor_contract: "Hợp đồng lao động",
                training_process: "Quá trình đào tạo",
                number_contract: "Số hợp đồng",
                name_contract: "Tên hợp đồng",
                type_contract: "Loại hợp đồng",
                start_date: "Ngày có hiệu lực",
                course_name: "Tên khoá học",
                start_day: "Ngày bắt đầu",
                end_date: "Ngày kết thúc",
                contract_end_date: "Ngày hết hạn hợp đồng",
                type_education: "Loại đào tạo",
                cost: "Chi phí",
                edit_contract: "Chỉnh sửa hợp đồng lao động",
                add_contract: "Thêm mới hợp đồng lao động",

                list_attachments: "Danh sách tài liệu đính kèm",
                attachments_code: "Nơi lưu trữ bản cứng",
                file_name: "Tên tài liệu",
                number: "Số lượng",
                add_default: "Mặc định",
                add_default_title: "Thêm các tài liệu mặc định",
                edit_file: "Chỉnh sửa tài liệu đính kèm",
                add_file: "Thêm tài liệu đính kèm",
                not_submitted_yet: "Chưa nộp",
                submitted: "Đã nộp",
                returned: "Đã trả lại",
                no_files: "Chưa có file",
                disc_diploma: "Bằng tốt nghiệp trình độ học vấn cao nhất",
                curriculum_vitae: "Sơ yếu lý lịch",
                disc_curriculum_vitae: "Sơ yếu lý lịch có công chứng",
                img: "Ảnh",
                disc_img: "Ảnh 4x6 ",
                copy_id_card: "Bản sao CMND/Hộ chiếu",
                disc_copy_id_card:
                    "Bản sao chứng minh thư nhân dân hoặc hộ chiếu có công chứng",
                health_certificate: "Giấy khám sức khoẻ",
                disc_health_certificate: "Giấy khám sức khoẻ có dấu đỏ",
                birth_certificate: "Giấy khai sinh",
                disc_birth_certificate: "Giấy khái sinh có công chứng",
                job_application: "Đơn xin việc",
                disc_job_application: "Đơn xin việc viết tay",
                commitment: "Cam kết",
                disc_commitment: "Giấy cam kết làm việc",
                temporary_residence_card: "Tạm trú tạm vắng",
                disc_temporary_residence_card: "Giấy xác nhận tạm trú tạm vắng",
                registration_book: 'Sổ hộ khẩu',
                add_staff: "Thêm nhân viên",

                reward: "Khen thưởng",
                discipline: "Kỷ luật",
                historySalary: "Lịch sử tăng giảm lương",
                sabbatical: "Thông tin nghỉ phép",

                // Validator dữ liệu nhập bên client
                start_date_before_end_date: "Ngày cấp phải trước ngày hết hạn",
                end_date_after_start_date: "Ngày hết hạn phải sau ngày cấp",
                time_experience_duplicate: "Thời gian làm việc bị trùng lặp",
                time_contract_duplicate:
                    "Thời gian hợp đồng lao động bị trùng lặp",
                time_BHXH_duplicate: "Quá trình đóng bảo hiểm bị trùng lặp",
                start_month_before_end_month:
                    "Từ tháng/năm phải trước đến tháng/năm",
                end_month_after_start_month:
                    "Đến tháng/năm phải sau từ tháng/năm",
                start_date_insurance_required:
                    "Ngày có hiệu lực chưa được nhập",
                starting_date_before_leaving_date:
                    "Thời gian bắt đầu làm việc phải trước thời gian nghỉ việc",
                leaving_date_after_starting_date:
                    "Thời gian nghỉ việc phải sau thời gian bắt đầu làm việc",
                starting_date_required: "Ngày bắt đầu làm việc chưa được nhập",

                // Quản lý thông tin cá nhân
                employee_info: {
                    export_bhxh: "Quá trình đóng bảo hiểm xã hội",
                    // Nhóm dành cho UI
                    note_page_personal:
                        "Tôi xin cam đoan những lời khai trên đây là đúng sự thật và chịu trách nhiệm cho những lời khai này.",
                    contact_other:
                        "(Những thông tin khác vui lòng liên hệ các bên liên quan để được xử lý)",
                    update_infor_personal: "Cập nhật thông tin nhân viên",
                    no_data_personal: "Bạn chưa có thông tin cá nhân",
                    no_data_personal_to_update:
                        "Bạn chưa có thông tin cá nhân để cập nhật",

                    guaranteed_infor_to_update:
                        "Bạn chưa cam đoan thông tin cần cập nhật",
                    no_change_data: "Không có thông tin nào được thay đổi",

                    // Thông điệp trả về từ server
                    get_infor_personal_success:
                        "Lấy thông tin cá nhân thành công",
                    get_infor_personal_faile: "Lấy thông tin cá nhân thất bại",
                    edit_infor_personal_success:
                        "Cập nhật thông tin cá nhân thành công",
                    edit_infor_personal_faile:
                        "Cập nhật thông tin cá nhân thất bại",
                },

                employee_management: {
                    // Nhóm dánh cho export excel
                    file_export_name: "Thông tin nhân viên",
                    export: {
                        sheet1: "1.Nhân viên",
                        sheet2: "2.HS Nhân viên - Quá trình CT",
                        sheet3: "3.HS Nhân viên - Kinh nghiệm",
                        sheet4: "4.HS Nhân viên - Bằng cấp",
                        sheet5: "5.HS Nhân viên - Chứng chỉ",
                        sheet6: "6.HS Nhân viên - Hợp đồng",
                        sheet7: "7.HS Nhân viên - Bảo hiểm XH",
                        sheet8: "8.HS Nhân viên - Tài liệu",
                        sheet9: "9.HS Nhân viên - Gia đình",
                        sheet10: "10.HS Nhân viên - Khen thưởng",
                        sheet11: "11.HS Nhân viên - Kỷ luật",
                        sheet12: "12.HS Nhân viên - Lương thưởng",
                        sheet13: "13.HS Nhân viên - Nghỉ phép",

                        emergency_contact_person: "Người liên hệ khẩn cấp",
                        relation_with_emergency_contact_person:
                            "Quan hệ với người liên hệ khẩn cấp",
                        emergency_contact_person_address:
                            "Địa chỉ người liên hệ khẩn cấp",
                        emergency_contact_person_phone_number:
                            "Điện thoại di động người liên hệ khẩn cấp",
                        emergency_contact_person_home_phone:
                            "Điện thoại nhà riêng người liên hệ khẩn cấp",
                        emergency_contact_person_email:
                            "Email người liên hệ khẩn cấp",
                        atmNumber: "Số tài khoản ngân hàng",
                        bank_address: "Chi nhánh ngân hàng",
                        health_insurance_start_date: "Ngày BHYT có hiệu lực",
                        health_insurance_end_date: "Ngày BHYT hết hạn",
                    },

                    import: {
                        import_general_infor: "Thông tin cơ bản",
                        import_experience: "Kinh nghiệm làm việc",
                        import_work_process: "Quá trình công tác",
                        import_degree: "Bằng cấp",
                        import_certificate: "Chứng chỉ",
                        import_contract: "Hợp đồng lao động",
                        import_socialInsurance_details: "Bảo hiểm xã hội",
                        import_file: "Tài liệu đính kèm",
                        import_family: "Thành viên hộ gia đình",

                        import_general_infor_title:
                            "Import thông tin nhân viên",
                        import_experience_title: "Import kinh nghiệm làm việc",
                        import_work_process_title: "Import quá trình công tác",
                        import_degree_title: "Import bằng cấp",
                        import_certificate_title: "Import chứng chỉ",
                        import_contract_title: "Import hợp đồng lao động",
                        import_socialInsurance_details_title:
                            "Import bảo hiểm xã hội",
                        import_file_title: "Import tài liệu đính kèm",
                        import_file_family: "Import thành viên hộ gia đình"
                    },

                    // Nhón dành cho UI
                    have: "Có",
                    staff: "nhân viên",
                    contract_expiration: "hết hạn hợp đồng",
                    and: "và",
                    have_birthday: "có sinh nhật",
                    this_month: "trong tháng này",

                    file_name_export: "Thông tin nhân viên",
                    staff_no_unit_title: "Do nhân viên chưa thuộc đơn vị nào",
                    no_gender: "Chọn giới tính",
                    all_gender: "Chọn tất cả giới tính",
                    brithday_lable: "Sinh nhật",
                    brithday_lable_title: "Tháng sinh nhật",
                    contract_lable: "Hết hạn hợp đồng",
                    contract_lable_title: "Tháng hết hạn hợp đồng",
                    contract_type_title: "Loại hợp đồng lao động",
                    employee_infor: "Thông tin nhân viên",

                    // Nhóm dành cho action
                    view_employee: "Xem thông tin nhân viên",
                    edit_employee: "Chỉnh sửa thông tin nhân viên",
                    delete_employee: "Xoá thông tin nhân viên",
                    add_employee: "Thêm nhân viên",
                    add_employee_title: "Thêm mới nhân viên",
                    add_by_hand: "Thêm một nhân viên",
                    add_import: "Thêm - Cập nhật dữ liệu từ file",
                    update_import: "Cập nhật dữ liệu từ file",

                    // Thông điệp trả về từ server
                    get_list_employee_success:
                        "Lấy danh sách nhân viên thành công",
                    get_list_employee_faile: "Lấy danh sách nhân viên thất bại",
                    create_employee_success: "Thêm mới nhân viên thành công",
                    create_employee_faile: "Thêm mới nhân viên thất bại",
                    delete_employee_success:
                        "Xoá thông tin nhân viên thành công",
                    delete_employee_faile: "Xoá thông tin nhân viên thất bại",
                    edit_employee_success:
                        "Chỉnh sửa thông tin nhân viên thành công",
                    edit_employee_faile:
                        "Chỉnh sửa thông tin nhân viên thất bại",
                    import_employee_success:
                        "Import thông tin nhân viên thành công",
                    importing_employee:
                        "Đang xử lí dữ liệu",
                    import_employee_faile:
                        "Import thông tin nhân viên thất bại",
                    employee_number_required:
                        "Mã nhân viên không được để trống",
                    email_in_company_required:
                        "Email công ty không được để trống",
                    employee_number_have_exist: "Mã nhân viên đã tồn tại",
                    staff_code_not_find: "Mã nhân viên không tồn tại",
                    email_in_company_have_exist: "Email công ty đã tồn tại",
                    email_in_company_not_have_exist: "Email công ty không tồn tại",
                    employee_timesheet_id_required:
                        "Mã số chấm công không được để trống",
                    employee_timesheet_id_have_exist: "Mã số chấm công đã tồn tại",
                    employee_timesheet_id_not_have_exist: "Mã số chấm công không tồn tại",
                    full_name_required: "Họ và tên không được để trống",
                    birthdate_required: "Ngày sinh không được để trống",
                    starting_date_required:
                        "Ngày bắt đầu làm việc không được để trống",
                    identity_card_number_required:
                        "Số chứng minh thư/hộ chiếu không được để trống",
                    identity_card_date_required:
                        "Ngày cấp chứng minh thư/hộ chiếu không được để trống",
                    identity_card_address_required:
                        "Nơi cấp chứng minh thư/hộ chiếu không được để trống",
                    phone_number_required: "Điện thoại di động 1",
                    tax_date_of_issue_required:
                        "Ngày hoạt động không được để trống",
                    tax_number_required: "Mã số thuế không được để trống",
                    tax_representative_required:
                        "Người đại diện không được để trống",
                    tax_authority_required:
                        "Cơ quan quản lý thuế không được để trống",
                    temporary_residence_required:
                        "Nơi ở hiện tại không được để trống",
                },
            },

            // Quản lý kế hoạch làm việc (lịch nghỉ lễ tết)
            work_plan: {
                file_name_export: "Kế hoạch làm việc",
                number_date_leave_of_year: "Số ngày nghỉ tối đa",
                date_year: "ngày/năm",
                year: "Năm",
                save_as: "Lưu lại",
                number_date: "Số ngày",
                list_holiday: "Thời gian nghỉ lễ, nghỉ tết",
                list_no_leave: "Thời gian không được xin nghỉ phép",
                list_auto_leave: "Thời gian được xin nghỉ phép",
                other: "Thời gian nghỉ khác",

                // Nhóm dành cho table
                table: {
                    type: "Thể loại",
                    timeline: "Các mốc thời gian",
                    start_date: "Ngày bắt đầu",
                    end_date: "Ngày kết thúc",
                    describe_timeline: "Mô tả",
                },

                // Nhóm thể loại kế hoạch làm Việc
                time_for_holiday: "Thời gian nghỉ lễ, nghỉ tết",
                time_allow_to_leave: "Thời gian được xin nghỉ phép",
                time_not_allow_to_leave: "Thời gian không được xin nghỉ phép",

                // Nhóm dành cho action
                edit_work_plan: "Chỉnh sửa kế hoạch làm việc",
                delete_work_plan: "Xoá kế hoạch làm việc",
                add_work_plan: "Thêm mới",
                add_work_plan_title: "Thêm mới kế hoạch làm việc",
                add_by_hand: "Thêm một kế hoạch làm việc",
                add_import: "Thêm dữ liệu từ file",
                accept_application: "Chấp nhận đơn xin nghỉ",
                refuse_application: "Từ chối đơn xin nghỉ",

                // Thông điệp trả về từ server
                type_required: "Thể loại không được để trống",
                start_date_required: "Thời gian bắt đầu không được để trống",
                end_date_required: "Thời gian kết thúc không được để trống",
                reason_required: "Mô tả kế hoạch làm việc không được để trống",
                work_plan_duplicate_required: "Thời gian bị trùng lặp",
                edit_number_date_leave_of_year_success:
                    "Thay đổi số ngày nghỉ trong một năm thành công",

                get_work_plan_success:
                    "Lấy danh sách kế hoạch làm việc thành công",
                get_work_plan_faile: "Lấy danh sách kế hoạch làm việc thất bại",
                create_work_plan_success:
                    "Thêm mới kế hoạch làm việc thành công",
                create_work_plan_faile: "Thêm mới kế hoạch làm việc thất bại",
                delete_work_plan_success: "Xoá kế hoạch làm việc thành công",
                delete_work_plan_faile: "Xoá kế hoạch làm việc thất bại",
                edit_work_plan_success:
                    "Chỉnh sửa kế hoạch làm việc thành công",
                edit_work_plan_faile: "Chỉnh sửa kế hoạch làm việc thất bại",
                import_work_plan_success:
                    "Import thông tin nghỉ lễ tết thành công",
                import_work_plan_faile: "Import thông tin nghỉ lễ tết thất bại",
            },

            dashboard_personal: {
                remind_work: "Nhắc việc tháng",
                number_annual_leave_in_year:
                    "Số ngày nghỉ phép còn lại trong năm",
                day: "ngày",
                task: "công việc",
                accountable: "phê duyệt",
                responsible: "thực hiện",
                consulted: "tư vấn",
                informed: "quan sát",
                task_total: "Tổng số Công việc",
                kpi_results: "Kết quả KPI",
                point: "điểm",
                overtime_total: "Tổng thời gian tăng ca",
                hours: "giờ",
                total_time_annual_leave: "Tổng thời gian nghỉ phép tháng",
                fullname: "Họ và tên",
                task_total: "Tổng số công việc",
                general_task: "Tổng hợp công việc tháng",
                see_all: "Xem tất cả",
                general_commendation: "Tổng hợp khen thưởng tháng",
                reason_praise: "Lý do khen thưởng",
                general_discipline: "Tổng hợp kỷ luật tháng",
                reason_discipline: "Lý do kỷ luật",

                general_annual_leave: "Tổng hợp tình hình nghỉ phép tháng",
                total_hours: "Tổng số giờ",
                total_hours_works: "Tổng số giờ",
                general_overtime: "Tổng hợp tình hình tăng ca tháng",
                not_org_unit: "Bạn chưa có đơn vị",

                trend_of_work: "Xu hướng làm việc",
            },

            // Quản lý ngành nghề lĩnh vực
            field: {
                // Nhóm dành cho table
                table: {
                    name: "Tên ngành nghề/lĩnh vực",
                    description: "Mô tả",
                },

                // Nhóm dành cho action
                edit_fields: "Chỉnh sửa ngành nghề/lĩnh vực",
                delete_fields: "Xoá ngành nghề/lĩnh vực",
                add_fields: "Thêm mới",
                add_fields_title: "Thêm mới ngành nghề/lĩnh vực",

                // Thông điệp trả về từ server
                get_fields_success:
                    "Lấy danh sách ngành nghề/lĩnh vực thành công",
                get_fields_fail: "Lấy danh sách ngành nghề/lĩnh vực thất bại",
                create_fields_success:
                    "Thêm mới ngành nghề/lĩnh vực thành công",
                create_fields_fail: "Thêm mới ngành nghề/lĩnh vực thất bại",
                delete_fields_success: "Xoá ngành nghề/lĩnh vực thành công",
                delete_fields_fail: "Xoá ngành nghề/lĩnh vực thất bại",
                edit_fields_success: "Chỉnh sửa ngành nghề/lĩnh vực thành công",
                edit_fields_fail: "Chỉnh sửa ngành nghề/lĩnh vực thất bại",
            },

            // Quản lý chấm công nhân viên
            timesheets: {
                file_name_export: "Bảng chấm công",
                symbol: " Ký hiệu",
                not_work: "Nghỉ làm",
                do_work: "Có đi làm",
                total_timesheets: "Số giờ làm",
                total_hours_off: "Số giờ nghỉ",
                total_over_time: "Số giờ tăng ca",
                work_date_in_month: "Công làm việc trong tháng",
                shift_work: "Ca làm việc",
                shifts1: "Ca 1",
                shifts2: "Ca 2",
                shifts3: "Tăng ca",
                date_of_month: "Các ngày trong tháng",

                // Nhóm dành cho action
                edit_timesheets: "Chỉnh sửa thông tin chấm công",
                delete_timesheets: "Xoá thông tin chấm công",
                add_timesheets: "Thêm mới",
                add_timesheets_title: "Thêm mới thông tin chấm công",
                add_by_hand: "Thêm một bảng công",
                add_import: "Thêm dữ liệu từ file",

                // Thông điệp trả về từ server
                employee_code_duplicated: "Mã số nhân viên bị trùng lặp",
                employee_name_required: "Tên nhân viên không được để trống",
                employee_number_required: "Mã nhân viên không được để trống",
                month_timesheets_required:
                    "Tháng chấm công không được để trống",
                staff_code_not_find: "Mã nhân viên không tồn tại",
                month_timesheets_have_exist: "Tháng chấm công đã tồn tại",
                get_timesheets_success: "Lấy thông tin chấm công thành công",
                get_timesheets_faile: "Lấy thông tin chấm công thất bại",
                create_timesheets_success:
                    "Thêm mới thông tin chấm công thành công",
                create_timesheets_faile:
                    "Thêm mới thông tin chấm công thất bại",
                edit_timesheets_success:
                    "Chỉnh sửa thông tin chấm công thành công",
                edit_timesheets_faile: "Chỉnh sửa thông tin chấm công thất bại",
                delete_timesheets_success: "Xoá thông tin chấm công thành công",
                delete_timesheets_faile: "Xoá thông tin chấm công thất bại",
                import_timesheets_success:
                    "Import thông tin chấm công thành công",
                import_timesheets_faile: "Import thông tin chấm công thất bại",
            },

            // Quản lý nhân sự các đơn vị
            manage_department: {
                edit_unit: "Chỉnh sửa nhân sự đơn vị",
                manager_unit: "Trưởng đơn vị",
                deputy_manager_unit: "Phó đơn vị",
                employee_unit: "Nhân viên đơn vị",
                email_employee: "Email nhân viên",
                add_employee_unit: "Thêm nhân viên",
            },

            // Nghỉ phép
            annual_leave_personal: {
                list_annual_leave: "Quy định về nghỉ phép của công ty",
                inform_annual_leave: "Thông tin nghỉ phép cá nhân",
                day: "ngày",
                total_number_leave_of_year: "Tổng số ngày nghỉ phép cả năm",
                leaved: "Bạn đã nghỉ",
                receiver: "Người nhận",

                // Nhóm action
                create_annual_leave: "Xin nghỉ phép",
            },
        },

        // Modules quản lý đào tạo
        training: {
            // Quản khoá đào tạo
            course: {
                // Nhóm dành cho UI
                study_at: "Học tại",
                from: "từ",
                to: "đến",
                with_lecturer: "với giảng viên",
                offered_by: "Đào tạo bởi",
                belong_type: "Thuộc loại",
                with_cost: "với chi phí",
                commitment_time: "và thời gian cam kết làm việc",
                month: "tháng",
                year: "năm",
                staff: "nhân viên",
                attend: "tham gia",

                no_course_type: "Chọn loại đào tạo",
                all_course_type: "Chọn tất cả loại đào tạo",
                start_date: "Thời gian bắt đầu",
                end_date: "Thời gian kết thúc",
                start_date_before_end_date:
                    "Thời gian bắt đầu phải trước thời gian kết thúc",
                end_date_after_start_date:
                    "Thời gian kết thúc phải sau thời gian bắt đầu",
                employee_attend: "Nhân viên tham gia",
                select_education_program: "Chọn chương trình đào tạo",

                table: {
                    course_code: "Mã khoá đào tạo",
                    course_name: "Tên khoá đào tạo",
                    start_date: "Bắt đầu",
                    end_date: "Kết thúc",
                    course_place: "Địa điểm đào tạo",
                    offered_by: "Đơn vị đào tạo",
                    course_type: "Loại đào tạo",
                    lecturer: "Giảng viên",
                    education_program: "Thuộc chương trình đào tạo",
                    cost: "Chi phí đào tạo",
                    employee_commitment_time:
                        "Thời gian cam kết (đơn vị: Tháng)",
                    result: "Kết quả",
                },

                // Loại đào tao
                type: {
                    internal: "Đào tạo nội bộ",
                    external: "Đào tạo ngoài",
                },

                // Kết quả đào tạo
                result: {
                    pass: "Đạt",
                    failed: "Không đạt",
                },

                // Nhóm action
                add_course: "Thêm khoá đào tạo",
                edit_course: "Chỉnh sửa khoá đào tạo",
                delete_course: "Xoá khoá đào tạo",
                view_course: "Thông tin khoá đào tạo",
                register: "Đăng ký",
                cancel_register: "Hủy đăng ký",

                // Thông điệp trả về từ server
                name_required: "Tên khoá đào tạo không được để trống",
                course_id_required: "Mã khoá đào tạo không được để trống",
                offered_by_required: "Đơn vị đào tạo không được để trống",
                course_place_required: "Địa điểm đào tạo không được để trống",
                start_date_required: "Thời gian bắt đầu không được để trống",
                end_date_required: "Thời gian kết thúc không được để trống",
                type_required: "Loại đào tạo không được để trống",
                education_program_required:
                    "Thuộc chương trình đào tạo không được để trống",
                employee_commitment_time_required:
                    "Thời gian cam kết không được để trống",
                cost_required: "Chi phí đào tạo không được để trống",
                course_id_have_exist: "Mã khoá đào tạo đã tồn tại",

                get_list_course_success:
                    "Lấy danh sách khoá đào tạo thành công",
                get_list_course_faile: "Lấy danh sách khoá đào tạo thất bại",
                create_course_success: "Thêm mới khoá đào tạo thành công",
                create_course_faile: "Thêm mới khoá đào tạo thất bại",
                delete_course_success: "Xoá khoá đào tạo thành công",
                delete_course_faile: "Xoá khoá đào tạo thất bại",
                edit_course_success: "Chỉnh sửa khoá đào tạo thành công",
                edit_course_faile: "Chỉnh sửa khoá đào tạo thất bại",
                status: {
                    register: "Trạng thái đăng ký",
                    is_not_registered: "Chưa đăng ký",
                    waiting_for_approval: "Đã đăng ký, Chờ phê duyệt",
                    success: "Được chấp nhận",
                    reject: "Bị từ chối"
                },
                admin: {
                    accept: "Chấp nhận",
                    reject: "Từ chối"
                }
            },

            // Quản lý chương trình đào tạo
            education_program: {
                education_program_code: "Mã chương trình đào tạo",
                education_program_name: "Tên chương trình đào tạo",
                detail: "Thông tin chi tiết",
                number_course: "Số khóa đào tạo",
                table: {
                    program_code: "Mã chương trình",
                    program_name: "Tên chương trình",
                    apply_for_organizational_units: "Áp dụng cho đơn vị",
                    apply_for_positions: "Áp dụng cho chức vụ",
                    total_courses: "Tổng số khoá học",
                },

                // Nhóm dành cho action
                add_education_program: "Thêm chương trình đào tạo",
                edit_education_program: "Chỉnh sửa chương trình đào tạo",
                delete_education_program: "Xoá chương trình đào tạo",
                view_education_program: "Thông tin chương trình đào tạo",

                // Thông điệp trả về từ server
                apply_for_organizational_units_required:
                    "Áp dụng cho đơn vị không được để trống",
                apply_for_positions_required:
                    "Áp dụng cho chức vụ không được để trống",
                program_id_required:
                    "Mã chương trình đào tạo không được để trống",
                name_required: "Tên chương trình đào tạo không được để trống",
                program_id_have_exist: "Mã chương trình đào tạo đã tồn tại",

                get_education_program_success:
                    "Lấy danh sách chương trình đào tạo thành công",
                get_education_program_faile:
                    "Lấy danh sách chương trình đào tạo thất bại",
                create_education_program_success:
                    "Thêm mới chương trình đào tạo thành công",
                create_education_program_faile:
                    "Thêm mới chương trình đào tạo thất bại",
                delete_education_program_success:
                    "Xoá chương trình đào tạo thành công",
                delete_education_program_faile:
                    "Xoá chương trình đào tạo thất bại",
                edit_education_program_success:
                    "Chỉnh sửa chương trình đào tạo thành công",
                edit_education_program_faile:
                    "Chỉnh sửa chương trình đào tạo thất bại",
            },
        },

        // Modules Quản lý tài sản
        asset: {
            general_information: {
                view_more: "Xem thêm",
                asset: "Tài sản",
                choose_asset: "Chọn tài sản",
                choose_all: "Chọn tất cả",
                asset_list: "Danh sách tài sản",
                search: "Tìm kiếm",
                add: "Thêm",
                basic_information: "Thông tin cơ bản",
                detail_information: "Thông tin chi tiết",
                asset_properties: "Các thuộc tính của tài sản",
                asset_default_properties: "Các thuộc tính mặc định của tài sản",
                view: "Xem thông tin tài sản",
                edit_info: "Chỉnh sửa thông tin tài sản",
                delete_info: "Xóa thông tin tài sản",
                save: "Lưu",
                edit: "Chỉnh sửa",
                delete: "Xóa",
                cancel: "Hủy",

                select_asset_type: "Chọn loại tài sản",
                select_asset_status: "Chọn trạng thái tài sản",
                asset_status: "Trạng thái tài sản",
                select_all_asset_type: "Chọn tất cả loại tài sản",
                select_all_status: "Chọn tất cả trạng thái",
                select_all_group: "Chọn tất cả nhóm tài sản",
                ready_use: "Sẵn sàng sử dụng",
                using: "Đang sử dụng",
                damaged: "Hỏng hóc",
                lost: "Mất",
                disposal: "Thanh lý",
                waiting: "Chờ xử lý",
                processed: "Đã xử lý",
                select_register: "Chọn quyền đăng ký",
                select_all_register: "Chọn tất cả quyền đăng ký",
                can_register: "Được phép đăng ký sử dụng",
                cant_register: "Không được phép đăng ký sử dụng",
                select_asset_lot: "Chọn lô tài sản",

                asset_code: "Mã tài sản",
                asset_name: "Tên tài sản",
                asset_type: "Loại tài sản",
                asset_group: "Nhóm tài sản",
                purchase_date: "Ngày nhập",
                purchase_date_start: "Ngày nhập từ ngày",
                purchase_date_end: "Ngày nhập đến ngày",
                manager: "Người quản lý",
                user: "Người sử dụng",
                organization_unit: "Đơn vị sử dụng",
                select_organization_unit: "Chọn đơn vị sử dụng",
                select_all_organization_unit: "Chọn tất cả đơn vị",
                handover_from_date: "Thời gian bắt đầu sử dụng",
                handover_to_date: "Thời gian kết thúc sử dụng",
                status: "Trạng thái",
                choose_status: "Chọn trạng thái",
                action: "Hành động",
                asset_value: "Giá trị tài sản",
                disposal_date: "Ngày thanh lý",
                not_disposal: "Chưa thanh lý",
                not_disposal_date: "Chưa nhập ngày thanh lý",
                asset_lot: "Lô tài sản",
                select_all_asset_lot: "Chọn tất cả lô tài sản",

                general_information: "Thông tin chung",
                usage_information: "Thông tin sử dụng",
                maintainance_information: "Thông tin bảo trì-sửa chữa",
                depreciation_information: "Thông tin khấu hao",
                incident_information: "Thông tin sự cố",
                disposal_information: "Thông tin thanh lý",
                attach_infomation: "Tài liệu đính kèm",

                serial_number: "Số serial",
                warranty_expiration_date: "Ngày hết hạn bảo hành",
                asset_location: "Vị trí tài sản",
                description: "Mô tả",
                can_register: "Quyền đăng ký",
                can_register_for_use: "Quyền đăng ký sử dụng",
                select_image: "Chọn ảnh",
                content: "Nội dung",
                form_code: "Mã phiếu",
                create_date: "Ngày lập",
                create_month: "Tháng lập",
                type: "Phân loại",
                choose_type: "Chọn phân loại",
                start_date: "Ngày bắt đầu",
                end_date: "Ngày hoàn thành",
                expense: "Chi phí",
                original_price: "Nguyên giá",
                residual_price: "Giá trị thu hồi ước tính",
                start_depreciation: "Thời gian bắt đầu trích khấu hao",
                end_depreciation: "Thời gian kết thúc trích khấu hao",
                depreciation_type: "Phương pháp khấu hao",

                incident_code: "Mã sự cố",
                reported_by: "Người báo cáo",
                incident_type: "Loại sự cố",
                date_incident: "Ngày phát hiện",
                select_incident_type: "Chọn loại sự cố",
                select_all_incident_type: "Chọn tất cả loại sự cố",

                disposal_date: "Ngày thanh lý",
                disposal_type: "Hình thức thanh lý",
                disposal_price: "Giá trị thanh lý",
                disposal_content: "Nội dung thanh lý",

                store_location: "Nơi lưu trữ bản cứng",
                file_name: "Tên tài liệu",
                number: "Số lượng",
                attached_file: "File đính kèm",

                select_role_to_use: "Chọn quyền đăng ký sử dụng",
                select_all_roles_to_use: "Chọn tất cả loại sử dụng",
                not_for_registering: "Không được đăng ký sử dụng",
                register_by_hour: "Đăng ký sử dụng theo giờ",
                register_for_long_term: "Đăng ký sử dụng lâu dài",

                create_reception_date: "Ngày lập phiếu",
                select_reception_type: "Chọn loại phiếu",
                select_all_reception_type: "Chọn tất cả loại phiếu",

                no_data: "Chưa có dữ liệu",
            },

            // Dashboard
            dashboard: {
                status_chart: "Biểu đồ thống kê tài sản theo trạng thái",
                group_chart: "Biểu đồ thống kê tài sản theo nhóm",
                cost_chart: "Biểu đồ thống kê tài sản theo giá trị",
                amount_of_asset: "Thống kê số lượng tài sản",
                value_of_asset: "Thống kê giá trị tài sản",
                depreciation_of_asset: "Thống kê hao mòn tài sản",
                bar_chart: "Biểu đồ cột",
                tree: "Cây",
                amount: "Số lượng",
                time: "Số lần",
                value: "Giá trị",
                maintainance_cost: "Chi phí bảo trì-sửa chữa",
                lost_value: "Giá trị hao mòn (Triệu)",
                lost: "Hao mòn",
                sum_value: "Tổng giá trị (Triệu)",
                building: "Mặt bằng",
                machine: "Máy móc",
                other: "Khác",
                asset_by_group: "Thống kê theo nhóm",
                asset_by_type: "Thống kê theo loại",
                asset_purchase_and_dispose: "Mua - thanh lý tài sản",
                purchase_asset: "Thống kê mua sắm tài sản",
                disposal_asset: "Thống kê thanh lý tài sản",
                asset_incident_and_maintenance: "Sự cố - bảo trì",
                incident_asset: "Thống kê sự cố tài sản",
                maintenance_asset: "Thống kê bảo trì-sửa chữa tài sản",
                statistic_by: "Thống kê theo",
                expired: "Đã hết hạn",
                remaining_time: "Thời gian còn lại",
            },

            //  Quản lý loại tài sản
            asset_type: {
                asset_type_code: "Mã loại tài sản",
                asset_type_name: "Tên loại tài sản",
                parent_asset_type: "Loại tài sản cha",

                //Thông điệp trả về từ server
                get_asset_type_success: "Lấy thông tin loại tài sản thành công",
                get_asset_type_faile: "Lấy thông tin loại tài sản thất bại",
                create_asset_type_success: "Thêm loại tài sản thành công",
                create_asset_type_failure: "Thêm loại tài sản thất bại",
                delete_asset_type_success: "Xoá loại tài sản thành công",
                delete_asset_type_failure: "Xoá loại tài sản thất bại",
                edit_asset_type_success:
                    "Chỉnh sửa thông tin loại tài sản thành công",
                edit_asset_type_faile:
                    "Chỉnh sửa thông tin loại tài sản thất bại",
                asset_type_name_exist: "Tên loại tài sản đã tồn tại",
                asset_type_number_exist: "Mã loại tài sản đã tồn tại",
                import_asset_type_success: "Nhập loại tài sản từ file thành công",
                import_asset_type_failure: "Nhập loại tài sản từ file thất bại",
            },

            // Quản lý thông tin tài sản
            asset_info: {
                asset_info: "Thông tin tài sản",
                field_name: "Tên thuộc tính",
                value: "Giá trị",

                usage_logs: "Lịch sử sử dụng",
                maintainance_logs: "Lịch sử bảo trì-sửa chữa",
                incident_list: "Danh sách sự cố tài sản",
                file_list: "Danh sách tài liệu đính kèm",
                edit_document: "Chỉnh sửa tài liệu đính kèm",
                add_usage_info: "Thêm mới thông tin sử dụng tài sản",
                edit_usage_info: "Chỉnh sửa phiếu đăng kí sử dụng",
                delete_usage_info: "Xóa thông tin cấp phát sử dụng",
                add_maintenance_card: "Thêm mới phiếu bảo trì-sửa chữa",
                edit_maintenance_card: "Chỉnh sửa phiếu bảo trì-sửa chữa",
                delete_maintenance_card: "Xóa phiếu bảo trì.sửa chữa",
                add_incident_info: "Thêm mới thông tin sự cố",
                edit_incident_info: "Chỉnh sửa thông tin sự cố",
                delete_incident_info: "Xóa thông tin sự cố",
                delete_asset_confirm: "Xóa tài sản này ?",

                usage_time: "Thời gian sử dụng",
                annual_depreciation: "Mức độ khấu hao trung bình hằng năm",
                monthly_depreciation: "Mức độ khấu hao trung bình hằng tháng",
                repair: "Sửa chữa",
                replace: "Thay thế",
                upgrade: "Nâng cấp",
                made: "Đã thực hiện",
                processing: "Đang thực hiện",
                unfulfilled: "Chưa thực hiện",
                destruction: "Tiêu hủy",
                sale: "Nhượng bán",
                give: "Tặng",

                select_group: "Chọn nhóm tài sản",
                building: "Mặt bằng",
                vehicle: "Xe cộ",
                machine: "Máy móc",
                other: "Khác",

                //Thông điệp trả về từ server
                get_asset_group_success: "Lấy thông tin nhóm tài sản thành công",
                get_asset_group_fail: "Lấy thông tin nhóm tài sản thất bại",
                get_asset_statistic_success: "Lấy thông tin trạng thái và giá trị tài sản thành công",
                get_asset_statistic_fail: "Lấy thông tin trạng thái và giá trị tài sản thất bại",
                get_asset_purchase_success: "Lấy thông tin mua tài sản thành công",
                get_asset_purchase_fail: "Lấy thông tin mua tài sản thất bại",
                get_asset_disposal_success: "Lấy thông tin thanh lý tài sản thành công",
                get_asset_disposal_fail: "Lấy thông tin thanh lý tài sản thất bại",
                get_asset_incident_success: "Lấy thông tin sự cố tài sản thành công",
                get_asset_incident_fail: "Lấy thông tin sự cố tài sản thất bại",
                get_asset_maintenance_success: "Lấy thông tin sự cố tài sản thành công",
                get_asset_maintenance_fail: "Lấy thông tin bảo trì tài sản thất bại",
                get_list_asset_success: "Lấy thông tin bảo trì tài sản thành công",
                get_list_asset_success: "Lấy thông tin tài sản thành công",
                get_list_asset_faile: "Lấy thông tin tài sản thất bại",
                create_asset_success: "Thêm tài sản thành công",
                create_asset_faile: "Thêm tài sản thất bại",
                delete_asset_success: "Xoá tài sản thành công",
                delete_asset_faile: "Xoá tài sản thất bại",
                edit_asset_success: "Chỉnh sửa thông tin tài sản thành công",
                edit_asset_faile: "Chỉnh sửa thông tin tài sản thất bại",
                asset_code_exist: "Mã tài sản đã tồn tại",
            },


            //Quản lý lô tài sản
            asset_lot: {
                asset_lot_code: "Mã lô tài sản",
                asset_lot_name: "Tên lô tài sản",
                supplier: "Nhà cung cấp",
                asset_lot_price: "Giá tiền",
                asset_lot_total: "Số lượng ban đầu",
                rule_generate_code: "Quy tắc đánh mã tài sản trong lô",
                start_number: "Ký tự bắt đầu",
                step_number: "Số tự tăng",
                generate_code: "Sinh tài sản",
                generate_asset_lot_code: "Sinh mã",

                view: "Xem thông tin lô tài sản",
                edit_info: "Chỉnh sửa thông tin lô tài sản",
                delete_info: "Xóa thông tin lô tài sản",

                //thông điệp trả về từ server
                create_asset_lot_success: "Thêm lô tài sản thành công",
                create_asset_lot_failed: "Thêm lô tài sản thất bại",
                asset_code_lot_exist: "Mã lô đã tồn tại",
                get_list_asset_lot_success: "Lấy danh sách lô tài sản thành công",
                get_list_asset_lot_false: "Lấy danh sách lô tài sản thất bại",
                update_asset_lot_success: "Cập nhật thông tin lô tài sản thành công",
                update_asset_lot_failed: "Cập nhật thông tin lô tài sản thất bại",
                delete_asset_lot_success: "Xóa lô tài sản thành công",
                delete_asset_lot_false: "Xóa lô tài sản thất bại",
                get_asset_lot_by_id_success: "Lấy thông tin lô tài sản thành công",
                get_asset_lot_by_id_false: "Lấy thông tin lô tài sản thất bại",


                assets_information: "Thông tin các tài sản trong lô"
            },

            // Quản lý bảo trì
            maintainance: {
                total_cost: "Tổng chi phí",

                //Thông điệp trả về từ server
                get_maintainance_success:
                    "Lấy thông tin bảo trì-sửa chữa thành công",
                get_maintainance_faile:
                    "Lấy thông tin thông tin bảo trì-sửa chữa thất bại",
                create_maintainance_success:
                    "Thêm phiếu bảo trì-sửa chữa thành công",
                create_maintainance_faile:
                    "Thêm phiếu bảo trì-sửa chữa thất bại",
                delete_maintainance_success:
                    "Xoá phiếu bảo trì-sửa chữa thành công",
                delete_maintainance_faile:
                    "Xoá phiếu bảo trì-sửa chữa thất bại",
                edit_maintainance_success:
                    "Chỉnh sửa thông tin phiếu bảo trì-sửa chữa thành công",
                edit_maintainance_faile:
                    "Chỉnh sửa thông tin phiếu bảo trì-sửa chữa thất bại",
            },

            // Quản lý sử dụng
            usage: {
                choose_status: "Chọn loại trạng thái",
                approved: "Đã phê duyệt",
                waiting_approval: "Chờ phê duyệt",
                not_approved: "Không phê duyệt",
                proponent: "Người đề nghị",
                recommend_units: "Đơn vị đề nghị",
                accountable: "Người phê duyệt",
                note: "Ghi chú",
                time_created: "Thời gian lập phiếu",
                task_in_use_request: "Công việc sử dụng tài sản",

                //Thông điệp trả về từ server
                get_usage_success: "Lấy thông tin sử dụng thành công",
                get_usage_faile: "Lấy thông tin sử dụng thất bại",
                create_usage_success:
                    "Thêm hoạt động sử dụng tài sản thành công",
                create_usage_faile: "Thêm hoạt động sử dụng tài sản thất bại",
                delete_usage_success:
                    "Xoá hoạt động sử dụng tài sản thành công",
                delete_usage_faile: "Xoá hoạt động sử dụng tài sản thất bại",
                edit_usage_success:
                    "Chỉnh sửa thông tin hoạt động sử dụng tài sản thành công",
                edit_usage_faile:
                    "Chỉnh sửa thông tin hoạt động sử dụng tài sản thất bại",
            },

            // Quản lý khấu hao
            depreciation: {
                depreciation_time: "Thời gian trích khấu hao",
                accumulated_value: "Giá trị hao mòn lũy kế",
                remaining_value: "Giá trị còn lại",
                edit_depreciation: "Chỉnh sửa thông tin kháu hao tài sản",

                estimated_production:
                    "Sản lượng theo công suất thiết kế (trong 1 năm)",
                months_production: "Sản lượng sản phẩm trong các tháng",
                production: "Sản lượng",
                select_depreciation_type: "Chọn phương pháp khấu hao",
                select_all_depreciation_type: "Chọn tất cả",
                line: "Phương pháp khấu hao đường thẳng",
                declining_balance: "Phương pháp khấu hao theo số dư giảm dần",
                units_production: "Phương pháp khấu hao theo sản lượng",

                //Thông điệp trả về từ server
                get_depreciation_success: "Lấy thông tin khấu hao thành công",
                get_depreciation_failure: "Lấy thông tin khấu hao thất bại",
                create_depreciation_success:
                    "Thêm thông tin khấu hao tài sản thành công",
                create_depreciation_failure:
                    "Thêm thông tin khấu hao tài sản thất bại",
                delete_depreciation_success:
                    "Xoá thông tin khấu hao tài sản thành công",
                delete_depreciation_failure:
                    "Xoá thông tin khấu hao tài sản thất bại",
                edit_depreciation_success:
                    "Chỉnh sửa thông tin khấu hao tài sản thành công",
                edit_depreciation_faile:
                    "Chỉnh sửa thông tin khấu hao tài sản thất bại",
            },

            // Quản lý sự cố
            incident: {
                incident: "Sự cố tài sản",
                report_incident: "Báo cáo sự cố tài sản",

                //Thông điệp trả về từ server
                get_incident_success: "Lấy thông tin sự cố tài sản thành công",
                get_incident_faile: "Lấy thông tin sự cố tài sản thất bại",
                create_incident_success: "Thêm sự cố tài sản thành công",
                create_incident_faile: "Thêm sự cố tài sản thất bại",
                delete_incident_success:
                    "Xoá thông tin sự cố tài sản thành công",
                delete_incident_faile: "Xoá thông tin sự cố tài sản thất bại",
                edit_incident_success:
                    "Chỉnh sửa thông tin sự cố tài sản thành công",
                edit_incident_faile:
                    "Chỉnh sửa thông tin sự cố tài sản thất bại",
            },

            // Quản lý đề nghị mua sắm tài sản
            manage_recommend_procure: {
                asset_recommend: "Tài sản đề nghị mua sắm",
                equipment_description: "Mô tả tài sản",
                add_recommend_card: "Thêm mới phiếu đề nghị mua sắm tài sản",
                view_recommend_card:
                    "Xem thông tin phiếu đề nghị mua sắm tài sản",
                edit_recommend_card: "Chỉnh sửa phiếu đề nghị mua sắm tài sản",
                delete_recommend_card: "Xóa phiếu đề nghị mua sắm tài sản",
                supplier: "Nhà cung cấp",
                unit: "Đơn vị tính",
                expected_value: "Giá trị dự tính",
            },

            // Quản lý đề nghị cấp phát
            manage_use_request: {
                //Thông điệp trả về từ server
                get_use_request_success:
                    "Lấy thông tin đề nghị cấp phát thiết bị thành công",
                get_use_request_failure:
                    "Lấy thông tin đề nghị cấp phát thiết bị thất bại",
                create_use_request_success:
                    "Thêm phiếu đề nghị cấp phát thiết bị thành công",
                create_use_request_failure:
                    "Thêm phiếu đề nghị cấp phát thiết bị thất bại",
                delete_use_request_success:
                    "Xoá phiếu đề nghị cấp phát thiết bị thành công",
                delete_use_request_failure:
                    "Xoá phiếu đề nghị cấp phát thiết bị thất bại",
                edit_use_request_success:
                    "Chỉnh sửa thông tin phiếu thành công",
                edit_use_request_failure: "Chỉnh sửa thông tin phiếu thất bại",
            },

            // Đăng ký mua sắm tài sản
            purchase_request: {
                //Thông điệp trả về từ server
                get_purchase_request_success:
                    "Lấy thông tin đề nghị mua sắm thiết bị thành công",
                get_purchase_request_failure:
                    "Lấy thông tin đề nghị mua sắm thiết bị thất bại",
                create_purchase_request_success:
                    "Thêm phiếu đề nghị mua sắm thiết bị thành công",
                create_purchase_request_failure:
                    "Thêm phiếu đề nghị mua sắm thiết bị thất bại",
                delete_purchase_request_success:
                    "Xoá phiếu đề nghị mua sắm thiết bị thành công",
                delete_purchase_request_failure:
                    "Xoá phiếu đề nghị mua sắm thiết bị thất bại",
                edit_purchase_request_success:
                    "Chỉnh sửa thông tin phiếu thành công",
                edit_purchase_request_failure:
                    "Chỉnh sửa thông tin phiếu thất bại",
                recommend_number_exist: "Mã phiếu đăng ký đã tồn tại",
            },

            // Đăng ký sử dụng thiết bị
            use_request: {
                //Thông điệp trả về từ server
                get_use_request_success:
                    "Lấy thông tin đề nghị cấp phát thiết bị thành công",
                get_use_request_failure:
                    "Lấy thông tin đề nghị cấp phát thiết bị thất bại",
                create_use_request_success:
                    "Thêm phiếu đề nghị cấp phát thiết bị thành công",
                create_use_request_failure:
                    "Thêm phiếu đề nghị cấp phát thiết bị thất bại",
                delete_use_request_success:
                    "Xoá phiếu đề nghị cấp phát thiết bị thành công",
                delete_use_request_failure:
                    "Xoá phiếu đề nghị cấp phát thiết bị thất bại",
                edit_use_request_success:
                    "Chỉnh sửa thông tin phiếu thành công",
                edit_use_request_failure: "Chỉnh sửa thông tin phiếu thất bại",
                recommendNumber_exists: "Mã phiếu đăng kí sử dụng tài sản đã tồn tại",
                dayUse_exists: "Thời gian sử dụng tài sản đã tồn tại",
            },
        },

        //Modules Quản lý vật tư tiêu hao
        supplies: {
            general_information: {
                add_supplies: "Thêm vật tư",
                edit_supplies: "Sửa vật tư",
                delete_supplies: "Xóa vật tư",
                view_supplies: "Thông tin vật tư",

                add_purchase_invoice: "Thêm hóa đơn",
                edit_purchase_invoice: "Sửa hóa đơn",
                delete_purchase_invoice: "Xóa hóa đơn",
                view_purchase_invoice: "Thông tin hóa đơn",

                add_allocation: "Thêm lịch sử cấp phát",
                edit_allocation: "Sửa lịch sử cấp phát",
                delete_allocation: "Xóa lịch sử cấp phát",
                view_allocation: "Thông tin lịch sử cấp phát",

                delete_recommend_card: "Xóa phiếu",
                edit_recommend_card: "Chỉnh sửa thông tin phiếu",
                view_recommend_card: "Thông tin chi tiết phiếu yêu cầu",
                add_recommend_card: "Thêm phiếu yêu cầu",

                supplies_information: "Thông tin vật tư",
                invoice_information: "Thông tin hóa đơn mua",
                allocation_information: "Thông tin lịch sử cấp phát",
                invoice_history_information: "Lịch sử chỉnh sửa",
                none_description: "Không có mô tả",

                //button
                add: "Thêm",
                select_approver: "Chọn người phê duyệt",
                search: "Tìm kiếm",
                select_supplies: "Chọn vật tư",
                select_all_supplies: "Chọn tất cả vật tư",

            },
            supplies_management: {
                code: "Mã vật tư",
                suppliesName: "Tên vật tư",
                totalPurchase: "Số lượng đã mua",
                totalAllocation: "Số lượng đã cấp phát",
                price: "Giá tham khảo",

                search_supplies_success: "Lấy danh sách vật tư thành công",
                search_supplies_failed: "Lấy danh sách vật tư thất bại",
                create_supplies_success: "Thêm vật tư thành công",
                supplies_code_exist: "Mã vật tư đã tồn tại",
                create_supplies_failed: "Thêm vật tư thất bại",
                update_supplies_success: "Cập nhật vật tư thành công",
                update_supplies_failed: "Cập nhật vật tư thất bại",
                delete_supplies_success: "Xóa vật tư thành công",
                delete_supplies_failed: "Xóa vật tư thất bại",
                get_supplies_by_id_success: "Lấy thông tin vật tư thành công",
                get_supplies_by_id_failed: "Lấy thông tin vật tư thất bại",

                delete_info: "Xóa thông tin vật tư",
            },
            allocation_management: {
                date: "Ngày cấp phát",
                supplies: "Vật tư",
                quantity: "Số lượng đã cấp",
                allocationToOrganizationalUnit: "Đơn vị được cấp phát",
                allocationToUser: "Người dùng được cấp phát",

                search_allocation_success: "Lấy danh sách lịch sử cấp phát thành công",
                search_allocation_failed: "Lấy danh sách lịch sử cấp phát thất bại",
                create_allocations_success: "Thêm lịch sử cấp phát thành công",
                allocation_code_exist: "Mã lịch sử cấp phát đã tồn tại",
                create_allocations_failed: "Thêm lịch sử cấp phát thất bại",
                update_allocation_success: "Cập nhật lịch sử cấp phát thành công",
                update_allocation_failed: "Cập nhật lịch sử cấp phát thất bại",
                delete_allocations_success: "Xóa lịch sử cấp phát thành công",
                delete_allocations_failed: "Xóa lịch sử cấp phát thất bại",
                get_allocation_by_id_success: "Lấy thông tin lịch sử cấp phát thành công",
                get_allocation_by_id_failed: "Lấy thông tin lịch sử cấp phát thất bại",

                delete_info: "Xóa thông tin cấp phát",
            },
            invoice_management: {
                codeInvoice: "Mã hóa đơn",
                supplies: "Vật tư",
                date: "Ngày mua",
                quantity: "Số lượng đã mua",
                price: "Giá mua",
                supplier: "Nhà cung cấp",

                search_purchase_invoice_success: "Lấy danh sách hóa đơn thành công",
                search_purchase_invoice_failed: "Lấy danh sách hóa đơn thất bại",
                create_purchase_invoices_success: "Thêm hóa đơn thành công",
                purchase_invoice_code_exist: "Mã hóa đơn đã tồn tại",
                create_purchase_invoices_failed: "Thêm hóa đơn thất bại",
                update_purchase_invoice_success: "Cập nhật hóa đơn thành công",
                update_purchase_invoice_failed: "Cập nhật hóa đơn thất bại",
                delete_purchase_invoices_success: "Xóa hóa đơn thành công",
                delete_purchase_invoices_failed: "Xóa hóa đơn thất bại",
                get_purchase_invoice_by_id_success: "Lấy thông tin hóa đơn thành công",
                get_purchase_invoice_by_id_failed: "Lấy thông tin hóa đơn thất bại",

                delete_info: "Xóa thông tin hóa đơn",
            },
            purchase_request: {
                recommendNumber: "Mã phiếu",
                dateCreate: "Ngày tạo phiếu",
                proponent: "Người đề nghị",
                suppliesName: "Tên vật tư",
                suppliesDescription: "Mô tả",
                supplier: "Nhà cung cấp",
                approver: "Người phê duyệt",
                total: "Số lượng",
                unit: "Đơn vị tính",
                estimatePrice: "Giá ước tính",
                note: "Ghi chú",
                status: "Trạng thái",
                files: "Tài liệu đính kèm",
                recommendUnits: "Đơn vị đề nghị",

                get_purchase_request_success:
                    "Lấy thông tin đề nghị mua sắm thiết bị thành công",
                get_purchase_request_failure:
                    "Lấy thông tin đề nghị mua sắm thiết bị thất bại",
                create_purchase_request_success:
                    "Thêm phiếu đề nghị mua sắm thiết bị thành công",
                create_purchase_request_failure:
                    "Thêm phiếu đề nghị mua sắm thiết bị thất bại",
                delete_purchase_request_success:
                    "Xoá phiếu đề nghị mua sắm thiết bị thành công",
                delete_purchase_request_failure:
                    "Xoá phiếu đề nghị mua sắm thiết bị thất bại",
                edit_purchase_request_success:
                    "Chỉnh sửa thông tin phiếu thành công",
                edit_purchase_request_failure:
                    "Chỉnh sửa thông tin phiếu thất bại",
                recommend_number_exist: "Mã phiếu đăng ký đã tồn tại",
            },

            dashboard: {
                valueInvoice: "Số tiền mua",
                countInvoice: "Số lượng mua",
                countAllocation: "Số lượng cung cấp",
            }
        },

        // Task template
        task_template: {
            search: "Tìm kiếm",
            search_by_name: "Tìm kiếm theo tên",
            select_all_units: "Chọn tất cả đơn vị",
            permission_view: "Người được xem",
            performer: "Người thực hiện",
            approver: "Người phê duyệt",
            observer: "Người quan sát",
            consultant: "Người tư vấn",
            formula: "Công thức tính điểm tự động",
            activity_list: "Danh sách hoạt động",
            information_list: "Danh sách thông tin",
            no_data: "Không có dữ liệu",
            edit: "Chỉnh sửa",
            save: "Lưu",
            close: "Đóng",
            add: "Thêm mới",
            import: "Thêm dữ liệu từ file",
            confirm: "Xác nhận",
            confirm_title: "Bạn chắc chắn muốn xóa mẫu công việc này?",
            error_title: "Không thể xóa mẫu công việc này do đã được sử dụng.",
            name: "Tên mẫu",
            unit: "Đơn vị quản lý công việc",
            tasktemplate_name: "Tên mẫu công việc",
            description: "Mô tả",
            count: "Số lần sử dụng",
            creator: "Người tạo mẫu",
            action: "Hành động",
            general_information: "Thông tin chung",
            parameters: "Tham số",
            roles: "Các vai trò",
            edit_tasktemplate: "Chỉnh sửa mẫu công việc",
            action_name: "Tên hoạt động",
            delete: "Xóa trắng",
            cancel_editing: "Hủy chỉnh sửa",
            mandatory: "Bắt buộc",
            add_tasktemplate: "Thêm mẫu công việc",
            infor_name: "Tên thông tin",
            datatypes: "Kiểu dữ liệu",
            manager_fill: "Chỉ quản lý được điền",
            text: "Văn bản",
            number: "Số",
            date: "Ngày tháng",
            value_set: "Tập giá trị",
            code: "Mã",
            view_detail_of_this_task_template: "Xem chi tiết mẫu công việc này",
            edit_this_task_template: "Sửa mẫu công việc này",
            delete_this_task_template: "Xóa mẫu công việc này",
            create_task_by_process: "Tạo công việc theo quy trình này",
            numberOfDaysTaken: "Số ngày dự kiến hoàn thành công việc",
        },

        task: {
            task_management: {
                get_subtask_success: "Lấy công việc con thành công",
                get_task_of_informed_employee_success:
                    "Lấy công việc theo vai trò người quan sát thành công",
                get_task_of_creator_success:
                    "Lấy công việc theo vai trò người tạo thành công",
                get_task_of_consulted_employee_success:
                    "Lấy công việc theo vai trò người tư vấn thành công",
                get_task_of_accountable_employee_success:
                    "Lấy công việc theo vai trò người phê duyệt thành công",
                get_task_of_responsible_employee_success:
                    "Lấy công việc theo vai trò người thực hiện",
                get_tasks_by_role_success:
                    "Lấy công việc tảo bởi người dùng thành công",
                get_task_by_id_success: "Lấy công việc theo id thành công",
                get_task_evaluation_success:
                    "Lấy thông tin đánh giá công việc thành công",
                get_all_task_success: "Lấy tất cả công việc thành công",
                get_task_dashboard_data_success: "Lấy dữ liệu dashboard thành công",
                create_task_success: "Tạo công việc mới thành công",
                delete_success: "Xóa công việc thành công",
                edit_status_of_task_success:
                    "Chỉnh sửa trạng thái công việc thành công",
                edit_status_archived_of_task: "Thay đổi trạng thái lưu kho",
                edit_status_archived_of_task_success:
                    "Chỉnh sửa trạng thái lưu kho của công việc thành công",

                get_subtask_fail: "Lấy công việc con thất bại",
                get_task_of_informed_employee_fail:
                    "Lấy công việc theo vai trò người quan sát thất bại",
                get_task_of_creator_fail:
                    "Lấy công việc theo vai trò người tạo thất bại",
                get_task_of_consulted_employee_fail:
                    "Lấy công việc theo vai trò người tư vấn thất bại",
                get_task_of_accountable_employee_fail:
                    "Lấy công việc theo vai trò người phê duyệt thất bại",
                get_task_of_responsible_employee_fail:
                    "Lấy công việc theo vai trò người thực hiện thất bại",
                get_tasks_by_role_fail: "Lấy công việc tạo bởi người ",
                get_task_by_id_fail: "Lấy công việc theo id thất bại",
                get_task_evaluation_fail:
                    "Lấy thông tin đánh giá công việc thất bại",
                get_all_task_fail: "Lấy tất cả công việc thất bại",
                get_task_dashboard_data_fail: "Lấy dữ liệu dashboard thất bại",
                create_task_fail: "không thể tạo công việc mới",
                delete_fail: "Không thể xóa công việc này",
                edit_status_of_task_fail:
                    "Không thể thay đổi trạng thái công việc",
                edit_status_archived_of_task_fail:
                    "Chỉnh sửa trạng thái lưu kho của công việc thất bại",
                task_status_error: "Trạng thái của công việc không cho phép lưu kho",
                confirm_delete:
                    "Không thể xóa công việc này vì công việc đang trong quá trình thực hiện!",

                responsible: "Người thực hiện",
                accountable: "Người phê duyệt",
                consulted: "Người tư vấn",
                creator: "Người thiết lập",
                informed: "Người quan sát",
                all_role: "Tất cả vai trò",

                responsible_role: "Thực hiện",
                accountable_role: "Phê duyệt",
                consulted_role: "Tư vấn",
                informed_role: "Quan sát",
                distribution_Of_Employee: "Đóng góp công việc",
                employees_each_chart: "Số nhân viên tối đa mỗi biểu đồ",
                task_is_not_linked_up_with_monthly_kpi:
                    "Công việc chưa được liên kết KPI tháng",
                no_task_is_not_linked: "Không có công việc nào ",
                loading_data: "Đang tải dữ liệu",
                task_has_action_not_evaluated:
                    "Công việc có hoạt động chưa đánh giá",
                no_task_has_action_not_evaluated: "Không có công việc nào",
                performer: "Người thực hiện",
                approver: "Người phê duyệt",

                add_task: "Thêm mới",
                add_title: "Thêm mới một công việc",
                add_subtask: "Thêm công việc con",

                department: "Đơn vị",
                select_department: "Chọn đơn vị",
                select_all_department: "Tất cả các đơn vị",
                role: "Vai trò",

                role_unit: "Vai trò đơn vị",
                select_role_organizational: "Chọn vai trò đơn vị",
                organizational_unit_management: "Đơn vị quản lý",
                organizational_unit_collaborate: "Đơn vị phối hợp",

                status: "Trạng thái",
                select_status: "Chọn trạng thái",
                select_all_status: "Chọn tất cả trạng thái",
                inprocess: "Đang thực hiện",
                wait_for_approval: "Chờ phê duyệt",
                finished: "Đã hoàn thành",
                delayed: "Tạm hoãn",
                canceled: "Bị hủy",
                requested_to_close: "Chờ phê duyệt kết thúc",
                task_status: "Trạng thái công việc",
                filter: "Lọc",

                priority: "Độ ưu tiên",
                select_priority: "Chọn mức độ ưu tiên",
                select_all_priority: "Chọn tất cả các mức",
                urgent: "Khẩn cấp",
                high: "Cao",
                standard: "Tiêu chuẩn",
                average: "Trung bình",
                low: "Thấp",
                coefficient: "Hệ số",

                special: "Đặc tính",
                creator_time: "Thời gian tạo",
                select_all_special: "Chọn tất cả các đặc tính",
                select_special: "Chọn đặc tính",
                select_all_role: "Chọn tất cả các vai trò",
                select_role: "Chọn vai trò",
                stored: "Lưu trong kho",
                current_month: "Tháng hiện tại",
                current_week: "Tuần hiện tại",

                assigned_collaborate: "Sắp xếp nhân viên cho công việc liên đơn vị",
                not_assigned: "Chưa xác nhận sắp xếp nhân viên",
                assigned: "Đã xác nhận sắp xếp nhân viên",
                none_select_assigned: "Không phân loại",
                role_in_collaborated_unit: "Phân công phối hợp thực hiện công việc cho",
                confirm_assigned: "Xác nhận đã sắp xếp nhân viên tham gia phối hợp",
                confirm_assigned_success: "Bạn đã xác nhận sắp xếp nhân viên tham gia phối hợp",
                confirm_assigned_failure:
                    "Bạn chưa xác nhận sắp xếp nhân viên tham gia phối hợp",
                unit_not_confirm_assigned_task:
                    "Đơn vị chưa xác nhận sắp xếp nhân viên tham gia phối hợp",

                name: "Tên công việc",
                search_by_name: "Tìm kiếm theo tên",
                search_by_employees: "Nhập tên hoặc email ",

                start_date: "Ngày bắt đầu",
                end_date: "Ngày kết thúc",
                task_additional_info: "Tùy chọn thêm",

                search: "Tìm kiếm",

                col_name: "Tên công việc",
                col_organization: "Đơn vị",
                col_project: "Dự án",
                col_priority: "Độ ưu tiên",
                col_start_date: "Ngày bắt đầu",
                col_end_date: "Ngày kết thúc",
                col_status: "Trạng thái",
                col_progress: "Tiến độ",
                col_logged_time: "Thời gian thực hiện",
                col_timesheet_log: "Thời gian bấm giờ",

                action_edit: "Băt đầu công việc",
                action_delete: "Xóa công việc",
                action_store: "Lưu vào kho",
                action_restore: "Lấy ra khỏi kho",
                action_add: "Thêm công việc con",
                action_start_timer: "Bắt đầu bấm giờ",

                from: "Từ ",
                to: "Đến",
                lower_from: "từ",
                lower_to: "đến",
                month: "Tháng",
                prev: "Trước",
                next: "Sau",
                tasks_calendar: "Lịch công việc",
                model_detail_task_title: "Thông tin chi tiết công việc",
                collaborative_tasks: "Nhiều người thực hiện",
                in_time: "Đúng tiến độ ",
                delayed_time: "Trễ tiến độ ",
                not_achieved: "Quá hạn ",

                err_organizational_unit: "Đơn vị đã bị xóa",
                err_name_task: "Tên đã bị xóa",
                err_priority: "Độ ưu tiên đã bị xóa",
                err_status: "Trạng thái đã bị xóa",
                err_start_date: "Ngày bắt đầu đã bị xóa",
                err_end_date: "ngày kết thúc đã bị xóa",
                err_progress: "Tiến độ công việc đã bị xóa",
                err_total_log_time: "Thời gian thực hiện công việc bị xóa",

                detail_refresh: "Làm mới",
                detail_edit: "Cập nhật công việc",
                detail_end: "Kết thúc",
                detail_evaluate: "Đánh giá",
                detail_start_timer: "Bấm giờ",
                detail_hide_info: "Ẩn thông tin",
                detail_show_info: "Hiện thông tin",
                detail_choose_role: "Chọn vai trò",
                detail_copy_task: "Nhân bản công việc",
                detail_save_as_template: "Lưu thành mẫu",
                detail_route: "Điều hướng",
                detail_route_task: "Điều hướng công việc",

                detail_link: "Công việc",
                detail_priority: "Độ ưu tiên",
                detail_status: "Trạng thái",
                detail_status_task: "Trạng thái công việc",
                average_task_result: "Kết quả trung bình công việc",
                detail_time: "Thời gian thực hiện",
                detail_average_results: "Kết quả trung bình công việc",

                detail_general_info: "Thông tin chung",
                detail_description: "Mô tả",
                detail_info: "Thông tin công việc",
                detail_progress: "Mức độ hoàn thành công việc",
                detail_value: "Giá trị",
                detail_not_hasinfo: "Chưa có thông tin",
                detail_eval: "Đánh giá công việc",
                detail_point: "Điểm các thành viên",
                detail_auto_point: "Điểm tự động",
                detail_emp_point: "Điểm tự đánh giá",
                detail_acc_point: "Điểm phê duyệt",
                detail_not_auto: "Chưa có điểm tự động",
                detail_not_emp: "Chưa tự đánh giá",
                detail_not_acc: "Chưa có điểm phê duyệt",
                detail_not_coefficient: "Không theo hệ số",
                detail_coefficient: "Theo hệ số",

                detail_not_eval_on_month: "Chưa đánh giá tháng này",
                detail_not_eval: "Chưa ai đánh giá công việc tháng này",
                detail_kpi: "Liên kết KPI",
                detail_not_kpi: "Chưa liên kết công việc với KPI tháng này",
                detail_all_not_kpi: "Chưa ai liên kết công việc với KPI",
                detailt_none_eval: "Chưa được đánh giá lần nào",

                detail_resp_edit:
                    "Chỉnh sửa công việc với vai trò người thực hiện",
                detail_acc_edit:
                    "Chỉnh sửa công việc với vai trò người phê duyệt",
                detail_resp_eval:
                    "Đánh giá công việc với vai trò người thực hiện",
                detail_acc_eval:
                    "Đánh giá công việc với vai trò người phê duyệt",
                detail_cons_eval: "Đánh giá công việc với vai trò người tư vấn",
                detail_resp_stop:
                    "Kết thúc công việc với vai trò người thực hiện",
                detail_acc_stop:
                    "Kết thúc công việc với vai trò người phê duyệt",
                detail_cons_stop: "Kết thúc công việc với vai trò người tư vấn",
                detail_task_permission:
                    "Công việc không tồn tại hoặc bạn không có quyền truy cập",

                evaluate_date: "Ngày đánh giá",
                evaluate_member: "Đánh giá thành viên tham gia công việc",
                detail_not_calc_auto_point: "Chưa tính được",
                detail_auto_on_system: "Điểm tự động đang lưu trên hệ thống",
                detail_not_auto_on_system: "Chưa có dữ liệu",
                action_not_rating: "Các hoạt động chưa được đánh giá tháng này",
                no_action: "Không có",
                contribution: "Đóng góp",
                not_eval: "Chưa đánh giá",
                acc_evaluate: "Đánh giá của người phê duyệt",
                name_employee: "Tên nhân viên",
                role_employee: "Vai trò",
                detail_emp_point_of: "Điểm tự đánh giá của",

                enter_emp_point: "Nhập điểm tự đánh giá",
                responsible_not_eval: "Người thực hiện chưa đánh giá",
                not_eval_on_month: "Chưa có thông tin đánh giá tháng này",

                edit_basic_info: "Thông tin cơ bản",
                edit_detail_info: "Thông tin chi tiết",
                edit_member_info: "Thông tin thành viên tham gia",
                edit_inactive_emp: "Thông tin thành viên rời khỏi công việc",
                edit_enter_progress: "Nhập mức độ hoàn thành",
                edit_enter_value: "Nhập giá trị",

                add_template: "Mẫu công việc",
                add_template_notice: "Hãy chọn mẫu công việc",
                add_parent_task: "Công việc cha",
                search_task_by_typing: "Nhập để tìm kiếm công việc cha",
                add_parent_task_notice: "Hãy chọn công việc cha",
                add_raci: "Phân định trách nhiệm",
                add_resp: "Chọn người thực hiện",
                add_acc: "Chọn người phê duyệt",
                add_cons: "Chọn người tư vấn",
                add_inform: "Chọn người quan sát",

                calc_form: "Thông tin công thức tính điểm tự động",
                calc_formula: "Công thức tính",
                calc_overdue_date: "Thời gian quá hạn",
                calc_day_used: "Thời gian làm việc tính đến ngày đánh giá",
                calc_average_action_rating:
                    "Trung bình cộng điểm đánh giá hoạt động",
                calc_failed_action_rating:
                    "Số hoạt động không đạt (rating < 5)",
                calc_passed_action_rating:
                    "Số hoạt động đạt (rating >= 5)",
                calc_all_action_rating: "Tổng các tích điểm hoạt động và độ quan trọng hoạt động của tất cả hoạt động",
                calc_progress: "Tiến độ công việc",
                calc_new_formula: "Công thức hiện tại",
                calc_total_day:
                    "Thời gian từ ngày bắt đầu đến ngày kết thúc công việc",
                calc_days: "ngày",
                calc_where: "Trong đó",
                calc_no_value: "Chưa có giá trị",
                calc_nan: "Không tính được",
                explain: " (Giá trị âm sẽ được tính là 0)",
                eval_list: "Danh sách các lần đánh giá",
                title_eval: "Đánh giá công việc",

                btn_save_eval: "Lưu đánh giá",
                btn_get_info: "Lấy thông tin",
                note_not_eval:
                    "Đã quá 7 ngày sau ngày đánh giá. Bạn không thể chỉnh sửa thêm!",
                note_eval: "Số ngày còn lại để chỉnh sửa đánh giá",

                add_eval_of_this_month: "Thêm đánh giá",
                eval_of: "Đánh giá tháng",
                eval_from: "Đánh giá từ ngày",
                eval_to: "Đến ngày",
                store_info:
                    "Lưu các giá trị trên vào thông tin công việc hiện tại",
                bool_yes: "Đúng",
                bool_no: "Sai",

                detail_evaluation: "Thông tin đánh giá công việc",
                err_eval_start: "Ngày đánh giá phải lớn hơn bằng ngày bắt đầu",
                err_eval_end: "Ngày đánh giá phải nhỏ hơn bằng ngày kết thúc",
                err_eval_on_month: "Ngày đánh giá phải là ngày trong tháng",

                info_eval_month: "Thông tin công việc trong đánh giá này",
                explain_avg_rating:
                    "Do chưa có hoạt động nào được đánh giá nên mặc định điểm đánh giá hoạt động là 10",
                explain_not_has_failed_and_passed_action:
                    " - (Do chưa có hành động nào, hoặc chưa hành động nào được đánh giá, nên số lượng hành động đạt sẽ được coi là bằng 1)",
                // " - (Do chưa có hành động nào được đánh giá qua hay không qua, nên số lượng hành động qua và không qua sẽ được coi bằng nhau và bằng 1)",

                auto_point_field: "Điểm công việc tự động trong đánh giá này",
                get_outside_info:
                    "Nhập tự động từ thông tin công việc hiện tại",

                dashboard_created: "Bạn đã tạo",
                dashboard_need_perform: "Bạn thực hiện",
                dashboard_need_approve: "Bạn phê duyệt",
                dashboard_need_consult: "Bạn tư vấn",
                dashboard_area_result: "Miền kết quả công việc",
                dashboard_overdue: "Công việc quá hạn",
                dashboard_about_to_overdue: "Công việc sắp hết hạn",
                dashboard_max: "Cao nhất",
                dashboard_min: "Thấp nhất",

                err_require: "Trường này phải có giá trị",
                err_date_required: "Ngày phải có giá trị",
                err_nan: "Giá trị phải là số",

                // mes_notice
                edit_task_success: "Chỉnh sửa công việc thành công",
                evaluate_task_success: "Đánh giá công việc thành công",
                edit_task_fail: "Chỉnh sửa công việc thất bại",
                evaluate_task_fail: "Đánh giá công việc thất bại",
                edit_hours_spent_in_evaluate_success:
                    "Tính thời gian trong lần đánh giá thành công",
                edit_hours_spent_in_evaluate_fail:
                    "Tính thời gian trong lần đánh giá thất bại",
                edit_employee_collaborated_success:
                    "Chỉnh sửa nhân viên tham gia công việc thành công",
                edit_employee_collaborated_failure:
                    "Chỉnh sửa nhân viên tham gia công việc thất bại",

                add_new_task: "Thêm công việc mới",
                // add_err:
                add_err_empty_unit: "Đơn vị không được để trống",
                add_err_empty_name: "Tên không được để trống",
                add_err_empty_description:
                    "Mô tả công việc không được để trống",
                add_err_empty_start_date: "Hãy chọn ngày bắt đầu",
                add_err_empty_end_date: "Hãy chọn ngày kết thúc",
                add_err_empty_responsible: "Cần chọn người thực hiện",
                add_err_empty_accountable: "Cần chọn người phê duyệt",

                add_err_special_character: "Tên không được chứa kí tự đặc biệt",
                add_err_end_date: "Ngày kết thúc phải sau ngày bắt đầu",
                date_not_empty: "Tháng tìm kiếm không được bỏ trống",

                unit_evaluate: "Đơn vị tiếp nhận kết quả đánh giá công việc",
                unit_manage_task: "Đơn vị quản lý",
                collaborated_with_organizational_units:
                    "Đơn vị phối hợp thực hiện",
                not_collaborated_with_organizational_units:
                    "Không có đơn vị phối hợp",
                task_empty_employee: "Không có người tham gia",
                delete_eval: "Xóa đánh giá tháng này",
                delete_eval_title: "Bạn có chắc chắn muốn xóa đánh giá này?",
                delete_evaluation_success: "Xóa đánh giá thành công",
                delete_evaluation_fail: "Xóa đánh giá thất bại",

                // confirm task
                confirm_task_success: "Xác nhận tham gia công việc thành công",
                confirm_task_failure: "Xác nhận tham gia công việc thất bại",

                // yêu cầu kết thúc công việc
                request_close_task_success: "Gửi yêu cầu kết thúc công việc thành công",
                cancel_request_close_task_success: "Hủy yêu cầu kết thúc công việc thành công",
                approval_close_task_success: "Phê duyệt yêu cầu kết thúc công việc thành công",
                decline_close_task_success: "Từ chối yêu cầu kết thúc công việc thành công",
                request_close_task_failure: "Gửi yêu cầu kết thúc công việc thất bại",
                cancel_request_close_task_failure: "Hủy yêu cầu kết thúc công việc thất bại",
                approval_close_task_failure: "Phê duyệt yêu cầu kết thúc công việc thất bại",
                decline_close_task_failure: "Từ chối yêu cầu kết thúc công việc thất bại",

                // Mở lại công việc
                open_task_again_success: 'Kích hoạt lại công việc thành công',
                open_task_again_failure: 'Kích hoạt lại công việc thất bại',
                confirm_open_task: 'Bạn có chắc chắn muốn kích hoạt lại công việc hiện tại không?',

                // warning
                warning: "Cảnh báo",
                not_have_evaluation: "Chưa có đánh giá công việc tháng này",
                warning_evaluate: "Sắp đến hạn đánh giá. Bạn cần đánh giá công việc tháng này",
                you_need: "Bạn cần",
                confirm_task: "xác nhận tham gia công việc này",
                not_confirm: "Chưa xác nhận công việc",

                left_task_expired: "còn lại là công việc bị hết hạn",
                action_not_rating: "Số hoạt động chưa được đánh giá tháng này",

                left_can_edit_task:
                    "Thời gian còn lại để chỉnh sửa đánh giá công việc tháng trước",

                // check deadline
                warning_days: "ngày",
                warning_hours: "giờ",
                warning_minutes: "phút",

                project: 'Thuộc dự án (nếu có)',

                //dashboard cv đơn vị
                type_of_point: "Loại điểm",
                criteria: "Tiêu chí",
                load_task: "Tải công việc",
                time: "Thời gian",
                load_task_chart: "Tải công việc cá nhân",
                load_task_chart_unit: "Tải công việc đơn vị",
                explain: "Giải thích",
                select_responsible: "Chọn người thực hiện",
                timer: "Bấm giờ",
                additional_timer: "Bấm bù giờ",
                interval_timer: "Bấm hẹn giờ",
                start_time: "Thời gian bắt đầu",
                end_time: "Thời gian kết thúc",
                timer_type: "Loại bấm giờ",

            },
            task_perform: {
                actions: "Hoạt động",
                communication: "Trao đổi",
                documents: "Tài liệu",
                timesheetlogs: "Lịch sử bấm giờ",
                subtasks: "Công việc con",
                change_history: "Lịch sử thay đổi",
                change_process: "Quy trình",
                change_incoming: "Dữ liệu vào",
                change_outgoing: "Dữ liệu ra",
                edit_action: "Sửa hoạt động",
                delete_action: "Xóa hoạt động",
                mandatory_action: "Hoạt động bắt buộc",
                confirm_action: "Xác nhận thực hiện",
                evaluation: "Đánh giá",
                attach_file: "Đính kèm file",
                comment: "Bình luận",
                result: "Báo cáo kết quả công việc",
                re_evaluation: "Đánh giá lại",
                question_delete_file: "Bạn có chắc chắn muốn xóa file",
                edit_comment: "Sửa bình luận",
                delete_comment: "Xóa bình luận",
                file_attach: "File đính kèm",
                save_edit: "Gửi chỉnh sửa",
                cancel: "Hủy bỏ",
                enter_comment: "Nhập bình luận",
                create_comment: "Thêm bình luận",
                enter_description: "Nhập mô tả",
                create_description: "Thêm mô tả",
                create_document: "Thêm tài liệu",
                none_description: "Không có mô tả",
                enter_action: "Nhập hoạt động",
                create_action: "Thêm hoạt động",
                total_time: "Tổng thời gian",
                time: "Thời gian",
                none_subtask: "Không có công việc con",
                enter_comment_action: "Nhập bình luận cho hoạt động",
                enter_result_action: "Nhập kết quả cho hoạt động",
                create_comment_action: "Thêm bình luận",
                stop_timer: "Dừng bấm giờ",
                edit: "Chỉnh sửa",
                delete: "Xóa",
                actions_not_perform: "Số hoạt động chưa thực hiện",

                notice_end_task: "Bạn có chắc chắn muốn kết thúc công việc này",
                notice_change_activate_task:
                    "Bạn có chắc chắn muốn kích hoạt công việc này",
                activated_task_list: "Các công việc đã kích hoạt",
                activated_all: "Đã kích hoạt hết các công việc phía sau",
                choose_following_task: "Chọn công việc thực hiện tiếp theo",
                task_link_of_process: "Đường liên kết",
                not_have_following: "Không có công việc kế tiếp",

                is_task_process: "Đây là công việc theo quy trình",
                activated_task: "Kích hoạt",
                following_task:
                    "Nhấn chuột để kích hoạt các công việc phía sau",

                // TODO: code_mesage_task_perform
                create_result_task_success:
                    "Đánh giá xong kết quả thực hiện công việc",
                edit_redult_task_success:
                    "Chỉnh sửa thành công kết quả đánh giá",
                get_task_actions_success: "Lấy tất cả hoạt động thành công",
                create_task_action_success: "Tạo hoạt động thành công",
                edit_task_action_success: "Sửa hoạt đông thành công",
                delete_task_action_success: "Xóa hoạt động thành công",
                get_action_comments_success:
                    "Lấy tất cả bình luận của hoạt động thành công",
                create_action_comment_success:
                    "Tạo bình luận hoạt động thành công",
                edit_action_comment_success:
                    "Sửa bình luận hoạt động thành công",
                delete_action_comment_success:
                    "Xóa bình luận hoạt động thành công",
                get_log_timer_success:
                    "Lấy tất cả lịch sử bấm giờ theo công việc thành công",
                get_timer_status_success:
                    "Lấy trạng thái bấm giờ hiện tại thành công",
                start_timer_success: "Bắt đầu bấm giờ thành công",
                pause_timer_success: "Tạm dừng bấm giờ thành công",
                continue_timer_success: "Tiếp tục bấm giờ thành công",
                stop_timer_success: "Kết thúc bấm giờ thành công",
                create_result_info_task_success:
                    "Tạo result info task thành công",
                create_result_infomation_task_success:
                    "Tạo result infomation task thành công",
                edit_result_infomation_task_success:
                    "Sửa result infomation task thành công",
                create_task_comment_success:
                    "Tạo thành công bình luận công việc",
                get_task_comments_success:
                    "Lấy tất cả bình luận của công việc thành công",
                edit_task_comment_success: "Sửa bình luận thành công",
                delete_task_comment_success: "Xóa bình luận thành công",
                create_comment_of_task_comment_success:
                    "Tạo bình luận thành công",
                edit_comment_of_task_comment_success:
                    "Sửa bình luận thành công",
                delete_comment_of_task_comment_success:
                    "Xóa bình luận thành công",
                evaluation_action_success: "Đánh giá hoạt động thành công",
                confirm_action_success: "Xác nhận hoạt động thành công",
                delete_file_child_task_comment_success:
                    "Xóa file của bình luận thành công",
                upload_file_success: "Upload file thành công",
                delete_file_success: "Xóa file của hoạt động thành công",
                delete_file_comment_of_action_success:
                    "Xóa file của bình luận thành công",
                delete_file_task_comment_success:
                    "Xóa file của bình luận thành công",
                create_task_log_success: " Tạo task log thành công",
                get_task_log_success: "Lấy lịch sử chỉnh sửa thành công",
                edit_task_information_success: "Chỉnh sửa thông tin thành công",
                edit_document_task_comment_success:
                    "Chỉnh sửa tài liệu thành công",

                create_result_task_fail:
                    "Không đánh giá được kết quả thực hiện công việc",
                edit_redult_task_fail: "Chỉnh sửa thất bại kết quả đánh giá",
                get_task_actions_fail:
                    "Lấy tất cả thông tin hoạt động thất bại",
                create_task_action_fail: "Tạo hoạt động thất bại",
                edit_task_action_fail: "Sửa hoạt đông thất bại",
                delete_task_action_fail: "Xóa hoạt động thất bại",
                get_action_comments_fail:
                    "Lấy tất cả bình luận hoạt động thất bại",
                create_action_comment_fail: "Tạo bình luận hoạt động thất bại",
                edit_action_comment_fail: "Sửa bình luận hoạt động thất bại",
                delete_action_comment_fail: "Xóa bình luận hoạt động thất bại",
                get_log_timer_fail:
                    "Lấy tất cả lịch sử bấm giờ theo công việc thất bại",
                get_timer_status_fail:
                    "Lấy trạng thái bấm giờ hiện tại thất bại",
                start_timer_fail: "Bắt đầu bấm giờ thất bại",
                timer_exist_another_task: "Bạn đã bấm giờ cho công việc khác",
                pause_timer_fail: "Tạm dừng bấm giờ thất bại",
                continue_timer_fail: "Tiếp tục bấm giờ thất bại",
                stop_timer_fail: "Kết thúc bấm giờ thất bại",
                create_result_info_task_fail: "Tạo result info task thất bại",
                create_result_infomation_task_fail:
                    "Tạo result infomation task thất bại",
                edit_result_infomation_task_fail:
                    "Sửa result infomation task thất bại",
                create_task_comment_fail: "Tạo bình luận công việc thất bại",
                get_task_comments_fail:
                    "Lấy tất cả bình luận công việc thất bại",
                edit_task_comment_fail: "Sửa bình luận thất bại",
                delete_task_comment_success: "Xóa bình luận thất bại",
                create_comment_of_task_comment_fail: "Tạo bình luận thất bại",
                edit_comment_of_task_comment_fail: "Sửa bình luận thất bại",
                delete_comment_of_task_comment_fail: "Xóa bình luận thất bại",
                evaluation_action_fail: "Đánh giá công việc thất bại",
                confirm_action_fail: "Xác nhận hoạt động thất bại",
                delete_file_child_task_comment_fail:
                    "Xóa file của bình luận thất bại",
                upload_file_fail: "Upload file thất bại",
                delete_file_fail: "Xóa file của hoạt động thất bại",
                delete_file_comment_of_action_fail:
                    "Xóa file của bình luận thất bại",
                delete_file_task_comment_fail:
                    "Xóa file của bình luận thất bại",
                create_task_log_fail: "Tạo lịch sử chỉnh sử cộng việc thất bại",
                get_task_log_fail:
                    "Lấy tất cả lịch sử chỉnh sửa công việc thất bại",
                edit_task_information_failure: "Chỉnh sửa thông tin thất bại",
                edit_document_task_comment_failure:
                    "Chỉnh sửa tài liệu thất bại",
                time_overlapping: 'Thời điểm bắt đầu không hợp lệ. (Tồn tại một công việc tắt bấm giờ tự động trong khoảng thời gian này)',

                // error label
                err_require: "Trường này phải có giá trị",
                err_date_required: "Ngày phải có giá trị",
                err_nan: "Giá trị phải là số",
                err_has_accountable: "Phải có ít nhất một người phê duyệt",
                err_has_consulted: "Phải có ít nhất một người tư vấn",
                err_has_responsible: "Phải có ít nhất một người thực hiện",

                // swal
                confirm: "Xác nhận",

                // log
                log_edit_basic_info: "Chỉnh sửa thông tin cơ bản",
                log_edit_name: "Tên công việc mới",
                log_edit_description: "MÔ tả công việc mới",
                log_edit_kpi: "Chỉnh sửa liên kết kpi",
                log_edit_kpi_new: "Liên kết KPI mới",
                log_edit_eval_info: "Chỉnh sửa thông tin đánh giá công việc",
                log_edit_progress: "Mức độ hoàn thành công việc mới",

                // modal approve task
                modal_approve_task: {
                    title: "Yêu cầu kết thúc công việc",
                    msg_success: "Đánh giá công việc thành công",
                    msg_false: "Không đánh giá được công việc",

                    task_info: "Thông tin công việc",
                    percent: "Công việc hoàn thành",

                    auto_point: "Điểm hệ thống",
                    employee_point: "Điểm tự đánh giá",
                    approved_point: "Điểm quản lí đánh giá",

                    responsible: "Vai trò người thực hiện",
                    consulted: "Vai trò người tư vấn",
                    accountable: "Vai trò người phê duyệt",

                    err_range: "Giá trị không được vượt quá khoảng 0-100",
                    err_contribute: "Tổng phần trăm đóng góp phải là 100",
                    err_not_enough_contribute:
                        "Tổng phần trăm đóng góp phải là 100",
                    err_empty: "Giá trị không được để trống",
                },

                request_close_task: 'Yêu cầu kết thúc công việc',
                approval_close_task: 'Phê duyệt kết thúc công việc',
                open_task_again: 'Kích hoạt lại công việc',
                send_request_close_task: 'Gửi yêu cầu',
                cancel_request_close_task: 'Hủy yêu cầu',
                approval_request_close_task: 'Phê duyệt',
                decline_request_close_task: 'Từ chối',
                status_task_close: 'Trạng thái khi kết thúc'
            },
            task_process: {
                process_name: "Tên quy trình",
                process_description: "Mô tả quy trình",
                num_task: "Số lượng công việc trong quy trình",
                process_status: "Trạng thái quy trình",
                creator: "Người tạo quy trình",
                manager: "Người quản lý",
                viewer: "Người được xem",
                no_data: "Không có dữ liệu",
                time_of_process: "Thời gian thực hiện quy trình",
                process_information: "Thông tin quy trình",
                start_date: "Ngày bắt đầu",
                end_date: "Ngày kết thúc",
                create: "Thêm mới",
                inprocess: "Đang thực hiện",
                wait_for_approval: "Chờ phê duyệt",
                finished: "Đã kết thúc",
                delayed: "Tạm hoãn",
                canceled: "Bị hủy",
                general_infomation: "Thông tin chung",
                notice: "Chú thích",
                information: "Thông tin xuất ra",
                document: "Tài liệu xuất ra",
                roles: "Các vai trò",
                list_of_data_and_info:
                    "Chọn thông tin và tài liệu xuất ra cho các công việc phía sau",
                not_have_doc: "Công việc này không có tài liệu",
                not_have_info: "Công việc này không có thông tin",
                task_process: "Quy trình công việc",

                export_doc: "Xuất tài liệu",
                export_info: "Xuất thông tin",

                create_task_with_template: "Tạo công việc với mẫu",

                add_modal: "Thêm mới mẫu quy trình công việc",
                view_process_template_modal: "Xem mẫu quy trình công việc",
                view_task_process_modal: "Xem quy trình công việc",
                edit_modal: "Chỉnh sửa mẫu quy trình công việc",
                add_task_process_modal:
                    "Thêm mới chuỗi công việc theo quy trình",

                save: "Lưu",

                // message from server
                get_all_success: "Lấy tất cả mẫu quy trình thành công",
                get_all_err: "Lấy tất cả mẫu quy trình lỗi",
                get_by_id_success: "Lấy mẫu quy trình theo id thành công",
                get_by_id_err: "Lấy mẫu quy trình theo id lỗi",
                create_success: "Tạo mẫu quy trình thành công",
                create_error: "Tạo mẫu quy trình thất bại",
                edit_success: "Chỉnh sửa mẫu quy trình thành công",
                edit_fail: "Chỉnh sửa mẫu quy trình thất bại",
                delete_success: "Xóa mẫu quy trình thành công",
                delete_fail: "Xóa mẫu quy trình thất bại",
                create_task_by_process_success:
                    "Tạo công việc theo quy trình thành công",
                create_task_by_process_fail:
                    "Tạo công việc theo quy trình thất bại",
                get_all_task_process_success:
                    "Lấy danh sach quy trình công việc thành công",
                get_all_task_process_fail:
                    "Lấy danh sach quy trình công việc thất bại",
                update_task_process_success:
                    "Cập nhật quy trình công việc thành công",
                update_task_process_fail:
                    "Cập nhật quy trình công việc thất bại",
                edit_info_process_success:
                    "Chỉnh sửa thông tin quy trình công việc thành công",
                edit_info_process_fail:
                    "Chỉnh sửa thông tin quy trình công việc thất bại",
                import_process_success:
                    "Thêm mẫu quy trình từ file excel thành công",
                import_process_fail:
                    "Thêm mẫu quy trình từ file excel thất bại",

                error: {
                    empty_name: "Tên quy trình không được bỏ trống",
                    special_character: "Tên không chứa ký tự đặc biệt",

                    empty_description: "Mô tả quy trình không được bỏ trống",

                    empty_viewer:
                        "Cần chỉ rõ những người có quyền xem mẫu quy trình",
                    empty_manager:
                        "Cần chỉ rõ những người quản lý mẫu quy trình",
                },
            },
            task_template: {
                create_task_template_success: "Tạo mẫu công việc thành công !",
                create_task_template_fail: "Tạo mẫu công việc thất bại !",
                edit_task_template_success: "Sửa mẫu công việc thành công !",
                edit_task_template_fail: "Sửa mẫu công việc thất bại !",
                delete_task_template_success: "Xóa mẫu công việc thành công !",
                delete_task_template_fail: "Xóa mẫu công việc thất bại !",
                error_task_template_creator_null:
                    "Nguời tạo mẫu công việc này không tồn tại hoặc đã bị xóa !",
                error_task_template_organizational_unit:
                    "Phòng ban của mẫu công việc này không tồn tại hoặc đã bị xóa !",
                view_task_process_template: "Xem mẫu quy trình công việc",
                import_task_template_success: "Thêm mẫu công việc thành công",
                import_task_template_failure: "Thêm mẫu công việc thất bại !",
                task_template_name_exist: "Tên mẫu công việc đã tồn tại",
                select_task_process_template:"Chọn quy trình mẫu",
                process_template_name:"Tên mẫu quy trình",
            },
            task_dashboard: {
                general_unit_task: "Tổng quan công việc",
                general_unit_task_title_file_export: "Tổng quan công việc đơn vị",
                unit: "Đơn vị",
                unit_lowercase: "đơn vị",
                of_unit: "của đơn vị",
                of: "của",
                all_tasks: "Tổng số công việc",
                all_tasks_inprocess: "Đang thực hiện",
                all_tasks_finished: "Đã hoàn thành",
                confirmed_task: "Đã xác nhận thực hiện",
                none_update_recently: "Chưa cập nhật trong 7 ngày qua",
                intime_task: "Đúng tiến độ",
                incoming_task: "Sắp hết hạn",
                delay_task: "Trễ tiến độ",
                overdue_task: "Quá hạn",
                no_task: "Không có công việc nào",
                unconfirmed_task: "Chưa xác nhận thực hiện",
                urgent_task: "Khẩn cấp",
                to_do_task: "Cần làm",
                day_ago: "ngày trước",
                rest: "Còn",
                updated: "Cập nhật",
                day: "ngày",
                overdue: "Quá hạn",
                task_name: "Công việc",
                start_date: "Ngày bắt đầu",
                end_date: "Ngày kết thúc",
                statistical_timesheet_logs: "Thống kê bấm giờ",
                statistical_timesheet_logs_unit: "Thống kê bấm giờ đơn vi",
                from: "từ",
                to: "đến",
                index: "STT",
                name: "Họ và tên",
                totalhours: "Tổng thời gian bấm giờ",
                autotimer: "Bấm hẹn giờ",
                logtimer: "Bấm bù giờ",
                manualtimer: "Bấm giờ"
            }
        },

        kpi: {
            general: {
                show: "Xem"
            },
            employee: {
                get_kpi_by_member_success:
                    "Lấy KPI thành viên theo người thiết lập thành công",
                get_kpi_by_member_fail:
                    "Lấy KPI thành theo người thiết lập viên lỗi",
                get_kpi_responsible_success:
                    "Lấy tất cả KPI cá nhân của người thực hiện trong công việc thành công",
                get_kpi_responsible_fail:
                    "Lấy tất cả KPI cá nhân của người thực hiện trong công việc lỗi",

                //Nhóm dành cho module creation
                employee_kpi_set: {
                    create_employee_kpi_set: {
                        // Module chính
                        // Nhóm dành cho các thông tin chung
                        general_information: {
                            general_information: "KPI cá nhân tháng",
                            save: "Lưu chỉnh sửa",
                            edit: "Chỉnh sửa",
                            delete: "Xóa KPI này",
                            cancel: "Hủy",
                        },
                        overview: "Tổng quan",
                        evaluation: "Đánh giá",
                        time: "Thời gian",
                        approver: "Người phê duyệt",
                        weight_total: "Tổng trọng số",
                        not_satisfied: "Chưa thỏa mãn",
                        satisfied: "Thỏa mãn",
                        initialize_kpi_newmonth: "Khởi tạo KPI tháng",
                        request_approval: "Yêu cầu phê duyệt",
                        cancel_request_approval: "Hủy yêu cầu phê duyệt",
                        not_initialize_organiztional_unit_kpi:
                            "Đơn vị cấp trên của bạn chưa thiết lập KPI. Liên hệ với trưởng đơn vị để hỏi thêm",
                        not_activate_organiztional_unit_kpi:
                            "Đơn vị cấp trên của bạn chưa kích hoạt KPI. Liên hệ với trưởng đơn vị để hỏi thêm",
                        // Nhóm dành cho các trạng thái tập KPI
                        kpi_status: {
                            status: "Trạng thái KPI",
                            setting_up: "Đang thiết lập",
                            awaiting_approval: "Chờ phê duyệt",
                            activated: "Đã kích hoạt",
                            finished: "Đã kết thúc",
                        },

                        // Nhóm dành cho các trạng thái mục tiêu KPI
                        check_status_target: {
                            not_approved: "Chưa phê duyệt",
                            edit_request: "Yêu cầu chỉnh sửa",
                            activated: "Đã kích hoạt",
                            finished: "Đã kết thúc",
                        },

                        // Nhóm dành cho table
                        target_list: "Danh sách mục tiêu",
                        add_target: "Thêm mục tiêu",
                        no_: "Stt",
                        target_name: "Tên mục tiêu",
                        parents_target: "Mục tiêu cha",
                        evaluation_criteria: "Tiêu chí đánh giá",
                        weight: "Trọng số",
                        status: "Trạng thái",
                        action: "Hành động",
                        not_initialize: "Chưa khởi tạo KPI tháng ",

                        // Nhóm dành cho phản hồi
                        submit: {
                            feedback: "Phản hồi",
                            send_feedback: "Gửi phản hồi",
                            cancel_feedback: "Hủy",
                        },

                        // Nhóm dành cho các handle
                        handle_edit_kpi: {
                            approving:
                                "KPI đang được phê duyệt, bạn không thể chỉnh sửa. Nếu muốn sửa đổi hãy liên hệ với quản lý của bạn!",
                            activated:
                                "KPI đã được kích hoạt, bạn không thể chỉnh sửa. Nếu muốn sửa đổi hãy liên hệ với quản lý của bạn!",
                            finished:
                                "KPI đã kết thúc, bạn không thể chỉnh sửa!",
                        },
                        request_approval_kpi: {
                            approve:
                                "Bạn chắc chắn muốn quản lý phê quyệt KPI này?",
                            not_enough_weight: "Tổng trọng số phải bằng 100",
                        },
                        cancel_approve: {
                            cancel:
                                "Bạn chắc chắn muốn hủy yêu cầu phê duyệt KPI này?",
                            activated:
                                "KPI đã được kích hoạt bạn không thể hủy bỏ yêu cầu phê duyệt, nếu muốn sửa đổi hãy liên hệ với quản lý của bạn!",
                        },
                        action_title: {
                            edit: "Chỉnh sửa",
                            content:
                                "Đây là mục tiêu mặc định (nếu cần thiết có thể sửa trọng số)",
                            delete: "Xóa",
                        },
                        edit_target: {
                            approving:
                                "KPI đang được phê duyệt, Bạn không thể chỉnh sửa!",
                            activated:
                                "KPI đã được kích hoạt, Bạn không thể chỉnh sửa!",
                            evaluated:
                                "KPI đã được đánh giá, Bạn không thể chỉnh sửa!",
                        },
                        delete_kpi: {
                            kpi: "Bạn chắc chắn muốn xóa KPI này?",
                            kpi_target:
                                "Bạn chắc chắn muốn xóa mục tiêu KPI này?",
                            approving:
                                "KPI đang được phê duyệt, bạn không thể xóa!",
                            activated:
                                "KPI đã được kích hoạt, bạn không thể xóa!",
                        },
                        add_new_target: {
                            approving:
                                "KPI đang được phê duyệt, bạn không thể thêm mới!",
                            activated:
                                "KPI đã được kích hoạt, bạn không thể thêm mới!",
                        },
                        handle_populate_info_null: {
                            error_kpi_approver_null:
                                "Người phê duyệt tập KPI này không tồn tại hoặc đã bị xóa",
                            error_kpi_organizational_unit_null:
                                "Đơn vị của tập KPI này không tồn tại hoặc đã bị xóa",
                            error_kpi_parent_target_null:
                                "Mục tiêu cha của mục tiêu này đã bị xóa hoặc không tồn tại",
                            error_kpi_targets_list_null:
                                "Danh sách mục tiêu của tập KPI đã bị xóa hoặc không tồn tại",
                        },
                    },

                    create_employee_kpi_modal: {
                        // Module con
                        // Nhóm dành cho modal
                        create_employee_kpi: "Thêm mục tiêu KPI cá nhân",
                        name: "Tên mục tiêu",
                        parents: "Mục tiêu cha",
                        evaluation_criteria: "Tiêu chí đánh giá",
                        weight: "Trọng số",

                        // Nhóm dành cho validate
                        validate_weight: {
                            empty: "Trọng số không được để trống",
                            less_than_0: "Trọng số không được nhỏ hơn 0",
                            greater_than_100: "Trọng số không được lớn hơn 100",
                        },
                    },

                    kpi_member_manager: {
                        index: "STT",
                        time: "Thời gian",
                        employee_name: "Tên nhân viên",
                        target_number: "Số lượng mục tiêu",
                        kpi_status: "Trạng thái KPI",
                        result: "Kết quả",
                        approve: "Phê duyệt",
                        evaluate: "Đánh giá",
                    },

                    create_employee_kpi_set_modal: {
                        // Module con
                        // Nhóm dành cho modal
                        initialize_kpi_set: "Khởi tạo KPI cá nhân",
                        organizational_unit: "Đơn vị",
                        month: "Tháng",
                        approver: "Người phê duyệt",
                        default_target: "Mục tiêu mặc định",
                    },

                    edit_employee_kpi_modal: {
                        // Mudule con
                        // Nhóm dành cho modal
                        edit_employee_kpi: "Chỉnh sửa mục tiêu KPI cá nhân",
                        name: "Tên mục tiêu",
                        parents: "Mục tiêu cha",
                        evaluation_criteria: "Mô tả tiêu chí đánh giá",
                        weight: "Trọng số",
                    },

                    //Thông điệp trả về từ server
                    messages_from_server: {
                        initialize_employee_kpi_set_success:
                            "Khởi tạo tập KPI nhân viên thành công",
                        initialize_employee_kpi_set_failure:
                            "Khởi tạo tập KPI nhân viên thất bại",

                        create_employee_kpi_success:
                            "Thêm mục tiêu KPI thành công",
                        create_employee_kpi_failure:
                            "Thêm mục tiêu KPI thất bại",

                        edit_employee_kpi_set_success:
                            "Chỉnh sửa tập KPI nhân viên thành công",
                        edit_employee_kpi_set_failure:
                            "Chỉnh sửa tập KPI nhân viên thất bại",
                        delete_employee_kpi_set_success:
                            "Xóa KPI tập KPI nhân viên thành công",
                        delete_employee_kpi_set_failure:
                            "Xóa KPI tập KPI nhân viên thất bại",

                        approve_success:
                            "Xác nhận yêu cầu phê duyệt thành công",
                        approve_failure: "Xác nhận yêu cầu phê duyệt thất bại",

                        delete_employee_kpi_success:
                            "Xóa mục tiêu KPI thành công",
                        delete_employee_kpi_failure:
                            "Xóa mục tiêu KPI thất bại",

                        edit_employee_kpi_success:
                            "Chỉnh sửa mục tiêu KPI thành công",
                        edit_employee_kpi_failure:
                            "Chỉnh sửa mục tiêu KPI thất bại",
                    },
                },
            },
            evaluation: {
                dashboard: {
                    organizational_unit: "Đơn vị",
                    select_units: "Chọn đơn vị",
                    all_unit: "Tất cả đơn vị",
                    search: "Tìm kiếm",
                    setting_up: "Đang thiết lập",
                    awaiting_approval: "Chờ phê duyệt",
                    activated: "Đã kích hoạt",
                    not_initial: "Chưa khởi tạo",
                    number_of_employee: "Số nhân viên",
                    number_of_child_unit: "Đơn vị con",
                    excellent_employee: "Nhân viên ưu tú",
                    best_employee: "Nhân viên xuất sắc nhất",
                    month: "Tháng",
                    auto_point: "Điểm tự động",
                    employee_point: "Điểm tự đánh giá",
                    approve_point: "Điểm người phê duyệt đánh giá",
                    option: "Tùy chọn",
                    analyze: "Phân tích",
                    statistics_chart_title:
                        "Thống kê kết quả KPI của nhân viên",
                    result_kpi_titile: "Kết quả KPI tất cả nhân viên",
                    auto_eva: "Điểm hệ thống",
                    employee_eva: "Điểm tự đánh giá",
                    approver_eva: "Điểm phê duyệt",
                    result_kpi_personal: "Kết quả KPI cá nhân",
                    distribution_kpi_personal: "Đóng góp KPI cá nhân",
                },

                employee_evaluation: {
                    /**
                     * Approve
                     */
                    approve_KPI_employee: "Phê duyệt KPI",
                    show_logs: "Lịch sử  chỉnh sửa KPI",
                    month: "Tháng",
                    end_compare: "Tắt so sánh",
                    compare: "So sánh",
                    approve_all: "Phê duyệt tất cả",
                    choose_month_cmp: "Chọn tháng so sánh",
                    kpi_this_month: "KPI tháng",
                    search: "Tìm kiếm",
                    index: "STT",
                    number_of_targets: "Số mục tiêu",
                    system_evaluate: "Điểm tự động",
                    result_self_evaluate: "Điểm tự đánh giá",
                    evaluation_management: "Điểm người phê duyệt",
                    not_evaluated_yet: "Chưa đánh giá",
                    target: "mục tiêu",
                    view_detail: "Xem chi tiết",
                    clone_to_new_kpi: "Tạo KPI tháng mới từ KPI tháng này",
                    name: "Tên",
                    target: "Mục tiêu đơn vị",
                    criteria: "Tiêu chí đánh giá",
                    weight: "Trọng số",
                    result: "Kết quả đánh giá",
                    data_not_found: "Không tìm thấy dữ liệu phù hợp",
                    unsuitable_weight: "Trọng số không thỏa mãn",
                    unsuitable_approval: "Đang chỉnh sửa không được phê duyệt",
                    status: "Trạng thái",
                    action: "Hành động",
                    save_result: "Lưu kết quả",
                    edit_target: "Sửa mục tiêu",
                    pass: "Đạt",
                    fail: "Không đạt",
                    /**
                     * Comment
                     */
                    edit_cmt: "Chỉnh sửa bình luận",
                    delete_cmt: "Xóa bình luận",
                    add_cmt: "Thêm bình luận",
                    attached_file: "Đính kèm tệp",
                    send_edition: "Gửi chỉnh sửa",
                    cancel: "Hủy",
                    comment: "Bình luận",
                    /**
                     * Evaluate
                     */
                    KPI_list: "Danh sách KPI",
                    calc_kpi_point: "Tính điểm KPI",
                    export_file: "Xuất file",
                    KPI_info: "Thông tin KPI",
                    point_field:
                        "Điểm (Tự động - Tự đánh giá - Người phê duyệt đánh giá)",
                    weekly_point_field:
                        "Điểm từng tuần (Tự động - Tự đánh giá - Người phê duyệt đánh giá)",
                    weekly_point: "Đánh giá tuần",
                    week1: "Tuần 1",
                    week2: "Tuần 2",
                    week3: "Tuần 3",
                    week4: "Tuần 4",
                    not_avaiable: "Chưa đánh giá",
                    no_point: "Chưa có điểm",
                    lastest_evaluation: "Đánh giá cuối",
                    lastest_edit: "Chỉnh sửa cuối",
                    task_list: "Danh sách công việc",
                    work_duration_time: "Thời gian làm việc",
                    evaluate_time: "Thời gian đánh giá",
                    contribution: "Đóng góp",
                    importance_level: "Độ quan trọng",
                    point: "Điểm",
                    evaluated_value: "Giá trị được duyệt",
                    new_value: "Giá trị mới",
                    old_value: "Giá trị cũ",
                    auto_value: "Giá trị tự động",
                    cal_all_kpis: 'Tính điểm toàn bộ KPI',
                    refresh_all_kpis: 'Tính lại điểm KPI các đơn vị',
                    update_task_importance: `(*)Cập nhật độ quan trọng công việc và Tính điểm KPI `,
                    cal_all_kpis_title: `(*)Cập nhật độ quan trọng công việc và Tính điểm tất cả KPI `,
                    refresh: "Làm mới",
                    /**
                     * Management
                     */
                    wrong_time:
                        "Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc!",
                    confirm: "Xác nhận",
                    choose_employee: "Chọn nhân viên",
                    employee: "Nhân viên",
                    choose_status: "Chọn trạng thái",
                    establishing: "Đang thiết lập",
                    expecting: "Chờ phê duyệt",
                    activated: "Đã kích hoạt",
                    time: "Thời gian",
                    num_of_kpi: "Số mục tiêu",
                    kpi_status: "Trạng thái mục tiêu",
                    approve: "Phê duyệt",
                    evaluate: "Đánh giá",
                    approve_this_kpi: "Phê duyệt KPI này",
                    evaluate_this_kpi: "Đánh giá KPI này",
                    from: "Từ tháng",
                    to: "Đến tháng",
                    /**
                     * Importance Dialog
                     */
                    num_of_working_day: "Số ngày làm việc",
                    priority: "Độ ưu tiên",
                    formula: "Công thức",
                    explain_automatic_point: "Giải thích giá trị điểm tự động",

                },
                /**
                 * Thông báo từ service
                 */
                get_all_kpi_member_success: "Lấy tất cả KPI member thành công",
                get_all_kpi_member_fail: "Lấy tất cả KPI nhân viên lỗi",
                get_kpi_targets_success:
                    "Lấy mục tiêu KPI nhân viên thành công",
                get_kpi_targets_fail: "Lấy mục tiêu KPI nhân viên lỗi",
                get_all_kpi_member_by_id_success:
                    "Lấy tất cả KPI nhân viên theo Id thành công",
                get_all_kpi_member_by_id_fail:
                    "Lấy tất cả KPI nhân viên theo Id lỗi",
                get_all_kpi_member_by_month_success:
                    "Lấy tất cả KPI nhân viên theo tháng thành công",
                get_all_kpi_member_by_month_fail:
                    "Lấy tất cả KPI nhân viên theo tháng lỗi",
                approve_all_kpi_target_success:
                    "Phê duyệt KPI nhân viên thành công",
                approve_all_kpi_target_fail: "Phê duyệt KPI nhân viên lỗi",
                edit_kpi_target_member_success:
                    "Chỉnh sửa mục tiêu KPI nhân viên thành công",
                edit_kpi_target_member_fail:
                    "Chỉnh sửa mục tiêu KPI nhân viên lỗi",
                edit_status_target_success:
                    "Chỉnh sửa trạng thái mục tiêu thành công",
                edit_status_target_fail: "Chỉnh sửa trạng thái mục tiêu lỗi",
                get_task_by_id_success:
                    "Lấy danh sách công việc theo Id thành công",
                get_task_by_id_fail: "Lấy danh sách công việc theo Id lỗi",
                get_system_point_success:
                    "Lấy điểm hệ thống cho KPI thành công",
                get_system_point_fail: "Lấy điểm hệ thống cho KPI lỗi",
                set_task_importance_level_success:
                    "Thêm độ quan trọng cho công việc và tính KPI thành công",
                set_task_importance_level_fail:
                    "Thêm độ quan trọng cho công việc và tính KPI lỗi",
                set_point_kpi_success:
                    "Tính điểm tất cả kpi thành công",
                set_point_kpi_fail:
                    "Tính điểm tất cả kpi lỗi",
            },
            organizational_unit: {
                // Module chính
                create_organizational_unit_kpi_set: {
                    // Nhóm dành cho các thông tin chung
                    general_information: "KPI đơn vị",
                    save: "Lưu chỉnh sửa",
                    confirm: "Xác nhận",
                    delete: "Xóa KPI này",
                    cancel: "Hủy",
                    approve: "Kích hoạt",
                    cancel_approve: "Bỏ kích hoạt",
                    target: "mục tiêu",
                    confirm_delete_success:
                        "Bạn chắc chắn muốn xóa toàn bộ KPI này?",
                    time: "Thời gian",
                    initialize_kpi_newmonth: "Khởi tạo KPI tháng",
                    edit_kpi_success: "Chỉnh sửa KPI thành công",
                    edit_kpi_failure: "Chỉnh sửa KPI không thành công",
                    delete_kpi_success: "Xóa KPI thành công",
                    delete_kpi_failure: "Xóa KPI không thành công",
                    copy_kpi_unit: "Sao chép KPI đơn vị",
                    employee_importance: "Độ quan trọng nhân viên",
                    organizational_unit_importance: "Độ quan trọng đơn vị con",

                    // Nhóm dành cho trọng số
                    weight_total: "Tổng trọng số",
                    not_satisfied: "Chưa thỏa mãn",
                    satisfied: "Thỏa mãn",

                    // Nhóm dành cho các trạng thái tập KPI
                    not_approved: "Chưa kích hoạt",
                    approved: "Đã kích hoạt",

                    // Nhóm dành cho table
                    target_list: "Danh sách mục tiêu",
                    add_target: "Thêm mục tiêu",
                    no_: "Stt",
                    target_name: "Tên mục tiêu",
                    parents_target: "Mục tiêu cha",
                    evaluation_criteria: "Tiêu chí đánh giá",
                    weight: "Trọng số",
                    action: "Hành động",
                    not_initialize: "Chưa khởi tạo KPI tháng ",

                    // Nhóm dành cho các handle
                    confirm_approve_already: "KPI đã kích hoạt!",
                    confirm_approve: "Bạn chắc chắn muốn kích hoạt KPI này?",
                    confirm_not_enough_weight: "Tổng trọng số phải bằng 100",
                    confirm_cancel_approve:
                        "Bạn chắc chắn muốn hủy kích hoạt KPI này?",
                    confirm_edit_status_success:
                        "Chỉnh sửa trạng thái KPI thành công",
                    confirm_edit_status_failure:
                        "Chỉnh sửa trạng thái KPI không thành công",

                    confirm_kpi: "Bạn chắc chắn muốn xóa mục tiêu KPI này?",
                    confirm_approving: "KPI đã kích hoạt, bạn không thể xóa!",
                    confirm_delete_target_success:
                        "Xóa mục tiêu KPI thành công",
                    confirm_delete_target_failure:
                        "Xóa mục tiêu KPI không thành công",

                    // Nhóm các title
                    edit: "Chỉnh sửa",
                    content:
                        "Đây là mục tiêu mặc định (nếu cần thiết có thể sửa trọng số)",
                    delete_title: "Xóa",
                    employee_importance_activated: "KPI đã kích hoạt, bạn không thể chỉnh sửa độ quan trọng nhân viên!",
                    organizational_unit_importance_activated: "KPI đã kích hoạt, bạn không thể chỉnh sửa độ quan trọng đơn vị con!"
                },

                create_organizational_unit_kpi_modal: {
                    // Module con
                    // Nhóm dành cho modal
                    create_organizational_unit_kpi: "Thêm mục tiêu KPI đơn vị",
                    name: "Tên mục tiêu",
                    parents: "Mục tiêu cha",
                    evaluation_criteria: "Tiêu chí đánh giá",
                    weight: "Trọng số",
                    create_target_success: "Thêm mục tiêu KPI thành công",
                    create_target_failure: "Bạn chưa nhập đủ thông tin",
                    organizational_unit_kpi_exist: "Mục tiêu KPI đã tồn tại",

                    // Nhóm dành cho validate
                    validate_name: {
                        empty: "Tên mục tiêu không được bỏ trống",
                        less_than_4: "Tên mục tiêu không được ít hơn 4 ký tự",
                        more_than_50:
                            "Tên mục tiêu không được nhiều hơn 50 ký tự",
                        special_character:
                            "Tên mục tiêu không được chưa ký tự đặc biệt",
                    },
                    validate_criteria: "Tiêu chí không được để trống",
                    validate_weight: {
                        empty: "Trọng số không được để trống",
                        less_than_0: "Trọng số không được nhỏ hơn 0",
                        greater_than_100: "Trọng số không được lớn hơn 100",
                    },
                },

                kpi_organizational_unit_manager: {
                    index: "STT",
                    time: "Thời gian",
                    employee_name: "Tên nhân viên",
                    target_number: "Số lượng mục tiêu",
                    kpi_status: "Trạng thái KPI",
                    result: "Kết quả",
                    approve: "Phê duyệt",
                    evaluate: "Đánh giá",
                    index: "STT",
                    target_name: "Tên mục tiêu",
                    creator: "Người tạo",
                    organization_unit: "Đơn vị",
                    criteria: "Tiêu chí đánh giá",
                    result: "Kết quả",
                    no_data: "Không có dữ liệu",
                },

                create_organizational_unit_kpi_set_modal: {
                    // Module con
                    // Nhóm dành cho modal
                    initialize_kpi_set: "Khởi tạo KPI đơn vị",
                    organizational_unit: "Đơn vị",
                    month: "Tháng",
                    default_target: "Mục tiêu mặc định",
                    create_organizational_unit_kpi_set_success:
                        "Khởi tạo KPI thành công",
                    create_organizational_unit_kpi_set_failure:
                        "Bạn chưa nhập đủ thông tin",
                },

                edit_target_kpi_modal: {
                    // Mudule con
                    // Nhóm dành cho modal
                    edit_organizational_unit_kpi:
                        "Chỉnh sửa mục tiêu KPI đơn vị",
                    name: "Tên mục tiêu",
                    parents: "Mục tiêu cha",
                    evaluation_criteria: "Mô tả tiêu chí đánh giá",
                    weight: "Trọng số",
                    edit_target_success: "Chỉnh sửa mục tiêu KPI thành công",
                    edit_target_failure: "Bạn chưa nhập đủ thông tin",
                    organizational_unit_kpi_exist: "Mục tiêu KPI đã tồn tại"
                },

                // Dashboard KPI Unit
                dashboard: {
                    organizational_unit: "Đơn vị",
                    organizational_unit_low_case: "đơn vị",
                    month: "Tháng",
                    trend: "Xu hướng thực hiện mục tiêu của nhân viên",
                    distributive: "Phân phối KPI",
                    statiscial: "Thống kê kết quả KPI",
                    result_kpi_unit: "Kết quả KPI",
                    start_date: "Từ tháng",
                    end_date: "Đến tháng",
                    search: "Tìm kiếm",
                    point: "Điểm",
                    no_data: "Không có dữ liệu",
                    line_chart: "Biểu đồ đường",
                    pie_chart: "Biểu đồ quạt",
                    trend_chart: {
                        execution_time: "Thời gian thực hiện (Ngày)",
                        participants: "Số người tham gia",
                        amount_tasks: "Số công việc",
                        amount_employee_kpi: "Số KPI nhân viên",
                        weight: "Trọng số",
                    },
                    result_kpi_unit_chart: {
                        automatic_point: "Hệ thống đánh giá",
                        employee_point: "Cá nhân tự đánh giá",
                        approved_point: "Quản lý đánh giá",
                    },
                    alert_search: {
                        search:
                            "Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc!",
                        confirm: "Xác nhận",
                    },
                    statistic_kpi_unit: {
                        count_employee_same_point: "Số người có cùng điểm",
                    },
                },

                management: {
                    copy_modal: {
                        alert: {
                            check_new_date: "Chưa chọn tháng khởi tạo",
                            confirm: "Xác nhận",
                            coincide_month: "Đã tồn tại KPI của tháng",
                            unable_kpi: "Không thể tạo KPI trong quá khứ",
                            change_link:
                                "Hãy nhớ thay đổi liên kết đến mục tiêu cha để được tính KPI mới!",
                        },
                        create: "Thông tin tập KPI cá nhân tháng",
                        organizational_unit: "Đơn vị sao chép",
                        month: "Tháng",
                        list_target: "Danh sách mục tiêu",
                        setting: "Thiết lập",
                        cancel: "Hủy bỏ",
                    },
                    detail_modal: {
                        list_kpi_unit: "Danh sách KPI đơn vị",
                        title: "Thông tin chi tiết KPI đơn vị tháng ",
                        title_parent: "Thông tin chi tiết KPI đơn vị cha tháng ",
                        information_kpi: "Thông tin KPI ",
                        criteria: "Tiêu chí:",
                        weight: "Trọng số:",
                        export_file: "Xuất file",
                        point_field:
                            "Điểm (Tự động - Tự đánh giá - Quản lý đánh giá)",
                        list_child_kpi: "Danh sách KPI con",
                        not_eval: "Chưa đánh giá",
                        index: "STT",
                        target_name: "Tên mục tiêu",
                        creator: "Người tạo",
                        organization_unit: "Đơn vị",
                        criteria: "Tiêu chí đánh giá",
                        result: "Kết quả đánh giá",
                        no_data: "Không có dữ liệu",
                    },
                    over_view: {
                        start_date: "Từ tháng",
                        end_date: "Đến tháng",
                        search: "Tìm kiếm",
                        status: "Trạng thái",
                        all_status: "Tất cả trạng thái",
                        setting_up: "Đang thiết lập",
                        activated: "Đã kích hoạt",
                        time: "Thời gian",
                        creator: "Người khởi tạo",
                        number_target: "Số lượng mục tiêu",
                        result: "Kết quả đánh giá",
                        no_data: "Không có dữ liệu",
                        action: "Hành động",
                        not_eval: "Chưa đánh giá",
                        alert_search: {
                            search:
                                "Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc!",
                            confirm: "Xác nhận",
                        },
                    },
                },

                statistics: {
                    unit_not_initial_kpi: "Danh sách đơn vị chưa khởi tạo KPI",
                    detail_participant: "Chi tiết người tham gia",
                    detail_employee_kpi: "Chi tiết KPI nhân viên",
                    email: "Email",
                    weight_established: "Trọng số KPI đang thiết lập",
                    weight_analysis_employee: "Trọng số KPI theo phân tích trọng số đang thiết lập của KPI nhân viên",
                    weight_analysis_children_unit: "Trọng số KPI theo phân tích trọng số đang thiết lập của KPI đơn vị con",
                    weight_analysis_tree_unit: "Trọng số KPI theo phân tích trọng số đang thiết lập của cây KPI đơn vị",
                },

                //Thông điệp khác trả về từ server
                get_parent_by_unit_success:
                    "Lấy KPI đơn vị của đơn vị cha thành công",
                get_parent_by_unit_failure:
                    "Lấy KPI đơn vị của đơn vị cha không thành công",
                get_kpi_unit_success: "Lấy danh sách KPI đơn vị thành công",
                get_kpi_unit_fail: "Lấy danh sách KPI đơn vị lỗi",
                get_kpiunit_by_role_success:
                    "Lấy danh sách KPI đơn vị theo vai trò thành công",
                get_kpiunit_by_role_fail:
                    "Lấy danh sách KPI đơn vị theo vai trò lỗi",
                create_kpi_unit_success: "Khởi tạo KPI đơn vị thành công",
                create_kpi_unit_fail: "Khởi tạo KPI đơn vị lỗi",
                update_evaluate_kpi_unit_success:
                    "Cập nhật điểm đánh giá KPI đơn vị thành công",
                update_evaluate_kpi_unit_fail:
                    "Cập nhật điểm đánh giá KPI đơn vị lỗi",
                copy_kpi_unit_success: "Sao chép KPI đơn vị thành công",
                copy_kpi_unit_failure: "Sao chép KPI đơn vị thất bại",
                copy_employee_kpi_success: "Sao chép KPI cá nhân thành công",
                copy_employee_kpi_failure: "Sao chép KPI cá nhân thất bại",
                organizatinal_unit_kpi_set_exist: "KPI đơn vị đã tồn tại",
                employee_kpi_set_exist: "KPI cá nhân đã tồn tại",
                calculate_kpi_unit_success: "Tính điểm KPI thành công",
                calculate_kpi_unit_failure: "Tính điểm KPI thất bại"
            },
        },

        manage_warehouse: {
            dashboard_bill: {},
            dashboard_inventory: {},
            category_management: {
                index: "STT",
                add: "Thêm mới",
                add_title: "Thêm danh mục mới",
                info: "Thông tin về danh mục hàng hóa",
                edit: "Chỉnh sửa thông tin danh mục",
                delete: "Xóa danh mục",
                add_success: "Thêm mới danh mục thành công",
                delete_success: "Xóa danh mục thành công",
                delete_faile: "Xóa danh mục thất bại",
                add_faile: "Thêm mới danh mục thất bại",
                edit_success: "Chỉnh sửa thành công",
                edit_faile: "Chỉnh sửa thất bại",
                name: "Tên danh mục",
                code: "Mã danh mục",
                type: "Danh mục cha",
                good: "Hàng hóa",
                address: "Địa chỉ",
                description: "Mô tả",
                choose_type: "Chọn kiểu hàng hóa",
                all_type: "Chọn tất cả các kiểu hàng hóa",
                product: "Sản phẩm",
                material: "Nguyên vật liệu",
                equipment: "Công cụ dụng cụ",
                waste: "Phế phẩm",
                search: "Tìm kiếm",
                validate_code: "Mã danh mục không được để trống",
                validate_name: "Tên danh mục không được để trống",
                validate_type: "Bạn cần chọn kiểu danh mục",
                delete_info: "Bạn có muốn xóa danh mục",
            },
            good_management: {
                product: "Sản phẩm",
                material: "Nguyên vật liệu",
                equipment: "Công cụ dụng cụ",
                waste: "Tài sản",
                index: "STT",
                add: "Thêm mới",
                add_title: {
                    product: "Thêm mới sản phẩm",
                    material: "Thêm mới nguyên vật liệu",
                    equipment: "Thêm mới công cụ dụng cụ",
                    waste: "Thêm mới phế phẩm",
                },
                info: {
                    product: "Thông tin về sản phẩm",
                    material: "Thông tin nguyên vật liệu",
                    equipment: "Thông tin công cụ dụng cụ",
                    waste: "Thông tin phế phẩm",
                },
                edit: {
                    product: "Chỉnh sửa thông tin sản phẩm",
                    material: "Chỉnh sửa thông tin nguyên vật liệu",
                    equipment: "Chỉnh sửa thông tin công cụ dụng cụ",
                    waste: "Chỉnh sửa thông tin phế phẩm",
                },
                delete: "Xóa hàng hóa",
                add_success: "Thêm mới hàng hóa thành công",
                delete_success: "Xóa hàng hóa thành công",
                delete_faile: "Xóa hàng hóa thất bại",
                add_faile: "Thêm mới hàng hóa thất bại",
                edit_success: "Chỉnh sửa thành công",
                edit_faile: "Chỉnh sửa thất bại",
                name: "Tên hàng hóa",
                good_source: "Nguồn hàng hóa",
                validate_source_product: 'Bạn cần chọn nguồn hàng hóa',
                code: "Mã hàng hóa",
                type: "Kiểu hàng hóa",
                good: "Hàng hóa",
                address: "Địa chỉ",
                description: "Mô tả",
                choose_type: "Chọn kiểu hàng hóa",
                all_type: "Chọn tất cả các kiểu hàng hóa",
                product: "Sản phẩm",
                material: "Nguyên vật liệu",
                equipment: "Công cụ dụng cụ",
                waste: "Phế phẩm",
                search: "Tìm kiếm",
                validate_code: "Mã hàng hóa không được để trống",
                validate_name: "Tên hàng hóa không được để trống",
                validate_type: "Bạn cần chọn kiểu danh mục",
                delete_info: "Bạn có muốn xóa hàng hóa",
                category: "Danh mục",
                unit: "Đơn vị tính",
                baseUnit: "Đơn vị tính cơ bản",
                materials: "Thành phần chính",
                importedFromSuppliers: "Nhập từ nhà cung cấp khác",
                selfProduced: "Tự sản xuất",
                unit_name: "Tên",
                conversion_rate: "Giá trị chuyển đổi",
                quantity: "Số lượng",
                choose_category: "Chọn danh mục",
                choose_source: "Chọn nguồn hàng hóa",
                choose_base_unit:
                    "Vui lòng chọn đơn vị để tạo quy tắc đóng gói",
                packing_rule: "Quy tắc đóng gói",
                non_choose_base_unit: "Không chọn",
                choose_base_unit_all: "Chọn tất cả",
                error_packing_rule:
                    "Đơn vị được chọn không thể tạo thành quy tắc đóng gói. Vui lòng chọn lại!",
                info_mill: "Thông tin về xưởng sản xuất",
                productivity: "Đơn vị sản phẩm / ca",
                person_number: "Số lượng người / ca",
                mill: "Xưởng",
                choose_mill: "Chọn xưởng sản xuất",
                error_choose_mill: "Vui lòng chọn xưởng sản xuất",
                error_productivity: "Giá trị nhập vào phải > 0",
                error_person_number: "Giá trị nhập vào phải > 0",
                mill_code: "Mã xưởng",
                mill_name: "Tên xưởng",
                numberExpirationDate: "Hạn sử dụng (tính theo ngày)",
                day: "Ngày",
                expirationDate: "Hạn sử dụng",
                validate_number_expiration_date:
                    "Ngày hết hạn không được để trống",
                validate_number_expiration_date_input:
                    "Ngày hết hạn phải lớn hơn 0",
            },

            stock_management: {
                // 1: "Sẵn sàng sử dụng",
                // 2: "Đang sử dụng",
                // 3: "Đang sửa chữa",
                // 4: "Không sử dụng",
                1: {
                    status: "Sẵn sàng sử dụng",
                    color: "green",
                },
                2: {
                    status: "Đang sử dụng",
                    color: "blue",
                },
                3: {
                    status: "Đang sửa chữa",
                    color: "violet",
                },
                4: {
                    status: "Không sử dụng",
                    color: "red",
                },
                index: "STT",
                add: "Thêm mới",
                add_title: "Thêm kho mới",
                info: "Thông tin về kho",
                edit: "Chỉnh sửa thông tin kho",
                delete: "Xóa kho",
                add_success: "Thêm mới kho thành công",
                delete_success: "Xóa kho thành công",
                delete_faile: "Xóa kho thất bại",
                add_faile: "Thêm mới kho thất bại",
                edit_success: "Chỉnh sửa thành công",
                edit_faile: "Chỉnh sửa thất bại",
                name: "Tên kho",
                code: "Mã kho",
                goods: "Hàng hóa trong kho",
                good: "Hàng hóa",
                status: "Trạng thái kho",
                address: "Địa chỉ",
                description: "Mô tả",
                choose_status: "Chọn trạng thái",
                choose_department: "--Chọn đơn vị--",
                department: "Đơn vị quản lý",
                management_location: "Những vị trí đang quản lý",
                all_type: "Chọn tất cả các trạng thái",
                search: "Tìm kiếm",
                validate_code: "Mã kho không được để trống",
                validate_name: "Tên kho không được để trống",
                validate_status: "Bạn cần chọn kiểu kho",
                delete_info: "Bạn có muốn xóa kho",
                max_quantity: "Định mức tối đa (Đơn vị tính cơ bản)",
                min_quantity: "Định mức tối thiểu (Đơn vị tính cơ bản)",
                choose_good: "Chọn hàng hóa",
                choose_role: "Chọn quyền quản lý",
                error_organizational_unit: "Vui lòng chọn đơn vị liên kết",
                list_roles: "Chức vụ trưởng đơn vị",
                validate_good: "Hàng hóa không được để trống",
                detail_stock: "Xem chi tiết kho",
                validate_address: "Địa chỉ không được bỏ trống",
                validate_department: "Phòng ban không được để trống",
                validate_management: "Các vị trí quản lý không được để trống",
                product: "Sản phẩm",
                material: "Nguyên vật liệu",
                equipment: "Công cụ dụng cụ",
                waste: "Phế phẩm",
                role: "Quyền quản lý",
                management_good: "Loại hàng hóa được quản lý"
            },
            bin_location_management: {
                product: "Sản phẩm",
                material: "Nguyên vật liệu",
                equipment: "Công cụ dụng cụ",
                asset: "Tài sản",
                category_tree: "Danh mục cây",
                category_table:"Danh mục bảng",
                bin_location: "Nơi lưu trữ",
                archive: "Danh mục lưu trữ",
                1: {
                    status: "Sẵn sàng sử dụng",
                    color: "green",
                },
                2: {
                    status: "Đang sử dụng",
                    color: "blue",
                },
                3: {
                    status: "Đang sửa chữa",
                    color: "violet",
                },
                4: {
                    status: "Không sử dụng",
                    color: "red",
                },
                5: {
                    status: "Đã đầy",
                    color: "red",
                },
                index: "STT",
                add: "Thêm mới",
                add_title: "Thêm khu vực lưu trữ mới",
                info: "Thông tin về khu vực lưu trữ",
                edit: "Chỉnh sửa thông tin lưu trữ",
                delete: "Xóa kho",
                add_success: "Thêm mới khu vực lưu trữ thành công",
                delete_success: "Xóa khu vực lưu trữ thành công",
                delete_faile: "Xóa khu vực lưu trữ thất bại",
                add_faile: "Thêm mới khu vực lưu trữ thất bại",
                edit_success: "Chỉnh sửa thành công",
                edit_faile: "Chỉnh sửa thất bại",
                name: "Tên khu vực lưu trữ",
                unit: "Đơn vị tính",
                parent: "Vị trí lưu trữ cha",
                code: "Mã",
                goods: "Hàng hóa đang chứa",
                enable_good: "Hàng hóa có thể chứa",
                good: "Hàng hóa",
                type: "Loại hàng hóa",
                status: "Trạng thái",
                capacity: "Sức chứa",
                contained: "Đã chứa",
                address: "Địa chỉ",
                description: "Mô tả",
                choose_status: "Chọn kho",
                choose_department: "--Chọn đơn vị--",
                department: "Đơn vị quản lý",
                management_location: "Người đang quản lý",
                all_type: "Chọn tất cả các trạng thái",
                search: "Tìm kiếm",
                validate_code: "Mã kho không được để trống",
                validate_name: "Tên kho không được để trống",
                validate_status: "Bạn cần chọn kiểu kho",
                delete_info: "Bạn có muốn xóa kho",
                max_quantity: "Định mức tối đa",
                min_quantity: "Định mức tối thiểu",
                stock: "Kho",
                validate_capacity: "Sức chứa không được bỏ trống",
                validate_good: "Hàng hóa không được bỏ trống",
                validate_department: "Đơn vị quản lý không được bỏ trống",
                validate_stock: "Kho không được để trống",
                choose_stock: "Chọn kho",
                choose_good: "Chọn hàng hóa",
                detail_title: "Chi tiết khu vực lưu trữ",
                empty_stock: "Kho trống",
            },
            bill_management: {
                text: "Chưa đánh lô cho hàng hóa",

                billType: {
                    1: "Nhập nguyên vật liệu",
                    2: "Nhập thành phẩm",
                    3: "Nhập công cụ, dụng cụ",
                    4: "Nhập phế phẩm",
                    5: "Xuất nguyên vật liệu",
                    6: "Xuất thành phẩm",
                    7: "Xuất công cụ, dụng cụ",
                    8: "Xuất phế phẩm",
                    9: "Kiểm kê định kỳ",
                    10: "Kiểm kê thường xuyên",
                    11: "Trả hàng hóa tự sản xuất không đạt kiểm định",
                    12: "Trả hàng hóa nhập từ nhà cung cấp không đạt kiểm định",
                    13: "Trả hàng hóa đã xuất kho",
                    14: "Luân chuyển",
                },
                1: {
                    status: "Chờ phê duyệt",
                    color: "green",
                },
                2: {
                    status: "Đã hoàn thành",
                    color: "blue",
                },
                3: {
                    status: "Đã phê duyệt",
                    color: "violet",
                },
                4: {
                    status: "Đã hủy",
                    color: "red",
                },
                bill_color: {
                    1: "green",
                    2: "green",
                    3: "violet",
                    4: "green",
                    5: "blue",
                    6: "violet",
                    7: "red",
                },
                bill_status: {
                    1: "Chờ phê duyệt",
                    2: "Đã phê duyệt",
                    3: "Đang thực hiện",
                    4: "Đã kiểm định chất lượng xong",
                    5: "Đã hoàn thành",
                    7: "Đã hủy",
                },
                bill_receipt_status: {
                    1: "Chờ phê duyệt",
                    2: "Chờ thực hiện",
                    3: "Chờ kiểm định chất lượng",
                    4: "Chờ đánh lô hàng hóa",
                    5: "Đã hoàn thành phiếu \nChờ xếp hàng vào kho",
                    6: "Đã xếp hàng vào kho",
                    7: "Đã hủy",
                },
                bill_issue_status: {
                    1: "Chờ phê duyệt",
                    2: "Chờ thực hiện",
                    3: "Đang thực hiện",
                    5: "Đã hoàn thành",
                    7: "Đã hủy",
                },
                bill_return_status: {
                    1: "Chờ phê duyệt",
                    2: "Đã phê duyệt",
                    3: "Đang thực hiện",
                    4: "Đã kiểm định chất lượng xong",
                    5: "Đã hoàn thành",
                    7: "Đã hủy",
                },
                stock_book: "Sổ kho",
                good_receipt: "Nhập kho",
                good_issue: "Xuất kho",
                good_return: "Trả hàng",
                stock_take: "Kiểm kê",
                stock_rotate: "Luân chuyển",
                code: "Mã phiếu",
                type: "Loại phiếu",
                creator: "Người tạo",
                date: "Ngày tạo",
                description: "Mô tả",
                infor_of_goods: "Thông tin hàng hóa",
                stock: "Kho",
                rotate_stock: "Kho nhập",
                from_date: "Từ ngày",
                to_date: "Đến ngày",
                search: "Tìm kiếm",
                index: "STT",
                proposal: "Phiếu đề nghị",
                status: "Trạng thái",
                issue_stock: "Kho xuất",
                receipt_stock: "Kho nhập",
                customer: "Khách hàng",
                supplier: "Nhà cung cấp",
                mill: "Xưởng sản xuất",
                issued: "Đơn đã xuất",
                partner: "Đối tác",
                bill_detail: "Chi tiết đơn hàng",
                approved: "Người phê duyệt",
                updateror: "Người sửa",
                createAt: "Thời gian sửa",
                title: "Tiêu đề",
                view_version: "Log bill",
                accountables: "Người giám sát",
                qualityControlStaffs: "Người kiểm định chất lượng",
                list_saffs: "Danh sách người tham gia",
                approved_time: "Thời gian phê duyệt",
                time: "Thời gian kiểm định",
                goods: "Danh sách hàng hóa",
                quality_control_of_each_goods: "Kiểm định chất lượng từng mặt hàng (Nhập số lượng đạt kiểm định vào cột số lượng đạt kiểm định)",
                good_name: "Tên hàng hóa",
                approved_true: "Phê duyệt phiếu",
                in_processing: "Chuyển trạng thái đang thực hiện",
                complete_bill: "Chuyển sang trạng thái hoàn thành",
                cancel_bill: "Hủy phiếu",
                staff_true: "Kiểm định chất lượng hàng hóa",
                good_code: "Mã hàng hóa",
                number: "Số lượng",
                number_passed: "Số lượng đạt kiểm định",
                unit: "Đơn vị tính",
                note: "Ghi chú",
                issued_quantity: "Số lượng xuất",
                return_quantity: "Số lượng trả lại",
                real_quantity: "Số lượng thực tế",
                lot: "Lô hàng",
                lot_number: "Số lô",
                difference: "Chênh lệch",
                receiver: "Người giao hàng",
                choose_good: "Chọn hàng hóa",
                choose_type: "Chọn loại phiếu",
                choose_approver: "Chọn người phê duyệt",
                choose_customer: "Chọn khách hàng",
                choose_supplier: "Chọn nhà cung cấp",
                choose_manufacturing_mills: "Chọn xưởng sản xuất",
                choose_lot: "Chọn lô",
                choose_stock: "Chọn kho",
                add_title: {
                    1: "Thêm mới phiếu nhập kho",
                    2: "Thêm mới phiếu xuất kho",
                    3: "Thêm mới phiếu trả hàng",
                    4: "Thêm mới phiếu kiểm kê kho",
                    5: "Thêm mới phiếu luân chuyển kho",
                },
                edit_title: {
                    1: "Chỉnh sửa phiếu nhập kho",
                    2: "Chỉnh sửa phiếu xuất kho",
                    3: "Chỉnh sửa phiếu trả hàng",
                    4: "Chỉnh sửa phiếu kiểm kê kho",
                    5: "Chỉnh sửa phiếu luân chuyển kho",
                },
                detail_title: {
                    1: "Xem chi tiết phiếu nhập kho",
                    2: "Xem chi tiết phiếu xuất kho",
                    3: "Xem chi tiết phiếu trả hàng",
                    4: "Xem chi tiết phiếu kiểm kê kho",
                    5: "Xem chi tiết phiếu luân chuyển kho",
                },
                detail_version: {
                    1: "Xem chi tiết thay đổi phiếu nhập kho",
                    2: "Xem chi tiết thay đổi phiếu xuất kho",
                    3: "Xem chi tiết thay đổi phiếu trả hàng",
                    4: "Xem chi tiết thay đổi phiếu kiểm kê kho",
                    5: "Xem chi tiết thay đổi phiếu luân chuyển kho",
                },
                qc_status: {
                    1: {
                        color: "orange",
                        content: "Chưa kiểm định xong",
                    },
                    2: {
                        color: "green",
                        content: "Đã kiểm định xong",
                    },
                    3: {
                        color: "red",
                        content: "Không đạt kiểm định",
                    },
                },
                qc_name: "Tên người kiểm định",
                qc_email: "email",
                qc_status_bill: "Trạng thái",
                quality_control_content: "Nội dung",
                infor: "Thông tin chung",
                name: "Tên",
                phone: "Số điện thoại",
                email: "Email",
                address: "Địa chỉ",
                validate_type: "Không để trống loại phiếu",
                validate_bill: "Không được để trống phiếu",
                validate_stock: "Bạn cần chọn kho",
                validate_approver: "Bạn cần chọn người phê duyệt",
                validate_customer: "Bạn cần chọn khách hàng",
                validate_manufacturing_mills: "Bạn cần chọn xưởng sản xuất",
                validate_lot: "Bạn cần chọn lô hàng",
                validate_quantity: "Bạn cần nhập số lượng cho lô hàng",
                validate_quantity_rfid: "Bạn cần nhập mã RFID từ 1 đến số lượng hàng hóa đã nhập ở trên",
                validate_norm: "Bạn đã nhập quá số lượng tồn kho",
                add_lot: "Thêm mới lô hàng",
                expiration_date: "Ngày hết hạn",
                validate_norm: "Bạn đã nhập quá số lượng tồn kho",
                quantity_return: "Số lượng trả lại",
                quantity_issue: "Số lượng xuất ra",
                bill_issued: "Đơn đã xuất",
                choose_bill: "Chọn phiếu",
                users: "Những người thực hiện",
                add_success: "Thêm mới phiếu thành công",
                add_faile: "Thêm mới phiếu thất bại",
                edit_success: "Chỉnh sửa thành công",
                edit_faile: "Chỉnh sửa thất bại",

                // Phần liên quan lô sản xuất
                add_issue_product: "Thêm phiếu nhập sản phẩm",
                lot_information: "Thông tin lô hàng",
                base_unit: "Đơn vị tính tiêu chuẩn",
                bill_info: "Thông tin phiếu nhập kho sản phẩm",
                quantity_billed: "Số lượng chưa tạo phiếu",
                bill_information: "Các phiếu nhập kho",
                quantity_error: "Vui lòng nhập số lượng",
                quantity_error_input: "Số lượng nhập vào phải lớn hơn 0",
                quantity_error_input_1:
                    "Số lượng nhập vào không được lớn hơn số lượng còn lại trong lô",
                name_receiver: "Tên người giao hàng",
                email_receiver: "Email người giao hàng",
                phone_receiver: "Số điện thoại người giao hàng",
                address_receiver: "Địa chỉ người giao hàng",
                choose_stock_error: "Vui lòng chọn kho",
                choose_user: "Chọn người",
                error_name_receiver: "Tên người giao hàng không được để trống",
                error_phone_receiver:
                    "Số điện thoại người giao hàng không được để trống",
                error_phone_receiver_input: "Số điện thoại không hợp lệ",
                choose_approvers: "Vui lòng chọn người phê duyệt",
                choose_accountables: "Vui lòng chọn người giám sát",
                chooos_reponsibles: "Vui lòng chọn người thực hiện",
                choose_all_lot:
                    "Vui lòng nhập hết số lượng sản phẩm trong lô để tạo phiếu nhập kho",
                create_product_bill_successfully:
                    "Thêm phiếu thành công",
                create_product_bill_failed: "Thêm phiếu thất bại",
                add_product_bill: "Thêm phiếu nhập sản phẩm",

                // Phần xuất kho nguyên vật liệu

                material_name: "Tên nguyên vật liệu",
                material_code: "Mã nguyên vật liệu",
                command_info: "Thông tin nguyên vật liệu trong lệnh sản xuất",
                quantity_needed_bill: "Số lượng chưa lên phiếu xuất",
                add_material_bill: "Thêm phiếu xuất kho nguyên vật liệu",
                create_material_bill_successfully: "Thêm phiếu xuất kho nguyên vật liệu thành công",
                create_material_bill_failed: "Thêm phiếu xuất kho nguyên vật liệu thất bại",
                bill_material_info: "Thông tin phiếu xuất kho nguyên vật liệu",
                materials_in_bill: "Danh sách nguyên vật liệu trong phiếu",
                number_inventory: "Số lượng tồn kho",
                quality_control_staffs: "Người kiểm định chất lượng",
                quality_control_staffs_error: "Vui lòng chọn người kiểm định chất lượng",
                quantity: "Số lượng",
                choose_material: "Chọn nguyên vật liệu",
                command_code: "Mã lệnh sản xuất",
                mill_request: "Xưởng yêu cầu",
                quantity_needed_true: "Để duyệt lệnh sản xuất, vui lòng lên phiếu xuất kho cho đủ số lượng nguyên vật liệu cần thiết!",
                lot_with_unit: "Lô hàng (Mã lô/ Số lượng)",
                quantity_passed_test: "Số lượng đạt kiểm định",
                quantity_return_supplier: "Số lượng không đạt kiểm định",
                process_not_passed_goods: "Hàng hóa không đạt kiểm định:\n1. Đánh lô để xếp hàng vào kho \n2. Tiến hành trả hàng",
                rfid_code: "Mã RFID",
                rfid_quantity: "Số lượng mã sản phẩm / 1 mã  RFID",
                create_rfid_code: "Thêm mã RFID",
                goods_returned_to_the_factory: "Hàng trả về xưởng",
                goods_returned_to_the_supplier: "Hàng trả về nhà cung cấp",
                goods_returned_to_the_stock: "Hàng trả kho",
                action: "Hành động",
                arrange_goods_into_the_warehouse: "Sắp xếp hàng vào kho",
                good_detail: "Chi tiết hàng hóa",
            },
            inventory_management: {
                product: "Sản phẩm",
                material: "Nguyên vật liệu",
                equipment: "Công cụ dụng cụ",
                waste: "Phế phẩm",
                name: "Tên hàng hóa",
                stock: "Kho",
                index: "STT",
                unit: "Đơn vị tính",
                quantity: "Số lượng tồn kho",
                lot: "Số lô",
                lots: "Lô hàng",
                date: "Hạn sử dụng",
                search: "Tìm kiếm",
                good_code: "Mã hàng hóa",
                lot_code: "Số lô",
                description: "Mô tả",
                history: "Lịch sử hoạt động",
                date_month: "Ngày, tháng",
                receipt: "Nhập",
                issue: "Xuất",
                inventory: "Tồn",
                stock_card: "Thẻ kho",
                lot_detail: "Chi tiết lô hàng",
                original_quantity: "Số lượng ban đầu",
                type: "Kiểu",
                number: "Số lượng",
                bin: "Nơi lưu trữ",
                partner: "Đối tác",
                from_to: "Nhập từ",
                status: "Trạng thái",
                note: "Ghi chú",
                bill: "Mã phiếu",
                archive: "Nơi lưu trữ",
                bin_location: "Khu vực lưu trữ",
                choose_bin: "Chọn nơi lưu trữ",
                choose_stock: "Chọn kho chứa",
                choose_good: "Chọn hàng hóa",
                total_stock: "Tổng các kho",
                number_over: "Số lượng đã vượt quá số lượng tồn kho",
                validate_number: "Số lượng không được để trống",
                validate_total: "Số lượng đã vượt quá số lượng tồn kho",
                number_over_norm: "Số lượng đã vượt quá định mức nơi lưu trữ",
                bin_contained: "Nơi lưu trữ chỉ còn chứa được",
                edit_title: "Chỉnh sửa lô hàng",
                edit_success: "Chỉnh sửa lô hàng thành công",
                edit_faile: "Chỉnh sửa lô hàng thất bại",
                get_lot_failed: "Lấy lô hàng thất bại",
                push_lot: "Lô chưa được xếp vào kho",
                text: "Hàng hóa chưa xếp hết vào kho",
                add_lot: "Đánh lô hàng",
                select_lot: "Chọn lô hàng",
            },
        },

        //manager order
        manage_order: {
            tax: {
                index: "STT",
                code: "Mã",
                name: "Tên",
                creator: "Người tạo",
                status: "Trạng thái",
                tax_code: "Mã thuế",
                tax_name: "Tên thuế",
                choose_at_least_one_item: "Phải chọn ít nhất 1 mặt hàng",
                percent_is_not_null: "Chiết khấu thuế không được để trống",
                percent_greater_than_or_equal_zero:
                    "Chiết khấu thuế phải lớn hơn hoặc bằng 0",
                add_new_tax: "Thêm loại thuế",
                add_successfully: "Thêm thuế thành công",
                add_failed: "Thêm thuế không thành công",
                description: "Mô tả",
                goods: "Các mặt hàng",
                select_goods: "Chọn các mặt hàng",
                tax_percent: "Chiết khấu (%)",
                add: "Thêm mới",
                reset: "Xóa trắng",
                action: "Hành động",
                version: "Phiên bản",
                effective: "Đang hiệu lực",
                expire: "Hết hiệu lực",
                tax_detail: "Chi tiết thuế",
                selected_all: "Đã chọn tất cả",
                view_deatail: "Xem chi tiết",
                delete_list_goods: "Xóa danh sách mặt hàng",
                delete_good: "Xóa mặt hàng",
                detail_goods: "Chi tiết các mặt hàng",
                search: "Tìm kiếm",
            },
            bank_account: {
                create_successfully: "Tạo tài khoản thành công",
                create_failed: "Tạo tài khoản không thành công",
                edit_successfully: "Chỉnh sửa tài khoản thành công",
                edit_failed: "Chỉnh sửa tài khoản không thành công",
                get_all_successfully: "Lấy danh sách tài khoản thành công",
                get_all_failed: "Lấy danh sách tài khoản không thành công"
            },
            business_department: {
                create_successfully: "Đã phân vai trò đơn vị kinh doanh",
                create_failed: "Phân vai trò đơn vị kinh doanh không thành công",
                edit_successfully: "Đã chỉnh sửa vai trò đơn vị kinh doanh",
                edit_failed: "Chưa cập nhật được vai trò đơn vị",
                get_successfully: "Lấy danh sách vai trò đơn vị kinh doanh thành công",
                get_failed: "Đã xảy ra lỗi khi lấy danh sách vai trò đơn vị kinh doanh"
            },
            discount: {
                create_successfully: "Tạo mới khuyến mãi thành công",
                create_failed: "Tạo mới khuyến mãi không thành công",
                get_all_successfully: "Lấy danh sách khuyến mãi thành công",
                get_all_failed: "Lấy danh sách khuyến mãi không thành công",
                edit_successfully: "Chỉnh sửa khuyến mãi thành công",
                edit_failed: "Chỉnh sửa khuyến mãi không thành công",
                change_status_successfully: "Đã cập nhật trạng thái khuyến mãi",
                change_status_failed: "Chưa cập nhật được trạng thái khuyến mãi",
                delete_successfully: "Đã xóa khuyến mãi",
                delete_failed: "Xóa khuyến mãi không thành công",
                get_by_good_successfully: "Lấy khuyến mãi theo mặt hàng thành công",
                get_by_good_failed: "Lấy khuyến mãi theo mặt hàng không thành công",
                get_for_order_successfully: "Lấy khuyến mãi theo đơn thành công",
                get_for_order_failed: "Lấy khuyến mãi theo đơn không thành công"
            },
            payment: {
                create_successfully: "Tạo phiếu thành công",
                create_failed: "Tạo phiếu không thành công",
                get_all_successfully: "Lấy danh sách phiếu thành công",
                get_all_failed: "Lấy danh sách phiếu không thành công",
                get_payment_detail_successfully: "Lấy chi tiết phiếu thành công",
                get_payment_detail_failed: "Lấy chi tiết phiếu không thành công",
                get_payment_for_order_successfully: "Lấy các thanh toán theo đơn thành công",
                get_payment_for_order_failed: "Lấy các thanh toán theo đơn không thành công"
            },
            purchase_order: {
                create_successfully: "Tạo đơn mua nguyên vật liệu thành công",
                create_failed: "Tạo đơn mua nguyên vật liệu không thành công",
                edit_successfully: "Chỉnh sửa đơn thành công",
                edit_failed: "Chỉnh sửa đơn không thành công",
                get_all_successfully: "Lấy danh sách đơn thành công",
                get_all_failed: "Lấy danh sách đơn không thành công",
                get_purchase_orders_for_payment_successfully: "Lấy các đơn còn nợ thành công",
                get_purchase_orders_for_payment_failed: "Lấy các đơn còn nợ không thành công",
                approve_successfully: "Phê duyệt đơn thành công",
                approve_failed: "Phê duyệt đơn không thành công"
            },
            quote: {
                create_successfully: "Tạo báo giá thành công",
                create_failed: "Tạo báo giá không thành công",
                get_successfully: "Lấy danh sách báo giá thành công",
                get_failed: "Lấy danh sách báo giá không thành công",
                edit_successfully: "Chỉnh sửa báo giá thành công",
                edit_failed: "Chỉnh sửa báo giá không thành công",
                approve_successfully: "Phê duyệt báo giá thành công",
                approve_failed: "Phê duyệt báo giá không thành công",
                delete_successfully: "Xóa báo giá thành công",
                delete_failed: "Xóa báo giá không thành công",
                get_quotes_to_make_order_successfully: "Lấy các báo giá thành công",
                get_quotes_to_make_order_failed: "Chưa lấy được danh sách báo giá để lên đơn hàng",
                get_detail_successfully: "Xem chi tiết thành công",
                get_detail_failed: "Xem chi tiết không thành công"
            },
            sales_order: {
                create_successfully: "Tạo đơn bán hàng thành công",
                create_failed: "Tạo đơn bán hàng không thành công",
                get_sales_order_successfully: "Lấy danh sách đơn thành công",
                get_sales_orders_failed: "Lấy danh sách đơn không thành công",
                edit_successfully: "Chỉnh sửa đơn thành công",
                edit_failed: "Chỉnh sửa đơn không thành công",
                approve_successfully: "Phê duyệt đơn thành công",
                approve_failed: "Phê duyệt đơn không thành công",
                add_manufacturing_for_sales_order_successfully: "Thêm yêu cầu sản xuất thành công",
                add_manufacturing_for_sales_order_failed: "Thêm yêu cầu sản xuất không thành công",
                get_sales_order_by_manufacturing_works_successfully: "Lấy danh sách các đơn hàng cần sản xuất thành công",
                get_sales_order_by_manufacturing_works_failed: "Lấy danh sách các đơn hàng cần sản xuất không thành công",
                get_sales_orders_for_payment_successfully: "Lấy các đơn hàng dư nợ của khách hàng thành công",
                get_sales_orders_for_payment_failed: "Lấy các đơn hàng còn dư nợ của khách hàng không thành công",
                get_detail_successfully: "Xem chi tiết thành công",
                get_detail_failed: "Xem chi tiết không thành công"
            },
            sla: {
                create_successfully: "Tạo cam kết chất lượng thành công",
                create_failed: "Tạo cam kết chất lượng không thành công",
                edit_successfully: "Chỉnh sửa cam kết chất lượng thành công",
                edit_failed: "Chỉnh sửa cam kết chất lượng không thành công",
                get_all_successfully: "Lấy danh sách cam kết chất lượng thành công",
                get_all_failed: "Lấy danh sách cam kết chất lượng không thành công",
                get_by_id_successfully: "Lấy chi tiết thành công",
                get_by_id_failed: "Lấy chi tiết không thành công",
                disable_successfully: "Đã cập nhật trạng thái cam kết chất lượng",
                disable_failed: "Trạng thái cam kết chất lượng chưa được cập nhật",
                check_successfully: "Mã cam kết chất lượng đã được kiểm tra",
                check_failed: "Mã cam kết chất lượng chưa được kiểm tra",
                get_by_code_successfully: "Lấy lịch sử chỉnh sửa thành công",
                get_by_code_get_failed: "Lấy lịch sử chỉnh sửa không thành công",
                delete_successfully: "Xóa cam kết chất lượng thành công",
                delete_failed: "Xóa cam kết chất lượng không thành công",
                get_by_good_successfully: "Lấy cam kết cho mặt hàng thành công",
                get_by_good_failed: "Lấy cam kết cho mặt hàng không thành công"
            }
        },

        report_manager: {
            search: "Tìm kiếm",
            add_report: "Thêm mới",
            search_by_name: "Tìm kiếm theo tên",
            select_all_units: "Chọn tất cả đơn vị",
            performer: "Người thực hiện",
            name: "Tên báo cáo",
            description: "Mô tả",
            action: "Hành động",
            unit: "Đơn vị",
            creator: "Người tạo",
            createdAt: "Ngày tạo",
            edit: "Chỉnh sửa thông tin báo cáo",
            delete: "Bạn chắc chắn muốn xóa báo cáo:",
            confirm: "Xác nhận",
            cancel: "Hủy bỏ",
            title_delete: "Xóa báo cáo này",
            no_data: "Không có dữ liệu",
            search_by_name: "Nhập tên mẫu báo cáo",
            search_by_creator: "Nhập tên người tạo báo cáo",

            //message trả về từ server
            create_report_manager_success: "Tạo báo cáo thành công !",
            create_report_manager_faile: "Tạo báo cáo thất bại ! ",
            edit_report_manager_success: "Sửa báo cáo thành công !",
            edit_report_manager_fail: "Sửa mẫu báo cáo thất bại !",
            delete_report_manager_success: "Xóa mẫu báo cáo thành công !",
            delete_report_manager_fail: "Xóa mẫu báo cáo thất bại !",
        },

        // manage_plan

        manage_plan: {
            code: "Mã kế hoạch",
            planName: "Tên kế hoạch",
            search: "Tìm kiếm",
            add_plan: "Thêm mới",
            index: "STT",
            description: "Mô tả",
            edit: "Chỉnh sửa thông tin kế hoạch",
            delete: "Xóa kế hoạch",
            delete_success: "Xóa kế hoạch thành công!",
            delete_fail: "Xóa kế hoạch thất bại!",
            add: "Thêm kế hoạch",
            add_title: "Thêm mới kế hoạch",
            add_success: "Thêm kế hoạch thành công!",
            add_fail: "Thêm kế hoạch thất bại!",
            plan_description: "Mô tả kế hoạch",
            edit_title: "Sửa một kế hoạch",
            edit_plan_success: "Cập nhật kế hoạch thành công!",
            edit_plan_fail: "Cập nhật kế hoạch thất bại!",
            detail_info_plan: "Thông tin chi tiết kế hoạch",
        },

        // manage example
        manage_example: {
            exampleName: "Tên ví dụ",
            search: "Tìm kiếm",
            add_example: "Thêm mới",
            index: "STT",
            description: "Mô tả",
            edit: "Chỉnh sửa thông tin ví dụ",
            delete: "Xóa ví dụ",
            delete_success: "Xóa ví dụ thành công!",
            delete_fail: "Xóa ví dụ thất bại!",
            add: "Thêm ví dụ",
            add_title: "Thêm mới ví dụ",
            add_multi_example: "Thêm nhiều ví dụ",
            add_one_example: "Thêm một ví dụ",
            add_success: "Thêm ví dụ thành công!",
            add_fail: "Thêm ví dụ thất bại!",
            example_description: "Mô tả ví dụ",
            edit_title: "Cập nhật ví dụ",
            edit_example_success: "Cập nhật ví dụ thành công!",
            edit_example_fail: "Cập nhật ví dụ thất bại!",
            detail_info_example: "Thông tin chi tiết ví dụ",
        },

        footer: {
            copyright: "Copyright by ",
            vnist:
                "Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
            version: "Phiên bản ",
        },

        manage_asset: {
            menu_general_infor: "Thông tin chung",
            menu_repair_upgrade: "Sửa chữa - Thay thế - Nâng cấp",
            menu_allocate_revoke: "Cấp phát - Điều chuyển - Thu hồi",
            menu_maintain: "Bảo hành - Bào trì",
            menu_depreciation_infor: "Thông tin khấu hao",
            menu_attachments: "Tài liệu đính kèm",
            add_default: "Mặc định",
            add_default_title: "Thêm các tài liệu mặc định",
            edit_file: "Chỉnh sửa tài liệu đính kèm",
            add_file: "Thêm tài liệu đính kèm",
            upload: "Chọn ảnh",
        },

        // Quản lý sản xuất phần KHSX và LSX
        manufacturing: {
            manufacturing_works: {
                name: "Tên nhà máy",
                code: "Mã nhà máy",
                search: "Tìm kiếm",
                create_works: "Tạo nhà máy",
                index: "STT",
                worksManager: "Giám đốc",
                foreman: "Quản đốc",
                mills: "Các xưởng",
                phone: "Số điện thoại",
                address: "Địa chỉ",
                status: "Trạng thái",
                description: "Mô tả",
                view_detail: "Xem chi tiết nhà máy",
                edit: "Chỉnh sửa nhà máy",
                1: "Đang hoạt động",
                0: "Ngừng hoạt động",
                choose_worksManager: "---Chọn giám đốc---",
                worksManager_error: "Giám đốc không được để trống",
                choose_foreman: "---Chọn quản đốc---",
                foreman_error: "Quản đốc không được để trống",
                choose_status: "---Chọn trạng thái nhà máy---",
                status_error: "Trạng thái nhà máy không được để trống",
                create_successfully: "Tạo nhà máy thành công",
                create_failed: "Tạo nhà máy thất bại",
                detail_works: "Xem chi tiết nhà máy",
                created_at: "Ngày tạo",
                list_mills: "Danh sách các xưởng",
                works_edit: "Sửa thông tin nhà máy",
                works_detail: "Chi tiết thông tin nhà máy",
                edit_successfully: "Sửa thông tin nhà máy thành công",
                edit_failure: "Sửa thông tin nhà máy thất bại",
                mill_code: "Mã xưởng",
                mill_name: "Tên xưởng",
                organizational_unit: "Đơn vị liên kết",
                choose_organizational_unit: "---Chọn đơn vị---",
                error_organizational_unit: "Vui lòng chọn đơn vị liên kết",
                list_roles: "Chức vụ trưởng đơn vị",
                manage_roles: "Các role có quyền quản lý",
                manage_roles_description: "Người dùng bất kỳ có 1 trong các role dưới đây cũng có quyền quản lý như trưởng đơn vị",
                role_manages_another: "Các quyền quản lý khác",
                no_roles: "Không có",
                turn: "Số ca làm việc"
            },
            manufacturing_mill: {
                name: "Tên xưởng",
                code: "Mã xưởng",
                search: "Tìm kiếm",
                index: "STT",
                worksName: "Nhà máy",
                description: "Mô tả",
                status: "Trạng thái",
                create_mill: "Tạo xưởng",
                create_manufacturing_mill: "Tạo xưởng sản xuất",
                create_mill_successfully: "Tạo xưởng sản xuất thành công",
                create_mill_failed: "Tạo xưởng sản xuất thất bại",
                works: "Nhà máy",
                choose_works: "---Chọn nhà máy---",
                worksValue_error: "Vui lòng chọn nhà máy",
                delete_mill: "Xóa xưởng sản xuất",
                1: "Đang hoạt động",
                0: "Ngừng hoạt động",
                mill_detail: "Chi tiết xưởng sản xuất",
                mill_edit: "Sửa thông tin xưởng sản xuất",
                choose_status: "---Chọn trạng thái---",
                status_error: "Vui lòng chọn trạng thái xưởng sản xuất",
                edit_mill_successfully: "Sửa thông tin xưởng thành công",
                edit_mill_failed: "Sửa thông tin xưởng thất bại",
                works_name: "Tên nhà máy",
                created_at: "Ngày tạo",
                team_leader: "Đội trưởng",
                choose_team_leader: "---Chọn đội trưởng---",
                team_leader_error: "Vui lòng chọn đội trưởng",
            },
            purchasing_request: {
                code: "Mã phiếu đề nghị",
                createdAt: "Ngày tạo",
                planCode: "Mã kế hoạch",
                command_code: "Mã lệnh sản xuất",
                receiveTime: "Ngày dự kiến nhận",
                status: "Trạng thái",
                creator: "Người tạo",
                index: "STT",
                select_all: "Chọn tất cả",
                1: { content: "Chưa xử lý", color: "orange" },
                2: { content: "Đã xử lý", color: "green" },
                3: { content: "Đã hủy", color: "red" },
                search: "Tìm kiếm",
                select_status: "Chọn trạng thái",
                add_purchasing_request_button: "Thêm phiếu",
                add_purchasing_request:
                    "Thêm phiếu đề nghị mua hàng",
                create_successfully: "Thêm phiếu đề nghị thành công",
                create_failed: "Thêm phiếu đề nghị thất bại",
                description: "Mô tả",
                good_code: "Mã mặt hàng",
                good_name: "Tên mặt hàng",
                good_base_unit: "Đơn vị tính",
                quantity: "Số lượng",
                delete_good: "Xóa",
                material_info: "Thông tin hàng",
                choose_material: "---Chọn mặt hàng---",
                material_code: "Mã mặt hàng",
                error_good: "Vui lòng chọn mặt hàng",
                error_description: "Mô tả không được để trống",
                error_quantity: "Vui lòng nhập số lượng",
                cancel_editing_good: "Hủy chỉnh sửa",
                save_good: "Lưu",
                add_good: "Thêm",
                delete_good: "Xóa trắng",
                error_quantity_input: "Số lượng không hợp lệ",
                purchasing_request_detail: "Chi tiết phiếu đề nghị",
                material_detail: "Chi tiết mặt hàng",
                purchasing_request_edit: "Sửa phiếu đề nghị",
                edit_successfully: "Sửa phiếu dề nghị thành công",
                edit_failed: "Sửa phiếu đề nghị thất bại",
                cancel_purchasing_request: "Hủy phiếu đề nghị mua hàng",
                number_purchasing_status: "Số lượng phiếu đề nghị mua hàng theo trạng thái"
            },            
            work_schedule: {
                //general
                time: "Thời gian",
                search: "Tìm kiếm",
                work_turns: "Ca làm việc",
                edit_work_schedule: "Sửa lịch sản xuất",
                delete_work_schedule: "Xóa lịch sản xuất",
                month: "Tháng",
                turn_1: "Ca 1",
                turn_2: "Ca 2",
                turn_3: "Ca 3",
                turn_4: "Ca 4",
                turn_5: "Ca 5",
                turn_6: "Ca 6",
                turn_7: "Ca 7",
                turn_8: "Ca 8",
                turn_9: "Ca 9",
                turn_10: "Ca 10",
                turn_11: "Ca 11",
                turn_12: "Ca 12",
                add_work_schedule_button: "Tạo lịch",
                add_work_schedule: "Tạo lịch làm việc",
                number_turns: "Số ca / ngày",
                create_successfully: "Tạo lịch làm việc thành công",
                create_failed: "Tạo lịch làm việc thất bại",
                is_existing: "Lịch đã tồn tại",
                0: {
                    color: "white",
                    content: "Chưa có lệnh",
                },
                1: {
                    color: "#ffbf00",
                    content: "Đang chờ duyệt",
                },
                2: {
                    color: "#00bfff",
                    content: "Đã phê duyệt",
                },
                3: {
                    color: "#ff00bf",
                    content: "Đang thực hiện",
                },
                4: {
                    color: "green",
                    content: "Đã hoàn thành",
                },
                5: {
                    color: "red",
                    content: "Đã hủy",
                },
                6: {
                    color: "#26f2da",
                    content: "Mới tạo"
                },
                //mill
                choose_all_mill: "Tất cả các xưởng",
                manufacturing_mill_schedule_list: "Lịch sản xuất của xưởng",
                mill_name: "Tên xưởng",
                mill_code: "Mã xưởng",
                add_work_schedule_mill: "Tạo lịch làm việc cho xưởng sản xuất",
                manufacturingMill: "Xưởng sản xuất",
                //employee
                worker_schedule_list: "Lịch sản xuất của công nhân",
                employee_name: "Tên nhân viên",
                employee_email: "Email nhân viên",
                works: "Nhà máy sản xuất",
                all_works: "Tất cả",
                employee: "Nhân viên",
                choose_all_user: "Tất cả",
            },
            plan: {
                code: "Mã kế hoạch",
                manufacturing_order_code: "Mã đơn sản xuất",
                sales_order_code: "Mã đơn kinh doanh",
                start_date: "Ngày bắt đầu",
                end_date: "Ngày dự kiến hoàn thành",
                approvers: "Người phê duyệt",
                description: "Mô tả",
                list_commands: "Danh sách lệnh sản xuất",
                approve_plan: "Phê duyệt kế hoạch",
                approver: "Người phụ trách nguyên vật liệu",
                created_at: "Ngày tạo",
                manufacturing_commands: "Danh sách lệnh sản xuất",
                command_code: "Mã lệnh sản xuất",
                status: "Trạng thái",
                choose_status: "Chọn trạng thái",
                choose_all: "Chọn tất cả",
                works: "Nhà máy",
                progess: "Tiến độ",
                choose_progess: "Chọn tiến độ",
                search: "Tìm kiếm",
                index: "STT",
                creator: "Người tạo",
                1: {
                    color: "#ffbf00",
                    content: "Đang chờ duyệt",
                },
                2: {
                    color: "#00bfff",
                    content: "Đã phê duyệt",
                },
                3: {
                    color: "#ff00bf",
                    content: "Đang thực hiện",
                },
                4: {
                    color: "green",
                    content: "Đã hoàn thành",
                },
                5: {
                    color: "red",
                    content: "Đã hủy",
                },
                choose_works: "Chọn nhà máy",
                progress_1: "Đúng tiến độ",
                progress_2: "Chậm tiến độ",
                progress_3: "Quá hạn",
                schedule_info: "Phân lịch thực hiện",
                general_info: "Thông tin chung",
                material_info: "Nguyên vật liệu",
                command_info: "Tạo lệnh sản xuất",
                turn_info: "Ca sản xuất",
                worker_info: "Công nhân",
                create_plan: "Tạo kế hoạch",
                create_plan_title: "Tạo kế hoạch sản xuất",
                create_successfully: "Tạo kế hoạch sản xuất thành công",
                create_failed: "Tạo kế hoạch sản xuất thất bại",
                choose_sales_order: "Chọn đơn kinh doanh",
                sales_order: {
                    "0": {
                        content: "Default"
                    },
                    "1": {
                        content: "Thấp"
                    },
                    "2": {
                        content: "Trung bình"
                    },
                    "3": {
                        content: "Cao"
                    },
                    "4": {
                        content: "Đặc biệt"
                    },
                    a: "Không có trạng thái",
                    b: "Chờ phê duyệt",
                    c: "Đã phê duyệt",
                    d: "Yêu cầu sản xuất",
                    e: "Đã lên kế hoạch sản xuất",
                    f: "Đã yêu cầu xuất kho",
                    g: "Đang giao hàng",
                    h: "Đã giao hàng",
                    i: "Đã hủy",
                    detail_sales_order: "Xem chi tiết đơn hàng kinh doanh",
                    code: "Mã đơn",
                    priority: "Độ ưu tiên",
                    creator: "Người tạo",
                    status: "Trạng thái",
                    customer: "Khách hàng",
                    total_money: "Tổng tiền",
                    intend_deliver_good: "Thời gian giao hàng dự kiến"
                },
                add_good_info: "Thêm thông tin các sản phẩm sản xuất",
                good: "Sản phẩm",
                good_code: "Mã sản phẩm",
                good_name: "Tên sản phẩm",
                choose_good: "Chọn sản phẩm",
                base_unit: "Đơn vị tính tiêu chuẩn",
                quantity_good_inventory: "Số lượng tồn kho",
                quantity: "Số lượng cần sản xuất",
                choose_good_input: "---Chọn sản phẩm---",
                error_good: "Vui lòng chọn sản phẩm",
                error_quantity: "Vui lòng nhập số lượng",
                error_quantity_input: "Số lượng nhập vào không hợp lệ",
                sales_order_info: "Thông tin sản phẩm trong đơn",
                add_to_plan: "Thêm tất cả",
                added_to_plan: "Đã thêm tất cả",
                manufacturing_good_info: "Thông tin các sản phẩm cần sản xuất",
                productivity_mill: "Thông tin năng suất của phân xưởng sản xuất",
                divide_command: "Phân chia các lệnh sản xuất",
                quantity_not_commmanded: "Số lượng chưa tạo lệnh",
                mill: "Xưởng sản xuất",
                productity: "Số sản phẩm sản xuất / ca",
                person_number: "Số công nhân / ca",
                approvers: "Người phê duyệt",
                qualityControlStaffs: "Người kiểm định chất lượng",
                accountables: "Người giám sát",
                accountable_description: "Người đổi trạng thái của lệnh sang thực hiện và kết thúc lệnh",
                command_code: "Mã lệnh",
                created_all_command: "Vui lòng phân hết số lượng các sản phẩm vào lệnh sản xuất",
                command_quantity: "Số lượng",
                choose_quality_control_staffs: "Vui lòng chọn người kiểm định chất lượng",
                error_quantity_input_remaining: "Số lượng không thể lớn hơn số lượng chưa tạo lệnh sản xuất",
                error_quantity_input_good: "Vui lòng chọn sản phẩm cần sản xuất trước",
                choose_approvers: "Vui lòng chọn người phê duyệt",
                choose_accountables: "Vui lòng chọn người giám sát",
                quantity_order: "Số lượng trong đơn",
                quantity_need_planned: "Số lượng cần lập kế hoạch",
                list_order: "Danh sách đơn hàng",
                manufacturing_command_info: "Thông tin lệnh sản xuất",
                history_info: "Lịch sử sản xuất theo mặt hàng",
                schedule_booking: "Chọn xưởng sản xuất và phân việc công nhân",
                choose_mill: "Chọn xưởng sản xuất",
                turn_number_suggest: "Số ca đề xuất",
                worker_number_suggest: "Số công nhân đề xuất",
                start_date_command: "Ngày bắt đầu",
                start_turn: "Ca bắt đầu",
                end_date_command: "Ngày kết thúc",
                end_turn: "Ca kết thúc",
                responsible: "Người thực hiện",
                choose_mill_error: "Vui lòng chọn xưởng sản xuất!",
                choose_mill_error_on_good: "Xưởng không thể sản xuất mặt hàng này!",
                month_lower_case: "tháng",
                month_upper_case: "Tháng",
                work_schedule: "Lịch sản xuất",
                next: "Sau",
                prev: "Trước",
                choose_start_date: "Không được để trống thời gian",
                choose_end_date: "Không được để trống thời gian",
                choose_date_error: "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc",
                booking_mill_error: "Các ca làm việc phải liên tục!",
                turn: "Ca ",
                please_booking_mill: "Vui lòng chọn phân lệnh sản xuất vào ca làm việc!",
                command_complete: "Đã phân lịch thực hiện",
                choose_responisbles: "Vui lòng chọn người thực hiện",
                edit_successfully: "Chỉnh sửa kế hoạch thành công",
                edit_failed: "Chỉnh sửa kế hoạch thất bại",
                cancel_plan: "Hủy kế hoạch",
                quantity_by_status: "Số lượng kế hoạch theo trạng thái"
            },
            command: {
                code: "Mã lệnh sản xuất",
                accountables: "Người  điều hành",
                plan_code: "Mã kế hoạch",
                start_date: "Ngày bắt đầu",
                from_date: "Từ ngày",
                to_date: "Đến ngày",
                end_date: "Ngày kết thúc",
                manufacturing_order_code: "Mã đơn sản xuất",
                sales_order_code: "Mã đơn kinh doanh",
                lot_code: "Mã lô sản xuất",
                status: "Trạng thái",
                search: "Tìm kiếm",
                index: "STT",
                created_at: "Ngày tạo",
                responsibles: "Người thực hiện",
                mill: "Xưởng sản xuất",
                1: {
                    color: "#ffbf00",
                    content: "Đang chờ duyệt",
                },
                2: {
                    color: "#00bfff",
                    content: "Đã phê duyệt",
                },
                3: {
                    color: "#ff00bf",
                    content: "Đang thực hiện",
                },
                4: {
                    color: "green",
                    content: "Đã hoàn thành",
                },
                5: {
                    color: "red",
                    content: "Đã hủy",
                },
                6: {
                    color: "#26f2da",
                    content: "Mới tạo"
                },
                choose_status: "Chọn trạng thái",
                choose_all: "Chọn tất cả",
                command_detail: "Chi tiết lệnh sản xuất",
                start_turn: "Ca bắt đầu",
                end_turn: "Ca kết thúc",
                creator: "Người tạo",
                quantity: "Số lượng",
                description: "Mô tả",
                approvers: "Người phụ trách nguyên vật liệu",
                approver_description: "Người tạo phiếu xuất kho nguyên vật liệu ",
                good_info: "Thông tin sản phẩm",
                good_code: "Mã sản phẩm",
                good_name: "Tên sản phẩm",
                good_base_unit: "Đơn vị tính tiêu chuẩn",
                packing_rule: "Quy cách đóng gói",
                good_base_unit_quantity: "Số lượng sản phẩm theo đơn vị tính tiêu chuẩn",
                packing_rule_quantity: "Số lượng theo quy cách đóng gói",
                approved: "Đã phê duyệt",
                approvedTime: "Thời gian phê duyệt",
                turn: "Ca",
                day: "ngày",
                start_command: "Thực hiện lệnh",
                end_command: "Hoàn thành lệnh",
                edit_successfully: "Sửa lệnh sản xuất thành công",
                edit_failed: "Sửa lệnh sản xuất thất bại",
                qualityControlStaffs: "Người kiểm định chất lượng",
                time: "Thời gian kiểm định",
                quality_control_command: "Kiếm định chất lượng lệnh sản xuất",
                result: "Kết quả thực hiện",
                no_data: "Không có dữ liệu",
                finishedProductQuantity: "Số lượng thành phẩm",
                substandardProductQuantity: "Số lượng phế phẩm",
                finishedTime: "Thời gian hoàn thành thực tế",
                material: "Thông tin nguyên vật liệu",
                inventory: "Số lượng tồn kho",
                comment: "Bình luận",
                quality_control_status: "Trạng thái kiểm định",
                qc_status: {
                    1: {
                        color: "orange",
                        content: "Chưa kiểm định",
                    },
                    2: {
                        color: "green",
                        content: "Đạt kiểm định",
                    },
                    3: {
                        color: "red",
                        content: "Không đạt kiểm định",
                    },
                },
                qc_name: "Tên người kiểm định",
                qc_email: "email",
                mills: "Xưởng sản xuất",
                choose_mills: "Chọn xưởng",
                qc_status_command: "Trạng thái kiểm định",
                quality_control_content: "Nội dung kiểm định",
                rateFinishedProductQuantity: "Tỷ lệ thành phẩm",
                rateSubstandardProductQuantity: "Tỷ lệ phế phẩm",
                from_stock: "Kho",
                material_code: "Mã nguyên vật liệu",
                material_name: "Tên nguyên vật liệu",
                bill: {
                    1: {
                        color: "#ffbf00",
                        content: "Đang chờ duyệt",
                    },
                    2: {
                        color: "green",
                        content: "Đã hoàn thành",
                    },
                    3: {
                        color: "#ff00bf",
                        content: "Đã phê duyệt",
                    },
                    4: {
                        color: "red",
                        content: "Đã hủy",
                    },
                    5: {
                        color: "00bfff",
                        content: "Đang thực hiện",
                    },
                },
                status_bill: "Trạng thái phiếu xuất",
                quantity_gt: "Số lượng lớn hơn",
                quantity_lt: "Số lượng bé hơn",
                material_bill: "Thông tin phiếu xuất nguyên vật liệu",
                materials_info: {
                    '0': {
                        color: "red",
                        content: "Thiếu"
                    },
                    '1': {
                        color: 'green',
                        content: "Đủ"
                    }
                },
                create_purchasing_request: "Tạo phiếu đề nghị mua hàng",
                approver_command: "Duyệt lệnh",
                approver_ccommand: "Người phụ trách nguyên vật liệu",
                cancel_command: "Hủy lệnh sản xuất",
                command_number_status: "Số lượng lệnh sản xuất theo trạng thái",



            },
            lot: {
                index: "STT",
                code: "Mã lô",
                command_code: "Mã lệnh sản xuất",
                good: "Sản phẩm",
                status: "Trạng thái",
                created_at: "Ngày tạo",
                expiration_date: "Ngày hết hạn",
                1: {
                    color: "#ffbf00",
                    content: "Chưa lên đơn nhập kho",
                },
                2: {
                    color: "#00bfff",
                    content: "Đã lên đơn nhập kho",
                },
                3: {
                    color: "#00bfff",
                    content: "Đã nhập kho",
                },
                choose_status: "Chọn trạng thái",
                choose_all: "Chọn tất cả",
                original_quantity: "Số lượng",
                product_type: "Loại sản phẩm",
                creator: "Người tạo",
                created_at: "Ngày tạo",
                expiration_date: "Ngày hết hạn",
                status: "Trạng thái",
                product_type_object: {
                    1: "Thành phẩm",
                    2: "Phế phẩm",
                },
                choose_good: "Chọn hàng hóa",
                add: "Tạo lô",
                add_lot: "Tạo lô sản xuất",
                base_unit: "Đơn vị tính tiêu chuẩn",
                packing_rule: "Quy cách đóng gói",
                conversion_rate: "Trọng số chuyển đổi",
                quantity_packing_rule: "Số lượng theo quy cách đóng gói",
                quantity_base_unit: "Số lượng cần sản xuất",
                product_lot_code: "Mã lô thành phẩm",
                code1: "Mã lô thành phẩm",
                code2: "Mã lô phế phẩm",
                finished_product: "Thành phẩm",
                substandard_product: "Phế phẩm",
                quantity: "Số lượng",
                error_quantity_1: "Số lượng nhập vào không hợp lệ",
                error_quantity_1_input: "Số lượng nhập vào phải lớn hơn 0",
                description: "Mô tả",
                create_manufacturing_lot_successfully:
                    "Tạo lô sản xuất thành công",
                create_manufacturing_lot_failed: "Tạo lô sản xuất thất bại",
                lot_detail: "Xem chi tiết lô sản xuất",
                lot_type: "Loại lô",
                bill_import_code: "Mã phiếu đề nghị nhập",
                lot_diary: "Nhật ký hoạt động của lô",
                manufacturing_mill: "Xưởng sản xuất",
                team_leader: "Đội trưởng xưởng sản xuất",
                material: "Thông tin nguyên vật liệu",
                lot_edit: "Chỉnh sửa lô sản xuất",
                create_bill: "Lên phiếu nhập kho",
                lot_quantity_status: "Số lượng lô hàng sản xuất theo trạng thái"

            },

            dashboard: {
                choose_works: "Chọn nhà máy",
                from: "Từ",
                to: "Đến",
                plan_total: "Tổng số kế hoạch",
                progress_1: "Số kế hoạch đúng tiến độ/ Tổng số kế hoạch",
                progress_2: "Số kế hoạch chậm tiến độ/ Tổng số kế hoạch",
                progress_3: "Số kế hoạch quá hạn / Tổng số tiến độ",
                plan_number: "Số kế hoạch",
                plan_number_1: "Số kế hoạch đúng tiến độ",
                plan_number_2: "Số kế hoạch chậm tiến độ",
                plan_number_3: "Số kế hoạch quá hạn",
                see_more: "Xem thêm",
                command_total: "Tổng số lệnh sản xuất",
                command_number: "Số lệnh sản xuất",
                command_number_1: "Số lệnh sản xuất đúng tiến độ / Tổng số lệnh sản xuất",
                command_number_2: "Số lệnh sản xuất quá hạn / Tổng số lệnh sản xuất",
                command_progress_1: "Số lệnh sản xuất đúng tiến độ",
                command_progress_2: "Số lệnh sản xuất quá hạn",
                sales_order_number_1: "Tổng số đơn sản xuất cần lên kế hoạch",
                sales_order_progress_1: "Số đơn sản xuất cần lên kế hoạch",
                sales_order_number_2: "Số đơn sản xuất đã xong lên kế hoạch / Tổng số đơn sản xuất cần lên kế hoạch",
                sales_order_progress_2: "Số đơn sản xuất đã xong lên kế hoạch",
                sales_order_number_3: "Số đơn sản xuất chưa lên xong lên kế hoạch / Tổng số  đơn sản xuất cần lên kế hoạch",
                sales_order_progress_3: "Số đơn sản xuất chưa lên xong lên kế hoạch",
                top_ten_product: "sản phẩm được sản xuất nhiều nhất",
                filter: "Lọc",
                line: "Đường",
                bar: "Cột",
                quantity_pill: "Số lượng sản phẩm",
                choose_all_good: "Tất cả sản phẩm",
                product_quantity_change: "Biểu đồ biến động số lượng của sản phẩm sản xuất",
                total_product: "Tổng số lượng",
                finished_product: "Số lượng thành phẩm",
                sub_product: "số lượng phế phẩm"
            }
        },
        manage_transport: {
            transportRequirement: {
                add_requirements: "Thêm yêu cầu vận chuyển",
                add_success: "Tạo yêu cầu vận chuyển thành công",
                add_fail: "Tạo yêu cầu vận chuyển thất bại",
                edit_success: "Chỉnh sửa yêu cầu vận chuyển thành công",
                edit_fail: "Chỉnh sửa yêu cầu vận chuyển thất bại",
                delete_success: "Đã xóa yêu cầu vận chuyển",
                delete_fail: "Xóa yêu cầu vận chuyển thất bại",
            },
            transportPlan: {
                add_success: "Đã tạo kế hoạch vận chuyển",
                add_fail: "Tạo kế hoạch vận chuyển thất bại",
                edit_success: "Đã chỉnh sửa kế hoạch vận chuyển",
                edit_fail: "Chỉnh sửa kế hoạch vận chuyển thất bại",
                delete_success: "Đã xóa kế hoạch vận chuyển",
                delete_fail: "Xóa kế hoạch vận chuyển thất bại",
            },
            transportCommand: {
                edit_success: "Đã chỉnh sửa lệnh vận chuyển",
                edit_fail: "Chỉnh sửa lệnh vận chuyển thất bại",
            },
            transportVehicle: {
                add_success: "Đã thêm phương tiện",
                add_fail: "Thêm phương tiện thất bại",
                edit_success: "Đã chỉnh sửa trạng thái phương tiện",
                edit_fail: "Chỉnh sửa trạng thái phương tiện thất bại",
            },
            transportDepartment: {
                add_success: "Đã thêm đơn vị vận chuyển",
                add_fail: "Thêm đơn vị vận chuyển thất bại",
                delete_success: "Đã xóa đơn vị vận chuyển",
                delete_fail: "Xóa đơn vị vận chuyển thất bại",
            }
        },

        //quản lý đề nghị
        production: {
            request_management: {
                code: "Mã yêu cầu",
                createdAt: "Ngày tạo",
                command_code: "Mã lệnh sản xuất",
                desiredTime: "Thời gian mong muốn",
                status: "Trạng thái",
                creator: "Người tạo",
                index: "STT",
                select_all: "Chọn tất cả",
                1: { content: "Chưa xử lý", color: "orange" },
                2: { content: "Đã xử lý", color: "green" },
                5: { content: "Đã hủy", color: "red" },
                purchasing_request: {
                    1: { content: "Chờ phê duyệt", color: "orange" },
                    2: { content: "Yêu cầu đã gửi đến bộ phận mua hàng", color: "green" },
                    3: { content: "Đã phê duyệt mua hàng", color: "violet" },
                    4: { content: "Đã tạo đơn mua hàng", color: "blue" },
                    5: { content: "Hàng hóa đã được mua về, đang chờ phê duyệt gửi yêu cầu nhập kho", color: "orange" },
                    6: { content: "Đã gửi yêu cầu nhập kho", color: "blue" },
                    7: { content: "Đã phê duyệt yêu cầu nhập kho", color: "green" },
                    8: { content: "Đã hoàn thành nhập kho", color: "blue" },
                    9: { content: "Đã hủy yêu cầu mua hàng", color: "red" },
                    10: { content: "Đã hủy yêu cầu nhập kho", color: "red" },
                },
                receipt_request_from_order: {
                    1: { content: "Chờ phê duyệt", color: "orange" },
                    2: { content: "Đã phê duyệt, yêu cầu đã được gửi đến kho", color: "green" },
                    3: { content: "Đã gửi phê duyệt yêu cầu nhập kho", color: "green" },
                    4: { content: "Đã hoàn thành nhập kho", color: "blue" },
                    5: { content: "Đã hủy", color: "red" },
                },
                receipt_request_from_manufacturing: {
                    1: { content: "Chờ phê duyệt", color: "orange" },
                    2: { content: "Đã phê duyệt, yêu cầu đã được gửi đến kho", color: "green" },
                    3: { content: "Đã gửi phê duyệt yêu cầu nhập kho", color: "green" },
                    4: { content: "Đã hoàn thành nhập kho", color: "blue" },
                    5: { content: "Đã hủy", color: "red" },
                },
                issue_request_to_manufacturing: {
                    1: { content: "Chờ phê duyệt", color: "orange" },
                    2: { content: "Đã phê duyệt, yêu cầu đã được gửi đến kho", color: "green" },
                    3: { content: "Đã gửi phê duyệt yêu cầu xuất kho", color: "green" },
                    4: { content: "Đã hoàn thành xuất kho", color: "blue" },
                    5: { content: "Đã hủy", color: "red" },
                },
                search: "Tìm kiếm",
                select_status: "Chọn trạng thái",
                add_request_button: "Tạo mới",
                add_request:
                    "Thêm phiếu yêu cầu",
                create_successfully: "Thêm mới thành công",
                create_failed: "Thêm mới thất bại",
                description: "Mô tả",
                good_code: "Mã mặt hàng",
                good_name: "Tên mặt hàng",
                good_base_unit: "Đơn vị tính",
                quantity: "Số lượng",
                delete_good: "Xóa",
                good_info: "Thông tin hàng",
                choose_good: "---Chọn mặt hàng---",
                good_code: "Mã mặt hàng",
                error_good: "Vui lòng chọn mặt hàng",
                error_description: "Mô tả không được để trống",
                error_quantity: "Vui lòng nhập số lượng",
                cancel_editing_good: "Hủy chỉnh sửa",
                save_good: "Lưu",
                add_good: "Thêm",
                delete_good: "Xóa trắng",
                error_quantity_input: "Số lượng không hợp lệ",
                request_detail: "Chi tiết đề nghị",
                good_detail: "Chi tiết mặt hàng",
                request_edit: "Sửa phiếu đề nghị",
                edit_successfully: "Sửa dề nghị thành công",
                edit_failed: "Sửa đề nghị thất bại",
                cancel_request: "Hủy đề nghị mua hàng",
                number_status: "Số lượng đề nghị mua hàng theo trạng thái",
                purchase_request: "Đề nghị mua hàng",
                receipt_request: "Đề nghị nhập kho",
                issue_request: "Đề nghị xuất kho",
                good_return_request: "Đề nghị trả hàng",
                good_take_request: "Đề nghị luân chuyển",
                approver: "Người phê duyệt",
                approver_in_factory: "Người phê duyệt trong nhà máy",
                validate_approver_in_factory: "Bạn cần chọn người phê duyệt",
                approver_in_order: "Người phê duyệt trong đơn hàng",
                validate_approver_in_order: "Bạn cần chọn người phê duyệt",
                approver_in_stock: "Người phê duyệt trong kho",
                validate_approver_in_stock: "Bạn cần chọn người phê duyệt",
                desired_warehouse: "Kho mong muốn tiếp nhận hàng hóa",
                request_sent_from: "Đơn vị gửi đề nghị",
                unit_receiving_request: "Đơn vị tiếp nhận yêu cầu",
                stock: "Kho",
                choose_stock: "---Chọn kho---",
                validate_stock: "Bạn cần chọn kho",
                choose_unit: "---Chọn đơn vị---",
                validate_unit: "Bạn cần chọn đơn vị",
                manufacturing_works: "Nhà máy sản xuất",
                choose_manufacturing_works: "---Chọn nhà máy---",
                validate_manufacturing_works: "Bạn cần chọn nhà máy",
                base_infomation: "Thông tin cơ bản",
                approved_true: 'Phê duyệt yêu cầu'
            },
        },

        // Quản lý dự án
        project: {
            code: "Mã dự án",
            name: "Tên dự án",
            startDate: "Ngày bắt đầu dự án",
            endDate: "Ngày dự kiến kết thúc dự án",
            parent: "Dự án cha",
            manager: "Người quản trị",
            member: 'Thành viên dự án',
            detail_link: 'Link chi tiết dự án',
            estimatedTime: 'Thời gian ước lượng hoàn thành dự án',
            estimatedCost: 'Chi phí ước lượng cho dự án',
            unitTime: 'Đơn vị của thời gian',
            unitCost: 'Đơn vị của chi phí',
            description: "Mô tả dự án",
            add_title: "Thêm mới dự án",
            detail_title: "Thông tin chi tiết dự án",
            edit_title: "Chỉnh sửa dự án",
            add_btn_from_excel: "Thêm từ file excel",
            add_btn_new: "Thêm dự án mới",
            add_btn_normal: "Thêm bằng tay",
            add_btn_scheduling: "Thêm bằng lập lịch",
            add_btn_task: 'Thêm công việc mới',
            delete: 'Xoá dự án',
            list_tasks: 'Danh sách công việc dự án',
            role: 'Vai trò trong dự án',
            creator: 'Người tạo dự án',

            // Thông điệp trả về từ server 
            get_task_project_success: 'Lấy thông tin dự án thành công',
            get_task_project_fail: 'Lấy thông tin dự án thất bại',
            show_task_project_success: 'Hiển thị thông tin dự án thành công',
            show_task_project_fail: 'Hiển thị thông tin dự án thất bại',
            create_task_project_success: 'Tạo dự án mới thành công',
            create_task_project_fail: 'Không thể tạo mới dự án',
            edit_task_project_success: 'Chỉnh sửa thông tin dự án thành công',
            edit_task_project_fail: 'Không thể chỉnh sửa thông tin dự án',
            delete_task_project_success: 'Xoá dự án thành công',
            delete_task_project_fail: 'Xoá dự án thất bại',
            get_members_with_score_success: 'Lấy điểm của các thành viên thành công',
            get_members_with_score_fail: 'Lấy điểm của các thành viên thất bại',
            get_list_tasks_eval_success: 'Lấy đánh giá công việc thành công',
            get_list_tasks_eval_fail: 'Không thể lấy đánh giá công việc',
            get_salary_members_success: 'Lấy lương của các thành viên thành công',
            get_salary_members_fail: 'Lấy lương của các thành viên thất bại',
            create_project_change_request_success: 'Tạo yêu cầu thay đổi thông tin dự án thành công',
            create_project_change_request_fail: 'Tạo yêu cầu thay đổi thông tin dự án thất bại',
            get_list_project_change_requests_success: 'Lấy danh sách yêu cầu thay đổi thông tin dự án thành công',
            get_list_project_change_requests_fail: 'Lấy danh sách yêu cầu thay đổi thông tin dự án thất bại',
            update_status_project_change_request_success: 'Cập nhật trạng thái của yêu cầu thành công',
            update_status_project_change_request_fail: 'Cập nhật trạng thái của yêu cầu thất bại',
            update_list_project_change_requests_success: 'Cập nhật danh sách yêu cầu thành công',
            update_list_project_change_requests_fail: 'Cập nhật danh sách yêu cầu thất bại',

            task_management: {
                add_err_time_cost: "Thời gian & Chi phí phải là số lớn hơn 0",
                end_date: "Ngày dự kiến kết thúc",

                // unit time and cost
                estimate: "Ước lượng",
                timeAndCost: "Thời gian & Chi phí cho Lập lịch",
                estimatedTime: "Thời gian ước lượng cho công việc",
                estimatedTimeNormal: "Thông thường",
                estimatedTimePessimistic: "Bi quan",
                estimatedTimeOptimistic: "Lạc quan",
                estimatedCost: "Chi phí ước lượng cho công việc",
                estimatedCostNormal: "Thông thường",
                estimatedCostMaximum: "Tối đa",

                preceedingTask: "Công việc tiền nhiệm",
            },

            unit: {
                days: 'Ngày',
                hours: 'Giờ',
            },
            schedule: {
                taskCode: 'Mã công việc',
                taskName: 'Tên công việc',
                preceedingTasks: "Công việc tiền nhiệm",
                estimatedTime: "Thời gian ước lượng",
                estimatedTimePessimistic: "Thời gian bi quan",
                estimatedTimeOptimistic: "Thời gian lạc quan",
                estimatedCostNormal: "Chi phí thông thường",
                estimatedCostMaximum: "Chi phí thoả hiệp tối đa",
                slack: 'Thời gian dự trữ',
                criticalPath: 'Thuộc đường găng',
                calculateCPM: 'Tính toán CPM',
                showTableCPM: 'Hiển thị dữ liệu đường găng',
                hideTableCPM: 'Ẩn dữ liệu đường găng',
                insertListTasksToDB: 'Thêm vào cơ sở dữ liệu',
                calculateRecommend: 'Tính toán đề xuất thoả hiệp dự án',
                percentFinishTask: 'Xác suất hoàn thành dự án trong',
            },
            eval: {
                undefined: 'Nếu performanceIndex không tính được (mẫu số actualCost = 0 HOẶC performanceIndex = Infinity): Điểm = Chưa tính được',
                level1: 'Nếu realDuration = 0 HOẶC performanceIndex < 0.5: Điểm = 0',
                level2: 'Nếu 0.5 <= performanceIndex < 0.75: Điểm = 40',
                level3: 'Nếu 0.75 <= performanceIndex < 1: Điểm = 60',
                level4: 'Nếu 1 <= performanceIndex < 1.25: Điểm = 80',
                level5: 'Nếu 1.25 <= performanceIndex < 1.5: Điểm = 90',
                level6: 'Nếu 1.5 <= performanceIndex: Điểm = 100',
            },
            report: {
                title: 'Báo cáo chi tiết dự án'
            }
        },
        phase: {
            projectCodeName: 'Mã dự án',
            fullName: 'Tên giai đoạn',
            progress: 'Tiến độ',
            listTasks: 'Công việc liên quan',
            duration: 'Thời lượng',
            add_btn_new: "Thêm giai đoạn mới",
        },
    },
};
