const express = require('express');
const router = express.Router();
const ShipperController = require('./manageShipper.controller');
const { auth } = require(`../../../middleware`);

router.post('/', auth, ShipperController.createShipper);
router.get('/get-all', auth, ShipperController.getAllShipperWithCondition);
router.get('/get-all-not-confirm', auth, ShipperController.getDriverNotConfirm);
router.get('/calculate-salary', auth, ShipperController.calculateShipperSalary);
router.patch('/:id', auth, ShipperController.editDriverInfo);
router.get('/all-free-schedule', auth, ShipperController.getAllFreeShipperSchedule);
router.get('/all-free-for-journey', auth, ShipperController.getAllShipperAvailableForJourney);
router.get('/all-salary', auth, ShipperController.getAllShipperSalaryByCondition);
router.post('/save-salary', auth, ShipperController.saveSalary);

module.exports = router;