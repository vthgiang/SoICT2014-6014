const express = require("express");
const router = express.Router();
const OrganizationalUnitController = require('./organizationalUnit.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, OrganizationalUnitController.getOrganizationalUnits);
router.get("/:id", auth, OrganizationalUnitController.getOrganizationalUnit);
router.get('/:role/get-as-tree', auth, OrganizationalUnitController.getChildrenOfOrganizationalUnitsAsTree);

router.post("/", auth, OrganizationalUnitController.createOrganizationalUnit);

router.patch("/:id", auth, OrganizationalUnitController.editOrganizationalUnit);

router.delete("/:id", auth, OrganizationalUnitController.deleteOrganizationalUnit);

module.exports = router;
