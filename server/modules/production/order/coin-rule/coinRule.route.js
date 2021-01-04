const express = require('express');
const router = express.Router();
const CoinRuleController = require('./coinRule.controller');
const { auth } = require(`../../../../middleware`);

router.post('/', auth, CoinRuleController.createNewCoinRule)

module.exports = router;