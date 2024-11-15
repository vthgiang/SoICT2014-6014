const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng gói thầu dùng để lưu lại thông tin gói thầu đã tham gia
const BiddingPackageSchema = new Schema(
    {
        name: {
            type: String, // tên của gói thầu
        },
        code: {
            type: String, // mã code
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        type: {
            type: Number, // 1: Gói thầu tư vấn, 2: Gói thầu phi tư vấn, 3: Gói thầu hàng hóa, 4: Gói thầu xây lắp, 5: Gói thầu hỗn hợp
            default: 1,
        },
        description: {
            // Mô tả gói thầu
            type: String,
        },
        status: {
            type: Number, // 1: hoạt động, 0: ngưng hoạt động, 2: đang chờ kết quả dự thầu, 3: Đang thực hiện gói thầu, 4:hoàn thành
            default: 1,
        },
        price: {
            type: Number,
        },
        openLocal: {
            type: String,
        },
        receiveLocal: {
            type: String,
        },
        customer: {
            type: String,
        },
        keyPersonnelRequires: [
            {
                careerPosition: {
                    type: Schema.Types.ObjectId,
                    ref: "CareerPosition",
                },
                sameCareerPosition: [
                    {
                        type: Schema.Types.ObjectId,
                        ref: "CareerPosition",
                    },
                ],
                majors: [
                    {
                        type: Schema.Types.ObjectId,
                        ref: "Major",
                    },
                ],
                professionalSkill: {
                    type: Number,
                    Enum: [0, 1, 2, 3, 4, 5, 6, 7, 8], // 0: không có, 1: trình độ phổ thông, 2: trung cấp, 3: cao đẳng, 4: cử nhân/đại học, 5: kĩ sư, 6: thạc sĩ, 7: tiến sĩ, 8: giáo sư
                },
                count: Number,

                certificateRequirements: {
                    certificates: [
                        {
                            type: Schema.Types.ObjectId,
                            ref: "Certificate",
                        },
                    ],
                    count: Number,
                    certificatesEndDate: Date,
                },
                numberYearsOfExperience: Number,
                experienceWorkInCarreer: Number,
                numblePackageWorkInCarreer: Number,
            },
        ],
        keyPeople: [
            {
                careerPosition: {
                    type: Schema.Types.ObjectId,
                    ref: "CareerPosition",
                },
                employees: [
                    {
                        type: Schema.Types.ObjectId,
                        ref: "Employee",
                    },
                ],
            },
        ],
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
        },

        // đề xuất kỹ thuật
        proposals: {
            executionTime: {
                type: Number,
            },
            unitOfTime: {
                // có 3 đơn vị thời gian: Giờ, Ngày, Tháng
                type: String,
                default: "days",
                enum: [
                    "hours",
                    "days",
                    "months",
                ],
            },
            // ghi lại lịch sử từng lần phân công - chỉnh sửa phân công nhân sự
            logs: [{
                // phiên bản cũ
                oldVersion: {
                    isProposal: {
                        type: Boolean,
                        default: false
                    },
                    tasks: [{
                        // mã công việc
                        code: {
                            type: String,
                        },
                        // tên công việc
                        taskName: {
                            type: String
                        },
                        // mô tả công việc
                        taskDescription: {
                            type: String
                        },
                        // nhân sự trực tiếp
                        directEmployees: [{
                            type: Schema.Types.ObjectId,
                            ref: "Employee",
                        }],
                        // nhân sự dự phòng
                        backupEmployees: [{
                            type: Schema.Types.ObjectId,
                            ref: "Employee",
                        }],
                    }]
                },
                // phiên bản mới
                newVersion: {
                    isProposal: {
                        type: Boolean,
                        default: false
                    },
                    tasks: [{
                        // mã công việc
                        code: {
                            type: String,
                        },
                        // tên công việc
                        taskName: {
                            type: String
                        },
                        // mô tả công việc
                        taskDescription: {
                            type: String
                        },
                        // nhân sự trực tiếp
                        directEmployees: [{
                            type: Schema.Types.ObjectId,
                            ref: "Employee",
                        }],
                        // nhân sự dự phòng
                        backupEmployees: [{
                            type: Schema.Types.ObjectId,
                            ref: "Employee",
                        }],
                    }]
                },
                createdBy: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
                type: {
                    type: String,
                    default: "create",
                    enum: [
                        "create",
                        "edit",
                    ],
                },
                note:{
                    type: String,
                },
                isSatisfied: {
                    type: Boolean,
                    default: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now(),
                },
            }],
            // Danh sách các tag cv và nhân sự phù hợp từng tag
            // tags: [{
            //     // tên của tag
            //     name: {
            //         type: String,
            //     },
            //     // mô tả tag
            //     description: {
            //         type: String
            //     },
            //     employees: [{
            //         type: Schema.Types.ObjectId,
            //         ref: "Employee",
            //     }]
            // }],
            // Danh sách các công việc trong hồ sơ đề xuất
            tasks: [{
                // mã công việc
                code: {
                    type: String,
                },
                // tên công việc
                taskName: {
                    type: String
                },
                // mô tả công việc
                taskDescription: {
                    type: String
                },
                // công việc tiền nhiệm (luu bằng code của công việc)
                preceedingTasks: [{
                    type: String
                }],
                // tag của cviec
                tag: [{
                    // type: String,
                    type: Schema.Types.ObjectId,
                    ref: "Tag",
                }],
                numberOfEmployees: {
                    type: Number,
                    default: 1,
                },
                suitableEmployees: [{
                    type: Schema.Types.ObjectId,
                    ref: "Employee",
                }],
                // nhân sự trực tiếp
                directEmployees: [{
                    type: Schema.Types.ObjectId,
                    ref: "Employee",
                }],
                // nhân sự dự phòng
                backupEmployees: [{
                    type: Schema.Types.ObjectId,
                    ref: "Employee",
                }],
                //thời gian ước lượng làm của task
                estimateTime: {
                    type: Number,
                },
                // Đơn vị thời gian của task
                unitOfTime: {
                    // có 3 đơn vị thời gian: Giờ, Ngày, Tháng
                    type: String,
                    default: "days",
                    enum: [
                        "hours",
                        "days",
                        "months",
                    ],
                },

                // // file hợp đồng đính kèm
                // files: [{
                //     fileName: {
                //         type: String,
                //     },
                //     url: {
                //         type: String
                //     }
                // }]
            }]
        }
    },
    {
        timestamps: true,
    }
);

module.exports = (db) => {
    if (!db.models || !db.models.BiddingPackage)
        return db.model("BiddingPackage", BiddingPackageSchema);
    return db.models.BiddingPackage;
};
