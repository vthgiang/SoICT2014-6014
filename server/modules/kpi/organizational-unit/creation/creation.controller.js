const KPIUnitService = require('./creation.service');
const { LogInfo, LogError } = require('../../../../logs');

/**
 * Lấy KPI đơn vị hiện tại qua vai trò
 */
exports.getByRole = async (req, res) => {
    try {
        var kpiunit = await KPIUnitService.getByRole(req.params.id);
        LogInfo(req.user.email, `Get kpi unit by role `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_kpiunit_by_role_success'],
            content: kpiunit
        })
    } catch (error) {
        LogError(req.user.email, `Get kpi unit by role `, req.user.company)
        res.status(400).json({
            success: false,
            messages: ['get_kpiunit_by_role_fail'],
            content: error
        })
    }
}

/**
 * Chỉnh sửa thông tin chung của KPI đơn vị
 */
exports.edit = async (req, res) => {
    try {
        let dateString = req.body.date;
        let id = req.params.id;
        var organizationalUnitKpiSet = await KPIUnitService.editById(dateString,id);
        LogInfo(req.user.email, ' Edit kpi unit ',req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_kpi_success'],
            content: organizationalUnitKpiSet,
        });
    } catch (error) {
        LogError(req.user.email, ' Edit kpi unit ',req.user.company);
        res.status(400).json({
            success: false,
            messages: ['edit_kpi_failure'],
            content: error
        })
    }
}

/**
 * Xóa KPI của đơn vị 
 */
exports.delete = async (req, res) => {
    try {
        var arr = await KPIUnitService.delete(req.params.id);
        kpiunit = arr[0];
        listTarget = arr[1];
        LogInfo(req.user.email, 'delete kpi unit',req.user.company)
        res.status(200).json({
            success: true,
            messages: ['delete_kpi_success'],
            content: {
                kpiunit: kpiunit,
                listtarget: listTarget
            }
        });
    } catch (error) {
        LogError(req.user.email, 'delete kpi unit',req.user.company)
        res.status(400).json({
            success: false,
            messages: ['delete_kpi_failure'],
            content: error
        })
    }

}

/**
 * Xóa mục tiêu của KPI đơn vị
 */
exports.deleteTarget = async (req, res) => {
    try {
        var organizationalUnitKpiSet = await KPIUnitService.deleteTarget(req.params.id,req.params.kpiunit);
        LogInfo(req.user.email, 'delete target kpi unit',req.user.company);
        res.status(200).json({
            success: true,
            messages: ['confirm_delete_target_success'],
            content: organizationalUnitKpiSet
        });
    } catch (error) {
        LogError(req.user.email, 'delete target kpi unit',req.user.company)
        res.status(400).json({
            success: false,
            messages: ['confirm_delete_target_failure'],
            content: error
        })
    } 
}

/**
 * Chỉnh sửa trạng thái của KPI đơn vị
 */
exports.editStatusKPIUnit =async (req, res) => {
    try {
        var kpiunit= await KPIUnitService.editStatusKPIUnit(req.params.id,req.params.status);
        LogInfo(req.user.email, 'edit status kpi unit',req.user.company)
        res.status(200).json({
            success: true,
            messages: ['confirm_edit_status_success'],
            content: kpiunit,
        });
    } catch (error) {
        LogError(req.user.email, 'edit status kpi unit',req.user.company)
        res.status(400).json({
            success: false,
            messages: ['confirm_edit_status_failure'],
            content: error
        })
    }
}

/**
 * Lấy KPI đơn vị của đơn vị cha
 */
exports.getParentByUnit =async (req, res) => {
    try {
        var kpiunit = await KPIUnitService.getParentByUnit(req.params.id);
        LogInfo(req.user.email, 'get parent kpi unit',req.user.company)
        res.status(200).json({
            success: true,
            messages: ['get_parent_by_unit_success'],
            content: kpiunit
        });
    } catch (error) {
        LogError(req.user.email, 'get parent kpi unit',req.user.company)
        res.status(400).json({
            success: false,
            messages: ['get_parent_by_unit_failure'],
            content: error
        })
    }

}

/**
 * Thêm mới mục tiêu của KPI đơn vị
 */
exports.createTarget =async (req, res) => {
    try {
        var organizationalUnitKpiSet = await  KPIUnitService.createTarget(req.body);
        LogInfo(req.user.email, 'create target kpi unit',req.user.company)
        res.status(200).json({
            success: true,
            messages: ['create_target_success'],
            content: organizationalUnitKpiSet,
        });
    } catch (error) {
        LogError(req.user.email, 'create target kpi unit',req.user.company)
        res.status(400).json({
            success: false,
            messages: ['create_target_failure'],
            content: error
        })
    }
}

/**
 * Chỉnh sửa mục tiêu của KPI đơn vị
 */
exports.editTargetById = async (req, res) => {
    try {
        var target = await KPIUnitService.editTargetById(req.body, req.params.id);
        LogInfo(req.user.email, 'edit target kpi unit',req.user.company)
        res.status(200).json({
            success: true,
            messages: ['edit_target_success'],
            content: target
        });
    } catch (error) {
        LogError(req.user.email, 'edit target kpi unit',req.user.company)
        res.status(400).json({
            success: false,
            messages: ['edit_target_failure'],
            content: error
        })
    }
 
}

/**
 * Khởi tạo KPI đơn vị
 */
exports.create =async (req, res) => {
    try {
        var organizationalUnitKpi = await KPIUnitService.create(req.body);
        LogInfo(req.user.email, 'create kpi unit',req.user.company)
        res.status(200).json({
            success: true,
            messages: ['create_organizational_unit_kpi_set_success'],
            content: organizationalUnitKpi,
        });
    } catch (error) {
        LogError(req.user.email, 'create kpi unit',req.user.company)
        res.status(400).json({
            success: false,
            messages: ['create_organizational_unit_kpi_set_failure'],
            content: error
        })
    }
 
}