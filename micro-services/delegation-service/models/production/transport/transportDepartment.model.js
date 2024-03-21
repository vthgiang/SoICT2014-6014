const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

// Cấu hình đơn vị vận chuyển
const TransportDepartmentSchema = new Schema({
    organizationalUnit: {// Cơ cấu tổ chức
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnit'
    },
    type: [{
        roleTransport: { // Vai trò trong module vận chuyển: 1. Người phê duyệt, xếp lịch, 2. Người giám sát lịch trình, 3. Nhân viên vận chuyển
            type: Number,
            enum: [1,2,3]
        },
        roleOrganizationalUnit: [{ // Vai trò tương ứng trong organizationalUnit
            type: Schema.Types.ObjectId,
            ref: 'Role',
        }],
    }],
}, {
    timestamps: true
});

// BusinessDepartmentSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models || !db.models.TransportDepartment)
        return db.model('TransportDepartment', TransportDepartmentSchema);
    return db.models.TransportDepartment;
}
