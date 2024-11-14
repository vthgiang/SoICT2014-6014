const express = require('express');
const router = express.Router();
const PolicyController = require('./policy.controller');
const { auth } = require(`../../../middleware`);

router.get('/policies', auth, PolicyController.getPolicies);
router.get('/policies-all', auth, PolicyController.getAllPolicies);
router.post('/policies', auth, PolicyController.createPolicy);

router.delete('/policies/:id', auth, PolicyController.deletePolicy);

module.exports = router;

