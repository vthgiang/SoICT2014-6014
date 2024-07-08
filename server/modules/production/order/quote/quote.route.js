const express = require('express');
const router = express.Router();
const QuoteController = require('./quote.controller');
const { auth } = require(`../../../../middleware`);


router.get('/get-to-make-order', auth, QuoteController.getQuotesToMakeOrder);

/** Dashboard: Số đơn kinh doanh và doanh số */
router.get('/count', auth, QuoteController.countQuote);

/** Dashboard: Top sản phẩm được quan tâm theo số lượng */
router.get('/get-top-good-care', auth, QuoteController.getTopGoodsCare);
router.post('/', auth, QuoteController.createNewQuote);
router.get('/', auth, QuoteController.getAllQuotes);

router.get('/:id', auth, QuoteController.getQuoteDetail);
router.patch('/:id', auth, QuoteController.editQuote);
router.patch('/approve/:id', auth, QuoteController.approveQuote);
router.delete('/:id', auth, QuoteController.deleteQuote);

module.exports = router;