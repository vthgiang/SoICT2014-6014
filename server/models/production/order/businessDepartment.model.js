const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

// Bộ phận kinh doanh
const BusinessDepartmentSchema = new Schema({
    code: { // Mã phòng kinh doanh
        type: String,
        required: true
    },
    managers: [{ // Người phụ trách (tổng giám đốc, giám đốc, phó giám đốc...) (nếu có)
        type: Schema.Types.ObjectId,
        ref: "Role"
    }],
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
    type: {//1: Bộ phận kinh doanh, 2: Bộ phận kế toán, 3: Bộ phận thu mua nguyên vật liệu
        type: Number,
        enum: [1, 2, 3]
    }
}, {
    timestamps: true
});

BusinessDepartmentSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.BusinessDepartment)
        return db.model('BusinessDepartment', BusinessDepartmentSchema);
    return db.models.BusinessDepartment;
}