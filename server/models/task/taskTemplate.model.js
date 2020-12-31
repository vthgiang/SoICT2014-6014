const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// Model quản lý dữ liệu của một mẫu công việc
const TaskTemplateSchema = new Schema(
    {
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
            // 1: Thấp, 2: Trung Bình, 3: Tiêu chuẩn, 4: Cao, 5: Khẩn cấp 
            type: Number,
        },
        numberOfDaysTaken: {
            type: Number,
            default: 1,
        },
        taskActions: [
            {
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
        },
        formula: {
            type: String,
        },
        status: {
            type: Boolean,
            default: false,
        },
        numberOfUse: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

TaskTemplateSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.TaskTemplate)
        return db.model("TaskTemplate", TaskTemplateSchema);
    return db.models.TaskTemplate;
};
