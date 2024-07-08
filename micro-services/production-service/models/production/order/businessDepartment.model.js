const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

// Cấu hình đơn vị kinh doanh
const BusinessDepartmentSchema = new Schema({
    organizationalUnit: {// Cơ cấu tổ chức
        type: Schema.Types.ObjectId,
        ref: "OrganizationalUnit"
    },
    role: {//Vai trò: 1. Bán hàng, 2: Quản lý bán hàng, 3. Kế toán
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