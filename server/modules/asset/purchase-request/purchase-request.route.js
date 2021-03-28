const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require(`../../../middleware`);

const RecommendProcureController = require("./purchase-request.controller");


router.get('/purchase-request', auth, RecommendProcureController.searchPurchaseRequests);
router.get('/use-approver', auth, RecommendProcureController.searchUserApprover);

router.post('/purchase-request', auth, uploadFile([{ name: 'recommendFiles', path: '/asset/purchase-request/files' }], 'array'), RecommendProcureController.createPurchaseRequest);
router.put('/purchase-request/:id', auth, uploadFile([{ name: 'recommendFiles', path: '/asset/purchase-request/files' }], 'array'), RecommendProcureController.updatePurchaseRequest);
router.delete('/purchase-request/:id', auth, RecommendProcureController.deletePurchaseRequest);



module.exports = router;