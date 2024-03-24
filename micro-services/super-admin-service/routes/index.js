const express = require('express');
const router = express.Router();

router.use(require('./api'));
router.use(require('./attribute'));
router.use(require('./link'));
router.use(require('./organizational-unit'));
router.use(require('./policy'));
router.use(require('./privilege'));
router.use(require('./role'));
router.use(require('./system'));
router.use(require('./user'));


module.exports = router;
