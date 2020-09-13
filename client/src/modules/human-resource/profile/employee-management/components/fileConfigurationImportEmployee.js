export const configurationEmployee = {
    configurationEmployeeInfo,
    configurationExperience,
    configurationDegree,
    configurationCertificate,
    configurationContract,
    configurationSocialInsuranceDetails,
    configurationFile,

    templateImport,
}

// Cấu hình file import thông tin cơ bản của nhân viên
function configurationEmployeeInfo(translate) {
    let config = {
        rowHeader: {
            description: "Số dòng tiêu đề của bảng",
            value: 1
        },
        sheets: {
            description: "Tên các sheet",
            value: ["1.Nhân viên"]
        },
        employeeNumber: {
            columnName: "Mã số nhân viên",
            description: "Tên tiêu đề ứng với 'Mã số nhân viên' ",
            value: "Mã số nhân viên"
        },
        fullName: {
            columnName: "Họ và tên",
            description: "Tên tiêu để ứng với họ và tên",
            value: "Họ và tên"
        },
        birthdate: {
            columnName: "Ngày sinh",
            description: "Tên tiêu để ứng với Ngày sinh",
            value: "Ngày sinh"
        },
        gender: {
            columnName: "Giới tính",
            description: "Tên tiêu để ứng với giới tính",
            value: "Giới tính"
        },
        employeeTimesheetId: {
            columnName: "Mã số chấm công",
            description: "Tên tiêu để ứng với mã số chấm công",
            value: "Mã số chấm công"
        },
        identityCardNumber: {
            columnName: "Số chứng minh thư",
            description: "Tên tiêu để ứng với số chứng minh thư",
            value: "Số chứng minh thư"
        },
        identityCardDate: {
            columnName: "Ngày cấp chứng minh thư",
            description: "Tên tiêu để ứng với ngày cấp chứng minh thư",
            value: "Ngày cấp chứng minh thư"
        },
        identityCardAddress: {
            columnName: "Nơi cấp chứng minh thư",
            description: "Tên tiêu để ứng với nơi cấp chứng minh thư",
            value: "Nơi cấp chứng minh thư"
        },
        birthplace: {
            columnName: "Nơi sinh",
            description: "Tên tiêu để ứng với nơi sinh",
            value: "Nơi sinh"
        },
        permanentResidence: {
            columnName: "Hộ khẩu thưởng trú",
            description: "Tên tiêu để ứng với hộ khẩu thưởng trú",
            value: "Hộ khẩu thưởng trú"
        },
        temporaryResidence: {
            columnName: "Nơi ở hiện tại",
            description: "Tên tiêu để ứng với nơi ở hiện tại",
            value: "Nơi ở hiện tại"
        },
        maritalStatus: {
            columnName: "Tình trạng hôn nhân",
            description: "Tên tiêu để ứng với tình trạng hôn nhân",
            value: "Tình trạng hôn nhân"
        },
        status: {
            columnName: "Tình trạng lao động",
            description: "Tên tiêu để ứng với tình trạng lao động",
            value: "Tình trạng lao động"
        },
        startingDate: {
            columnName: "Ngày bắt đầu làm việc",
            description: "Tên tiêu để ứng với ngày bắt đầu làm việc",
            value: "Ngày bắt đầu làm việc"
        },
        leavingDate: {
            columnName: "Ngày nghỉ việc",
            description: "Tên tiêu để ứng với ngày nghỉ việc",
            value: "Ngày nghỉ việc"
        },
        emailInCompany: {
            columnName: "Email công ty",
            description: "Tên tiêu để ứng với email công ty",
            value: "Email công ty"
        },
        taxNumber: {
            columnName: "Mã số thuế thu nhập cá nhân",
            description: "Tên tiêu để ứng với mã số thuế thu nhập cá nhân",
            value: "Mã số thuế thu nhập cá nhân"
        },
        taxRepresentative: {
            columnName: "Đại diện của người nộp thuế",
            description: "Tên tiêu để ứng với đại diện của người nộp thuế",
            value: "Đại diện của người nộp thuế"
        },
        taxDateOfIssue: {
            columnName: "Ngày cấp mã số thuế",
            description: "Tên tiêu để ứng với ngày cấp mã số thuế",
            value: "Ngày cấp mã số thuế"
        },
        taxAuthority: {
            columnName: "Cơ quan quản lý thuế",
            description: "Tên tiêu để ứng với cơ quan quản lý thuế",
            value: "Cơ quan quản lý thuế"
        },
        ethnic: {
            columnName: "Dân tộc",
            description: "Tên tiêu để ứng với dân tộc",
            value: "Dân tộc"
        },
        religion: {
            columnName: "Tôn giáo",
            description: "Tên tiêu để ứng với tôn giáo",
            value: "Tôn giáo"
        },
        nationality: {
            columnName: "Quốc tịch",
            description: "Tên tiêu để ứng với quốc tịch",
            value: "Quốc tịch"
        },
        educationalLevel: {
            columnName: "Trình độ văn hoá",
            description: "Tên tiêu để ứng với trình độ văn hoá",
            value: "Trình độ văn hoá"
        },
        foreignLanguage: {
            columnName: "Trình độ ngoại ngữ",
            description: "Tên tiêu để ứng với trình độ ngoại ngữ",
            value: "Trình độ ngoại ngữ"
        },
        professionalSkill: {
            columnName: "Trình độ chuyên môn",
            description: "Tên tiêu để ứng với trình độ chuyên môn",
            value: "Trình độ chuyên môn"
        },
        phoneNumber: {
            columnName: "Điện thoại di động 1",
            description: "Tên tiêu để ứng với điện thoại di động 1",
            value: "Điện thoại di động 1"
        },
        phoneNumber2: {
            columnName: "Điện thoại di động 2",
            description: "Tên tiêu để ứng với điện thoại di động 2",
            value: "Điện thoại di động 2"
        },
        personalEmail: {
            columnName: "Email cá nhân 1",
            description: "Tên tiêu để ứng với email cá nhân 1",
            value: "Email cá nhân 1"
        },
        personalEmail2: {
            columnName: "Email cá nhân 2",
            description: "Tên tiêu để ứng với email cá nhân 2",
            value: "Email cá nhân 2"
        },
        homePhone: {
            columnName: "Điện thoại nhà riêng",
            description: "Tên tiêu để ứng với điện thoại nhà riêng",
            value: "Điện thoại nhà riêng"
        },
        emergencyContactPerson: {
            columnName: "Người liên hệ khẩn cấp",
            description: "Tên tiêu để ứng với người liên hệ khẩn cấp",
            value: "Người liên hệ khẩn cấp"
        },
        relationWithEmergencyContactPerson: {
            columnName: "Quan hệ với người liên hệ khẩn cấp",
            description: "Tên tiêu để ứng với quan hệ với người liên hệ khẩn cấp",
            value: "Quan hệ với người liên hệ khẩn cấp"
        },
        emergencyContactPersonAddress: {
            columnName: "Địa chỉ người liên hệ khẩn cấp",
            description: "Tên tiêu để ứng với địa chỉ người liên hệ khẩn cấp",
            value: "Địa chỉ người liên hệ khẩn cấp"
        },
        emergencyContactPersonPhoneNumber: {
            columnName: "Điện thoại di động người liên hệ khẩn cấp",
            description: "Tên tiêu để ứng với điện thoại di động người liên hệ khẩn cấp",
            value: "Điện thoại di động người liên hệ khẩn cấp"
        },
        emergencyContactPersonHomePhone: {
            columnName: "Điện thoại nhà riêng người liên hệ khẩn cấp",
            description: "Tên tiêu để ứng với điện thoại nhà riêng người liên hệ khẩn cấp",
            value: "Điện thoại nhà riêng người liên hệ khẩn cấp"
        },
        emergencyContactPersonEmail: {
            columnName: "Email người liên hệ khẩn cấp",
            description: "Tên tiêu để ứng với email người liên hệ khẩn cấp",
            value: "Email người liên hệ khẩn cấp"
        },
        atmNumber: {
            columnName: "Số tài khoản ngân hàng",
            description: "Tên tiêu để ứng với số tài khoản ngân hàng",
            value: "Số tài khoản ngân hàng"
        },
        bankName: {
            columnName: "Tên ngân hàng",
            description: "Tên tiêu để ứng với tên ngân hàng",
            value: "Tên ngân hàng"
        },
        bankAddress: {
            columnName: "Chi nhánh ngân hàng",
            description: "Tên tiêu để ứng với chi nhánh ngân hàng",
            value: "Chi nhánh ngân hàng"
        },
        healthInsuranceNumber: {
            columnName: "Mã số BHYT",
            description: "Tên tiêu để ứng với mã số BHYT",
            value: "Mã số BHYT"
        },
        healthInsuranceStartDate: {
            columnName: "Ngày BHYT có hiệu lực",
            description: "Tên tiêu để ứng với ngày BHYT có hiệu lực",
            value: "Ngày BHYT có hiệu lực"
        },
        healthInsuranceEndDate: {
            columnName: "Ngày BHYT hết hạn",
            description: "Tên tiêu để ứng với ngày BHYT hết hạn",
            value: "Ngày BHYT hết hạn"
        },
        socialInsuranceNumber: {
            columnName: "Mã số BHXH",
            description: "Tên tiêu để ứng với mã số BHXH",
            value: "Mã số BHXH"
        },
        archivedRecordNumber: {
            columnName: "Nơi lưu trữ hồ sơ",
            description: "Tên tiêu để ứng với nơi lưu trữ hồ sơ",
            value: "Nơi lưu trữ hồ sơ"
        },
        file: {
            fileName: 'templateImportEmployeeInfor',
            fileUrl: '/upload/human-resource/templateImport/templateImportEmployee.xlsx'
        }
    };
    return config;
}

