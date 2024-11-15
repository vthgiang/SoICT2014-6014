const SalesOrderServices = require('./salesOrder.service');
const Log = require(`../../../../logs`);
const rabitmq= require('../../../../rabbitmq/client')
const listRpcQueue = require('../../../../rabbitmq/listRpcQueue')

exports.createNewSalesOrder = async (req, res) => {
    try {
        let data = req.body;

        let salesOrder = await SalesOrderServices.createNewSalesOrder(req.user._id, req.user.company._id, data, req.portal)
        await Log.info(req.user.email, "CREATED_NEW_SALES_ORDER", req.portal);


        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: salesOrder
        });
    } catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_SALES_ORDER", req.portal);
        console.log("ERROR", error.message);
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
        let query = req.query;
        console.log(query)
        console.log(req.user._id)
        let salesOrders = await SalesOrderServices.getAllSalesOrders(req.user._id, query, req.portal);


        await Log.info(req.user.email, "GET_ALL_SALES_ORDERS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_sales_order_successfully"],
            content: salesOrders
        })
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_SALES_ORDERS", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ["get_sales_orders_failed"],
            content: error.message
        })
    }
}

exports.editSalesOrder = async (req, res) => {
    try {
        let data = req.body;
        let id = req.params.id;

        let salesOrder = await SalesOrderServices.editSalesOrder(req.user._id, req.user.company._id, id, data, req.portal)

        await Log.info(req.user.email, "EDIT_SALES_ORDER", req.portal);


        res.status(201).json({
            success: true,
            messages: ["edit_successfully"],
            content: salesOrder
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_SALES_ORDER", req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_failed"],
            content: error.message
        });
    }
}

exports.approveSalesOrder = async (req, res) => {
    try {
        let data = req.body;
        let id = req.params.id;

        let salesOrder = await SalesOrderServices.approveSalesOrder(id, data, req.portal)

        await Log.info(req.user.email, "APPROVE_SALES_ORDER", req.portal);


        res.status(201).json({
            success: true,
            messages: ["approve_successfully"],
            content: salesOrder
        });
    } catch (error) {
        await Log.error(req.user.email, "APPROVE_SALES_ORDER", req.portal);
        res.status(400).json({
            success: false,
            messages: ["approve_failed"],
            content: error.message
        });
    }
}

exports.addManufacturingPlanForGood = async (req, res) => {
    try {
        let data = req.body;
        let id = req.params.id;

        let salesOrder = await SalesOrderServices.addManufacturingPlanForGood(id, data, req.portal)

        await Log.info(req.user.email, "ADD_MANUFACTURING_PLAN_FOR_SALES_ORDER", req.portal);


        res.status(201).json({
            success: true,
            messages: ["add_manufacturing_for_sales_order_successfully"],
            content: salesOrder
        });
    } catch (error) {
        await Log.error(req.user.email, "ADD_MANUFACTURING_PLAN_FOR_SALES_ORDER", req.portal);
        res.status(400).json({
            success: false,
            messages: ["add_manufacturing_for_sales_order_failed"],
            content: error.message
        });
    }
}

exports.getSalesOrdersByManufacturingWorks = async (req, res) => {
    try {
        let id = req.params.id;

        let salesOrders = await SalesOrderServices.getSalesOrdersByManufacturingWorks(id, req.portal)

        await Log.info(req.user.email, "GET_SALES_ORDER_BY_MANUFACTURING_WORKS", req.portal);


        res.status(201).json({
            success: true,
            messages: ["get_sales_order_by_manufacturing_works_successfully"],
            content: salesOrders
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_SALES_ORDER_BY_MANUFACTURING_WORKS", req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_sales_order_by_manufacturing_works_failed"],
            content: error.message
        });
    }
}

//Lấy các đơn hàng chưa thanh toán hết của 1 khách hàng
exports.getSalesOrdersForPayment = async (req, res) => {
    try {
        let customerId = req.query.customerId;

        let salesOrders = await SalesOrderServices.getSalesOrdersForPayment(customerId, req.portal)

        await Log.info(req.user.email, "GET_SALES_ORDERS_FOR_PAYMENT", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_sales_orders_for_payment_successfully"],
            content: salesOrders
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_SALES_ORDERS_FOR_PAYMENT", req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_sales_orders_for_payment_failed"],
            content: error.message
        });
    }
}


