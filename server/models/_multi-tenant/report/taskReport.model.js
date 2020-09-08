const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskReportSchema = new Schema({
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: 'organizational_units',
        required: true
    },
    taskTemplate: {
        type: Schema.Types.ObjectId,
        ref: 'task_templates',
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
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    readByEmployees: [{
        type: Schema.Types.ObjectId,
        ref: 'roles',
    }],
    responsibleEmployees: [{ //Người thực hiện
        type: Schema.Types.ObjectId,
        ref: 'users',
    }],
    accountableEmployees: [{// Người phê duyệt
        type: Schema.Types.ObjectId,
        ref: 'users',
    }],
    status: {// 0: tất cả, 1: Finished, 2: Inprocess.
        type: Number,
    },
    frequency: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    configurations: [{
        code: { // Mã thuộc tính công việc dùng trong công thức
            type: String,
        },
        name: { // Tên thuộc tính công việc
            type: String,
            required: true
        },
        extra: { // Cho kiểu dữ liệu tập giá trị, lưu lại các tập giá trị
            type: String
        },
        type: {
            type: String,
            enum: ['Text', 'Boolean', 'Date', 'Number', 'SetOfValues'],
        },
        filter: {
            type: String,
        },
        showInReport: {
            type: Boolean
        },
        newName: {
            type: String
        },
        aggregationType: { // 0: tính theo kiểu trung bình cộng, 1: tính theo kiểu tổng
            type: Number
        },
        charType: { // 0: Barchart, 1: Line Chart, 2: Pie chart,....
            type: Number
        }
    }],
    dataForAxisXInChart: [{// Chiều dữ liệu đưa vào biểu đồ
        id: {
            type: Number
        },
        name: {
            type: String
        }
    }]
}, {
    timestamps: true
});

module.exports = TaskReport = (db) => db.model("task_reports", TaskReportSchema);