// Cấu hình file import kinh nghiệm làm việc của nhân viên
function configurationExperience(translate) {
    let config = {
        rowHeader: {
            description: "Số dòng tiêu đề của bảng",
            value: 1
        },
        sheets: {
            description: "Tên các sheet",
            value: ["2.HS Nhân viên - Kinh nghiệm"]
        },
        employeeNumber: {
            columnName: "Mã số nhân viên",
            description: "Tên tiêu đề ứng với 'Mã số nhân viên' ",
            value: "Mã số nhân viên"
        },
        fullName: {
            columnName: "Họ và tên",
            description: "Tên tiêu để ứng với họ và tên",
            value: "Họ và tên"
        },
        startDate: {
            columnName: "Từ tháng/năm",
            description: "Tên tiêu để ứng với từ tháng/năm",
            value: "Từ tháng/năm"
        },
        endDate: {
            columnName: "Đến tháng/năm",
            description: "Tên tiêu để ứng với đến tháng/năm",
            value: "Đến tháng/năm"
        },
        company: {
            columnName: "Đơn vị công tác",
            description: "Tên tiêu để ứng với đơn vị công tác",
            value: "Đơn vị công tác"
        },
        position: {
            columnName: "Chức vụ",
            description: "Tên tiêu để ứng với chức vụ",
            value: "Chức vụ"
        },
        file: {
            fileName: 'templateImportEmployeeInfor',
            fileUrl: '/upload/human-resource/templateImport/templateImportEmployee.xlsx'
        }
    };
    return config;
}

