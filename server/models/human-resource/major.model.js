const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tạo bảng chuyên ngành tương đương
const MajorSchema = new Schema(
    {
        name: {
            type: String, // tên của chuyên ngành cha
        },
        code: {
            type: String, // mã code
        },
        description: {
            type: String, // mã code
        }, // mã code
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
        },
        score: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = (db) => {
    if (!db.models.Major) return db.model('Major', MajorSchema);
    return db.models.Major;
};
