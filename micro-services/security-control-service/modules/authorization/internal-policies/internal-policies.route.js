const express = require('express');
const router = express.Router();
const InternalPoliciesController = require('./internal-policies.controller');
const { auth } = require(`../../../middleware`);

router.post('/internal-policies', auth, InternalPoliciesController.create);
router.get('/internal-policies', auth, InternalPoliciesController.findAll);
router.get('/internal-policies/:id', auth, InternalPoliciesController.findOne);
router.patch('/internal-policies/:id', auth, InternalPoliciesController.update);
router.delete('/internal-policies/:id', auth, InternalPoliciesController.remove);

module.exports = router;

