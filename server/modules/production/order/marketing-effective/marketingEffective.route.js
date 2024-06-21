const express = require("express");
const router = express.Router();
const MarketingEffectiveController = require("./marketingEffective.controller");
const { auth } = require(`../../../../middleware`);

// router.post('/', auth, MarketingCampaignController.createNewMarketingCampaign);
router.get('/', auth, MarketingEffectiveController.getMarketingEffective);
router.get('/channel', auth, MarketingEffectiveController.getMarketingEffectiveChannel);
router.get('/top-campaign', auth, MarketingEffectiveController.getTopMarketingCampaign);
router.get('/:marketingId', auth, MarketingEffectiveController.getMarketingDetailById);
// router.get('/get-by-good-id', auth, DiscountController.getDiscountByGoodsId)
// router.get('/get-by-order-value', auth, DiscountController.getDiscountForOrderValue)
// router.put('/:id', auth, MarketingCampaignController.editMarketing);
// router.put('/change-status/:id', auth, MarketingCampaignController.changeMarketingStatus);
// router.delete('/:campaignId', auth, MarketingCampaignController.deleteMarketingCampaign)

module.exports = router;
