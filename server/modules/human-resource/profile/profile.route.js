const express = require("express");
const router = express.Router();
const {
    auth,
    uploadFile
} = require('../../../middleware');
const EmployeeController = require("./profile.controller");

/**
 * Lấy thông tin cá nhân
 */
router.get('/personals/:id', auth, EmployeeController.getEmployeeProfile);

/**
 * Cập nhật thông tin cá nhân
 */
router.patch('/personals/:id', auth, uploadFile('fileAvatar', '/human-resource/avatars'), EmployeeController.updatePersonalInformation);



/**
 * Lấy danh sách nhân viên
 */
router.post('/paginate', auth, EmployeeController.searchEmployeeProfiles);

/**
 * Thêm mới một nhân viên
 */
router.post('/', auth, EmployeeController.uploadMultipleFile, EmployeeController.createEmployee);

/**
 * Cập nhật thông tin nhân viên theo id
 */
router.put('/update/:id', auth, EmployeeController.updateEmployeeInformation);

/**
 * Xoá thông tin nhân viên
 */
router.delete('/:id', auth, EmployeeController.deleteEmployee);

// Kiểm tra sự tồn tại của MSNV
// router.get('/checkMSNV/:employeeNumber', auth, EmployeeController.checkEmployeeExisted);

// Kiểm tra sự tồn tại của email công ty
// router.get('/checkEmail/:email', auth, EmployeeController.checkEmployeeCompanyEmailExisted);







// Cập nhật Avatar của nhân viên theo mã nhân viên
// router.patch('/avatar/:employeeNumber', auth, EmployeeController.uploadAvatar, EmployeeController.updateEmployeeAvatar);

// Cập nhật(thêm) thông tin hợp đồng lao động theo MSNV
// router.patch('/contract/:employeeNumber', auth, EmployeeController.uploadContract, EmployeeController.updateEmployeeContract);

// Cập nhật(thêm) thông tin chứng chỉ theo MSNV
// router.patch('/certificateShort/:employeeNumber', auth, EmployeeController.uploadCertificateshort, EmployeeController.updateEmployeeCertificates);

// Cập nhật(thêm) thông tin bằng cấp theo MSNV
// router.patch('/certificate/:employeeNumber', auth, EmployeeController.uploadCertificate, EmployeeController.updateCertificate);

// Cập nhật(thêm) thông tin file đính kèm
// router.patch('/file/:employeeNumber', auth, EmployeeController.uploadFile, EmployeeController.updateFile);



// Kiểm tra sự tồn tại của MSNV
router.post('/checkArrayMSNV', auth, EmployeeController.checkEmployeesExisted);

module.exports = router;