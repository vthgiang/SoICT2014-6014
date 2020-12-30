const express = require('express');
const router = express.Router();
const PurchasingRequestController = require('./purchasingRequest.controller');
const { auth } = require(`../../../../middleware`);

router.post('/', auth, PurchasingRequestController.createPurchasingRequest);
router.get('/', auth, PurchasingRequestController.getAllPurchasingRequest);
router.get('/:id', auth, PurchasingRequestController.getPurchasingRequestById);
router.patch('/:id', auth, PurchasingRequestController.editPurchasingRequest);

module.exports = router;