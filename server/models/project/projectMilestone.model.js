const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ProjectMilestoneSchema = new Schema(
    {
        // Tên
        name: {
            type: String
        },
        // Dự án mà cột mốc này thuộc về
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },
        // Giai đoạn mà cột mốc này thuộc về
        projectPhase: {
            type: Schema.Types.ObjectId,
            ref: 'ProjectPhase'
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
        //thời điểm thực kết thúc cột mốc
        actualEndDate: {
            type: Date,
        },
        //thời điểm thực bắt đầu cột mốc
        actualStartDate: {
            type: Date,
        },
        // Công việc tiền nhiệm
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
        // Cột mốc tiền nhiệm
        preceedingMilestones: [
            {
                type: Schema.Types.ObjectId,
                replies: this
            },
        ],
        // Người tạo
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        inactiveEmployees: [
            {
                // Những người từng tham gia nhưng không còn tham gia nữa
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
        consultedEmployees: [
            {
                //người tư vấn
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        informedEmployees: [
            {
                //người quan sát
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        confirmedByEmployees: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
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
        // Độ ưu tiên
        priority: {
            //
            // 1: Thấp, 2: Trung Bình, 3: Tiêu chuẩn, 4: Cao, 5: Khẩn cấp
            // Low, Average, Standard, High, Urgent
            type: Number,
            default: 3,
        },
    },
    {
        timestamps: true,
    }
);

ProjectMilestoneSchema.plugin(mongoosePaginate);
module.exports = (db) => {
    if (!db.models.ProjectMilestone) return db.model("ProjectMilestone", ProjectMilestoneSchema);
    return db.models.ProjectMilestone;
};