const express = require('express');
const router = express.Router();
const DashboardOrganizationalUnitController = require('./dashboard.controller');
const { auth } = require('../../../../middleware');

// Lấy các đơn vị con của một đơn vị và đơn vị đó
router.get(
  '/organizational-units/get-children-of-organizational-unit-as-tree',
  auth,
  DashboardOrganizationalUnitController.getChildrenOfOrganizationalUnitsAsTree
);
router.get('/allocation-assign-unit-result/:currentUserUnitId', auth, DashboardOrganizationalUnitController.getAllocationResultUnitKpi);
router.post('/allocation-assign-unit-result/save', auth, DashboardOrganizationalUnitController.handleSaveAllocationResultUnit);

module.exports = router;
