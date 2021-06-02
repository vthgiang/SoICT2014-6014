const express = require("express");
const router = express.Router();
const { auth } = require(`../../../middleware`);

const CustomerRankPointController = require('./customerRankPoint.controller');

router.get('/', auth, CustomerRankPointController.getCustomerRankPoints);
router.get('/:id', auth, CustomerRankPointController.getCustomerRankPointById);
router.post('/', auth, CustomerRankPointController.createCustomerRankPoint);
router.patch('/:id', auth, CustomerRankPointController.editCustomerRankPoint);
router.delete('/:id', auth, CustomerRankPointController.deleteCustomerRankPoint);

module.exports = router;
