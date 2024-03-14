const express = require('express');
const router = express.Router();
const PolicyController = require('../controllers/policy.controller');
const {auth} = require('../middleware/index');

router.get('/policies', auth, PolicyController.getPolicies);
router.get('/policies/:id', auth, PolicyController.getPolicyById);
router.post('/policies', auth, PolicyController.createPolicy);
router.patch('/policies/:id', auth, PolicyController.editPolicy);
router.delete('/policies', auth, PolicyController.deletePolicies);

router.get('/policies-delegation', auth, PolicyController.getPoliciesDelegation);
router.get('/policies-delegation/:id', auth, PolicyController.getPolicyByIdDelegation);
router.post('/policies-delegation', auth, PolicyController.createPolicyDelegation);
router.patch('/policies-delegation/:id', auth, PolicyController.editPolicyDelegation);
router.delete('/policies-delegation', auth, PolicyController.deletePoliciesDelegation);

module.exports = router;

