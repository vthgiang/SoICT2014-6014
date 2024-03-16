const express = require('express');
const router = express.Router();

router.use(require('./asset'));
router.use(require('./asset-lot'));
router.use(require('./asset-type'));
router.use(require('./purchase-request'));
router.use(require('./use-request'));

module.exports = router;
