const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

// Cấu hình đơn vị vận chuyển
const TransportDepartmentSchema = new Schema({
    organizationalUnit: {// Cơ cấu tổ chức
        type: Schema.Types.ObjectId,
        ref: "OrganizationalUnit"
    },
    role: {// Vai trò: 1. Quản lý vận chuyển, 2. Nhân viên vận chuyển
        type: Number,
        enum: [1, 2, ]
    }
}, {
    timestamps: true
});

// BusinessDepartmentSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.TransportDepartment)
        return db.model('TransportDepartment', TransportDepartmentSchema);
    return db.models.TransportDepartment;
}