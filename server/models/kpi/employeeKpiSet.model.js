const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { OrganizationalUnit, User, EmployeeKpi } = require('../').schema;

// Model quản lý dữ liệu của một kpi cá nhân
const EmployeeKpiSetSchema = new Schema({
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: OrganizationalUnit,
        required: true
    },
    creator: {
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
    automaticPoint: {
        type: Number,
        default: null
    },
    employeePoint: {
        type: Number,
        default: null
    },
    approvedPoint: {
        type: Number,
        default: null
    },
    kpis: [{
        type: Schema.Types.ObjectId,
        ref: EmployeeKpi,
        required: true
    }]
}, {
    timestamps: true
});

module.exports = EmployeeKpiSet = mongoose.model("employee_kpi_sets", EmployeeKpiSetSchema);