const express = require("express");
const router = express.Router();
const CompanyControllers = require('./company.controller');
const { auth,uploadFile } = require(`../../../middleware`);


// Các route về thêm sửa xóa công ty

router.get("/companies", auth, CompanyControllers.getAllCompanies);
router.get("/companies/:companyId", auth, CompanyControllers.getCompany);

router.post("/companies", auth, CompanyControllers.createCompany);

router.patch("/companies/:companyId", auth, CompanyControllers.editCompany);


// Lấy thông tin cấu hình file import theo id

router.get('/data-import-configurations', auth, CompanyControllers.getImportConfiguration);


// Tạo mới thông tin cấu hình file import

router.post('/data-import-configurations', auth, CompanyControllers.createImportConfiguration);


// Chỉnh sửa thông tin cấu hình file import theo id

router.patch('/data-import-configurations/:id', auth, CompanyControllers.editImportConfiguration);

router.patch('/organizationalUnitImage', auth, uploadFile([{name:'organizationalUnitImage', path:'/Unit/image'}], 'fields'), CompanyControllers.editCompanyOrgInformation);
router.get('/organizationalUnitImage', auth, CompanyControllers.getCompanyInformation);

router.post('/request-service', CompanyControllers.requestService)


module.exports = router;
