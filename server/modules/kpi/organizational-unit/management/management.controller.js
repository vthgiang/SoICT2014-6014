const managerService = require('./management.service')
const KPIUnitService = require('../creation/creation.service')
const Logger = require(`../../../../logs`)

const { getDataOrganizationalUnitKpiSetLog } = require('../../../../helpers/descriptionLogKpi')

/**
 * Copy KPI đơn vị từ một tháng cũ sang tháng mới
 * @param {*} req 
 * @param {*} res 
 */
exports.copyKPI = async (req, res) => {
    if (req.query.type === 'copy-parent-kpi-to-employee') {
        copyParentKPIUnitToChildrenKPIEmployee(req, res);
    } else {
        try {
            let data = {
                ...req.query,
                creator: req.user._id
            }
            let kpiunit = await managerService.copyKPI(req.portal, req.params.id, data);
            
            Logger.info(req.user.email, ' copy kpi unit ', req.portal)
            res.status(200).json({
                success: true,
                messages: ['copy_kpi_unit_success'],
                content: kpiunit
            });
        } catch (error) {
            let messages = error && error.messages === 'organizatinal_unit_kpi_set_exist'
                ? ['organizatinal_unit_kpi_set_exist']
                : ['copy_kpi_unit_failure'];
    
            Logger.error(req.user.email, ' copy kpi unit ', req.portal)
            res.status(400).json({
                success: false,
                messages: messages,
                content: error
            })
        }   
    }
}

/**
 * Copy KPI đơn vị sang KPI nhân viên
 * @param {*} req 
 * @param {*} res 
 */
copyParentKPIUnitToChildrenKPIEmployee = async (req, res) => {
    try {
        let data = {
            ...req.query,
            creator: req.user._id
        }
        let emloyeeKpiSet = await managerService.copyParentKPIUnitToChildrenKPIEmployee(req.portal, req.params.id, data);
        
        Logger.info(req.user.email, ' copy kpi unit ', req.portal)
        res.status(200).json({
            success: true,
            messages: ['copy_kpi_unit_success'],
            content: emloyeeKpiSet
        });
    } catch (error) {
        let messages = error && error.messages === 'employee_kpi_set_exist'
            ? ['employee_kpi_set_exist']
            : ['copy_kpi_unit_failure'];

        Logger.error(req.user.email, ' copy kpi unit ', req.portal)
        res.status(400).json({
            success: false,
            messages: messages,
            content: error
        })
    }
}


exports.calculateKpiUnit = async (req, res) => {
    try {
        let kpiUnit = await managerService.calculateKpiUnit(req.portal, req.body);
       
        // Thêm log
        let log = getDataOrganizationalUnitKpiSetLog({
            type: "set_point_all",
            creator: req.user._id,
            organizationalUnit: kpiUnit?.kpiUnitSet?.organizationalUnit, 
            month: kpiUnit?.kpiUnitSet?.date,
            newData: kpiUnit?.kpiUnitSet
        })
        await managerService.createOrganizationalUnitKpiSetLogs(req.portal, {
            ...log,
            organizationalUnitKpiSetId: kpiUnit?.kpiUnitSet?._id
        })

        // Thêm newsfeed
        await KPIUnitService.createNewsFeedForOrganizationalUnitKpiSet(req.portal, {
            ...log,
            organizationalUnit: kpiUnit?.kpiUnitSet?.organizationalUnit,
            organizationalUnitKpiSetId: kpiUnit?.kpiUnitSet?._id
        })
        
        Logger.info(req.user.email, ' calculate kpi unit ', req.portal)
        res.status(200).json({
            success: true,
            messages: ['calculate_kpi_unit_success'],
            content: kpiUnit
        });
    } catch (error) {
        Logger.error(req.user.email, ' calculate kpi unit ', req.portal)
        res.status(400).json({
            success: false,
            messages: ['calculate_kpi_unit_failure'],
            content: error
        })
    }
}

/** Lấy logs kpi đơn vị */
exports.getOrganizationalUnitKpiSetLogs = async (req, res) => {
    try {
        let logs = await managerService.getOrganizationalUnitKpiSetLogs(req.portal, req.params.id);
        
        await Logger.info(req.user.email, ` delete file child comment `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['delete_file_comment_success'],
            content: logs
        })
    } catch (error) {
        await Logger.error(req.user.email, ` get logs unit kpi set  `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['get_logs_unit_kpi_set'],
            content: error
        })
    }
}

/** Lấy logs kpi đơn vị */
exports.getOrganizationalUnitKpiSetLogs = async (req, res) => {
    try {
        let logs = await managerService.getOrganizationalUnitKpiSetLogs(req.portal, req.params.id);
        
        await Logger.info(req.user.email, ` get logs organizational unit kpi set `, req.portal)
        res.status(200).json({
            success: true,
            messages: ['get_logs_unit_kpi_set_success'],
            content: logs
        })
    } catch (error) {
        await Logger.error(req.user.email, ` get logs organizational unit kpi set  `, req.portal)
        res.status(400).json({
            success: true,
            messages: ['get_logs_unit_kpi_set_failure'],
            content: error
        })
    }
}