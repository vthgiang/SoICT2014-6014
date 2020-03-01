const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Department = require('./department.model');
const User = require('./user.model');
const DetailKPIPersonal = require('./detailKPIPersonal.model');

// Model quản lý dữ liệu của một kpi cá nhân
const KPIPersonalSchema = new Schema({
    unit: {
        type: Schema.Types.ObjectId,
        ref: Department,
        required: true
    },
    creater: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    approver: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    // 0: Đang thiết lập,1: Chờ phê duyệt, 2: Đã kích hoạt, 3: Đã kết thúc
    status: {
        type: Number,
        default: 0
    },
    systempoint: {
        type: Number,
        default: null
    },
    mypoint: {
        type: Number,
        default: null
    },
    approverpoint: {
        type: Number,
        default: null
    },
    listtarget: [{
        type: Schema.Types.ObjectId,
        ref: DetailKPIPersonal,
        required: true
    }]
}, {
    timestamps: true
});

module.exports = KPIPersonal = mongoose.model("kpipersonals", KPIPersonalSchema);