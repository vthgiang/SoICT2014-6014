const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

// Bảng danh sách lỗi sản phẩm
const ManufacturingQualityErrorSchema = new Schema({
    code: { // Mã lỗi
        type: String,
        required: true
    },
    group: { //  Nhóm lôi
        type: String,
        required: true,
        enum: ["man", "machine", "material", "measurement", "method", "enviroment"]
    },
    name: { // Tên lỗi
        type: String,
        required: true
    },
    description: { // Mô tả lỗi
        type: String
    },
    recognize: [{ // Cách nhận biết lỗi
        type: String
    }],
    resolution: [{ // Cách xử lý lỗi
        type: String
    }],
    cause: { // Nguyên nhân lỗi
        type: String
    },
    reporter: { // Người báo cáo lỗi
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    aql: { // AQL
        type: Number
    },
}, {
    timestamps: true,
});

ManufacturingQualityErrorSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ManufacturingQualityError)
        return db.model("ManufacturingQualityError", ManufacturingQualityErrorSchema);
    return db.models.ManufacturingQualityError;
}
