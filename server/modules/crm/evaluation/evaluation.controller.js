const EvaluationService = require('./evaluation.service');
const Logger = require(`../../../logs`);

/**
 * Lấy thông tin tất cả trạng thái khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.getEvaluations = async (req, res) => {
    try {
        const status = await EvaluationService.getEvaluations(req.portal, req.user.company._id, req.query,req.currentRole);
        await Logger.info(req.user.email, ' get_evaluations_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_evaluations_success'],
            content: status
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_evaluations_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_evaluations_faile'],
            content: error
        })
    }
}
