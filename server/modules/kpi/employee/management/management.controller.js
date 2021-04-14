const overviewService = require('./management.service')
const Logger = require(`../../../../logs`)
const EmployeeKpiSetService = require('../creation/creation.service')

const { getDataEmployeeKpiSetLog } = require('../../../../helpers/descriptionLogKpi')

/** Lấy tất cả tập kpi cá nhân của một nhân viên có trạng thái đã kết thúc */
exports.getAllKPIEmployeeSetsInOrganizationByMonth = async (req, res) => {

    if (req.query.type === "getChildTargetOfCurrentTarget") {
        this.getChildTargetByParentId(req, res);
    }
    else {
        try {
            let kpipersonals = await overviewService.getAllKPIEmployeeSetsInOrganizationByMonth(req.portal, req.query);

            Logger.info(req.user.email, ` get all kpi personal `, req.portal);
            res.status(200).json({
                success: true,
                messages: ['get_kpi_employee_in_department_by_month_success'],
                content: kpipersonals
            });
        } catch (error) {
            Logger.error(req.user.email, ` get all kpi personal `, req.portal);
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
        let query = {
            ...req.query,
            creator: req.user._id
        }
        let data = await overviewService.copyKPI(req.portal, req.params.id, query);
        
        // Thêm log
        let log = getDataEmployeeKpiSetLog({
            type: "copy_kpi_employee_to_employee",
            creator: req.user._id,
            organizationalUnit: data?.employeeKpiSet?.organizationalUnit, 
            month: data?.employeeKpiSet?.date,
            employee: data?.employeeKpiSet?.creator,
            newData: data?.employeeKpiSet,
            copyKpi: data?.copyKpi
        })
        await overviewService.createEmployeeKpiSetLogs(req.portal, {
            ...log,
            employeeKpiSetId: data?.employeeKpiSet?._id
        })

        // Thêm newsfeed
        await EmployeeKpiSetService.createNewsFeedForEmployeeKpiSet(req.portal, {
            ...log,
            organizationalUnit: data?.employeeKpiSet?.organizationalUnit,
            employeeKpiSet: data?.employeeKpiSet
        })
        
        Logger.info(req.user.email, ` get all kpi personal `, req.portal);
        res.status(200).json({
            success: true,
            messages: ['copy_employee_kpi_success'],
            content: data?.employeeKpiSet
        });
    } catch (error) {
        let messages = error && error.messages === 'employee_kpi_set_exist'
            ? ['employee_kpi_set_exist']
            : ['copy_employee_kpi_failure'];
        
        Logger.error(req.user.email, ` get all kpi personal `, req.portal);
        res.status(400).json({
            success: false,
            messages: messages,
            content: error
        })
    }

};

/** 
 * Lấy tất cả employeeKpi thuộc organizationalUnitKpi hiện tại 
 */
exports.getAllEmployeeKpiInOrganizationalUnit = async (req, res) => {
    try {
        let employeeKpis = await overviewService.getAllEmployeeKpiInOrganizationalUnit(req.portal, req.query.roleId, req.query.organizationalUnitId, req.query.month);

        Logger.info(req.user.email, ' get all employee kpi in organizational unit ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_employee_kpi_in_organizational_unit_success'],
            content: employeeKpis
        });
    } catch (error) {
        Logger.error(req.user.email, ' get all employee kpi in organizational unit ', req.portal);
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
        let employeeKpiSets = await overviewService.getAllEmployeeKpiSetInOrganizationalUnit(req.portal, req.query);

        Logger.info(req.user.email, ' get all employee kpi set in organizational unit ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_employee_kpi_set_in_organizational_unit_success'],
            content: employeeKpiSets
        })
    } catch (error) {
        Logger.error(req.user.email, ' get all employee kpi set in organizational unit ', req.portal);
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
        let employeeKpisInChildrenOrganizationalUnit = await overviewService.getAllEmployeeKpiInChildrenOrganizationalUnit(req.portal, req.query.roleId, req.query.month, req.query.organizationalUnitId);

        Logger.info(req.user.email, ' get all employee kpi set in organizational unit ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_all_employee_kpi_set_in_organizational_unit_success'],
            content: employeeKpisInChildrenOrganizationalUnit
        })
    } catch (error) {
        Logger.error(req.user.email, ' get all employee kpi set in organizational unit ', req.portal);
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
        let childTarget = await overviewService.getChildTargetByParentId(req.portal, req.query);

        Logger.info(req.user.email, ' get child target by parent id ', req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_child_target_by_parent_id_success'],
            content: childTarget
        });
    } catch (error) {
        Logger.error(req.user.email, ' get child target by parent id ', req.portal)
        res.status(400).json({
            success: false,
            messages: ['get_child_target_by_parent_id_fail'],
            content: error
        })
    }
}

/** Lấy logs kpi đơn vị */
exports.getEmployeeKpiSetLogs = async (req, res) => {
    try {
        let logs = await overviewService.getEmployeeKpiSetLogs(req.portal, req.params.id);
        
        await Logger.info(req.user.email, ` get logs employee kpi set `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_logs_employee_kpi_set_success'],
            content: logs
        })
    } catch (error) {
        await Logger.error(req.user.email, ` get logs employee kpi set `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['get_logs_employee_kpi_set_failure'],
            content: error
        })
    }
}