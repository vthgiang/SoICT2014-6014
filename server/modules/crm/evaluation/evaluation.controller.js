const EvaluationService = require('./evaluation.service');
const Logger = require(`../../../logs`);
/**
 * Các controller cho phần Đánh giá hoạt động CSKH
 * Trong phần services của mục này còn có Vẽ biểu đồ, phụ trách 2 Dashboard Bảng tin quản lý khách hàng 
 * và Bảng tin đơn vị quản lý khách hàng
 */
/**
 * Lấy thông tin tất cả trạng thái khách hàng
 * @param {*} req 
 * @param {*} res 
 */
exports.getEvaluations = async (req, res) => {
    try {
        const status = await EvaluationService.getEvaluations(req.portal, req.user.company._id, req.query, req.user._id, req.currentRole);
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
exports.getCustomerCareInfoByEmployee = async (req, res) => {
    console.log('vaoday employee');
    try {
        const status = await EvaluationService.getCustomerCareInfoByEmployee(req.portal, req.user.company._id, req.query,req.user._id, req.currentRole);
        await Logger.info(req.user.email, ' get_customerCareInfoByEmployee_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_customerCareInfoByEmployee_success'],
            content: status
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_customerCareInfoByEmployee_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_customerCareInfoByEmployee_faile'],
            content: error
        })
    }
}

exports.getCustomerCareInfoByUnit = async (req, res) => {
    console.log('vaoday unit');
    try {
        const customerCareInfoByUnit = await EvaluationService.getCustomerCareInfoByUnit(req.portal, req.user.company._id, req.query, req.user._id, req.currentRole);
        await Logger.info(req.user.email, ' get_customerCareInfoByUnit_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_customerCareInfoByUnit_success'],
            content: customerCareInfoByUnit
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_customerCareInfoByUnit_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_customerCareInfoByUnit_faile'],
            content: error
        })
    }
}