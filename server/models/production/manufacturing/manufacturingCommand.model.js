const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

// Bảng lệnh sản xuất
const ManufacturingCommandSchema = new Schema({
    code: {// Mã lệnh sản xuất
        type: String,
        required: true
    },
    manufacturingPlan: { // Lệnh thuộc kế hoạch sản xuất nào
        type: Schema.Types.ObjectId,
        ref: "ManufacturingPlan"
    },
    manufacturingMill: { //  Lệnh được thực hiện ở xưởng nào
        type: Schema.Types.ObjectId,
        ref: "ManufacturingMill"
    },
    startDate: { // Ngày bắt đầu
        type: Date
    },
    endDate: { // Ngày kết thúc
        type: Date
    },
    startTurn: { // Ca bắt đầu
        type: Number
    },
    endTurn: { //  Ca kết thúc
        type: Number
    },
    good: { // Mặt hàng
        good: {
            type: Schema.Types.ObjectId,
            ref: "Good"
        },
        packingRule: {
            type: String
        },
        conversionRate: {
            type: Number
        },
        quantity: { // Số lượng
            type: Number
        },
    },
    creator: { // Người tạo
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // approvers: [{ // Danh sách người phê duyệt
    //     approver: { // Người phê duyệt
    //         type: Schema.Types.ObjectId,
    //         ref: "User"
    //     },
    //     approvedTime: { // Thời gian phê duyệt
    //         type: Date
    //     }
    // }],
    responsibles: [{ // Danh sách người thực hiện lệnh
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    accountables: [{ // Người giám sát lệnh
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    status: { //  Trạng thái lệnh sản xuất: 1. Chờ phê duyệt || 2. Lệnh đã duyệt || 3. Lệnh đang được thực thi || 4. Đã hoàn thành || 5. Đã hủy
        type: Number,
        default: 1
    },
    description: { // Mô tả về lệnh
        type: String
    }
}, {
    timestamps: true
});

ManufacturingCommandSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ManufacturingCommand)
        return db.model("ManufacturingCommand", ManufacturingCommandSchema);
    return db.models.ManufacturingCommand;
}