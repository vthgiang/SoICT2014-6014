const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Bảng danh sách phiếu kiểm tra chất lượng sản phẩm
const ManufacturingQualityInspectionSchema = new Schema({
    code: { // Mã phiếu
        type: String,
        required: true
    },
    manufacturingCommand: { //  Lệnh sản xuất
        type: Schema.Types.ObjectId,
        ref: "ManufacturingCommand"
    },
    workOrder: {
        type: Schema.Types.ObjectId,
    },
    type: { // Loại kiểm tra, 1: Công đoạn, 2: Thành phẩm
        type: Number,
        required: true
    },
    responsible: { // Người phụ trách
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    criteria: { // Tiêu chí kiểm tra
        type: Schema.Types.ObjectId,
        ref: "ManufacturingQualityCriteria"
    },
    result: {
        inspectionNum: { // Số lượng kiểm tra
            type: Number,
            required: true
        },
        passedNum: { // Số lượng đạt
            type: Number,
            required: true
        },
        errorNum: { // Số lượng không đạt
            type: Number,
            required: true
        },
        errorList: [{ // Danh sách lỗi
            type: Schema.Types.ObjectId,
            ref: "ManufacturingQualityError"
        }],
        final: { // Kết quả kiểm tra, 1: Đạt, 2: Không đạt
            type: Number,
            required: true
        }
    },
}, {
    timestamps: true,
});

ManufacturingQualityInspectionSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ManufacturingQualityInspection)
        return db.model("ManufacturingQualityInspection", ManufacturingQualityInspectionSchema);
    return db.models.ManufacturingQualityInspection;
}
