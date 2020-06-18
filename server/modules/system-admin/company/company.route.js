const express = require("express");
const router = express.Router();
const CompanyController = require('./company.controller');
const { auth } = require('../../../middleware');

// Các route về thêm sửa xóa công ty
router.get("/", auth, CompanyController.getAllCompanies);
router.post("/paginate", auth, CompanyController.getPaginatedCompanies);
router.post("/", auth, CompanyController.createCompany);
router.get("/:id", auth, CompanyController.getCompany);
router.patch("/:id", auth, CompanyController.editCompany);
router.delete("/:id", auth, CompanyController.deleteCompany);

// Các route về thêm xóa link và component cho company
router.get("/:id/links-list", auth, CompanyController.getCompanyLinks);
router.post("/:id/links-paginate/:page/:limit", auth, CompanyController.getPaginatedCompanyLinks);
router.get("/:id/components-list", auth, CompanyController.getCompanyComponents);
router.post("/:id/components-paginate/:page/:limit", auth, CompanyController.getPaginatedCompanyComponents);
router.post("/:id/add-new-link", auth, CompanyController.addCompanyLink);
router.delete("/:id/delete-link/:linkId", auth, CompanyController.deleteCompanyLink);
router.post("/:id/add-new-component", auth, CompanyController.addCompanyComponent);
router.delete("/:id/delete-component/:componentId", auth, CompanyController.deleteCompanyComponent);
//Lấy tất cả các category link
router.get("/link-categories", auth, CompanyController.getAllLinkCategories);

// Khác ----------
router.get("/:id/links", auth, CompanyController.getCompanyLinks);

/**
 * Lấy thông tin cấu hình file import theo id
 */
router.get('/import-file/:type', auth, CompanyController.getImportConfiguraion);

/**
 * Tạo mới thông tin cấu hình file import
 */
router.post('/import-file', auth, CompanyController.createImportConfiguraion);

/**
 * Chỉnh sửa thông tin cấu hình file import theo id
 */
router.patch('import-file/:id', auth, CompanyController.editImportConfiguraion);

module.exports = router;
