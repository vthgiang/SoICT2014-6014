const express = require('express');
const router = express.Router();
const {auth, uploadFile} = require('../middleware');

const controllers = require('../controllers');

router.get('/bidding-contract', auth, controllers.CONTRACT.searchBiddingContract);
router.post('/bidding-contract', auth, uploadFile([{
    name: 'files',
    path: '/bidding-contracts'
}], 'array'), controllers.CONTRACT.createNewBiddingContract);
router.patch('/bidding-contract/:id', auth, uploadFile([{
    name: 'files',
    path: '/bidding-contracts'
}], 'array'), controllers.CONTRACT.editBiddingContract);
router.delete('/bidding-contract/:id', auth, controllers.CONTRACT.deleteBiddingContract);
router.post('/bidding-contract/:contractId/project/create-cpm', auth, controllers.CONTRACT.createProjectCpmByContract);
router.patch('/bidding-contract/:id/upload', auth, uploadFile([{
    name: 'files',
    path: '/bidding-contracts'
}], 'single'), controllers.CONTRACT.uploadBiddingContractFile);

module.exports = router;
