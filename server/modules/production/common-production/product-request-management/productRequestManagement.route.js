const express = require('express');
const router = express.Router();
const ProductRequestManagementController = require('./productRequestManagement.controller');
const { auth } = require(`../../../../middleware`);

router.get('/get-number-request', auth, ProductRequestManagementController.getNumberRequest)
router.post('/', auth, ProductRequestManagementController.createRequest);
router.get('/', auth, ProductRequestManagementController.getAllRequestByCondition);
router.get('/:id', auth, ProductRequestManagementController.getRequestById);
router.patch('/:id', auth, ProductRequestManagementController.editRequest);
router.patch('/edit-transportation/:id', auth, ProductRequestManagementController.editTransportationRequest);

module.exports = router;
