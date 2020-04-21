const express = require("express");
const router = express.Router();
const ComponentDefaultController = require('./providingComponent.controller');
const { auth } = require('../../../middleware');

router.get("/", auth, ComponentDefaultController.get);
router.post("/paginate", auth, ComponentDefaultController.getPaginate);
router.post("/", auth, ComponentDefaultController.create);
router.get("/:id", auth, ComponentDefaultController.show);
router.patch("/:id", auth, ComponentDefaultController.edit);
router.delete("/:id", auth, ComponentDefaultController.delete);

module.exports = router;
