const LoyalCustomerService = require('./loyalCustomer.service');
const Logger = require(`../../../logs`);

/**
 * Lấy thông tin tất cả trạng thái khách hàng
 * @param {*} req 
 * @param {*} res 
 * userId, portal, companyId, query
 */
exports.getLoyalCustomers = async (req, res) => {
    try {
        
        const status = await LoyalCustomerService.getLoyalCustomers(req.user._id, req.portal, req.user.company._id, req.query,req.currentRole);
        await Logger.info(req.user.email, ' get_loyalCustomers_success ', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_loyalCustomers_success'],
            content: status
        })
    } catch (error) {
        await Logger.error(req.user.email, ' get_loyalCustomers_faile ', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_loyalCustomers_faile'],
            content: error
        })
    }
}
