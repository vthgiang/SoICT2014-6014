const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng lĩnh vực công việc
const CareerFieldSchema = new Schema({
    name: {
        type: String, // tên của lĩnh vực
    },

    code: {
        type: String, // mã code
    },
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