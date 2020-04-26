const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require('../auth/user.model');
const EmployeeKpi = require('../kpi/employeeKpi.model');
const OrganizationalUnit = require('../super-admin/organizationalUnit.model');
const TaskTemplate = require('./taskTemplate.model');
const TaskFile = require('./taskFile.model');
const TaskResultInformation = require('./taskResultInformation.model');

// Model quản lý thông tin của một công việc và liên kết với tài liệu, kết quả thực hiện công việc
const TaskSchema = new Schema({
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: OrganizationalUnit,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    isArchived: { // Lưu kho hay không. Task lưu kho sẽ mặc định ẩn đi cho gọn giao diện, vì số task có thể rất lớn. Khi cần xem lại, phải chọn filter phù hợp và search
        type: Boolean,
        default: false,
        required: true
    },
    status: {// có 6 trạng thái công việc: Đang chờ, Đang thực hiện, Chờ phê duyệt, Đã hoàn thành, Bị hủy, Tạm hoãn
        // TODO {code{}, description{} }
        type: String,
        default: "Đang chờ",//
        required: true
    },
    taskTemplate: {
        type: Schema.Types.ObjectId,
        ref: TaskTemplate,
    },
    role: { // Bỏ, không cần thiết
        type: Schema.Types.ObjectId,
        ref: Role,
        required: true
    },
    parent: { // Công việc cha
        type: Schema.Types.ObjectId,
        replies: this
    },
    level: { // Không có cha -> level 1, có cha -> level 2, có ông -> level 3, ...
        type: Number,
        required: true
    },
    kpis:[{
        type: Schema.Types.ObjectId,
        ref: EmployeeKpi,
        required: true
    }],
    responsibleEmployees: [{
        type: Schema.Types.ObjectId,
        ref: User,
        required:  true
    }],
    accountableEmployees: [{
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    }],
    consultedEmployees: [{
        type: Schema.Types.ObjectId,
        ref: User
    }],
    informedEmployees: [{
        type: Schema.Types.ObjectId,
        ref: User
    }],
    time: { // Bỏ, không cần thiết
        type: Number,
        default: 0,
        required: true
    },
    progress: {
        type: Number,
        default: 0,
        required: true
    },
    point: {
        type: Number,
        default: -1,
        required: true
    },
    results: [{
        employee:{ // Người được đánh giá
            type: Schema.Types.ObjectId,
            ref: User,
            required: true
        },
        role:{ // người thực hiện: responsible, người hỗ trợ: consulted, người phê duyệt: accountable
            type: String,
            required: true
        },
        automaticPoint: { // Điểm hệ thống đánh giá
            type: Number,
            default: 0
        },
        employeePoint: { // Điểm tự đánh giá
            type: Number,
            default: 0
        },
        approvedPoint: { // Điểm được phê duyệt
            type: Number,
            default: 0
        }
    }],
    files: [{ // Các files đi kèm với công việc
        name: {
            type: String,
        },
        url: {
            type: String,
            required: true
        }
    }],
    resultInformations: [{ // Kết quả thực hiện công việc --> Bỏ
        type: Schema.Types.ObjectId,
        ref: TaskResultInformation,
    }],
    taskInformations: [{ // Khi tạo công việc theo mẫu, các giá trị này sẽ được copy từ mẫu công việc sang
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
        },
        value: {
            type: Schema.Types.Mixed,
        }
    }],
    taskActions: [{
        creator:{
            type:Schema.Types.ObjectId,
            ref : User,
            required:true
        },
        content:{
            type: String,
            required:true
        },
        createdAt:{
            type: Date,
            default: Date.now
        },
        updatedAt:{
            type: Date,
            default: Date.now
        },
        files: [{ // Các files đi kèm actions
            name: {
                type: String,
            },
            url: {
                type: String,
                required: true
            }
        }],
        evaluations:[{ // Đánh giá actions (Dù là người quản lý, phê duyệt, hỗ trợ, ai cũng có thể đánh giá, nhưng chỉ tính điểm của người phê duyệt)
            creator: {
                type: Schema.Types.ObjectId,
                ref: User,
                required: true
            },
            createdAt:{
                type: Date,
                default: Date.now
            },
            updatedAt:{
                type: Date,
                default: Date.now
            },
        }],
        comments: [{ // Comments của action
            creator: {
                type: Schema.Types.ObjectId,
                ref: User,
                required: true
            },
            content: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type : Date,
                default: Date.now
            },
            files: [{ // Các file đi kèm comments
                name: {
                    type: String,
                },
                url: {
                    type: String,
                    required: true
                }
            }],
        }],
    }],
    taskComments: [{ // Trao đổi trong tasks
        creator: {
            type: Schema.Types.ObjectId,
            ref: User,
            required: true
        },
        content: {
            type: String,
        },
        approved: {
            type: Number,
            default: 0,
            required: true
        },
        files: [{ // Các file đi kèm comments
            name: {
                type: String,
            },
            url: {
                type: String,
                required: true
            }
        }],
        comments: [{  // Comments của comment
            creator: {
                type: Schema.Types.ObjectId,
                ref: User,
                required: true
            },
            content: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type : Date,
                default: Date.now
            },
            files: [{ // Các file đi kèm comments
                name: {
                    type: String,
                },
                url: {
                    type: String,
                    required: true
                }
            }],
        }],
    }]
}, {
    timestamps: true
});

module.exports = Task = mongoose.model("tasks", TaskSchema);

/*
HƯỚNG DẪN:
1. Phân quyền cho các trường được edit:
Mô tả công việc: Thực hiện + quản lý
Phân định trách nhiệm: Quản lý
Liên kết mục tiêu: Người thực hiện
Ngày bắt đầu, kết thúc: Quản lý
Mức độ hoàn thành: Thực hiện + Quản lý
Thông tin công việc: Thực hiện + Quản lý
Thời gian quá hạn, thời gian làm việc, và các trường tự động khác: không ai được sửa

1. Thiết kế giao diện: tạo 3 component
Xem thông tin chung
Edit cho Quản lý
Edit cho Người thực hiện


3. Đánh giá điểm cho các vài trò
Điểm công việc được tính tự động (chưa kết thúc => mặc định là -1)
Có ba loại điểm: automaticPoint, employeePoint, approvedPoint lần lượt cho các đối tượng như sau:
Điểm cho người thực hiện: điểm công việc tự động + tự nhận + quản lý chấm. Ở đây sẽ suggest cho quản lý chấm điểm là (điểm công việc tự động + điểm thực hiện tự nhận)/2
Điểm hỗ trợ: điểm công việc tự động + tự nhận + quản lý chấm. Ở đây sẽ suggest cho quản lý chấm điểm là (điểm công việc tự động + điểm hỗ trợ tự nhận)/2
Điểm quản lý: điểm công việc tự động + tự nhận + (điểm công việc + điểm tự nhận)/2. Lưu ý approvedPoint của quản lý là (điểm công việc + điểm quản lý tự nhận)/2
Điểm quan sát: không có
Lưu ý: Tất cả các điểm đều được công khai
 */