const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tạo bảng datatable thông tin nhân viên
const EmployeeSchema = new Schema(
    {
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
        },
        avatar: {
            type: String,
        },
        fullName: {
            type: String,
            required: true,
        },
        employeeNumber: {
            type: String,
            required: true,
        },
        status: {
            // active - Làm chính thức, leave - Đã nghỉ làm, maternity_leave: Nghỉ thai sản, unpaid_leave: Nghỉ không lương, probationary: Đang thử việc, sick_leave: Nghỉ ốm đau
            type: String,
            default: 'active',
            enum: [
                'active',
                'leave',
                'maternity_leave',
                'unpaid_leave',
                'probationary',
                'sick_leave',
            ],
        },
        startingDate: {
            // Ngày bắt đầu làm việc
            type: Date,
        },
        leavingDate: {
            // Ngày nghỉ việc
            type: Date,
        },
        employeeTimesheetId: {
            // mã số chấm công của nhân viên
            type: String,
        },
        gender: {
            // male - nam, female - nữ
            type: String,
            required: true,
            enum: ['male', 'female'],
        },
        birthdate: {
            type: Date,
        },
        birthplace: {
            type: String,
        },
        identityCardNumber: {
            // số cmnd
            type: String,
        },
        identityCardDate: {
            // ngày cấp
            type: Date,
        },
        identityCardAddress: {
            type: String,
        },
        emailInCompany: {
            // địa chỉ email dùng ở company
            type: String,
        },
        nationality: {
            // Quốc tịch
            type: String,
        },
        atmNumber: {
            // Số tài khoản ATM
            type: String,
        },
        bankName: {
            // Tên ngân hàng
            type: String,
        },
        bankAddress: {
            type: String,
        },
        ethnic: {
            // Dân tộc
            type: String,
        },
        religion: {
            // Tín ngưỡng
            type: String,
        },
        maritalStatus: {
            // Tình trạng hôn nhân: single - Độc thân, married - Đã kết hôn
            type: String,
            // enum: ['single', 'married']
        },
        /**
         * Start
         * Thông tin liên hệ
         */
        phoneNumber: {
            type: String,
        },
        phoneNumber2: {
            type: String,
        },
        personalEmail: {
            type: String,
        },
        personalEmail2: {
            type: String,
        },
        homePhone: {
            // SĐT nhà riêng
            type: String,
        },
        emergencyContactPerson: {
            // Người liên hệ khẩn cấp
            type: String,
        },
        relationWithEmergencyContactPerson: {
            // Quan hệ với người liên hệ khẩn cấp
            type: String,
        },
        emergencyContactPersonPhoneNumber: {
            type: String,
        },
        emergencyContactPersonEmail: {
            type: String,
        },
        emergencyContactPersonHomePhone: {
            type: String,
        },
        emergencyContactPersonAddress: {
            type: String,
        },
        permanentResidence: {
            // Địa chỉ hộ khẩu thường trú
            type: String,
        },
        permanentResidenceCountry: {
            // Quốc gia trong hộ khẩu thường trú
            type: String,
        },
        permanentResidenceCity: {
            type: String,
        },
        permanentResidenceDistrict: {
            type: String,
        },
        permanentResidenceWard: {
            // Phường trong hộ khẩu thường trú
            type: String,
        },
        temporaryResidence: {
            type: String,
        },
        temporaryResidenceCountry: {
            type: String,
        },
        temporaryResidenceCity: {
            type: String,
        },
        temporaryResidenceDistrict: {
            type: String,
        },
        temporaryResidenceWard: {
            type: String,
        },
        /**
         * End
         * Thông tin liên hệ
         */
        educationalLevel: {
            // Trình độ văn hóa
            type: String,
            // enum: ['12/12', '11/12', '10/12', '9/12']
        },
        foreignLanguage: {
            // Trình độ ngoại ngữ
            type: String,
        },
        professionalSkill: {
            // Trình độ chuyên môn: intermediate_degree - Trung cấp, colleges - Cao đẳng, university - Đại học, bachelor - cử nhân, engineer - kỹ sư, master_degree - Thạc sỹ, phd- Tiến sỹ, unavailable - Không có
            type: String,
            enum: [
                'intermediate_degree',
                'colleges',
                'university',
                'bachelor',
                'engineer',
                'master_degree',
                'phd',
                'unavailable',
            ],
        },
        healthInsuranceNumber: {
            type: String,
        },
        healthInsuranceStartDate: {
            type: Date,
        },
        healthInsuranceEndDate: {
            type: Date,
        },
        healthInsuranceAttachment: [
            {
                fileName: {
                    type: String,
                },
                url: {
                    type: String,
                },
            },
        ],
        socialInsuranceNumber: {
            // Bảo hiểm XH
            type: String,
        },
        socialInsuranceDetails: [
            {
                startDate: Date,
                endDate: Date,
                position: String,
                company: String,
                money: Number,
            },
        ],
        taxNumber: {
            // Mã số thuế thu nhập cá nhân
            type: String,
        },
        taxRepresentative: {
            // Đại diện của người nộp thuế
            type: String,
        },
        taxDateOfIssue: {
            // ngày cấp mã số thuế
            type: Date,
        },
        taxAuthority: {
            // Cơ quan quản lý thuế (theo mã số thuế đã cấp)
            type: String,
        },
        degrees: [
            {
                // Bằng cấp tốt nghiệp
                name: String,
                abbreviations: String,
                code: String,
                issuedBy: String,
                year: Date,
                degreeType: {
                    type: String,
                    enum: [
                        'excellent',
                        'very_good',
                        'good',
                        'average_good',
                        'ordinary',
                        'no_rating',
                        'unknown',
                    ], //excellent-Xuất sắc, very_good-Giỏi, good-Khá, average_good-Trung bình khá, ordinary-Trung bình
                },
                degreeQualification: {
                    type: Number,
                    Enum: [0, 1, 2, 3, 4, 5, 6, 7, 8], // 0: không có, 1: trình độ phổ thông, 2: trung cấp, 3: cao đẳng, 4: cử nhân/đại học, 5: kĩ sư, 6: thạc sĩ, 7: tiến sĩ, 8: giáo sư
                },
                field: {
                    type: Schema.Types.ObjectId,
                    ref: 'Field',
                },
                major: {
                    type: Schema.Types.ObjectId,
                    ref: 'Major',
                },
                file: String,
                urlFile: String,
            },
        ],
        certificates: [
            {
                // Chứng chỉ ngắn hạn (join từ bảng cetificate)
                certificate: {
                    type: Schema.Types.ObjectId,
                    ref: 'Certificate',
                },
                issuedBy: String,
                startDate: Date,
                endDate: Date,
                file: String,
                urlFile: String,
            },
        ],
        experiences: [
            {
                // Kinh nghiệm làm việc
                startDate: Date,
                endDate: Date,
                company: String,
                project: String,
                position: String,
                jobDescription: String,
                file: String,
                urlFile: String,
            },
        ],
        packageStatus: {
            // active - Chưa nhận dự án nào, waiting - Đã dự kiến vào dự án khác, working: Đã tham gia dự án
            type: String,
            default: 'active',
            enum: ['active', 'waiting', 'working'],
        },
        contractEndDate: {
            type: Date,
        },
        contractType: {
            type: String,
        },
        contracts: [
            {
                name: String,
                contractNumber: String,
                contractType: String,
                startDate: Date,
                endDate: Date,
                file: String,
                urlFile: String,
            },
        ],
        archivedRecordNumber: {
            // Mã hồ sơ lưu trữ
            type: String,
        },
        files: [
            {
                // Các file scan đính kèm
                name: String,
                description: String,
                number: String,
                status: {
                    type: String,
                    enum: ['submitted', 'not_submitted_yet', 'returned'], //submitted-Đã nộp, not_submitted_yet-Chưa nộp, returned-Đã trả
                },
                file: String,
                urlFile: String,
            },
        ],
        houseHold: {
            headHouseHoldName: { type: String }, // tên chủ hộ
            documentType: { type: String }, // loại giấy tờ
            houseHoldNumber: { type: String }, // số hộ khẩu
            city: { type: String }, // thành phố, tỉnh
            district: { type: String }, // quận, huyện
            ward: { type: String }, // phường ,xã
            houseHoldAddress: { type: String }, // Địa chỉ hộ khẩu
            phone: { type: String }, // Số điện thoại
            houseHoldCode: { type: String }, // mã sổ hộ khẩu

            // Thông tin các thành viên trong hộ gia đình
            familyMembers: [
                {
                    name: { type: String }, // tên
                    codeSocialInsurance: { type: String }, // mã số BHXH
                    bookNumberSocialInsurance: { type: String }, // Số sổ BHXH
                    gender: {
                        type: String,
                        enum: ['male', 'female'],
                        default: 'male',
                    }, // Giới tính
                    isHeadHousehold: {
                        type: String,
                        enum: ['yes', 'no'],
                        default: 'no',
                    }, // Là chủ hộ
                    relationshipWithHeadHousehold: { type: String }, // Quan hệ với chủ hộ
                    birth: { type: Date }, // Ngày sinh
                    ccns: { type: String }, // CNSS
                    placeOfBirthCertificate: { type: String }, // Nơi cấp giấy khai sinh
                    nationality: { type: String }, // Quốc tịch
                    nation: { type: String }, // Dân tộc
                    numberPassport: { type: String }, // Số CMND, Hộ chiếu
                    note: { type: String }, // Ghi chú
                },
            ],
        },
        currentBiddingPackage: {
            type: Schema.Types.ObjectId,
            ref: 'BiddingPackage',
        },
        biddingPackageEndDate: {
            type: Date,
        },
        biddingPackagePersonalStatus: {
            type: Number, // 1: Không tham gia gói thầu, 2: Đang chờ kết quả dự thầu, 3: Đang tham gia gói thầu
            default: 1,
        },
        careerPositions: [
            {
                careerPosition: {
                    type: Schema.Types.ObjectId,
                    ref: 'CareerPosition',
                },
                biddingPackage: {
                    type: Schema.Types.ObjectId,
                    ref: 'BiddingPackage',
                },
                project: {
                    type: String,
                },
                company: {
                    type: String,
                },
                startDate: {
                    type: Date,
                },
                endDate: {
                    type: Date,
                },
                professionalExperience: {
                    type: String,
                },
                file: String,
                urlFile: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = (db) => {
    if (!db.models || !db.models.Employee) return db.model('Employee', EmployeeSchema);
    return db.models.Employee;
};
