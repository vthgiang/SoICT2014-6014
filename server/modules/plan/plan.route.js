const express = require('express');
const router = express.Router();
const PlanController = require('./plan.controller');
const { auth } = require('../../middleware');

router.get('/', auth, PlanController.getPlans);
router.get('/:id', auth, PlanController.getPlanById);
router.post('/', auth, PlanController.createPlan);
router.patch('/:id', auth, PlanController.editPlan);
router.delete('/:id', auth, PlanController.deletePlan);

module.exports = router;

