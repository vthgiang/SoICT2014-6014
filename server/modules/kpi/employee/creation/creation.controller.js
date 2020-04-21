const KPIPersonalService = require('./creation.service');
const {  LogInfo,  LogError } = require('../../../../logs');
// Điều phối đến các hàm thao tác với cơ sở dữ liệu của module quản lý kpi cá nhân

// get kpi personal by user id
exports.getEmployeeKpiSet = async (req, res) => {
    try {

       var kpipersonals= await KPIPersonalService.getEmployeeKpiSet(req.params.id);
        await LogInfo(req.user.email, ` get kpi personal by user id `, req.user.company);
        res.status(200).json({
            success: true,
            message: "Lấy danh sách các mục tiêu hiện tại của kpi cá nhân",
            content: kpipersonals
        });
    } catch (error) {
        await LogError(req.user.email, ` get kpi personal by user id `, req.user.company)
        res.status(400).json({
            success: false,
            message: error
        });
    }
}

// Khởi tạo KPI cá nhân
exports.createEmployeeKpiSet =async (req, res) => {
    try {
        var kpipersonal= await KPIPersonalService.createEmployeeKpiSet(req.body.creater,req.body.approver,req.body.unit,req.body.time);

        await LogInfo(req.user.email, ` create kpi personal `, req.user.company)
        res.status(200).json({
            success: true,
            message: "Khởi tạo thành công KPI cá nhân",
            content: kpipersonal
        })
    } catch (error) {
        await LogError(req.user.email, ` create kpi personal `, req.user.company)
        res.status(400).json({
            success: false,
            message: error
        });
    }
  
}

// Tạo 1 mục tiêu KPI mới
exports.createEmployeeKpi = async (req, res) => {
    try {
        var kpipersonal= await KPIPersonalService.createEmployeeKpi(req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.body.kpipersonal);
        await LogInfo(req.user.email, ` create target kpi personal `, req.user.company)
        res.status(200).json({
            success: true,
            message: "Thêm mới thành công một mục tiêu của kpi cá nhân",
            content: kpipersonal
        })
    } catch (error) {
        await LogError(req.user.email, ` create target kpi personal `, req.user.company)
        res.status(400).json({
            success: false,
            message: error
        })
    }
}

// Chỉnh sửa thông tin chung của kpi cá nhân
exports.editEmployeeKpiSet = async (req, res) => {
    try {
        var kpipersonal= await KPIPersonalService.editEmployeeKpiSet(req.body.time,req.params.id);
        await LogInfo(req.user.email, ` edit kpi personal `, req.user.company)
        res.status(200).json({
            success: true,
            message: "Chỉnh sửa thành công KPI của cá nhân",
            content: kpipersonal
        });
    } catch (error) {
        await LogError(req.user.email, ` edit kpi personal `, req.user.company)
        res.status(400).json({
            success: false,
            message: error
        });
    }
}

// Chỉnh sửa trạng thái của kpi cá nhân
exports.updateEmployeeKpiSetStatus = async (req, res) => {
    try{
        
        var kpipersonal = await KPIPersonalService.updateEmployeeKpiSetStatus(req.params.id,req.params.status);
        await LogInfo(req.user.email, ` edit status kpi personal `, req.user.company)
        res.status(200).json({
            success: true,
            message: "Xác nhận yêu cầu phê duyệt thành công",
            content: kpipersonal
        })
    } catch (error) {
        await LogError(req.user.email, ` edit status kpi personal `, req.user.company)
        res.status(400).json({
            success: false,
            message: error
        })
    }
}

// xóa kpi cá nhân
exports.deleteEmployeeKpiSet = async (req, res) => {
    try {
        var arr = await KPIPersonalService.deleteEmployeeKpiSet(req.params.id);
        kpipersonal = arr[0];
        listTarget = arr[1];
        await LogInfo(req.user.email, ` delete kpi personal `, req.user.company)
        res.status(200).json({
            success: true,
            message: "Xóa thành công một mục tiêu của cá nhân",
            content: kpipersonal,
            listtarget: listTarget
        })
    } catch (error) {
        await LogError(req.user.email, ` delete kpi personal `, req.user.company)
        res.status(400).json({
            success: false,
            message: error
        })

    }
}

// Chỉnh sửa mục tiêu của kpi cá nhân
exports.editEmployeeKpi = async (req, res) => {
    try {
        var target = await KPIPersonalService.editEmployeeKpi(req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.params.id);
        await LogInfo(req.user.email, ` edit target kpi personal `, req.user.company)
        res.status(200).json({
            success: true,
            message: "Chỉnh sửa thành công một mục tiêu của cá nhân",
            content: target
        })
    } catch (error) {
        await LogError(req.user.email, ` edit target kpi personal `, req.user.company)
        res.status(400).json({
            success: false,
            message : error
        })
    }

}

// Xóa 1 mục tiêu KPI cá nhân
exports.deleteEmployeeKpi = async (req, res) => {
    try {
        var kpipersonal = await KPIPersonalService.deleteEmployeeKpi(req.params.id,req.params.kpipersonal);
        await LogInfo(req.user.email, ` delete target kpi personal `, req.user.company)
        res.status(200).json({
            success: true,
            message: "Xóa thành công một mục tiêu của cá nhân",
            content: kpipersonal,
        })
    } catch (error) {
        await LogError(req.user.email, ` delete target kpi personal `, req.user.company)
        res.status(400).json({
            success: false,
            message:error
        });
    }
    return KPIPersonalService.deleteEmployeeKpi(req.params.id,req.params.kpipersonal);
}
