const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const {auth} = require('../middleware');

router.get('/bidding-packages', auth, controllers.PACKAGE.searchBiddingPackage);
router.get('/bidding-packages/:id', auth, controllers.PACKAGE.getDetailBiddingPackage);
router.get('/bidding-packages/:id/edit', auth, controllers.PACKAGE.getDetailBiddingPackageToEdit);
router.post('/bidding-packages', auth, controllers.PACKAGE.createNewBiddingPackage);
router.patch('/bidding-packages/:id', auth, controllers.PACKAGE.editBiddingPackage);
router.delete('/bidding-packages/:id', auth, controllers.PACKAGE.deleteBiddingPackage);
router.get('/bidding-packages/:id/document', auth, controllers.PACKAGE.getBiddingPackageDocument);
router.post('/bidding-packages/:id/semi-auto-proposal', auth, controllers.PACKAGE.proposalForBiddingPackage);

module.exports = router;
