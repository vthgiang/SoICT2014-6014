const express = require("express");
const router = express.Router();
const DepartmentController = require('./department.controller');

router.get("/", DepartmentController.get);
router.post("/", DepartmentController.create);
router.get("/:id", DepartmentController.show);
router.patch("/:id", DepartmentController.edit);
router.delete("/:id", DepartmentController.delete);

module.exports = router;
