const managerService = require('./management.service');
const Logger = require(`../../../../logs`);


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