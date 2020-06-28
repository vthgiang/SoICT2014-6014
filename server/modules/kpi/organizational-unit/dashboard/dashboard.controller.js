const { LogInfo, LogError } = require('../../../../logs');
const DashboardOrganizationalUnitService = require('./dashboard.service');

/** Lấy tất cả employeeKpi thuộc organizationalUnitKpi hiện tại */
exports.getAllEmployeeKpiInOrganizationalUnit = async (req, res) => {
    try {
        if(req.query) {
            var employeeKpis = await DashboardOrganizationalUnitService.getAllEmployeeKpiInOrganizationalUnit(req.params.roleId, req.query.organizationalUnitId);
        } else {
            var employeeKpis = await DashboardOrganizationalUnitService.getAllEmployeeKpiInOrganizationalUnit(req.params.roleId)
        }

        LogInfo(req.user.email, ' get all employee kpi in organizational unit ', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_employee_kpi_in_organizational_unit_success'],
            content: employeeKpis
        });
    } catch (error) {
        LogError(req.user.email, ' get all employee kpi in organizational unit ', req.user.company);
        res.status(400).json({
            success: false,
            messages: ['get_all_employee_kpi_in_organizational_unit_failure'],
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

/** Lấy danh sách các tập KPI đơn vị theo thời gian của từng đơn vị */
exports.getAllOrganizationalUnitKpiSetByTime = async (req, res) => {
    try {
        var organizationalUnitKpiSets = await DashboardOrganizationalUnitService.getAllOrganizationalUnitKpiSetByTime(req.params.organizationalUnitId, req.params.startDate, req.params.endDate);
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

/** Lấy danh sách các tập KPI đơn vị theo thời gian của các đơn vị là con của đơn vị hiện tại và đơn vị hiện tại */
exports.getAllOrganizationalUnitKpiSetByTimeOfChildUnit = async (req, res) => {
    try {
        var childOrganizationalUnitKpiSets = await DashboardOrganizationalUnitService.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(req.user.company._id, req.params.roleId, req.params.startDate, req.params.endDate);
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

/** Lấy tất cả employeeKpi thuộc các đơn vị con của đơn vị hiện tại */
exports.getAllEmployeeKpiInChildrenOrganizationalUnit = async (req, res) => {
    try {
        var employeeKpisInChildrenOrganizationalUnit = await DashboardOrganizationalUnitService.getAllEmployeeKpiInChildrenOrganizationalUnit(req.user.company._id, req.params.roleId);
        LogInfo(req.user.email, ' get all employee kpi set in organizational unit ', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_all_employee_kpi_set_in_organizational_unit_success'],
            content: employeeKpisInChildrenOrganizationalUnit
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