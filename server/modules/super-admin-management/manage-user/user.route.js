const express = require("express");
const router = express.Router();
const UserController = require('./user.controller');

router.get("/company/:idCompany", UserController.get);
router.post("/", UserController.create);
router.get("/:id", UserController.show);
router.patch("/:id", UserController.edit);
router.delete("/:id", UserController.delete);

module.exports = router;
