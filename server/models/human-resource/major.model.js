const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng chuyên ngành tương đương
const MajorSchema = new Schema({
    name: {
        type: String, // tên của chuyên ngành cha
    },
    code: {
        type: String, // mã code
    },
    parents: [{
        type: Schema.Types.ObjectId,
        replies: this
    }]
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.Major)
        return db.model('Major', MajorSchema);
    return db.models.Major;
}