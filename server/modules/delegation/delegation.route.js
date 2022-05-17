const express = require('express');
const router = express.Router();
const DelegationController = require('./delegation.controller');
const { auth } = require(`../../middleware`);

router.get('/delegations', auth, DelegationController.getDelegations);
router.get('/delegations/:id', auth, DelegationController.getDelegationById);
router.post('/delegations', auth, DelegationController.createDelegation);
router.patch('/delegations/:id', auth, DelegationController.editDelegation);
router.delete('/delegations', auth, DelegationController.deleteDelegations);
router.patch('/delegations', auth, DelegationController.revokeDelegation);

module.exports = router;

