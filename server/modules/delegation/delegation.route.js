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
router.patch('/delegations-confirm', auth, DelegationController.confirmDelegation);
router.patch('/delegations-reject', auth, DelegationController.rejectDelegation);
router.get('/delegations-receive', auth, DelegationController.getDelegationsReceive);

router.get('/delegations-tasks', auth, DelegationController.getDelegations);
router.get('/delegations-receive/tasks', auth, DelegationController.getDelegationsReceiveTask);
router.post('/delegations-tasks', auth, DelegationController.createTaskDelegation);
router.patch('/delegations-tasks/:id', auth, DelegationController.editTaskDelegation);
router.delete('/delegations-tasks', auth, DelegationController.deleteTaskDelegations);
router.patch('/delegations-tasks', auth, DelegationController.revokeTaskDelegation);

router.get('/delegations-services', auth, DelegationController.getDelegationsService);
router.post('/delegations-services', auth, DelegationController.createServiceDelegation);
router.patch('/delegations-services/:id', auth, DelegationController.editServiceDelegation);
router.delete('/delegations-services', auth, DelegationController.deleteServiceDelegations);
router.patch('/delegations-services', auth, DelegationController.revokeServiceDelegation);


module.exports = router;

