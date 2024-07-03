const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

// Bảng danh sách lỗi sản phẩm
const ManufacturingQualityCriteriaSchema = new Schema({
    code: { // Mã tiêu chí
        type: String,
        required: true
    },
    name: { // Tên lỗi
        type: String,
        required: true
    },
    goods: [{ // Sản phẩm
        type: Schema.Types.ObjectId,
        ref: "Good"
    }],
    operation: { // Công đoạn
        type: String,
        required: true
    },
    checklist: [{ // Danh sách kiểm tra
        name: { // Tên kiểm tra
            type: String
        },
        method: { // Phương pháp kiểm tra
            type: String
        },
        acceptedValue: { // Giá trị chấp nhận
            type: String
        }
    }],
    status: { // Trạng thái
        type: Number,
        default: 1
    },

    creator: { // Người báo cáo lỗi
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true,
});

ManufacturingQualityCriteriaSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ManufacturingQualityCriteria)
        return db.model("ManufacturingQualityCriteria", ManufacturingQualityCriteriaSchema);
    return db.models.ManufacturingQualityCriteria;
}
