const express = require('express');
const router = express.Router();
const RoutePickingController = require('./routePicking.controller');
const { auth } = require(`../../../../middleware`);

router.get('/route', RoutePickingController.getAllRoutePickings);

router.get('/', auth, RoutePickingController.getAllChemins);
router.get('/chemin-detail/:id', auth, RoutePickingController.getChemin);
router.post('/simulate_wave', auth, RoutePickingController.createRoutePicking)
module.exports = router;
