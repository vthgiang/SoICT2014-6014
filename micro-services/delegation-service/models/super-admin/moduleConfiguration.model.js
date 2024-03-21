const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleConfigurationSchema = new Schema({
    // Cấu hình cho modul quản lý nhân sự
    humanResource: {
        contractNoticeTime: { // Thời gian nhắc hết hạn hợp đồng lao động
            type: Number,
        },

        timekeepingType: {
            type: String,
            enum: ['shift', 'hours', 'shift_and_hour'] // shift chấm công theo ca, hour chấm công theo giờ, chấm công theo ca và giờ
        },

        timekeepingByShift: {
            shift1Time: {
                type: Number,
            },
            shift2Time: {
                type: Number,
            },
            shift3Time: {
                type: Number,
            }
        },

        timekeepingByShiftAndHour: {
            type: String,
        }
    },
    // Cấu hình cho module quản lý đấu thầu
    bidding: {
        // công ty
        company: {
            type: String,
        },
        // địa chỉ
        address: {
            type: String,
        },
        // địa chỉ email
        email: {
            type: String,
        },
        // số đth
        phone: {
            type: String,
        },
        // mã số thuế
        taxCode: {
            type: String,
        },
        // người đại diện
        representative: {
            name: { // tên
                type: String,
            },
            role: { // chức vụ
                type: String,
            },
        },
        bank: { // Tài khoản ngân hàng
            name: { // tên ngân hàng
                type: String,
            },
            accountNumber: { // số tài khoản
                type: String,
            },
        },
    },
}, {
    timestamps: true
});

module.exports = (db) => {
    if (!db.models || !db.models.ModuleConfiguration)
        return db.model('ModuleConfiguration', ModuleConfigurationSchema);
    return db.models.ModuleConfiguration;
}
