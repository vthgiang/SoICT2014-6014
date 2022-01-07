const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng cho bằng cấp chứng chỉ
const CertificateSchema = new Schema({
    name: { // tên bằng cấp
        type: String,
    },
    abbreviation: { // Tên viết tắt
        type: String,
    },  
    majors: [{ //chuyên ngành
        type: Schema.Types.ObjectId,
        ref: "Major"
    }]
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.Certificate)
        return db.model('Certificate', CertificateSchema);
    return db.models.Certificate;
}