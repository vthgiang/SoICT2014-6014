const PurchaseInvoiceService = require('./purchase-invoice.service');
const Logger = require(`../../../logs`);
const NotificationServices = require(`../../notification/notification.service`);

/**
 * Lấy danh sách hóa đơn
 */
exports.searchPurchaseInvoice = async (req, res) => {
    try {
        let data;
        let params = {
            codeInvoice: req.query.codeInvoice,
            supplies: req.query.supplies,
            date: req.query.date,
            supplier: req.query.supplier,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        }
        data = await PurchaseInvoiceService.searchPurchaseInvoice(req.portal, params);
        await Logger.info(req.user.email, 'SEARCH_PURCHASE_INVOICE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["search_purchase_invoice_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'SEARCH_PURCHASE_INVOICE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["search_purchase_invoice_failed"],
            content: {
                error: error
            }
        });
    }
}

/**
 * Thêm danh sách hóa đơn
 */
exports.createPurchaseInvoices = async (req, res) => {
    try {
        let data = await PurchaseInvoiceService.createPurchaseInvoices(req.portal, req.body);
        await Logger.info(req.user.email, 'CREATE_PURCHASE_INVOICES', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_purchase_invoices_success"],
            content: data
        });
    } catch (error) {
        let messages = error && error.messages === 'purchase_invoice_code_exist' ? ['purchase_invoice_code_exist'] : ['create_purchase_invoices_failed'];

        await Logger.error(req.user.email, 'CREATE_PURCHASE_INVOICES', req.portal);
        res.status(400).json({
            success: false,
            messages: messages,
            content: error && error.purchaseInvoiceCodeError
        });
    }
}

/**
 * Cập nhật thông tin hóa đơn
 */
exports.updatePurchaseInvoice = async (req, res) => {
    try {
        let oldInvoice = await PurchaseInvoiceService.getPurchaseInvoiceById(req.portal, req.params.id);
        let data = await PurchaseInvoiceService.updatePurchaseInvoice(req.portal, req.params.id, req.body);
        // Thêm lịch sử chỉnh sửa
        let description = await PurchaseInvoiceService.createDescriptionEditInvoiceLogs(req.portal, req.user._id, data, oldInvoice.purchaseInvoice);
        let log = {
            createdAt: Date.now(),
            creator: req.user._id,
            title: "Chỉnh sửa thông tin hóa đơn mua vật tư",
            description: description
        }
        let invoiceLog = await PurchaseInvoiceService.addInvoiceLog(req.portal, req.params.id, log);

        await Logger.info(req.user.email, 'UPDATE_PURCHASE_INVOICE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["update_purchase_invoice_success"],
            content: {
                data,
                invoiceLog,
            }
        });
    } catch (error) {
        let messages = error && error.messages === 'purchase_invoice_code_exist' ? ['purchase_invoice_code_exist'] : ['update_purchase_invoice_failed'];

        await Logger.error(req.user.email, 'UPDATE_PURCHASE_INVOICE', req.portal);
        res.status(400).json({
            success: false,
            messages: messages,
            content: error && error.purchaseInvoiceCodeError
        });
    }
}

/**
 * Xóa danh sách hóa đơn
 */
exports.deletePurchaseInvoices = async (req, res) => {
    try {
        let data = await PurchaseInvoiceService.deletePurchaseInvoices(req.portal, req.body.ids);
        res.status(200).json({
            success: true,
            messages: ["delete_purchase_invoices_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["delete_purchase_invoices_failed"],
            content: { error: error }
        });
    }
}

/**
 * Lấy thông tin 1 hóa đơn theo id
 */
exports.getPurchaseInvoiceById = async (req, res) => {
    try {
        let data;
        data = await PurchaseInvoiceService.getPurchaseInvoiceById(req.portal, req.params.id);
        await Logger.info(req.user.email, 'GET_PURCHASE_INVOICE_BY_ID', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_purchase_invoice_by_id_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_PURCHASE_INVOICE_BY_ID', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_purchase_invoice_by_id_failed"],
            content: {
                error: error
            }
        });
    }
}