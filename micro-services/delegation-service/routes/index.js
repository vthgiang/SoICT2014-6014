const express = require('express');
const router = express.Router();
const DelegationController = require('../controllers');
const { auth } = require('../middleware/index');

router.get('/delegations', auth, DelegationController.getDelegations);
router.get('/delegations/tasks', auth, DelegationController.getDelegations);
router.get('/delegations/:id', auth, DelegationController.getDelegationById);
router.post('/delegations', auth, DelegationController.createDelegation);
router.patch('/delegations/:id', auth, DelegationController.editDelegation);
router.delete('/delegations', auth, DelegationController.deleteDelegations);
router.patch('/delegations', auth, DelegationController.revokeDelegation);
router.patch('/delegations-confirm', auth, DelegationController.confirmDelegation);
router.patch('/delegations-reject', auth, DelegationController.rejectDelegation);
router.get('/delegations-receive', auth, DelegationController.getDelegationsReceive);
router.get('/delegations-receive/tasks', auth, DelegationController.getDelegationsReceiveTask);
router.post('/delegations-tasks', auth, DelegationController.createTaskDelegation);
router.patch('/delegations-tasks/:id', auth, DelegationController.editTaskDelegation);
router.delete('/delegations-tasks', auth, DelegationController.deleteTaskDelegations);
router.patch('/delegations-tasks', auth, DelegationController.revokeTaskDelegation);


module.exports = router;
