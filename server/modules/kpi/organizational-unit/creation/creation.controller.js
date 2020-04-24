const KPIUnitService = require('./creation.service');
const { LogInfo, LogError } = require('../../../../logs');
// Lấy KPI đơn vị hiện tại qua vai trò
exports.getByRole = async (req, res) => {
    try {
        var kpiunit = await KPIUnitService.getByRole(req.params.id);
        LogInfo(req.user.email, `Get kpi unit by role `, req.user.company);
        res.status(200).json({
            message: "Lấy kpi đơn vị hiện tại",
            content: kpiunit
        })
    } catch (error) {
        LogError(req.user.email, `Get kpi unit by role `, req.user.company)
        res.status(400).json({
            message:error
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
            message: "Chỉnh sửa thành công KPI của đơn vị",
            organizationalUnitKpiSet: organizationalUnitKpiSet
        });
    } catch (error) {
        LogError(req.user.email, ' Edit kpi unit ',req.user.company);
        res.status(400).json({
            message : error
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
            message: "Xóa thành công kpi đơn vị",
            kpiunit: kpiunit,
            listtarget: listTarget
        });
    } catch (error) {
        LogError(req.user.email, 'delete kpi unit',req.user.company)
        res.status(400).json({
            message: error
        })
    }

}
// delete target of unit kpi
exports.deleteTarget = async (req, res) => {
    try {
        var organizationalUnitKpiSet = await KPIUnitService.deleteTarget(req.params.id,req.params.kpiunit);
        LogInfo(req.user.email, 'delete target kpi unit',req.user.company);
        res.status(200).json({
            message: "Xóa thành công một mục tiêu của đơn vị",
            organizationalUnitKpiSet: organizationalUnitKpiSet,
        });
    } catch (error) {
        LogError(req.user.email, 'delete target kpi unit',req.user.company)
        res.status(400).json({
            message:error
        })
    } 
}

// Chỉnh sửa trạng thái của kpi đơn vị
exports.editStatusKPIUnit =async (req, res) => {
    try {
        var kpiunit= await KPIUnitService.editStatusKPIUnit(req.params.id,req.params.status);
        LogInfo(req.user.email, 'edit status kpi unit',req.user.company)
        res.status(200).json({
            message: "Xác nhận kích hoạt kpi đơn vị thành công",
            kpiunit: kpiunit
        });
    } catch (error) {
        LogError(req.user.email, 'edit status kpi unit',req.user.company)
        res.status(400).json({message: error})
    }
}

// lấy KPI đơn vị của đơn vị cha
exports.getParentByUnit =async (req, res) => {
    try {
        var kpiunit = await KPIUnitService.getParentByUnit(req.params.id);
        LogInfo(req.user.email, 'get parent kpi unit',req.user.company)
        res.status(200).json({
            message: "Lấy kpi đơn vị cha",
            content: kpiunit
        });
    } catch (error) {
        LogError(req.user.email, 'get parent kpi unit',req.user.company)
        res.status(400).json({
            message: error
        })
    }

}

// create new target of unit kpi
exports.createTarget =async (req, res) => {
    try {
        var organizationalUnitKpiSet = await  KPIUnitService.createTarget(req.body.name, req.body.parent, req.body.weight, req.body.criteria, req.body.organizationalUnitKpiSetId);
        LogInfo(req.user.email, 'create target kpi unit',req.user.company)
        res.status(200).json({
            message: "Thêm mới thành công một mục tiêu của đơn vị",
            organizationalUnitKpiSet: organizationalUnitKpiSet
        });
    } catch (error) {
        LogError(req.user.email, 'create target kpi unit',req.user.company)
        res.status(400).json({
            message : error
        })
    }
}

// Chỉnh sửa mục tiêu của kpi đơn vị
exports.editTargetById = async (req, res) => {
    try {
        var target = await KPIUnitService.editTargetById(req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.params.id);
        LogInfo(req.user.email, 'edit target kpi unit',req.user.company)
        res.status(200).json({
            message: "Chỉnh sửa thành công một mục tiêu của đơn vị",
            target: target
        });
    } catch (error) {
        LogError(req.user.email, 'edit target kpi unit',req.user.company)
        res.status(400).json({
            message: error
        })
    }
 
}

// Khởi tạo KPI đơn vị
exports.create =async (req, res) => {
    try {
        var kpiunit = await KPIUnitService.create(req.body.time,req.body.unit,req.body.creater);
        LogInfo(req.user.email, 'create kpi unit',req.user.company)
        res.status(200).json({
            message: "Khởi tạo thành công KPI đơn vị",
            kpiunit: kpiunit
        });
    } catch (error) {
        LogError(req.user.email, 'create kpi unit',req.user.company)
        res.status(400).json({
            message: error
        })
    }
 
}