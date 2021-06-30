const express = require("express");
const router = express.Router();
const { auth } = require(`../../../middleware`);

const CrmUnitController = require('./crmUnit.controller');

router.get('/', auth, CrmUnitController.getCrmUnits);
router.post('/', auth, CrmUnitController.createCrmUnit);
router.delete('/:id', auth, CrmUnitController.deleteCrmUnit);

module.exports = router;