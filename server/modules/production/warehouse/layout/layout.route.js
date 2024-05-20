const express = require('express');
const router = express.Router();
const LayoutController = require('./layout.controller');
const { auth } = require('../../../../middleware');

router.get('/', LayoutController.getAllLayouts);

module.exports = router;