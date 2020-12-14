const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

// Bộ phận kinh doanh
const BusinessDepartmentSchema = new Schema({
    code: { // Mã phòng kinh doanh
        type: String,
        required: true
    },
    manager: { // Giám đốc kinh doanh (nếu có)
        type: Schema.Types.ObjectId,
        ref: "Role"
    },
    organizationalUnit: {// Phòng kinh doanh thuộc cơ cấu tổ chức nào
        type: Schema.Types.ObjectId,
        ref: "OrganizationalUnit"
    },
    status: { // Trạng thái phòng kinh doanh: 0. Không hoạt động || 1. Hoạt động bình thường
        type: Number,
        default: 1
    },
    description: { // Mô tả phòng kinh doanh
        type: String
    },
}, {
    timestamps: true
});

BusinessDepartmentSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.BusinessDepartment)
        return db.model('BusinessDepartment', BusinessDepartmentSchema);
    return db.models.BusinessDepartment;
}