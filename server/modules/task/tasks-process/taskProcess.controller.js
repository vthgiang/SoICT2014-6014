const TaskProcessService = require('./taskProcess.service');
const { LogInfo, LogError } = require('../../../logs');

// Điều hướng đến dịch vụ cơ sở dữ liệu của module quản lý mẫu công việc
// Lấy tất cả mẫu công việc
exports.exportXmlDiagram = async (req, res) => {
    // try {
        var data = await TaskProcessService.exportXmlDiagram(req.body);
        res.status(200).json({
            success: true,
            messages: ['export thanh congh'],
            content: data
        });
    // } catch (error) {
    //     LogError(req.user.email, `Get task templates by role ${req.params.id}`, req.user.company);
    //     res.status(400).json({
    //         success: false,
    //         messages: ['abc'],
    //         content: error
    //     });
    // }
}
