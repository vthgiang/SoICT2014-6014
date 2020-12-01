const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng vị trí công việc
const CareerPositionSchema = new Schema({
    name: String,
    code: String, // lưu lại trong db của employees
    description: [{
        name: {
            type: String,
        },
        // fieldCode: [{
        //     type: String,
        // }],
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
    if (!db.models.CareerPosition)
        return db.model('CareerPosition', CareerPositionSchema);
    return db.models.CareerPosition;
}