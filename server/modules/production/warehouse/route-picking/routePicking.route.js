const express = require('express');
const router = express.Router();
const RoutePickingController = require('./routePicking.controller');
const { auth } = require(`../../../../middleware`);

router.get('/', auth, RoutePickingController.getAllChemins);
router.get('/chemin-detail/:id', auth, RoutePickingController.getChemin);
module.exports = router;
