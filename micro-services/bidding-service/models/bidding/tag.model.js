const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng danh mục thẻ - nhân sự
const TagSchema = new Schema({
    // tên của tag
    name: {
        type: String,
    },
    // mô tả tag
    description: {
        type: String
    },
    // danh sách nhấn sự phù hợp với tag
    employees: [{
        type: Schema.Types.ObjectId,
        ref: "Employee",
    }],
    // danh sách nhân sự và độ phù hợp của nhân sự với tag
    employeeWithSuitability: [{
        employee: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
        },
        // độ phù hợp
        suitability: {
            type: Number,
            default: 5,
        }
    }]
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models || !db.models.Tag)
        return db.model('Tag', TagSchema);
    return db.models.Tag;
}
