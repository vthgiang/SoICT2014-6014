const express = require("express");
const router = express.Router();
const MarketingController = require("./marketing.controller");
const { auth } = require(`../../../../middleware`);

// router.post('/', auth, DiscountController.createNewDiscount);
// router.get('/', auth, DiscountController.getAllDiscounts);
// router.get('/get-by-good-id', auth, DiscountController.getDiscountByGoodsId)
// router.get('/get-by-order-value', auth, DiscountController.getDiscountForOrderValue)
// router.patch('/:id', auth, DiscountController.editDiscount);
// router.patch('/change-status/:id', auth, DiscountController.changeDiscountStatus);
// router.delete('/', auth, DiscountController.deleteDiscountByCode)

module.exports = router;