exports.getSalesOrderDetail = async (req, res) => {
    try {
        let id = req.params.id;
        let salesOrder = await SalesOrderServices.getSalesOrderDetail(id, req.portal)

        await Log.info(req.user.email, "GET_SALES_ORDER_DETAIL", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_detail_successfully"],
            content: salesOrder
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_SALES_ORDER_DETAIL", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ["get_detail_failed"],
            content: error.message
        });
    }
}

exports.countSalesOrder = async (req, res) => {
    try {
        let query = req.query;
        console.log("Query received in controller:", query); 
        const param = {
            userId: req.user._id, 
            query: query, 
            portal: req.portal
        }

        const response = await rabitmq.gRPC('orderService.countSalesOrder', JSON.stringify(param), listRpcQueue.PRODUCTION_SERVICE);
        const responseData = JSON.parse(response);

        // Chuyển đổi cấu trúc dữ liệu nhận được thành cấu trúc mong muốn
        const salesOrdersCounter = {
            count: responseData.salesOrdersCounter.count,
            totalMoneyWithStatus: responseData.salesOrdersCounter.totalMoneyWithStatus,
            totalNumberWithStatus: responseData.salesOrdersCounter.totalNumberWithStatus,
            totalMoney: responseData.salesOrdersCounter.totalMoney
        };

        await Log.info(req.user.email, "COUNT_SALES_ORDER", req.portal);
        res.status(200).json({
            success: true,
            messages: ["count_sales_order_successfully"],
            content: { salesOrdersCounter }
        });
    } catch (error) {
        await Log.error(req.user.email, "COUNT_SALES_ORDER", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ["count_sales_order_failed"],
            content: error.message
        });
    }
}

exports.getTopGoodsSold = async (req, res) => {
    try {
        let query = req.query;
        let topGoodsSold = await SalesOrderServices.getTopGoodsSold(req.user._id, query, req.portal)

        await Log.info(req.user.email, "GET_TOP_GOODS_SOLD", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_top_goods_sold_successfully"],
            content: topGoodsSold
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_TOP_GOODS_SOLD", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ["get_top_goods_sold_failed"],
            content: error.message
        });
    }
}

exports.getSalesForDepartments = async (req, res) => {
    try {
        let query = req.query;
        let salesForDepartments = await SalesOrderServices.getSalesForDepartments(query, req.portal)

        await Log.info(req.user.email, "GET_SALES_FOR_DEPARTMENTS", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_sales_for_departments_successfully"],
            content: salesForDepartments
        });
    } catch (error) {
        await Log.error(req.user.email, "get_sales_for_departments_DEPARTMENTS", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ["get_sales_for_departments_failed"],
            content: error.message
        });
    }
}

exports.getNumberWorksSalesOrder = async (req, res) => {
    try {
        let query = req.query;
        let numberSalesOrder = await SalesOrderServices.getNumberWorksSalesOrder(query, req.portal)

        await Log.info(req.user.email, "GET_NUMBER_SALES_ORDERS", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_number_successfully"],
            content: numberSalesOrder
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_NUMBER_SALES_ORDERS", req.portal);
        console.log(error.message);
        res.status(400).json({
            success: false,
            messages: ["get_number_failed"],
            content: error.message
        });
    }
}

exports.importSales = async (req, res) => {
    try {
        const data = req.body.data; // Dữ liệu từ frontend
        console.log("data", data)
        // const query = req.query; // Lấy query từ request nếu cần thiết
        // console.log(query)
        // const userId = req.user._id;
        // console.log(userID)
        const result = await SalesOrderServices.importSales(req.portal, data);
        res.status(200).json({
            success: true,
            messages: ['import_sales_success'],
            content: result
        });
    } catch (error) {
        await Log.error(req.user.email, 'import_sales_failure', req.portal);
        res.status(400).json({
            success: false,
            messages: ['import_sales_failure'],
            content: error.message
        });
    }
};