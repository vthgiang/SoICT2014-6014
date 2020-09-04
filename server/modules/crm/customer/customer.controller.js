const CustomerService = require('./customer.service');
const { LogInfo, LogError } = require(SERVER_LOGS_DIR);

exports.getCustomers = async(req, res) => {
    try {
        const customers = await CustomerService.getCustomers(req.query);

        // LogInfo(req.user.email, 'GET_CUSTOMERS', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_customers_success'],
            content: customers
        });
    } catch (error) {

        // LogError(req.user.email, 'GET_CUSTOMERS', req.user.company);
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

        LogError(req.user.email, 'CREATE_CUSTOMER', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_customer_faile'],
            content: error
        })
    }
};

exports.getCustomer = async (req, res) => {
    try {
        const customer = await CustomerService.createCustomer(req.params.id);

        LogInfo(req.user.email, 'CREATE_CUSTOMER', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_customer_success'],
            content: customer
        });
    } catch (error) {

        LogError(req.user.email, 'CREATE_CUSTOMER', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_customer_faile'],
            content: error
        })
    }
}

exports.editCustomer = async (req, res) => {
    try {
        const customer = await CustomerService.createCustomer(req.params.id, req.body);

        LogInfo(req.user.email, 'CREATE_CUSTOMER', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_customer_success'],
            content: customer
        });
    } catch (error) {

        LogError(req.user.email, 'CREATE_CUSTOMER', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_customer_faile'],
            content: error
        })
    }
}

exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await CustomerService.createCustomer(req.params.id);

        LogInfo(req.user.email, 'CREATE_CUSTOMER', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['create_customer_success'],
            content: customer
        });
    } catch (error) {

        LogError(req.user.email, 'CREATE_CUSTOMER', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_customer_faile'],
            content: error
        })
    }
}
