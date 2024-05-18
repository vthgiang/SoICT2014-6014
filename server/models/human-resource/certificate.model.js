const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

// Tạo bảng cho bằng cấp chứng chỉ
const CertificateSchema = new Schema(
    {
        name: {
            // tên bằng cấp
            type: String,
        },
        abbreviation: {
            // Tên viết tắt
            type: String,
        },
        description: {
            type: String,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
        },
        score: {
            type: Number,
        },
        majors: [
            {
                type: ObjectId,
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = (db) => {
    if (!db.models.Certificate) return db.model('Certificate', CertificateSchema);
    return db.models.Certificate;
};
