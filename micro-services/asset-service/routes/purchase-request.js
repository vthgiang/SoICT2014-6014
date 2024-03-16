const express = require('express');
const router = express.Router();
const {auth, uploadFile} = require('../middleware');

const controllers = require('../controllers');


router.get('/purchase-request', auth, controllers.PURCHASE_REQUEST.searchPurchaseRequests);
router.get('/use-approver', auth, controllers.PURCHASE_REQUEST.searchUserApprover);

router.post('/purchase-request', auth, uploadFile([{
    name: 'recommendFiles',
    path: '/asset/purchase-request/files'
}], 'array'), controllers.PURCHASE_REQUEST.createPurchaseRequest);
router.put('/purchase-request/:id', auth, uploadFile([{
    name: 'recommendFiles',
    path: '/asset/purchase-request/files'
}], 'array'), controllers.PURCHASE_REQUEST.updatePurchaseRequest);
router.delete('/purchase-request/:id', auth, controllers.PURCHASE_REQUEST.deletePurchaseRequest);


module.exports = router;