// Cấu hình file import thông tin bằng cấp
function configurationDegree(translate) {
    let config = {
        rowHeader: {
            description: "Số dòng tiêu đề của bảng",
            value: 1
        },
        sheets: {
            description: "Tên các sheet",
            value: ["3.HS Nhân viên - Bằng cấp"]
        },
        employeeNumber: {
            columnName: "Mã số nhân viên",
            description: "Tên tiêu đề ứng với 'Mã số nhân viên' ",
            value: "Mã số nhân viên"
        },
        fullName: {
            columnName: "Họ và tên",
            description: "Tên tiêu để ứng với họ và tên",
            value: "Họ và tên"
        },
        name: {
            columnName: "Tên bằng cấp",
            description: "Tên tiêu để ứng với tên bằng cấp",
            value: "Tên bằng cấp"
        },
        issuedBy: {
            columnName: "Nơi đào tạo",
            description: "Tên tiêu để ứng với nơi đào tạo",
            value: "Nơi đào tạo"
        },
        year: {
            columnName: "Năm tốt nghiệp",
            description: "Tên tiêu để ứng với năm tốt nghiệp",
            value: "Năm tốt nghiệp"
        },
        degreeType: {
            columnName: "Xếp loại",
            description: "Tên tiêu để ứng với xếp loại",
            value: "Xếp loại"
        },
        file: {
            fileName: 'templateImportEmployeeInfor',
            fileUrl: '/upload/human-resource/templateImport/templateImportEmployee.xlsx'
        }
    };
    return config;

}

// Cấu hình file import thông tin chứng chỉ
function configurationCertificate(translate) {
    let config = {
        rowHeader: {
            description: "Số dòng tiêu đề của bảng",
            value: 1
        },
        sheets: {
            description: "Tên các sheet",
            value: ["4.HS Nhân viên - Chứng chỉ"]
        },
        employeeNumber: {
            columnName: "Mã số nhân viên",
            description: "Tên tiêu đề ứng với 'Mã số nhân viên' ",
            value: "Mã số nhân viên"
        },
        fullName: {
            columnName: "Họ và tên",
            description: "Tên tiêu để ứng với họ và tên",
            value: "Họ và tên"
        },
        name: {
            columnName: "Tên chứng chỉ",
            description: "Tên tiêu để ứng với tên chứng chỉ",
            value: "Tên chứng chỉ"
        },
        issuedBy: {
            columnName: "Nơi cấp",
            description: "Tên tiêu để ứng với nơi cấp",
            value: "Nơi cấp"
        },
        startDate: {
            columnName: "Ngày cấp",
            description: "Tên tiêu để ứng với ngày cấp",
            value: "Ngày cấp"
        },
        endDate: {
            columnName: "Ngày hết hạn",
            description: "Tên tiêu để ứng với ngày hết hạn",
            value: "Ngày hết hạn"
        },
        file: {
            fileName: 'templateImportEmployeeInfor',
            fileUrl: '/upload/human-resource/templateImport/templateImportEmployee.xlsx'
        }
    }
    return config;
}

// Cấu hình file import hợp đồng lao động
function configurationContract(translate) {
    let config = {
        rowHeader: {
            description: "Số dòng tiêu đề của bảng",
            value: 1
        },
        sheets: {
            description: "Tên các sheet",
            value: ["5.HS Nhân viên - Hợp đồng"]
        },
        employeeNumber: {
            columnName: "Mã số nhân viên",
            description: "Tên tiêu đề ứng với 'Mã số nhân viên' ",
            value: "Mã số nhân viên"
        },
        fullName: {
            columnName: "Họ và tên",
            description: "Tên tiêu để ứng với họ và tên",
            value: "Họ và tên"
        },
        name: {
            columnName: "Tên hợp đồng",
            description: "Tên tiêu để ứng với tên hợp đồng",
            value: "Tên hợp đồng"
        },
        contractType: {
            columnName: "Loại hợp đồng",
            description: "Tên tiêu để ứng với loại hợp đồng",
            value: "Loại hợp đồng"
        },
        startDate: {
            columnName: "Ngày có hiệu lực",
            description: "Tên tiêu để ứng với ngày có hiệu lực",
            value: "Ngày có hiệu lực"
        },
        endDate: {
            columnName: "Ngày hết hạn",
            description: "Tên tiêu để ứng với ngày hết hạn",
            value: "Ngày hết hạn"
        },
        file: {
            fileName: 'templateImportEmployeeInfor',
            fileUrl: '/upload/human-resource/templateImport/templateImportEmployee.xlsx'
        }
    }
    return config;
}

