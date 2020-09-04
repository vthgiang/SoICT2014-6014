export default {
    locale: 'vn',
    messages: {
        /*******************************************************
         * CHUẨN HÓA FILE NGÔN NGỮ PHÂN CHIA THEO TỪNG MODULE
         * @general những phần ngôn ngữ dùng chung cho mọi module
         * @module_name phần tự định nghĩa ngôn ngữ riêng của từng module khác nhau
         *******************************************************/
        general: {
            table: 'Bảng',
            scroll: 'Dùng thanh cuộn bảng',
            upload: 'Tải lên',
            pick_image: 'Chọn ảnh',
            crop: "Cắt ảnh",
            action: 'Hành động',
            name: 'Tên',
            description: 'Mô tả',
            search: 'Tìm kiếm',
            add: 'Thêm',
            edit: 'Sửa',
            delete: 'Xóa',
            save: 'Lưu',
            close: 'Đóng',
            accept: 'Xác nhận',
            cancel: 'Hủy',
            status: 'Trạng thái',
            month: 'Tháng',
            yes: 'Có',
            no: 'Không',
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
                    'Phân quyền hiện tại của bạn không được phép truy cập vào trang này',
                    'Phân quyền của bạn không hợp lệ',
                    'Phân quyền của bạn đã được quản lý thay đổi',
                    'Token của bạn không hợp lệ',
                    'Dịch vụ cho công ty không còn hoạt động',
                ],
            },
            validate: {
                invalid_character_error: 'Giá trị không được chứa ký tự đặc biệt',
                length_error: 'Giá trị phải có số ký tự từ {min} đến {max}',
                minimum_length_error: 'Giá trị phải có độ dài tối thiểu là {min} ký tự',
                maximum_length_error: 'Giá trị có độ dài không quá {max} ký tự',
                invalid_error: 'Giá trị không hợp lệ',
                empty_error: 'Giá trị không được để trống',
                not_existing_error: 'Giá trị không tồn tại',
                existing_error: 'Giá trị đã tồn tại',
            }
        },

        auth: {
            validator: {
                confirm_password_invalid: 'Mật khẩu không trùng khớp. Vui lòng kiểm tra lại',
                password_length_error: 'Mật khẩu phải có độ dài tối thiểu 6 và không quá 30 ký tự',
                confirm_password_error: 'Mật khẩu xác thực không khớp'
            },
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
                otp: 'OTP'
            },

            // Thông điệp nhận từ server
            change_user_information_success: 'Thay đổi thông tin người dùng thành công',
            change_user_information_faile: 'Thay đổi thông tin người dùng thất bại',
            change_user_password_success: 'Thay đổi mật khẩu thành công',
            change_user_password_faile: 'Thay đổi mật khẩu thất bại',
            user_not_found: 'Không tìm thấy thông tin người dùng',
            email_invalid: 'Email không hợp lệ',
            email_not_found: 'Email này chưa được đăng kí trên hệ thống',
            password_invalid: 'Mật khẩu không chính xác',
            email_password_invalid: 'Email hoặc mật khẩu không chính xác',
            acc_blocked: 'Tài khoản này đã bị tạm khóa',
            acc_have_not_role: 'Tài khoản chưa được phân quyền trên hệ thống',
            wrong5_block: 'Bạn đã nhập sai mật khẩu 5 lần. Tài khoản của bạn đã bị tạm khóa',
            request_forgot_password_success: 'Yêu cầu thay đổi mật khẩu thành công. Hệ thống đã gửi yêu cầu xác nhận thay đổi mật khẩu vào email của bạn',
            reset_password_success: 'Thiết lập mật khẩu thành công',
            otp_invalid: 'Yêu cầu thiết lập lại mật khẩu không hợp lệ'
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

                create_import_configuration_success: "Thêm cấu hình file import thành công",
                create_import_configuration_faile: "Thêm cấu hình file import thất bại",
                edit_import_configuration_success: "Chỉnh sửa cấu hình file import thành công",
                edit_import_configuration_faile: "Chỉnh sửa cấu hình file import thất bại",

                email_exist: 'Email này đã được sử dụng',
                company_not_found: 'Không tìm thấy thông tin về công ty',
                link_exist: 'Url cho link đã tồn tại',
                component_exist: 'Component này đã tồn tại',
            },

            system_setting: {
                backup: {
                    config: 'Cấu hình sao lưu dữ liệu',
                    backup_button: 'Sao lưu dữ liệu',
                    automatic: 'Tự động',
                    on: 'Bật sao lưu',
                    off: "Tắt sao lưu",
                    week_day: {
                        mon: 'Thứ hai',
                        tue: 'Thứ ba',
                        wed: 'Thứ tư',
                        thur: 'Thứ năm',
                        fri: 'Thứ sáu',
                        sat: 'Thứ bảy',
                        sun: 'Chủ nhật',
                    },
                    month_list: {
                        jan: 'Tháng 1',
                        feb: 'Tháng 2',
                        mar: 'Tháng 3',
                        apr: 'Tháng 4',
                        may: 'Tháng 5',
                        june: 'Tháng 6',
                        july: 'Tháng 7',
                        aug: 'Tháng 8',
                        sep: 'Tháng 9',
                        oct: 'Tháng 10',
                        nov: 'Tháng 11',
                        dec: 'Tháng 12'
                    },
                    limit: 'Giới hạn',
                    period: 'Định kỳ',
                    weekly: 'Hàng tuần',
                    monthly: 'Hàng tháng',
                    yearly: 'Hằng năm',
                    date: 'Ngày',
                    hour: 'Giờ',
                    minute: 'Phút',
                    second: 'Giây',
                    day: 'Thứ',
                    month: 'Tháng',
                    save: 'Lưu cấu hình',

                    version: 'Phiên bản',
                    description: 'Mô tả về phiên bản',
                    backup_time: 'Thời gian đã sao lưu',
                    action: 'Hành động',
                },
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
                delete_system_link_success: 'Xóa system link thành công',

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
                select_link: 'Chọn link tương ứng',

                //Thông điệp trả về từ server
                create_system_component_success: 'Tạo system component thành công',
                get_system_component_success: 'Lấy dữ liệu system component thành công',
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
            title: 'Thông báo',
            news: 'Thông báo mới',
            see_all: 'Xem tất cả',
            total: 'Tổng số',
            level: 'loại thông báo',
            type: {
                title: 'Loại thông báo',
                info: 'Thông tin',
                general: 'Thông báo chung',
                important: 'Thông báo quan trọng',
                emergency: 'Thông báo khẩn',
            },
            content: 'Nội dung thông báo',
            sender: 'Gửi từ',
            departments: 'Thông báo tới đơn vị/phòng ban',
            users: 'Thông báo đến người dùng cụ thể',
            from: 'Từ',
            at: 'lúc',

            add: 'Tạo thông báo',
            receivered: 'Thông báo đã nhận',
            sent: 'Thông báo đã tạo',
            note: 'Chú thích',
            info: 'Thông tin thông báo',
            delete: 'Xóa thông báo',
            new: 'Mới',

            // Thông điệp trả về từ server
            create_notification_success: 'Tạo thông báo thành công',
            create_notification_faile: 'Tạo thông báo thất bại',
            delete_notification_success: 'Xóa thông báo thành công',
            delete_notification_faile: 'Xóa thông báo thất bại',
            delete_manual_notification_success: 'Xóa thông báo thành công',
            delete_manual_notification_faile: 'Xóa thông báo thất bại',
        },

        document: {
            title: 'Quản lý tài liệu biểu mẫu',
            version: 'Tên phiên bản',
            information: 'Thông tin',
            different_versions: 'Phiên bản khác',
            amount: 'Số lượng',
            name: 'Tên tài liệu',
            description: 'Mô tả',
            category: "Loại tài liệu",
            domain: 'Danh mục',
            archive: 'Lưu trữ',
            roles: 'Những vị trí có quyền xem mẫu này',
            issuing_date: 'Ngày ban hành',
            effective_date: 'Ngày áp dụng',
            expired_date: 'Ngày hết hạn',
            views: 'Số lần xem',
            viewer: 'Người xem',
            downloader: "Người tải",
            downloads: 'Số lần download',
            add: 'Thêm tài liệu',
            edit: 'Sửa tài liệu',
            watch: 'Xem tài liệu',
            delete: 'Xóa tài liệu',
            time: "Thời gian",
            add_version: 'Thêm phiên bản mới',
            upload_file: 'File tài liệu',
            upload_file_scan: 'File scan tài liệu',
            download: 'Tải xuống',
            no_version: 'Không có phiên bản nào khác',
            no_blank_description: 'Mô tả không được để trống',
            no_blank_name: 'Tên không được để trống',
            infomation_docs: "Thông tin tài liệu",
            relationship_role_store: "Liên kết, phân quyền và lưu trữ",
            statistical_document: "Thống kê các loại tài liệu",
            statistical_view_down: "Thống kê số lượng xem và download các loại tài liệu",
            statistical_document_by_domain: "Thống kê số lượng tài liệu theo danh mục",
            statistical_document_by_archive: "Thống kê số lượng tài liệu theo vị trí lưu trữ",
            doc_version: {
                title: 'Phiên bản',
                name: 'Tên phiên bản',
                description: 'Mô tả',
                issuing_body: 'Cơ quan ban hành',
                official_number: 'Số hiệu',
                issuing_date: 'Ngày ban hành',
                effective_date: 'Ngày áp dụng',
                expired_date: 'Ngày hết hạn',
                signer: 'Người ký',
                number_view: 'Số lần xem',
                number_download: 'Số lần tải',
                file: 'File upload',
                scanned_file_of_signed_document: 'File scan',
                exp_issuing_body: 'Ví dụ: Cơ quan hành chính',
                exp_official_number: 'Ví dụ: 05062020VN',
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
                title: 'Liên kết tài liệu',
                description: 'Mô tả',
                list: 'Các tài liệu liên kết'
            },
            store: {
                title: 'Hồ sơ lưu trữ bản cứng',
                information: 'Thông tin lưu trữ',
                organizational_unit_manage: 'Đơn vị quản lý',
                select_organizational: 'Chọn đơn vị quản lý',
                user_manage: 'Người quản lý',
                select_user: 'Chọn người quản lý',
            },

            category: 'Loại tài liệu',
            domain: 'Danh mục',
            data: 'Danh sách tài liệu',
            statistics_report: 'Thống kê báo cáo',
            history_report: 'Lịch sử thống kê',

            administration: {
                categories: {
                    add: 'Thêm loại tài liệu',
                    edit: 'Sửa thông tin loại tài liệu',
                    delete: 'Xóa loại tài liệu',
                    name: 'Tên',
                    description: 'Mô tả',
                    select: 'Chọn loại tài liệu',
                    not_select: 'Chưa thuộc loại tài liệu',
                },
                domains: {
                    add: 'Thêm danh mục tài liệu',
                    edit: 'Sửa thông tin danh mục tài liệu',
                    delete: 'Xóa các danh mục đã chọn',
                    name: 'Tên',
                    description: 'Mô tả',
                    parent: 'Danh mục cha',
                    select_parent: 'Chọn danh mục cha',
                    select: 'Chọn danh mục',
                    not_select: 'Không thuộc về danh mục nào',
                },
                archives: {
                    add: 'Thêm vị trí lưu trữ tài liệu',
                    edit: 'Sửa thông tin vị trí lưu trữ tài liệu',
                    delete: 'Xóa các vị trí lưu trữ đã chọn',
                    name: 'Tên',
                    description: 'Mô tả',
                    parent: 'Vị trí lưu trữ cha',
                    select_parent: 'Chọn vị trí lưu trữ cha',
                    select: 'Chọn ',
                    not_select: 'Không thuộc về vị trí nào',
                    path: 'Đường dẫn',
                    path_detail: "Đường đẫn chi tiết",
                }
            },
            user: {

            },
        },

        crm: {
            customer: {
                name: 'Tên khách hàng',
                code: 'Mã khách hàng',
                phone: 'Số điện thoại',
                group: 'Nhóm khách hàng',
                address: 'Địa chỉ',
                email: 'Email',
                location: 'Khu vực',
                birth: 'Ngày sinh',
                gender: 'Giới tính',
                liability: 'Công nợ',
                tax: 'Mã số thuế',
                document: 'Giấy tờ',
                description: 'Mô tả',
                carier: 'Nhân viên chăm sóc phụ trách',
                discount: 'Chiết khấu áp dụng', by_group: 'Theo nhóm khách hàng', by_customer: 'Theo khách hàng',
                payment: 'Hình thức thanh toán',

                info: 'Thông tin chung',
                contact: 'Thông tin liên hệ',
                advance: 'Thông tin khác',

                add: 'Thêm mới khách hàng',
                see: 'Xem thông tin khách hàng',
                edit: 'Chỉnh sửa thông tin khách hàng',
                delete: 'Xóa thông tin khách hàng',
            },
            group: {

            },
            lead: {

            },
            care: {

            },
            statistic: {

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

        confirm: {
            yes: 'CÓ',
            no: 'KHÔNG',
            no_data: 'Không có dữ liệu',
            field_invalid: 'Giá trị trường nhập vào không hợp lệ. Vui lòng kiểm tra lại!',
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
            system_administration: 'Quản trị hệ thống',
            manage_system: 'Sao lưu phục hồi',
            manage_company: 'Doanh nghiệp',
            manage_role: 'Quản lý phân quyền',
            manage_link: 'Quản lý trang',
            manage_component: 'Quản lý UI-Component',

            manage_department: 'Quản lý cơ cấu tổ chức',
            manage_user: 'Quản lý người dùng',

            manage_document: 'Quản lý tài liệu',
            documents: 'Tài liệu văn bản',

            crm: 'CRM',
            crm_list: {
                customer: 'Khách hàng',
                lead: 'Khách hàng thân thiết',
                care: 'Chăm sóc khách hàng',
                group: 'Nhóm khách hàng',
                statistic: 'Thống kê',
            },

            task_template: 'Mẫu Công Việc',
            taskmanagement: 'Quản Lý Công Việc',
            manageDocument: 'Quản lý văn bản',
            manageDocumentType: 'Quản lý loại văn bản',

            leave_application: 'Quản lý đơn xin nghỉ',
            manage_employee: 'Quản lý nhân sự',
            manage_holiday: 'Quản lý kế hoạch làm việc',
            manage_training: 'Quản lý đào tạo',
            account: 'Tài khoản',
            annual_leave_personal: 'Nghỉ phép',
            manage_unit: 'Quản lý nhân sự các đơn vị',
            add_employee: 'Thêm nhân viên',
            list_employee: 'Quản lý thông tin nhân viên',
            detail_employee: 'Thông tin cá nhân',
            update_employee: 'Cập nhật thông tin cá nhân',
            dashboard_employee: 'Bảng tin quản lý nhân sự',
            discipline: 'Quản lý khen thưởng - kỷ luật',
            annual_leave: 'Quản lý nghỉ phép',
            salary_employee: 'Quản lý lương nhân viên',
            time_keeping: 'Chấm công nhân viên',
            list_education: 'Chương trình đào tạo bắt buộc',
            training_plan: 'Quản lý khoá đào tạo',

            manage_warehouse: 'Quản lý kho',
            material_manager: 'Quản lý thông tin vật tư',
            dashboard_material: "Bảng tin quản lý vật tư",

            manage_kpi: 'Quản lý KPI',
            kpi_unit_create: 'Khởi tạo KPI đơn vị',
            kpi_unit_evaluate: 'Dữ liệu KPI đơn vị',
            kpi_unit_overview: 'Tổng quan KPI đơn vị',
            kpi_unit_dashboard: 'Dashboard KPI đơn vị',
            kpi_unit_statistic: 'Thống kê KPI đơn vị',
            kpi_unit_manager: 'Quản lý KPI đơn vị',
            kpi_member_manager: 'Đánh giá KPI nhân viên',
            kpi_member_dashboard: 'DashBoard KPI nhân viên',
            kpi_personal_create: 'Khởi tạo KPI cá nhân',
            kpi_personal_evaluate: 'Dữ liệu KPI cá nhân',
            kpi_personal_overview: 'Tổng quan KPI cá nhân',
            kpi_personal_dashboard: 'Dashboard KPI cá nhân',
            kpi_personal_manager: 'Quản lí KPI cá nhân',

            notifications: 'Thông báo',

            tasks: 'Quản lý công việc',
            task: "Chi tiết công việc",
            task_management: 'Danh sách công việc',
            task_management_dashboard: 'Dashboard công việc',
            task_organization_management_dashboard: 'Dashboard công việc đơn vị',
            task_management_process: "Danh sách quy trình",
            task_process_template: "Mẫu quy trình",

            //*******START */
            // Quản lý tài sản
            // QUẢN LÝ

            add_asset: 'Thêm tài sản',
            manage_repair_asset: 'Quản lý sửa chữa, thay thế',
            manage_usage_asset: 'Quản lý sử dụng tài sản',
            manage_distribute_asset: 'Quản lý cấp phát, điều chuyển',
            manage_room_asset: 'Quản lý phòng & trang thiết bị',
            manage_crash_asset: 'Quản lý sự cố tài sản',

            manage_asset: 'Quản lý tài sản',
            dashboard_asset: 'DashBoard quản lý tài sản',
            manage_type_asset: 'Quản lý loại tài sản',
            manage_info_asset: 'Quản lý thông tin tài sản',
            manage_maintainance_asset: 'Quản lý bảo trì tài sản',
            manage_depreciation_asset: 'Quản lý khấu hao tài sản',
            manage_incident_asset: 'Quản lý sự cố tài sản',
            manage_recommend_procure: 'Quản lý đề nghị mua sắm',
            manage_recommend_distribute_asset: 'Quản lý đăng ký sử dụng',
            employee_manage_asset_info: 'Tài sản quản lý',

            view_building_list: 'Xem danh sách mặt bằng',

            // NHÂN VIÊN
            recommend_equipment_procurement: 'Đăng ký mua sắm thiết bị',
            recommend_distribute_asset: 'Đăng ký sử dụng thiết bị',
            manage_assigned_asset: 'Tài sản sử dụng',
            //******END */

            // QUẢN LÝ BÁO CÁO
            report_management: 'Quản lý báo cáo',
            task_report: 'Quản lý báo cáo công việc',

            //QUẢN LÝ ĐƠN HÀNG
            manage_orders: "Quản lý đơn hàng",
            manage_list_orders: "Danh sách đơn hàng",
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
            edit_title: 'Chỉnh sửa đơn vị',
            add_title: 'Thêm đơn vị mới',
            info: 'Thông tin về đơn vị',
            name: 'Tên đơn vị',
            description: 'Mô tả về đơn vị',
            parent: 'Đơn vị cha',
            select_parent: 'Chọn đơn vị cha',
            no_parent: 'Không có đơn vị cha',
            roles_of_department: 'Các chức danh của đơn vị',
            dean_name: 'Tên các chức danh trưởng đơn vị',
            dean_example: 'VD: Trưởng phòng tài chính',
            vice_dean_name: 'Tên các chức danh phó đơn vị',
            vice_dean_example: 'VD: Phó phòng tài chính',
            employee_name: 'Tên các chức danh nhân viên đơn vị',
            employee_example: 'VD: Nhân viên phòng tài chính',
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

        // Modules Quản lý nhân sự
        human_resource: {
            // Nhóm dùng chung cho module quản lý nhân sự
            stt: 'STT',
            unit: 'Đơn vị',
            position: 'Chức vụ',
            month: 'Tháng',
            status: 'Trạng thái',
            staff_number: 'Mã nhân viên',
            staff_name: 'Họ và tên',
            all_unit: 'Chọn tất cả các đơn vị',
            non_unit: 'Chọn đơn vị',
            non_staff: 'Chọn nhân viên',
            all_position: 'Chọn tất cả các chức vụ',
            non_position: 'Chọn chức vụ',
            all_status: 'Chọn tất cả các trạng thái',
            non_status: 'Chọn trạng thái',
            not_unit: 'Chưa chọn đơn vị',
            add_data_by_excel: 'Thêm dữ liệu bằng việc Import file excel',
            download_file: 'Download file import mẫu!',
            choose_file: 'Chọn file',
            name_button_export: 'Xuất báo cáo',
            choose_decision_unit: 'Chọn cấp ra quyết định',

            note_file_import: 'File import không đúng định dạng',
            error_row: 'Có lỗi xảy ra ở các dòng',

            // Validator dung chung cho module quản lý nhân sự
            employee_number_required: 'Mã nhân viên không được để trống',
            staff_code_not_special: 'Mã nhân viên không được chứ ký tự đặc biệt',
            staff_code_not_find: 'Mã nhân viên không tồn tại',
            start_date_before_end_date: 'Ngày bắt đầu phải trước ngày kết thúc',
            end_date_after_start_date: 'Ngày kết thúc phải sau ngày bắt đầu',

            // Quản lý lương nhân viên
            salary: {
                // list_salary: 'Danh sách bảng lương nhân viên',
                file_name_export: 'Bảng theo dõi lương thưởng',

                // Nhóm dành cho table
                table: {
                    main_salary: 'Tiền lương chính',
                    other_salary: 'Các loại lương thưởng khác',
                    name_salary: 'Tên lương thưởng',
                    money_salary: 'Số tiền',
                    total_salary: 'Tổng lương',
                    action: 'Hành động'
                },

                // Nhóm dành cho action
                edit_salary: 'Chỉnh sửa bảng lương nhân viên',
                delete_salary: 'Xoá bảng lương',
                add_salary: 'Thêm bảng lương',
                add_salary_title: 'Thêm bảng lương nhân viên',
                add_by_hand: 'Thêm bằng tay',
                add_by_hand_title: 'Thêm một bảng lương',
                add_import: 'Import file excel',
                add_import_title: 'Thêm nhiều bảng lương',
                add_more_salary: 'Thêm lương thưởng khác',
                add_new_salary: 'Thêm mới bảng lương',

                // Thông điệp trả về từ server
                employee_code_duplicated: 'Mã số nhân viên bị trùng lặp',
                employee_name_required: 'Tên nhân viên không được để trống',
                employee_number_required: 'Mã nhân viên không được để trống',
                staff_code_not_special: 'Mã nhân viên không được chứ ký tự đặc biệt',
                staff_code_not_find: 'Mã nhân viên không tồn tại',
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
                import_salary_success: 'Import bảng lương thành công',
                import_salary_faile: 'Import bảng lương thất bại',
            },

            // Quản lý nghỉ phép
            annual_leave: {
                // list_annual_leave: 'Danh sách đơn xin nghỉ',

                // Nhóm dành cho table
                table: {
                    start_date: 'Ngày bắt đầu',
                    end_date: 'Ngày kết thúc',
                    reason: 'Lý do',
                    action: 'Hành động'
                },

                // Nhóm dành cho trạng thái nghỉ phép 
                status: {
                    pass: 'Đã chấp nhận',
                    faile: 'Không chấp nhận',
                    process: 'Chờ phê duyệt',
                },

                // Nhóm dành cho action
                edit_annual_leave: 'Chỉnh sửa thông tin nghỉ phép',
                delete_annual_leave: 'Xoá thông tin nghỉ phép',
                add_annual_leave: 'Thêm đơn xin nghỉ',
                add_annual_leave_title: 'Thêm mới đơn xin nghỉ phép',

                // Thông điệp trả về từ server
                employee_code_duplicated: 'Mã số nhân viên bị trùng lặp',
                employee_name_required: 'Tên nhân viên không được để trống',
                employee_number_required: 'Mã nhân viên không được để trống',
                staff_code_not_special: 'Mã nhân viên không được chứ ký tự đặc biệt',
                staff_code_not_find: 'Mã nhân viên không tồn tại',
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
                aplication_annual_leave_success: 'Thêm đơn xin nghỉ thành công',
            },

            // Quản lý khen thưởng kỷ luật
            commendation_discipline: {
                // Quản lý khen thưởng
                commendation: {
                    list_commendation: 'Danh sách khen thưởng',
                    list_commendation_title: 'Danh sách nhân viên được khen thưởng',
                    file_name_export: 'Bảng thống kê khen thưởng',

                    // Nhóm dành cho table
                    table: {
                        decision_date: 'Ngày ra quyết định',
                        decision_number: 'Số ra quyết định',
                        decision_unit: 'Cấp ra quyết định',
                        reward_forms: 'Hình thức khen thưởng',
                        reason_praise: 'Thành tích (Lý do)',

                    },

                    // Nhóm dành cho action
                    add_commendation: 'Thêm khen thưởng',
                    add_commendation_title: 'Thêm mới khen thưởng',
                    edit_commendation: 'Chỉnh sửa thông tin khen thưởng',
                    delete_commendation: 'Xoá thông tin khen thưởng',

                    // Thông điệp trả về từ server
                    employee_number_required: 'Mã nhân viên không được để trống',
                    staff_code_not_special: 'Mã nhân viên không được chứ ký tự đặc biệt',
                    staff_code_not_find: 'Mã nhân viên không tồn tại',
                    number_decisions_required: 'Số ra quyết định không được để trống',
                    number_decisions_have_exist: 'Số ra quyết định đã tồn tại',
                    unit_decisions_required: 'Cấp ra quyết định không được để trống',
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
                },

                // Quản lý ky luật
                discipline: {
                    list_discipline: 'Danh sách kỷ luật',
                    list_discipline_title: 'Danh sách nhân viên bị kỷ luật',
                    file_name_export: 'Bảng thống kê kỷ luật',
                    start_date_before_end_date: 'Ngày có hiệu lực phải trước ngày hết hiệu lực',
                    end_date_after_start_date: 'Ngày hết hiệu lực phải sau ngày có hiệu lực',

                    // Nhóm dành cho table
                    table: {
                        start_date: 'Ngày có hiệu lực',
                        end_date: 'Ngày hết hiệu lực',
                        discipline_forms: 'Hình thức kỷ luật',
                        reason_discipline: 'Lý do kỷ luật',
                    },

                    // Nhóm dành cho action
                    add_discipline: 'Thêm kỷ luật',
                    add_discipline_title: 'Thêm mới kỷ luật',
                    edit_discipline: 'Chỉnh sửa thông tin kỷ luật',
                    delete_discipline: 'Xoá thông tin kỷ luật',

                    // Thông điệp trả về từ server
                    employee_number_required: 'Mã nhân viên không được để trống',
                    staff_code_not_special: 'Mã nhân viên không được chứ ký tự đặc biệt',
                    staff_code_not_find: 'Mã nhân viên không tồn tại',
                    number_decisions_required: 'Số ra quyết định không được để trống',
                    number_decisions_have_exist: 'Số ra quyết định đã tồn tại',
                    unit_decisions_required: 'Cấp ra quyết định không được để trống',
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

                }
            },

            // Quản lý thông tin nhân viên
            profile: {
                // Nhóm dùng chung cho chức năng quản lý tông tin nhân viên
                tab_name: {
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
                },

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
                starting_date: 'Ngày bắt đầu làm việc',
                leaving_date: 'Ngày nghỉ việc',
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
                active: 'Đang làm việc',
                leave: 'Đã nghỉ làm',

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
                district: 'Huyện/Quận',
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
                add_staff: 'Thêm nhân viên',

                reward: 'Khen thưởng',
                discipline: 'Kỷ luật',
                historySalary: 'Lịch sử tăng giảm lương',
                sabbatical: 'Thông tin nghỉ phép',

                // Validator dữ liệu nhập bên client
                start_date_before_end_date: 'Ngày cấp phải trước ngày hết hạn',
                end_date_after_start_date: 'Ngày hết hạn phải sau ngày cấp',
                time_experience_duplicate: 'Thời gian làm việc bị trùng lặp',
                time_contract_duplicate: 'Thời gian hợp đồng lao động bị trùng lặp',
                time_BHXH_duplicate: 'Quá trình đóng bảo hiểm bị trùng lặp',
                start_month_before_end_month: 'Từ tháng/năm phải trước đến tháng/năm',
                end_month_after_start_month: 'Đến tháng/năm phải sau từ tháng/năm',
                start_date_insurance_required: 'Ngày có hiệu lực chưa được nhập',
                starting_date_before_leaving_date: 'Thời gian bắt đầu làm việc phải trước thời gian nghỉ việc',
                leaving_date_after_starting_date: 'Thời gian nghỉ việc phải sau thời gian bắt đầu làm việc',
                starting_date_required: 'Ngày bắt đầu làm việc chưa được nhập',

                // Quản lý thông tin cá nhân
                employee_info: {
                    // Nhóm dành cho UI
                    note_page_personal: 'Tôi xin cam đoan những lời khai trên đây là đúng sự thật và chịu trách nhiệm cho những lời khai này.',
                    contact_other: '(Những thông tin khác vui lòng liên hệ các bên liên quan để được xử lý)',
                    update_infor_personal: 'Cập nhật thông tin nhân viên',
                    no_data_personal: 'Chưa có thông tin cá nhân',

                    guaranteed_infor_to_update: 'Bạn chưa cam đoan thông tin cần cập nhật',
                    no_change_data: 'Không có thông tin nào được thay đổi',

                    // Thông điệp trả về từ server
                    get_infor_personal_success: 'Lấy thông tin cá nhân thành công',
                    get_infor_personal_false: 'Lấy thông tin cá nhân thất bại',
                    edit_infor_personal_success: 'Cập nhật thông tin cá nhân thành công',
                    edit_infor_personal_false: 'Cập nhật thông tin cá nhân thất bại',
                },

                employee_management: {
                    file_name_export: 'Thông tin nhân viên',
                    no_gender: 'Chọn giới tính',
                    all_gender: 'Chọn tất cả giới tính',
                    brithday_lable: 'Sinh nhật',
                    brithday_lable_title: 'Tháng sinh nhật',
                    contract_lable: 'Hết hạn hợn đồng',
                    contract_lable_title: 'Tháng hết hạn hợp đồng',
                    contract_type_title: 'Loại hợp đồng lao động',


                    // Nhóm dành cho action
                    view_employee: 'Xem thông tin nhân viên',
                    edit_employee: 'Chỉnh sửa thông tin nhân viên',
                    delete_employee: 'Xoá thông tin nhân viên',
                    add_employee: 'Thêm nhân viên',
                    add_employee_title: 'Thêm mới nhân viên',
                    add_by_hand: 'Thêm một nhân viên',
                    add_import: 'Import file excel',

                    // Thông điệp trả về từ server
                    get_list_employee_success: 'Lấy danh sách nhân viên thành công',
                    get_list_employee_false: 'Lấy danh sách nhân viên thất bại',
                    create_employee_success: 'Thêm mới nhân viên thành công',
                    create_employee_false: 'Thêm mới nhân viên thất bại',
                    delete_employee_success: 'Xoá thông tin nhân viên thành công',
                    delete_employee_false: 'Xoá thông tin nhân viên thất bại',
                    edit_employee_success: 'Chỉnh sửa thông tin nhân viên thành công',
                    edit_employee_false: 'Chỉnh sửa thông tin nhân viên thất bại',
                    employee_number_required: 'Mã nhân viên không được để trống',
                    email_in_company_required: 'Email công ty không được để trống',
                    employee_number_have_exist: 'Mã nhân viên đã tồn tại',
                    email_in_company_have_exist: 'Email công ty đã tồn tại',
                    employee_timesheet_id_required: 'Mã số chấm công không được để trống',
                    full_name_required: 'Họ và tên không được để trống',
                    birthdate_required: 'Ngày sinh không được để trống',
                    starting_date_required: 'Ngày bắt đầu làm việc không được để trống',
                    identity_card_number_required: 'Số chứng minh thư/hộ chiếu không được để trống',
                    identity_card_date_required: 'Ngày cấp chứng minh thư/hộ chiếu không được để trống',
                    identity_card_address_required: 'Nơi cấp chứng minh thư/hộ chiếu không được để trống',
                    phone_number_required: 'Điện thoại di động 1',
                    tax_date_of_issue_required: 'Ngày hoạt động không được để trống',
                    tax_number_required: 'Mã số thuế không được để trống',
                    tax_representative_required: 'Người đại diện không được để trống',
                    tax_authority_required: 'Cơ quan quản lý thuế không được để trống',
                    temporary_residence_required: 'Địa chỉ Chỗ ở hiện tại không được để trống',
                }
            },

            // Quản lý kế hoạch làm việc (lịch nghỉ lễ tết)
            holiday: {
                file_name_export: 'Kế hoạch làm việc',
                number_date_leave_of_year: 'Số ngày nghỉ phép',
                date_year: 'ngày/năm',
                year: 'Năm',
                number_date: 'Số ngày',
                list_holiday: 'Kế hoạch nghỉ lễ, nghỉ tết',
                list_no_leave: 'Thời gian không được nghỉ',
                list_auto_leave: 'Thời gian được nghỉ phép',

                // Nhóm dành cho table
                table: {
                    type: 'Thể loại',
                    timeline: 'Các mốc thời gian',
                    start_date: 'Ngày bắt đầu',
                    end_date: 'Ngày kết thúc',
                    describe_timeline: 'Mô tả',
                },

                // Nhóm thể loại kế hoạch làm Việc
                holiday: 'Nghỉ lễ',
                auto_leave: 'Được nghỉ',
                no_leave: 'Không được phép nghỉ',

                // Nhóm dành cho action
                edit_holiday: 'Chỉnh sửa kế hoạch làm việc',
                delete_holiday: 'Xoá kế hoạch làm việc',
                add_holiday: 'Thêm mới',
                add_holiday_title: 'Thêm mới kế hoạch làm việc',
                add_by_hand: 'Thêm một kế hoạch làm việc',
                add_import: 'Import file excel',

                // Thông điệp trả về từ server
                type_required: 'Thể loại không được để trống',
                start_date_required: 'Thời gian bắt đầu không được để trống',
                end_date_required: 'Thời gian kết thúc không được để trống',
                reason_required: 'Mô tả kế hoạch làm việc không được để trống',
                holiday_duplicate_required: 'Thời gian bị trùng lặp',
                edit_number_date_leave_of_year_success: 'Thay đổi số ngày nghỉ trong một năm thành công',

                get_holiday_success: 'Lấy danh sách kế hoạch làm việc thành công',
                get_holiday_faile: 'Lấy danh sách kế hoạch làm việc thất bại',
                create_holiday_success: 'Thêm mới kế hoạch làm việc thành công',
                create_holiday_faile: 'Thêm mới kế hoạch làm việc thất bại',
                delete_holiday_success: 'Xoá kế hoạch làm việc thành công',
                delete_holiday_faile: 'Xoá kế hoạch làm việc thất bại',
                edit_holiday_success: 'Chỉnh sửa kế hoạch làm việc thành công',
                edit_holiday_faile: 'Chỉnh sửa kế hoạch làm việc thất bại',
                import_holiday_success: 'Import thông tin nghỉ lễ tết thành công',
                import_holiday_faile: 'Import thông tin nghỉ lễ tết thất bại',
            },

            // Quản lý chấm công nhân viên
            timesheets: {
                file_name_export: 'Bảng chấm công',
                symbol: ' Ký hiệu',
                not_work: 'Nghỉ làm',
                do_work: 'Có đi làm',
                total_timesheets: 'Tổng số công',
                work_date_in_month: 'Công làm việc trong tháng',
                shift_work: 'Ca làm việc',
                shifts1: 'ca 1',
                shifts2: 'ca 2',
                date_of_month: 'Các ngày trong tháng',

                // Nhóm dành cho action
                edit_timesheets: 'Chỉnh sửa thông tin chấm công',
                delete_timesheets: 'Xoá thông tin chấm công',
                add_timesheets: 'Thêm mới',
                add_timesheets_title: 'Thêm mới thông tin chấm công',
                add_by_hand: 'Thêm một bảng công',
                add_import: 'Import file excel',

                // Thông điệp trả về từ server
                employee_code_duplicated: 'Mã số nhân viên bị trùng lặp',
                employee_name_required: 'Tên nhân viên không được để trống',
                employee_number_required: "Mã nhân viên không được để trống",
                month_timesheets_required: "Tháng chấm công không được để trống",
                staff_code_not_find: "Mã nhân viên không tồn tại",
                month_timesheets_have_exist: "Tháng chấm công đã tồn tại",
                get_timesheets_success: "Lấy thông tin chấm công thành công",
                get_timesheets_faile: "Lấy thông tin chấm công thất bại",
                create_timesheets_success: "Thêm mới thông tin chấm công thành công",
                create_timesheets_faile: "Thêm mới thông tin chấm công thất bại",
                edit_timesheets_success: "Chỉnh sửa thông tin chấm công thành công",
                edit_timesheets_faile: "Chỉnh sửa thông tin chấm công thất bại",
                delete_timesheets_success: "Xoá thông tin chấm công thành công",
                delete_timesheets_faile: "Xoá thông tin chấm công thất bại",
                import_timesheets_success: "Import thông tin chấm công thành công",
                import_timesheets_faile: "Import thông tin chấm công thất bại",

            },

            // Quản lý nhân sự các đơn vị
            manage_department: {
                edit_unit: 'Chỉnh sửa nhân sự đơn vị',
                dean_unit: 'Trưởng đơn vị',
                vice_dean_unit: 'Phó đơn vị',
                employee_unit: 'Nhân viên đơn vị',
                email_employee: 'Email nhân viên',
                add_employee_unit: 'Thêm nhân viên',
            },

            // Nghỉ phép
            annual_leave_personal: {
                list_annual_leave: 'Quy định về nghỉ phép của công ty',
                inform_annual_leave: 'Thông tin nghỉ phép cá nhân',
                note: 'Chú thích',
                day: 'ngày',
                total_number_leave_of_year: 'Tổng số ngày nghỉ phép cả năm',
                leaved: 'Bạn đã nghỉ',
                view_detail: 'Chi tiết xem ở trang',
                receiver: 'Người nhận',

                // Nhóm action
                create_annual_leave: 'Xin nghỉ phép',

            }

        },

        // Modules quản lý đào tạo
        training: {

            // Quản khoá đào tạo
            course: {

                // Thông điệp trả về từ server
                name_required: 'Tên khoá đào tạo không được để trống',
                course_id_required: 'Mã khoá đào tạo không được để trống',
                offered_by_required: 'Đơn vị đào tạo không được để trống',
                course_place_required: 'Địa điểm đào tạo không được để trống',
                start_date_required: 'Thời gian bắt đầu không được để trống',
                end_date_required: 'Thời gian kết thúc không được để trống',
                type_required: 'Loại đào tạo không được để trống',
                education_program_required: 'Thuộc chương trình đào tạo không được để trống',
                employee_commitment_time_required: 'Thời gian cam kết không được để trống',
                cost_required: 'Chi phí đào tạo không được để trống',
                course_id_have_exist: 'Mã khoá đào tạo đã tồn tại',

                get_list_course_success: 'Lấy danh sách khoá đào tạo thành công',
                get_list_course_faile: 'Lấy danh sách khoá đào tạo thất bại',
                create_course_success: 'Thêm mới khoá đào tạo thành công',
                create_course_faile: 'Thêm mới khoá đào tạo thất bại',
                delete_course_success: 'Xoá khoá đào tạo thành công',
                delete_course_faile: 'Xoá khoá đào tạo thất bại',
                edit_course_success: 'Chỉnh sửa khoá đào tạo thành công',
                edit_course_faile: 'Chỉnh sửa khoá đào tạo thất bại',
            },

            // Quản lý chương trình đào tạo
            education_program: {

                // Thông điệp trả về từ server
                apply_for_organizational_units_required: 'Áp dụng cho đơn vị không được để trống',
                apply_for_positions_required: 'Áp dụng cho chức vụ không được để trống',
                program_id_required: 'Mã chương trình đào tạo không được để trống',
                name_required: 'Tên chương trình đào tạo không được để trống',
                program_id_have_exist: 'Mã chương trình đào tạo đã tồn tại',

                get_education_program_success: 'Lấy danh sách chương trình đào tạo thành công',
                get_education_program_faile: 'Lấy danh sách chương trình đào tạo thất bại',
                create_education_program_success: 'Thêm mới chương trình đào tạo thành công',
                create_education_program_faile: 'Thêm mới chương trình đào tạo thất bại',
                delete_education_program_success: 'Xoá chương trình đào tạo thành công',
                delete_education_program_faile: 'Xoá chương trình đào tạo thất bại',
                edit_education_program_success: 'Chỉnh sửa chương trình đào tạo thành công',
                edit_education_program_faile: 'Chỉnh sửa chương trình đào tạo thất bại',
            }

        },

        // Modules Quản lý tài sản
        asset: {
            general_information: {
                asset: 'Tài sản',
                asset_list: 'Dang sách tài sản',
                search: 'Tìm kiếm',
                add: 'Thêm',
                basic_information: 'Thông tin cơ bản',
                detail_information: 'Thông tin chi tiết',
                view: 'Xem thông tin tài sản',
                edit_info: 'Chỉnh sửa thông tin tài sản',
                delete_info: 'Xóa thông tin tài sản',
                save: 'Lưu',
                edit: 'Chỉnh sửa',
                delete: 'Xóa',
                cancel: 'Hủy',

                select_asset_type: 'Chọn loại tài sản',
                select_all_asset_type: 'Chọn tất cả loại tài sản',
                select_all_status: 'Chọn tất cả trạng thái',
                ready_use: 'Sẵn sàng sử dụng',
                using: 'Đang sử dụng',
                damaged: 'Hỏng hóc',
                lost: 'Mất',
                disposal: 'Thanh lý',
                waiting: 'Chờ xử lý',
                processed: 'Đã xử lý',
                select_register: 'Chọn quyền đăng ký',
                select_all_register: 'Chọn tất cả quyền đăng ký',
                can_register: 'Được phép đăng ký sử dụng',
                cant_register: 'Không được phép đăng ký sử dụng',

                asset_code: 'Mã tài sản',
                asset_name: 'Tên tài sản',
                asset_type: 'Loại tài sản',
                asset_group: 'Nhóm tài sản',
                purchase_date: 'Ngày nhập',
                manager: 'Người quản lý',
                user: 'Người sử dụng',
                organization_unit: 'Đơn vị sử dụng',
                handover_from_date: 'Thời gian bắt đầu sử dụng',
                handover_to_date: 'Thời gian kết thúc sử dụng',
                status: 'Trạng thái',
                action: 'Hành động',
                asset_value: 'Giá trị tài sản',

                general_information: 'Thông tin chung',
                usage_information: 'Thông tin sử dụng',
                maintainance_information: 'Thông tin bảo trì',
                depreciation_information: 'Thông tin khấu hao',
                incident_information: 'Thông tin sự cố',
                disposal_information: 'Thông tin thanh lý',
                attach_infomation: 'Thông tin đính kèm',

                serial_number: 'Số serial',
                warranty_expiration_date: 'Ngày hết hạn bảo hành',
                asset_location: 'Vị trí tài sản',
                description: 'Mô tả',
                can_register: 'Quyền đăng ký',
                can_register_for_use: 'Quyền đăng ký sử dụng',
                select_image: 'Chọn ảnh',
                content: 'Nội dung',
                form_code: 'Mã phiếu',
                create_date: 'Ngày lập',
                type: 'Phân loại',
                start_date: 'Ngày bắt đầu sửa chữa',
                end_date: 'Ngày hoàn thành',
                expense: 'Chi phí',
                original_price: 'Nguyên giá',
                residual_price: 'Giá trị thu hồi ước tính',
                start_depreciation: 'Thời gian bắt đầu trích khấu hao',
                end_depreciation: 'Thời gian kết thúc trích khấu hao',
                depreciation_type: 'Phương pháp khấu hao',

                incident_code: 'Mã sự cố',
                reported_by: 'Người báo cáo',
                incident_type: 'Loại sự cố',
                date_incident: 'Ngày phát hiện',

                disposal_date: 'Thời gian thanh lý',
                disposal_type: 'Hình thức thanh lý',
                disposal_price: 'Giá trị thanh lý',
                disposal_content: 'Nội dung thanh lý',

                store_location: 'Nơi lưu trữ bản cứng',
                file_name: 'Tên tài liệu',
                number: 'Số lượng',
                attached_file: 'File đính kèm',
            },

            // Dashboard
            dashboard: {
                status_chart: 'Biểu đồ thống kê tài sản theo trạng thái',
                group_chart: 'Biểu đồ thống kê tài sản theo nhóm',
                cost_chart: 'Biểu đồ thống kê tài sản theo giá trị',
                amount_of_asset: 'Thống kê số lượng tài sản',
                value_of_asset: 'Thống kê giá trị tài sản',
                depreciation_of_asset: 'Thống kê hao mòn tài sản',
                bar_chart: 'Biểu đồ cột',
                tree: 'Cây',
                amount: 'Số lượng',
                value: 'Giá trị',
                lost_value: 'Giá trị hao mòn (Triệu)',
                sum_value: 'Tổng giá trị (Triệu)',
                building: 'Mặt bằng',
                vehicle: 'Phương tiện',
                machine: 'Máy móc',
                orther: 'Khác',
                asset_by_group: 'Thống kê theo nhóm',
                asset_by_type: 'Thống kê theo loại',
                asset_purchase_and_dispose: 'Mua - bán tài sản',
                purchase_asset: 'Thống kê mua sắm tài sản',
                disposal_asset: 'Thống kê thanh lý tài sản',
            },

            //  Quản lý loại tài sản
            asset_type: {
                asset_type_code: 'Mã loại tài sản',
                asset_type_name: 'Tên loại tài sản',
                parent_asset_type: 'Loại tài sản cha',

                //Thông điệp trả về từ server
                get_asset_type_success: 'Lấy thông tin loại tài sản thành công',
                get_asset_type_faile: 'Lấy thông tin loại tài sản thất bại',
                create_asset_type_success: 'Thêm loại tài sản thành công',
                create_asset_type_faile: 'Thêm loại tài sản thất bại',
                delete_asset_type_success: 'Xoá loại tài sản thành công',
                delete_asset_type_faile: 'Xoá loại tài sản thất bại',
                edit_asset_type_success: 'Chỉnh sửa thông tin loại tài sản thành công',
                edit_asset_type_faile: 'Chỉnh sửa thông tin loại tài sản thất bại',
            },

            // Quản lý thông tin tài sản
            asset_info: {
                asset_info: 'Thông tin tài sản',
                field_name: 'Tên trường dữ liệu',
                value: 'Giá trị',

                usage_logs: 'Lịch sử cấp phát - điều chuyển - thu hồi',
                maintainance_logs: 'Lịch sử sửa chữa - thay thế - nâng cấp',
                incident_list: 'Danh sách sự cố tài sản',
                file_list: 'Danh sách tài liệu đính kèm',
                add_usage_info: 'Thêm mới thông tin cấp phát sử dụng',
                edit_usage_info: 'Chỉnh sửa thông tin cấp phát sử dụng',
                delete_usage_info: 'Xóa thông tin cấp phát sử dụng',
                add_maintenance_card: 'Thêm mới phiếu bảo trì',
                edit_maintenance_card: 'Chỉnh sửa phiếu bảo trì',
                delete_maintenance_card: 'Xóa phiếu bảo trì',
                add_incident_info: 'Thêm mới thông tin sự cố',
                edit_incident_info: 'Chỉnh sửa thông tin sự cố',
                delete_incident_info: 'Xóa thông tin sự cố',
                delete_asset_confirm: 'Xóa tài sản này ?',

                usage_time: 'Thời gian sử dụng',
                annual_depreciation: 'Mức độ khấu hao trung bình hằng năm',
                monthly_depreciation: 'Mức độ khấu hao trung bình hằng tháng',
                repair: 'Sửa chữa',
                replace: 'Thay thế',
                upgrade: 'Nâng cấp',
                made: 'Đã thực hiện',
                processing: 'Đang thực hiện',
                unfulfilled: 'Chưa thực hiện',
                destruction: 'Tiêu hủy',
                sale: 'Nhượng bán',
                give: 'Tặng',

                select_group: 'Chọn nhóm tài sản',
                building: 'Mặt bằng',
                vehicle: 'Xe cộ',
                machine: 'Máy móc',
                other: 'Khác',

                //Thông điệp trả về từ server
                get_list_asset_success: 'Lấy thông tin tài sản thành công',
                get_list_asset_faile: 'Lấy thông tin tài sản thất bại',
                create_asset_success: 'Thêm tài sản thành công',
                create_asset_faile: 'Thêm tài sản thất bại',
                delete_asset_success: 'Xoá tài sản thành công',
                delete_asset_faile: 'Xoá tài sản thất bại',
                edit_asset_success: 'Chỉnh sửa thông tin tài sản thành công',
                edit_asset_faile: 'Chỉnh sửa thông tin tài sản thất bại',

            },

            // Quản lý bảo trì
            maintainance: {
                total_cost: 'Tổng chi phí',

                //Thông điệp trả về từ server
                get_maintainance_success: 'Lấy thông tin bảo trì thành công',
                get_maintainance_faile: 'Lấy thông tin thông tin bảo trì thất bại',
                create_maintainance_success: 'Thêm phiếu bảo trì thành công',
                create_maintainance_faile: 'Thêm phiếu bảo trì thất bại',
                delete_maintainance_success: 'Xoá phiếu bảo trì thành công',
                delete_maintainance_faile: 'Xoá phiếu bảo trì thất bại',
                edit_maintainance_success: 'Chỉnh sửa thông tin phiếu bảo trì thành công',
                edit_maintainance_faile: 'Chỉnh sửa thông tin phiếu bảo trì thất bại',
            },

            // Quản lý sử dụng
            usage: {
                approved: 'Đã phê duyệt',
                waiting_approval: 'Chờ phê duyệt',
                not_approved: 'Không phê duyệt',
                proponent: 'Người đề nghị',
                accountable: 'Người phê duyệt',
                note: 'Ghi chú',

                //Thông điệp trả về từ server
                get_usage_success: 'Lấy thông tin sử dụng thành công',
                get_usage_faile: 'Lấy thông tin sử dụng thất bại',
                create_usage_success: 'Thêm hoạt động sử dụng tài sản thành công',
                create_usage_faile: 'Thêm hoạt động sử dụng tài sản thất bại',
                delete_usage_success: 'Xoá hoạt động sử dụng tài sản thành công',
                delete_usage_faile: 'Xoá hoạt động sử dụng tài sản thất bại',
                edit_usage_success: 'Chỉnh sửa thông tin hoạt động sử dụng tài sản thành công',
                edit_usage_faile: 'Chỉnh sửa thông tin hoạt động sử dụng tài sản thất bại',
            },

            // Quản lý khấu hao
            depreciation: {
                depreciation_time: 'Thời gian trích khấu hao',
                accumulated_value: 'Giá trị hao mòn lũy kế',
                remaining_value: 'Giá trị còn lại',
                edit_depreciation: 'Chỉnh sửa thông tin kháu hao tài sản',

                estimated_production: 'Sản lượng theo công suất thiết kế (trong 1 năm)',
                months_production: 'Sản lượng sản phẩm trong các tháng',
                production: 'Sản lượng',
                select_depreciation_type: 'Chọn phương pháp khấu hao',
                line: 'Phương pháp khấu hao đường thẳng',
                declining_balance: 'Phương pháp khấu hao theo số dư giảm dần',
                units_production: 'Phương pháp khấu hao theo sản lượng',

                //Thông điệp trả về từ server
                get_depreciation_success: 'Lấy thông tin khấu hao thành công',
                get_depreciation_faile: 'Lấy thông tin khấu hao thất bại',
                create_depreciation_success: 'Thêm thông tin khấu hao tài sản thành công',
                create_depreciation_faile: 'Thêm thông tin khấu hao tài sản thất bại',
                delete_depreciation_success: 'Xoá thông tin khấu hao tài sản thành công',
                delete_depreciation_faile: 'Xoá thông tin khấu hao tài sản thất bại',
                edit_depreciation_success: 'Chỉnh sửa thông tin khấu hao tài sản thành công',
                edit_depreciation_faile: 'Chỉnh sửa thông tin khấu hao tài sản thất bại',
            },

            // Quản lý sự cố
            incident: {
                incident: 'Sự cố tài sản',
                report_incident: 'Báo cáo sự cố tài sản',

                //Thông điệp trả về từ server
                get_incident_success: 'Lấy thông tin sự cố tài sản thành công',
                get_incident_faile: 'Lấy thông tin sự cố tài sản thất bại',
                create_incident_success: 'Thêm sự cố tài sản thành công',
                create_incident_faile: 'Thêm sự cố tài sản thất bại',
                delete_incident_success: 'Xoá thông tin sự cố tài sản thành công',
                delete_incident_faile: 'Xoá thông tin sự cố tài sản thất bại',
                edit_incident_success: 'Chỉnh sửa thông tin sự cố tài sản thành công',
                edit_incident_faile: 'Chỉnh sửa thông tin sự cố tài sản thất bại',
            },

            // Quản lý đề nghị mua sắm thiết bị
            manage_recommend_procure: {
                asset_recommend: 'Thiết bị đề nghị mua sắm',
                add_recommend_card: 'Thêm mới phiếu đề nghị mua sắm tài sản',
                view_recommend_card: 'Xem thông tin phiếu đề nghị mua sắm tài sản',
                edit_recommend_card: 'Chỉnh sửa phiếu đề nghị mua sắm tài sản',
                delete_recommend_card: 'Xóa phiếu đề nghị mua sắm tài sản',
                supplier: 'Nhà cung cấp',
                unit: 'Đơn vị tính',
                expected_value: 'Giá trị dự tính',

                //Thông điệp trả về từ server
                get_recommend_procure_success: 'Lấy thông tin đề nghị mua sắm thiết bị thành công',
                get_recommend_procure_faile: 'Lấy thông tin đề nghị mua sắm thiết bị thất bại',
                create_recommend_procure_success: 'Thêm phiếu đề nghị mua sắm thiết bị thành công',
                create_recommend_procure_faile: 'Thêm phiếu đề nghị mua sắm thiết bị thất bại',
                delete_recommend_procure_success: 'Xoá phiếu đề nghị mua sắm thiết bị thành công',
                delete_recommend_procure_faile: 'Xoá phiếu đề nghị mua sắm thiết bị thất bại',
                edit_recommend_procure_success: 'Chỉnh sửa thông tin phiếu thành công',
                edit_recommend_procure_faile: 'Chỉnh sửa thông tin phiếu thất bại',
            },

            // Quản lý đề nghị cấp phát
            manage_recommend_distribute: {

                //Thông điệp trả về từ server
                get_recommend_distribute_success: 'Lấy thông tin đề nghị cấp phát thiết bị thành công',
                get_recommend_distribute_faile: 'Lấy thông tin đề nghị cấp phát thiết bị thất bại',
                create_recommend_distribute_success: 'Thêm phiếu đề nghị cấp phát thiết bị thành công',
                create_recommend_distribute_faile: 'Thêm phiếu đề nghị cấp phát thiết bị thất bại',
                delete_recommend_distribute_success: 'Xoá phiếu đề nghị cấp phát thiết bị thành công',
                delete_recommend_distribute_faile: 'Xoá phiếu đề nghị cấp phát thiết bị thất bại',
                edit_recommend_distribute_success: 'Chỉnh sửa thông tin phiếu thành công',
                edit_recommend_distribute_faile: 'Chỉnh sửa thông tin phiếu thất bại',

            },

            // Đăng ký mua sắm thiết bị
            recommend_procure: {

                //Thông điệp trả về từ server
                get_recommend_procure_success: 'Lấy thông tin đề nghị mua sắm thiết bị thành công',
                get_recommend_procure_faile: 'Lấy thông tin đề nghị mua sắm thiết bị thất bại',
                create_recommend_procure_success: 'Thêm phiếu đề nghị mua sắm thiết bị thành công',
                create_recommend_procure_faile: 'Thêm phiếu đề nghị mua sắm thiết bị thất bại',
                delete_recommend_procure_success: 'Xoá phiếu đề nghị mua sắm thiết bị thành công',
                delete_recommend_procure_faile: 'Xoá phiếu đề nghị mua sắm thiết bị thất bại',
                edit_recommend_procure_success: 'Chỉnh sửa thông tin phiếu thành công',
                edit_recommend_procure_faile: 'Chỉnh sửa thông tin phiếu thất bại',
            },

            // Đăng ký sử dụng thiết bị
            recommend_distribute: {

                //Thông điệp trả về từ server
                get_recommend_distribute_success: 'Lấy thông tin đề nghị cấp phát thiết bị thành công',
                get_recommend_distribute_faile: 'Lấy thông tin đề nghị cấp phát thiết bị thất bại',
                create_recommend_distribute_success: 'Thêm phiếu đề nghị cấp phát thiết bị thành công',
                create_recommend_distribute_faile: 'Thêm phiếu đề nghị cấp phát thiết bị thất bại',
                delete_recommend_distribute_success: 'Xoá phiếu đề nghị cấp phát thiết bị thành công',
                delete_recommend_distribute_faile: 'Xoá phiếu đề nghị cấp phát thiết bị thất bại',
                edit_recommend_distribute_success: 'Chỉnh sửa thông tin phiếu thành công',
                edit_recommend_distribute_faile: 'Chỉnh sửa thông tin phiếu thất bại',
            },

        },


        // Task template
        task_template: {
            search: 'Tìm kiếm',
            search_by_name: 'Tìm kiếm theo tên',
            select_all_units: 'Chọn tất cả đơn vị',
            permission_view: 'Người được xem',
            performer: 'Người thực hiện',
            approver: 'Người phê duyệt',
            observer: 'Người quan sát',
            supporter: 'Người hỗ trợ',
            formula: 'Công thức tính điểm',
            activity_list: 'Danh sách hoạt động',
            information_list: 'Danh sách thông tin',
            no_data: 'Không có dữ liệu',
            edit: 'Chỉnh sửa',
            save: 'Lưu',
            close: 'Đóng',
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
            action: 'Hành động',
            priority: 'Độ ưu tiên',
            general_information: 'Thông tin chung',
            parameters: 'Tham số',
            roles: 'Các vai trò',
            edit_tasktemplate: 'Chỉnh sửa mẫu công việc',
            action_name: 'Tên hoạt động',
            delete: 'Xóa trắng',
            cancel_editing: 'Hủy chỉnh sửa',
            mandatory: 'Bắt buộc',
            add_tasktemplate: 'Thêm mẫu công việc',
            infor_name: 'Tên thông tin',
            datatypes: 'Kiểu dữ liệu',
            manager_fill: 'Chỉ quản lý được điền',
            high: 'Cao',
            low: 'Thấp',
            medium: 'Trung bình',
            text: 'Văn bản',
            number: 'Số',
            date: 'Ngày tháng',
            value_set: 'Tập giá trị',
            code: 'Mã',
            view_detail_of_this_task_template: 'Xem chi tiết mẫu công việc này',
            edit_this_task_template: 'Sửa mẫu công việc này',
            delete_this_task_template: 'Xóa mẫu công việc này',
            create_task_by_process: 'Tạo công việc theo quy trình này',
            numberOfDaysTaken: "Số ngày dự kiến hoàn thành công việc",
        },

        task: {
            task_management: {
                get_subtask_success: 'Lấy công việc con thành công',
                get_task_of_informed_employee_success: 'Lấy công việc theo vai trò người quan sát thành công',
                get_task_of_creator_success: 'Lấy công việc theo vai trò người tạo thành công',
                get_task_of_consulted_employee_success: 'Lấy công việc theo vai trò người hỗ trợ thành công',
                get_task_of_accountable_employee_success: 'Lấy công việc theo vai trò người phê duyệt thành công',
                get_task_of_responsible_employee_success: 'Lấy công việc theo vai trò người thực hiện',
                get_tasks_by_role_success: 'Lấy công việc tảo bởi người dùng thành công',
                get_task_by_id_success: 'Lấy công việc theo id thành công',
                get_task_evaluation_success: 'Lấy thông tin đánh giá công việc thành công',
                get_all_task_success: 'Lấy tất cả công việc thành công',
                create_task_success: 'Tạo công việc mới thành công',
                delete_success: 'Xóa công việc thành công',
                edit_status_of_task_success: 'Chỉnh sửa trạng thái công việc thành công',
                edit_status_archived_of_task_success: 'Chỉnh sửa trạng thái lưu kho của công việc thành công',

                get_subtask_fail: 'Lấy công việc con thất bại',
                get_task_of_informed_employee_fail: 'Lấy công việc theo vai trò người quan sát thất bại',
                get_task_of_creator_fail: 'Lấy công việc theo vai trò người tạo thất bại',
                get_task_of_consulted_employee_fail: 'Lấy công việc theo vai trò người hỗ trợ thất bại',
                get_task_of_accountable_employee_fail: 'Lấy công việc theo vai trò người phê duyệt thất bại',
                get_task_of_responsible_employee_fail: 'Lấy công việc theo vai trò người thực hiện thất bại',
                get_tasks_by_role_fail: 'Lấy công việc tạo bởi người ',
                get_task_by_id_fail: 'Lấy công việc theo id thất bại',
                get_task_evaluation_fail: 'Lấy thông tin đánh giá công việc thất bại',
                get_all_task_fail: 'Lấy tất cả công việc thất bại',
                create_task_fail: 'không thể tạo công việc mới',
                delete_fail: 'Không thể xóa công việc này',
                edit_status_of_task_fail: 'Không thể thay đổi trạng thái công việc',
                edit_status_archived_of_task_fail: "Chỉnh sửa trạng thái lưu kho của công việc thất bại",
                confirm_delete: 'Không thể xóa công việc này vì công việc đang trong quá trình thực hiện!',

                responsible: 'Người thực hiện',
                accountable: 'Người phê duyệt',
                consulted: 'Người hỗ trợ',
                creator: 'Người thiết lập',
                informed: 'Người quan sát',
                all_role: 'Tất cả vai trò',

                responsible_role: 'Thực hiện',
                accountable_role: 'Phê duyệt',
                consulted_role: 'Hỗ trợ',
                informed_role: 'Quan sát',
                distribution_Of_Employee: 'Đóng góp công việc',
                employees_each_chart: 'Số nhân viên tối đa mỗi biểu đồ',
                task_is_not_linked_up_with_monthly_kpi: 'Công việc chưa được liên kết KPI tháng',
                no_task_is_not_linked: 'Không có công việc nào ',
                loading_data: 'Đang tải dữ liệu',
                task_has_action_not_evaluated: 'Công việc có hoạt động chưa đánh giá',
                no_task_has_action_not_evaluated: 'Không có công việc nào',
                performer: 'Người thực hiện',
                approver: 'Người phê duyệt',

                add_task: 'Thêm mới',
                add_title: 'Thêm mới một công việc',
                add_subtask: 'Thêm công việc con',

                department: 'Đơn vị',
                select_department: 'Chọn đơn vị',
                select_all_department: 'Tất cả các đơn vị',
                role: 'Vai trò',

                status: 'Trạng thái',
                select_status: 'Chọn trạng thái',
                select_all_status: 'Chọn tất cả trạng thái',
                inprocess: 'Đang thực hiện',
                wait_for_approval: 'Chờ phê duyệt',
                finished: 'Đã hoàn thành',
                delayed: 'Tạm hoãn',
                canceled: 'Bị hủy',
                task_status: 'Trạng thái công việc',
                filter: 'Lọc',

                priority: 'Độ ưu tiên',
                select_priority: 'Chọn mức độ ưu tiên',
                select_all_priority: 'Chọn tất cả các mức',
                high: 'Cao',
                normal: 'Trung bình',
                low: 'Thấp',

                special: 'Đặc tính',
                select_all_special: 'Chọn tất cả các đặc tính',
                select_special: 'Chọn đặc tính',
                stored: 'Lưu trong kho',
                current_month: 'Tháng hiện tại',

                name: 'Tên công việc',
                search_by_name: 'Tìm kiếm theo tên',

                start_date: 'Ngày bắt đầu',
                end_date: 'Ngày kết thúc',

                search: 'Tìm kiếm',

                col_name: 'Tên công việc',
                col_organization: 'Đơn vị',
                col_priority: 'Độ ưu tiên',
                col_start_date: 'Ngày bắt đầu',
                col_end_date: 'Ngày kết thúc',
                col_status: 'Trạng thái',
                col_progress: 'Tiến độ',
                col_logged_time: 'Thời gian thực hiện',

                action_edit: 'Băt đầu công việc',
                action_delete: 'Xóa công việc',
                action_store: 'Lưu vào kho',
                action_restore: 'Lấy ra khỏi kho',
                action_add: 'Thêm công việc con',
                action_start_timer: 'Bắt đầu bấm giờ',

                from: 'Từ tháng',
                to: 'Đến tháng',
                lower_from: 'từ',
                lower_to: 'đến',
                month: 'Tháng',
                prev: 'Trước',
                next: 'Sau',
                tasks_calendar: 'Lịch công việc',
                model_detail_task_title: 'Thông tin chi tiết công việc',
                collaborative_tasks: 'Nhiều người thực hiện',
                in_time: 'Đúng tiến độ',
                delayed_time: 'Trễ tiến độ',
                not_achieved: 'Quá hạn',

                err_organizational_unit: 'Đơn vị đã bị xóa',
                err_name_task: 'Tên đã bị xóa',
                err_priority: 'Độ ưu tiên đã bị xóa',
                err_status: 'Trạng thái đã bị xóa',
                err_start_date: 'Ngày bắt đầu đã bị xóa',
                err_end_date: 'ngày kết thúc đã bị xóa',
                err_progress: 'Tiến độ công việc đã bị xóa',
                err_total_log_time: 'Thời gian thực hiện công việc bị xóa',

                detail_refresh: 'Làm mới',
                detail_edit: 'Chỉnh sửa',
                detail_end: 'Kết thúc',
                detail_evaluate: 'Đánh giá',
                detail_start_timer: 'Bấm giờ',
                detail_hide_info: 'Ẩn thông tin',
                detail_show_info: 'Hiện thông tin',
                detail_choose_role: 'Chọn vai trò',
                detail_route: 'Điều hướng',
                detail_route_task: 'Điều hướng công việc',

                detail_link: 'Link công việc',
                detail_priority: 'Độ ưu tiên công việc',
                detail_status: 'Trạng thái công việc',
                detail_time: 'Thời gian thực hiện công việc',

                detail_general_info: 'Thông tin chung',
                detail_description: 'Mô tả',
                detail_info: 'Thông tin công việc',
                detail_progress: 'Mức độ hoàn thành công việc',
                detail_value: 'Giá trị',
                detail_not_hasinfo: 'Chưa có thông tin',
                detail_eval: 'Đánh giá công việc',
                detail_point: 'Điểm các thành viên',
                detail_auto_point: 'Điểm tự động',
                detail_emp_point: 'Điểm tự đánh giá',
                detail_acc_point: 'Điểm phê duyệt',
                detail_not_auto: 'Chưa có điểm tự động',
                detail_not_emp: 'Chưa tự đánh giá',
                detail_not_acc: 'Chưa có điểm phê duyệt',

                detail_not_eval_on_month: 'Chưa đánh giá tháng này',
                detail_not_eval: 'Chưa ai đánh giá công việc tháng này',
                detail_kpi: 'Liên kết KPI',
                detail_not_kpi: 'Chưa liên kết công việc với KPI tháng này',
                detail_all_not_kpi: 'Chưa ai liên kết công việc với KPI',
                detailt_none_eval: 'Chưa được đánh giá lần nào',

                detail_resp_edit: 'Chỉnh sửa công việc với vai trò người thực hiện',
                detail_acc_edit: 'Chỉnh sửa công việc với vai trò người phê duyệt',
                detail_resp_eval: 'Đánh giá công việc với vai trò người thực hiện',
                detail_acc_eval: 'Đánh giá công việc với vai trò người phê duyệt',
                detail_cons_eval: 'Đánh giá công việc với vai trò người hỗ trợ',
                detail_resp_stop: 'Kết thúc công việc với vai trò người thực hiện',
                detail_acc_stop: 'Kết thúc công việc với vai trò người phê duyệt',
                detail_cons_stop: 'Kết thúc công việc với vai trò người hỗ trợ',
                detail_task_permission: 'Công việc không tồn tại hoặc bạn không có quyền truy cập',

                evaluate_date: 'Ngày đánh giá',
                evaluate_member: 'Đánh giá thành viên tham gia công việc',
                detail_not_calc_auto_point: 'Chưa tính được',
                detail_auto_on_system: 'Điểm tự động đang lưu trên hệ thống',
                detail_not_auto_on_system: 'Chưa có dữ liệu',
                action_not_rating: 'Các hoạt động chưa được đánh giá tháng này',
                no_action: 'Không có',
                contribution: 'Đóng góp',
                not_eval: 'Chưa đánh giá',
                acc_evaluate: 'Đánh giá của người phê duyệt',
                name_employee: 'Tên nhân viên',
                role_employee: 'Vai trò',
                detail_emp_point_of: 'Điểm tự đánh giá của',

                enter_emp_point: 'Nhập điểm tự đánh giá',
                responsible_not_eval: 'Người thực hiện chưa đánh giá',
                not_eval_on_month: 'Chưa có thông tin đánh giá tháng này',

                edit_basic_info: 'Thông tin cơ bản',
                edit_detail_info: 'Thông tin chi tiết',
                edit_member_info: 'Thông tin thành viên tham gia',
                edit_inactive_emp: 'Thông tin thành viên rời khỏi công việc',
                edit_enter_progress: 'Nhập mức độ hoàn thành',
                edit_enter_value: 'Nhập giá trị',

                add_template: 'Mẫu công việc',
                add_template_notice: 'Hãy chọn mẫu công việc',
                add_parent_task: 'Công việc cha',
                add_parent_task_notice: 'Hãy chọn công việc cha',
                add_raci: 'Phân định trách nhiệm',
                add_resp: 'Chọn người thực hiện',
                add_acc: 'Chọn người phê duyệt',
                add_cons: 'Chọn người hỗ trợ',
                add_inform: 'Chọn người quan sát',

                calc_form: 'Thông tin công thức tính điểm tự động',
                calc_formula: 'Công thức tính',
                calc_overdue_date: 'Thời gian quá hạn',
                calc_day_used: 'Thời gian làm việc tính đến ngày đánh giá',
                calc_average_action_rating: 'Trung bình cộng điểm đánh giá hoạt động',
                calc_progress: 'Tiến độ công việc',
                calc_new_formula: 'Công thức hiện tại',
                calc_total_day: 'Thời gian từ ngày bắt đầu đến ngày kết thúc công việc',
                calc_days: 'ngày',
                calc_where: 'Trong đó',
                calc_no_value: 'Chưa có giá trị',
                calc_nan: 'Không tính được',
                explain: ' (Giá trị âm sẽ được tính là 0)',
                eval_list: 'Danh sách các lần đánh giá',
                title_eval: 'Đánh giá công việc',

                btn_save_eval: 'Lưu đánh giá',
                btn_get_info: 'Lấy thông tin',
                note_not_eval: 'Đã quá 7 ngày sau ngày đánh giá. Bạn không thể chỉnh sửa thêm!',
                note_eval: 'Số ngày còn lại để chỉnh sửa đánh giá',

                add_eval_of_this_month: 'Thêm đánh giá tháng này',
                eval_of: 'Đánh giá tháng',
                eval_from: 'Đánh giá từ ngày',
                eval_to: 'Đến ngày',
                store_info: 'Lưu các giá trị trên vào thông tin công việc hiện tại',
                bool_yes: 'Đúng',
                bool_no: 'Sai',

                detail_evaluation: 'Thông tin đánh giá công việc',
                err_eval_start: 'Ngày đánh giá phải lớn hơn bằng ngày bắt đầu',
                err_eval_end: 'Ngày đánh giá phải nhỏ hơn bằng ngày kết thúc',
                err_eval_on_month: 'Ngày đánh giá phải là ngày trong tháng',

                info_eval_month: 'Thông tin công việc trong đánh giá này',
                explain_avg_rating: 'Do chưa có hoạt động nào được đánh giá nên mặc định điểm đánh giá hoạt động là 10',

                auto_point_field: 'Điểm công việc tự động trong đánh giá này',
                get_outside_info: 'Nhập tự động từ thông tin công việc hiện tại',

                dashboard_created: 'Đã tạo',
                dashboard_need_perform: 'Cần thực hiện',
                dashboard_need_approve: 'Cần phê duyệt',
                dashboard_need_consult: 'Cần hỗ trợ',
                dashboard_area_result: 'Miền kết quả công việc',
                dashboard_overdue: 'Công việc quá hạn',
                dashboard_about_to_overdue: 'Công việc sắp hết hạn',
                dashboard_max: 'Cao nhất',
                dashboard_min: 'Thấp nhất',

                err_require: 'Trường này phải có giá trị',
                err_date_required: 'Ngày phải có giá trị',
                err_nan: 'Giá trị phải là số',

                // mes_notice
                edit_task_success: 'Chỉnh sửa công việc thành công',
                evaluate_task_success: 'Đánh giá công việc thành công',
                edit_task_fail: 'Chỉnh sửa công việc thất bại',
                evaluate_task_fail: 'Đánh giá công việc thất bại',
                edit_hours_spent_in_evaluate_success: 'Tính thời gian trong lần đánh giá thành công',
                edit_hours_spent_in_evaluate_fail: 'Tính thời gian trong lần đánh giá thất bại',

                add_new_task: 'Thêm công việc mới',
                // add_err: 
                add_err_empty_unit: 'Đơn vị không được để trống',
                add_err_empty_name: 'Tên không được để trống',
                add_err_empty_description: 'Mô tả công việc không được để trống',
                add_err_empty_start_date: 'Hãy chọn ngày bắt đầu',
                add_err_empty_end_date: 'Hãy chọn ngày kết thúc',
                add_err_empty_responsible: 'Cần chọn người thực hiện',
                add_err_empty_accountable: 'Cần chọn người phê duyệt',

                add_err_special_character: 'Tên không được chứa kí tự đặc biệt',
                add_err_end_date: 'Ngày kết thúc phải sau ngày bắt đầu',

                unit_evaluate: "Đơn vị tiếp nhận kết quả đánh giá công việc",
                unit_manage_task: "Đơn vị quản lý công việc",
                delete_eval: "Xóa đánh giá tháng này",
                delete_eval_title: 'Bạn có chắc chắn muốn xóa đánh giá này?',
                delete_evaluation_success: "Xóa đánh giá thành công",
                delete_evaluation_fail: "Xóa đánh giá thất bại",

                // confirm task
                confirm_task_success: "Xác nhận tham gia công việc thành công",
                confirm_task_failure: "Xác nhận tham gia công việc thất bại",

                // warning
                warning: 'Cảnh báo',
                not_have_evaluation: 'Chưa có đánh giá công việc tháng này',
                you_need: 'Bạn cần',
                confirm_task: 'xác nhận tham gia công việc này',
                not_confirm: 'Chưa xác nhận công việc',

                left_task_expired: 'còn lại là công việc bị hết hạn',
                action_not_rating: 'Số hoạt động chưa được đánh giá tháng này',

                left_can_edit_task: 'Thời gian còn lại để chỉnh sửa đánh giá công việc tháng trước',
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
                edit_action: "Sửa hành động",
                delete_action: "Xóa hành động",
                mandatory_action: "Hành động bắt buộc",
                confirm_action: "Xác nhận hoàn thành",
                evaluation: "Đánh giá",
                attach_file: "Đính kèm file",
                comment: "Bình luận",
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
                create_comment_action: "Thêm bình luận",
                stop_timer: "Dừng bấm giờ",
                edit: "Chỉnh sửa",
                delete: "Xóa",

                notice_end_task: 'Bạn có chắc chắn muốn kết thúc công việc này',
                notice_change_status_task: 'Bạn có chắc chắn muốn đổi trạng thái của công việc này',
                choose_following_task: 'Chọn công việc thực hiện tiếp theo',
                task_link_of_process: 'Đường liên kết',
                not_have_following: 'Không có công việc kế tiếp',


                // TODO: code_mesage_task_perform
                create_result_task_success: 'Đánh giá xong kết quả thực hiện công việc',
                edit_redult_task_success: 'Chỉnh sửa thành công kết quả đánh giá',
                get_task_actions_success: 'Lấy tất cả hoạt động thành công',
                create_task_action_success: 'Tạo hoạt động thành công',
                edit_task_action_success: 'Sửa hoạt đông thành công',
                delete_task_action_success: 'Xóa hoạt động thành công',
                get_action_comments_success: 'Lấy tất cả bình luận của hoạt động thành công',
                create_action_comment_success: 'Tạo bình luận hoạt động thành công',
                edit_action_comment_success: 'Sửa bình luận hoạt động thành công',
                delete_action_comment_success: 'Xóa bình luận hoạt động thành công',
                get_log_timer_success: 'Lấy tất cả lịch sử bấm giờ theo công việc thành công',
                get_timer_status_success: 'Lấy trạng thái bấm giờ hiện tại thành công',
                start_timer_success: 'Bắt đầu bấm giờ thành công',
                pause_timer_success: 'Tạm dừng bấm giờ thành công',
                continue_timer_success: 'Tiếp tục bấm giờ thành công',
                stop_timer_success: 'Kết thúc bấm giờ thành công',
                create_result_info_task_success: 'Tạo result info task thành công',
                create_result_infomation_task_success: 'Tạo result infomation task thành công',
                edit_result_infomation_task_success: 'Sửa result infomation task thành công',
                create_task_comment_success: 'Tạo thành công bình luận công việc',
                get_task_comments_success: 'Lấy tất cả bình luận của công việc thành công',
                edit_task_comment_success: 'Sửa bình luận thành công',
                delete_task_comment_success: 'Xóa bình luận thành công',
                create_comment_of_task_comment_success: 'Tạo bình luận thành công',
                edit_comment_of_task_comment_success: 'Sửa bình luận thành công',
                delete_comment_of_task_comment_success: 'Xóa bình luận thành công',
                evaluation_action_success: 'Đánh giá hoạt động thành công',
                confirm_action_success: 'Xác nhận hoạt động thành công',
                delete_file_child_task_comment_success: "Xóa file của bình luận thành công",
                upload_file_success: "Upload file thành công",
                delete_file_success: "Xóa file của hoạt động thành công",
                delete_file_comment_of_action_success: "Xóa file của bình luận thành công",
                delete_file_task_comment_success: "Xóa file của bình luận thành công",
                create_task_log_success: " Tạo task log thành công",
                get_task_log_success: "Lấy lịch sử chỉnh sửa thành công",
                edit_task_information_success: "Chỉnh sửa thông tin thành công",
                edit_document_task_comment_success: "Chỉnh sửa tài liệu thành công",

                create_result_task_fail: 'Không đánh giá được kết quả thực hiện công việc',
                edit_redult_task_fail: 'Chỉnh sửa thất bại kết quả đánh giá',
                get_task_actions_fail: 'Lấy tất cả thông tin hoạt động thất bại',
                create_task_action_fail: 'Tạo hoạt động thất bại',
                edit_task_action_fail: 'Sửa hoạt đông thất bại',
                delete_task_action_fail: 'Xóa hoạt động thất bại',
                get_action_comments_fail: 'Lấy tất cả bình luận hoạt động thất bại',
                create_action_comment_fail: 'Tạo bình luận hoạt động thất bại',
                edit_action_comment_fail: 'Sửa bình luận hoạt động thất bại',
                delete_action_comment_fail: 'Xóa bình luận hoạt động thất bại',
                get_log_timer_fail: 'Lấy tất cả lịch sử bấm giờ theo công việc thất bại',
                get_timer_status_fail: 'Lấy trạng thái bấm giờ hiện tại thất bại',
                start_timer_fail: 'Bắt đầu bấm giờ thất bại',
                pause_timer_fail: 'Tạm dừng bấm giờ thất bại',
                continue_timer_fail: 'Tiếp tục bấm giờ thất bại',
                stop_timer_fail: 'Kết thúc bấm giờ thất bại',
                create_result_info_task_fail: 'Tạo result info task thất bại',
                create_result_infomation_task_fail: 'Tạo result infomation task thất bại',
                edit_result_infomation_task_fail: 'Sửa result infomation task thất bại',
                create_task_comment_fail: 'Tạo bình luận công việc thất bại',
                get_task_comments_fail: 'Lấy tất cả bình luận công việc thất bại',
                edit_task_comment_fail: 'Sửa bình luận thất bại',
                delete_task_comment_success: 'Xóa bình luận thất bại',
                create_comment_of_task_comment_fail: 'Tạo bình luận thất bại',
                edit_comment_of_task_comment_fail: 'Sửa bình luận thất bại',
                delete_comment_of_task_comment_fail: 'Xóa bình luận thất bại',
                evaluation_action_fail: 'Đánh giá công việc thất bại',
                confirm_action_fail: 'Xác nhận hoạt động thất bại',
                delete_file_child_task_comment_fail: "Xóa file của bình luận thất bại",
                upload_file_fail: "Upload file thất bại",
                delete_file_fail: "Xóa file của hoạt động thất bại",
                delete_file_comment_of_action_fail: "Xóa file của bình luận thất bại",
                delete_file_task_comment_fail: "Xóa file của bình luận thất bại",
                create_task_log_fail: "Tạo lịch sử chỉnh sử cộng việc thất bại",
                get_task_log_fail: "Lấy tất cả lịch sử chỉnh sửa công việc thất bại",
                edit_task_information_failure: "Chỉnh sửa thông tin thất bại",
                edit_document_task_comment_failure: "Chỉnh sửa tài liệu thất bại",

                // error label
                err_require: 'Trường này phải có giá trị',
                err_date_required: 'Ngày phải có giá trị',
                err_nan: 'Giá trị phải là số',
                err_has_accountable: 'Phải có ít nhất một người phê duyệt',
                err_has_consulted: 'Phải có ít nhất một người hỗ trợ',
                err_has_responsible: 'Phải có ít nhất một người thực hiện',

                // swal
                confirm: 'Xác nhận',

                // log
                log_edit_basic_info: 'Chỉnh sửa thông tin cơ bản',
                log_edit_name: 'Tên công việc mới',
                log_edit_description: 'MÔ tả công việc mới',
                log_edit_kpi: 'Chỉnh sửa liên kết kpi',
                log_edit_kpi_new: 'Liên kết kpi mới',
                log_edit_eval_info: 'Chỉnh sửa thông tin đánh giá công việc',
                log_edit_progress: 'Mức độ hoàn thành công việc mới',

                // modal approve task
                modal_approve_task: {
                    title: 'Yêu cầu kết thúc công việc',
                    msg_success: 'Đánh giá công việc thành công',
                    msg_false: 'Không đánh giá được công việc',

                    task_info: 'Thông tin công việc',
                    percent: 'Công việc hoàn thành',

                    auto_point: 'Điểm hệ thống',
                    employee_point: 'Điểm tự đánh giá',
                    approved_point: 'Điểm quản lí đánh giá',

                    responsible: 'Vai trò người thực hiện',
                    consulted: 'Vai trò người hỗ trợ',
                    accountable: 'Vai trò người phê duyệt',

                    err_range: 'Giá trị không được vượt quá khoảng 0-100',
                    err_contribute: 'Tổng phần trăm đóng góp phải là 100',
                    err_empty: 'Giá trị không được để trống'
                }

            },
            task_process: {
                process_name: 'Tên quy trình',
                process_description: 'Mô tả quy trình',
                manager: 'Người quản lý',
                viewer: 'Người được xem',
                time_of_process: 'Thời gian thực hiện quy trình',
                start_date: 'Ngày bắt đầu',
                end_date: 'Ngày kết thúc',

                inprocess: 'Đang thực hiện',
                wait_for_approval: 'Chờ phê duyệt',
                finished: 'Đã kết thúc',
                delayed: 'Tạm hoãn',
                canceled: 'Bị hủy',

                notice: 'Chú thích',
                information: 'Thông tin',
                document: 'Tài liệu',

                list_of_data_and_info: 'Danh sách thông tin và tài liệu',
                not_have_doc: 'Không có tài liệu',
                not_have_info: 'Không có thông tin',
                not_export_info: 'Không xuất thông tin',

                save: 'Lưu',

            },
            task_template: {

                create_task_template_success: 'Tạo mẫu công việc thành công !',
                create_task_template_fail: 'Tạo mẫu công việc thất bại !',
                edit_task_template_success: 'Sửa mẫu công việc thành công !',
                edit_task_template_fail: 'Sửa mẫu công việc thất bại !',
                delete_task_template_success: 'Xóa mẫu công việc thành công !',
                delete_task_template_fail: 'Xóa mẫu công việc thất bại !',
                error_task_template_creator_null: 'Nguời tạo mẫu công việc này không tồn tại hoặc đã bị xóa !',
                error_task_template_organizational_unit: 'Phòng ban của mẫu công việc này không tồn tại hoặc đã bị xóa !'

            }
        },

        kpi: {
            employee: {
                get_kpi_by_member_success: 'Lấy KPI thành viên theo người thiết lập thành công',
                get_kpi_by_member_fail: 'Lấy KPI thành theo người thiết lập viên lỗi',
                get_kpi_responsible_success: 'Lấy tất cả KPI cá nhân của người thực hiện trong công việc thành công',
                get_kpi_responsible_fail: 'Lấy tất cả KPI cá nhân của người thực hiện trong công việc lỗi',

                //Nhóm dành cho module creation
                employee_kpi_set: {
                    create_employee_kpi_set: { // Module chính
                        // Nhóm dành cho các thông tin chung
                        general_information: {
                            general_information: 'KPI cá nhân tháng',
                            save: 'Lưu chỉnh sửa',
                            edit: 'Chỉnh sửa',
                            delete: 'Xóa KPI này',
                            cancel: 'Hủy',
                        },
                        time: 'Thời gian',
                        approver: 'Người phê duyệt',
                        weight_total: 'Tổng trọng số',
                        not_satisfied: 'Chưa thỏa mãn',
                        satisfied: 'Thỏa mãn',
                        initialize_kpi_newmonth: 'Khởi tạo KPI tháng mới',
                        request_approval: 'Yêu cầu phê duyệt',
                        cancel_request_approval: 'Hủy yêu cầu phê duyệt',
                        not_initialize_organiztional_unit_kpi: 'Chưa thể khởi tạo KPI tháng này cho bạn do đơn vị của bạn chưa thiết lập KPI. Liên hệ với trưởng đơn vị để hỏi thêm',
                        not_activate_organiztional_unit_kpi: 'Đơn vị của bạn chưa kích hoạt KPI. Liên hệ với trưởng đơn vị để hỏi thêm',
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
                        weight: 'Trọng số',
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
                            activated: 'KPI đã được kích hoạt, bạn không thể chỉnh sửa. Nếu muốn sửa đổi hãy liên hệ với quản lý của bạn!',
                            finished: 'KPI đã kết thúc, bạn không thể chỉnh sửa!'
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
                            activated: 'KPI đã được kích hoạt, bạn không thể xóa!'
                        },
                        handle_populate_info_null: {
                            error_kpi_approver_null: 'Người phê duyệt tập KPI này không tồn tại hoặc đã bị xóa',
                            error_kpi_organizational_unit_null: 'Đơn vị của tập KPI này không tồn tại hoặc đã bị xóa',
                            error_kpi_parent_target_null: 'Mục tiêu cha của mục tiêu này đã bị xóa hoặc không tồn tại',
                            error_kpi_targets_list_null: 'Danh sách mục tiêu của tập KPI đã bị xóa hoặc không tồn tại',
                        }
                    },

                    create_employee_kpi_modal: { // Module con
                        // Nhóm dành cho modal
                        create_employee_kpi: 'Thêm mục tiêu KPI cá nhân',
                        name: 'Tên mục tiêu',
                        parents: 'Mục tiêu cha',
                        evaluation_criteria: 'Tiêu chí đánh giá',
                        weight: 'Trọng số',

                        // Nhóm dành cho validate
                        validate_weight: {
                            empty: 'Trọng số không được để trống',
                            less_than_0: 'Trọng số không được nhỏ hơn 0',
                            greater_than_100: 'Trọng số không được lớn hơn 100'
                        }
                    },

                    kpi_member_manager: {
                        index: 'STT',
                        time: 'Thời gian',
                        employee_name: 'Tên nhân viên',
                        target_number: 'Số lượng mục tiêu',
                        kpi_status: 'Trạng thái KPI',
                        result: 'Kết quả',
                        approve: 'Phê duyệt',
                        evaluate: 'Đánh giá'
                    },

                    create_employee_kpi_set_modal: { // Module con
                        // Nhóm dành cho modal
                        initialize_kpi_set: 'Khởi tạo KPI cá nhân',
                        organizational_unit: 'Đơn vị',
                        month: 'Tháng',
                        approver: 'Người phê duyệt',
                        default_target: 'Mục tiêu mặc định'
                    },

                    edit_employee_kpi_modal: { // Mudule con
                        // Nhóm dành cho modal
                        edit_employee_kpi: 'Chỉnh sửa mục tiêu KPI cá nhân',
                        name: 'Tên mục tiêu',
                        parents: 'Mục tiêu cha',
                        evaluation_criteria: 'Mô tả tiêu chí đánh giá',
                        weight: 'Trọng số'
                    },

                    //Thông điệp trả về từ server
                    messages_from_server: {
                        initialize_employee_kpi_set_success: 'Khởi tạo tập KPI nhân viên thành công',
                        initialize_employee_kpi_set_failure: 'Khởi tạo tập KPI nhân viên thất bại',

                        create_employee_kpi_success: 'Thêm mục tiêu KPI thành công',
                        create_employee_kpi_failure: 'Thêm mục tiêu KPI thất bại',

                        edit_employee_kpi_set_success: 'Chỉnh sửa tập KPI nhân viên thành công',
                        edit_employee_kpi_set_failure: 'Chỉnh sửa tập KPI nhân viên thất bại',
                        delete_employee_kpi_set_success: 'Xóa KPI tập KPI nhân viên thành công',
                        delete_employee_kpi_set_failure: 'Xóa KPI tập KPI nhân viên thất bại',

                        approve_success: 'Xác nhận yêu cầu phê duyệt thành công',
                        approve_failure: 'Xác nhận yêu cầu phê duyệt thất bại',

                        delete_employee_kpi_success: 'Xóa mục tiêu KPI thành công',
                        delete_employee_kpi_failure: 'Xóa mục tiêu KPI thất bại',

                        edit_employee_kpi_success: 'Chỉnh sửa mục tiêu KPI thành công',
                        edit_employee_kpi_failure: 'Chỉnh sửa mục tiêu KPI thất bại'
                    }
                },

            },
            evaluation: {

                dashboard: {
                    organizational_unit: 'Đơn vị',
                    select_units: 'Chọn đơn vị',
                    all_unit: 'Tất cả đơn vị',
                    search: 'Tìm kiếm',
                    setting_up: 'Đang thiết lập',
                    awaiting_approval: 'Chờ phê duyệt',
                    activated: 'Đã kích hoạt',
                    number_of_employee: 'Số nhân viên',
                    excellent_employee: 'Nhân viên ưu tú',
                    best_employee: 'Nhân viên xuất sắc nhất',
                    month: 'Tháng',
                    auto_point: 'Điểm tự động',
                    employee_point: 'Điểm tự đánh giá',
                    approve_point: 'Điểm người phê duyệt đánh giá',
                    option: 'Tùy chọn',
                    analyze: 'Phân tích',
                    statistics_chart_title: 'Thống kê kết quả KPI của nhân viên',
                    result_kpi_titile: 'Kết quả Kpi tất cả nhân viên',
                    auto_eva: 'Hệ thống đánh giá',
                    employee_eva: 'Cá nhân tự đánh giá',
                    approver_eva: 'Người phê duyệt đánh giá',
                    result_kpi_personal: 'Kết quả KPI cá nhân',
                    distribution_kpi_personal: 'Đóng góp KPI cá nhân'

                },

                employee_evaluation: {
                    /**
                     * Approve
                     */
                    approve_KPI_employee: 'Phê duyệt KPI nhân viên',
                    month: 'Tháng',
                    end_compare: 'Tắt so sánh',
                    compare: 'So sánh',
                    approve_all: 'Phê duyệt tất cả',
                    choose_month_cmp: 'Chọn tháng so sánh',
                    kpi_this_month: 'KPI tháng',
                    search: 'Tìm kiếm',
                    index: 'STT',
                    number_of_targets: 'Số lượng mục tiêu',
                    system_evaluate: 'Hệ thống đánh giá',
                    result_self_evaluate: 'Kết quả tự đánh giá',
                    evaluation_management: 'Quản lí đánh giá',
                    not_evaluated_yet: 'Chưa đánh giá',
                    target: 'mục tiêu',
                    view_detail: "Xem chi tiết",
                    clone_to_new_kpi: 'Tạo kpi tháng mới từ kpi tháng này',
                    name: 'Tên',
                    target: 'Mục tiêu đơn vị',
                    criteria: 'Tiêu chí đánh giá',
                    weight: 'Trọng số',
                    result: 'Kết quả đánh giá',
                    data_not_found: 'Không tìm thấy dữ liệu phù hợp',
                    unsuitable_weight: 'Trọng số không thỏa mãn',
                    status: 'Trạng thái',
                    action: 'Hành động',
                    save_result: 'Lưu kết quả',
                    edit_target: 'Sửa mục tiêu',
                    pass: 'Đạt',
                    fail: 'Không đạt',
                    /**
                     * Comment
                     */
                    edit_cmt: 'Chỉnh sửa bình luận',
                    delete_cmt: 'Xóa bình luận',
                    add_cmt: 'Thêm bình luận',
                    attached_file: 'Đính kèm tệp',
                    send_edition: 'Gửi chỉnh sửa',
                    cancel: 'Hủy',
                    comment: 'Bình luận',
                    /**
                     * Evaluate
                     */
                    KPI_list: 'Danh sách KPI',
                    calc_kpi_point: 'Tính điểm KPI',
                    export_file: 'Xuất file',
                    KPI_info: 'Thông tin KPI',
                    point_field: 'Điểm (Tự động - Tự đánh giá - Người phê duyệt đánh giá)',
                    not_avaiable: 'Chưa đánh giá',
                    no_point: 'Chưa có điểm',
                    lastest_evaluation: 'Đánh giá cuối',
                    task_list: 'Danh sách công việc',
                    work_duration_time: 'Thời gian làm việc',
                    evaluate_time: 'Thời gian đánh giá',
                    contribution: 'Đóng góp',
                    importance_level: 'Độ quan trọng',
                    point: 'Điểm',
                    evaluated_value: 'Giá trị được duyệt',
                    new_value: 'Giá trị mới',
                    old_value: 'Giá trị cũ',
                    auto_value: 'Giá trị tự động',

                    /**
                     * Management
                     */
                    wrong_time: 'Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc!',
                    confirm: 'Xác nhận',
                    choose_employee: 'Chọn nhân viên',
                    employee: 'Nhân viên',
                    choose_status: 'Chọn trạng thái',
                    establishing: 'Đang thiết lập',
                    expecting: 'Chờ phê duyệt',
                    activated: 'Đã kích hoạt',
                    time: 'Thời gian',
                    num_of_kpi: 'Số mục tiêu',
                    kpi_status: 'Trạng thái mục tiêu',
                    approve: 'Phê duyệt',
                    evaluate: 'Đánh giá',
                    approve_this_kpi: 'Phê duyệt KPI này',
                    evaluate_this_kpi: 'Đánh giá KPI này',
                    from: 'Từ tháng',
                    to: 'Đến tháng',
                    /**
                     * Importance Dialog
                     */
                    num_of_working_day: 'Số ngày làm việc',
                    priority: 'Độ ưu tiên',
                    formula: 'Công thức',
                    explain_automatic_point: 'Giải thích giá trị điểm tự động'
                },
                /**
                 * Thông báo từ service
                 */
                get_all_kpi_member_success: 'Lấy tất cả KPI member thành công',
                get_all_kpi_member_fail: 'Lấy tất cả KPI nhân viên lỗi',
                get_kpi_targets_success: 'Lấy mục tiêu KPI nhân viên thành công',
                get_kpi_targets_fail: 'Lấy mục tiêu KPI nhân viên lỗi',
                get_all_kpi_member_by_id_success: 'Lấy tất cả KPI nhân viên theo Id thành công',
                get_all_kpi_member_by_id_fail: 'Lấy tất cả KPI nhân viên theo Id lỗi',
                get_all_kpi_member_by_month_success: 'Lấy tất cả KPI nhân viên theo tháng thành công',
                get_all_kpi_member_by_month_fail: 'Lấy tất cả KPI nhân viên theo tháng lỗi',
                approve_all_kpi_target_success: 'Phê duyệt KPI nhân viên thành công',
                approve_all_kpi_target_fail: 'Phê duyệt KPI nhân viên lỗi',
                edit_kpi_target_member_success: 'Chỉnh sửa mục tiêu KPI nhân viên thành công',
                edit_kpi_target_member_fail: 'Chỉnh sửa mục tiêu KPI nhân viên lỗi',
                edit_status_target_success: 'Chỉnh sửa trạng thái mục tiêu thành công',
                edit_status_target_fail: 'Chỉnh sửa trạng thái mục tiêu lỗi',
                get_task_by_id_success: 'Lấy danh sách công việc theo Id thành công',
                get_task_by_id_fail: 'Lấy danh sách công việc theo Id lỗi',
                get_system_point_success: 'Lấy điểm hệ thống cho KPI thành công',
                get_system_point_fail: 'Lấy điểm hệ thống cho KPI lỗi',
                set_task_importance_level_success: 'Thêm độ quan trọng cho công việc thành công',
                set_task_importance_level_fail: 'Thêm độ quan trọng cho công việc lỗi'
            },
            organizational_unit: {
                // Module chính
                create_organizational_unit_kpi_set: {
                    // Nhóm dành cho các thông tin chung
                    general_information: 'KPI đơn vị',
                    save: 'Lưu chỉnh sửa',
                    confirm: 'Xác nhận',
                    delete: 'Xóa KPI này',
                    cancel: 'Hủy',
                    approve: 'Kích hoạt',
                    cancel_approve: 'Bỏ kích hoạt',
                    target: 'mục tiêu',
                    confirm_delete_success: 'Bạn chắc chắn muốn xóa toàn bộ KPI này?',
                    time: 'Thời gian',
                    initialize_kpi_newmonth: 'Khởi tạo KPI tháng mới',
                    edit_kpi_success: 'Chỉnh sửa KPI thành công',
                    edit_kpi_failure: 'Chỉnh sửa KPI không thành công',
                    delete_kpi_success: 'Xóa KPI thành công',
                    delete_kpi_failure: 'Xóa KPI không thành công',

                    // Nhóm dành cho trọng số
                    weight_total: 'Tổng trọng số',
                    not_satisfied: 'Chưa thỏa mãn',
                    satisfied: 'Thỏa mãn',

                    // Nhóm dành cho các trạng thái tập KPI
                    not_approved: 'Chưa kích hoạt',
                    approved: 'Đã kích hoạt',

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
                    confirm_approve_already: 'KPI đã kích hoạt!',
                    confirm_approve: 'Bạn chắc chắn muốn kích hoạt KPI này?',
                    confirm_not_enough_weight: 'Tổng trọng số phải bằng 100',
                    confirm_cancel_approve: 'Bạn chắc chắn muốn hủy kích hoạt KPI này?',
                    confirm_edit_status_success: 'Chỉnh sửa trạng thái Kpi thành công',
                    confirm_edit_status_failure: 'Chỉnh sửa trạng thái Kpi không thành công',

                    confirm_kpi: 'Bạn chắc chắn muốn xóa mục tiêu KPI này?',
                    confirm_approving: 'KPI đã kích hoạt, bạn không thể xóa!',
                    confirm_delete_target_success: 'Xóa mục tiêu KPI thành công',
                    confirm_delete_target_failure: 'Xóa mục tiêu KPI không thành công',

                    // Nhóm các title
                    edit: 'Chỉnh sửa',
                    content: 'Đây là mục tiêu mặc định (nếu cần thiết có thể sửa trọng số)',
                    delete_title: 'Xóa',
                },

                create_organizational_unit_kpi_modal: { // Module con
                    // Nhóm dành cho modal
                    create_organizational_unit_kpi: 'Thêm mục tiêu KPI đơn vị',
                    name: 'Tên mục tiêu',
                    parents: 'Mục tiêu cha',
                    evaluation_criteria: 'Tiêu chí đánh giá',
                    weight: 'Trọng số',
                    create_target_success: 'Thêm mục tiêu KPI thành công',
                    create_target_failure: 'Bạn chưa nhập đủ thông tin',

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

                kpi_organizational_unit_manager: {
                    index: 'STT',
                    time: 'Thời gian',
                    employee_name: 'Tên nhân viên',
                    target_number: 'Số lượng mục tiêu',
                    kpi_status: 'Trạng thái KPI',
                    result: 'Kết quả',
                    approve: 'Phê duyệt',
                    evaluate: 'Đánh giá',
                    index: 'STT',
                    target_name: 'Tên mục tiêu',
                    creator: 'Người tạo',
                    organization_unit: 'Đơn vị',
                    criteria: 'Tiêu chí đánh giá',
                    result: 'Kết quả',
                    no_data: 'Không có dữ liệu'
                },

                create_organizational_unit_kpi_set_modal: { // Module con
                    // Nhóm dành cho modal
                    initialize_kpi_set: 'Khởi tạo KPI đơn vị',
                    organizational_unit: 'Đơn vị',
                    month: 'Tháng',
                    default_target: 'Mục tiêu mặc định',
                    create_organizational_unit_kpi_set_success: 'Khởi tạo KPI thành công',
                    create_organizational_unit_kpi_set_failure: 'Bạn chưa nhập đủ thông tin'
                },

                edit_target_kpi_modal: { // Mudule con
                    // Nhóm dành cho modal
                    edit_organizational_unit_kpi: 'Chỉnh sửa mục tiêu KPI đơn vị',
                    name: 'Tên mục tiêu',
                    parents: 'Mục tiêu cha',
                    evaluation_criteria: 'Mô tả tiêu chí đánh giá',
                    weight: 'Trọng số',
                    edit_target_success: 'Chỉnh sửa mục tiêu KPI thành công',
                    edit_target_failure: 'Bạn chưa nhập đủ thông tin'
                },

                // Dashboard KPI Unit
                dashboard: {
                    organizational_unit: 'Đơn vị',
                    month: 'Tháng',
                    trend: 'Xu hướng thực hiện mục tiêu của nhân viên',
                    distributive: 'Phân phối KPI đơn vị tháng ',
                    statiscial: 'Thống kê kết quả KPI đơn vị tháng ',
                    result_kpi_unit: 'Kết quả KPI đơn vị',
                    result_kpi_units: 'Kết quả KPI các đơn vị',
                    start_date: 'Từ tháng',
                    end_date: 'Đến tháng',
                    search: 'Tìm kiếm',
                    point: 'Điểm',
                    no_data: 'Không có dữ liệu',
                    trend_chart: {
                        execution_time: 'Thời gian thực hiện (Ngày)',
                        participants: 'Người tham gia',
                        amount_tasks: 'Số lượng công việc',
                        amount_employee_kpi: 'Số lượng KPI nhân viên',
                        weight: 'Trọng số'
                    },
                    result_kpi_unit_chart: {
                        automatic_point: 'Hệ thống đánh giá',
                        employee_point: 'Cá nhân tự đánh giá',
                        approved_point: 'Quản lý đánh giá',
                    },
                    alert_search: {
                        search: 'Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc!',
                        confirm: 'Xác nhận'
                    },
                    statistic_kpi_unit: {
                        count_employee_same_point: 'Số người có cùng điểm'
                    }
                },

                management: {
                    copy_modal: {
                        alert: {
                            check_new_date: 'Chưa chọn tháng khởi tạo',
                            confirm: 'Xác nhận',
                            coincide_month: 'Đã tồn tại KPI của tháng',
                            unable_kpi: 'Không thể tạo KPI trong quá khứ',
                            change_link: 'Hãy nhớ thay đổi liên kết đến mục tiêu cha để được tính KPI mới!'
                        },
                        create: 'Thiết lập KPI tháng mới từ tháng ',
                        organizational_unit: 'Đơn vị',
                        month: 'Tháng',
                        list_target: 'Danh sách mục tiêu',
                        setting: 'Thiết lập',
                        cancel: 'Hủy bỏ'
                    },
                    detail_modal: {
                        list_kpi_unit: 'Danh sách KPI đơn vị',
                        title: 'Thông tin chi tiết KPI đơn vị tháng ',
                        information_kpi: 'Thông tin KPI ',
                        criteria: 'Tiêu chí:',
                        weight: 'Trọng số:',
                        export_file: 'Xuất file',
                        point_field: 'Điểm (Tự động - Tự đánh giá - Quản lý đánh giá)',
                        list_child_kpi: 'Danh sách KPI con',
                        not_eval: 'Chưa đánh giá',
                        index: 'STT',
                        target_name: 'Tên mục tiêu',
                        creator: 'Người tạo',
                        organization_unit: 'Đơn vị',
                        criteria: 'Tiêu chí đánh giá',
                        result: 'Kết quả đánh giá',
                        no_data: 'Không có dữ liệu'
                    },
                    over_view: {
                        start_date: 'Từ tháng',
                        end_date: 'Đến tháng',
                        search: 'Tìm kiếm',
                        status: 'Trạng thái',
                        all_status: 'Tất cả trạng thái',
                        setting_up: 'Đang thiết lập',
                        activated: 'Đã kích hoạt',
                        time: 'Thời gian',
                        creator: 'Người tạo',
                        number_target: 'Số lượng mục tiêu',
                        result: 'Kết quả đánh giá',
                        no_data: 'Không có dữ liệu',
                        action: 'Hành động',
                        not_eval: 'Chưa đánh giá',
                        alert_search: {
                            search: 'Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc!',
                            confirm: 'Xác nhận'
                        },
                    }
                },
                //Thông điệp khác trả về từ server
                get_parent_by_unit_success: 'Lấy KPI đơn vị của đơn vị cha thành công',
                get_parent_by_unit_failure: 'Lấy KPI đơn vị của đơn vị cha không thành công',
                get_kpi_unit_success: 'Lấy danh sách KPI đơn vị thành công',
                get_kpi_unit_fail: 'Lấy danh sách KPI đơn vị lỗi',
                get_kpiunit_by_role_success: 'Lấy danh sách KPI đơn vị theo vai trò thành công',
                get_kpiunit_by_role_fail: 'Lấy danh sách KPI đơn vị theo vai trò lỗi',
                create_kpi_unit_success: 'Khởi tạo KPI đơn vị thành công',
                create_kpi_unit_fail: 'Khởi tạo KPI đơn vị lỗi',
                update_evaluate_kpi_unit_success: 'Cập nhật điểm đánh giá KPI đơn vị thành công',
                update_evaluate_kpi_unit_fail: 'Cập nhật điểm đánh giá KPI đơn vị lỗi',
            }
        },

        manage_warehouse: {
            material_manager: {
                index: 'STT',
                add: 'Thêm vật tư',
                add_title: 'Thêm vật tư mới',
                info: 'Thông tin về vật tư',
                edit: 'Chỉnh sửa thông tin vật tư',
                delete: 'Xóa vật tư',
                add_success: 'Thêm mới vật tư thành công',
                delete_success: 'Xóa vật tư thành công',
                delete_faile: 'Xóa vật tư thất bại',
                add_faile: 'Thêm mới vật tư thất bại',
                edit_success: 'Chỉnh sửa thành công',
                edit_faile: 'Chỉnh sửa thất bại',
                date: 'Ngày mua',
                name: 'Tên vật tư',
                code: 'Mã vật tư',
                cost: 'Giá trị',
                description: 'Mô tả',
                serial: 'Số serial',
                purchaseDate: 'Ngày mua',
                location: 'Vị trí vật tư'
            },
            dashboard_material: {

            }
        },


        //manager order
        manage_order: {
            index: "Số thứ tự",
            add_order: "Thêm đơn hàng",
            add_title: "Thêm mới đơn hàng",
            edit_title: "Chỉnh sửa đơn hàng",
            add_success: "Thêm đơn hàng thành công",
            add_failure: "Đơn hàng không hợp lệ",
            edit_success: "Đơn hàng đã được cập nhật",
            edit_failure: "Xảy ra lỗi trong cập nhật đơn hàng",
            delete_success: "Đơn hàng đã được xóa",
            delete_failure: "Chưa thể xóa đơn hàng",
            get_success: "Đã lấy dữ liệu",
            get_failure: "Không lấy được dữ liệu",
            code: "Mã đơn hàng",
            quantity: "Số lượng",
            amount: "Tổng tiền",
            code_placeholder: "Nhập vào mã đơn hàng",
            edit_order: "Chỉnh sửa đơn hàng",
            delete_order: "Xóa đơn hàng",
        },

        report_manager: {
            search: 'Tìm kiếm',
            add_report: 'Thêm mới',
            search_by_name: 'Tìm kiếm theo tên',
            select_all_units: 'Chọn tất cả đơn vị',
            performer: 'Người thực hiện',
            name: 'Tên báo cáo',
            description: 'Mô tả',
            action: 'Hành động',
            unit: 'Đơn vị',
            creator: 'Người tạo',
            createdAt: 'Ngày tạo',
            edit: 'Chỉnh sửa thông tin báo cáo',
            delete: 'Bạn chắc chắn muốn xóa báo cáo:',
            confirm: 'Xác nhận',
            cancel: 'Hủy bỏ',
            title_delete: 'Xóa báo cáo này',
            no_data: 'Không có dữ liệu',
            search_by_name: 'Nhập tên mẫu báo cáo',
            search_by_creator: 'Nhập tên người tạo báo cáo',


            //message trả về từ server
            create_report_manager_success: 'Tạo báo cáo thành công !',
            create_report_manager_faile: 'Tạo báo cáo thất bại ! ',
            edit_report_manager_success: 'Sửa báo cáo thành công !',
            edit_report_manager_fail: 'Sửa mẫu báo cáo thất bại !',
            delete_report_manager_success: 'Xóa mẫu báo cáo thành công !',
            delete_report_manager_fail: 'Xóa mẫu báo cáo thất bại !',
        },

        footer: {
            copyright: 'Bản quyền thuộc về ',
            vnist: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
            version: 'Phiên bản '
        },

        manage_asset: {
            menu_general_infor: 'Thông tin chung',
            menu_repair_upgrade: 'Sửa chữa - Thay thế - Nâng cấp',
            menu_allocate_revoke: 'Cấp phát - Điều chuyển - Thu hồi',
            menu_maintain: 'Bảo hành - Bào trì',
            menu_depreciation_infor: 'Thông tin khấu hao',
            menu_attachments: 'Tài liệu đính kèm',
            add_default: 'Mặc định',
            add_default_title: 'Thêm các tài liệu mặc định',
            edit_file: 'Chỉnh sửa tài liệu đính kèm',
            add_file: 'Thêm tài liệu đính kèm',
            upload: 'Chọn ảnh'
        },
    }
}