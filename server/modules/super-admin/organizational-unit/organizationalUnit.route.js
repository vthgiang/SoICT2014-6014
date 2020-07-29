const express = require("express");
const router = express.Router();
const OrganizationalUnitController = require('./organizationalUnit.controller');
const { auth } = require('../../../middleware');

router.get("/organizational-units", auth, OrganizationalUnitController.getOrganizationalUnits);
router.get('/organizational-units/:role/get-as-tree', auth, OrganizationalUnitController.getChildrenOfOrganizationalUnitsAsTree);


router.post("/organizational-units", auth, OrganizationalUnitController.createOrganizationalUnit);
router.get("/organizational-units/:id", auth, OrganizationalUnitController.getOrganizationalUnit);
router.patch("/organizational-units/:id", auth, OrganizationalUnitController.editOrganizationalUnit);
router.delete("/organizational-units/:id", auth, OrganizationalUnitController.deleteOrganizationalUnit);


module.exports = router;
