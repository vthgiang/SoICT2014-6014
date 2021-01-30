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
        parent: {
            type: Schema.Types.ObjectId,
            replies: this
        },
        description: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
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
        // Những người quả trị dự án
        projectManager: [{

            type: Schema.Types.ObjectId,
            ref: "User",

        }],
        // Những người tham gia dự án
        projectMembers: [{

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