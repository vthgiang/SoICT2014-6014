const BillService = require('./bill.service');
const Logger = require(`../../../../logs`);

exports.getBillsByType = async (req, res) => {
    try {
        const bills = await BillService.getBillsByType(req.query, req.user._id, req.portal);

        await Logger.info(req.user.email, 'GET_BILL_SUCCESS', req.portal);

        res.status(200).json({
            success: true,
            messages: ['get_bill_success'],
            content: bills
        })
    } catch (error) {
        await Logger.error(req.user.email, 'GET_BILL_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_bill_failed'],
            content: error.message
        })
    }
}

exports.getBillByGood = async (req, res) => {
    try {
        const bills = await BillService.getBillByGood(req.query, req.portal);

        await Logger.info(req.user.email, 'GET_BILL_SUCCESS', req.portal);

        res.status(200).json({
            success: true,
            messages: ['get_bill_success'],
            content: bills
        })
    } catch (error) {
        await Logger.error(req.user.email, 'GET_BILL_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_bill_failed'],
            content: error.message
        })
    }
}

exports.getDetailBill = async (req, res) => {
    try {
        const bill = await BillService.getDetailBill(req.params.id, req.portal);

        await Logger.info(req.user.email, 'GET_BILL_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_bill_success'],
            content: bill
        })
    }
    catch (err) {
        await Logger.error(req.user.email, 'GET_BILL_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_bill_failed'],
            content: err.message
        })
    }
}

exports.createBill = async (req, res) => {
    try {
        const bill = await BillService.createBill(req.user._id, req.body, req.portal);

        await Logger.info(req.user.email, 'CREATE_BILL_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['add_success'],
            content: bill
        })
    }
    catch (err) {
        await Logger.error(req.user.email, 'CREATE_BILL_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['add_failed'],
            content: err.message
        })
    }
}

exports.editBill = async (req, res) => {
    try {
        const bill = await BillService.editBill(req.params.id, req.user._id, req.body, req.portal);

        await Logger.info(req.user.email, 'EDIT_BILL_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_success'],
            content: bill
        })
    } catch (err) {
        await Log.error(req.user.email, 'EDIT_BILL_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_failed'],
            content: err.message
        })
    }
}

exports.getBillsByStatus = async (req, res) => {
    try {
        const bills = await BillService.getBillsByStatus(req.query, req.portal);

        await Logger.info(req.user.email, 'GET_BILL_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_bill_success'],
            content: bills
        })
    }
    catch (err) {
        await Logger.error(req.user.email, 'GET_BILL_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_bill_failed'],
            content: err.message
        })
    }
}

exports.getBillsByCommand = async (req, res) => {
    try {
        const bills = await BillService.getBillsByCommand(req.query, req.portal);

        await Logger.info(req.user.email, 'GET_BILL_SUCCESS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_bill_success'],
            content: bills
        })
    }
    catch (error) {
        await Logger.error(req.user.email, 'GET_BILL_FAILED', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_bill_failed'],
            content: error.message
        })
    }
}


exports.createManyProductBills = async (req, res) => {
    try {
        const data = req.body;
        const bills = await BillService.createManyProductBills(data, req.portal);

        await Logger.info(req.user.email, 'CREATE_MANY_PRODUCT_BILL', req.portal);

        res.status(200).json({
            success: true,
            messages: ['create_product_bill_successfully'],
            content: bills
        })
    } catch (error) {
        await Logger.error(req.user.email, 'CREATE_MANY_PRODUCT_BILL', req.portal);

        res.status(400).json({
            success: false,
            messages: ['create_product_bill_failed'],
            content: error.message
        })
    }
}