const express = require('express');
const router = express.Router();
const { auth } = require('../../../middleware/index');
const GoodController = require('./good.controller');

router.get('/', auth, GoodController.getGoodsByType);

module.exports = router;