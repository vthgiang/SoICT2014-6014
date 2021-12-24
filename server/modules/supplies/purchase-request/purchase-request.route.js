const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require(`../../../middleware`);

const PurchaseRequestController = require("./purchase-request.controller");


router.get('/purchase-request', auth, PurchaseRequestController.searchPurchaseRequests);
router.get('/use-approver', auth, PurchaseRequestController.searchUserApprover);

router.post('/purchase-request', auth, uploadFile([{ name: 'recommendFiles', path: '/supplies/purchase-request/files' }], 'array'), PurchaseRequestController.createPurchaseRequest);
router.put('/purchase-request/:id', auth, uploadFile([{ name: 'recommendFiles', path: '/supplies/purchase-request/files' }], 'array'), PurchaseRequestController.updatePurchaseRequest);
router.delete('/purchase-request/:id', auth, PurchaseRequestController.deletePurchaseRequest);


module.exports = router;