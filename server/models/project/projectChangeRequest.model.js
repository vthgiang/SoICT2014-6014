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
        affectedTasksList: [
            {
                // Id của task bị ảnh hưởng
                task: {
                    type: Schema.Types.ObjectId,
                    ref: "Task",
                },
                // Tên dự án công việc thuộc về
                taskProject: { 
                    type: Schema.Types.ObjectId,
                    ref: 'Project'
                },
                // Tên phase mà task thuộc về
                taskPhase: {
                    type: Schema.Types.ObjectId,
                    ref: 'ProjectPhase'
                },
                old: {
                    followingTasks: [
                        {
                            task: {
                                type: Schema.Types.ObjectId,
                                replies: this,
                            },
                            link: {
                                type: String,
                            },
                            activated: {
                                type: Boolean,
                                default: false,
                            },
                        },
                    ],
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
                        },
                    ],
                    estimateAssetCost: {
                        type: Number,
                    },
                },
                
                /** Từ phần dưới trở xuống là những trường có thể sẽ bị ảnh hưởng khi có changeRequest liên quan tới task này */
                new: {
                    followingTasks: [
                        {
                            task: {
                                type: Schema.Types.ObjectId,
                                replies: this,
                            },
                            link: {
                                type: String,
                            },
                            activated: {
                                type: Boolean,
                                default: false,
                            },
                        },
                    ],
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
                        },
                    ],
                    estimateAssetCost: {
                        type: Number,
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
