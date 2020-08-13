const express = require("express");
const router = express.Router();
const {
    auth
} = require('../../../middleware');

const AnnualLeaveController = require("./annualLeave.controller");


router.get('/annualLeaves', auth, AnnualLeaveController.searchAnnualLeaves);

router.post('/annualLeaves', auth, AnnualLeaveController.createAnnualLeave);

router.patch('/annualLeaves/:id', auth, AnnualLeaveController.updateAnnualLeave);
router.delete('/annualLeaves/:id', auth, AnnualLeaveController.deleteAnnualLeave);

module.exports = router;