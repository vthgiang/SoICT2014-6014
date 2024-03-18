const mongoose = require('mongoose');
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
            ref: 'Project',
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
        //thời điểm thực kết thúc giai đoạn
        actualEndDate: {
            type: Date,
        },
        //thời điểm thực bắt đầu giai đoạn
        actualStartDate: {
            type: Date,
        },
        // Người tạo
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        inactiveEmployees: [
            {
                // Những người từng tham gia nhưng không còn tham gia nữa
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        responsibleEmployees: [
            {
                //người thực hiện
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        accountableEmployees: [
            {
                //người phê duyệt
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        consultedEmployees: [
            {
                //người tư vấn
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        informedEmployees: [
            {
                //người quan sát
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        confirmedByEmployees: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        progress: {
            type: Number,
            default: 0,
        },
        status: {
            // có 5 trạng thái : Đang thực hiện, Chờ phê duyệt, Đã hoàn thành, Tạm hoãn, Bị hủy
            type: String,
            default: 'inprocess',
            enum: [
                'inprocess',
                'wait_for_approval',
                'finished',
                'delayed',
                'canceled',
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
        // Ngân sách để chi cho giai đoạn
        budget: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);
ProjectPhaseSchema.plugin(mongoosePaginate);
module.exports = (db) => {
    if (!db.models || !db.models.ProjectPhase) return db.model('ProjectPhase', ProjectPhaseSchema);
    return db.models.ProjectPhase;
};
