const express = require("express");
const router = express.Router();
const OrganizationalUnitController = require('./organizationalUnit.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, OrganizationalUnitController.getAllOrganizationalUnits);
router.post("/", auth, OrganizationalUnitController.createOrganizationalUnit);
router.get("/:id", auth, OrganizationalUnitController.getOrganizationalUnit);
router.patch("/:id", auth, OrganizationalUnitController.editOrganizationalUnit);
router.delete("/:id", auth, OrganizationalUnitController.deleteOrganizationalUnit);

router.get('/department-of-user/:id', auth, OrganizationalUnitController.getOrganizationalUnitsOfUser);
router.get('/departments-that-user-is-dean/:id', auth, OrganizationalUnitController.getOrganizationalUnitsThatUserIsDean);

module.exports = router;
