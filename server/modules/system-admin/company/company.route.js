const express = require("express");
const router = express.Router();
const CompanyControllers = require('./company.controller');
const { auth } = require('../../../middleware');

// Các route về thêm sửa xóa công ty
router.get("/", auth, CompanyControllers.getAllCompanies);
router.post("/", auth, CompanyControllers.createCompany);
router.get("/:id", auth, CompanyControllers.getCompany);
router.patch("/:id", auth, CompanyControllers.editCompany);
router.delete("/:id", auth, CompanyControllers.deleteCompany);

// Các route về thêm xóa link và component cho company
router.get("/:id/links-list", auth, CompanyControllers.getCompanyLinks);
router.get("/:id/components-list", auth, CompanyControllers.getCompanyComponents);
router.post("/:id/add-new-link", auth, CompanyControllers.addCompanyLink);
router.delete("/:id/delete-link/:linkId", auth, CompanyControllers.deleteCompanyLink);
router.post("/:id/add-new-component", auth, CompanyControllers.addCompanyComponent);
router.delete("/:id/delete-component/:componentId", auth, CompanyControllers.deleteCompanyComponent);

//Lấy tất cả các category link
router.get("/link-categories", auth, CompanyControllers.getAllLinkCategories);

// Khác ----------
router.get("/:id/links", auth, CompanyControllers.getCompanyLinks);

/**
 * Lấy thông tin cấu hình file import theo id
 */
router.get('/import-file/:type', auth, CompanyControllers.getImportConfiguraion);

/**
 * Tạo mới thông tin cấu hình file import
 */
router.post('/import-file', auth, CompanyControllers.createImportConfiguraion);

/**
 * Chỉnh sửa thông tin cấu hình file import theo id
 */
router.patch('/import-file/:id', auth, CompanyControllers.editImportConfiguraion);

module.exports = router;
