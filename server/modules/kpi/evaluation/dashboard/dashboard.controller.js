const { LogInfo, LogError } = require('../../../../logs');
const DashboardService = require('./dashboard.service');

// get all target of member kpi
exports.getAllEmployeeKpiSetOfUnit = async (req, res) => {

    try {
        const employeeKpis = await DashboardService.getAllEmployeeKpiSetOfUnit(req.params.role);
        await LogInfo(req.user.emai, `GET_ALL_EMPLOYEE_KPI_SET`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_kpi_member_success'],
            content: employeeKpis
        });
    } catch (error) {
        await LogError(req.user.emai, `GET_ALL_EMPLOYEE_KPI_SET`, req.user.company);
        res.status(400).json({
            messages: ['get_all_kpi_member_fail'],
            content: error
        });
    }
};

// get all employee
exports.getAllEmployeeOfUnit = async (req, res) => {

    try {
        const employees = await DashboardService.getAllEmployeeOfUnit(req.params.role);
        await LogInfo(req.user.emai, `GET_ALL_EMPLOYEE`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_employee_success'],
            content: employees
        });
    } catch (error) {
        await LogError(req.user.emai, `GET_ALL_EMPLOYEE`, req.user.company);
        res.status(400).json({
            messages: ['get_all_employee_fail'],
            content: error
        });
    }
};