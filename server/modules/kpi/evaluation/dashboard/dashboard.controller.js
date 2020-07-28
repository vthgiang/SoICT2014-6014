const { LogInfo, LogError } = require('../../../../logs');
const DashboardService = require('./dashboard.service');
const { query } = require('express');

/**
 * Lấy tất cả KPI của nhân viên theo mảng id đơn vị
 */

exports.getAllEmployeeKpiSetOfUnitByIds = async (req, res) => {
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