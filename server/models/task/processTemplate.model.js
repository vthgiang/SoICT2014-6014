const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProcessTemplateSchema = new Schema({
    xmlDiagram: {
        type: String,
    },
    processName: {
        type: String,
    },
    processDescription: {
        type: String,
    },
    viewer: [
        {
            type: Schema.Types.ObjectId,
            ref: "Role",
        },
    ],
    manager: [
        {
            type: Schema.Types.ObjectId,
            ref: "Role",
        },
    ],
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    tasks: [
        {
            code: {
                type: String,
            },
            organizationalUnit: {
                type: Schema.Types.ObjectId,
                ref: "OrganizationalUnit",
            },
            collaboratedWithOrganizationalUnits: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "OrganizationalUnit",
                },
            ],
            name: {
                type: String,
            },
            creator: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            priority: {
                // 1: Thấp, 2: Trung Bình, 3: Cao
                type: Number,
            },
            numberOfDaysTaken: {
                type: Number,
            },
            taskActions: [
                {
                    name: {
                        type: String,
                        required: true,
                    },
                    description: {
                        type: String,
                    },
                    mandatory: {
                        // Hoạt động này bắt buộc hay không?
                        type: Boolean,
                        default: true,
                    },
                    creator: {
                        type: Schema.Types.ObjectId,
                    },
                },
            ],
            taskInformations: [
                {
                    code: {
                        // Mã thuộc tính công việc dùng trong công thức
                        type: String,
                        required: true,
                    },
                    name: {
                        // Tên thuộc tính công việc
                        type: String,
                        required: true,
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
                            "text",
                            "boolean",
                            "date",
                            "number",
                            "set_of_values",
                        ],
                    },
                },
            ],
            readByEmployees: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Role",
                },
            ],
            responsibleEmployees: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            accountableEmployees: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            consultedEmployees: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            informedEmployees: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            description: {
                type: String,
                // required: true
            },
            formula: {
                type: String,
                default:
                    "progress / (daysUsed / totalDays) - 0.5 * (10 - (averageActionRating)) * 10",
            },
            status: {
                type: Boolean,
                default: false,
            },
            numberOfUse: {
                type: Number,
                default: 0,
            },
            preceedingTasks: [
                {
                    task: {
                        type: String,
                    },
                    link: {
                        type: String,
                    },
                },
            ],
            followingTasks: [
                {
                    task: {
                        type: String,
                    },
                    link: {
                        type: String,
                    },
                },
            ],
        },
    ],
    numberOfUse: {
        type: Number,
        default: 0,
    },
});

module.exports = (db) => {
    if (!db.models.ProcessTemplate)
        return db.model("ProcessTemplate", ProcessTemplateSchema);
    return db.models.ProcessTemplate;
};
