const express = require('express');
const router = express.Router();
const QuoteController = require('./quote.controller');
const { auth } = require(`../../../../middleware`);

router.post('/', auth, QuoteController.createNewQuote);
router.get('/', auth, QuoteController.getAllQuotes);
router.patch('/:id', auth, QuoteController.editQuote);
router.patch('/approve/:id', auth, QuoteController.approveQuote);
router.delete('/:id', auth, QuoteController.deleteQuote);
router.get('/get-to-make-order', auth, QuoteController.getQuotesToMakeOrder);

module.exports = router;