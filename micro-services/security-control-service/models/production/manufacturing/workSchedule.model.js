const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

// Bảng lịch làm việc
const WorkScheduleSchema = new Schema({
    user: { // Nhân viên
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    manufacturingMill: {// Xưởng
        type: Schema.Types.ObjectId,
        ref: "ManufacturingMill"
    },
    month: {// Tháng nào
        type: Date
    },
    turns: [[{// Mảng các ca làm việc. Mỗi ca lại là mảng các lệnh hoặc phần tử null
        type: Schema.Types.ObjectId,
        ref: "ManufacturingCommand",
        default: null
    }]]
}, {
    timestamps: true
});

WorkScheduleSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.WorkSchedule)
        return db.model("WorkSchedule", WorkScheduleSchema);
    return db.models.WorkSchedule;
}