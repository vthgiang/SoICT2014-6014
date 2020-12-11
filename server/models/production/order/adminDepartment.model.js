const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

// Phòng kế toán bán hàng
const AdminDepartmentSchema = new Schema({
    code: { // Mã phòng kế toán bán hàng
        type: String,
        required: true
    },
    organizationalUnit: {// Phòng kế toán bán hàng thuộc cơ cấu tổ chức nào
        type: Schema.Types.ObjectId,
        ref: "OrganizationalUnit"
    },
    status: { // Trạng thái phòng kế toán: 0. Không hoạt động || 1. Hoạt động bình thường
        type: Number,
        default: 1
    },
    description: { // Mô tả phòng kế toán
        type: String
    },
}, {
    timestamps: true
});

AdminDepartmentSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.AdminDepartment)
        return db.model('AdminDepartment', AdminDepartmentSchema);
    return db.models.AdminDepartment;
}