const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng vị trí công việc
const CareerPositionSchema = new Schema({
    name: String,
    code: String,
    
    package: [{
        type: String,
    }],
    description: [{
        action: {
            type: Schema.Types.ObjectId,
            ref: "CareerAction",
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
    if (!db.models.CareerPosition)
        return db.model('CareerPosition', CareerPositionSchema);
    return db.models.CareerPosition;
}