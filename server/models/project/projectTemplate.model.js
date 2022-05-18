const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { generateUniqueCode } = require('../../helpers/functionHelper');
const mongoosePaginate = require('mongoose-paginate-v2');

const ProjectTemplateSchema = new Schema(
    {
        name: {
            type: String
        },
        projectType: {
            // có 2 loại: 1: không ràng buộc, 2: phương pháp CPM
            type: Number,
            default: 1,
            enum: [1, 2],
        },
        description: {
            type: String,
        },
        // parent: {
        //     type: Schema.Types.ObjectId,
        //     replies: this
        // },
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
        // Đơn vị thời gian của project
        unitTime: {
            // có 2 đơn vị thời gian: Giờ, Ngày
            type: String,
            default: "hours",
            enum: [
                "hours",
                "days",
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
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        // Ngân sách để chi cho dự án
        // budget: {
        //     type: Number,
        // },

        // Những người tham gia dự án vói unit của họ - để tính toán lương
        responsibleEmployeesWithUnit: [{
            unitId: {
                type: Schema.Types.ObjectId,
                ref: 'OrganizationalUnit',
            },
            listUsers: [{
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
                salary: {
                    type: Number,
                }
            }],
        }],

        // // Ngân sách cho dự án sau khi 1 change request được accept
        // budgetChangeRequest: {
        //     type: Number,
        // },
        // // Thời điểm dự kiến kết thúc dự án sau khi 1 change request được accept
        // endDateRequest: {
        //     type: Date,
        // }

		// các công việc mẫu có trong mẫu dự án 
		tasks: [{
            code: {
                type: String,
            },
            name: {
                type: String,
            },
            preceedingTask: { // code của task tiền nhiệm
                type: String,
            },
            //thời gian ước lượng thông thường của task
            estimateNormalTime: {
                type: Number,
            },
            //thời gian ước lượng ít nhất để hoàn thành task
            estimateOptimisticTime: {
                type: Number,
            },
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
        }]
    },
    {
        timestamps: true,
    }
);
ProjectTemplateSchema.plugin(mongoosePaginate);
module.exports = (db) => {
    if (!db.models.ProjectTemplate) {
		return db.model("ProjectTemplate", ProjectTemplateSchema);
	}
    return db.models.ProjectTemplate;
};