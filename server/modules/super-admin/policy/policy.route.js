const express = require('express');
const router = express.Router();
const PolicyController = require('./policy.controller');
const { auth } = require(`../../../middleware`);

router.get('/policies', auth, PolicyController.getPolicies);
router.get('/policies/:id', auth, PolicyController.getPolicyById);
router.post('/policies', auth, PolicyController.createPolicy);
router.patch('/policies/:id', auth, PolicyController.editPolicy);
router.delete('/policies', auth, PolicyController.deletePolicies);

module.exports = router;

