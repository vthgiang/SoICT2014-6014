const overviewService = require('./management.service');
const { LogInfo, LogError } = require('../../../../logs');


/** Lấy tất cả tập kpi cá nhân của một nhân viên có trạng thái đã kết thúc */
exports.getAllKPIEmployeeSetsInOrganizationByMonth = async (req, res) => {
    if (!req.query.user && req.query.department && req.query.date){
        this.getChildTargetByParentId(req, res);
    }
    else {
        try {
            var kpipersonals = await overviewService.getAllKPIEmployeeSetsInOrganizationByMonth(req.query);
            LogInfo(req.user.email, ` get all kpi personal `, req.user.company);
            res.status(200).json({
                success: true,
                messages: ['get_kpi_employee_in_department_by_month_success'],
                content: kpipersonals
            });
        } catch (error) {
            LogError(req.user.email, ` get all kpi personal `, req.user.company);
            res.status(400).json({
                success: false,
                messages: ['get_kpi_responsible_fail'],
                content: error
            })
        }
    }
};

/**
 * Khởi tạo KPI tháng mới từ KPI tháng này trong trang quản lý KPI cá nhân
 */
exports.copyKPI = async (req, res) => {
    try {
        var kpipersonals = await overviewService.copyKPI(req.query);
        LogInfo(req.user.email, ` get all kpi personal `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['copy_KPI_success'],
            content: kpipersonals
        });
    } catch (error) {
        LogError(req.user.email, ` get all kpi personal `, req.user.company);
        res.status(400).json({
            success: false,
            messages: ['copy_KPI_fail'],
            content: error
        })
    }

};

/** 
 * Lấy tất cả employeeKpi thuộc organizationalUnitKpi hiện tại 
 */
exports.getAllEmployeeKpiInOrganizationalUnit = async (req, res) => {
    try {
        var employeeKpis = await overviewService.getAllEmployeeKpiInOrganizationalUnit(req.query);
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


/** 
 * Lấy employee KPI set của tất cả nhân viên 1 đơn vị trong 1 tháng
 */
exports.getAllEmployeeKpiSetInOrganizationalUnit = async (req, res) => {
    try {
        var employeeKpiSets = await overviewService.getAllEmployeeKpiSetInOrganizationalUnit(req.query);
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

/** 
 * Lấy tất cả EmployeeKpis thuộc các đơn vị con của đơn vị hiện tại 
 */
exports.getAllEmployeeKpiInChildrenOrganizationalUnit = async (req, res) => {
    try {
        var employeeKpisInChildrenOrganizationalUnit = await overviewService.getAllEmployeeKpiInChildrenOrganizationalUnit(req.user.company._id, req.query.roleId);
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


/* 
 *Lấy tất cả các mục tiêu con của mục tiêu hiện tại
 */
exports.getChildTargetByParentId = async (req, res) => {
    try {
        var childTarget = await overviewService.getChildTargetByParentId(req.query);
        LogInfo(req.user.email, ' get child target by parent id ', req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_child_target_by_parent_id_success'],
            content: childTarget
        });
    } catch (error) {
        LogError(req.user.email, ' get child target by parent id ', req.user.company)
        res.status(400).json({
            success: false,
            messages: ['get_child_target_by_parent_id_fail'],
            content: error
        })
    }
}