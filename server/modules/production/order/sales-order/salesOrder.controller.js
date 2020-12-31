const SalesOrderServices = require('./salesOrder.service');
const Log = require(`../../../../logs`);

exports.create = async (req, res) => {
    try {

    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_COIN_RULE", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

// fale sales order lam KHSX
exports.getAllSalesOrders = async (req, res) => {
    try {
        let salesOrders = await SalesOrderServices.getAllSalesOrders(req.portal);

        await Log.info(req.user.email, "GET_ALL_SALES_ORDERS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_sales_order_successfully"],
            content: salesOrders
        })
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_SALES_ORDERS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_sales_orders_failed"],
            content: error.message
        })
    }
}