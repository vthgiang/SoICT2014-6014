const express = require('express');
const router = express.Router();
const RoutePickingController = require('./routePicking.controller');
const { auth } = require(`../../../middleware`);

router.get('/getAllChemins', auth, RoutePickingController.getAllChemins);

module.exports = router;
