const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng vị trí công việc
const CareerFieldSchema = new Schema({
    name: String,
    code: String, // lưu lại trong db của employees
    position: [{
        position: {
            type: Schema.Types.ObjectId,
            ref: "CareerPosition",
        },
        multi: {
            type: Number, // 0: false, 1: true
            default: 1,
        }
    }]
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.CareerField)
        return db.model('CareerField', CareerFieldSchema);
    return db.models.CareerField;
}