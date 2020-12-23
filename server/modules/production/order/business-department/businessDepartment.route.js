const express = require('express');
const router = express.Router();
const BusinessDepartmentController = require('./businessDepartment.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

router.post('/', auth, BusinessDepartmentController.createBusinessDepartment);
router.patch('/:id', auth, BusinessDepartmentController.editBusinessDepartment);
router.get('/', auth, BusinessDepartmentController.getAllBusinessDepartments);

module.exports = router;