const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { generateUniqueCode } = require('../../helpers/functionHelper');
const mongoosePaginate = require('mongoose-paginate-v2');

const ProjectSchema = new Schema(
    {
        // code: {
        //     type: String,
        //     default: generateUniqueCode('PJ', 'v1')
        // },
        company: {
            //thuộc công ty nào
            type: Schema.Types.ObjectId,
            ref: "Company",
        },    
        projectTemplate: {
            type: Schema.Types.ObjectId,
            ref: "ProjectTemplate"
        },
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
        status: {
            // có 5 trạng thái công việc: Đang thực hiện, Chờ phê duyệt, Đã hoàn thành, Tạm hoãn, Bị hủy, Hồ sơ đề xuất
            type: String,
            default: "inprocess",
            enum: [
                "inprocess",
                "wait_for_approval",
                "finished",
                "delayed",
                "canceled",
                "proposal"
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
        budget: {
            type: Number,
        },
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
        // Ngân sách cho dự án sau khi 1 change request được accept
        budgetChangeRequest: {
            type: Number,
        },
        // Thời điểm dự kiến kết thúc dự án sau khi 1 change request được accept
        endDateRequest: {
            type: Date,
        },

        // Lấy dữ liệu users tham gia dự án (mỗi user tương ứng 1 employee và thuộc 1 unit, vì database thiết kế + hiện tại nên phải thêm cái này cho đỡ sửa nhiều ảnh hưởng)
        usersInProject: [{
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            unitId: {
                type: Schema.Types.ObjectId,
                ref: "OrganizationalUnit"
            },
            employeeId: {
                type: Schema.Types.ObjectId,
                ref: "Employee"
            }
        }],

        // Tài sản tham gia dự án
        assets: [{
            type: Schema.Types.ObjectId,
            ref: "Asset"
        }],

        kpiTarget: [{
            type: {
                type: Schema.Types.ObjectId,
                ref: "OrganizationalUnitKpi"
            },
            typeIndex: {
                type: Number
            },
            // Giá trị (0-1)
            targetKPIValue: {
                type: Number
            },
            assignValueInProject: {
                type: Number
            },
            targetValueInProject: {
                type: Number
            }
        }],

        tasks: [{
            type: Schema.Types.ObjectId,
            ref: "Task"
        }],

        proposals: {
            type: Schema.Types.Mixed
        },
        proposalLogs: {
            // logs
            oldVersion: {
                type: Schema.Types.Mixed,
            },
            newVersion: {
                type: Schema.Types.Mixed,
            },
        }
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