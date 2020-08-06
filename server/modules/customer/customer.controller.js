const CustomerService = require('./customer.service');
const { LogInfo, LogError } = require('../../logs');

// Customer
exports.getCustomers = async(req, res) => {
    try {
        const customers = await CustomerService.getCustomers(req.user.company._id, req.query);
        console.log("USER", req.user)

        LogInfo(req.user.email, 'GET_CUSTOMERS', req.user.company);

        res.status(200).json({
            success: true,
            messages: ['get_customers_success'],
            content: customers
        });
    } catch (error) {
        console.log("User err", req.user)
        LogError(req.user.email, 'GET_CUSTOMERS', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_customers_faile'],
            content: error
        })
    }
};

exports.createCustomer = async(req, res) => {
    try {
        const customer = await CustomerService.createCustomer(req.user.company._id, req.body);

        LogInfo(req.user.email, 'CREATE_CUSTOMER', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_customer_success'],
            content: customer
        });
    } catch (error) {
        console.log("Error:", error)
        LogError(req.user.email, 'CREATE_CUSTOMER', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_customer_faile'],
            content: error
        })
    }
};

exports.getCustomer = async (req, res) => {

}

exports.editCustomer = async (req, res) => {
    
}

exports.deleteCustomer = async (req, res) => {
    
}

// Customer group
exports.getCustomerGroups = async(req, res) => {
    try {
        console.log("lấy danh sách nhóm khách hàng")
        const groups = await CustomerService.getCustomerGroups(req.user.company._id, req.query);
        console.log("GROUP :", groups)

        LogInfo(req.user.email, 'GET_CUSTOMER_GROUPS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_customer_groups_success'],
            content: groups
        });
    } catch (error) {
        console.log("Error nhóm KH: ", error)
        LogError(req.user.email, 'GET_CUSTOMER_GROUPS', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_customer_groups_faile'],
            content: error
        })
    }
};

// Customer liability
exports.getCustomerLiabilities = async(req, res) => {
    try {
        const groups = await CustomerService.getCustomerLiabilities(req.user.company._id, req.query);

        LogInfo(req.user.email, 'GET_CUSTOMER_LIABILITY', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_customer_liability_success'],
            content: groups
        });
    } catch (error) {
        LogError(req.user.email, 'GET_CUSTOMER_LIABILITY', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_customer_liability_faile'],
            content: error
        })
    }
};