// Cấu hình file import quá trình đóng bảo hiểm của nhân viên
function configurationSocialInsuranceDetails(translate) {
    let config = {
        rowHeader: {
            description: "Số dòng tiêu đề của bảng",
            value: 1
        },
        sheets: {
            description: "Tên các sheet",
            value: ["6.HS Nhân viên - Bảo hiểm XH"]
        },
        employeeNumber: {
            columnName: "Mã số nhân viên",
            description: "Tên tiêu đề ứng với 'Mã số nhân viên' ",
            value: "Mã số nhân viên"
        },
        fullName: {
            columnName: "Họ và tên",
            description: "Tên tiêu để ứng với họ và tên",
            value: "Họ và tên"
        },
        startDate: {
            columnName: "Từ tháng/năm",
            description: "Tên tiêu để ứng với từ tháng/năm",
            value: "Từ tháng/năm"
        },
        endDate: {
            columnName: "Đến tháng/năm",
            description: "Tên tiêu để ứng với đến tháng/năm",
            value: "Đến tháng/năm"
        },
        company: {
            columnName: "Đơn vị công tác",
            description: "Tên tiêu để ứng với đơn vị công tác",
            value: "Đơn vị công tác"
        },
        position: {
            columnName: "Chức vụ",
            description: "Tên tiêu để ứng với chức vụ",
            value: "Chức vụ"
        },
        file: {
            fileName: 'templateImportEmployeeInfor',
            fileUrl: '/upload/human-resource/templateImport/templateImportEmployee.xlsx'
        }
    };
    return config;
}

// Cấu hình file import tài liệu đính kèm
function configurationFile(translate) {
    let config = {
        rowHeader: {
            description: "Số dòng tiêu đề của bảng",
            value: 1
        },
        sheets: {
            description: "Tên các sheet",
            value: ["7.HS Nhân viên - Tài liệu"]
        },
        employeeNumber: {
            columnName: "Mã số nhân viên",
            description: "Tên tiêu đề ứng với 'Mã số nhân viên' ",
            value: "Mã số nhân viên"
        },
        fullName: {
            columnName: "Họ và tên",
            description: "Tên tiêu để ứng với họ và tên",
            value: "Họ và tên"
        },
        name: {
            columnName: "Tên tài liệu",
            description: "Tên tiêu để ứng với tên tài liệu",
            value: "Tên tài liệu"
        },
        description: {
            columnName: "Mô tả",
            description: "Tên tiêu để ứng với mô tả",
            value: "Mô tả"
        },
        number: {
            columnName: "Số lượng",
            description: "Tên tiêu để ứng với số lượng",
            value: "Số lượng"
        },
        status: {
            columnName: "Trạng thái",
            description: "Tên tiêu để ứng với trạng thái",
            value: "Trạng thái"
        },
        file: {
            fileName: 'templateImportEmployeeInfor',
            fileUrl: '/upload/human-resource/templateImport/templateImportEmployee.xlsx'
        }
    };
    return config;
}




