const express = require('express');
const router = express.Router();
const SLAController = require('./sla.controller');
const { auth } = require(`../../../../middleware`);

router.post('/', auth, SLAController.createNewSLA);
router.patch('/:id', auth, SLAController.editSLAByCode);
router.get('/', auth, SLAController.getAllSLAs);
router.get('/check-code', auth, SLAController.checkAvailabledCode);
router.get('/get-by-code', auth, SLAController.getSLAByCode);
router.get('/get-by-good-id', auth, SLAController.getSlaByGoodsId)
router.get('/:id', auth, SLAController.getSLAById);
router.patch('/disable/:id', auth, SLAController.disableSLAById);
router.delete("/", auth, SLAController.deleteSLA)

module.exports = router;