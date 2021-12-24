const express = require('express');
const router = express.Router();
const SuppliesController = require('./supplies.controller');
const { auth } = require(`../../../middleware`);

router.get('/supplies', auth, SuppliesController.searchSupplies);
router.post('/supplies', auth, SuppliesController.createSupplies);
router.patch('/supplies/:id',auth, SuppliesController.updateSupplies);
router.delete('/supplies',auth, SuppliesController.deleteSupplies);
router.get('/supplies/:id',auth, SuppliesController.getSuppliesById);

module.exports = router;