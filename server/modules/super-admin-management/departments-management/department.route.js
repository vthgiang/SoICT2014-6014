const express = require("express");
const router = express.Router();
const DepartmentController = require('./department.controller');
const { auth, acccess_department } = require('../../../middleware/auth.middleware');
const { createValidation } = require('./department.validation');

router.get("/", auth, acccess_department, DepartmentController.get);
router.post("/", auth, acccess_department, createValidation, DepartmentController.create);
router.get("/:id", auth, acccess_department, DepartmentController.show);
router.patch("/:id", auth, acccess_department, DepartmentController.edit);
router.delete("/:id", auth, acccess_department, DepartmentController.delete);

router.get('/department-of-user/:id', DepartmentController.getDepartmentOfUser);

module.exports = router;
