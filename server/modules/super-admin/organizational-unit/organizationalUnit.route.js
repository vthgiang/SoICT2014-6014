const express = require("express");
const router = express.Router();
const DepartmentController = require('./organizationalUnit.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, DepartmentController.get);
router.post("/", auth, DepartmentController.create);
router.get("/:id", auth, DepartmentController.show);
router.patch("/:id", auth, DepartmentController.edit);
router.delete("/:id", auth, DepartmentController.delete);

router.get('/department-of-user/:id', auth, DepartmentController.getDepartmentOfUser);
router.get('/departments-that-user-is-dean/:id', auth, DepartmentController.getDepartmentsThatUserIsDean);

module.exports = router;
