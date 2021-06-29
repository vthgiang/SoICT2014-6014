const express = require("express");
const router = express.Router();
const { auth } = require(`../../../middleware`);

const CrmUnitKPIController = require('./crmUnitKPI.controller');

router.get('/', auth, CrmUnitKPIController.getCrmUnitKPI);
router.patch('/:id', auth, CrmUnitKPIController.editCrmUnitKPI);
module.exports = router;
