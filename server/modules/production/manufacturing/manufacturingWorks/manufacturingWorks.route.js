const express = require('express');
const router = express.Router();
const ManufacturingWorksController = require('./manufacturingWorks.controller');
const { auth } = require(`../../../../middleware`);


// Hàm get tất cả các nhân viên nhà máy theo currentRole quản lý nhà máy truyền vào query
router.get('/users', auth, ManufacturingWorksController.getUserByWorksManageRole);

router.post('/', auth, ManufacturingWorksController.createManufacturingWorks);
router.get('/', auth, ManufacturingWorksController.getAllManufacturingWorks);
router.get('/:id', auth, ManufacturingWorksController.getManufacturingWorksById);
router.get('/:id/get-employee-roles', auth, ManufacturingWorksController.getAllManufacturingEmployeeRoles);
router.delete('/:id', auth, ManufacturingWorksController.deleteManufacturingWorks);
router.patch('/:id', auth, ManufacturingWorksController.editManufacturingWorks);


module.exports = router;

