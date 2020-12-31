const express = require('express');
const router = express.Router();
const AdminDepartmentController = require('./adminDepartment.controller');
const { auth } = require(`../../../../middleware`);

router.post('/', auth, AdminDepartmentController.createAdminDepartment);
router.patch('/:id', auth, AdminDepartmentController.editAdminDepartment);
router.get('/', auth, AdminDepartmentController.getAllAdminDepartments);

module.exports = router;