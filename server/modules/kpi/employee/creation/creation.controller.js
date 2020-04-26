const EmployeeKpiSetService = require('./creation.service');
const {  LogInfo,  LogError } = require('../../../../logs');
// Điều phối đến các hàm thao tác với cơ sở dữ liệu của module quản lý kpi cá nhân

/** Lấy tập KPI cá hiện hiện tại */  
exports.getEmployeeKpiSet = async (req, res) => {
    try {

       var employeeKpiSet= await EmployeeKpiSetService.getEmployeeKpiSet(req.params.id);
        await LogInfo(req.user.email, ` get employee kpi set by user id `, req.user.company);
        res.status(200).json({
            success: true,
            messages: ['Lấy tập KPI cá hiện hiện tại thành công'],
            content: employeeKpiSet
        });
    } catch (error) {
        await LogError(req.user.email, ` get employee kpi set by user id `, req.user.company)
        res.status(400).json({
            success: false,
            message: error
        });
    }
}

/** Khởi tạo KPI cá nhân */ 
exports.createEmployeeKpiSet =async (req, res) => {
    try {
        var employeeKpiSet= await EmployeeKpiSetService.createEmployeeKpiSet(req.body.creator,req.body.approver,req.body.organizationalUnit,req.body.time);

        await LogInfo(req.user.email, ` create employee kpi set `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['Khởi tạo thành công KPI cá nhân'],
            content: employeeKpiSet
        })
    } catch (error) {
        await LogError(req.user.email, ` create employee kpi set `, req.user.company)
        res.status(400).json({
            success: false,
            message: error
        });
    }
  
}

/** Tạo 1 mục tiêu KPI mới */ 
exports.createEmployeeKpi = async (req, res) => {
    try {
        var employeeKpi= await EmployeeKpiSetService.createEmployeeKpi(req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.body.employeeKpiSet);
        await LogInfo(req.user.email, ` create employee kpi `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['Thêm mới thành công một mục tiêu của kpi cá nhân'],
            content: employeeKpi
        })
    } catch (error) {
        await LogError(req.user.email, ` create employee kpi `, req.user.company)
        res.status(400).json({
            success: false,
            message: error
        })
    }
}

/** Chỉnh sửa thông tin chung của KPI cá nhân */ 
exports.editEmployeeKpiSet = async (req, res) => {
    try {
        var employeeKpiSet= await EmployeeKpiSetService.editEmployeeKpiSet(req.body.time,req.params.id);
        await LogInfo(req.user.email, ` edit employee kpi set `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['Chỉnh sửa thành công tập KPI của cá nhân'],
            content: employeeKpiSet
        });
    } catch (error) {
        await LogError(req.user.email, ` edit employee kpi set `, req.user.company)
        res.status(400).json({
            success: false,
            message: error
        });
    }
}

/** Chỉnh sửa trạng thái của KPI cá nhân */ 
exports.updateEmployeeKpiSetStatus = async (req, res) => {
    try{
        
        var employeeKpiSet = await EmployeeKpiSetService.updateEmployeeKpiSetStatus(req.params.id,req.params.status);
        await LogInfo(req.user.email, ` edit employee kpi set status `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['Xác nhận yêu cầu phê duyệt thành công'],
            content: employeeKpiSet
        })
    } catch (error) {
        await LogError(req.user.email, ` edit employee kpi set status `, req.user.company)
        res.status(400).json({
            success: false,
            message: error
        })
    }
}

/** Xóa KPI cá nhân */ 
exports.deleteEmployeeKpiSet = async (req, res) => {
    try {
        var arr = await EmployeeKpiSetService.deleteEmployeeKpiSet(req.params.id);
        employeeKpiSet = arr[0];
        kpis = arr[1];
        await LogInfo(req.user.email, ` delete employee kpi set `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['Xóa thành công tập KPI cá nhân'],
            content: employeeKpiSet,
            kpis: kpis
        })
    } catch (error) {
        await LogError(req.user.email, ` delete employee kpi set `, req.user.company)
        res.status(400).json({
            success: false,
            message: error
        })

    }
}

/** Chỉnh sửa mục tiêu của KPI cá nhân */ 
exports.editEmployeeKpi = async (req, res) => {
    try {
        var employeeKpi = await EmployeeKpiSetService.editEmployeeKpi(req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.params.id);
        await LogInfo(req.user.email, ` edit employee kpi `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['Chỉnh sửa thành công một mục tiêu của cá nhân'],
            content: employeeKpi
        })
    } catch (error) {
        await LogError(req.user.email, ` edit employee kpi `, req.user.company)
        res.status(400).json({
            success: false,
            message : error
        })
    }

}

/** Xóa 1 mục tiêu KPI cá nhân */ 
exports.deleteEmployeeKpi = async (req, res) => {
    try {
        var employeeKpiSet = await EmployeeKpiSetService.deleteEmployeeKpi(req.params.id,req.params.kpipersonal);
        await LogInfo(req.user.email, ` delete employee kpi `, req.user.company)
        res.status(200).json({
            success: true,
            messages: ['Xóa thành công một mục tiêu của cá nhân'],
            content: employeeKpiSet,
        })
    } catch (error) {
        await LogError(req.user.email, ` delete employee kpi `, req.user.company)
        res.status(400).json({
            success: false,
            message:error
        });
    }
    return EmployeeKpiSetService.deleteEmployeeKpi(req.params.id,req.params.kpipersonal);
}
