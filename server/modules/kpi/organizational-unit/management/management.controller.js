const managerService = require('./management.service')
const KPIUnitService = require('../creation/creation.service')
const EmployeeKpiSetService = require('../../employee/creation/creation.service')
const overviewService = require('../../employee/management/management.service')

const Logger = require(`../../../../logs`)

const { getDataOrganizationalUnitKpiSetLog, getDataEmployeeKpiSetLog } = require('../../../../helpers/descriptionLogKpi')

/**
 * Copy KPI đơn vị từ một tháng cũ sang tháng mới
 * @param {*} req 
 * @param {*} res 
 */
exports.copyKPI = async (req, res) => {
    if (req.query.type === 'copy-parent-kpi-to-employee') {
        copyParentKPIUnitToChildrenKPIEmployee(req, res);
    } else if (req.query.datenew.length) {
        this.copyKPIForRange(req, res)
    } else {
        try {
            let query = {
                ...req.query,
                creator: req.user._id
            }
            let data = await managerService.copyKPI(req.portal, req.params.id, query);

            // Thêm log
            let log = getDataOrganizationalUnitKpiSetLog({
                type: "copy_kpi_unit_to_unit",
                creator: req.user._id,
                organizationalUnit: data?.kpiunit?.organizationalUnit,
                month: data?.kpiunit?.date,
                newData: data?.kpiunit,
                copyKpi: data?.copyKpi
            })
            await managerService.createOrganizationalUnitKpiSetLogs(req.portal, {
                ...log,
                organizationalUnitKpiSetId: data?.kpiunit?._id
            })

            // Thêm newsfeed
            await KPIUnitService.createNewsFeedForOrganizationalUnitKpiSet(req.portal, {
                ...log,
                organizationalUnit: data?.kpiunit?.organizationalUnit,
                organizationalUnitKpiSetId: data?.kpiunit?._id
            })

            Logger.info(req.user.email, ' copy kpi unit ', req.portal)
            res.status(200).json({
                success: true,
                messages: ['copy_kpi_unit_success'],
                content: data?.kpiunit
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
 * Copy KPI đơn vị từ một tháng cũ sang tháng mới
 * @param {*} req 
 * @param {*} res 
 */
exports.copyKPIForRange = async (req, res) => {
    try {
        let query = {
            ...req.query,
            creator: req.user._id
        }
        let kpi = [];

        for (let i = 0; i < query.datenew.length; i++) {
            let queryData = {
                ...query,
                datenew: query.datenew[i]
            }
            let data = await managerService.copyKPI(req.portal, req.params.id, queryData);

            kpi.push(data)

            // Thêm log
            let log = getDataOrganizationalUnitKpiSetLog({
                type: "copy_kpi_unit_to_unit",
                creator: req.user._id,
                organizationalUnit: data?.kpiunit?.organizationalUnit,
                month: data?.kpiunit?.date,
                newData: data?.kpiunit,
                copyKpi: data?.copyKpi
            })
            await managerService.createOrganizationalUnitKpiSetLogs(req.portal, {
                ...log,
                organizationalUnitKpiSetId: data?.kpiunit?._id
            })

            // Thêm newsfeed
            await KPIUnitService.createNewsFeedForOrganizationalUnitKpiSet(req.portal, {
                ...log,
                organizationalUnit: data?.kpiunit?.organizationalUnit,
                organizationalUnitKpiSetId: data?.kpiunit?._id
            })

            Logger.info(req.user.email, ' copy kpi unit ', req.portal)
        }

        res.status(200).json({
            success: true,
            messages: ['copy_kpi_unit_success'],
            content: kpi[0].kpiunit
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

/**
 * Copy KPI đơn vị sang KPI nhân viên
 * @param {*} req 
 * @param {*} res 
 */
copyParentKPIUnitToChildrenKPIEmployee = async (req, res) => {
    try {
        let query = {
            ...req.query,
            creator: req.user._id
        }
        let data = await managerService.copyParentKPIUnitToChildrenKPIEmployee(req.portal, req.params.id, query);

        // Thêm log
        let log = getDataEmployeeKpiSetLog({
            type: "copy_kpi_unit_to_employee",
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

        Logger.info(req.user.email, ' copy kpi unit ', req.portal)
        res.status(200).json({
            success: true,
            messages: ['copy_kpi_unit_success'],
            content: data?.employeeKpiSet
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

        for (let i = 0; i < kpiUnit.length; i++) {
            // Thêm log
            let log = getDataOrganizationalUnitKpiSetLog({
                type: "set_point_all",
                creator: req.user._id,
                organizationalUnit: kpiUnit?.[i]?.kpiUnitSet?.organizationalUnit,
                month: kpiUnit?.[i]?.kpiUnitSet?.date,
                newData: kpiUnit?.[i]?.kpiUnitSet
            })
            await managerService.createOrganizationalUnitKpiSetLogs(req.portal, {
                ...log,
                organizationalUnitKpiSetId: kpiUnit?.[i]?.kpiUnitSet?._id
            })

            // Thêm newsfeed
            await KPIUnitService.createNewsFeedForOrganizationalUnitKpiSet(req.portal, {
                ...log,
                organizationalUnit: kpiUnit?.[i]?.kpiUnitSet?.organizationalUnit,
                organizationalUnitKpiSetId: kpiUnit?.[i]?.kpiUnitSet?._id
            })
        }

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