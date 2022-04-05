const express = require('express');
const router = express.Router();
const AllocationController = require('./allocation-history.controller');
const { auth } = require(`../../../middleware`);

router.get('/allocation', auth, AllocationController.searchAllocation);
router.post('/allocation', auth, AllocationController.createAllocations);
router.patch('/allocation/:id',auth, AllocationController.updateAllocation);
router.delete('/allocation',auth, AllocationController.deleteAllocations);
router.get('/allocation/:id',auth, AllocationController.getAllocationById);

module.exports = router;