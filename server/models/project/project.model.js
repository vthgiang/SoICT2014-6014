const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { generateUniqueCode } = require('../../helpers/functionHelper');
const mongoosePaginate = require('mongoose-paginate-v2');

const ProjectSchema = new Schema(
    {
        code: {
            type: String,
            default: generateUniqueCode('PJ', 'v1')
        },
        name: {
            type: String
        },
        description: {
            type: String,
        },
        parent: {
            type: Schema.Types.ObjectId,
            replies: this
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        actualEndDate: {
            type: Date,
        },
        // Chi phí ước lượng cho toàn bộ dự án
        estimatedCost: {
            type: Number,
        },
        // Đơn vị thời gian của project
        unitTime: {
            // có 2 đơn vị thời gian: Giờ, Ngày
            type: String,
            default: "hour",
            enum: [
                "hour",
                "day",
            ],
        },
        // Đơn vị tiền tệ của project
        unitCost: {
            // có 2 đơn vị chi phÍ: VND, USD
            type: String,
            default: "VND",
            enum: [
                "VND",
                "USD",
            ],
        },
        status: {
            // có 5 trạng thái công việc: Đang thực hiện, Chờ phê duyệt, Đã hoàn thành, Tạm hoãn, Bị hủy
            type: String,
            default: "inprocess",
            enum: [
                "inprocess",
                "wait_for_approval",
                "finished",
                "delayed",
                "canceled",
            ],
        },
        // Những người quản trị dự án
        projectManager: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        // Những người tham gia dự án
        responsibleEmployees: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
    },
    {
        timestamps: true,
    }
);
ProjectSchema.plugin(mongoosePaginate);
module.exports = (db) => {
    if (!db.models.Project) return db.model("Project", ProjectSchema);
    return db.models.Project;
};