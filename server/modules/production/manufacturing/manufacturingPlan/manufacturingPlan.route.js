const express = require('express');
const router = express.Router();
const { auth } = require(`../../../../middleware`);
const ManufacturingPlanController = require('./manufacturingPlan.controller');

router.post('/', auth, ManufacturingPlanController.createManufacturingPlan);
// Lấy danh sách kế hoạch theo role truyền vào
router.get('/', auth, ManufacturingPlanController.getAllManufacturingPlans);
router.get('/:id', auth, ManufacturingPlanController.getManufacturingPlanById);
router.patch('/:id', auth, ManufacturingPlanController.editManufacturingPlan);

// Lấy ra danh sách người dùng có quyền duyệt kế hoạch theo currentRole (Quản đốc nhà máy hiện tại)
router.get('/get-approvers-of-plan/:id', auth, ManufacturingPlanController.getApproversOfPlan);

module.exports = router;