const express = require("express");
const router = express.Router();
const MarketingCampaignController = require("./marketingCampaign.controller");
const { auth } = require(`../../../../middleware`);

router.post('/', auth, MarketingCampaignController.createNewMarketingCampaign);
router.get('/', auth, MarketingCampaignController.getMarketingCampaign);
// router.get('/get-by-good-id', auth, DiscountController.getDiscountByGoodsId)
// router.get('/get-by-order-value', auth, DiscountController.getDiscountForOrderValue)
router.put('/:id', auth, MarketingCampaignController.editMarketing);
router.put('/change-status/:id', auth, MarketingCampaignController.changeMarketingStatus);
router.delete('/:campaignId', auth, MarketingCampaignController.deleteMarketingCampaign)

module.exports = router;
