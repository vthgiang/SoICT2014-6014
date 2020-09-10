const express = require("express");
const router = express.Router();
const {
    auth,
    uploadFile
} = require('../../../middleware');
const EmployeeController = require("./profile.controller");
const data = [{
        name: 'fileAvatar',
        path: '/human-resource/avatars'
    },
    {
        name: 'fileDegree',
        path: '/human-resource/degrees'
    },
    {
        name: 'fileCertificate',
        path: '/human-resource/certificates'
    },
    {
        name: 'fileContract',
        path: '/human-resource/contracts'
    },
    {
        name: 'file',
        path: '/human-resource/files'
    }
]

/**
 * Lấy thông tin cá nhân
 */
router.get('/:id', auth, EmployeeController.getEmployeeProfile);

/**
 * Cập nhật thông tin cá nhân
 */
router.patch('/:userId', auth, uploadFile([{
    name: 'fileAvatar',
    path: '/human-resource/avatars'
}], 'single'), EmployeeController.updatePersonalInformation);

/**
 * Lấy danh sách nhân viên
 */
router.get('/', auth, EmployeeController.searchEmployeeProfiles);

/**
 * Thêm mới một nhân viên
 */
router.post('/', auth, uploadFile(data, 'fields'), EmployeeController.createEmployee);

/**
 * Cập nhật thông tin nhân viên theo id
 */
router.put('/:id', auth, uploadFile(data, 'fields'), EmployeeController.updateEmployeeInformation);

/**
 * Xoá thông tin nhân viên
 */
router.delete('/:id', auth, EmployeeController.deleteEmployee);

// Import thông tin nhân viên
router.post('/import', auth, EmployeeController.importEmployees);


module.exports = router;