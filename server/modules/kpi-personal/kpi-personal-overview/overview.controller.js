const overviewService = require('./overview.service');

// get all target of personal kpi
exports.getByMember = (req, res) => {
    return overviewService.getByMember(req, res);
};