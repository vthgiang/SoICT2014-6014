const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Department = require('./department.model');
const DetailKPIUnit = require('./detailKPIUnit.model');
const User = require('./user.model');

// Model cho chức năng quản lý KPI đơn vị
const KPIUnitSchema = new Schema({
    // Lưu thông tin đơn vị quản lý kpi này
    unit: {
        type: Schema.Types.ObjectId,
        ref: Department,
        required: true
    },
    // Lưu thông tin người thiết lập kpi
    creater: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    // KPi tháng nào
    time: {
        type: Date,
        required: true
    },
    // Danh sách các mục tiêu của kpi này
    listtarget: [{
        type: Schema.Types.ObjectId,
        ref: DetailKPIUnit,
        required: true
    }],
    result: {
        type: Number,
        default: 0
    },
    // Có 3 trang thái kpi đơn vị: 0: Đang thiết lập, 1: Đã kích hoạt, 2: Đã kết thúc
    status: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = KPIUnit = mongoose.model("kpiunits", KPIUnitSchema);