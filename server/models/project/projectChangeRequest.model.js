const mongoose = require("mongoose");
const { generateUniqueCode } = require("../../helpers/functionHelper");
const Schema = mongoose.Schema;

// Model quản lý thông tin của một công việc và liên kết với tài liệu, kết quả thực hiện công việc
const ProjectChangeRequestSchema = new Schema(
    {
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        // Tên dự án công việc thuộc về
        taskProject: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
        },
        baseline: {
            oldEndDate: {
                type: Date,
            },
            newEndDate: {
                type: Date,
            },
            oldCost: {
                type: Number,
            },
            newCost: {
                type: Number,
            },
        },
        type: {
            type: String,
            enum: [
                "normal",
                "add_task",
                "edit_task",
                "update_status_task",
            ],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        description: {
            type: String,
        },
        name: {
            type: String,
        },
        requestStatus: { // 0: chưa yêu cầu, 1: đang yêu cầu, 2: từ chối, 3: đồng ý
            type: Number,
            default: 0,
        },
        currentTask: {
            // Id của task bị ảnh hưởng
            task: {
                type: Schema.Types.ObjectId,
                ref: "Task",
            },
            organizationalUnit: {
                type: Schema.Types.ObjectId,
                ref: "OrganizationalUnit",
            },
            name: {
                type: String,
            },
            creator: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            description: {
                type: String,
            },
            // Tên dự án công việc thuộc về
            taskProject: {
                type: Schema.Types.ObjectId,
                ref: 'Project',
            },
            preceedingTasks: [
                {
                    task: {
                        type: Schema.Types.ObjectId,
                        ref: "Task",
                    },
                    link: {
                        type: String,
                    },
                },
            ],
            startDate: {
                type: Date,
            },
            endDate: {
                type: Date,
            },
            inactiveEmployees: [
                {
                    // Những người từng tham gia công việc nhưng không còn tham gia nữa
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            responsibleEmployees: [
                {
                    //người thực hiện
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            accountableEmployees: [
                {
                    //người phê duyệt
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
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
            // ngân sách để chi trả cho task đó
            budget: {
                type: Number,
            },
            // Danh sách thành viên tham gia task với lương của họ
            actorsWithSalary: [
                {
                    userId: {
                        type: Schema.Types.ObjectId,
                        ref: 'User',
                    },
                    salary: {
                        type: Number,
                    },
                    weight: {
                        type: Number,
                    },
                },
            ],
            // Trọng số tổng dành cho Thành viên Thực hiện
            totalResWeight: {
                type: Number,
            },
            estimateAssetCost: {
                type: Number,
            },
            // Giai đoạn
            taskPhase: {
                type: Schema.Types.ObjectId,
                ref: 'ProjectPhase'
            },
        },
        affectedTasksList: [
            {
                // Id của task bị ảnh hưởng
                task: {
                    type: Schema.Types.ObjectId,
                    ref: "Task",
                },
                old: {
                    // Tên dự án công việc thuộc về
                    taskProject: {
                        type: Schema.Types.ObjectId,
                        ref: 'Project',
                    },
                    status: {
                        // có 5 trạng thái công việc: Đang thực hiện, Chờ phê duyệt, Đã hoàn thành, Tạm hoãn, Bị hủy
                        type: String,
                        enum: [
                            "inprocess",
                            "wait_for_approval",
                            "finished",
                            "delayed",
                            "canceled",
                        ],
                    },
                    preceedingTasks: [
                        {
                            task: {
                                type: Schema.Types.ObjectId,
                                replies: this,
                            },
                            link: {
                                type: String,
                            },
                        },
                    ],
                    startDate: {
                        type: Date,
                    },
                    endDate: {
                        type: Date,
                    },
                    inactiveEmployees: [
                        {
                            // Những người từng tham gia công việc nhưng không còn tham gia nữa
                            type: Schema.Types.ObjectId,
                            ref: "User",
                        },
                    ],
                    responsibleEmployees: [
                        {
                            //người thực hiện
                            type: Schema.Types.ObjectId,
                            ref: "User",
                        },
                    ],
                    accountableEmployees: [
                        {
                            //người phê duyệt
                            type: Schema.Types.ObjectId,
                            ref: "User",
                        },
                    ],
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
                    // ngân sách để chi trả cho task đó
                    budget: {
                        type: Number,
                    },
                    // Danh sách thành viên tham gia task với lương của họ
                    actorsWithSalary: [
                        {
                            userId: {
                                type: Schema.Types.ObjectId,
                                ref: 'User',
                            },
                            salary: {
                                type: Number,
                            },
                            weight: {
                                type: Number,
                            },
                        },
                    ],
                    // Trọng số tổng dành cho Thành viên Thực hiện
                    totalResWeight: {
                        type: Number,
                    },
                    estimateAssetCost: {
                        type: Number,
                    },
                    // Giai đoạn
                    taskPhase: {
                        type: Schema.Types.ObjectId,
                        ref: 'ProjectPhase'
                    },
                },

                /** Từ phần dưới trở xuống là những trường có thể sẽ bị ảnh hưởng khi có changeRequest liên quan tới task này */
                new: {
                    name: {
                        type: String,
                    },
                    status: {
                        // có 5 trạng thái công việc: Đang thực hiện, Chờ phê duyệt, Đã hoàn thành, Tạm hoãn, Bị hủy
                        type: String,
                        enum: [
                            "inprocess",
                            "wait_for_approval",
                            "finished",
                            "delayed",
                            "canceled",
                        ],
                    },
                    // Tên dự án công việc thuộc về
                    taskProject: {
                        type: Schema.Types.ObjectId,
                        ref: 'Project',
                    },
                    preceedingTasks: [
                        {
                            task: {
                                type: Schema.Types.ObjectId,
                                replies: this,
                            },
                            link: {
                                type: String,
                            },
                        },
                    ],
                    startDate: {
                        type: Date,
                    },
                    endDate: {
                        type: Date,
                    },
                    inactiveEmployees: [
                        {
                            // Những người từng tham gia công việc nhưng không còn tham gia nữa
                            type: Schema.Types.ObjectId,
                            ref: "User",
                        },
                    ],
                    responsibleEmployees: [
                        {
                            //người thực hiện
                            type: Schema.Types.ObjectId,
                            ref: "User",
                        },
                    ],
                    accountableEmployees: [
                        {
                            //người phê duyệt
                            type: Schema.Types.ObjectId,
                            ref: "User",
                        },
                    ],
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
                    // ngân sách để chi trả cho task đó
                    budget: {
                        type: Number,
                    },
                    // Danh sách thành viên tham gia task với lương của họ
                    actorsWithSalary: [
                        {
                            userId: {
                                type: Schema.Types.ObjectId,
                                ref: 'User',
                            },
                            salary: {
                                type: Number,
                            },
                            weight: {
                                type: Number,
                            },
                        },
                    ],
                    // Trọng số tổng dành cho Thành viên Thực hiện
                    totalResWeight: {
                        type: Number,
                    },
                    estimateAssetCost: {
                        type: Number,
                    },
                    // Giai đoạn
                    taskPhase: {
                        type: Schema.Types.ObjectId,
                        ref: 'ProjectPhase'
                    },
                },

            }
        ]
    },
    {
        timestamps: true,
    }
);

module.exports = (db) => {
    if (!db.models.ProjectChangeRequest) return db.model("ProjectChangeRequest", ProjectChangeRequestSchema);
    return db.models.ProjectChangeRequest;
};
