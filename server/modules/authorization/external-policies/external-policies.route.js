const express = require('express');
const router = express.Router();
const ExternalPoliciesController = require('./external-policies.controller');
const { auth } = require(`../../../middleware`);

router.post('/external-policies', auth, ExternalPoliciesController.create);
router.get('/external-policies', auth, ExternalPoliciesController.findAll);
router.get('/external-policies/:id', auth, ExternalPoliciesController.findOne);
router.patch('/external-policies/:id', auth, ExternalPoliciesController.update);
router.delete('/external-policies/:id', auth, ExternalPoliciesController.remove);

module.exports = router;