function templateImport(translate) {
    let teamplateImport = {
        fileName: translate(`human_resource.profile.employee_management.file_export_name`),
            dataSheets: [
                {
                    // 1.Nhân viên
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet1`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "organizationalUnits", value: translate(`human_resource.unit`), width: 25 },
                                { key: "position", value: translate(`human_resource.position`), width: 25 },
                                { key: "birthdate", value: translate(`human_resource.profile.date_birth`) },
                                { key: "gender", value: translate(`human_resource.profile.gender`) },
                                { key: "employeeTimesheetId", value: translate(`human_resource.profile.attendance_code`) },
                                { key: "identityCardNumber", value: translate(`human_resource.profile.id_card`) },
                                { key: "identityCardDate", value: translate(`human_resource.profile.date_issued`) },
                                { key: "identityCardAddress", value: translate(`human_resource.profile.issued_by`) },
                                { key: "birthplace", value: translate(`human_resource.profile.place_birth`), width: 35 },
                                { key: "permanentResidence", value: translate(`human_resource.profile.permanent_address`), width: 35 },
                                { key: "temporaryResidence", value: translate(`human_resource.profile.current_residence`), width: 35 },
                                { key: "maritalStatus", value: translate(`human_resource.profile.relationship`) },
                                { key: "status", value: translate(`human_resource.profile.status_work`) },
                                { key: "startingDate", value: translate(`human_resource.profile.starting_date`) },
                                { key: "leavingDate", value: translate(`human_resource.profile.leaving_date`) },
                                { key: "emailInCompany", value: translate(`human_resource.profile.email_company`), width: 35 },
                                { key: "taxNumber", value: translate(`human_resource.profile.personal_income_tax`) },
                                { key: "taxRepresentative", value: translate(`human_resource.profile.representative`), width: 20 },
                                { key: "taxDateOfIssue", value: translate(`human_resource.profile.day_active`) },
                                { key: "taxAuthority", value: translate(`human_resource.profile.managed_by`), width: 35 },
                                { key: "ethnic", value: translate(`human_resource.profile.ethnic`) },
                                { key: "religion", value: translate(`human_resource.profile.religion`) },
                                { key: "nationality", value: translate(`human_resource.profile.nationality`) },
                                { key: "educationalLevel", value: translate(`human_resource.profile.educational_level`) },
                                { key: "foreignLanguage", value: translate(`human_resource.profile.language_level`) },
                                { key: "professionalSkill", value: translate(`human_resource.profile.qualification`) },
                                { key: "phoneNumber", value: translate(`human_resource.profile.mobile_phone_1`) },
                                { key: "phoneNumber2", value: translate(`human_resource.profile.mobile_phone_2`) },
                                { key: "personalEmail", value: translate(`human_resource.profile.personal_email_1`), width: 35 },
                                { key: "personalEmail2", value: translate(`human_resource.profile.personal_email_2`), width: 35 },
                                { key: "homePhone", value: translate(`human_resource.profile.home_phone`) },
                                { key: "emergencyContactPerson", value: translate(`human_resource.profile.employee_management.export.emergency_contact_person`), width: 20 },
                                { key: "relationWithEmergencyContactPerson", value: translate(`human_resource.profile.employee_management.export.relation_with_emergency_contact_person`),width: 25 },
                                { key: "emergencyContactPersonAddress", value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_address`), width: 35 },
                                { key: "emergencyContactPersonPhoneNumber", value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_phone_number`),width: 25 },
                                { key: "emergencyContactPersonHomePhone", value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_home_phone`),width: 25 },
                                { key: "emergencyContactPersonEmail", value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_email`), width: 35 },
                                { key: "atmNumber", value: translate(`human_resource.profile.employee_management.export.atmNumber`) },
                                { key: "bankName", value: translate(`human_resource.profile.bank_name`) },
                                { key: "bankAddress", value: translate(`human_resource.profile.employee_management.export.bank_address`) },
                                { key: "healthInsuranceNumber", value: translate(`human_resource.profile.number_BHYT`) },
                                { key: "healthInsuranceStartDate", value: translate(`human_resource.profile.employee_management.export.health_insurance_start_date`),width: 20 },
                                { key: "healthInsuranceEndDate", value: translate(`human_resource.profile.employee_management.export.health_insurance_end_date`),width: 20 },
                                { key: "socialInsuranceNumber", value: translate(`human_resource.profile.number_BHXH`) },
                                { key: "archivedRecordNumber", value: translate(`human_resource.profile.attachments_code`) },
                            ],
                            data: [
                                {
                                    STT: 1,
                                    archivedRecordNumber: "T3 - 123698",
                                    atmNumber: "102298653",
                                    bankAddress: "Hai Bà Trưng",
                                    bankName: "ViettinBank",
                                    birthdate: "29-09-1988",
                                    birthplace: "Hải Phương - Hải Hậu - Nam Định",
                                    educationalLevel: "12/12",
                                    emailInCompany: "nva.vnist@gmail.com",
                                    emergencyContactPerson: "Nguyễn Văn Thái",
                                    emergencyContactPersonAddress: "Hải Phương - Hải Hậu - Nam Định",
                                    emergencyContactPersonEmail: "cuong@gmail.com",
                                    emergencyContactPersonHomePhone: 962586789,
                                    emergencyContactPersonPhoneNumber: 962586278,
                                    employeeNumber: "MS2015123",
                                    employeeTimesheetId: "123456",
                                    ethnic: "Kinh",
                                    foreignLanguage: "500 Toeic",
                                    fullName: "Nguyễn Văn An",
                                    gender: translate(`human_resource.profile.male`),
                                    healthInsuranceEndDate: "16-02-2020",
                                    healthInsuranceNumber: "N1236589",
                                    healthInsuranceStartDate: "25-01-2019",
                                    homePhone: 978590338,
                                    identityCardAddress: "Nam Định",
                                    identityCardDate: "20-10-2015",
                                    identityCardNumber: 163414569,
                                    leavingDate: undefined,
                                    maritalStatus: translate(`human_resource.profile.single`),
                                    nationality: "Việt Nam",
                                    organizationalUnits: "Ban giám đốc",
                                    permanentResidence: "Hải Phương - Hải Hậu - Nam Định",
                                    personalEmail: "tranhungcuong703@gmail.com",
                                    personalEmail2: "hungkaratedo03101998@gmail.com",
                                    phoneNumber: 962586290,
                                    phoneNumber2: 9625845,
                                    position: "Giám đốc",
                                    professionalSkill: translate(`human_resource.profile.university`),
                                    relationWithEmergencyContactPerson: "Em trai",
                                    religion: "Không",
                                    socialInsuranceNumber: "XH1569874",
                                    startingDate: undefined,
                                    status: translate(`human_resource.profile.active`),
                                    taxAuthority: "Chi cục thuế Huyện Hải Hậu",
                                    taxDateOfIssue: "08-12-2019",
                                    taxNumber: "12658974",
                                    taxRepresentative: "Nguyễn Văn Hưng",
                                    temporaryResidence: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",

                                },
                                {
                                    STT: 2,
                                    archivedRecordNumber: "T3 - 123698",
                                    atmNumber: "102298653",
                                    bankAddress: "Hai Bà Trưng",
                                    bankName: "ViettinBank",
                                    birthdate: "17-02-1998",
                                    birthplace: "Hải Phương - Hải Hậu - Nam Định",
                                    educationalLevel: "12/12",
                                    emailInCompany: "tvb.vnist@gmail.com",
                                    emergencyContactPerson: "Nguyễn Văn Thái",
                                    emergencyContactPersonAddress: "Hải Phương - Hải Hậu - Nam Định",
                                    emergencyContactPersonEmail: "cuong@gmail.com",
                                    emergencyContactPersonHomePhone: 962586789,
                                    emergencyContactPersonPhoneNumber: 962586278,
                                    employeeNumber: "MS2015124",
                                    employeeTimesheetId: "123456",
                                    ethnic: "Kinh",
                                    foreignLanguage: "500 Toeic",
                                    fullName: "Trần Văn Bình",
                                    gender: translate(`human_resource.profile.male`),
                                    healthInsuranceEndDate: "16-02-2020",
                                    healthInsuranceNumber: "N1236589",
                                    healthInsuranceStartDate: "25-01-2019",
                                    homePhone: 978590338,
                                    identityCardAddress: "Nam Định",
                                    identityCardDate: "20-10-2015",
                                    identityCardNumber: 163414569,
                                    leavingDate: undefined,
                                    maritalStatus: translate(`human_resource.profile.single`),
                                    nationality: "Việt Nam",
                                    organizationalUnits: "Ban giám đốc",
                                    permanentResidence: "Hải Phương - Hải Hậu - Nam Định",
                                    personalEmail: "tranhungcuong703@gmail.com",
                                    personalEmail2: "hungkaratedo03101998@gmail.com",
                                    phoneNumber: 962586290,
                                    phoneNumber2: 9625845,
                                    position: "Phó giám đốc",
                                    professionalSkill: translate(`human_resource.profile.university`),
                                    relationWithEmergencyContactPerson: "Em trai",
                                    religion: "Không",
                                    socialInsuranceNumber: "XH1569874",
                                    startingDate: undefined,
                                    status: translate(`human_resource.profile.active`),
                                    taxAuthority: "Chi cục thuế Huyện Hải Hậu",
                                    taxDateOfIssue: "08-12-2019",
                                    taxNumber: "12658974",
                                    taxRepresentative: "Nguyễn Văn Hưng",
                                    temporaryResidence: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",
                                    
                                }
                            ]
                        }
                    ]
                },
                {
                    // 2.HS Nhân viên - Kinh nghiệm
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet2`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "startDate", value: translate(`human_resource.profile.from_month_year`) },
                                { key: "endDate", value: translate(`human_resource.profile.to_month_year`) },
                                { key: "company", value: translate(`human_resource.profile.unit`), width: 35 },
                                { key: "position", value: translate(`human_resource.position`), width: 25 }
                            ],
                            data: [{
                                STT: 1,
                                company: "Vnist",
                                employeeNumber: "MS2015123",
                                endDate: "02-2020",
                                fullName: "Nguyễn Văn An",
                                position: "Nhân viên",
                                startDate: "06-2019",
                            },{
                                STT: 2,
                                company: "Vnist",
                                employeeNumber: "MS2015124",
                                endDate: "02-2020",
                                fullName: "Trần Văn Bình",
                                position: "Nhân viên",
                                startDate: "06-2019",
                            }]
                        }
                    ]
                },
                {
                    // 3.HS Nhân viên - Bằng cấp
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet3`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "name", value: translate(`human_resource.profile.name_diploma`), width: 25 },
                                { key: "issuedBy", value: translate(`human_resource.profile.diploma_issued_by`), width: 35 },
                                { key: "year", value: translate(`human_resource.profile.graduation_year`) },
                                { key: "degreeType", value: translate(`human_resource.profile.ranking_learning`) },
                            ],
                            data: [{
                                STT: 1,
                                degreeType: translate(`human_resource.profile.good`),
                                employeeNumber: "MS2015123",
                                fullName: "Nguyễn Văn An",
                                issuedBy: "Đại học Bách Khoa",
                                name: "Bằng tốt nghiệp",
                                year: "2020"
                            },{
                                STT: 2,
                                degreeType: translate(`human_resource.profile.good`),
                                employeeNumber: "MS2015124",
                                fullName: "Trần Văn Bình",
                                issuedBy: "Đại học Bách Khoa",
                                name: "Bằng tốt nghiệp",
                                year: "2020"
                            }]
                        }
                    ]
                },
                {
                    // 4.HS Nhân viên - Chứng chỉ
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet4`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "name", value: translate(`human_resource.profile.name_certificate`), width: 25 },
                                { key: "issuedBy", value: translate(`human_resource.profile.issued_by`), width: 35 },
                                { key: "startDate", value: translate(`human_resource.profile.date_issued`) },
                                { key: "endDate", value: translate(`human_resource.profile.end_date_certificate`) },
                            ],
                            data: [{
                                STT: 1,
                                employeeNumber: "MS2015123",
                                endDate: "25-10-2020",
                                fullName: "Nguyễn Văn An",
                                issuedBy: "Hà Nội",
                                name: "PHP",
                                startDate: "25-10-2019",
                            },{
                                STT: 2,
                                employeeNumber: "MS2015124",
                                endDate: "25-10-2020",
                                fullName: "Trần Văn Bình",
                                issuedBy: "Hà Nội",
                                name: "PHP",
                                startDate: "25-10-2019",
                            }]
                        }
                    ]
                },
                {
                    // 5.HS Nhân viên - Hợp đồng
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet5`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "name", value: translate(`human_resource.profile.name_contract`), width: 35 },
                                { key: "contractType", value: translate(`human_resource.profile.type_contract`), width: 25 },
                                { key: "startDate", value: translate(`human_resource.profile.start_date`) },
                                { key: "endDate", value: translate(`human_resource.profile.end_date_certificate`) },
                            ],
                            data: [{
                                STT: 1,
                                contractType: "Hợp đồng theo năm",
                                employeeNumber: "MS2015123",
                                endDate: "30-09-2020",
                                fullName: "Nguyễn Văn An",
                                name: "Hợp đồng làm việc",
                                startDate: "26-06-2019",
                            },{
                                STT: 2,
                                contractType: "Hợp đồng theo năm",
                                employeeNumber: "MS2015124",
                                endDate: "26-12-2020",
                                fullName: "Trần Văn Bình",
                                name: "Hợp đồng làm việc",
                                startDate: "26-06-2019",
                            }]
                        }
                    ]
                },
                {
                    // 6.HS Nhân viên - Bảo hiểm XH
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet6`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "startDate", value: translate(`human_resource.profile.from_month_year`) },
                                { key: "endDate", value: translate(`human_resource.profile.to_month_year`) },
                                { key: "company", value: translate(`human_resource.profile.unit`), width: 35 },
                                { key: "position", value: translate(`human_resource.position`), width: 25 }
                            ],
                            data: [{
                                STT: 1,
                                company: "Vnist",
                                employeeNumber: "MS2015123",
                                endDate: "05-2020",
                                fullName: "Nguyễn Văn An",
                                position: "Nhân viên",
                                startDate: "01-2020"
                            },{
                                STT: 2,
                                company: "Vnist",
                                employeeNumber: "MS2015124",
                                endDate: "05-2020",
                                fullName: "Trần Văn Bình",
                                position: "Nhân viên",
                                startDate: "01-2020"
                            }]
                        }
                    ]
                },
                {
                    // 7.HS Nhân viên - Tài liệu
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet7`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "name", value: translate(`human_resource.profile.file_name`) },
                                { key: "description", value: translate(`general.description`), width: 35 },
                                { key: "number", value: translate(`human_resource.profile.number`) },
                                { key: "status", value: translate(`human_resource.status`) },
                            ],
                            data: [{
                                STT: 1,
                                description: "Ảnh 3x4",
                                employeeNumber: "MS2015123",
                                fullName: "Nguyễn Văn An",
                                name: "Ảnh",
                                number: "1",
                                status: translate(`human_resource.submitted`),
                            },{
                                STT: 2,
                                description: "Ảnh 3x4",
                                employeeNumber: "MS2015124",
                                fullName: "Trần Văn Bình",
                                name: "Ảnh",
                                number: "1",
                                status: translate(`human_resource.submitted`),
                            }]
                        }
                    ]
                },
                {
                    // 8.HS Nhân viên - Khen thưởng
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet8`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "decisionNumber", value: translate('human_resource.commendation_discipline.commendation.table.decision_number') },
                                { key: "decisionUnit", value: translate('human_resource.commendation_discipline.commendation.table.decision_unit'), width: 25 },
                                { key: "startDate", value: translate('human_resource.commendation_discipline.commendation.table.decision_date') },
                                { key: "type", value: translate('human_resource.commendation_discipline.commendation.table.reward_forms') },
                                { key: "reason", value: translate('human_resource.commendation_discipline.commendation.table.reason_praise'), width: 35 },
                            ],
                            data: [{
                                STT: 1,
                                decisionNumber: "123",
                                decisionUnit: "Phòng kinh doanh",
                                employeeNumber: "MS2015123",
                                fullName: "Nguyễn Văn An",
                                reason: "Vượt doanh số",
                                startDate: "02-02-2020",
                                type: "Thưởng tiền",
                            },{
                                STT: 2,
                                decisionNumber: "1234",
                                decisionUnit: "Phòng kinh doanh",
                                employeeNumber: "MS2015123",
                                fullName: "Nguyễn Văn An",
                                reason: "Vượt doanh số 500 triệu",
                                startDate: "02-02-2020",
                                type: "Thưởng tiền",
                            }]
                        }
                    ]
                },
                {
                    // 9.HS Nhân viên - Kỷ luật
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet9`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "decisionNumber", value: translate('human_resource.commendation_discipline.commendation.table.decision_number') },
                                { key: "decisionUnit", value: translate('human_resource.commendation_discipline.commendation.table.decision_unit'), width: 25 },
                                { key: "startDate", value: translate('human_resource.commendation_discipline.discipline.table.start_date') },
                                { key: "endDate", value: translate('human_resource.commendation_discipline.discipline.table.end_date') },
                                { key: "type", value: translate('human_resource.commendation_discipline.discipline.table.discipline_forms') },
                                { key: "reason", value: translate('human_resource.commendation_discipline.discipline.table.reason_discipline'), width: 35 },
                            ],
                            data: [{
                                STT: 1,
                                decisionNumber: "1456",
                                decisionUnit: "Phòng kinh doanh",
                                employeeNumber: "MS2015123",
                                endDate: "09-02-2020",
                                fullName: "Nguyễn Văn An",
                                reason: "Không làm đủ công",
                                startDate: "07-02-2020",
                                type: "Phạt tiền",
                            },{
                                STT: 2,
                                decisionNumber: "1457",
                                decisionUnit: "Phòng kinh doanh",
                                employeeNumber: "MS2015123",
                                endDate: "09-02-2020",
                                fullName: "Nguyễn Văn An",
                                reason: "Không đủ doanh số",
                                startDate: "07-02-2020",
                                type: "Phạt tiền"
                            }]
                        }
                    ]
                },
                {
                    // 10.HS Nhân viên - Lương thưởng
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet10`),
                    tables: [{
                        rowHeader: 2,
                        merges: [{
                            key: "other",
                            columnName: translate('human_resource.salary.other_salary'),
                            keyMerge: 'bonus0',
                            colspan: 2
                        }],
                        columns: [
                            { key: "STT", value: translate('human_resource.stt'), width: 7 },
                            { key: "month", value: translate('human_resource.month'), width: 10 },
                            { key: "year", value: translate('human_resource.holiday.year'), width: 10 },
                            { key: "employeeNumber", value: translate('human_resource.staff_number') },
                            { key: "fullName", value: translate('human_resource.staff_name'), width: 20 },
                            { key: "organizationalUnit", value: translate('human_resource.unit'), width: 25 },
                            { key: "gender", value: translate('human_resource.profile.gender') },
                            { key: "birthdate", value: translate('human_resource.profile.date_birth') },
                            { key: "status", value: translate('human_resource.profile.status_work') },
                            { key: "mainSalary", value: translate('human_resource.salary.table.main_salary'), },
                            { key: 'bonus0',value: 'Thưởng đầu hộp SanFoVet'},
                            { key: 'bonus1',value: 'Thưởng đầu hộp ViaVet'},
                            { key: "total", value: translate('human_resource.salary.table.total_salary'), },
                        ],
                        data: [{
                            STT: 1,
                            employeeNumber: 'MS1256398',
                            fullName: "Nguyễn Văn A",
                            mainSalary: 15000000,
                            birthdate: new Date("1995-12-10"),
                            status: translate('human_resource.profile.active'),
                            gender: translate('human_resource.profile.male'),
                            organizationalUnit: 'Ban giám đốc',
                            total: 30000000,
                            month: 5,
                            year: 2020,
                            bonus0: 10000000,
                            bonus1: 5000000
                        }, {
                            STT: 2,
                            employeeNumber: 'MS1256596',
                            fullName: "Nguyễn Thị C",
                            mainSalary: 15000000,
                            birthdate: new Date("1989-5-25"),
                            status: translate('human_resource.profile.active'),
                            gender: translate('human_resource.profile.male'),
                            organizationalUnit: 'Phòng kinh doanh',
                            total: 30000000,
                            month: 5,
                            year: 2020,
                            bonus0: 10000000,
                            bonus1: 5000000
                        }]
                    }, ]
                },
                {
                    // 11.HS Nhân viên - Nghỉ phép
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet11`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "organizationalUnit", value: translate('human_resource.unit'), width: 25 },
                                { key: "startDate", value: translate('human_resource.annual_leave.table.start_date') },
                                { key: "endDate", value: translate('human_resource.annual_leave.table.end_date') },
                                { key: "reason", value: translate('human_resource.annual_leave.table.reason'), width: 35 },
                                { key: "status", value: translate('human_resource.status'), width: 25 },
                            ],
                            data: [{
                                STT: 1,
                                employeeNumber: "MS2015123",
                                endDate: "08-02-2020",
                                fullName: "Nguyễn Văn An",
                                organizationalUnit: "Ban giám đốc",
                                reason: "Về quê",
                                startDate: "06-02-2020",
                                status: translate(`human_resource.annual_leave.status.pass`)
                            },{
                                STT: 2,
                                employeeNumber: "MS2015123",
                                endDate: "10-02-2020",
                                fullName: "Nguyễn Văn An",
                                organizationalUnit: "Ban giám đốc",
                                reason: "Nghỉ du lịch",
                                startDate: "05-02-2020",
                                status: translate(`human_resource.annual_leave.status.process`)
                            }]
                        }
                    ]
                },
            ]
    };

    return teamplateImport;
}