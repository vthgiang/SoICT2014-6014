const express = require("express");
const router = express.Router();
const CompanyControllers = require('./company.controller');
const { auth } = require('../../../middleware');

// Các route về thêm sửa xóa công ty
router.get("/company/companies/companies", auth, CompanyControllers.getAllCompanies);
router.post("/company/companies/companies/create", auth, CompanyControllers.createCompany);
router.get("/company/companies/companies/:companyId", auth, CompanyControllers.getCompany);
router.patch("/company/companies/companies/:companyId", auth, CompanyControllers.editCompany);
router.delete("/company/companies/companies/:companyId", auth, CompanyControllers.deleteCompany);

// Các route về thêm xóa link và component cho company
router.get("/company/links/company-links/:companyId", auth, CompanyControllers.getCompanyLinks);
router.get("/company/components/company-components/:companyId", auth, CompanyControllers.getCompanyComponents);
router.post("/company/links/company-links/:companyId/add", auth, CompanyControllers.addCompanyLink);
router.delete("/company/links/company-links/:companyId/:linkId", auth, CompanyControllers.deleteCompanyLink);
router.post("/company/components/company-components/:companyId/add", auth, CompanyControllers.addCompanyComponent);
router.delete("/company/components/company-components/:companyId/:componentId", auth, CompanyControllers.deleteCompanyComponent);

//Lấy tất cả các category link
router.get("/link-categories", auth, CompanyControllers.getAllLinkCategories);

// Khác ----------
router.get("/:id/links", auth, CompanyControllers.getCompanyLinks);

/**
 * Lấy thông tin cấu hình file import theo id
 */
router.get('/company/import-configuraions/import-file/:type', auth, CompanyControllers.getImportConfiguraion);

/**
 * Tạo mới thông tin cấu hình file import
 */
router.post('/company/import-configuraions/import-file/create', auth, CompanyControllers.createImportConfiguraion);

/**
 * Chỉnh sửa thông tin cấu hình file import theo id
 */
router.patch('/company/import-configuraions/import-file/:id', auth, CompanyControllers.editImportConfiguraion);

module.exports = router;
