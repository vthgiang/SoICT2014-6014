const express = require("express");
const router = express.Router();
const DepartmentController = require('./department.controller');
const { auth } = require('../../../middleware/auth.middleware');

router.get("/company/:id", auth, DepartmentController.get);
router.post("/", auth, DepartmentController.create);
router.get("/:id", auth, DepartmentController.show);
router.patch("/:id", auth, DepartmentController.edit);
router.delete("/:id", auth, DepartmentController.delete);

module.exports = router;
