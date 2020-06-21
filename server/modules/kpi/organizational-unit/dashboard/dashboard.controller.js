const { LogInfo, LogError } = require('../../../../logs');
const DashboardOrganizationalUnitService = require('./dashboard.service');

/** Lấy tất cả employeeKpi là con của organizationalUnitKpi hiện tại */
exports.getAllChildTargetOfOrganizationalUnitKpi = async (req, res) => {
    try {
        if(req.query) {
            var childTargets = await DashboardOrganizationalUnitService.getAllChildTargetOfOrganizationalUnitKpi(req.params.roleId, req.query.organizationalUnitId);
        } else {
            var childTargets = await DashboardOrganizationalUnitService.getAllChildTargetOfOrganizationalUnitKpi(req.params.roleId)
        }

        LogInfo(req.user.email, ' get all child target of organizational unit kpis ', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_child_target_by_parent_id_success'],
            content: childTargets
        });
    } catch (error) {
        LogError(req.user.email, ' get all child target of organizational unit kpis ', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_child_target_by_parent_id_failure'],
            content: error
        })
    }
}

/** Lấy tất cả task của organizationalUnit theo tháng hiện tại */
exports.getAllTaskOfOrganizationalUnit = async (req, res) => {
    try {
        if(req.query) {
            var tasks = await DashboardOrganizationalUnitService.getAllTaskOfOrganizationalUnit(req.params.roleId, req.query.organizationalUnitId);
        } else {
            var tasks = await DashboardOrganizationalUnitService.getAllTaskOfOrganizationalUnit(req.params.roleId);
        }
        
        LogInfo(req.user.email, ' get all task of organizational unit ', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_task_of_organizational_unit_success'],
            content: tasks
        })
    } catch (error) {
        LogError(req.user.email, ' get all task of organizational unit ', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_all_task_of_organizational_unit_failure'],
            content: error
        })
    }
}

/** Lấy danh sách các tập KPI đơn vị theo từng năm của từng đơn vị */
exports.getAllOrganizationalUnitKpiSetEachYear = async (req, res) => {
    try {
        var organizationalUnitKpiSets = await DashboardOrganizationalUnitService.getAllOrganizationalUnitKpiSetEachYear(req.params.organizationalUnitId, req.params.year);
        LogInfo(req.user.email, ' get all organizational unit kpi set each year ', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_organizational_unit_kpi_set_each_year_success'],
            content: organizationalUnitKpiSets
        })
    } catch (error) {
        LogError(req.user.email, ' get all organizational unit kpi set each year ', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_all_organizational_unit_kpi_set_each_year_failure'],
            content: error
        })
    }
}

/** Lấy danh sách các tập KPI đơn vị theo từng năm của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại */
exports.getAllOrganizationalUnitKpiSetEachYearOfChildUnit = async (req, res) => {
    try {
        var childOrganizationalUnitKpiSets = await DashboardOrganizationalUnitService.getAllOrganizationalUnitKpiSetEachYearOfChildUnit(req.user.company._id, req.params.roleId, req.params.year);
        LogInfo(req.user.email, ' get all organizational unit kpi set each year of child unit ', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_organizational_unit_kpi_set_each_year_of_child_success'],
            content: childOrganizationalUnitKpiSets
        })
    } catch (error) {
        LogError(req.user.email, ' get all organizational unit kpi set each year of child unit ', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_all_organizational_unit_kpi_set_each_year_of_child_failure'],
            content: error
        })
    }
}

/** Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng */
exports.getAllEmployeeKpiSetInOrganizationalUnit = async (req, res) => {
    try {
        var employeeKpiSets = await DashboardOrganizationalUnitService.getAllEmployeeKpiSetInOrganizationalUnit(req.params.roleId, req.params.month);
        LogInfo(req.user.email, ' get all employee kpi set in organizational unit ', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_employee_kpi_set_in_organizational_unit_success'],
            content: employeeKpiSets
        })
    } catch (error) {
        LogError(req.user.email, ' get all employee kpi set in organizational unit ', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_all_employee_kpi_set_in_organizational_unit_failure'],
            content: error
        })
    }
} 