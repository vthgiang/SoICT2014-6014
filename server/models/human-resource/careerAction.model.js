const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng hoạt động của công việc
const CareerActionSchema = new Schema({
    name: String,
    code: String, // lưu lại trong db của employees
    package: String,
    detail: [{
        name: {
            type: String,
        },
        code: {
            type: String,
        },
        type: {
            type: Number,
            default: 0, // 1 - default, 0 - additional
        },
    }]
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.CareerAction)
        return db.model('CareerAction', CareerActionSchema);
    return db.models.CareerAction;
}