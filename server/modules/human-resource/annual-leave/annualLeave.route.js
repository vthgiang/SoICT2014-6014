const express = require("express");
const router = express.Router();

const AnnualLeaveController = require("./annualLeave.controller");
const { auth } = require(`../../../middleware`);


router.get('/annualLeaves', auth, AnnualLeaveController.searchAnnualLeaves);


router.post('/annualLeaves', auth, AnnualLeaveController.createAnnualLeave);

router.patch('/annualLeaves/:id', auth, AnnualLeaveController.updateAnnualLeave);
router.delete('/annualLeaves/:id', auth, AnnualLeaveController.deleteAnnualLeave);

// Import nghỉ phép
router.post('/annualLeaves/import', auth, AnnualLeaveController.importAnnualLeave);

router.post('/annualLeaves/:id/request-to-change', auth, AnnualLeaveController.requestToChangeAnnuaLeave);

module.exports = router;