const express = require('express');
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);;
const LotController = require('./inventory.controller');

router.get('/', auth, LotController.getAllLots);
router.get('/get-lot-by-good', auth, LotController.getLotsByGood);
router.post('/create-or-edit-lot', auth, LotController.createOrUpdateLots);
router.post('/delete-many', auth, LotController.deleteManyLots);
router.get('/get-detail/:id', auth, LotController.getDetailLot);
router.patch('/:id', auth, LotController.editLot);

module.exports = router