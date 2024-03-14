const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { generateUniqueCode } = require('../../helpers/functionHelper');
const mongoosePaginate = require('mongoose-paginate-v2');

const ProjectTemplateSchema = new Schema(
    {
        name: {
            type: String
        },
        projectType: {
            // có 2 loại: 1: không ràng buộc, 2: phương pháp CPM
            type: Number,
            default: 1,
            enum: [1, 2],
        },
        description: {
            type: String,
        },
        numberOfUse: {
            type: Number,
            default: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        // startDate: {
        //     type: Date,
        // },
        // endDate: {
        //     type: Date,
        // },
        // Đơn vị thời gian của project
        unitOfTime: {
            // có 2 đơn vị thời gian: Giờ, Ngày
            type: String,
            default: 'days',
            enum: [
                'hours',
                'days',
            ],
        },
        // Đơn vị tiền tệ của project
        currenceUnit: {
            // có 2 đơn vị chi phÍ: VND, USD
            type: String,
            default: 'VND',
            enum: [
                'VND',
                'USD',
            ],
        },
        // Những người quản trị dự án
        projectManager: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        // Những người tham gia dự án
        responsibleEmployees: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        // Ngân sách để chi cho dự án
        budget: {
            type: Number,
        },

        // Những người tham gia dự án vói unit của họ - để tính toán lương
        responsibleEmployeesWithUnit: [{
            unitId: {
                type: Schema.Types.ObjectId,
                ref: 'OrganizationalUnit',
            },
            listUsers: [{
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                salary: {
                    type: Number,
                }
            }],
        }],

        // các công việc mẫu có trong mẫu dự án
        tasks: [{
            code: {
                type: String,
                default: generateUniqueCode('DXT_')
            },
            process: {
                type: Schema.Types.ObjectId,
                ref: 'TaskProcess',
            },
            numberOfDaysTaken: {
                type: Number,
            },
            // followingTasks: [
            //     {
            //         task: {
            //             type: Schema.Types.ObjectId,
            //             replies: this,
            //         },
            //         link: {
            //             type: String,
            //         },
            //         activated: {
            //             type: Boolean,
            //             default: false,
            //         },
            //     },
            // ],
            preceedingTasks: [{
                type: String
            }],
            organizationalUnit: {
                type: Schema.Types.ObjectId,
                ref: 'OrganizationalUnit',
            },
            collaboratedWithOrganizationalUnits: [
                {
                    organizationalUnit: {
                        type: Schema.Types.ObjectId,
                        ref: 'OrganizationalUnit',
                    },
                    isAssigned: {
                        type: Boolean,
                        default: false,
                    },
                },
            ],
            creator: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            name: {
                type: String,
            },
            description: {
                type: String,
            },
            tags: [{
                type: String
            }],
            // startDate: {
            //     type: Date,
            // },
            // endDate: {
            //     type: Date,
            // },
            priority: {
                //
                // 1: Thấp, 2: Trung Bình, 3: Tiêu chuẩn, 4: Cao, 5: Khẩn cấp
                // Low, Average, Standard, High, Urgent
                type: Number,
                default: 3,
            },
            parent: {
                // Công việc liên quan
                type: Schema.Types.ObjectId,
                replies: this,
            },
            level: {
                // Không có cha -> level 1, có cha -> level 2, có ông -> level 3, ...
                type: Number,
            },
            inactiveEmployees: [
                {
                    // Những người từng tham gia công việc nhưng không còn tham gia nữa
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
            responsibleEmployees: [
                {
                    //người thực hiện
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
            accountableEmployees: [
                {
                    //người phê duyệt
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
            consultedEmployees: [
                {
                    //người tư vấn
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
            informedEmployees: [
                {
                    //người quan sát
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
            formula: {
                type: String,
                default:
                    'progress / (daysUsed / totalDays) - (10 - averageActionRating) * 10',
            },

            taskInformations: [
                {
                    // Khi tạo công việc theo mẫu, các giá trị này sẽ được copy từ mẫu công việc sang
                    code: {
                        // Mã thuộc tính công việc dùng trong công thức
                        type: String,
                        required: true,
                    },
                    name: {
                        // Tên thuộc tính công việc
                        type: String,
                    },
                    description: {
                        type: String,
                    },
                    extra: {
                        // Cho kiểu dữ liệu tập giá trị, lưu lại các tập giá trị
                        type: String,
                    },
                    filledByAccountableEmployeesOnly: {
                        // Chỉ người phê duyệt được điền?
                        type: Boolean,
                        default: true,
                    },
                    type: {
                        type: String,
                        enum: [
                            'text',
                            'boolean',
                            'date',
                            'number',
                            'set_of_values',
                        ],
                    },
                    value: {
                        type: Schema.Types.Mixed,
                    },
                    isOutput: {
                        type: Boolean,
                        default: false,
                    },
                },
            ],
            taskActions: [
                {
                    // Khi task theo tempate nào đó, sẽ copy hết actions trong template vào đây
                    creator: {
                        // Trường này không bắt buộc. Khi người thực hiện task (loại task theo teamplate) xác nhận xong action thì mới điền id người đó vào trường này
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                    },
                    name: {
                        type: String,
                    },
                    description: {
                        type: String,
                    },
                    mandatory: {
                        // Hoạt động này bắt buộc hay không?
                        type: Boolean,
                        default: true,
                    },
                    createdAt: {
                        type: Date,
                        default: Date.now,
                    },
                    updatedAt: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
            //tên phase mà task thuộc về
            taskPhase: {
                type: Schema.Types.ObjectId,
                ref: 'ProjectPhase'
            },
            //thời gian ước lượng thông thường của task
            estimateNormalTime: {
                type: Number,
            },
            //thời gian ước lượng ít nhất để hoàn thành task
            estimateOptimisticTime: {
                type: Number,
            },
            //chi phí ước lượng thông thường của task
            estimateNormalCost: {
                type: Number,
            },
            //chi phí ước lượng nhiều nhất có thể cho phép của task
            estimateMaxCost: {
                type: Number,
            },
            //chi phí thực cho task đó
            actualCost: {
                type: Number,
            },
            //thời điểm thực kết thúc task đó
            actualEndDate: {
                type: Date,
            },
            // Danh sách thành viên tham gia công việc + lương tháng + trọng số thành viên trong công việc
            actorsWithSalary: [
                {
                    userId: {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                    },
                    salary: {
                        type: Number,
                    },
                    // Số lớn hơn 1
                    weight: {
                        type: Number,
                    },
                    actualCost: {
                        type: Number,
                    },
                },
            ],
            // Ước lượng chi phí tài sản
            estimateAssetCost: {
                type: Number,
            },
            // Trọng số tổng dành cho Thành viên Thực hiện - Số lớn hơn 1
            totalResWeight: {
                type: Number,
            },
            isFromCPM: {
                type: Boolean,
            },
            formulaProjectTask: {
                type: String,
                default:
                    'taskTimePoint + taskQualityPoint + taskCostPoint',
            },
            formulaProjectMember: {
                type: String,
                default:
                    'memberTimePoint + memberQualityPoint + memberCostPoint + memberTimedistributionPoint',
            },
            taskWeight: {
                // Số bé hơn 1
                timeWeight: {
                    type: Number,
                    default: 1 / 3,
                },
                // Số bé hơn 1
                qualityWeight: {
                    type: Number,
                    default: 1 / 3,
                },
                // Số bé hơn 1
                costWeight: {
                    type: Number,
                    default: 1 / 3,
                },
            },
            memberWeight: {
                // Số bé hơn 1
                timeWeight: {
                    type: Number,
                    default: 0.25,
                },
                // Số bé hơn 1
                qualityWeight: {
                    type: Number,
                    default: 0.25,
                },
                // Số bé hơn 1
                costWeight: {
                    type: Number,
                    default: 0.25,
                },
                // Số bé hơn 1
                timedistributionWeight: {
                    type: Number,
                    default: 0.25,
                },
            },
        }]
    },
    {
        timestamps: true,
    }
);
ProjectTemplateSchema.plugin(mongoosePaginate);
module.exports = (db) => {
    if (!db.models || !db.models.ProjectTemplate) {
        return db.model('ProjectTemplate', ProjectTemplateSchema);
    }
    return db.models.ProjectTemplate;
};
