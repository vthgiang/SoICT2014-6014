const express = require("express");
const router = express.Router();
const DepartmentController = require('./department.controller');
const { auth } = require('../../../middleware');
const { createValidation } = require('./department.validation');

router.get("/", auth, DepartmentController.get);
router.post("/", auth, createValidation, DepartmentController.create);
router.get("/:id", auth, DepartmentController.show);
router.patch("/:id", auth, DepartmentController.edit);
router.delete("/:id", auth, DepartmentController.delete);

router.get('/department-of-user/:id', auth, DepartmentController.getDepartmentOfUser);

module.exports = router;
