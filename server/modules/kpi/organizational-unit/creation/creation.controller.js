const KPIUnitService = require('./creation.service');
const { LogInfo, LogError } = require('../../../../logs');

/**
 * Lấy tập KPI đơn vị của đơn vị ứng với role người dùng
 */
exports.getOrganizationalUnitKpiSet = async (req, res) => {
    try {
        var kpiunit = await KPIUnitService.getOrganizationalUnitKpiSet(req.params.id);
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
 * Chỉnh sửa thông tin chung của tập KPI đơn vị
 */
exports.editOrganizationalUnitKpiSet = async (req, res) => {
    try {
        let dateString = req.body.date;
        let id = req.params.id;
        var organizationalUnitKpiSet = await KPIUnitService.editOrganizationalUnitKpiSet(dateString,id);
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
 * Xóa tập KPI đơn vị 
 */
exports.deleteOrganizationalUnitKpiSet = async (req, res) => {
    try {
        var arr = await KPIUnitService.deleteOrganizationalUnitKpiSet(req.params.id);
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
 * Xóa KPI đơn vị
 */
exports.deleteOrganizationalUnitKpi = async (req, res) => {
    try {
        var organizationalUnitKpiSet = await KPIUnitService.deleteOrganizationalUnitKpi(req.params.id,req.params.kpiunit);
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
exports.editOrganizationalUnitKpiSetStatus =async (req, res) => {
    try {
        var kpiunit= await KPIUnitService.editOrganizationalUnitKpiSetStatus(req.params.id,req.params.status);
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
 * Lấy tập KPI đơn vị của đơn vị cha của đơn vị ứng với role người dùng
 */
exports.getParentOrganizationalUnitKpiSet =async (req, res) => {
    try {
        var kpiunit = await KPIUnitService.getParentOrganizationalUnitKpiSet(req.params.id);
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
 * Thêm một KPI vào tập KPI đơn vị
 */
exports.createOrganizationalUnitKpi =async (req, res) => {
    try {
        var organizationalUnitKpiSet = await  KPIUnitService.createOrganizationalUnitKpi(req.body);
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
 * Chỉnh sửa KPI đơn vị
 */
exports.editOrganizationalUnitKpi = async (req, res) => {
    try {
        var target = await KPIUnitService.editOrganizationalUnitKpi(req.body, req.params.id);
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
 * Khởi tạo tập KPI đơn vị
 */
exports.createOrganizationalUnitKpiSet =async (req, res) => {
    try {
        var organizationalUnitKpi = await KPIUnitService.createOrganizationalUnitKpiSet(req.body);
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