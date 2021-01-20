const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

// Bảng kế hoạch sản xuất
const ManufacturingPlanSchema = new Schema({
    code: { // Mã kế hoạch
        type: String,
        required: true
    },
    salesOrders: [{ //  Mã các đơn kinh doanh của kế hoạch
        type: Schema.Types.ObjectId,
        ref: "SalesOrder"
    }],
    manufacturingWorks: [{ // Kế hoạch thuộc những nhà máy nào
        type: Schema.Types.ObjectId,
        ref: "ManufacturingWorks"
    }],
    goods: [{ // Danh sách danh mục mặt hàng
        good: { // Mặt hàng
            type: Schema.Types.ObjectId,
            ref: "Good"
        },
        quantity: { // Số lượng sản xuất theo kế hoạch của mặt hàng
            type: Number
        }
    }],
    approvers: [{ // Danh sách người phê duyệt
        approver: { // Người phê duyệt
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        approvedTime: { // Thời gian phê duyệt
            type: Date
        }
    }],
    manufacturingCommands: [{ // Danh sách lệnh sản xuất của kế hoạch
        type: Schema.Types.ObjectId,
        ref: "ManufacturingCommand"
    }],
    creator: { // Người tạo kế hoạch
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: { // Trạng thái kế hoạch: 1. Đang chờ duyệt || 2. Đã phê duyệt || 3. Đang thực hiện || 4. Đã hoàn thành || 5. Đã hủy
        type: Number,
        default: 1
    },
    description: { //  Mô tả kế hoạch
        type: String
    },
    startDate: { // Ngày bắt đầu
        type: Date
    },
    endDate: { // Ngày dự kiến kết thúc
        type: Date
    },
    // logs: [{ // Ghi lại nhật ký chỉnh sửa kế hoạch
    //     creator: { // Người sửa
    //         type: Schema.Types.ObjectId,
    //         ref: "User"
    //     },
    //     title: { // Tiêu đề
    //         type: String
    //     },
    //     description: { // Mô tả nội dung chỉnh sửa
    //         type: String
    //     },
    //     createdAt: { // Thời gian sửa
    //         type: Date,
    //         default: Date.now
    //     }
    // }]
}, {
    timestamps: true,
});

ManufacturingPlanSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ManufacturingPlan)
        return db.model("ManufacturingPlan", ManufacturingPlanSchema);
    return db.models.ManufacturingPlan;
}