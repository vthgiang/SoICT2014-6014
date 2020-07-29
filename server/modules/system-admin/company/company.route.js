const express = require("express");
const router = express.Router();
const CompanyControllers = require('./company.controller');
const { auth } = require('../../../middleware');

// Các route về thêm sửa xóa công ty
router.get("/companies", auth, CompanyControllers.getAllCompanies);
router.post("/companies/create", auth, CompanyControllers.createCompany);
router.get("/companies/:companyId", auth, CompanyControllers.getCompany);
router.patch("/companies/:companyId", auth, CompanyControllers.editCompany);
router.delete("/companies/:companyId", auth, CompanyControllers.deleteCompany);

// Các route về thêm xóa link và component cho company
router.get("/links/company-links/:companyId", auth, CompanyControllers.getCompanyLinks);
router.get("/components/company-components/:companyId", auth, CompanyControllers.getCompanyComponents);
router.post("/links/company-links/:companyId/add", auth, CompanyControllers.addCompanyLink);
router.delete("/links/company-links/:companyId/:linkId", auth, CompanyControllers.deleteCompanyLink);
router.post("/components/company-components/:companyId/add", auth, CompanyControllers.addCompanyComponent);
router.delete("/components/company-components/:companyId/:componentId", auth, CompanyControllers.deleteCompanyComponent);

//Lấy tất cả các category link
router.get("/link-categories", auth, CompanyControllers.getAllLinkCategories);

// Khác ----------
router.get("/:id/links", auth, CompanyControllers.getCompanyLinks);

/**
 * Lấy thông tin cấu hình file import theo id
 */
router.get('/import-configuraions/import-file/:type', auth, CompanyControllers.getImportConfiguraion);

/**
 * Tạo mới thông tin cấu hình file import
 */
router.post('/import-configuraions/import-file/create', auth, CompanyControllers.createImportConfiguraion);

/**
 * Chỉnh sửa thông tin cấu hình file import theo id
 */
router.patch('/import-configuraions/import-file/:id', auth, CompanyControllers.editImportConfiguraion);

module.exports = router;
