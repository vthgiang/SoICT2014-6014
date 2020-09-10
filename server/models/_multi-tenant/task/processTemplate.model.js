const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProcessTemplateSchema = new Schema({
    xmlDiagram: {
        type: String,
    },
    processName: {
        type: String
    },
    processDescription: {
        type: String
    },
    viewer: [{
        type: Schema.Types.ObjectId,
        ref: 'roles',
    }],
    manager: [{
        type: Schema.Types.ObjectId,
        ref: 'roles',
    }],
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
    tasks: [{
        code: {
            type: String,
        },
        organizationalUnit: {
            type: Schema.Types.ObjectId,
            ref: OrganizationalUnit,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        priority: { // 1: Thấp, 2: Trung Bình, 3: Cao
            type: Number,
            required: true
        },
        numberOfDaysTaken: {
            type: Number,
        },
        taskActions: [{
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            mandatory: { // Hoạt động này bắt buộc hay không?
                type: Boolean,
                default: true,
                required: true
            },
            creator: {
                type: Schema.Types.ObjectId,
            }
        }],
        taskInformations: [{
            code: { // Mã thuộc tính công việc dùng trong công thức
                type: String,
                required: true
            },
            name: { // Tên thuộc tính công việc
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            extra: { // Cho kiểu dữ liệu tập giá trị, lưu lại các tập giá trị
                type: String
            },
            filledByAccountableEmployeesOnly: { // Chỉ người phê duyệt được điền?
                type: Boolean,
                default: true,
                required: true
            },
            type: {
                type: String,
                required: true,
                enum: ['Text', 'Boolean', 'Date', 'Number', 'SetOfValues'],
            }
        }],
        readByEmployees: [{
            type: Schema.Types.ObjectId,
            ref: 'roles',
            required: true
        }],
        responsibleEmployees: [{
            type: Schema.Types.ObjectId,
            ref: 'users'
        }],
        accountableEmployees: [{
            type: Schema.Types.ObjectId,
            ref: 'users'
        }],
        consultedEmployees: [{
            type: Schema.Types.ObjectId,
            ref: 'users'
        }],
        informedEmployees: [{
            type: Schema.Types.ObjectId,
            ref: 'users'
        }],
        description: {
            type: String,
            required: true
        },
        formula: {
            type: String,
            required: true,
            default: "progress / (dayUsed / totalDay) - 0.5 * (10 - (averageActionRating)) * 10",
        },
        status: {
            type: Boolean,
            default: false,
            required: true
        },
        numberOfUse: {
            type: Number,
            default: 0,
            required: true
        },
        preceedingTasks: [{
            task: {
                type: String,
            },
            link: {
                type: String
            }
        }],
        followingTasks: [{
            task: {
                type: String,
            },
            link: {
                type: String
            }
        }],
    }],
    numberOfUse: {
        type: Number,
        default: 0,
        required: true
    },
});

module.exports = ProcessTemplate = (db) => db.model("process_templates", ProcessTemplateSchema);