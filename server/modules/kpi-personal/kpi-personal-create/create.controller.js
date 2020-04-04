const KPIPersonalService = require('./create.service');
const {  LogInfo,  LogError } = require('../../../logs');
// Điều phối đến các hàm thao tác với cơ sở dữ liệu của module quản lý kpi cá nhân

// get kpi personal by user id
exports.getByUser = async (req, res) => {
    try {

       var kpipersonals= await KPIPersonalService.getByUser(req.params.id);
        await LogInfo(req.user.email, ` get kpi personal by user id `, req.user.company);
        res.status(200).json({
            message: "Lấy danh sách các mục tiêu hiện tại của kpi cá nhân",
            content: kpipersonals
        });
    } catch (error) {
        await LogError(req.user.email, ` get kpi personal by user id `, req.user.company)
        res.status(400).json({message: error});
    }
}

// Khởi tạo KPI cá nhân
exports.create =async (req, res) => {
    try {
        var kpipersonal= await KPIPersonalService.create(req.body.creater,req.body.approver,req.body.unit,req.body.time);

        await LogInfo(req.user.email, ` create kpi personal `, req.user.company)
        res.status(200).json({
            message: "Khởi tạo thành công KPI cá nhân",
            kpipersonal: kpipersonal
        })
    } catch (error) {
        await LogError(req.user.email, ` create kpi personal `, req.user.company)
        res.status(400).json({message: error});
    }
  
}
// create new target of personal kpi
exports.createTarget = async (req, res) => {
    try {
       var kpipersonal= await KPIPersonalService.createTarget(req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.body.kpipersonal);
       await LogInfo(req.user.email, ` create target kpi personal `, req.user.company)
       res.status(200).json({
        message: "Thêm mới thành công một mục tiêu của kpi cá nhân",
        kpipersonal: kpipersonal
       })
    } catch (error) {
        await LogError(req.user.email, ` create target kpi personal `, req.user.company)
        res.status(400).json({
            message: error
        })
    }
}
// Chỉnh sửa thông tin chung của kpi cá nhân
exports.edit = async (req, res) => {
    try {
        var kpipersonal= await KPIPersonalService.editById(req.body.time,req.params.id);
        await LogInfo(req.user.email, ` edit kpi personal `, req.user.company)
        res.status(200).json({
            message: "Chỉnh sửa thành công KPI của cá nhân",
            kpipersonal: kpipersonal
        });
    } catch (error) {
        await LogError(req.user.email, ` edit kpi personal `, req.user.company)
        res.status(400).json({message:error});
    }
}

// Chỉnh sửa trạng thái của kpi cá nhân
exports.editStatusKPIPersonal = async (req, res) => {
    try{
        
        var kpipersonal = await KPIPersonalService.editStatusKPIPersonal(req.params.id,req.params.status);
        await LogInfo(req.user.email, ` edit status kpi personal `, req.user.company)
        res.status(200).json({
            message: "Xác nhận yêu cầu phê duyệt thành công",
            kpipersonal: kpipersonal
        })
    } catch (error) {
        await LogError(req.user.email, ` edit status kpi personal `, req.user.company)
        res.status(400).json({
            message: error
        })
    }
}

// xóa kpi cá nhân
exports.delete = async (req, res) => {
    try {
        var arr = await KPIPersonalService.delete(req.params.id);
        kpipersonal = arr[0];
        listTarget = arr[1];
        await LogInfo(req.user.email, ` delete kpi personal `, req.user.company)
        res.status(200).json({
            message: "Xóa thành công một mục tiêu của cá nhân",
            kpipersonal: kpipersonal,
            listtarget: listTarget
        })
    } catch (error) {
        await LogError(req.user.email, ` delete kpi personal `, req.user.company)
        res.status(400).json({
            message: error
        })

    }
}

// Chỉnh sửa mục tiêu của kpi cá nhân
exports.editTarget = async (req, res) => {
    try {
        var target = await KPIPersonalService.editTarget(req.body.name,req.body.parent,req.body.weight,req.body.criteria,req.params.id);
        await LogInfo(req.user.email, ` edit target kpi personal `, req.user.company)
        res.status(200).json({
            message: "Chỉnh sửa thành công một mục tiêu của cá nhân",
            target: target
        })
    } catch (error) {
        await LogError(req.user.email, ` edit target kpi personal `, req.user.company)
        res.status(400).json({
            message : error
        })
    }

}

// delete target of personal kpi
exports.deleteTarget = async (req, res) => {
    try {
        var kpipersonal = await KPIPersonalService.deleteTarget(req.params.id,req.params.kpipersonal);
        await LogInfo(req.user.email, ` delete target kpi personal `, req.user.company)
        res.status(200).json({
            message: "Xóa thành công một mục tiêu của cá nhân",
            kpipersonal: kpipersonal,
        })
    } catch (error) {
        await LogError(req.user.email, ` delete target kpi personal `, req.user.company)
        res.status(400).json({message:error});
    }
    return KPIPersonalService.deleteTarget(req.params.id,req.params.kpipersonal);
}
