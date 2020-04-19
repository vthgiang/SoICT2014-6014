const dashboardService = require('./dashboard.service');
const { LogInfo, LogError } = require('../../../logs');
// Điều phối đến các hàm dịch vụ cơ sở dữ liệu của module quản lý kpi đơn vị
// get all target of unit kpi
exports.get =async (req, res) => {
    try {
        var kpiunits = await dashboardService.get(req.params.id);
        LogInfo(req.user.email, ' get kpi unit ',req.user.company);
        res.status(200).json({
            message: "Lấy tất cả kpi của đơn vị",
            content: kpiunits
        })
    } catch (error) {
        LogError(req.user.email, ' get kpi unit ',req.user.company);
        res.status(400).json({
            message: error
        })
    }

};

// // Lấy KPI đơn vị hiện tại qua vai trò
// exports.getByRole =async (req, res) => {
//     try {
//         var kpiunit = await dashboardService.getByRole(req.params.id);
        
//         LogInfo(req.user.email, ' get kpi unit by role ',req.user.company);
//         res.status(200).json({
//             message: "Lấy kpi đơn vị hiện tại",
//             content: kpiunit
//         });
//     } catch (error) {
//         LogError(req.user.email, ' get kpi unit by role ',req.user.company)
//         res.status(400).json({
//             message: error
//         })
//     }

// }

// // Lấy tất cả các mục tiêu con của mục tiêu hiện tại
// exports.getChildTargetByParentId =async (req, res) => {
//     try {
//         var childTarget = await dashboardService.getChildTargetByParentId(id);
//         LogInfo(req.user.email, ' get child target by parent id ',req.user.company)
//         res.status(200).json({
//             message: "Lấy mục tiêu con theo id của mục tiêu cha thành công",
//             content: childTarget
//         });
//     } catch (error) {
//         LogError(req.user.email, ' get child target by parent id ',req.user.company)
//         res.status(400).json({
//             message: error
//         })
//     }

// }

// // Khởi tạo KPI đơn vị
// exports.create =async (req, res) => {
//     try {
//         var kpiunit = await dashboardService.create(req.body.time,req.body.unit,req.body.creater);
//         res.status(200).json({
//             message: "Khởi tạo thành công KPI đơn vị",
//             kpiunit: kpiunit
//         })
//     } catch (error) {
//         res.status(400).json({
//             message: error
//         })
//     }

// }

// Cập nhật dữ liệu mới nhất cho KPI đơn vị
exports.evaluateKPI =async (req, res) => {
    try {
        var kpiunit = await dashboardService.evaluateKPI(req.params.id);
        LogInfo(req.user.email, ' evaluate kpi unit ',req.user.company)
        res.status(200).json({
            message: "Cập nhật dữ liệu thành công",
            kpiunit: kpiunit
        });
    } catch (error) {
        LogError(req.user.email, ' evaluate kpi unit ',req.user.company)
        res.status(400).json({
            message: error
        })
    }
}