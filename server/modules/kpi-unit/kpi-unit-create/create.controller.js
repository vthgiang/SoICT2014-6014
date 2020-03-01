const KPIUnitService = require('./create.service');

// Lấy KPI đơn vị hiện tại qua vai trò
exports.getByRole = (req, res) => {
    return KPIUnitService.getByRole(req, res);
}

// Chỉnh sửa thông tin chung của kpi đơn vị
exports.edit = (req, res) => {
    return KPIUnitService.editById(req, res);
}

// xóa kpi đơn vị
exports.delete = (req, res) => {
    return KPIUnitService.delete(req, res);
}

// delete target of unit kpi
exports.deleteTarget = (req, res) => {
    return KPIUnitService.deleteTarget(req, res);
}

// Chỉnh sửa trạng thái của kpi đơn vị
exports.editStatusKPIUnit = (req, res) => {
    return KPIUnitService.editStatusKPIUnit(req, res);
}

// lấy KPI đơn vị của đơn vị cha
exports.getParentByUnit = (req, res) => {
    return KPIUnitService.getParentByUnit(req, res);
}

// create new target of unit kpi
exports.createTarget = (req, res) => {
    return KPIUnitService.createTarget(req, res);
}

// Chỉnh sửa mục tiêu của kpi đơn vị
exports.editTargetById = (req, res) => {
    return KPIUnitService.editTargetById(req, res);
}

// Khởi tạo KPI đơn vị
exports.create = (req, res) => {
    return KPIUnitService.create(req, res);
}