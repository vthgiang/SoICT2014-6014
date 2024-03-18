const express = require('express');
const router = express.Router();

router.use('/contract', require('./contract'));
router.use('/package', require('./package'));
router.use('/tag', require('./tag'));

module.exports = router;
