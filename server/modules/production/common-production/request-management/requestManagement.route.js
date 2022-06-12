const express = require('express');
const router = express.Router();
const RequestManagementController = require('./requestManagement.controller');
const { auth } = require(`../../../../middleware`);

router.get('/get-number-request', auth, RequestManagementController.getNumberRequest)
router.post('/', auth, RequestManagementController.createRequest);
router.get('/', auth, RequestManagementController.getAllRequestByCondition);
router.get('/:id', auth, RequestManagementController.getRequestById);
router.patch('/:id', auth, RequestManagementController.editRequest);

module.exports = router;
