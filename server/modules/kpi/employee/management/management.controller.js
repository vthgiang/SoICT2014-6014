const overviewService = require('./management.service');
const { LogInfo, LogError } = require('../../../../logs');
// get all target of personal kpi
exports.getByMember = async (req, res) => {
    try {
        
        var kpipersonals = await overviewService.getByMember(req.params.member);
        LogInfo(req.user.email, ` get all target of personal kpi `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_kpi_by_member_success'],
            content: kpipersonals
        })
    } catch (error) {
        LogError(req.user.email, ` get all target of personal kpi `, req.user.company)
        res.status(400).json({
            success: false,
            messages : ['get_kpi_by_member_fail'],
            content: error
        })
    }
};

// lấy tất cả các kpi cá nhân của nhân viên trong công việc
exports.getKPIResponsible = async (req, res) => {
    try {
        var kpipersonals = await overviewService.getKPIResponsible(req.params.member);
        LogInfo(req.user.email, ` get all kpi personal `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_kpi_responsible_success'],
            content: kpipersonals
        });
    } catch (error) {
        LogError(req.user.email, ` get all kpi personal `, req.user.company);
        res.status(400).json({
            success : false,
            messages: ['get_kpi_responsible_fail'],
            content: error
        })
    }

};