const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ProjectPhaseSchema = new Schema(
    {
        // Chủ đề
        subject: {
            type: String
        },
        // Tên
        name: {
            type: String
        },
        // Dự án mà giai đoạn này thuộc về
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },
        // Mô tả
        description: {
            type: String,
        },
        // Ngày bắt đầu
        startDate: {
            type: Date,
        },
        // Ngày kết thúc
        endDate: {
            type: Date,
        },
        // Người tạo
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        progress: {
            type: Number,
            default: 0,
        },
        status: {
            // có 5 trạng thái : Đang thực hiện, Chờ phê duyệt, Đã hoàn thành, Tạm hoãn, Bị hủy
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
        // Ngân sách để chi cho giai đoạn
        budget: {
            type: Number,
        },
        // Ngân sách cho giai đoạn sau khi 1 change request được accept
        budgetChangeRequest: {
            type: Number,
        },
        // Thời điểm dự kiến bắt đầu giai đoạn sau khi 1 change request được accept
        startDateRequest: {
            type: Date,
        },
        // Thời điểm dự kiến kết thúc giai đoạn sau khi 1 change request được accept
        endDateRequest: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
);
ProjectPhaseSchema.plugin(mongoosePaginate);
module.exports = (db) => {
    if (!db.models.ProjectPhase) return db.model("ProjectPhase", ProjectPhaseSchema);
    return db.models.ProjectPhase;
};