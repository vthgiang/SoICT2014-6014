const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng vị trí công việc
const CareerPositionSchema = new Schema({
    name: String,
    code: String, // lưu lại trong db của employees hoặc hợp đồng
    
    otherNames: {
        type: String,
    },
    description: String  
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.CareerPosition)
        return db.model('CareerPosition', CareerPositionSchema);
    return db.models.CareerPosition;
}