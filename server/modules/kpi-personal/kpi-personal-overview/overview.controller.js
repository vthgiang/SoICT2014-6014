const overviewService = require('./overview.service');

// get all target of personal kpi
exports.getByMember = (req, res) => {
    return overviewService.getByMember(req, res);
};

// lấy tất cả các kpi cá nhân của nhân viên trong công việc
exports.getKPIResponsible = (req, res) => {
    return overviewService.getKPIResponsible(req, res);
};