const { LogInfo, LogError } = require('../../../../logs');
const DashboardService = require('./dashboard.service');
const { query } = require('express');

/**
 * Lấy tất cả KPI của nhân viên theo vai trò
 */
exports.getAllEmployeeKpiSetOfUnitByRole = async (req, res) => {
    if (req.query.role && req.query.ids) {
        getAllEmployeeKpiSetOfUnitByIds(req, res);
    }
    else {
         try {
        const employeeKpis = await DashboardService.getAllEmployeeKpiSetOfUnitByRole(req.query.role);
        await LogInfo(req.user.email, `GET_ALL_EMPLOYEE_KPI_SET`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_kpi_member_success'],
            content: employeeKpis
        });
        } catch (error) {
            await LogError(req.user.email, `GET_ALL_EMPLOYEE_KPI_SET`, req.user.company);
            res.status(400).json({
                messages: ['get_all_kpi_member_fail'],
                content: error
            });
        }
    }
   
};
/**
 * Lấy tất cả KPI của nhân viên theo mảng id đơn vị
 */
getAllEmployeeKpiSetOfUnitByIds = async (req, res) => {
    try {
        const employeeKpis = await DashboardService.getAllEmployeeKpiSetOfUnitByIds(req.query.ids);
        await LogInfo(req.user.email, `GET_ALL_EMPLOYEE_KPI_SET`, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_kpi_member_success'],
            content: employeeKpis
        });
    } catch (error) {
        await LogError(req.user.email, `GET_ALL_EMPLOYEE_KPI_SET`, req.user.company);
        res.status(400).json({
            messages: ['get_all_kpi_member_fail'],
            content: error
        });
    }
};