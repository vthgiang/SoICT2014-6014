const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Bảng xưởng sản xuất
const ManufacturingMillSchema = new Schema({
    code: { // Mã xưởng sản xuất
        type: String,
        required: true
    },
    name: { // Tên xưởng sản xuất
        type: String,
        required: true
    },
    manufacturingWorks: { // Nhà máy chứa xưởng
        type: Schema.Types.ObjectId,
        ref: 'ManufacturingWorks'
    },
    description: { // Mô tả xưởng
        type: String
    },
    workSchedules: [{// Lịch làm việc của xưởng
        year: Number, // Năm
        numberOfTurn: [{ // Mảng số ca [3, 3 ,3 ,3, 3 ...]
            type: Number
        }],
        stateOfTurn: [{ // Mảng trạng thái ca [Mã lệnh, null, null, Mã lệnh, Mã lệnh, ...]
            type: Schema.Types.ObjectId,
            ref: "ManufacturingCommand",
            default: null
        }]
    }]
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models.ManufacturingMill)
        return db.model('ManufacturingMill', ManufacturingMillSchema);
    return db.models.ManufacturingMill;
}