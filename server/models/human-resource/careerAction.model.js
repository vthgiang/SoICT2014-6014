const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng hoạt động của công việc
const CareerActionSchema = new Schema({
    name: String,
    code: String, // lưu lại trong db của employees
    
    package: [{
        type: String,
    }],

    isLabel: { // mặc định khong phai nhan
        type: Number,
        default: 0,
    },
    
    label: [{
        type: Schema.Types.ObjectId,
        replies: this,
    }],

    detail: [{ // detail chỉ có thằng con có vidu: con là vận hành giám sát hệ thống attt thì label là vận hành và giám sát
        label: {
            type: Schema.Types.ObjectId,
            replies: this,
        },
        multi: {
            type: Number,
            default: 1, // 1 - true, 0 - false
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