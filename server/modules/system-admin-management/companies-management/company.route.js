const express = require("express");
const router = express.Router();
const CompanyController = require('./company.controller');
const { auth } = require('../../../middleware');

// Các route về thêm sửa xóa công ty
router.get("/", auth, CompanyController.get);
router.post("/paginate", auth, CompanyController.getPaginate);
router.post("/", auth, CompanyController.create);
router.get("/:id", auth, CompanyController.show);
router.patch("/:id", auth, CompanyController.edit);
router.delete("/:id", auth, CompanyController.delete);

// Các route về thêm xóa link và component cho company
router.get("/:id/links-list", auth, CompanyController.getLinksListOfCompany);
router.post("/:id/links-paginate/:page/:limit", auth, CompanyController.getLinksPaginateOfCompany);
router.get("/:id/components-list", auth, CompanyController.getComponentsListOfCompany);
router.post("/:id/components-paginate/:page/:limit", auth, CompanyController.getComponentsPaginateOfCompany);
router.post("/:id/add-new-link", auth, CompanyController.addNewLinkForCompany);
router.delete("/:id/delete-link/:linkId", auth, CompanyController.deleteLinkForCompany);
// router.post("/:id/add-new-component", auth, CompanyController.addNewComponentForCompany);
// router.delete("/:id/delete-component/:linkId", auth, CompanyController.deleteComponentForCompany);

// Khác ----------
router.get("/:id/links", auth, CompanyController.getLinksOfCompany);

module.exports = router;
