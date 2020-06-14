const overviewService = require('./management.service');
const { LogInfo, LogError } = require('../../../../logs');

/** Lấy tất cả tập kpi cá nhân của một nhân viên */ 
exports.getAllEmployeeKpiSets = async (req, res) => {
    try {
        
        var kpipersonals = await overviewService.getAllEmployeeKpiSets(req.params.member);
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

/** Lấy tất cả tập kpi cá nhân của một nhân viên trong phòng ban theo tháng */ 
exports.getAllFinishedEmployeeKpiSets = async (req, res) => {
    try {
        var kpipersonals = await overviewService.getAllFinishedEmployeeKpiSets(req.params.member);
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

/** Lấy tất cả tập kpi cá nhân của một nhân viên có trạng thái đã kết thúc */ 
exports.getAllKPIEmployeeSetsInOrganizationByMonth = async (req, res) => {
    try {
        var kpipersonals = await overviewService.getAllKPIEmployeeSetsInOrganizationByMonth(req.params);
        LogInfo(req.user.email, ` get all kpi personal `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_kpi_employee_in_department_by_month_success'],
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

exports.copyKPI= async (req, res) => {
    try {
        var kpipersonals = await overviewService.copyKPI(req.params);
        LogInfo(req.user.email, ` get all kpi personal `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['copy_KPI_success'],
            content: kpipersonals
        });
    } catch (error) {
        LogError(req.user.email, ` get all kpi personal `, req.user.company);
        res.status(400).json({
            success : false,
            messages: ['copy_KPI_fail'],
            content: error
        })
    }

};