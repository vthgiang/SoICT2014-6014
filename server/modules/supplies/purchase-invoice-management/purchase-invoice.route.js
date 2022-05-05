const express = require('express');
const router = express.Router();
const PurchaseInvoiceController = require('./purchase-invoice.controller');
const { auth } = require(`../../../middleware`);

router.get('/purchase-invoice', auth, PurchaseInvoiceController.searchPurchaseInvoice);
router.post('/purchase-invoice', auth, PurchaseInvoiceController.createPurchaseInvoices);
router.patch('/purchase-invoice/:id',auth, PurchaseInvoiceController.updatePurchaseInvoice);
router.delete('/purchase-invoice',auth, PurchaseInvoiceController.deletePurchaseInvoices);
router.get('/purchase-invoice/:id',auth, PurchaseInvoiceController.getPurchaseInvoiceById);

module.exports = router;