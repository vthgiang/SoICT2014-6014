const BillService = require('./bill.service');
const Logger = require(`${SERVER_LOGS_DIR}`);

exports.getBillsByType = async (req, res) => {
    try {
        const bills = await BillService.getBillsByType(req.query, req.portal);

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
            content: error
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
            content: error
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
            error: err
        })
    }
}