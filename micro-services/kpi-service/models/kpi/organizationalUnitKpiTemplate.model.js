const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model quản lý các mục tiêu chi tiết của kpi đơn vị
const OrganizationalUnitKpiTemplateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    criteria: {
        type: String,
        required: true
    },
    // Chỉ tiêu Kpi
    target: {
        type: Number,
        default: null
    },
    // Đơn vị đo chỉ tiêu
    unit: {
        type: String
    },
});

module.exports = (db) => {
    if (!db.models.OrganizationalUnitKpiTemplate)
        return db.model('OrganizationalUnitKpiTemplate', OrganizationalUnitKpiTemplateSchema);
    return db.models.OrganizationalUnitKpiTemplate;
}

// Thuộc tính không đổi