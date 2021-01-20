const express = require('express');
const router = express.Router();
const QuoteController = require('./quote.controller');
const { auth } = require(`../../../../middleware`);

router.post('/', auth, QuoteController.createNewQuote);
router.get('/', auth, QuoteController.getAllQuotes);
router.get('/get-to-make-order', auth, QuoteController.getQuotesToMakeOrder);
router.get('/count', auth, QuoteController.countQuote);
router.get('/get-top-good-care', auth, QuoteController.getTopGoodsCare);
router.get('/:id', auth, QuoteController.getQuoteDetail);
router.patch('/:id', auth, QuoteController.editQuote);
router.patch('/approve/:id', auth, QuoteController.approveQuote);
router.delete('/:id', auth, QuoteController.deleteQuote);

module.exports = router;