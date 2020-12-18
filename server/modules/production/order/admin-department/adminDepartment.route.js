const express = require('express');
const router = express.Router();
const AdminDepartmentController = require('./adminDepartment.controller');
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

router.post('/', auth, AdminDepartmentController.createAdminDepartment);
router.patch('/:id', auth, AdminDepartmentController.editAdminDepartment);
router.get('/', auth, AdminDepartmentController.getAllAdminDepartments);

module.exports = router;