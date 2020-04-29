const KPIUnitService = require('./creation.service');
const { LogInfo, LogError } = require('../../../../logs');

// Lấy KPI đơn vị hiện tại qua vai trò
exports.getByRole = async (req, res) => {
    try {
        var kpiunit = await KPIUnitService.getByRole(req.params.id);
        LogInfo(req.user.email, `Get kpi unit by role `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_by_role_success'],
            content: kpiunit
        })
    } catch (error) {
        LogError(req.user.email, `Get kpi unit by role `, req.user.company)
        res.status(400).json({
            success: false,
            messages:error
        })
    }
}

// Chỉnh sửa thông tin chung của kpi đơn vị
exports.edit = async (req, res) => {
    try {
        let timeString = req.body.time;
        let id = req.params.id;
        var organizationalUnitKpiSet = await KPIUnitService.editById(timeString,id);
        LogInfo(req.user.email, ' Edit kpi unit ',req.user.company);
        res.status(200).json({
            success: true,
            messages: ['edit_success'],
            content: organizationalUnitKpiSet,
        });
    } catch (error) {
        LogError(req.user.email, ' Edit kpi unit ',req.user.company);
        res.status(400).json({
            success: false,
            messages : error
        })
    }
}

// xóa kpi đơn vị
exports.delete = async (req, res) => {
    try {
        var arr = await KPIUnitService.delete(req.params.id);
        kpiunit = arr[0];
        listTarget = arr[1];
        LogInfo(req.user.email, 'delete kpi unit',req.user.company)
        res.status(200).json({
            success: true,
            messages: ['delete_success'],
            content: {
                kpiunit: kpiunit,
                listtarget: listTarget
            }
        });
    } catch (error) {
        LogError(req.user.email, 'delete kpi unit',req.user.company)
        res.status(400).json({
            success: false,
            messages: error
        })
    }

}
// delete target of unit kpi
exports.deleteTarget = async (req, res) => {
    try {
        var organizationalUnitKpiSet = await KPIUnitService.deleteTarget(req.params.id,req.params.kpiunit);
        LogInfo(req.user.email, 'delete target kpi unit',req.user.company);
        res.status(200).json({
            success: true,
            messages: ['delete_success'],
            content: organizationalUnitKpiSet
        });
    } catch (error) {
        LogError(req.user.email, 'delete target kpi unit',req.user.company)
        res.status(400).json({
            success: false,
            messages:error
        })
    } 
}

// Chỉnh sửa trạng thái của kpi đơn vị
exports.editStatusKPIUnit =async (req, res) => {
    try {
        var kpiunit= await KPIUnitService.editStatusKPIUnit(req.params.id,req.params.status);
        LogInfo(req.user.email, 'edit status kpi unit',req.user.company)
        res.status(200).json({
            success: true,
            messages: ['success'],
            content: kpiunit,
        });
    } catch (error) {
        LogError(req.user.email, 'edit status kpi unit',req.user.company)
        res.status(400).json({
            success: false,
            messages: error
        })
    }
}

// lấy KPI đơn vị của đơn vị cha
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
            messages: error
        })
    }

}

// create new target of unit kpi
exports.createTarget =async (req, res) => {
    try {
        var organizationalUnitKpiSet = await  KPIUnitService.createTarget(req.body.name, req.body.parent, req.body.weight, req.body.criteria, req.body.organizationalUnitKpiSetId);
        LogInfo(req.user.email, 'create target kpi unit',req.user.company)
        res.status(200).json({
            success: true,
            messages: ['success'],
            content: organizationalUnitKpiSet,
        });
    } catch (error) {
        LogError(req.user.email, 'create target kpi unit',req.user.company)
        res.status(400).json({
            success: false,
            messages : error
        })
    }
}

// Chỉnh sửa mục tiêu của kpi đơn vị
exports.editTargetById = async (req, res) => {
    try {
        var target = await KPIUnitService.editTargetById(req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.params.id);
        LogInfo(req.user.email, 'edit target kpi unit',req.user.company)
        res.status(200).json({
            success: true,
            messages: ['success'],
            content: target
        });
    } catch (error) {
        LogError(req.user.email, 'edit target kpi unit',req.user.company)
        res.status(400).json({
            success: false,
            messages: error
        })
    }
 
}

// Khởi tạo KPI đơn vị
exports.create =async (req, res) => {
    try {
        var organizationalUnitKpi = await KPIUnitService.create(req.body.time,req.body.organizationalUnit,req.body.creator);
        LogInfo(req.user.email, 'create kpi unit',req.user.company)
        res.status(200).json({
            success: true,
            messages: ['success'],
            content: organizationalUnitKpi,
            // organizationalUnitKpi: organizationalUnitKpi
        });
    } catch (error) {
        LogError(req.user.email, 'create kpi unit',req.user.company)
        res.status(400).json({
            success: false,
            messages: error
        })
    }
 
}