const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng vị trí công việc
const CareerFieldSchema = new Schema({
    name: String,
    code: String, // lưu lại trong db của employees
    position: [{
        name: {
            type: String,
        },
        code: [{
            type: String,
        }],
        type: {
            type: Number,
            default: 0, // 1 - default, 0 - additional
        },
    }]
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.CareerField)
        return db.model('CareerField', CareerFieldSchema);
    return db.models.CareerField;
}