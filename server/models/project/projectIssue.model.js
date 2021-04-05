const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ProjectIssueSchema = new Schema(
    { 
        codeName: {
            type: String,
        },
        task: {
            type: Schema.Types.ObjectId,
            ref: "ProjectTask",
        },
        subject: {
            type: String,
        },
        issueType: {
            type: Schema.Types.ObjectId,
            ref: "ProjectIssueType",
        },
        description: {
            type: String,
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
        priority: {
            // 1: Thấp, 2: Trung Bình, 3: Tiêu chuẩn, 4: Cao, 5: Khẩn cấp
            // Low, Average, Standard, High, Urgent
            type: Number,
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
        // người gây ra vấn đề phát sinh này
        madeBy: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
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
    },
    {
        timestamps: true,
    }
);
ProjectIssueSchema.plugin(mongoosePaginate);
module.exports = (db) => {
    if (!db.models.ProjectIssue) return db.model("ProjectIssue", ProjectIssueSchema);
    return db.models.ProjectIssue;
};