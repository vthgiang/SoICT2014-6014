const express = require("express");
const router = express.Router();
const CompanyControllers = require('./company.controller');
const { auth } = require('../../../middleware');

// Các route về thêm sửa xóa công ty
router.get("/companies", auth, CompanyControllers.getAllCompanies);
router.post("/companies", auth, CompanyControllers.createCompany);
router.get("/companies/:companyId", auth, CompanyControllers.getCompany);
router.patch("/companies/:companyId", auth, CompanyControllers.editCompany);
router.delete("/companies/:companyId", auth, CompanyControllers.deleteCompany);

// Lấy thông tin cấu hình file import theo id
router.get('/data-import-configurations', auth, CompanyControllers.getImportConfiguraion);

// Tạo mới thông tin cấu hình file import
router.post('/data-import-configurations', auth, CompanyControllers.createImportConfiguraion);

// Chỉnh sửa thông tin cấu hình file import theo id
router.patch('/data-import-configurations/:id', auth, CompanyControllers.editImportConfiguraion);

module.exports = router;
